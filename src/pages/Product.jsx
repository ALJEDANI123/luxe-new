import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Product } from "@/entities/Product";
import { CartItem } from "@/entities/CartItem";
import { base44 } from '@/api/base44Client';
import { createPageUrl } from "@/utils";
import {
    ArrowLeft,
    Star,
    Heart,
    Share2,
    Minus,
    Plus,
    ShoppingCart,
    Truck,
    Shield,
    RefreshCw,
    ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/components/utils/helpers";

export default function ProductPage() {
    const [product, setProduct] = useState(null);
    const [user, setUser] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    useEffect(() => {
        if (productId) {
            loadProduct();
        }
    }, [productId]);

    const loadProduct = async () => {
        setIsLoading(true);
        try {
            const [productData, currentUser] = await Promise.all([
                Product.list().then(products => products.find(p => p.id === productId)),
                base44.auth.me().catch(() => null)
            ]);

            if (!productData) {
                navigate(createPageUrl("Shop"));
                return;
            }

            setProduct(productData);
            setUser(currentUser);
        } catch (error) {
            console.error("Error loading product:", error);
            navigate(createPageUrl("Shop"));
        }
        setIsLoading(false);
    };

    const handleAddToCart = async () => {
        if (!user) {
            base44.auth.redirectToLogin(window.location.href);
            return;
        }

        try {
            await CartItem.create({
                product_id: product.id,
                quantity: quantity,
                user_email: user.email
            });
            // Show success message or navigate to cart
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    };



    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`w-4 h-4 ${
                    i < Math.floor(rating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                }`}
            />
        ));
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 animate-pulse">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid lg:grid-cols-2 gap-12">
                        <div className="aspect-square bg-gray-200 rounded-2xl" />
                        <div className="space-y-4">
                            <div className="h-8 bg-gray-200 rounded w-3/4" />
                            <div className="h-6 bg-gray-200 rounded w-1/2" />
                            <div className="h-20 bg-gray-200 rounded" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) return null;

    const images = [product.image_url, ...(product.gallery || [])].filter(Boolean);
    if (images.length === 0) {
        images.push("https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=600&fit=crop&crop=center");
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Button */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-6"
                >
                    <Button
                        variant="ghost"
                        onClick={() => navigate(createPageUrl("Shop"))}
                        className="gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Shop
                    </Button>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Product Images */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-4"
                    >
                        {/* Main Image */}
                        <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-sm">
                            <img
                                src={images[selectedImage]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Thumbnail Gallery */}
                        {images.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto">
                                {images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                                            selectedImage === index
                                                ? 'border-black'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <img
                                            src={image}
                                            alt={`${product.name} ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Product Details */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Badge variant="secondary" className="capitalize">
                                    {product.category}
                                </Badge>
                                {product.featured && (
                                    <Badge className="bg-black text-white">
                                        Featured
                                    </Badge>
                                )}
                            </div>
                            
                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                                {product.name}
                            </h1>

                            {product.rating > 0 && (
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="flex items-center">
                                        {renderStars(product.rating)}
                                    </div>
                                    <span className="text-sm text-gray-600">
                                        ({product.rating} rating)
                                    </span>
                                </div>
                            )}

                            <div className="text-3xl font-bold text-gray-900">
                                {formatPrice(product.price)}
                            </div>
                        </div>

                        {product.description && (
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {product.description}
                                </p>
                            </div>
                        )}

                        <Separator />

                        {/* Quantity and Add to Cart / View on Affiliate */}
                        <div className="space-y-4">
                            {product.affiliateUrl ? ( // Check for affiliateUrl
                                <a href={product.affiliateUrl} target="_blank" rel="noopener noreferrer" className="w-full block">
                                    <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black h-12 gap-2">
                                        <ExternalLink className="w-4 h-4" />
                                        View on {product.marketplace || 'External Site'} {/* Use marketplace or default */}
                                    </Button>
                                </a>
                            ) : (
                                <>
                                    <div className="flex items-center gap-4">
                                        <span className="font-medium text-gray-900">Quantity:</span>
                                        <div className="flex items-center border border-gray-300 rounded-lg">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                disabled={quantity <= 1}
                                                className="h-10 w-10"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </Button>
                                            <span className="px-4 py-2 font-medium min-w-[60px] text-center">
                                                {quantity}
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setQuantity(quantity + 1)}
                                                disabled={quantity >= (product.stock || 10)}
                                                className="h-10 w-10"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </Button>
                                        </div>
                                        
                                        {product.stock && (
                                            <span className="text-sm text-gray-500">
                                                {product.stock} in stock
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex gap-3">
                                        <Button
                                            onClick={handleAddToCart}
                                            className="flex-1 bg-black hover:bg-gray-800 text-white h-12 gap-2"
                                            disabled={product.stock === 0}
                                        >
                                            <ShoppingCart className="w-4 h-4" />
                                            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                        </Button>
                                        
                                        <Button variant="outline" size="icon" className="h-12 w-12">
                                            <Heart className="w-4 h-4" />
                                        </Button>
                                        
                                        <Button variant="outline" size="icon" className="h-12 w-12">
                                            <Share2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>

                        <Separator />

                        {/* Features */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <Truck className="w-4 h-4" />
                                <span>Free shipping on orders over $50</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <Shield className="w-4 h-4" />
                                <span>2 year warranty included</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <RefreshCw className="w-4 h-4" />
                                <span>30-day return policy</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}