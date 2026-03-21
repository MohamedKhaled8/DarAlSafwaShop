import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/CartContext";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <CartProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/category/:id" element={<CategoryPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/printing" element={<PrintingPage />} />
            <Route path="/gifts" element={<GiftsPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
          <MobileNav />
        </CartProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
