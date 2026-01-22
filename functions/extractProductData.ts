import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (user.role !== 'admin') {
            return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
        }

        const { productUrl } = await req.json();

        if (!productUrl) {
            return Response.json({ error: 'Product URL is required' }, { status: 400 });
        }

        // Fetch page HTML
        const pageResponse = await fetch(productUrl);
        const pageHtml = await pageResponse.text();
        
        let extractedImages = [];
        
        // For Etsy
        if (productUrl.includes('etsy.com')) {
            // Search for all il_794xN image patterns
            const allMatches = pageHtml.match(/i\.etsystatic\.com[^\s"'<>)]+il_794xN[^\s"'<>)]+\.jpg/gi);
            if (allMatches) {
                extractedImages = allMatches.map(url => {
                    // Ensure https://
                    return url.startsWith('http') ? url : `https://${url}`;
                });
                // Remove duplicates
                extractedImages = [...new Set(extractedImages)];
            }
        }
        
        // For Amazon: Look for Amazon image URLs
        if (productUrl.includes('amazon.com')) {
            const amazonImageRegex = /https:\/\/(images-na\.ssl-images-amazon\.com|m\.media-amazon\.com)\/images\/[^"'\s]+\._[^"'\s]+\.jpg/g;
            const matches = pageHtml.match(amazonImageRegex);
            if (matches) {
                extractedImages = [...new Set(matches)];
            }
        }
        
        const result = await base44.integrations.Core.InvokeLLM({
            prompt: `Extract product information from this product page URL: ${productUrl}

Visit the page and extract:
- title: Product name
- subtitle: Product description (150-200 characters)
- price: Number only (e.g., 26.46)
- oldPrice: If on sale
- rating: 0-5 stars
- reviewsCount: Number of reviews
- marketplace: Etsy, Amazon, or eBay
- tags: Array of relevant tags

Return ONLY the data, do NOT include images array as I will add it separately.`,
            add_context_from_internet: true,
            response_json_schema: {
                type: "object",
                properties: {
                    title: { type: "string" },
                    subtitle: { type: "string" },
                    price: { type: "number" },
                    oldPrice: { type: ["number", "null"] },
                    rating: { type: "number" },
                    reviewsCount: { type: "number" },
                    marketplace: { type: "string" },
                    primeEligible: { type: "boolean" },
                    tags: {
                        type: "array",
                        items: { type: "string" }
                    }
                }
            }
        });
        
        // Add the extracted images
        result.images = extractedImages;

        return Response.json({ 
            success: true,
            data: result,
            affiliateUrl: productUrl
        });

    } catch (error) {
        console.error('Error extracting product data:', error);
        return Response.json({ 
            success: false,
            error: error.message 
        }, { status: 500 });
    }
});