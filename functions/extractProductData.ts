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

        // Fetch the HTML page
        const pageResponse = await fetch(productUrl);
        const html = await pageResponse.text();

        const extractedImages = new Set();

        // 1. Extract from Open Graph and Twitter card meta tags
        let match;
        const metaImageRegex = /<meta[^>]*property=["'](og|twitter):image["'][^>]*content=["']([^"']+)["']/gi;
        while ((match = metaImageRegex.exec(html)) !== null) {
            if (match[2] && match[2].startsWith('http')) extractedImages.add(match[2]);
        }

        // 2. Extract from JSON-LD structured data
        const jsonLdRegex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([^<]+)<\/script>/gi;
        while ((match = jsonLdRegex.exec(html)) !== null) {
            try {
                const jsonLd = JSON.parse(match[1]);
                const processImage = (imgData) => {
                    if (!imgData) return;
                    if (Array.isArray(imgData)) {
                        imgData.forEach(img => processImage(img));
                    } else if (typeof imgData === 'string' && imgData.startsWith('http')) {
                        extractedImages.add(imgData);
                    } else if (typeof imgData === 'object' && imgData.url && imgData.url.startsWith('http')) {
                        extractedImages.add(imgData.url);
                    }
                };

                if (jsonLd.image) processImage(jsonLd.image);
                if (jsonLd.offers) {
                    if (Array.isArray(jsonLd.offers)) {
                        jsonLd.offers.forEach(offer => {
                            if (offer.image) processImage(offer.image);
                        });
                    } else if (jsonLd.offers.image) {
                        processImage(jsonLd.offers.image);
                    }
                }
                if (jsonLd.mainEntity && jsonLd.mainEntity.image) processImage(jsonLd.mainEntity.image);
                if (jsonLd["@graph"]) {
                    jsonLd["@graph"].forEach(item => {
                        if (item["@type"] === "Product" || item["@type"] === "ImageObject") {
                            if (item.image) processImage(item.image);
                        }
                    });
                }

            } catch (e) {
                console.warn("Error parsing JSON-LD:", e);
            }
        }

        // 3. Extract from <img> tags with multiple attributes
        const imgTagRegex = /<img[^>]*?(?:src|data-src|data-large-image)=["']([^"']+)["'][^>]*>/gi;
        while ((match = imgTagRegex.exec(html)) !== null) {
            const src = match[1].split(',')[0].split(' ')[0].trim();
            if (src && src.startsWith('http')) extractedImages.add(src);
        }

        // LLM to extract product data (not images)
        const llmResult = await base44.integrations.Core.InvokeLLM({
            prompt: `From the product page at ${productUrl}, extract:\n- title: Exact product name\n- subtitle: Product description (150-200 characters)\n- price: Current price (number)\n- oldPrice: Original price if on sale, otherwise null\n- rating: Star rating (0-5)\n- reviewsCount: Number of reviews\n- marketplace: Etsy, Amazon, or eBay\n- primeEligible: true if Amazon Prime badge exists\n- tags: 5-8 relevant keywords`,
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

        // Filter and clean image URLs
        const finalImages = Array.from(extractedImages)
            .filter(url => url && url.startsWith('http') && /\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/i.test(url))
            .slice(0, 5);

        // Combine results
        const result = { ...llmResult, images: finalImages.length > 0 ? finalImages : [] };

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