import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Category from "./pages/Category";
import Product from "./pages/Product";
import Search from "./pages/Search";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import TrackOrder from "./pages/TrackOrder";
import KitchenStories from "./pages/KitchenStories";
import OurStory from "./pages/OurStory";
import Recipes from "./pages/Recipes";
import RecipeDetail from "./pages/RecipeDetail";
import Wishlist from "./pages/Wishlist";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import OccasionPlanner from "./pages/OccasionPlanner";
import BuildYourMeal from "./pages/BuildYourMeal";
import SharedTable from "./pages/SharedTable";
import Offers from "./pages/Offers";
import AccountAuth from "./pages/account/AccountAuth";
import RequireAuth from "./components/RequireAuth";
import NotFound from "./pages/NotFound";
import BatchInfo from "./pages/BatchInfo";

import AccountLayout from "./pages/account/AccountLayout";
import AccountHome from "./pages/account/AccountHome";
import Orders from "./pages/account/Orders";
import OrderDetail from "./pages/account/OrderDetail";
import Addresses from "./pages/account/Addresses";
import FoodDNA from "./pages/account/FoodDNA";
import FoodMemory from "./pages/account/FoodMemory";
import Loyalty from "./pages/account/Loyalty";
import Referrals from "./pages/account/Referrals";
import Subscriptions from "./pages/account/Subscriptions";
import { useCatalog } from "./context/CatalogContext";

export default function App() {
  useCatalog();
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/category/:slug" element={<Category />} />
        <Route path="/product/:slug" element={<Product />} />
        <Route path="/search" element={<Search />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/login" element={<AccountAuth />} />
        <Route path="/signup" element={<AccountAuth />} />
        <Route path="/cart" element={<RequireAuth message="Please log in or sign up to use your cart."><Cart /></RequireAuth>} />
        <Route path="/checkout" element={<RequireAuth message="Please log in or sign up to place your order."><Checkout /></RequireAuth>} />
        <Route path="/order/:id" element={<OrderConfirmation />} />
        <Route path="/track-order" element={<TrackOrder />} />
        <Route path="/kitchen-stories" element={<KitchenStories />} />
        <Route path="/our-story" element={<OurStory />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/recipes/:slug" element={<RecipeDetail />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/occasion-planner" element={<OccasionPlanner />} />
        <Route path="/build-your-meal" element={<BuildYourMeal />} />
        <Route path="/shared-table" element={<SharedTable />} />
        <Route path="/batch/:batchId" element={<BatchInfo />} />

        <Route path="/account" element={<AccountLayout />}>
          <Route index element={<AccountHome />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/:id" element={<OrderDetail />} />
          <Route path="addresses" element={<Addresses />} />
          <Route path="food-dna" element={<FoodDNA />} />
          <Route path="food-memory" element={<FoodMemory />} />
          <Route path="loyalty" element={<Loyalty />} />
          <Route path="referrals" element={<Referrals />} />
          <Route path="subscriptions" element={<Subscriptions />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
