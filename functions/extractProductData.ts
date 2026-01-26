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

        // Step 1: Use microlink.io to extract metadata and images
        const microlinkResponse = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(productUrl)}`);
        const microlinkData = await microlinkResponse.json();
        
        let productImages = [];
        if (microlinkData.status === 'success' && microlinkData.data) {
            // Get main image from microlink
            if (microlinkData.data.image?.url) {
                productImages.push(microlinkData.data.image.url);
            }
        }

        // Step 2: Use LLM to extract detailed product data
        const llmResult = await base44.integrations.Core.InvokeLLM({
            prompt: `From the product page at ${productUrl}, extract:
- title: Exact product name
- subtitle: Product description (150-200 characters)
- price: Current price (number only, without currency symbols)
- oldPrice: Original price if on sale, otherwise null
- rating: Star rating (0-5)
- reviewsCount: Number of reviews (number only)
- marketplace: The website name (e.g., Amazon, Etsy, eBay, Garmin, etc.)
- primeEligible: true if Amazon Prime badge exists, otherwise false
- tags: 5-8 relevant keywords as array`,
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

        const result = { ...llmResult, images: productImages }

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