import React from 'react';

export default function LoadingSpinner({ size = 'default' }) {
    const sizeClasses = size === 'small' ? 'w-10 h-10' : 'w-20 h-20';
    
    return (
        <div className="flex justify-center items-center py-16">
            <div className={`relative ${sizeClasses}`}>
                <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[var(--color-purple)] border-r-[var(--color-pink)] animate-spin"></div>
                <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-[var(--color-orange)] border-r-[var(--color-yellow)] animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
            </div>
        </div>
    );
}