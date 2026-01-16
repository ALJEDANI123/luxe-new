import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { createPageUrl } from './utils';
import { base44 } from './api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './components/ui/button';
import { Heart, Menu, Moon, Search, Sun, X, Facebook, Instagram, Twitter, Youtube, Mail, User } from 'lucide-react';
import SearchModal from './components/SearchModal';

const LOGO_URL = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/689ae265af9a727524928c44/5458391d7_1.png";

function LayoutContent({ children }) {
    const [user, setUser] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    const navItems = [
                { title: 'Home', href: createPageUrl('Home') },
                { title: 'Quirky Finds', href: createPageUrl('QuirkyFinds') },
                { title: 'Categories', href: createPageUrl('Categories') },
                { title: 'eBay Deals', href: createPageUrl('EbayDeals') },
                { title: 'Mystery Box', href: createPageUrl('MysteryBox') },
                { title: 'Blog', href: createPageUrl('Blog') },
                { title: 'About', href: createPageUrl('About') },
            ];

    useEffect(() => {
        // Check if font links already exist to avoid duplicates
        const existingNotoSans = document.querySelector('link[href*="Noto+Sans"]');
        const existingTradeWinds = document.querySelector('link[href*="Trade+Winds"]');

        if (!existingNotoSans || !existingTradeWinds) {
            // Add preconnect for faster font loading
            const preconnect1 = document.createElement('link');
            preconnect1.rel = 'preconnect';
            preconnect1.href = 'https://fonts.googleapis.com';
            document.head.insertBefore(preconnect1, document.head.firstChild);

            const preconnect2 = document.createElement('link');
            preconnect2.rel = 'preconnect';
            preconnect2.href = 'https://fonts.gstatic.com';
            preconnect2.setAttribute('crossorigin', 'anonymous');
            document.head.insertBefore(preconnect2, document.head.firstChild);

            // Load Noto Sans font
            const fontLink = document.createElement('link');
            fontLink.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap';
            fontLink.rel = 'stylesheet';
            document.head.appendChild(fontLink);

            // Load Trade Winds font
            const tradeWindsLink = document.createElement('link');
            tradeWindsLink.href = 'https://fonts.googleapis.com/css2?family=Trade+Winds&display=swap';
            tradeWindsLink.rel = 'stylesheet';
            document.head.appendChild(tradeWindsLink);
        }

        base44.auth.me().then(setUser).catch(() => setUser(null));
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme === 'dark') {
            setIsDarkMode(true);
        }
    }, []);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);
    
    const toggleTheme = () => setIsDarkMode(!isDarkMode);





    return (
        <>
            <style>{`
                :root {
                    --color-pink: #FF3FA4;
                    --color-yellow: #FFC533;
                    --color-orange: #FF7A00;
                    --color-blue: #2AA1FF;
                    --color-teal: #16C3A3;
                    --color-purple: #7A3FFF;
                    --color-dark: #1E1E1E;
                    --color-off-white: #FFF7FB;
                }
                
                * {
                    font-family: 'Noto Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
                }
            `}</style>
            <div className="min-h-screen bg-off-white dark:bg-gray-900 text-dark dark:text-off-white transition-colors duration-300">
                
                <Header 
                    user={user} 
                    isDarkMode={isDarkMode} 
                    toggleTheme={toggleTheme} 
                    isMenuOpen={isMenuOpen} 
                    setIsMenuOpen={setIsMenuOpen}
                    isSearchOpen={isSearchOpen}
                    setIsSearchOpen={setIsSearchOpen}
                    location={location}
                    navItems={navItems}
                />
                
                <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
                
                <main className="relative overflow-hidden z-0">
                    {/* Background decorations */}
                    <div className="absolute top-0 left-0 w-full h-full z-[-1] opacity-50 dark:opacity-20">
                        <div className="absolute top-[10%] left-[5%] w-32 h-32 bg-pink-500/10 rounded-full filter blur-2xl"></div>
                        <div className="absolute top-[20%] right-[10%] w-48 h-48 bg-purple-500/10 rounded-full filter blur-3xl"></div>
                        <div className="absolute bottom-[15%] left-[20%] w-24 h-24 bg-yellow-500/10 rounded-full filter blur-2xl"></div>
                    </div>
                    {children}
                </main>

                <Footer />
            </div>
        </>
    );
}

