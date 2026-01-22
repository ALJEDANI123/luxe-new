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
            console.log('HTML length:', pageHtml.length);
            console.log('Sample HTML (first 500 chars):', pageHtml.substring(0, 500));
            console.log('Searching for il_794xN in HTML:', pageHtml.includes('il_794xN'));
            
            // Try multiple patterns
            const pattern1 = pageHtml.match(/https:\/\/i\.etsystatic\.com\/\d+\/r\/il\/[a-f0-9]+\/\d+\/il_794xN\.\d+_[a-z0-9]+\.jpg/gi);
            const pattern2 = pageHtml.match(/"(https:\/\/i\.etsystatic\.com[^"]+il_794xN[^"]+\.jpg)"/gi);
            const pattern3 = pageHtml.match(/i\.etsystatic\.com[^\s"']+il_794xN[^\s"']+\.jpg/gi);
            
            console.log('Pattern 1 matches:', pattern1?.length || 0);
            console.log('Pattern 2 matches:', pattern2?.length || 0);
            console.log('Pattern 3 matches:', pattern3?.length || 0);
            
            if (pattern1) extractedImages.push(...pattern1);
            if (pattern2) extractedImages.push(...pattern2.map(s => s.replace(/"/g, '')));
            if (pattern3) extractedImages.push(...pattern3.map(url => url.startsWith('http') ? url : `https://${url}`));
            
            // Remove duplicates
            extractedImages = [...new Set(extractedImages)];
            console.log('Total extracted images:', extractedImages.length);
            if (extractedImages.length > 0) {
                console.log('First image:', extractedImages[0]);
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