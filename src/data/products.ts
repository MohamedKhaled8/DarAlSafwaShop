export interface Product {
  id: string;
  name: string;
  /** Arabic product title (Firestore / admin). Falls back to `name` when empty. */
  nameAr?: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  rating: number;
  reviews: number;
  badge?: string;
  description: string;
  /** Arabic description; falls back to `description` when empty. */
  descriptionAr?: string;
  specs: Record<string, string>;
  inStock: boolean;
  isFlashSale?: boolean;
}

export interface Category {
  id: string;
  name: string;
  /** Arabic category title; falls back to seed catalog match or `name`. */
  nameAr?: string;
  icon: string;
  image: string;
  count: number;
  slug: string;
}

export const categories: Category[] = [
  { id: "books", slug: "books", name: "كتب", icon: "BookOpen", image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80", count: 342 },
  { id: "educational", slug: "educational", name: "مواد تعليمية", icon: "GraduationCap", image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80", count: 128 },
  { id: "electronics", slug: "electronics", name: "إلكترونيات", icon: "Laptop", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=80", count: 256 },
  { id: "toys", slug: "toys", name: "ألعاب", icon: "Gamepad2", image: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&q=80", count: 189 },
  { id: "gifts", slug: "gifts", name: "هدايا", icon: "Gift", image: "https://images.unsplash.com/photo-1549465220-1a8b9238f760?w=400&q=80", count: 94 },
  { id: "art", slug: "art", name: "أدوات فنية", icon: "Palette", image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&q=80", count: 167 },
  { id: "office", slug: "office", name: "أدوات مكتبية", icon: "PenTool", image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&q=80", count: 213 },
  { id: "digital", slug: "digital", name: "منتجات رقمية", icon: "Download", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80", count: 76 },
];

export const products: Product[] = [
  {
    id: "1", name: "Advanced Mathematics Textbook", price: 45.99, originalPrice: 59.99, image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80",
    category: "books", rating: 4.7, reviews: 234, badge: "Best Seller",
    description: "Comprehensive mathematics textbook covering algebra, calculus, and statistics. Perfect for university students.", specs: { Pages: "856", Edition: "5th", Language: "English", ISBN: "978-0134685991" }, inStock: true,
  },
  {
    id: "2", name: "Wireless Bluetooth Headphones", price: 89.99, originalPrice: 129.99, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
    category: "electronics", rating: 4.5, reviews: 1872, badge: "Deal",
    description: "Premium noise-cancelling headphones with 30-hour battery life and crystal-clear sound.", specs: { Battery: "30 hours", Bluetooth: "5.3", Weight: "250g", Driver: "40mm" }, inStock: true,
  },
  {
    id: "3", name: "Watercolor Paint Set - 48 Colors", price: 34.99, image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&q=80",
    category: "art", rating: 4.8, reviews: 567,
    description: "Professional-grade watercolor set with 48 vibrant colors. Includes mixing palette and 3 brushes.", specs: { Colors: "48", Type: "Watercolor", Includes: "Palette, 3 brushes", Level: "All levels" }, inStock: true,
  },
  {
    id: "4", name: "STEM Building Blocks - 500 Pieces", price: 54.99, originalPrice: 69.99, image: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&q=80",
    category: "toys", rating: 4.6, reviews: 891, badge: "Top Rated",
    description: "Educational building blocks that spark creativity. Compatible with major brands.", specs: { Pieces: "500", "Age Range": "6-14", Material: "ABS Plastic", Theme: "STEM" }, inStock: true,
  },
  {
    id: "5", name: "Premium Fountain Pen Set", price: 28.99, image: "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=400&q=80",
    category: "office", rating: 4.4, reviews: 345,
    description: "Elegant fountain pen set with 3 nibs and 12 ink cartridges. Perfect for professionals.", specs: { Nibs: "3 (Fine, Medium, Broad)", Ink: "12 cartridges", Material: "Brass", Weight: "32g" }, inStock: true,
  },
  {
    id: "6", name: "Physics Lab Manual", price: 29.99, image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&q=80",
    category: "educational", rating: 4.3, reviews: 156,
    description: "Complete physics lab manual with 40 experiments. Includes safety guidelines and result templates.", specs: { Experiments: "40", Pages: "320", Level: "University", Format: "Spiral-bound" }, inStock: true,
  },
  {
    id: "7", name: "Personalized Photo Frame", price: 19.99, originalPrice: 24.99, image: "https://images.unsplash.com/photo-1549465220-1a8b9238f760?w=400&q=80",
    category: "gifts", rating: 4.9, reviews: 2103, badge: "Popular",
    description: "Beautiful wooden photo frame with custom engraving. A perfect gift for any occasion.", specs: { Material: "Oak Wood", Size: "8x10 inches", Finish: "Matte", Engraving: "Up to 50 chars" }, inStock: true,
  },
  {
    id: "8", name: "Digital Study Planner", price: 9.99, image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80",
    category: "digital", rating: 4.6, reviews: 432,
    description: "Comprehensive digital planner with timetable, habit tracker, and grade calculator.", specs: { Format: "PDF", Pages: "120", Compatible: "iPad, Tablet", Features: "Hyperlinked" }, inStock: true,
  },
  {
    id: "9", name: "Organic Chemistry Textbook", price: 52.99, originalPrice: 65.00, image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&q=80",
    category: "books", rating: 4.5, reviews: 189, badge: "New",
    description: "Latest edition covering organic chemistry fundamentals with 3D molecular visualizations.", specs: { Pages: "740", Edition: "8th", Access: "Online portal included", Language: "English" }, inStock: true,
  },
  {
    id: "10", name: "10-inch Android Tablet", price: 199.99, originalPrice: 249.99, image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80",
    category: "electronics", rating: 4.2, reviews: 678, badge: "Deal",
    description: "Lightweight tablet perfect for students. Includes stylus and protective case.", specs: { Display: "10.1\" IPS", Storage: "64GB", RAM: "4GB", Battery: "8000mAh" }, inStock: true,
  },
  {
    id: "11", name: "Sketch Pencil Set - 24 Grade", price: 18.99, image: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400&q=80",
    category: "art", rating: 4.7, reviews: 823,
    description: "Professional sketching pencils from 6H to 8B. Includes blending stumps and eraser.", specs: { Grades: "6H to 8B", Count: "24", Case: "Metal tin", Extras: "3 blending stumps" }, inStock: true,
  },
  {
    id: "12", name: "Strategy Board Game Collection", price: 39.99, image: "https://images.unsplash.com/photo-1611371805429-8b5c1b2c34ba?w=400&q=80",
    category: "toys", rating: 4.8, reviews: 445, badge: "Best Seller",
    description: "Collection of 5 classic strategy games. Great for family game nights.", specs: { Games: "5", Players: "2-6", "Age Range": "8+", Material: "Wood & cardboard" }, inStock: true,
  },
];

export const testimonials = [
  { id: 1, name: "Sarah Mitchell", role: "University Student", text: "Found all my textbooks at amazing prices. The delivery was fast and the quality exceeded my expectations!", rating: 5 },
  { id: 2, name: "Ahmed Hassan", role: "Teacher", text: "The educational materials section is a goldmine. I recommend this store to all my colleagues.", rating: 5 },
  { id: 3, name: "Priya Sharma", role: "Parent", text: "My kids love the toys section. Great quality and the gift wrapping service is a nice touch.", rating: 4 },
  { id: 4, name: "Marcus Chen", role: "Art Student", text: "Best art supplies online. The watercolor set is professional quality at a student-friendly price.", rating: 5 },
];

export const brands = [
  "Penguin Books", "Canon", "Faber-Castell", "LEGO", "Moleskine", "Staedtler", "Casio", "Oxford", "Crayola", "HP",
];

export const bannerSlides = [
  { id: 1, title: "Back to School Sale", subtitle: "Up to 40% off textbooks & supplies", tag: "Limited Time", image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&q=80", link: "/category/books" },
  { id: 2, title: "New Electronics Arrivals", subtitle: "Latest tablets & accessories", tag: "New Arrivals", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80", link: "/category/electronics" },
  { id: 3, title: "Art Supplies Week", subtitle: "Free brush set with orders over $50", tag: "Special Offer", image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80", link: "/category/art" },
];