export default function Layout({ children }) {
    return <LayoutContent>{children}</LayoutContent>;
}

const Header = ({ user, isDarkMode, toggleTheme, isMenuOpen, setIsMenuOpen, isSearchOpen, setIsSearchOpen, location, navItems }) => {
    const navigate = useNavigate();
    
    return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
                <Link to={createPageUrl('Home')} className="flex items-center">
                    <img src={LOGO_URL} alt="BagiLand Logo" className="h-20 sm:h-24 md:h-32 object-contain" />
                </Link>

                <nav className="hidden md:flex items-center gap-6">
                    {navItems.map(item => (
                        <motion.div key={item.title} whileHover={{ y: -3 }}>
                            <Link to={item.href} className={`font-bold text-lg transition-colors ${location.pathname === item.href ? 'text-[var(--color-pink)]' : 'hover:text-[var(--color-pink)]'}`}>
                                {item.title}
                            </Link>
                        </motion.div>
                    ))}
                </nav>

                <div className="flex items-center space-x-2 sm:space-x-4">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="rounded-full"
                        onClick={() => setIsSearchOpen(true)}
                    >
                        <Search className="h-6 w-6" />
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="rounded-full"
                        onClick={() => navigate(createPageUrl('Favorites'))}
                    >
                        <Heart className="h-6 w-6" />
                    </Button>
                    <Button onClick={toggleTheme} variant="ghost" size="icon" className="rounded-full">
                        {isDarkMode ? <Sun className="h-6 w-6 text-yellow-400" /> : <Moon className="h-6 w-6 text-purple-400" />}
                    </Button>
                    {user ? (
                        <Button 
                            variant="ghost" 
                            size="icon"
                            className="rounded-full"
                            onClick={() => navigate(createPageUrl('Profile'))}
                        >
                            <User className="h-6 w-6" />
                        </Button>
                    ) : (
                        <Button 
                            variant="ghost" 
                            size="icon"
                            className="rounded-full"
                            onClick={() => base44.auth.redirectToLogin()}
                        >
                            <User className="h-6 w-6" />
                        </Button>
                    )}
                    <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </Button>
                </div>
            </div>
        </div>
        <AnimatePresence>
            {isMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="md:hidden bg-white dark:bg-gray-800 py-4"
                >
                    <nav className="flex flex-col items-center space-y-4">
                        {navItems.map(item => (
                            <Link key={item.title} to={item.href} className="font-bold text-lg" onClick={() => setIsMenuOpen(false)}>{item.title}</Link>
                        ))}
                    </nav>
                </motion.div>
            )}
        </AnimatePresence>
    </header>
    );
};

