import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { base44 } from '@/api/base44Client';
import { Sparkles } from 'lucide-react';

const categories = ["electronics", "clothing", "home", "books", "sports", "beauty"];

export default function ProductForm({ product, onSave, onCancel, isSaving }) {
    const [formData, setFormData] = useState({});
    const [productUrl, setProductUrl] = useState('');
    const [isExtracting, setIsExtracting] = useState(false);

    useEffect(() => {
        if (product) {
            setFormData(product);
        } else {
            setFormData({
                name: '',
                description: '',
                price: 0,
                category: 'electronics',
                image_url: '',
                stock: 0,
                rating: 0,
                featured: false,
                affiliateUrl: '', // Changed from amazon_link
                marketplace: '', // New field
                isMysteryBoxCandidate: false, // New field
            });
        }
    }, [product]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    const handleExtractData = async () => {
        if (!productUrl) {
            alert('الرجاء إدخال رابط المنتج');
            return;
        }

        setIsExtracting(true);
        try {
            const response = await base44.functions.invoke('extractProductData', { productUrl });
            
            if (response.data.success) {
                const extractedData = response.data.data;
                setFormData(prev => ({
                    ...prev,
                    title: extractedData.title || prev.title,
                    subtitle: extractedData.subtitle || prev.subtitle,
                    price: extractedData.price || prev.price,
                    oldPrice: extractedData.oldPrice || prev.oldPrice,
                    rating: extractedData.rating || prev.rating,
                    reviewsCount: extractedData.reviewsCount || prev.reviewsCount,
                    images: extractedData.images || prev.images,
                    marketplace: extractedData.marketplace || prev.marketplace,
                    primeEligible: extractedData.primeEligible || prev.primeEligible,
                    tags: extractedData.tags || prev.tags,
                    affiliateUrl: response.data.affiliateUrl || prev.affiliateUrl,
                }));
                alert('تم استخراج البيانات بنجاح!');
            } else {
                alert('حدث خطأ أثناء استخراج البيانات');
            }
        } catch (error) {
            console.error(error);
            alert('حدث خطأ أثناء استخراج البيانات');
        }
        setIsExtracting(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Quick Extract Section */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-lg border-2 border-purple-200 dark:border-purple-700">
                <Label className="text-lg font-bold mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    استخراج تلقائي - ضع رابط المنتج فقط
                </Label>
                <div className="flex gap-3">
                    <Input 
                        placeholder="https://www.amazon.com/dp/..." 
                        value={productUrl}
                        onChange={(e) => setProductUrl(e.target.value)}
                        className="flex-1"
                    />
                    <Button 
                        type="button" 
                        onClick={handleExtractData}
                        disabled={isExtracting}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                        {isExtracting ? 'جاري الاستخراج...' : 'استخراج البيانات'}
                    </Button>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    سيتم استخراج العنوان، السعر، الصور، التقييم وجميع المعلومات تلقائياً
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input id="name" value={formData.name || ''} onChange={e => handleChange('name', e.target.value)} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input id="price" type="number" step="0.01" value={formData.price || 0} onChange={e => handleChange('price', parseFloat(e.target.value))} required />
                </div>
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={formData.description || ''} onChange={e => handleChange('description', e.target.value)} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="image_url">Image URL</Label>
                <Input id="image_url" value={formData.image_url || ''} onChange={e => handleChange('image_url', e.target.value)} placeholder="https://images.unsplash.com/..." />
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="affiliateUrl">Affiliate Link (Optional)</Label>
                <Input id="affiliateUrl" value={formData.affiliateUrl || ''} onChange={e => handleChange('affiliateUrl', e.target.value)} placeholder="https://www.amazon.com/dp/..." />
            </div>

            <div className="space-y-2">
                <Label htmlFor="marketplace">Marketplace (e.g., Amazon, eBay)</Label>
                <Input id="marketplace" value={formData.marketplace || ''} onChange={e => handleChange('marketplace', e.target.value)} placeholder="Amazon, eBay, Etsy..." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category || 'electronics'} onValueChange={value => handleChange('category', value)}>
                        <SelectTrigger id="category">
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map(cat => (
                                <SelectItem key={cat} value={cat} className="capitalize">{cat}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="stock">Stock</Label>
                    <Input id="stock" type="number" value={formData.stock || 0} onChange={e => handleChange('stock', parseInt(e.target.value, 10))} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="rating">Rating</Label>
                    <Input id="rating" type="number" step="0.1" min="0" max="5" value={formData.rating || 0} onChange={e => handleChange('rating', parseFloat(e.target.value))} />
                </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
                <Switch id="featured" checked={formData.featured || false} onCheckedChange={checked => handleChange('featured', checked)} />
                <Label htmlFor="featured">Featured Product</Label>
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
                <Switch id="isMysteryBoxCandidate" checked={formData.isMysteryBoxCandidate || false} onCheckedChange={checked => handleChange('isMysteryBoxCandidate', checked)} />
                <Label htmlFor="isMysteryBoxCandidate">Mystery Box Candidate / Quirky Find</Label>
            </div>
            
            <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                <Button type="submit" disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Product'}
                </Button>
            </div>
        </form>
    );
}