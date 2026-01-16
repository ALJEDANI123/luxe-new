import About from './pages/About';
import Admin from './pages/Admin';
import AffiliateDisclosure from './pages/AffiliateDisclosure';
import Blog from './pages/Blog';
import BlogAdmin from './pages/BlogAdmin';
import BlogPost from './pages/BlogPost';
import Cart from './pages/Cart';
import Categories from './pages/Categories';
import ContactUs from './pages/ContactUs';
import CookiePolicy from './pages/CookiePolicy';
import EbayDeals from './pages/EbayDeals';
import FAQ from './pages/FAQ';
import Favorites from './pages/Favorites';
import Home from './pages/Home';
import MysteryBox from './pages/MysteryBox';
import Orders from './pages/Orders';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Product from './pages/Product';
import Profile from './pages/Profile';
import QuirkyFinds from './pages/QuirkyFinds';
import Returns from './pages/Returns';
import ShippingInfo from './pages/ShippingInfo';
import Shop from './pages/Shop';
import TermsOfService from './pages/TermsOfService';
import __Layout from './Layout.jsx';


export const PAGES = {
    "About": About,
    "Admin": Admin,
    "AffiliateDisclosure": AffiliateDisclosure,
    "Blog": Blog,
    "BlogAdmin": BlogAdmin,
    "BlogPost": BlogPost,
    "Cart": Cart,
    "Categories": Categories,
    "ContactUs": ContactUs,
    "CookiePolicy": CookiePolicy,
    "EbayDeals": EbayDeals,
    "FAQ": FAQ,
    "Favorites": Favorites,
    "Home": Home,
    "MysteryBox": MysteryBox,
    "Orders": Orders,
    "PrivacyPolicy": PrivacyPolicy,
    "Product": Product,
    "Profile": Profile,
    "QuirkyFinds": QuirkyFinds,
    "Returns": Returns,
    "ShippingInfo": ShippingInfo,
    "Shop": Shop,
    "TermsOfService": TermsOfService,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};