const Footer = () => (
    <footer className="relative bg-gradient-to-b from-white via-pink-50 to-purple-100 dark:from-gray-900 dark:via-purple-950 dark:to-gray-900 mt-24 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-30">
            <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-pink-300 to-purple-300 rounded-full filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-yellow-300 to-orange-300 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
            {/* Newsletter Section */}
            <motion.div 
                className="relative rounded-3xl p-8 md:p-12 mb-16 shadow-2xl overflow-hidden"
                style={{
                    backgroundImage: 'url(https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/689ae265af9a727524928c44/500bb7b3c_news-letter.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
                <div className="relative z-10 max-w-3xl mx-auto text-center text-white">
                    <h3 className="text-3xl md:text-5xl font-black mb-4">
                        Join the Fun! 🎪✨
                    </h3>
                    <p className="text-lg md:text-xl mb-8 opacity-90">
                        Get exclusive deals and quirky finds delivered to your inbox weekly
                    </p>
                    <form className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
                        <div className="flex-1 relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input 
                                type="email" 
                                placeholder="your.email@example.com" 
                                className="w-full h-14 pl-12 pr-4 rounded-full text-gray-900 bg-white shadow-lg focus:outline-none focus:ring-4 focus:ring-yellow-300 transition-all"
                            />
                        </div>
                        <Button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-black px-8 h-14 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
                            Subscribe Now
                        </Button>
                    </form>
                </div>
            </motion.div>

            {/* Main Footer Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                {/* Brand Column */}
                <div className="lg:col-span-1">
                    <img src={LOGO_URL} alt="BagiLand" className="h-28 mb-6" />
                    <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                        Your destination for weird, wonderful, and wildly unique products from around the web.
                    </p>
                    <div className="flex gap-3">
                        <motion.a 
                            href="#" 
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all"
                        >
                            <Facebook className="w-5 h-5" />
                        </motion.a>
                        <motion.a 
                            href="#" 
                            whileHover={{ scale: 1.1, rotate: -5 }}
                            className="w-11 h-11 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all"
                        >
                            <Instagram className="w-5 h-5" />
                        </motion.a>
                        <motion.a 
                            href="#" 
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all"
                        >
                            <Twitter className="w-5 h-5" />
                        </motion.a>
                        <motion.a 
                            href="#" 
                            whileHover={{ scale: 1.1, rotate: -5 }}
                            className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all"
                        >
                            <Youtube className="w-5 h-5" />
                        </motion.a>
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 className="text-xl font-black text-gray-900 dark:text-white mb-6 relative inline-block">
                        Quick Links
                        <span className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"></span>
                    </h4>
                    <div className="space-y-3">
                        <Link to={createPageUrl('Home')} className="block text-gray-700 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400 transition-colors font-medium hover:translate-x-1 transform duration-200">→ Home</Link>
                        <Link to={createPageUrl('Categories')} className="block text-gray-700 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400 transition-colors font-medium hover:translate-x-1 transform duration-200">→ Categories</Link>
                        <Link to={createPageUrl('MysteryBox')} className="block text-gray-700 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400 transition-colors font-medium hover:translate-x-1 transform duration-200">→ Mystery Box</Link>
                        <Link to={createPageUrl('About')} className="block text-gray-700 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400 transition-colors font-medium hover:translate-x-1 transform duration-200">→ About Us</Link>
                    </div>
                </div>

                {/* Customer Care */}
                <div>
                    <h4 className="text-xl font-black text-gray-900 dark:text-white mb-6 relative inline-block">
                        Customer Care
                        <span className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"></span>
                    </h4>
                    <div className="space-y-3">
                        <Link to={createPageUrl('ContactUs')} className="block text-gray-700 dark:text-gray-300 hover:text-purple-500 dark:hover:text-purple-400 transition-colors font-medium hover:translate-x-1 transform duration-200">→ Contact Us</Link>
                        <Link to={createPageUrl('ShippingInfo')} className="block text-gray-700 dark:text-gray-300 hover:text-purple-500 dark:hover:text-purple-400 transition-colors font-medium hover:translate-x-1 transform duration-200">→ Shipping Info</Link>
                        <Link to={createPageUrl('Returns')} className="block text-gray-700 dark:text-gray-300 hover:text-purple-500 dark:hover:text-purple-400 transition-colors font-medium hover:translate-x-1 transform duration-200">→ Returns</Link>
                        <Link to={createPageUrl('FAQ')} className="block text-gray-700 dark:text-gray-300 hover:text-purple-500 dark:hover:text-purple-400 transition-colors font-medium hover:translate-x-1 transform duration-200">→ FAQ</Link>
                    </div>
                </div>

                {/* Legal */}
                <div>
                    <h4 className="text-xl font-black text-gray-900 dark:text-white mb-6 relative inline-block">
                        Legal
                        <span className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"></span>
                    </h4>
                    <div className="space-y-3">
                        <Link to={createPageUrl('PrivacyPolicy')} className="block text-gray-700 dark:text-gray-300 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors font-medium hover:translate-x-1 transform duration-200">→ Privacy Policy</Link>
                        <Link to={createPageUrl('TermsOfService')} className="block text-gray-700 dark:text-gray-300 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors font-medium hover:translate-x-1 transform duration-200">→ Terms of Service</Link>
                        <Link to={createPageUrl('CookiePolicy')} className="block text-gray-700 dark:text-gray-300 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors font-medium hover:translate-x-1 transform duration-200">→ Cookie Policy</Link>
                        <Link to={createPageUrl('AffiliateDisclosure')} className="block text-gray-700 dark:text-gray-300 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors font-medium hover:translate-x-1 transform duration-200">→ Affiliate Disclosure</Link>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t-2 border-gray-300 dark:border-gray-700 pt-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
                    <p className="text-gray-700 dark:text-gray-300 font-medium">
                        © {new Date().getFullYear()} <span className="font-black bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">BagiLand</span>. Made with 💜 and chaos.
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        As an Amazon Associate, we earn from qualifying purchases.
                    </p>
                </div>
            </div>
        </div>
    </footer>
);