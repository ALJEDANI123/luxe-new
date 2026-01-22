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

        // First, fetch the actual page HTML to extract real image URLs
        const pageResponse = await fetch(productUrl);
        const pageHtml = await pageResponse.text();
        
        const result = await base44.integrations.Core.InvokeLLM({
            prompt: `You are a product data extractor. Extract detailed product information from this product page HTML.

CRITICAL INSTRUCTIONS FOR IMAGE EXTRACTION:
- Look for image URLs in the HTML source code
- For Etsy: Look for "i.etsystatic.com" image URLs
- For Amazon: Look for "m.media-amazon.com" or "images-na.ssl-images-amazon.com" URLs
- Extract ONLY REAL, COMPLETE image URLs that start with https://
- Do NOT return placeholder or example URLs
- Extract ALL images including thumbnails, main images, and zoom images
- Make sure each URL is a valid, complete URL

Product HTML:
${pageHtml.substring(0, 50000)}

Extract:
- title: Full product name
- subtitle: Product description or subtitle from the page
- price: Current price as number (e.g., 15.99 not "$15.99")
- oldPrice: Original price if on sale (as number)
- rating: Star rating as decimal number 0-5 (e.g., 4.7)
- reviewsCount: Total number of customer reviews/ratings as integer
- images: Array of REAL, COMPLETE image URLs extracted from the HTML (look for etsystatic, media-amazon, etc.)
- marketplace: Store name (Amazon, eBay, Etsy, etc.)
- primeEligible: true if Amazon Prime available
- tags: Product categories/tags as array

CRITICAL: For images array, return ONLY real URLs that you found in the HTML. If you can't find real image URLs, return an empty array.`,
            add_context_from_internet: false,
            response_json_schema: {
                type: "object",
                properties: {
                    title: { type: "string" },
                    subtitle: { type: "string" },
                    price: { type: "number" },
                    oldPrice: { type: ["number", "null"] },
                    rating: { type: "number" },
                    reviewsCount: { type: "number" },
                    images: { 
                        type: "array",
                        items: { type: "string" }
                    },
                    marketplace: { type: "string" },
                    primeEligible: { type: "boolean" },
                    tags: {
                        type: "array",
                        items: { type: "string" }
                    }
                }
            }
        });

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