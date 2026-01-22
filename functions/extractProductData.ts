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
        
        // Extract images directly from HTML 
        let extractedImages = [];
        
        // For Etsy: Extract high-resolution images (il_794xN)
        if (productUrl.includes('etsy.com')) {
            // Multiple patterns to catch all image formats
            const patterns = [
                // Pattern 1: Standard quoted URLs
                /"(https:\/\/i\.etsystatic\.com\/[^"]+\/il_794xN\.[^"]+\.jpg)"/gi,
                // Pattern 2: URLs in data attributes or without quotes
                /https:\/\/i\.etsystatic\.com\/\d+\/r\/il\/[a-f0-9]+\/\d+\/il_794xN\.\d+_[a-z0-9]+\.jpg/gi
            ];
            
            for (const pattern of patterns) {
                let match;
                const regex = new RegExp(pattern);
                while ((match = regex.exec(pageHtml)) !== null) {
                    const url = match[1] || match[0];
                    extractedImages.push(url);
                }
            }
            
            // Remove duplicates
            extractedImages = [...new Set(extractedImages)];
            
            console.log('Extracted images:', extractedImages);
        }
        
        // For Amazon: Look for Amazon image URLs
        if (productUrl.includes('amazon.com')) {
            const amazonImageRegex = /https:\/\/(images-na\.ssl-images-amazon\.com|m\.media-amazon\.com)\/images\/[^"'\s]+\._[^"'\s]+\.jpg/g;
            const matches = pageHtml.match(amazonImageRegex);
            if (matches) {
                extractedImages = [...new Set(matches)];
            }
        }
        
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

Return ONLY the data, do NOT include images array as I will add it separately.`,
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
        
        // Add the extracted images
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