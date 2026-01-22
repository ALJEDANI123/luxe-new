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

        // Fetch page with a proper browser-like request
        const pageResponse = await fetch(productUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
            }
        });
        const pageHtml = await pageResponse.text();
        
        // Extract images from Open Graph meta tags and JSON-LD
        let extractedImages = [];
        
        // Try Open Graph images first
        const ogImageMatch = pageHtml.match(/<meta property="og:image" content="([^"]+)"/);
        if (ogImageMatch) {
            extractedImages.push(ogImageMatch[1]);
        }
        
        // Try to find all images in meta tags
        const metaImagesMatches = pageHtml.matchAll(/<meta[^>]*content="(https:\/\/i\.etsystatic\.com[^"]+)"/g);
        for (const match of metaImagesMatches) {
            if (match[1].includes('il_794xN') || match[1].includes('il_fullxfull')) {
                extractedImages.push(match[1]);
            }
        }
        
        // Look for JSON embedded in the page
        const scriptMatches = pageHtml.matchAll(/<script[^>]*>(.*?)<\/script>/gs);
        for (const scriptMatch of scriptMatches) {
            const scriptContent = scriptMatch[1];
            // Find image URLs in any JSON structures
            const imageUrlMatches = scriptContent.matchAll(/"(https:\/\/i\.etsystatic\.com\/\d+\/r\/il\/[a-f0-9]+\/\d+\/il_(?:794xN|fullxfull)\.\d+_[a-z0-9]+\.jpg)"/g);
            for (const urlMatch of imageUrlMatches) {
                extractedImages.push(urlMatch[1]);
            }
        }
        
        // Remove duplicates and limit
        extractedImages = [...new Set(extractedImages)].slice(0, 10);
        
        console.log('Extracted images:', extractedImages);
        
        // Use LLM to extract product data (without images)
        const result = await base44.integrations.Core.InvokeLLM({
            prompt: `Extract product information from this product page URL: ${productUrl}

Visit the page and extract:
- title: Product name
- subtitle: Product description (150-200 characters)
- price: Number only (e.g., 26.46)
- oldPrice: If on sale
- rating: 0-5 stars
- reviewsCount: Number of reviews
- marketplace: Etsy, Amazon, or eBay
- tags: Array of relevant tags

Return ONLY the data, do NOT include images.`,
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
                    }
                }
            }
        });
        
        // Add extracted images to result
        result.images = extractedImages;

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