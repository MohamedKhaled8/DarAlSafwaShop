import { Link } from "react-router-dom";
import { categories } from "@/data/products";

const Footer = () => (
  <footer className="bg-foreground text-primary-foreground mt-16">
    <div className="section-padding py-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">E</span>
            </div>
            <span className="font-bold">EduStore</span>
          </div>
          <p className="text-sm opacity-60 leading-relaxed">Your all-in-one educational store for books, supplies, electronics and more.</p>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-3">Categories</h4>
          <ul className="space-y-2">
            {categories.slice(0, 5).map(c => (
              <li key={c.id}><Link to={`/category/${c.id}`} className="text-sm opacity-60 hover:opacity-100 transition-opacity">{c.name}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-3">Services</h4>
          <ul className="space-y-2">
            <li><Link to="/printing" className="text-sm opacity-60 hover:opacity-100 transition-opacity">Printing</Link></li>
            <li><Link to="/gifts" className="text-sm opacity-60 hover:opacity-100 transition-opacity">Custom Gifts</Link></li>
            <li><Link to="/dashboard" className="text-sm opacity-60 hover:opacity-100 transition-opacity">My Account</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-3">Support</h4>
          <ul className="space-y-2">
            <li><span className="text-sm opacity-60">Help Center</span></li>
            <li><span className="text-sm opacity-60">Returns</span></li>
            <li><span className="text-sm opacity-60">Contact Us</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 mt-10 pt-6 text-center">
        <p className="text-xs opacity-40">© 2026 EduStore. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
