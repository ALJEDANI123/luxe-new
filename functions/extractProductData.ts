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

        // Fetch the actual product page HTML
        const pageResponse = await fetch(productUrl);
        const html = await pageResponse.text();
        
        // Extract images from HTML using regex
        const images = [];
        
        // Look for og:image meta tags
        const ogImageRegex = /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/gi;
        let match;
        while ((match = ogImageRegex.exec(html)) !== null) {
            images.push(match[1]);
        }
        
        // Look for Etsy product images
        const etsyImageRegex = /https:\/\/i\.etsystatic\.com\/[^\s"'<>]+/gi;
        while ((match = etsyImageRegex.exec(html)) !== null) {
            if (!images.includes(match[0])) {
                images.push(match[0]);
            }
        }
        
        // Look for Amazon product images
        const amazonImageRegex = /https:\/\/m\.media-amazon\.com\/images\/I\/[^\s"'<>]+/gi;
        while ((match = amazonImageRegex.exec(html)) !== null) {
            if (!images.includes(match[0])) {
                images.push(match[0]);
            }
        }
        
        // Look for eBay images
        const ebayImageRegex = /https:\/\/i\.ebayimg\.com\/[^\s"'<>]+/gi;
        while ((match = ebayImageRegex.exec(html)) !== null) {
            if (!images.includes(match[0])) {
                images.push(match[0]);
            }
        }
        
        // Use LLM to extract product data (without images)
        const result = await base44.integrations.Core.InvokeLLM({
            prompt: `Extract product information from: ${productUrl}

Return:
- title: Product name
- subtitle: Product description (150-200 characters)
- price: Number only
- oldPrice: If on sale, otherwise null
- rating: 0-5 stars
- reviewsCount: Number of reviews
- marketplace: Etsy, Amazon, or eBay
- primeEligible: true only if Amazon Prime
- tags: 5-8 relevant keywords`,
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
                    tags: { type: "array", items: { type: "string" } }
                }
            }
        });
        
        // Add extracted images to result
        result.images = images.slice(0, 5);

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