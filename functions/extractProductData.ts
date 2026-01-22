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
            prompt: `You are a product data extractor. Extract detailed product information from this URL: ${productUrl}

CRITICAL INSTRUCTIONS:
1. Find the ACTUAL rating (stars) - look for something like "4.5 out of 5 stars" or "4.5★"
2. Find the ACTUAL number of reviews/ratings - look for numbers like "12,345 ratings" or "1,234 reviews"
3. Find the ACTUAL product description or subtitle - NOT just tags
4. Extract the ACTUAL price as a number (without $ or currency symbols)
5. Get ALL product image URLs from the page - including main images, gallery images, and even animated GIFs
6. IMPORTANT: Extract ALL available product images (typically 5-10+ images), not just 1-2 images

Extract:
- title: Full product name
- subtitle: Product description or subtitle (NOT just tags, get the actual description text)
- price: Current price as number (e.g., 15.99 not "$15.99")
- oldPrice: Original price if on sale (as number)
- rating: Star rating as decimal number 0-5 (e.g., 4.7)
- reviewsCount: Total number of customer reviews/ratings as integer (e.g., 15234)
- images: Array of ALL product image URLs including main image, gallery images, zoom images, and animated GIFs (extract all available images, minimum 3-5 if available)
- marketplace: Store name (Amazon, eBay, Etsy, etc.)
- primeEligible: true if Amazon Prime available
- tags: Product categories/tags as array

IMPORTANT: Return REAL data from the actual product page, not placeholder values. If you can't find a field, set it to null. For images, make sure to extract ALL available product images from the page.`,
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