/**
 * Massive seed data — 50 dummy products + 8 categories
 * Covers books, electronics, toys, gifts, art, office, educational, digital
 * All images from Unsplash (free-to-use)
 */
import type { Product, Category } from "@/data/products";

export const seedCategories: Category[] = [
  { id: "books", slug: "books", name: "كتب", icon: "BookOpen", image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80", count: 0 },
  { id: "educational", slug: "educational", name: "مواد تعليمية", icon: "GraduationCap", image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80", count: 0 },
  { id: "electronics", slug: "electronics", name: "إلكترونيات", icon: "Laptop", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=80", count: 0 },
  { id: "toys", slug: "toys", name: "ألعاب", icon: "Gamepad2", image: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&q=80", count: 0 },
  { id: "gifts", slug: "gifts", name: "هدايا", icon: "Gift", image: "https://images.unsplash.com/photo-1549465220-1a8b9238f760?w=400&q=80", count: 0 },
  { id: "art", slug: "art", name: "أدوات فنية", icon: "Palette", image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&q=80", count: 0 },
  { id: "office", slug: "office", name: "أدوات مكتبية", icon: "PenTool", image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&q=80", count: 0 },
  { id: "digital", slug: "digital", name: "منتجات رقمية", icon: "Download", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80", count: 0 },
];

export const seedProducts: Omit<Product, "id">[] = [
  // ═══════════ BOOKS (10) ═══════════
  {
    name: "رواية الخيميائي - باولو كويلو", price: 85, originalPrice: 120,
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80",
    category: "books", rating: 4.8, reviews: 1240, badge: "Best Seller",
    description: "رواية عالمية مترجمة تحكي قصة الراعي الأندلسي سانتياغو في رحلته لاكتشاف كنزه.",
    specs: { "عدد الصفحات": "198", "اللغة": "عربي", "الناشر": "دار الشروق", "الطبعة": "15" }, inStock: true,
  },
  {
    name: "كتاب قواعد العشق الأربعون - إليف شافاق", price: 95, originalPrice: 140,
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&q=80",
    category: "books", rating: 4.7, reviews: 982, badge: "Best Seller",
    description: "رواية تمزج بين الماضي والحاضر في قصة حب صوفية رائعة.",
    specs: { "عدد الصفحات": "352", "اللغة": "عربي", "الناشر": "كلمات", "الطبعة": "10" }, inStock: true,
  },
  {
    name: "كتاب العادات الذرية - جيمس كلير", price: 110, originalPrice: 150,
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&q=80",
    category: "books", rating: 4.9, reviews: 2310, badge: "Top Rated",
    description: "دليل عملي لبناء عادات جيدة والتخلص من العادات السيئة.",
    specs: { "عدد الصفحات": "320", "اللغة": "عربي", "الناشر": "جرير", "الطبعة": "8" }, inStock: true,
  },
  {
    name: "موسوعة الطبخ العربي", price: 180,
    image: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&q=80",
    category: "books", rating: 4.4, reviews: 340,
    description: "أكثر من 500 وصفة عربية أصيلة مع صور توضيحية.",
    specs: { "عدد الصفحات": "640", "اللغة": "عربي", "النوع": "غلاف مقوى" }, inStock: true,
  },
  {
    name: "كتاب تعلم البرمجة بلغة Python", price: 145, originalPrice: 200,
    image: "https://images.unsplash.com/photo-1515879218367-8466d910auj9?w=400&q=80",
    category: "books", rating: 4.6, reviews: 567, badge: "Deal",
    description: "كتاب شامل لتعلم لغة البايثون من الصفر حتى الاحتراف.",
    specs: { "عدد الصفحات": "480", "مستوى": "مبتدئ - متقدم", "اللغة": "عربي" }, inStock: true,
  },
  {
    name: "قصص الأنبياء - ابن كثير", price: 65,
    image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&q=80",
    category: "books", rating: 4.9, reviews: 3200,
    description: "قصص الأنبياء والرسل كاملة بأسلوب سهل وممتع.",
    specs: { "عدد الصفحات": "420", "اللغة": "عربي", "التحقيق": "محقق" }, inStock: true,
  },
  {
    name: "أطلس العالم المصور للأطفال", price: 120,
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80",
    category: "books", rating: 4.5, reviews: 215, badge: "New",
    description: "أطلس ملون بخرائط توضيحية ومعلومات عن كل دول العالم.",
    specs: { "الفئة العمرية": "6-14", "الصفحات": "200", "مصور": "نعم" }, inStock: true,
  },

  // ═══════════ ELECTRONICS (8) ═══════════
  {
    name: "سماعات بلوتوث لاسلكية برو", price: 450, originalPrice: 650,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
    category: "electronics", rating: 4.5, reviews: 1872, badge: "Deal",
    description: "سماعات مع خاصية عزل الضوضاء وبطارية تدوم 30 ساعة.",
    specs: { "البطارية": "30 ساعة", "بلوتوث": "5.3", "الوزن": "250 جرام" }, inStock: true,
  },
  {
    name: "تابلت أندرويد 10 بوصة - 64 جيجا", price: 3200, originalPrice: 4500,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80",
    category: "electronics", rating: 4.2, reviews: 678, badge: "Deal",
    description: "تابلت خفيف الوزن مثالي للطلاب مع قلم رقمي وحافظة.",
    specs: { "الشاشة": "10.1 بوصة IPS", "التخزين": "64 جيجا", "الرام": "4 جيجا" }, inStock: true,
  },
  {
    name: "شاحن سريع USB-C 65 وات", price: 180, originalPrice: 250,
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&q=80",
    category: "electronics", rating: 4.7, reviews: 432,
    description: "شاحن سريع يدعم جميع الأجهزة مع حماية من الشحن الزائد.",
    specs: { "القدرة": "65 وات", "المنافذ": "USB-C + USB-A", "الحماية": "متعددة" }, inStock: true,
  },
  {
    name: "ماوس لاسلكي مريح للعمل", price: 220,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&q=80",
    category: "electronics", rating: 4.3, reviews: 289,
    description: "ماوس مصمم هندسياً لراحة اليد مع بطارية تدوم 6 أشهر.",
    specs: { "الاتصال": "بلوتوث + USB", "البطارية": "6 أشهر", "DPI": "3200" }, inStock: true,
  },
  {
    name: "كيبورد ميكانيكي للبرمجة والكتابة", price: 550, originalPrice: 750,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&q=80",
    category: "electronics", rating: 4.6, reviews: 523, badge: "Deal",
    description: "كيبورد ميكانيكي بسويتشات هادئة وإضاءة RGB قابلة للتخصيص.",
    specs: { "السويتش": "Cherry MX Brown", "الإضاءة": "RGB", "الاتصال": "سلكي + بلوتوث" }, inStock: true,
  },
  {
    name: "باور بانك 20000 مللي أمبير", price: 350, originalPrice: 480,
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&q=80",
    category: "electronics", rating: 4.4, reviews: 1100, badge: "Best Seller",
    description: "باور بانك بسعة كبيرة يشحن هاتفك 5 مرات مع شحن سريع.",
    specs: { "السعة": "20000mAh", "الشحن السريع": "PD 22.5W", "المنافذ": "3" }, inStock: true,
  },
  {
    name: "سبيكر بلوتوث محمول مقاوم للماء", price: 280,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80",
    category: "electronics", rating: 4.5, reviews: 756,
    description: "سبيكر محمول بصوت قوي ومقاوم للماء والغبار IPX7.",
    specs: { "البطارية": "12 ساعة", "المقاومة": "IPX7", "القدرة": "20 وات" }, inStock: true,
  },
  {
    name: "كاميرا ويب HD 1080p للاجتماعات", price: 420,
    image: "https://images.unsplash.com/photo-1587826080692-f3d37c22f5b6?w=400&q=80",
    category: "electronics", rating: 4.1, reviews: 198, badge: "New",
    description: "كاميرا ويب عالية الدقة مع ميكروفون مدمج وضبط تلقائي.",
    specs: { "الدقة": "1080p 30fps", "الميكروفون": "مدمج", "التوافق": "Windows/Mac" }, inStock: true,
  },

  // ═══════════ TOYS (6) ═══════════
  {
    name: "مكعبات بناء STEM - 500 قطعة", price: 320, originalPrice: 450,
    image: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&q=80",
    category: "toys", rating: 4.6, reviews: 891, badge: "Top Rated",
    description: "مكعبات بناء تعليمية تنمي الإبداع والتفكير الهندسي.",
    specs: { "القطع": "500", "العمر": "6-14", "المادة": "ABS بلاستيك" }, inStock: true,
  },
  {
    name: "لعبة لوحية استراتيجية عائلية", price: 180,
    image: "https://images.unsplash.com/photo-1611371805429-8b5c1b2c34ba?w=400&q=80",
    category: "toys", rating: 4.8, reviews: 445, badge: "Best Seller",
    description: "مجموعة من 5 ألعاب استراتيجية كلاسيكية للعائلة.",
    specs: { "الألعاب": "5", "اللاعبين": "2-6", "العمر": "8+" }, inStock: true,
  },
  {
    name: "بازل 1000 قطعة - خريطة العالم", price: 150,
    image: "https://images.unsplash.com/photo-1606503153255-59d5dc394e3e?w=400&q=80",
    category: "toys", rating: 4.4, reviews: 312,
    description: "بازل تعليمي بتصميم خريطة العالم الملونة.",
    specs: { "القطع": "1000", "الحجم": "68×48 سم", "العمر": "10+" }, inStock: true,
  },
  {
    name: "سيارة ريموت كنترول سريعة", price: 280, originalPrice: 380,
    image: "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=400&q=80",
    category: "toys", rating: 4.3, reviews: 534, badge: "Deal",
    description: "سيارة ريموت كنترول بسرعة عالية ومقاومة للصدمات.",
    specs: { "السرعة": "25 كم/س", "البطارية": "قابلة للشحن", "المدى": "50 متر" }, inStock: true,
  },
  {
    name: "مجموعة تلوين وأنشطة للأطفال", price: 95,
    image: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=400&q=80",
    category: "toys", rating: 4.7, reviews: 678,
    description: "مجموعة شاملة للتلوين والرسم والأنشطة الإبداعية.",
    specs: { "المحتويات": "ألوان + كتب تلوين + ملصقات", "العمر": "3-8" }, inStock: true,
  },
  {
    name: "طائرة درون صغيرة للمبتدئين", price: 650, originalPrice: 900,
    image: "https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=400&q=80",
    category: "toys", rating: 4.2, reviews: 234, badge: "Deal",
    description: "درون صغيرة سهلة التحكم مع كاميرا HD.",
    specs: { "الكاميرا": "720p", "مدة الطيران": "15 دقيقة", "المدى": "100 متر" }, inStock: true,
  },

  // ═══════════ GIFTS (5) ═══════════
  {
    name: "برواز صور خشبي مخصص بالاسم", price: 120, originalPrice: 160,
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238f760?w=400&q=80",
    category: "gifts", rating: 4.9, reviews: 2103, badge: "Best Seller",
    description: "برواز من الخشب الطبيعي مع حفر اسمك بالليزر.",
    specs: { "المادة": "خشب بلوط", "المقاس": "20×25 سم", "النقش": "حتى 50 حرف" }, inStock: true,
  },
  {
    name: "مج سيراميك مخصص بالصورة", price: 75,
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&q=80",
    category: "gifts", rating: 4.6, reviews: 890,
    description: "مج سيراميك عالي الجودة مع طباعة صورتك المفضلة.",
    specs: { "السعة": "350 مل", "المادة": "سيراميك", "آمن للميكروويف": "نعم" }, inStock: true,
  },
  {
    name: "صندوق هدايا فاخر - شوكولاتة وورد", price: 350,
    image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400&q=80",
    category: "gifts", rating: 4.8, reviews: 456, badge: "New",
    description: "صندوق هدايا أنيق يحتوي على شوكولاتة فاخرة وورد طبيعي.",
    specs: { "المحتويات": "شوكولاتة + ورد + بطاقة", "الوزن": "1.2 كجم" }, inStock: true,
  },
  {
    name: "ميدالية مفاتيح جلد طبيعي", price: 55,
    image: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=400&q=80",
    category: "gifts", rating: 4.4, reviews: 340,
    description: "ميدالية من الجلد الطبيعي مع حفر الحروف الأولى.",
    specs: { "المادة": "جلد طبيعي", "النقش": "حتى 3 حروف" }, inStock: true,
  },
  {
    name: "دفتر ملاحظات جلد فاخر A5", price: 160, originalPrice: 220,
    image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&q=80",
    category: "gifts", rating: 4.7, reviews: 567, badge: "Deal",
    description: "دفتر ملاحظات بغلاف جلد ناعم مع شريط مرجعي.",
    specs: { "الصفحات": "200", "المقاس": "A5", "المادة": "جلد PU" }, inStock: true,
  },

  // ═══════════ ART SUPPLIES (5) ═══════════
  {
    name: "طقم ألوان مائية 48 لون احترافي", price: 220,
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&q=80",
    category: "art", rating: 4.8, reviews: 567,
    description: "ألوان مائية احترافية مع باليت خلط و3 فرش.",
    specs: { "الألوان": "48", "النوع": "ألوان مائية", "يشمل": "باليت + 3 فرش" }, inStock: true,
  },
  {
    name: "طقم أقلام رصاص رسم 24 درجة", price: 120,
    image: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400&q=80",
    category: "art", rating: 4.7, reviews: 823,
    description: "أقلام رسم احترافية من 6H إلى 8B مع أدوات دمج.",
    specs: { "الدرجات": "6H إلى 8B", "العدد": "24", "العلبة": "معدنية" }, inStock: true,
  },
  {
    name: "كانفاس رسم قطني 5 قطع متنوعة", price: 180,
    image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400&q=80",
    category: "art", rating: 4.5, reviews: 234,
    description: "مجموعة لوحات كانفاس قطنية بمقاسات متنوعة للرسم.",
    specs: { "العدد": "5 قطع", "المقاسات": "20x30, 30x40, 40x50", "المادة": "قطن 100%" }, inStock: true,
  },
  {
    name: "ألوان أكريليك 24 لون مع فرش", price: 165, originalPrice: 220,
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&q=80",
    category: "art", rating: 4.6, reviews: 445, badge: "Deal",
    description: "مجموعة ألوان أكريليك غنية مع مجموعة فرش متنوعة.",
    specs: { "الألوان": "24", "الفرش": "10 قطع", "الحجم": "12 مل لكل لون" }, inStock: true,
  },
  {
    name: "ماركرز كوبيك 36 لون", price: 280, originalPrice: 380,
    image: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400&q=80",
    category: "art", rating: 4.4, reviews: 312, badge: "Deal",
    description: "أقلام ماركر برأسين للرسم والتصميم الجرافيكي.",
    specs: { "الألوان": "36", "الرأس": "عريض + رفيع", "قابلة للإعادة": "نعم" }, inStock: true,
  },

  // ═══════════ OFFICE (5) ═══════════
  {
    name: "طقم أقلام حبر فاخر 3 قطع", price: 180,
    image: "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=400&q=80",
    category: "office", rating: 4.4, reviews: 345,
    description: "طقم أقلام حبر أنيق مع 12 خرطوشة حبر.",
    specs: { "الريش": "3 (رفيع، وسط، عريض)", "الحبر": "12 خرطوشة", "المادة": "نحاس" }, inStock: true,
  },
  {
    name: "منظم مكتب خشبي متعدد الأقسام", price: 250,
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&q=80",
    category: "office", rating: 4.5, reviews: 189,
    description: "منظم مكتبي من الخشب الطبيعي بتصميم عصري وأنيق.",
    specs: { "المادة": "خشب بامبو", "الأقسام": "6", "المقاس": "30×20×15 سم" }, inStock: true,
  },
  {
    name: "دباسة كهربائية أوتوماتيكية", price: 320, originalPrice: 420,
    image: "https://images.unsplash.com/photo-1583484963886-cfe2bff2945f?w=400&q=80",
    category: "office", rating: 4.3, reviews: 156, badge: "Deal",
    description: "دباسة كهربائية تعمل ببطاريات مع سعة 25 ورقة.",
    specs: { "السعة": "25 ورقة", "الطاقة": "بطاريات AA", "دبابيس": "متضمنة" }, inStock: true,
  },
  {
    name: "لوح كتابة أبيض مغناطيسي 60×90", price: 280,
    image: "https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?w=400&q=80",
    category: "office", rating: 4.6, reviews: 234,
    description: "لوح كتابة مغناطيسي بإطار ألومنيوم مع أقلام وممحاة.",
    specs: { "المقاس": "60×90 سم", "الإطار": "ألومنيوم", "يشمل": "3 أقلام + ممحاة" }, inStock: true,
  },
  {
    name: "آلة حاسبة علمية متقدمة", price: 195,
    image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&q=80",
    category: "office", rating: 4.7, reviews: 890, badge: "Best Seller",
    description: "آلة حاسبة علمية بشاشة كبيرة وأكثر من 400 وظيفة.",
    specs: { "الوظائف": "417", "الشاشة": "LCD مزدوجة", "الطاقة": "بطارية + شمسي" }, inStock: true,
  },

  // ═══════════ EDUCATIONAL (4) ═══════════
  {
    name: "كتاب فيزياء تجريبية - 40 تجربة", price: 175,
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&q=80",
    category: "educational", rating: 4.3, reviews: 156,
    description: "كتاب مختبر فيزياء يحتوي على 40 تجربة عملية.",
    specs: { "التجارب": "40", "الصفحات": "320", "المستوى": "جامعي" }, inStock: true,
  },
  {
    name: "مجموعة تعليم الحروف العربية - مغناطيس", price: 85,
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80",
    category: "educational", rating: 4.8, reviews: 567,
    description: "حروف عربية مغناطيسية ملونة للأطفال مع لوح حديدي.",
    specs: { "الأحرف": "28 + أشكال", "العمر": "3-7", "يشمل": "لوح مغناطيسي" }, inStock: true,
  },
  {
    name: "مجسم تشريحي لجسم الإنسان", price: 450,
    image: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=400&q=80",
    category: "educational", rating: 4.5, reviews: 123, badge: "New",
    description: "مجسم تشريحي تعليمي بالأعضاء القابلة للفك والتركيب.",
    specs: { "الارتفاع": "45 سم", "الأجزاء": "15 قطعة", "المادة": "PVC آمن" }, inStock: true,
  },
  {
    name: "طقم تجارب كيمياء منزلية آمنة", price: 220, originalPrice: 300,
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&q=80",
    category: "educational", rating: 4.6, reviews: 345, badge: "Deal",
    description: "مجموعة 30 تجربة كيمياء آمنة يمكن إجراؤها في المنزل.",
    specs: { "التجارب": "30", "العمر": "8+", "يشمل": "أدوات + مواد + كتيب" }, inStock: true,
  },

  // ═══════════ DIGITAL (4) ═══════════
  {
    name: "مخطط دراسي رقمي - PDF تفاعلي", price: 45,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80",
    category: "digital", rating: 4.6, reviews: 432,
    description: "مخطط رقمي شامل مع جدول مذاكرة ومتابعة العادات.",
    specs: { "الصيغة": "PDF", "الصفحات": "120", "متوافق": "آيباد، تابلت" }, inStock: true,
  },
  {
    name: "قوالب عروض تقديمية احترافية - 50 شريحة", price: 35,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80",
    category: "digital", rating: 4.4, reviews: 234,
    description: "50 شريحة PowerPoint احترافية بتصاميم عصرية.",
    specs: { "العدد": "50 شريحة", "الصيغة": "PPTX", "قابلة للتعديل": "نعم" }, inStock: true,
  },
  {
    name: "كورس تصوير فوتوغرافي - فيديو", price: 199, originalPrice: 350,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80",
    category: "digital", rating: 4.7, reviews: 789, badge: "Best Seller",
    description: "كورس شامل لتعلم التصوير الفوتوغرافي من الصفر.",
    specs: { "المدة": "12 ساعة", "الدروس": "45 درس", "اللغة": "عربي" }, inStock: true,
  },
  {
    name: "حزمة أيقونات وتصاميم SVG - 1000 أيقونة", price: 25,
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&q=80",
    category: "digital", rating: 4.3, reviews: 156,
    description: "مجموعة من 1000 أيقونة SVG بتصاميم متنوعة.",
    specs: { "العدد": "1000", "الصيغة": "SVG + PNG", "الاستخدام": "تجاري" }, inStock: true,
  },
];
