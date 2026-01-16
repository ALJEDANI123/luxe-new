import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Heart, Star } from 'lucide-react';
import { Favorite } from '@/entities/Favorite';
import { base44 } from '@/api/base44Client';
import { formatPrice, getFallbackImage } from '@/components/utils/helpers';

export default function ProductCard({ product, onFavoriteChange, userFavorites, user }) {
    const [isFavorite, setIsFavorite] = useState(false);
    const [favoriteId, setFavoriteId] = useState(null);

    useEffect(() => {
        if (userFavorites) {
            const favorite = userFavorites.find(f => f.product_id === product.id);
            if (favorite) {
                setIsFavorite(true);
                setFavoriteId(favorite.id);
            } else {
                setIsFavorite(false);
                setFavoriteId(null);
            }
        }
    }, [userFavorites, product.id]);

    const toggleFavorite = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!user) {
            base44.auth.redirectToLogin();
            return;
        }

        if (isFavorite) {
            await Favorite.delete(favoriteId);
            setIsFavorite(false);
            setFavoriteId(null);
        } else {
            const newFavorite = await Favorite.create({
                user_email: user.email,
                product_id: product.id
            });
            setIsFavorite(true);
            setFavoriteId(newFavorite.id);
        }
        
        if (onFavoriteChange) {
            onFavoriteChange();
        }
    };

    
    const [imgSrc, setImgSrc] = React.useState(product.images?.[0] || getFallbackImage(product.id));
    const [imageLoaded, setImageLoaded] = React.useState(false);

    const handleImageError = () => {
        setImgSrc(getFallbackImage(product.id));
    };

    return (
        <motion.div 
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden h-full flex flex-col group border-0"
            whileHover={{ y: -5 }}
        >
            <div className="relative">
                <a href={product.affiliateUrl} target="_blank" rel="nofollow sponsored noopener">
                    {!imageLoaded && (
                        <div className="w-full h-56 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse"></div>
                    )}
                    <img 
                        src={imgSrc} 
                        alt={product.title} 
                        loading="lazy"
                        className={`w-full h-56 object-cover group-hover:scale-105 transition-all duration-300 ${!imageLoaded ? 'opacity-0 absolute' : 'opacity-100'}`}
                        onError={handleImageError}
                        onLoad={() => setImageLoaded(true)}
                    />
                </a>
                <Button 
                    size="icon" 
                    variant="ghost" 
                    className="absolute top-2 right-2 bg-white/90 hover:bg-white rounded-full shadow-lg"
                    onClick={toggleFavorite}
                >
                    <Heart 
                        className={`w-5 h-5 transition-all ${
                            isFavorite 
                                ? 'fill-pink-500 text-pink-500' 
                                : 'text-gray-500 hover:text-pink-500'
                        }`} 
                    />
                </Button>
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-bold text-lg line-clamp-2 h-14">{product.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1 mb-2">{product.subtitle}</p>
                
                <div className="flex items-center gap-2 text-sm mb-2">
                    <div className="flex items-center text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="font-bold ml-1">{product.rating}</span>
                    </div>
                    <span className="text-gray-400">({product.reviewsCount} reviews)</span>
                </div>
                
                <div className="flex items-baseline gap-2 mb-4">
                    <p className="text-2xl font-black text-[var(--color-purple)]">{formatPrice(product.price)}</p>
                    {product.oldPrice && <p className="text-md line-through text-gray-400">{formatPrice(product.oldPrice)}</p>}
                </div>
                
                <div className="mt-auto">
                    <a href={product.affiliateUrl} target="_blank" rel="nofollow sponsored noopener" className="block">
                        <Button className="w-full font-bold bg-[var(--color-pink)] hover:bg-pink-600 rounded-full">
                            View on {product.marketplace}
                        </Button>
                    </a>
                </div>
            </div>
        </motion.div>
    );
}