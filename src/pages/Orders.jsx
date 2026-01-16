import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Order } from "@/entities/Order";
import { base44 } from '@/api/base44Client';
import { format } from "date-fns";
import { Package, Calendar, Truck, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/components/utils/helpers";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        setIsLoading(true);
        try {
            const currentUser = await base44.auth.me();
            setUser(currentUser);

            const userOrders = await Order.filter(
                { user_email: currentUser.email },
                '-created_date'
            );
            setOrders(userOrders);
        } catch (error) {
            console.error("Error loading orders:", error);
        }
        setIsLoading(false);
    };



    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'confirmed':
                return 'bg-blue-100 text-blue-800';
            case 'shipped':
                return 'bg-purple-100 text-purple-800';
            case 'delivered':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return <Calendar className="w-4 h-4" />;
            case 'confirmed':
                return <CheckCircle className="w-4 h-4" />;
            case 'shipped':
                return <Truck className="w-4 h-4" />;
            case 'delivered':
                return <Package className="w-4 h-4" />;
            default:
                return <Package className="w-4 h-4" />;
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 animate-pulse">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-8" />
                    <div className="space-y-6">
                        {Array(3).fill(0).map((_, i) => (
                            <div key={i} className="bg-white rounded-lg p-6">
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
                                <div className="h-20 bg-gray-200 rounded" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
                    <p className="text-gray-600">Track your purchases and order history</p>
                </motion.div>

                {orders.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-20"
                    >
                        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                            No orders yet
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Start shopping to see your orders here
                        </p>
                    </motion.div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order, index) => (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card>
                                    <CardHeader className="pb-4">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                            <div>
                                                <CardTitle className="flex items-center gap-2">
                                                    <Package className="w-5 h-5" />
                                                    Order #{order.id.slice(-8)}
                                                </CardTitle>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    Placed on {format(new Date(order.created_date), 'PPP')}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Badge className={`${getStatusColor(order.status)} gap-1`}>
                                                    {getStatusIcon(order.status)}
                                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                </Badge>
                                                <div className="text-right">
                                                    <div className="text-lg font-semibold">
                                                        {formatPrice(order.total_amount)}
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    
                                    <Separator />
                                    
                                    <CardContent className="pt-4">
                                        <div className="space-y-3">
                                            {order.items.map((item, itemIndex) => (
                                                <div key={itemIndex} className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                                            <Package className="w-6 h-6 text-gray-400" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-medium text-gray-900">
                                                                {item.name}
                                                            </h4>
                                                            <p className="text-sm text-gray-600">
                                                                Quantity: {item.quantity}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-medium">
                                                            {formatPrice(item.price * item.quantity)}
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            {formatPrice(item.price)} each
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {order.shipping_address && (
                                            <>
                                                <Separator className="my-4" />
                                                <div>
                                                    <h4 className="font-medium text-gray-900 mb-2">
                                                        Shipping Address
                                                    </h4>
                                                    <div className="text-sm text-gray-600">
                                                        <p>{order.shipping_address.name}</p>
                                                        <p>{order.shipping_address.address}</p>
                                                        <p>
                                                            {order.shipping_address.city}, {order.shipping_address.postal_code}
                                                        </p>
                                                        <p>{order.shipping_address.country}</p>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}