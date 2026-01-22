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

        const result = await base44.integrations.Core.InvokeLLM({
            prompt: `Extract product information from this URL: ${productUrl}

You must visit the actual product page and extract REAL data.

CRITICAL INSTRUCTIONS:
1. Extract the REAL product title exactly as shown on the page
2. Extract the ACTUAL price (number only, no currency symbols)
3. Extract the REAL rating and review count from the page
4. Extract product description/subtitle
5. MOST IMPORTANT: Extract ALL REAL product image URLs from the page
   - For Etsy: Look for high-resolution images from i.etsystatic.com domain
   - For Amazon: Look for images from images-na.ssl-images-amazon.com or m.media-amazon.com
   - Extract at least 5-10 images if available (main image + gallery images)
   - Return ACTUAL working URLs, not placeholder or example URLs
   - Each URL must be complete and valid (starting with https://)

Return the data in this format:
- title: string (actual product name)
- subtitle: string (product description)
- price: number (e.g. 15.99)
- oldPrice: number or null
- rating: number (0-5)
- reviewsCount: number
- images: array of strings (REAL image URLs - this is critical!)
- marketplace: string (Amazon, Etsy, eBay, etc.)
- primeEligible: boolean
- tags: array of strings

CRITICAL: Make sure to extract REAL working image URLs from the actual product page. Test that the URLs are complete and valid.`,
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