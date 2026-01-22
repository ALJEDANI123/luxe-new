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

        // Use LLM to extract product data AND images
        const result = await base44.integrations.Core.InvokeLLM({
            prompt: `Extract ALL product information including images from: ${productUrl}

You MUST visit this URL and extract:
- title: Product name
- subtitle: Product description (150-200 characters)
- price: Number only (e.g., 26.46)
- oldPrice: If on sale, null otherwise
- rating: 0-5 stars
- reviewsCount: Number of reviews
- marketplace: Etsy, Amazon, or eBay
- primeEligible: false for non-Amazon
- tags: Array of 5-8 relevant tags
- images: Array of product image URLs found on the page (at least 3-5 images)

IMPORTANT: For images, look for actual image URLs on the product page. Extract the real image URLs from the HTML.`,
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
                    },
                    images: {
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