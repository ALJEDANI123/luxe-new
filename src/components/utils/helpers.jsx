// دالة تنسيق السعر - مشتركة بين جميع الملفات
export const formatPrice = (price) => {
    if (!price) return 'N/A';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
};

// صور احتياطية للمنتجات
export const fallbackImages = [
    'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1503602642458-232111445657?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=600&h=600&fit=crop'
];

// الحصول على صورة احتياطية بناءً على ID المنتج
export const getFallbackImage = (productId) => {
    const hash = productId?.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) || 0;
    return fallbackImages[hash % fallbackImages.length];
};