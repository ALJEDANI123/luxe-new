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

const categories = ["electronics", "clothing", "home", "books", "sports", "beauty"];

export default function ProductForm({ product, onSave, onCancel, isSaving }) {
    const [formData, setFormData] = useState({});

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

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
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