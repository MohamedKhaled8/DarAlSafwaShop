import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Star, ChevronLeft, ChevronRight, Mail, Truck, Shield, RefreshCw } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { categories, products, testimonials, brands, bannerSlides } from "@/data/products";

const fadeUp = {
  initial: { opacity: 0, y: 16, filter: "blur(4px)" },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
};

const CountdownTimer = () => {
  const [time, setTime] = useState({ h: 5, m: 42, s: 18 });
  useEffect(() => {
    const t = setInterval(() => {
      setTime(prev => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 23; m = 59; s = 59; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="flex gap-2">
      {[
        { v: time.h, l: "HRS" },
        { v: time.m, l: "MIN" },
        { v: time.s, l: "SEC" },
      ].map(({ v, l }) => (
        <div key={l} className="flex flex-col items-center">
          <span className="bg-foreground text-primary-foreground w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold tabular-nums animate-count-pulse">
            {String(v).padStart(2, "0")}
          </span>
          <span className="text-[10px] text-muted-foreground mt-1 font-medium">{l}</span>
        </div>
      ))}
    </div>
  );
};

const HomePage = () => {
  const [slide, setSlide] = useState(0);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const bestSellers = products.filter(p => p.badge === "Best Seller" || p.badge === "Top Rated" || p.rating >= 4.6);
  const deals = products.filter(p => p.originalPrice);

  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % bannerSlides.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <main className="pb-20 lg:pb-0">
      {/* Hero */}
      <section className="relative overflow-hidden bg-hero-gradient text-primary-foreground">
        <div className="section-padding py-16 md:py-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-[1.1] tracking-tight mb-4">
              Your All-in-One Educational Store
            </h1>
            <p className="text-base sm:text-lg opacity-80 mb-8 max-w-lg leading-relaxed">
              Books, electronics, art supplies, and everything you need — all in one place at unbeatable prices.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/category/books" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary-foreground text-primary font-semibold text-sm hover:bg-primary-foreground/90 transition-colors btn-press">
                Shop Now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/category/electronics" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-primary-foreground/30 text-primary-foreground font-semibold text-sm hover:bg-primary-foreground/10 transition-colors btn-press">
                Explore
              </Link>
            </div>
          </motion.div>
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-primary" />
        </div>
      </section>

      {/* Banner slider */}
      <section className="section-padding -mt-6 relative z-10">
        <div className="rounded-2xl overflow-hidden shadow-lg">
          <div className={`${bannerSlides[slide].bg} text-primary-foreground p-8 md:p-12 transition-all duration-500`}>
            <motion.div key={slide} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
              <p className="text-xs font-semibold uppercase tracking-widest opacity-70 mb-2">Limited Time</p>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">{bannerSlides[slide].title}</h2>
              <p className="opacity-80">{bannerSlides[slide].subtitle}</p>
            </motion.div>
            <div className="flex gap-2 mt-4">
              {bannerSlides.map((_, i) => (
                <button key={i} onClick={() => setSlide(i)} className={`w-2 h-2 rounded-full transition-all ${i === slide ? "bg-primary-foreground w-6" : "bg-primary-foreground/40"}`} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <motion.section {...fadeUp} className="section-padding mt-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Truck, label: "Free Shipping", sub: "On orders over $50" },
            { icon: Shield, label: "Secure Payment", sub: "100% protected" },
            { icon: RefreshCw, label: "Easy Returns", sub: "30-day policy" },
            { icon: Star, label: "Top Quality", sub: "Verified products" },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
              <div className="p-2.5 rounded-lg bg-primary/10">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">{label}</p>
                <p className="text-xs text-muted-foreground">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Categories */}
      <motion.section {...fadeUp} className="section-padding mt-14">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold">Shop by Category</h2>
          <Link to="/category/books" className="text-sm text-primary font-medium hover:underline">View All</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
            >
              <Link
                to={`/category/${cat.id}`}
                className="group relative block aspect-[4/3] rounded-xl overflow-hidden"
              >
                <img src={cat.image} alt={cat.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-primary-foreground font-semibold text-sm">{cat.name}</p>
                  <p className="text-primary-foreground/70 text-xs">{cat.count} items</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Best Sellers */}
      <motion.section {...fadeUp} className="section-padding mt-14">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold">Best Sellers</h2>
        </div>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
          {bestSellers.map((p, i) => (
            <div key={p.id} className="min-w-[240px] max-w-[240px]">
              <ProductCard product={p} index={i} />
            </div>
          ))}
        </div>
      </motion.section>

      {/* Deals with Countdown */}
      <motion.section {...fadeUp} className="section-padding mt-14">
        <div className="bg-accent/10 rounded-2xl p-6 md:p-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold">Flash Deals</h2>
              <p className="text-sm text-muted-foreground">Hurry! These deals end soon</p>
            </div>
            <CountdownTimer />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {deals.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </motion.section>

      {/* Recommended */}
      <motion.section {...fadeUp} className="section-padding mt-14">
        <h2 className="text-xl md:text-2xl font-bold mb-1">Recommended For You</h2>
        <p className="text-sm text-muted-foreground mb-6">Based on trending products</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.slice(0, 8).map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </motion.section>

      {/* Testimonials */}
      <motion.section {...fadeUp} className="section-padding mt-14">
        <h2 className="text-xl md:text-2xl font-bold mb-6 text-center">What Our Customers Say</h2>
        <div className="relative max-w-xl mx-auto">
          <motion.div
            key={testimonialIdx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-card rounded-2xl p-8 border border-border text-center"
          >
            <div className="flex justify-center gap-1 mb-4">
              {Array.from({ length: testimonials[testimonialIdx].rating }).map((_, i) => (
                <Star key={i} className="w-4 h-4 text-accent fill-accent" />
              ))}
            </div>
            <p className="text-sm leading-relaxed mb-4 italic">"{testimonials[testimonialIdx].text}"</p>
            <p className="font-semibold text-sm">{testimonials[testimonialIdx].name}</p>
            <p className="text-xs text-muted-foreground">{testimonials[testimonialIdx].role}</p>
          </motion.div>
          <div className="flex justify-center gap-3 mt-4">
            <button onClick={() => setTestimonialIdx(i => (i - 1 + testimonials.length) % testimonials.length)} className="p-2 rounded-full bg-secondary hover:bg-muted transition-colors btn-press">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => setTestimonialIdx(i => (i + 1) % testimonials.length)} className="p-2 rounded-full bg-secondary hover:bg-muted transition-colors btn-press">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.section>

      {/* Brands */}
      <motion.section {...fadeUp} className="section-padding mt-14 overflow-hidden">
        <h2 className="text-xl md:text-2xl font-bold mb-6 text-center">Trusted Brands</h2>
        <div className="relative">
          <div className="flex animate-slide-left whitespace-nowrap">
            {[...brands, ...brands].map((b, i) => (
              <span key={i} className="inline-block px-8 py-3 text-muted-foreground font-semibold text-sm">{b}</span>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Newsletter */}
      <motion.section {...fadeUp} className="section-padding mt-14">
        <div className="bg-hero-gradient rounded-2xl p-8 md:p-12 text-primary-foreground text-center">
          <Mail className="w-8 h-8 mx-auto mb-3 opacity-80" />
          <h2 className="text-xl md:text-2xl font-bold mb-2">Stay Updated</h2>
          <p className="opacity-80 text-sm mb-6 max-w-md mx-auto">Get the latest deals, new arrivals, and exclusive offers delivered to your inbox.</p>
          <div className="flex max-w-md mx-auto gap-2">
            <input type="email" placeholder="Your email address" className="flex-1 px-4 py-3 rounded-full text-sm text-foreground bg-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary-foreground/50" />
            <button className="px-6 py-3 rounded-full bg-accent text-accent-foreground font-semibold text-sm hover:bg-accent/90 transition-colors btn-press">
              Subscribe
            </button>
          </div>
        </div>
      </motion.section>
    </main>
  );
};

export default HomePage;
