import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { base44 } from '@/api/base44Client';
import { Sparkles, Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

export default function ProductForm({ product, onSave, onCancel, isSaving }) {
    const [formData, setFormData] = useState(null);
    const [productUrl, setProductUrl] = useState('');
    const [isExtracting, setIsExtracting] = useState(false);

    useEffect(() => {
        if (product) {
            setFormData(product);
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
                const slug = extractedData.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || '';
                
                console.log('البيانات المستخرجة:', extractedData);
                
                setFormData({
                    title: extractedData.title || '',
                    slug: slug,
                    subtitle: extractedData.subtitle || '',
                    price: extractedData.price || 0,
                    oldPrice: extractedData.oldPrice || null,
                    rating: extractedData.rating || 0,
                    reviewsCount: extractedData.reviewsCount || 0,
                    images: extractedData.images || [],
                    marketplace: extractedData.marketplace || 'Amazon',
                    primeEligible: extractedData.primeEligible || false,
                    tags: extractedData.tags || [],
                    affiliateUrl: response.data.affiliateUrl,
                    isMysteryBoxCandidate: true,
                    category_id: '',
                });
                
                // عرض جميع البيانات المستخرجة للتأكد
                console.log('===== البيانات المستخرجة الكاملة =====');
                console.log('العنوان:', extractedData.title);
                console.log('الوصف:', extractedData.subtitle);
                console.log('السعر:', extractedData.price);
                console.log('التقييم:', extractedData.rating);
                console.log('عدد المراجعات:', extractedData.reviewsCount);
                console.log('الصور:', extractedData.images);
                console.log('===============================');
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
        <div className="max-h-[80vh] overflow-y-auto">
            {!formData ? (
                // الخطوة 1: إدخال الرابط واستخراج البيانات
                <div className="space-y-4 p-6">
                    <div className="text-center mb-6">
                        <Sparkles className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                        <h3 className="text-2xl font-bold mb-2">أضف منتج جديد</h3>
                        <p className="text-gray-600 dark:text-gray-400">ضع رابط المنتج وسنستخرج جميع المعلومات تلقائياً</p>
                    </div>
                    
                    <div className="space-y-3">
                        <Input 
                            placeholder="https://www.amazon.com/dp/... أو https://www.ebay.com/itm/..." 
                            value={productUrl}
                            onChange={(e) => setProductUrl(e.target.value)}
                            className="text-lg h-12"
                        />
                        <Button 
                            type="button" 
                            onClick={handleExtractData}
                            disabled={isExtracting}
                            className="w-full h-12 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        >
                            {isExtracting ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    جاري استخراج البيانات...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5 mr-2" />
                                    استخراج البيانات
                                </>
                            )}
                        </Button>
                    </div>
                    
                    <div className="flex justify-end pt-4">
                        <Button type="button" variant="outline" onClick={onCancel}>إلغاء</Button>
                    </div>
                </div>
            ) : (
                // الخطوة 2: مراجعة البيانات المستخرجة
                <form onSubmit={handleSubmit} className="space-y-4 p-6">
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-700 mb-4">
                        <p className="text-green-800 dark:text-green-200 font-semibold">✓ تم استخراج البيانات بنجاح - راجع المعلومات وانقر حفظ</p>
                    </div>

                    {/* الصور */}
                    {formData.images && formData.images.length > 0 && (
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {formData.images.slice(0, 4).map((img, i) => (
                                <img key={i} src={img} alt="" className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200" />
                            ))}
                        </div>
                    )}

                    {/* المعلومات الأساسية */}
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-3">
                        <div>
                            <Label className="text-xs text-gray-500 font-bold">العنوان</Label>
                            <Input 
                                value={formData.title || ''} 
                                onChange={(e) => handleChange('title', e.target.value)}
                                className="mt-1"
                            />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Label className="text-xs text-gray-500 font-bold">السعر</Label>
                                <p className="font-bold text-2xl text-purple-600 mt-1">${formData.price || '0'}</p>
                            </div>
                            <div>
                                <Label className="text-xs text-gray-500 font-bold">المتجر</Label>
                                <p className="font-semibold mt-1">{formData.marketplace || 'غير محدد'}</p>
                            </div>
                        </div>
                        
                        <div>
                            <Label className="text-xs text-gray-500 font-bold">التقييم والمراجعات</Label>
                            <p className="font-semibold text-lg mt-1">
                                ⭐ {formData.rating || 0}/5 
                                <span className="text-sm text-gray-600 mr-2">
                                    ({(formData.reviewsCount || 0).toLocaleString()} مراجعة)
                                </span>
                            </p>
                        </div>
                        
                        <div>
                            <Label className="text-xs text-gray-500 font-bold">الوصف</Label>
                            <textarea 
                                value={formData.subtitle || ''} 
                                onChange={(e) => handleChange('subtitle', e.target.value)}
                                className="w-full mt-1 p-3 border rounded-md min-h-[200px] text-sm leading-relaxed resize-y"
                                placeholder="وصف المنتج..."
                            />
                        </div>
                    </div>

                    {formData.tags && formData.tags.length > 0 && (
                        <div>
                            <Label className="text-xs text-gray-500 mb-2 block">الوسوم</Label>
                            <div className="flex flex-wrap gap-2">
                                {formData.tags.map((tag, i) => (
                                    <span key={i} className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200 rounded text-xs">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-2 pt-2">
                        <Switch 
                            id="isMysteryBoxCandidate" 
                            checked={formData.isMysteryBoxCandidate || false} 
                            onCheckedChange={checked => handleChange('isMysteryBoxCandidate', checked)} 
                        />
                        <Label htmlFor="isMysteryBoxCandidate" className="text-sm">إضافة إلى Quirky Finds</Label>
                    </div>
                    
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={() => setFormData(null)}>تعديل الرابط</Button>
                        <Button type="button" variant="outline" onClick={onCancel}>إلغاء</Button>
                        <Button type="submit" disabled={isSaving} className="bg-gradient-to-r from-purple-600 to-pink-600">
                            {isSaving ? 'جاري الحفظ...' : 'حفظ المنتج'}
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
}