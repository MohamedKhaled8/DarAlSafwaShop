import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/CartContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";
import HomePage from "@/pages/HomePage";
import CategoryPage from "@/pages/CategoryPage";
import ProductPage from "@/pages/ProductPage";
import CartPage from "@/pages/CartPage";
import PrintingPage from "@/pages/PrintingPage";
import GiftsPage from "@/pages/GiftsPage";
import DashboardPage from "@/pages/DashboardPage";
import NotFound from "@/pages/NotFound";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import CheckoutPage from "@/pages/CheckoutPage";
import InvoicePage from "@/pages/InvoicePage";
import MyOrdersPage from "@/pages/MyOrdersPage";
import { AuthProvider } from "@/contexts/AuthContext";
import AdminLayout from "@/pages/admin/AdminLayout";
import OverviewPage from "@/pages/admin/OverviewPage";
import ProductsManagement from "@/pages/admin/ProductsManagement";
import OrdersManagement from "@/pages/admin/OrdersManagement";
import CustomersPage from "@/pages/admin/CustomersPage";
import CategoriesManagement from "@/pages/admin/CategoriesManagement";
import AnalyticsPage from "@/pages/admin/AnalyticsPage";
import AdminPrintingPage from "@/pages/admin/AdminPrintingPage";
import AdminGiftsPage from "@/pages/admin/AdminGiftsPage";
import SettingsPage from "@/pages/admin/SettingsPage";
import SeedDataPage from "@/pages/admin/SeedDataPage";
import ShippingManagement from "@/pages/admin/ShippingManagement";
import { AdminRoute } from "@/components/AdminRoute";
import ScrollToTop from "@/components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <CartProvider>
              <Routes>
                {/* Auth Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                
                {/* Storefront */}
              <Route path="/" element={<><Navbar /><HomePage /><Footer /><MobileNav /></>} />
              <Route path="/category/:id" element={<><Navbar /><CategoryPage /><Footer /><MobileNav /></>} />
              <Route path="/product/:id" element={<><Navbar /><ProductPage /><Footer /><MobileNav /></>} />
              <Route path="/cart" element={<><Navbar /><CartPage /><Footer /><MobileNav /></>} />
              <Route path="/checkout" element={<><Navbar /><CheckoutPage /><Footer /><MobileNav /></>} />
              <Route path="/invoice/:id" element={<><InvoicePage /><MobileNav /></>} />
              <Route path="/printing" element={<><Navbar /><PrintingPage /><Footer /><MobileNav /></>} />
              <Route path="/gifts" element={<><Navbar /><GiftsPage /><Footer /><MobileNav /></>} />
              <Route path="/dashboard" element={<><Navbar /><DashboardPage /><Footer /><MobileNav /></>} />
              <Route path="/my-orders" element={<><Navbar /><MyOrdersPage /><Footer /><MobileNav /></>} />

              {/* Admin Dashboard */}
              <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                <Route index element={<OverviewPage />} />
                <Route path="products" element={<ProductsManagement />} />
                <Route path="orders" element={<OrdersManagement />} />
                <Route path="customers" element={<CustomersPage />} />
                <Route path="categories" element={<CategoriesManagement />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="printing" element={<AdminPrintingPage />} />
                <Route path="gifts" element={<AdminGiftsPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="shipping" element={<ShippingManagement />} />
                <Route path="seed" element={<SeedDataPage />} />
              </Route>

              <Route path="*" element={<><Navbar /><NotFound /><Footer /><MobileNav /></>} />
            </Routes>
          </CartProvider>
        </BrowserRouter>
      </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
