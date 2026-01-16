import React, { useState, useEffect } from 'react';
import { base44 } from '../api/base44Client';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '../components/ui/dialog';
import { Edit, PlusCircle } from 'lucide-react';
import ProductForm from '../components/admin/ProductForm';
import { formatPrice } from '../components/utils/helpers';

export default function Admin() {
    const [products, setProducts] = useState([]);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    useEffect(() => {
        checkUserAndLoadProducts();
    }, []);

    const checkUserAndLoadProducts = async () => {
        setIsLoading(true);
        try {
            const currentUser = await base44.auth.me();
            // In a real app, we'd check if currentUser.role === 'admin'
            setUser(currentUser);
            const productData = await base44.entities.Product.list('-created_date');
            setProducts(productData);
        } catch (error) {
            setUser(null);
            console.error("Access denied or error loading products:", error);
        }
        setIsLoading(false);
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setIsDialogOpen(true);
    };
    
    const handleAddNew = () => {
        setEditingProduct(null); // No product means it's a new one
        setIsDialogOpen(true);
    };

    const handleSave = async (productData) => {
        setIsSaving(true);
        try {
            if (editingProduct && editingProduct.id) {
                // Update existing product
                const updatedProduct = await base44.entities.Product.update(editingProduct.id, productData);
                setProducts(products.map(p => p.id === editingProduct.id ? updatedProduct : p));
            } else {
                // Create new product
                const newProduct = await base44.entities.Product.create(productData);
                setProducts([newProduct, ...products]);
            }
            setIsDialogOpen(false);
        } catch (error) {
            console.error("Failed to save product:", error);
        }
        setIsSaving(false);
    };



    if (isLoading) {
        return <div className="p-8">Loading...</div>;
    }

    if (!user) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-2xl font-bold">Access Denied</h2>
                <p className="text-gray-600">You must be logged in to view this page.</p>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto"
            >
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
                        <p className="text-gray-600 mt-1">Edit, update, and manage your store's products.</p>
                    </div>
                    <Button onClick={handleAddNew} className="gap-2">
                        <PlusCircle className="w-4 h-4" />
                        Add New Product
                    </Button>
                </div>
                
                <Card>
                    <CardHeader>
                        <CardTitle>All Products ({products.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Image</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Marketplace</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Rating</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products.map(product => (
                                    <TableRow key={product.id}>
                                        <TableCell>
                                            <img 
                                                src={product.images?.[0] || product.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=50&h=50&fit=crop'} 
                                                alt={product.title || product.name} 
                                                className="w-12 h-12 object-cover rounded-md" 
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium">{product.title || product.name}</TableCell>
                                        <TableCell className="capitalize">{product.marketplace || product.category || 'N/A'}</TableCell>
                                        <TableCell>{formatPrice(product.price)}</TableCell>
                                        <TableCell>⭐ {product.rating || 0}</TableCell>
                                        <TableCell>
                                            <Button variant="outline" size="icon" onClick={() => handleEdit(product)}>
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </motion.div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                        <DialogDescription>
                            {editingProduct ? 'Make changes to your product here. Click save when you\'re done.' : 'Add a new product to your store.'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <ProductForm 
                            product={editingProduct} 
                            onSave={handleSave} 
                            onCancel={() => setIsDialogOpen(false)}
                            isSaving={isSaving}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}