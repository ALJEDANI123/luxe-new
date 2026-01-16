import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CartItem } from "@/entities/CartItem";
import { Product } from "@/entities/Product";
import { Order } from "@/entities/Order";
import { base44 } from '@/api/base44Client';
import { createPageUrl } from "@/utils";
import {
    ArrowLeft,
    Minus,
    Plus,
    Trash2,
    ShoppingBag,
    CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/components/utils/helpers";

export default function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [products, setProducts] = useState({});
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        loadCart();
    }, []);

    const loadCart = async () => {
        setIsLoading(true);
        try {
            const currentUser = await base44.auth.me();
            setUser(currentUser);

            const items = await CartItem.filter({ user_email: currentUser.email });
            const allProducts = await Product.list();
            
            const productMap = {};
            allProducts.forEach(product => {
                productMap[product.id] = product;
            });

            setCartItems(items);
            setProducts(productMap);
        } catch (error) {
            console.error("Error loading cart:", error);
            base44.auth.redirectToLogin(window.location.href);
        }
        setIsLoading(false);
    };

    const updateQuantity = async (itemId, newQuantity) => {
        if (newQuantity <= 0) {
            await removeItem(itemId);
            return;
        }

        try {
            await CartItem.update(itemId, { quantity: newQuantity });
            setCartItems(prev => 
                prev.map(item => 
                    item.id === itemId ? { ...item, quantity: newQuantity } : item
                )
            );
        } catch (error) {
            console.error("Error updating quantity:", error);
        }
    };

    const removeItem = async (itemId) => {
        try {
            await CartItem.delete(itemId);
            setCartItems(prev => prev.filter(item => item.id !== itemId));
        } catch (error) {
            console.error("Error removing item:", error);
        }
    };



    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => {
            const product = products[item.product_id];
            return total + (product ? product.price * item.quantity : 0);
        }, 0);
    };

    const handleCheckout = async () => {
        setIsCheckingOut(true);
        try {
            const orderItems = cartItems.map(item => {
                const product = products[item.product_id];
                return {
                    product_id: item.product_id,
                    name: product.name,
                    price: product.price,
                    quantity: item.quantity
                };
            });

            await Order.create({
                user_email: user.email,
                items: orderItems,
                total_amount: calculateSubtotal(),
                shipping_address: {
                    name: user.full_name,
                    address: "123 Main St",
                    city: "City",
                    postal_code: "12345",
                    country: "US"
                }
            });

            // Clear cart
            for (const item of cartItems) {
                await CartItem.delete(item.id);
            }

            navigate(createPageUrl("Orders"));
        } catch (error) {
            console.error("Error during checkout:", error);
        }
        setIsCheckingOut(false);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 animate-pulse">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-8" />
                    <div className="space-y-4">
                        {Array(3).fill(0).map((_, i) => (
                            <div key={i} className="bg-white p-6 rounded-lg">
                                <div className="flex gap-4">
                                    <div className="w-20 h-20 bg-gray-200 rounded" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const subtotal = calculateSubtotal();
    const shipping = subtotal > 50 ? 0 : 9.99;
    const total = subtotal + shipping;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Button
                        variant="ghost"
                        onClick={() => navigate(createPageUrl("Shop"))}
                        className="gap-2 mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Continue Shopping
                    </Button>
                    
                    <h1 className="text-3xl font-bold text-gray-900">
                        Shopping Cart ({cartItems.length})
                    </h1>
                </div>

                {cartItems.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-20"
                    >
                        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                            Your cart is empty
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Add some products to get started
                        </p>
                        <Link to={createPageUrl("Shop")}>
                            <Button className="bg-black hover:bg-gray-800 text-white">
                                Start Shopping
                            </Button>
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            <AnimatePresence>
                                {cartItems.map((item) => {
                                    const product = products[item.product_id];
                                    if (!product) return null;

                                    return (
                                        <motion.div
                                            key={item.id}
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, x: -100 }}
                                            className="bg-white rounded-lg p-6 shadow-sm"
                                        >
                                            <div className="flex items-start gap-4">
                                                <Link to={createPageUrl(`Product?id=${product.id}`)}>
                                                    <img
                                                        src={product.image_url || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&crop=center"}
                                                        alt={product.name}
                                                        className="w-20 h-20 object-cover rounded-lg"
                                                    />
                                                </Link>
                                                
                                                <div className="flex-1">
                                                    <Link to={createPageUrl(`Product?id=${product.id}`)}>
                                                        <h3 className="font-semibold text-gray-900 hover:text-gray-600 transition-colors">
                                                            {product.name}
                                                        </h3>
                                                    </Link>
                                                    <p className="text-sm text-gray-500 capitalize mt-1">
                                                        {product.category}
                                                    </p>
                                                    <p className="text-lg font-semibold text-gray-900 mt-2">
                                                        {formatPrice(product.price)}
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="h-8 w-8"
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </Button>
                                                    <span className="px-3 py-1 font-medium min-w-[40px] text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="h-8 w-8"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </Button>
                                                </div>

                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-4">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                    Order Summary
                                </h2>

                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-medium">{formatPrice(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Shipping</span>
                                        <span className="font-medium">
                                            {shipping === 0 ? 'Free' : formatPrice(shipping)}
                                        </span>
                                    </div>
                                    {shipping > 0 && (
                                        <p className="text-xs text-gray-500">
                                            Free shipping on orders over $50
                                        </p>
                                    )}
                                </div>

                                <Separator className="my-4" />

                                <div className="flex justify-between text-lg font-semibold">
                                    <span>Total</span>
                                    <span>{formatPrice(total)}</span>
                                </div>

                                <Button
                                    onClick={handleCheckout}
                                    disabled={isCheckingOut}
                                    className="w-full mt-6 bg-black hover:bg-gray-800 text-white h-12 gap-2"
                                >
                                    <CreditCard className="w-4 h-4" />
                                    {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
                                </Button>

                                <p className="text-xs text-gray-500 text-center mt-3">
                                    Secure checkout with 256-bit SSL encryption
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}