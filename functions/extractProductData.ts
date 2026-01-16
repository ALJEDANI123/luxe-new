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
            
Please extract all available information including:
- Product title
- Subtitle or short description
- Price (as a number without currency symbol)
- Old/original price if there's a discount
- Rating (as a number from 0 to 5)
- Number of reviews/ratings
- Main product images (array of URLs)
- Marketplace name (Amazon, eBay, etc.)
- Whether it's Prime eligible (for Amazon)
- Product tags or categories

Return the data in JSON format.`,
            add_context_from_internet: true,
            response_json_schema: {
                type: "object",
                properties: {
                    title: { type: "string" },
                    subtitle: { type: "string" },
                    price: { type: "number" },
                    oldPrice: { type: "number" },
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