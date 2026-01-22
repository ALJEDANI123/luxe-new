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

        // Use LLM with web search to get product data AND images
        const result = await base44.integrations.Core.InvokeLLM({
            prompt: `Extract ALL product information from this Etsy listing: ${productUrl}

I need you to:
1. Visit this exact URL
2. Extract the product images from the page (look for high-resolution images with "il_794xN" in the URL)
3. Extract product details

Return:
- title: Product name
- subtitle: Product description (150-200 characters)
- price: Number only (convert from any currency to USD, e.g., 26.46)
- oldPrice: If on sale, null otherwise
- rating: 0-5 stars
- reviewsCount: Number of reviews
- marketplace: "Etsy"
- primeEligible: false
- tags: Array of 5-8 relevant tags
- images: Array of ACTUAL image URLs from the page (look for https://i.etsystatic.com URLs ending in .jpg with il_794xN). Return 5-10 images.

CRITICAL: For images, you MUST extract the actual image URLs from the product page HTML. Look for URLs like:
https://i.etsystatic.com/28790764/r/il/907249/7246871711/il_794xN.7246871711_d0uz.jpg

DO NOT make up image URLs. Extract them from the actual page content.`,
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