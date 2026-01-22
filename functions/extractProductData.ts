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

        // Use LLM with web search to extract all product data including images
        const result = await base44.integrations.Core.InvokeLLM({
            prompt: `Visit this product page and extract ALL information: ${productUrl}

CRITICAL: You MUST extract the actual product image URLs from the page.

Return complete data:
- title: Exact product name from the page
- subtitle: Product description (150-200 characters)
- price: Current price (number only)
- oldPrice: Original price if on sale, otherwise null
- rating: Star rating (0-5)
- reviewsCount: Total number of reviews
- marketplace: Identify if this is Etsy, Amazon, or eBay
- primeEligible: true only if Amazon Prime badge exists
- tags: Extract 5-8 relevant product tags/keywords
- images: CRITICAL - Extract at least 3-5 actual image URLs from the product gallery on this page. These should be direct links to product photos.`,
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
                    tags: { type: "array", items: { type: "string" } },
                    images: { type: "array", items: { type: "string" } }
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