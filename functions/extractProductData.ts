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
        
        // Use LLM to extract all data including actual image URLs from the HTML
        const result = await base44.integrations.Core.InvokeLLM({
            prompt: `From this product page HTML, extract:
- title: Product name
- subtitle: Product description (150-200 characters)
- price: Number only
- oldPrice: If on sale, otherwise null
- rating: 0-5 stars
- reviewsCount: Number of reviews
- marketplace: Detect if Etsy, Amazon, or eBay
- primeEligible: true only if Amazon Prime
- tags: 5-8 relevant keywords
- images: Extract ALL actual image URLs from the page (look for og:image, product images, gallery images - get at least 3-5 real image URLs)

HTML content:
${html.slice(0, 50000)}`,
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