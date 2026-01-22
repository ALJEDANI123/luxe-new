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
        
        // Extract images from HTML
        const images = [];
        
        // Extract all image URLs from various patterns
        const imagePatterns = [
            /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/gi,
            /<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/gi,
            /https:\/\/i\.etsystatic\.com\/[^\s"'<>)]+\.jpg/gi,
            /https:\/\/i\.etsystatic\.com\/[^\s"'<>)]+\.jpeg/gi,
            /https:\/\/i\.etsystatic\.com\/[^\s"'<>)]+\.png/gi,
            /https:\/\/m\.media-amazon\.com\/images\/I\/[^\s"'<>)]+/gi,
            /https:\/\/i\.ebayimg\.com\/[^\s"'<>)]+/gi,
        ];
        
        for (const pattern of imagePatterns) {
            let match;
            while ((match = pattern.exec(html)) !== null) {
                const imageUrl = match[1] || match[0];
                if (imageUrl && !images.includes(imageUrl) && imageUrl.startsWith('http')) {
                    images.push(imageUrl);
                }
            }
        }
        
        // Use LLM to extract product data (without images)
        const result = await base44.integrations.Core.InvokeLLM({
            prompt: `Extract product information from: ${productUrl}

Return:
- title: Product name
- subtitle: Product description (150-200 characters)
- price: Number only
- oldPrice: If on sale, otherwise null
- rating: 0-5 stars
- reviewsCount: Number of reviews
- marketplace: Etsy, Amazon, or eBay
- primeEligible: true only if Amazon Prime
- tags: 5-8 relevant keywords`,
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
        
        // Add extracted images to result
        result.images = images.slice(0, 5);

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