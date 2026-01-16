import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from '../api/base44Client';
import { Grid, List, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../components/ui/select";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "../components/ui/sheet";
import { Badge } from "../components/ui/badge";
import ProductCard from "../components/ProductCard";

export default function Shop() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const [viewMode, setViewMode] = useState("grid");
    const [userFavorites, setUserFavorites] = useState([]);
    
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (categoryParam) {
            setSelectedCategory(categoryParam);
        }
    }, [categoryParam]);

    useEffect(() => {
        filterAndSortProducts();
    }, [products, searchQuery, selectedCategory, sortBy]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [allProducts, currentUser] = await Promise.all([
                base44.entities.Product.list('-created_date', 100),
                base44.auth.me().catch(() => null)
            ]);

            setProducts(allProducts);
            setUser(currentUser);
            
            if (currentUser) {
                const favorites = await base44.entities.Favorite.filter({ user_email: currentUser.email });
                setUserFavorites(favorites);
            }
        } catch (error) {
            console.error("Error loading products:", error);
        }
        setIsLoading(false);
    };

    const filterAndSortProducts = () => {
        let filtered = [...products];

        // Apply search filter
        if (searchQuery) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Apply category filter
        if (selectedCategory !== "all") {
            filtered = filtered.filter(product => product.category === selectedCategory);
        }

        // Apply sorting
        switch (sortBy) {
            case "price-low":
                filtered.sort((a, b) => a.price - b.price);
                break;
            case "price-high":
                filtered.sort((a, b) => b.price - a.price);
                break;
            case "rating":
                filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            case "name":
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            default:
                filtered.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
        }

        setFilteredProducts(filtered);
    };



    const categories = [
        { value: "all", label: "All Products" },
        { value: "electronics", label: "Electronics" },
        { value: "clothing", label: "Fashion" },
        { value: "home", label: "Home & Living" },
        { value: "books", label: "Books" },
        { value: "sports", label: "Sports" },
        { value: "beauty", label: "Beauty" },
    ];

    const FilterContent = () => (
        <div className="space-y-6">
            <div>
                <h3 className="font-semibold text-gray-900 mb-3">Category</h3>
                <div className="space-y-2">
                    {categories.map((category) => (
                        <button
                            key={category.value}
                            onClick={() => setSelectedCategory(category.value)}
                            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                                selectedCategory === category.value
                                    ? 'bg-gray-100 text-gray-900 font-medium'
                                    : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            {category.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Shop All Products
                    </h1>
                    <p className="text-gray-600">
                        Discover our complete collection of premium products
                    </p>
                </div>

                {/* Filters and Search */}
                <div className="mb-8 space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        {/* Sort */}
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-full sm:w-48">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="newest">Newest First</SelectItem>
                                <SelectItem value="price-low">Price: Low to High</SelectItem>
                                <SelectItem value="price-high">Price: High to Low</SelectItem>
                                <SelectItem value="rating">Highest Rated</SelectItem>
                                <SelectItem value="name">Name A-Z</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* View Mode */}
                        <div className="flex border rounded-lg overflow-hidden">
                            <Button
                                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                                size="icon"
                                onClick={() => setViewMode('grid')}
                                className="rounded-none"
                            >
                                <Grid className="w-4 h-4" />
                            </Button>
                            <Button
                                variant={viewMode === 'list' ? 'default' : 'ghost'}
                                size="icon"
                                onClick={() => setViewMode('list')}
                                className="rounded-none"
                            >
                                <List className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* Mobile Filter */}
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" className="sm:hidden">
                                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                                    Filters
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left">
                                <SheetHeader>
                                    <SheetTitle>Filters</SheetTitle>
                                </SheetHeader>
                                <div className="mt-6">
                                    <FilterContent />
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    {/* Active Filters */}
                    <div className="flex flex-wrap items-center gap-2">
                        {selectedCategory !== "all" && (
                            <Badge variant="secondary" className="gap-1">
                                {categories.find(c => c.value === selectedCategory)?.label}
                                <button
                                    onClick={() => setSelectedCategory("all")}
                                    className="ml-1 hover:text-gray-900"
                                >
                                    ×
                                </button>
                            </Badge>
                        )}
                        {searchQuery && (
                            <Badge variant="secondary" className="gap-1">
                                "{searchQuery}"
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="ml-1 hover:text-gray-900"
                                >
                                    ×
                                </button>
                            </Badge>
                        )}
                    </div>
                </div>

                <div className="flex gap-8">
                    {/* Desktop Sidebar */}
                    <div className="hidden sm:block w-64 flex-shrink-0">
                        <div className="bg-white rounded-lg p-6 sticky top-4">
                            <FilterContent />
                        </div>
                    </div>

                    {/* Products */}
                    <div className="flex-1">
                        <div className="mb-4 text-sm text-gray-600">
                            Showing {filteredProducts.length} products
                        </div>

                        {isLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {Array(6).fill(0).map((_, i) => (
                                    <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
                                        <div className="aspect-[4/5] bg-gray-200 rounded-lg mb-4" />
                                        <div className="h-4 bg-gray-200 rounded mb-2" />
                                        <div className="h-4 bg-gray-200 rounded w-2/3" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <AnimatePresence>
                                <div className={`grid gap-6 ${
                                    viewMode === 'grid' 
                                        ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                                        : 'grid-cols-1'
                                }`}>
                                    {filteredProducts.map((product) => (
                                        <motion.div
                                            key={product.id}
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <ProductCard
                                                product={product}
                                                userFavorites={userFavorites}
                                                user={user}
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                            </AnimatePresence>
                        )}

                        {!isLoading && filteredProducts.length === 0 && (
                            <div className="text-center py-20">
                                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    No products found
                                </h3>
                                <p className="text-gray-600">
                                    Try adjusting your search or filter criteria
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}