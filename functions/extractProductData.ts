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

        // Fetch the actual page content
        const pageResponse = await fetch(productUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        const pageHtml = await pageResponse.text();
        
        const result = await base44.integrations.Core.InvokeLLM({
            prompt: `Extract product data from this HTML page content. This is the actual HTML from ${productUrl}

HTML Content (first 100k chars):
${pageHtml.substring(0, 100000)}

CRITICAL EXTRACTION RULES:

1. TITLE: Extract from <title> tag or h1 heading
2. PRICE: Look for "$" or "Price:" in the HTML, extract numbers only (e.g., 26.46 not $26.46)
3. RATING: Look for "5 out of 5 stars" or similar patterns
4. IMAGES: MOST IMPORTANT - Extract ALL image URLs:
   - For Etsy: Find ALL URLs containing "i.etsystatic.com" and "il_794xN" (high-res images)
   - Example: https://i.etsystatic.com/28790764/r/il/907249/7246871711/il_794xN.7246871711_d0uz.jpg
   - Extract minimum 5-8 images if available
   - Return COMPLETE URLs starting with https://
5. DESCRIPTION: Extract product description from the page
6. MARKETPLACE: Determine from URL (Etsy, Amazon, eBay)

Return JSON with:
{
  "title": "exact product title",
  "subtitle": "product description",
  "price": 26.46,
  "oldPrice": null,
  "rating": 5,
  "reviewsCount": 0,
  "images": ["https://i.etsystatic.com/...il_794xN...jpg", ...],
  "marketplace": "Etsy",
  "primeEligible": false,
  "tags": ["tag1", "tag2"]
}

CRITICAL: The images array must contain REAL working URLs from i.etsystatic.com domain for Etsy products!`,
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