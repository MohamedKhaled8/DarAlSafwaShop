import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "ar" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string | Record<string, string>;
  dir: "rtl" | "ltr";
  isRTL: boolean;
}

// Translation cache in localStorage
const STORAGE_KEY = "shopvibe_language_cache";

// Simple translations object - can be expanded
const translations: Record<Language, Record<string, string | Record<string, string>>> = {
  ar: {
    // Common
    "app.name": "دار الصفوة",
    "app.subtitle": "مكتبة متكاملة",
    "app.description": "كتب، أدوات مدرسية، هدايا متخصصة، وخدمات طباعة في مكان واحد بأسعار تنافسية.",
    
    // Navigation
    "nav.home": "الرئيسية",
    "nav.categories": "الفئات",
    "nav.search": "ابحث عن كتب، إلكترونيات، مستلزمات...",
    "nav.searchPlaceholder": "ابحث عن المنتجات...",
    "nav.cart": "السلة",
    "nav.wishlist": "المفضلة",
    "nav.account": "حسابي",
    "nav.orders": "طلباتي",
    "nav.signIn": "تسجيل الدخول",
    "nav.getStarted": "ابدأ الآن",
    "nav.signOut": "تسجيل الخروج",
    "nav.admin": "لوحة تحكم الأدمن",
    "nav.myOrdersStatus": "حالة طلباتي",
    "nav.noCategories": "لا توجد أقسام بعد",
    
    // Top bar
    "top.printing": "خدمات الطباعة",
    "top.gifts": "هدايا مخصصة",
    "top.help": "مركز المساعدة",
    
    // Hero
    "hero.newCollection": "تشكيلة جديدة 2026",
    "hero.title": "متجرك التعليمي الشامل",
    "hero.subtitle": "كل ما تحتاجه في مكان واحد",
    "hero.description": "وجهتكم المتكاملة للمستلزمات المكتبية، الكتب، والهدايا الاستثنائية",
    "hero.shopNow": "تسوق الآن",
    "hero.explore": "استكشف",
    "hero.products": "منتج",
    "hero.customers": "عميل",
    "hero.rating": "تقييم",
    "hero.bestSeller": "الأكثر مبيعاً",
    "hero.artSupplies": "مستلزمات فنية",
    "hero.discount": "خصم",
    "hero.booksStationery": "كتب وأدوات مكتبية",
    "hero.everythingNeed": "كل ما تحتاجه للدراسة والإبداع",
    "hero.qualityMaterials": "مواد عالية الجودة لكل فنان",
    "hero.studentDeals": "عروض الطلاب",
    "hero.specialPrices": "أسعار مميزة للطلاب",
    "hero.viewDeals": "شاهد العروض",
    
    // Banner
    "banner.newArrivals": "وصل حديثاً",
    "banner.newElectronics": "إلكترونيات جديدة",
    "banner.latestTablets": "أحدث الأجهزة اللوحية والملحقات",
    "banner.shopNow": "تسوق الآن",
    
    // Trust badges
    "trust.fastDelivery": "توصيل سريع",
    "trust.deliveryTime": "توصيل خلال 2-3 أيام",
    "trust.securePayment": "دفع آمن",
    "trust.protected": "100% محمي",
    "trust.easyReturns": "إرجاع سهل",
    "trust.returnsPolicy": "سياسة 30 يوم",
    "trust.topQuality": "أعلى جودة",
    "trust.verified": "منتجات موثقة",
    "trust.freeDeliveryOver": "توصيل مجاني فوق 200 ج.م",
    
    // Categories & Products
    "category.viewAll": "عرض الكل",
    "category.products": "منتجات",
    "category.browseNow": "تصفح الآن",
    "product.addToCart": "أضف للسلة",
    "product.outOfStock": "نفذت الكمية",
    "product.off": "خصم",
    "product.badge.bestSeller": "الأكثر مبيعاً",
    "product.badge.topRated": "الأعلى تقييماً",
    "product.badge.popular": "شائع",
    
    // Sections
    "section.bestSellers": "الأكثر مبيعاً",
    "section.flashDeals": "عروض فلاش",
    "section.dealsSubtitle": "أسرع! هذه العروض تنتهي قريباً",
    "section.testimonials": "ماذا يقول عملاؤنا",
    "section.brands": "ماركات موثوقة",
    "section.newsletter": "ابقَ على اطلاع",
    "section.newsletterSubtitle": "احصل على أحدث العروض والوافدين الجدد والعروض الحصرية في بريدك.",
    "section.newsletterPlaceholder": "بريدك الإلكتروني",
    "section.subscribe": "اشترك",
    "section.shopByCategory": "تسوق حسب القسم",
    
    // Home (marketplace layout)
    "home.hero.badge": "مكتبتك الرقمية",
    "home.hero.title": "كتب ومواد تعليمية… بلمسة عصرية",
    "home.hero.subtitle": "تسوق من دار الصفوة — جودة، أسعار مناسبة للطلاب، وتوصيل موثوق.",
    "home.cta.shopSale": "تصفح المنتجات",
    "home.cta.viewBundles": "خدمات الطباعة",
    "home.trust.freeShip": "شحن مجاني للطلبات فوق 200 ج.م",
    "home.trust.secure": "دفع آمن — checkout محمي",
    "home.trust.support": "دعم على مدار الساعة",
    "home.trust.supportDetail": "نحن هنا لمساعدتك دائماً",
    "home.trust.secureDetail": "دفع محمٍ بالكامل",
    "home.flash.title": "تخفيضات فلاش",
    "home.flash.subtitle": "عروض مختارة بعناية اليوم",
    "home.flash.seeAll": "كل عروض الفلاش",
    "home.flash.empty": "لا توجد عروض فلاش حالياً — أضف سعراً قبل الخصم للمنتجات من لوحة التحكم.",
    "home.flashPicks.title": "مختارات الفلاش",
    "home.flashPicks.footer": "عرض قسم الفلاش",
    "home.quad.categoriesTitle": "تسوق حسب الفئة",
    "home.quad.categoriesExplore": "استكشف الكل",
    "home.printPromo.title": "خدمات الطباعة",
    "home.printPromo.desc": "اطبع ملازمك وملخصاتك وتقاريرك بجودة عالية وتسليم منظم.",
    "home.printPromo.cta": "اطلب طباعة",
    "home.bestselling.title": "الأكثر مبيعاً",
    
    // Register
    "register.title": "إنشاء حساب جديد",
    "register.subtitle": "أدخل بياناتك للبدء",
    "register.fullName": "الاسم الكامل",
    "register.email": "البريد الإلكتروني",
    "register.phone": "رقم الهاتف",
    "register.password": "كلمة السر",
    "register.address": "العنوان",
    "register.agreeTerms": "أوافق على الشروط والأحكام",
    "register.termsLink": "الشروط والأحكام",
    "register.createAccount": "إنشاء حساب",
    "register.loading": "جاري إنشاء الحساب...",
    "register.success": "تم التسجيل بنجاح!",
    "register.redirecting": "جاري التحويل إلى لوحة التحكم...",
    "register.haveAccount": "تسجيل الدخول",
    
    // Validation Errors
    "error.nameRequired": "الاسم مطلوب",
    "error.emailRequired": "البريد الإلكتروني مطلوب",
    "error.emailInvalid": "بريد إلكتروني غير صالح",
    "error.phoneRequired": "رقم الهاتف مطلوب",
    "error.phoneInvalid": "رقم هاتف غير صالح (مثال: 01012345678)",
    "error.passwordRequired": "كلمة السر مطلوبة",
    "error.passwordShort": "كلمة السر يجب أن تكون 6 أحرف على الأقل",
    "error.addressRequired": "العنوان مطلوب",
    "error.termsRequired": "يجب الموافقة على الشروط والأحكام",
    
    // Product Page
    "product.description": "الوصف",
    "product.specifications": "المواصفات",
    "product.quantity": "الكمية",
    
    // Common
    "common.items": "منتج",
    "common.startShopping": "ابدأ التسوق",
    "common.email": "البريد الإلكتروني",
    "common.nA": "غير متاح",
    "common.confirmDelete": "هل أنت متأكد من حذف هذا العنصر؟",
    
    // Language
    "language.title": "اللغة",
    "language.arabic": "العربية",
    "language.english": "English",
    
    // Footer
    "footer.rights": "جميع الحقوق محفوظة",
    "footer.quickLinks": "روابط سريعة",
    "footer.customerService": "خدمة العملاء",
    "footer.contact": "تواصل معنا",
    "footer.followUs": "تابعنا",
    
    // No results
    "noResults": "لا توجد منتجات",
    "suggestions": "اقتراحات",
    "search.title": "نتائج البحث",
    "search.for": "عن",
    "search.hint": "اكتب حرفين على الأقل للبحث في المنتجات.",
    "search.viewAll": "عرض كل النتائج",
    
    // Cart
    "cart.empty": "السلة فارغة",
    "cart.summary": "ملخص الطلب",
    "cart.subtotal": "المجموع",
    "cart.shipping": "التوصيل",
    "cart.total": "الإجمالي",
    "cart.checkout": "إتمام الشراء",
    "cart.clear": "إفراغ السلة",
    
    // Category page
    "category.adjustFilters": "حاول تعديل الفلاتر",
    "category.priceRange": "نطاق السعر",
    "category.minRating": "أقل تقييم",
    "category.allRatings": "كل التقييمات",
    "category.noMatchesFilters": "لا توجد منتجات ضمن الفلاتر الحالية",
    "category.allProducts": "جميع المنتجات",
    "category.noProductsHere": "لا توجد منتجات في هذا القسم بعد.",
    
    // Dashboard
    "dashboard.loginRequired": "يرجى تسجيل الدخول",
    "dashboard.loginMessage": "يجب أن تكون مسجلاً لتصفح حسابك",
    "dashboard.editProfile": "تعديل الملف الشخصي",
    "dashboard.settings": "الإعدادات",
    "dashboard.accountSettings": "إعدادات الحساب",
    "dashboard.personalInfo": "المعلومات الشخصية",
    "dashboard.name": "الاسم",
    "dashboard.phone": "الهاتف",
    "dashboard.governorate": "المحافظة",
    "dashboard.address": "العنوان",
    "dashboard.notSet": "غير محدد",
    "dashboard.noAddress": "لا يوجد عنوان محفوظ",
    "dashboard.noOrders": "لا توجد طلبات بعد",
    "dashboard.emptyWishlist": "المفضلة فارغة",
    "dashboard.fullName": "الاسم الكامل",
    "dashboard.phoneNumber": "رقم الهاتف",
    "dashboard.namePlaceholder": "اسمك",
    "dashboard.phonePlaceholder": "رقم هاتفك",
    "dashboard.governoratePlaceholder": "محافظتك",
    "dashboard.addressPlaceholder": "عنوانك الكامل",
    "dashboard.saveChanges": "حفظ التغييرات",
    
    // Login
    "login.welcome": "أهلاً بعودتك إلى",
    "login.description": "سجّل دخولك واستمتع بتجربة التسوق المميزة",
    "login.title": "تسجيل الدخول إلى حسابك",
    "login.subtitle": "أدخل بياناتك للمتابعة",
    "login.email": "البريد الإلكتروني",
    "login.password": "كلمة السر",
    "login.forgotPassword": "نسيت كلمة السر؟",
    "login.loading": "جاري تسجيل الدخول...",
    "login.createAccount": "إنشاء حساب جديد",
    "login.or": "أو",
    
    // Product page
    "product.notFound": "المنتج غير موجود",
    "product.reviews": "تقييم",
    "product.inStock": "متوفر",
    "product.related": "منتجات مشابهة",
    
    // Printing
    "printing.description": "ارفع ملفك وخصص طلب الطباعة",
    "printing.uploadText": "اضغط لرفع الملف",
    "printing.fileTypes": "PDF, DOC, PPT (حد أقصى 50 ميجا)",
    "printing.paperSize": "حجم الورق",
    "printing.paperType": "نوع الورق",
    "printing.printType": "نوع الطباعة",
    "printing.copies": "عدد النسخ",
    "printing.orderPreview": "معاينة الطلب",
    "printing.size": "الحجم",
    "printing.type": "النوع",
    "printing.print": "الطباعة",
    "printing.estimated": "التكلفة التقديرية",
    "printing.placeOrder": "إرسال الطلب",
    
    // Gifts
    "gifts.description": "اصنع هدايا مخصصة بنصوص وصور مميزة",
    "gifts.customText": "نص مخصص",
    "gifts.textPlaceholder": "أدخل نصك المخصص...",
    "gifts.fontSize": "حجم الخط",
    "gifts.uploadImage": "رفع صورة",
    "gifts.livePreview": "معاينة مباشرة",
    
    // Misc
    "loading": "جاري التحميل...",
    "currency": "ج.م",
    "close": "إغلاق",
    "open": "فتح",
    
    // Admin
    "admin.title": "لوحة تحكم الأدمن",
    "admin.overview": "نظرة عامة",
    "admin.products": "المنتجات",
    "admin.orders": "الطلبات",
    "admin.customers": "العملاء",
    "admin.categories": "الأقسام",
    "admin.analytics": "التحليلات",
    "admin.printingSetup": "إعداد الطباعة",
    "admin.giftsSetup": "إعداد الهدايا",
    "admin.seedData": "بيانات تجريبية",
    "admin.settings": "الإعدادات",
    "admin.returnToStore": "العودة للمتجر",
    
    // Admin Gifts
    "adminGifts.title": "الهدايا المخصصة",
    "adminGifts.subtitle": "إدارة طلبات الهدايا المخصصة",
    "adminGifts.activeOrders": "طلبات نشطة",
    "adminGifts.thisMonth": "هذا الشهر",
    "adminGifts.revenue": "الإيرادات",
    "adminGifts.pending": "معلق",
    "adminGifts.search": "ابحث في طلبات الهدايا...",
    "adminGifts.order": "الطلب",
    "adminGifts.product": "المنتج",
    "adminGifts.customText": "نص مخصص",
    "adminGifts.image": "صورة",
    "adminGifts.status": "الحالة",
    "adminGifts.total": "الإجمالي",
    "adminGifts.yes": "نعم",
    "adminGifts.no": "لا",
    "adminGifts.viewDetails": "عرض التفاصيل",
    "adminGifts.markInProduction": "في الإنتاج",
    "adminGifts.markShipped": "تم الشحن",
    "adminGifts.markDelivered": "تم التوصيل",
    "adminGifts.delete": "حذف",
    "adminGifts.noOrdersSearch": "لا توجد طلبات تطابق البحث",
    "adminGifts.noOrders": "لا توجد طلبات هدايا",
    "adminGifts.orderDetails": "تفاصيل طلب الهدية",
    "adminGifts.date": "التاريخ",
    "adminGifts.customer": "العميل",
    "adminGifts.productDetails": "تفاصيل المنتج",
    "adminGifts.type": "النوع",
    "adminGifts.color": "اللون",
    "adminGifts.size": "الحجم",
    "adminGifts.quantity": "الكمية",
    "adminGifts.customization": "التخصيص",
    "adminGifts.customImage": "صورة مخصصة",
    "adminGifts.notes": "ملاحظات",
    "adminGifts.statusUpdated": "تم تحديث حالة الطلب",
    "adminGifts.orderDeleted": "تم حذف الطلب",
    
    // Admin Printing
    "adminPrinting.title": "خدمات الطباعة",
    "adminPrinting.subtitle": "إدارة طلبات الطباعة",
    "adminPrinting.activeJobs": "مهام نشطة",
    "adminPrinting.todaysRevenue": "إيرادات اليوم",
    "adminPrinting.completed": "مكتمل",
    "adminPrinting.pending": "معلق",
    "adminPrinting.search": "ابحث في طلبات الطباعة...",
    "adminPrinting.order": "الطلب",
    "adminPrinting.file": "الملف",
    "adminPrinting.sizeType": "الحجم/النوع",
    "adminPrinting.copies": "النسخ",
    "adminPrinting.status": "الحالة",
    "adminPrinting.total": "الإجمالي",
    "adminPrinting.viewDetails": "عرض التفاصيل",
    "adminPrinting.markPrinting": "جاري الطباعة",
    "adminPrinting.markReady": "جاهز",
    "adminPrinting.markCompleted": "مكتمل",
    "adminPrinting.delete": "حذف",
    "adminPrinting.noOrdersSearch": "لا توجد طلبات تطابق البحث",
    "adminPrinting.noOrders": "لا توجد طلبات طباعة",
    "adminPrinting.orderDetails": "تفاصيل طلب الطباعة",
    "adminPrinting.date": "التاريخ",
    "adminPrinting.customer": "العميل",
    "adminPrinting.printDetails": "تفاصيل الطباعة",
    "adminPrinting.paper": "الورق",
    "adminPrinting.doubleSided": "وجهين",
    "adminPrinting.notes": "ملاحظات",
    "adminPrinting.statusUpdated": "تم تحديث حالة الطلب",
    "adminPrinting.orderDeleted": "تم حذف الطلب",
    
    // Admin Overview
    "adminOverview.title": "نظرة عامة",
    "adminOverview.welcome": "مرحباً أدمن، مرحباً بك في لوحة التحكم",
    "adminOverview.totalRevenue": "إجمالي الإيرادات",
    "adminOverview.activeOrders": "طلبات نشطة",
    "adminOverview.awaitProcessing": "بانتظار المعالجة",
    "adminOverview.totalCustomers": "إجمالي العملاء",
    "adminOverview.activeProducts": "منتجات نشطة",
    "adminOverview.productsInStore": "منتجات في المتجر",
    "adminOverview.salesOverview": "نظرة عامة على المبيعات",
    "adminOverview.quickStats": "إحصائيات سريعة",
    "adminOverview.processing": "جاري المعالجة",
    "adminOverview.ordersInProgress": "طلبات قيد التنفيذ",
    "adminOverview.delivered": "تم التوصيل",
    "adminOverview.completedOrders": "طلبات مكتملة",
    "adminOverview.newCustomers": "عملاء جدد",
    "adminOverview.thisMonth": "هذا الشهر",
    "adminOverview.shipped": "تم الشحن",
    "adminOverview.onTheWay": "في الطريق",
    
    // Admin Products
    "adminProducts.title": "المنتجات",
    "adminProducts.subtitle": "منتجات في متجرك",
    "adminProducts.addProduct": "إضافة منتج",
    "adminProducts.editProduct": "تعديل منتج",
    "adminProducts.addNewProduct": "إضافة منتج جديد",
    "adminProducts.search": "البحث في المنتجات...",
    "adminProducts.allCategories": "جميع الأقسام",
    "adminProducts.productName": "اسم المنتج",
    "adminProducts.nameAr": "اسم المنتج بالعربية (اختياري)",
    "adminProducts.descriptionAr": "الوصف بالعربية (اختياري)",
    "adminProducts.price": "السعر",
    "adminProducts.originalPrice": "السعر الأصلي (اختياري)",
    "adminProducts.category": "القسم",
    "adminProducts.noCategories": "لا توجد أقسام - أضف أقسام أولاً",
    "adminProducts.noCategoriesFound": "لم يتم العثور على أقسام",
    "adminProducts.goToCategories": "اذهب لصفحة الأقسام لإضافة بعضها أولاً",
    "adminProducts.imageUrl": "صور المنتج",
    "adminProducts.description": "الوصف",
    "adminProducts.specifications": "المواصفات",
    "adminProducts.specKey": "المفتاح (مثال: عدد الصفحات)",
    "adminProducts.specValue": "القيمة (مثال: 320)",
    "adminProducts.inStock": "متوفر في المخزن",
    "adminProducts.saving": "جاري الحفظ...",
    "adminProducts.saveProduct": "حفظ المنتج",
    "adminProducts.saveChanges": "حفظ التعديلات",
    "adminProducts.clickSetMain": "اضغط لجعلها الصورة الرئيسية",
    "adminProducts.product": "المنتج",
    "adminProducts.rating": "التقييم",
    "adminProducts.stock": "المخزون",
    "adminProducts.inStockStatus": "متوفر",
    "adminProducts.outStatus": "غير متوفر",
    "adminProducts.view": "عرض",
    "adminProducts.edit": "تعديل",
    "adminProducts.delete": "حذف",
    "adminProducts.noProducts": "لم يتم العثور على منتجات",
    "adminProducts.productUpdated": "تم تحديث المنتج بنجاح",
    "adminProducts.productCreated": "تم إنشاء المنتج بنجاح",
    "adminProducts.productDeleted": "تم حذف المنتج بنجاح",
    
    // Admin Orders
    "adminOrders.title": "الطلبات",
    "adminOrders.subtitle": "تتبع وإدارة طلبات العملاء",
    "adminOrders.search": "البحث في الطلبات...",
    "adminOrders.allStatus": "جميع الحالات",
    "adminOrders.orderId": "رقم الطلب",
    "adminOrders.customer": "العميل",
    "adminOrders.date": "التاريخ",
    "adminOrders.items": "المنتجات",
    "adminOrders.total": "الإجمالي",
    "adminOrders.status": "الحالة",
    "adminOrders.payment": "الدفع",
    "adminOrders.viewDetails": "عرض التفاصيل",
    "adminOrders.markProcessing": "جاري المعالجة",
    "adminOrders.markShipped": "تم الشحن",
    "adminOrders.markDelivered": "تم التوصيل",
    "adminOrders.delete": "حذف",
    "adminOrders.noOrdersFound": "لم يتم العثور على طلبات",
    "adminOrders.noOrdersMatch": "لا توجد طلبات تطابق البحث",
    "adminOrders.orderDetails": "تفاصيل الطلب",
    "adminOrders.shippingAddress": "عنوان الشحن",
    "adminOrders.qty": "الكمية",
    "adminOrders.itemsCount": "منتجات",
    "adminOrders.orderStatusUpdated": "تم تحديث حالة الطلب",
    "adminOrders.orderDeleted": "تم حذف الطلب",
    
    // Admin Categories
    "adminCategories.title": "الأقسام",
    "adminCategories.subtitle": "إدارة أقسام المنتجات",
    "adminCategories.addCategory": "إضافة قسم",
    "adminCategories.editCategory": "تعديل قسم",
    "adminCategories.addNewCategory": "إضافة قسم جديد",
    "adminCategories.search": "البحث في الأقسام...",
    "adminCategories.categoryName": "اسم القسم",
    "adminCategories.nameAr": "اسم القسم بالعربية (اختياري)",
    "adminCategories.categoryIcon": "أيقونة القسم",
    "adminCategories.productsCount": "عدد المنتجات",
    "adminCategories.noCategories": "لا توجد أقسام",
    "adminCategories.categoryAdded": "تم إضافة القسم بنجاح",
    "adminCategories.categoryUpdated": "تم تحديث القسم بنجاح",
    "adminCategories.categoryDeleted": "تم حذف القسم بنجاح",
    
    // Admin Customers
    "adminCustomers.title": "العملاء",
    "adminCustomers.subtitle": "إدارة حسابات العملاء",
    "adminCustomers.search": "البحث في العملاء...",
    "adminCustomers.customer": "العميل",
    "adminCustomers.email": "البريد الإلكتروني",
    "adminCustomers.phone": "الهاتف",
    "adminCustomers.orders": "الطلبات",
    "adminCustomers.joined": "تاريخ التسجيل",
    "adminCustomers.noCustomers": "لم يتم العثور على عملاء",
    "adminCustomers.total": "الإجمالي",
    "adminCustomers.active": "نشط",
    "adminCustomers.vip": "مميز",
    "adminCustomers.new": "جديد",
    "adminCustomers.totalSpent": "إجمالي الإنفاق",
    "adminCustomers.status": "الحالة",
    "adminCustomers.viewProfile": "عرض الملف",
    "adminCustomers.markActive": "تعيين نشط",
    "adminCustomers.markVIP": "تعيين مميز",
    "adminCustomers.markInactive": "تعيين غير نشط",
    "adminCustomers.delete": "حذف",
    "adminCustomers.noCustomersSearch": "لا يوجد عملاء مطابقين للبحث",
    "adminCustomers.customerProfile": "ملف العميل",
    "adminCustomers.accountInfo": "معلومات الحساب",
    "adminCustomers.memberSince": "عضو منذ",
    "adminCustomers.lastLogin": "آخر دخول",
    "adminCustomers.role": "الدور",
    "adminCustomers.address": "العنوان",
    "adminCustomers.userDeleted": "تم حذف العميل بنجاح",
    "adminCustomers.statusUpdated": "تم تحديث الحالة بنجاح",
    
    // Admin Settings
    "adminSettings.title": "الإعدادات",
    "adminSettings.subtitle": "إدارة إعدادات المتجر",
    "adminSettings.storeName": "اسم المتجر",
    "adminSettings.storeEmail": "بريد المتجر",
    "adminSettings.storePhone": "هاتف المتجر",
    "adminSettings.storeAddress": "عنوان المتجر",
    "adminSettings.currency": "العملة",
    "adminSettings.taxRate": "نسبة الضريبة",
    "adminSettings.shippingFee": "رسوم الشحن",
    "adminSettings.saveSettings": "حفظ التغييرات",
    "adminSettings.settingsUpdated": "تم تحديث الإعدادات بنجاح",
    "adminSettings.storeInfo": "معلومات المتجر",
    "adminSettings.storeDetails": "تفاصيل المتجر",
    "adminSettings.storeDescription": "وصف المتجر",
    "adminSettings.notifications": "الإشعارات",
    "adminSettings.notificationPrefs": "تفضيلات الإشعارات",
    "adminSettings.newOrderAlerts": "تنبيهات الطلبات الجديدة",
    "adminSettings.newOrderDesc": "استلام إشعار عند استلام طلب جديد",
    "adminSettings.lowStockWarnings": "تحذيرات انخفاض المخزون",
    "adminSettings.lowStockDesc": "استلام إشعار عند انخفاض مخزون المنتجات",
    "adminSettings.customerMessages": "رسائل العملاء",
    "adminSettings.customerDesc": "استلام إشعار عندما يرسل عميل رسالة",
    "adminSettings.shippingRate": "معدل الشحن",
    
    // Admin Shipping
    "adminShipping.title": "إدارة الشحن",
    "adminShipping.governorates": "المحافظات",
    "adminShipping.addGovernorate": "إضافة محافظة",
    "adminShipping.noRates": "لا توجد أسعار شحن. أضف محافظتك الأولى.",
    "adminShipping.governorateName": "اسم المحافظة",
    "adminShipping.selectGovernorate": "اختر المحافظة",
    "adminShipping.shippingRate": "سعر الشحن (EGP)",
    "adminShipping.available": "متاح للشحن",
    "adminShipping.active": "نشط",
    "adminShipping.inactive": "غير نشط",
    "adminShipping.editGovernorate": "تعديل المحافظة",
    "adminShipping.saveGovernorate": "حفظ المحافظة",
    "adminShipping.saving": "جاري الحفظ...",
    "adminShipping.rateUpdated": "تم تحديث سعر الشحن",
    "adminShipping.rateAdded": "تم إضافة سعر الشحن",
    "adminShipping.rateDeleted": "تم حذف سعر الشحن",
    
    // Admin Seed Data
    "adminSeed.title": "بيانات تجريبية",
    "adminSeed.subtitle": "إضافة بيانات تجريبية للاختبار",
    "adminSeed.addProducts": "إضافة منتجات تجريبية",
    "adminSeed.addOrders": "إضافة طلبات تجريبية",
    "adminSeed.addCustomers": "إضافة عملاء تجريبيين",
    "adminSeed.clearAll": "مسح جميع البيانات",
    "adminSeed.success": "تم إضافة البيانات بنجاح",
    "adminSeed.cleared": "تم مسح جميع البيانات",
    
    // Admin Analytics
    "adminAnalytics.title": "التحليلات",
    "adminAnalytics.subtitle": "تحليلات المتجر والمبيعات",
    "adminAnalytics.salesChart": "مخطط المبيعات",
    "adminAnalytics.topProducts": "أفضل المنتجات",
    "adminAnalytics.revenueByCategory": "الإيرادات حسب القسم",
  },
  en: {
    // Common
    "app.name": "Dar Al Safwa",
    "app.subtitle": "Educational Store",
    "app.description": "Books, school supplies, gifts, and printing services — all in one place.",
    
    // Navigation
    "nav.home": "Home",
    "nav.categories": "Categories",
    "nav.search": "Search for books, electronics, supplies...",
    "nav.searchPlaceholder": "Search products...",
    "nav.cart": "Cart",
    "nav.wishlist": "Wishlist",
    "nav.account": "My Account",
    "nav.orders": "My Orders",
    "nav.signIn": "Sign In",
    "nav.getStarted": "Get Started",
    "nav.signOut": "Sign Out",
    "nav.admin": "Admin Dashboard",
    "nav.myOrdersStatus": "My Orders Status",
    "nav.noCategories": "No categories yet",
    
    // Top bar
    "top.printing": "Printing Services",
    "top.gifts": "Custom Gifts",
    "top.help": "Help Center",
    
    // Hero
    "hero.newCollection": "New Collection 2026",
    "hero.title": "Your All-in-One Educational Store",
    "hero.subtitle": "Everything you need in one place",
    "hero.description": "Your destination for office supplies, books, and exceptional gifts",
    "hero.shopNow": "Shop Now",
    "hero.explore": "Explore",
    "hero.products": "Products",
    "hero.customers": "Customers",
    "hero.rating": "Rating",
    "hero.bestSeller": "Best Seller",
    "hero.artSupplies": "Art Supplies",
    "hero.discount": "OFF",
    "hero.booksStationery": "Books & Stationery",
    "hero.everythingNeed": "Everything you need for study and creativity",
    "hero.qualityMaterials": "Quality materials for every artist",
    "hero.studentDeals": "Student Deals",
    "hero.specialPrices": "Special prices for students",
    "hero.viewDeals": "View Deals",
    
    // Banner
    "banner.newArrivals": "NEW ARRIVALS",
    "banner.newElectronics": "New Electronics Arrivals",
    "banner.latestTablets": "Latest tablets & accessories",
    "banner.shopNow": "Shop Now",
    
    // Trust badges
    "trust.fastDelivery": "Fast Delivery",
    "trust.deliveryTime": "2-3 days delivery",
    "trust.securePayment": "Secure Payment",
    "trust.protected": "100% protected",
    "trust.easyReturns": "Easy Returns",
    "trust.returnsPolicy": "30-day policy",
    "trust.topQuality": "Top Quality",
    "trust.verified": "Verified products",
    "trust.freeDeliveryOver": "Free delivery over 200 EGP",
    
    // Categories & Products
    "category.viewAll": "View All",
    "category.products": "products",
    "category.browseNow": "Browse Now",
    "product.addToCart": "Add to Cart",
    "product.outOfStock": "Out of Stock",
    "product.off": "OFF",
    "product.badge.bestSeller": "Best Seller",
    "product.badge.topRated": "Top Rated",
    "product.badge.popular": "Popular",
    
    // Sections
    "section.bestSellers": "Best Sellers",
    "section.flashDeals": "Flash Deals",
    "section.dealsSubtitle": "Hurry! These deals end soon",
    "section.testimonials": "What Our Customers Say",
    "section.brands": "Trusted Brands",
    "section.newsletter": "Stay Updated",
    "section.newsletterSubtitle": "Get the latest deals, new arrivals, and exclusive offers delivered to your inbox.",
    "section.newsletterPlaceholder": "Your email address",
    "section.subscribe": "Subscribe",
    "section.shopByCategory": "Shop by Category",
    
    // Home (marketplace layout)
    "home.hero.badge": "Your digital bookstore",
    "home.hero.title": "Books & learning essentials, reimagined",
    "home.hero.subtitle": "Shop Dar Al Safwa — quality, student-friendly prices, and reliable delivery.",
    "home.hero.description": "Your destination for office supplies, books, and exceptional gifts",
    "home.cta.shopSale": "Browse products",
    "home.cta.viewBundles": "Printing services",
    "home.trust.freeShip": "Free shipping on orders over $50",
    "home.trust.secure": "Secure payment — 100% protected checkout",
    "home.trust.support": "24/7 customer support",
    "home.trust.supportDetail": "Always here to help you",
    "home.trust.secureDetail": "100% protected checkout",
    "home.flash.title": "Flash deals",
    "home.flash.subtitle": "Handpicked deals today",
    "home.flash.seeAll": "All flash deals",
    "home.flash.empty": "No flash deals yet — set an original price above the sale price in the admin panel.",
    "home.flashPicks.title": "Flash picks",
    "home.flashPicks.footer": "View flash section",
    "home.quad.categoriesTitle": "Shop by Category",
    "home.quad.categoriesExplore": "Explore all",
    "home.printPromo.title": "Printing services",
    "home.printPromo.desc": "Print notes, summaries, and reports with consistent quality.",
    "home.printPromo.cta": "Order printing",
    "home.bestselling.title": "Bestselling Books",
    
    // Register
    "register.title": "Create New Account",
    "register.subtitle": "Fill in your details to get started",
    "register.fullName": "Full Name",
    "register.email": "Email Address",
    "register.phone": "Phone Number",
    "register.password": "Password",
    "register.address": "Address",
    "register.agreeTerms": "I agree to the Terms and Conditions",
    "register.termsLink": "Terms and Conditions",
    "register.createAccount": "Create Account",
    "register.loading": "Creating account...",
    "register.success": "Registration successful!",
    "register.redirecting": "Redirecting to dashboard...",
    "register.haveAccount": "Sign In",
    
    // Validation Errors
    "error.nameRequired": "Name is required",
    "error.emailRequired": "Email is required",
    "error.emailInvalid": "Invalid email address",
    "error.phoneRequired": "Phone number is required",
    "error.phoneInvalid": "Invalid phone number (e.g., 01012345678)",
    "error.passwordRequired": "Password is required",
    "error.passwordShort": "Password must be at least 6 characters",
    "error.addressRequired": "Address is required",
    "error.termsRequired": "You must agree to the terms and conditions",
    
    // Product Page
    "product.description": "Description",
    "product.specifications": "Specifications",
    "product.quantity": "Quantity",
    
    // Common
    "common.items": "items",
    "common.startShopping": "Start Shopping",
    "common.email": "Email",
    "common.nA": "N/A",
    "common.confirmDelete": "Are you sure you want to delete this item?",
    
    // Language
    "language.title": "Language",
    "language.arabic": "العربية",
    "language.english": "English",
    
    // Footer
    "footer.rights": "All rights reserved",
    "footer.quickLinks": "Quick links",
    "footer.customerService": "Customer Service",
    "footer.contact": "Contact Us",
    "footer.followUs": "Follow Us",
    
    // No results
    "noResults": "No products found",
    "suggestions": "Suggestions",
    "search.title": "Search results",
    "search.for": "for",
    "search.hint": "Type at least 2 characters to search products.",
    "search.viewAll": "View all results",
    
    // Cart
    "cart.empty": "Your cart is empty",
    "cart.summary": "Order Summary",
    "cart.subtotal": "Subtotal",
    "cart.shipping": "Shipping",
    "cart.total": "Total",
    "cart.checkout": "Proceed to Checkout",
    "cart.clear": "Clear Cart",
    
    // Category page
    "category.adjustFilters": "Try adjusting your filters",
    "category.priceRange": "Price range",
    "category.minRating": "Minimum rating",
    "category.allRatings": "All ratings",
    "category.noMatchesFilters": "No products match the current filters",
    "category.allProducts": "All products",
    "category.noProductsHere": "No products in this category yet.",
    
    // Dashboard
    "dashboard.loginRequired": "Please Login",
    "dashboard.loginMessage": "You need to be logged in to view your account",
    "dashboard.editProfile": "Edit Profile",
    "dashboard.settings": "Settings",
    "dashboard.accountSettings": "Account Settings",
    "dashboard.personalInfo": "Personal Information",
    "dashboard.name": "Name",
    "dashboard.phone": "Phone",
    "dashboard.governorate": "Governorate",
    "dashboard.address": "Address",
    "dashboard.notSet": "Not set",
    "dashboard.noAddress": "No address saved",
    "dashboard.noOrders": "No orders yet",
    "dashboard.emptyWishlist": "Your wishlist is empty",
    "dashboard.fullName": "Full Name",
    "dashboard.phoneNumber": "Phone Number",
    "dashboard.namePlaceholder": "Your name",
    "dashboard.phonePlaceholder": "Your phone",
    "dashboard.governoratePlaceholder": "Your governorate",
    "dashboard.addressPlaceholder": "Your full address",
    "dashboard.saveChanges": "Save Changes",
    
    // Login
    "login.welcome": "Welcome back to",
    "login.description": "Sign in and enjoy a unique shopping experience",
    "login.title": "Sign in to your account",
    "login.subtitle": "Enter your credentials to continue",
    "login.email": "Email",
    "login.password": "Password",
    "login.forgotPassword": "Forgot password?",
    "login.loading": "Signing in...",
    "login.createAccount": "Create new account",
    "login.or": "or",
    
    // Product page
    "product.notFound": "Product not found",
    "product.reviews": "reviews",
    "product.inStock": "In Stock",
    "product.related": "Related Products",
    
    // Printing
    "printing.description": "Upload your document and customize your print order",
    "printing.uploadText": "Click to upload your document",
    "printing.fileTypes": "PDF, DOC, PPT (max 50MB)",
    "printing.paperSize": "Paper Size",
    "printing.paperType": "Paper Type",
    "printing.printType": "Print Type",
    "printing.copies": "Copies",
    "printing.orderPreview": "Order Preview",
    "printing.size": "Size",
    "printing.type": "Type",
    "printing.print": "Print",
    "printing.estimated": "Estimated",
    "printing.placeOrder": "Place Order",
    
    // Gifts
    "gifts.description": "Create personalized gifts with custom text and images",
    "gifts.customText": "Custom Text",
    "gifts.textPlaceholder": "Enter your custom text...",
    "gifts.fontSize": "Font Size",
    "gifts.uploadImage": "Upload Image",
    "gifts.livePreview": "Live Preview",
    
    // Misc
    "loading": "Loading...",
    "currency": "EGP",
    "close": "Close",
    "open": "Open",
    
    // Admin
    "admin.title": "Admin Dashboard",
    "admin.overview": "Overview",
    "admin.products": "Products",
    "admin.orders": "Orders",
    "admin.customers": "Customers",
    "admin.categories": "Categories",
    "admin.analytics": "Analytics",
    "admin.printingSetup": "Printing Setup",
    "admin.giftsSetup": "Gifts Setup",
    "admin.seedData": "Seed Data",
    "admin.settings": "Settings",
    "admin.returnToStore": "Return to Store",
    
    // Admin Gifts
    "adminGifts.title": "Custom Gifts",
    "adminGifts.subtitle": "Manage personalized gift orders",
    "adminGifts.activeOrders": "Active Orders",
    "adminGifts.thisMonth": "This Month",
    "adminGifts.revenue": "Revenue",
    "adminGifts.pending": "Pending",
    "adminGifts.search": "Search gift orders...",
    "adminGifts.order": "Order",
    "adminGifts.product": "Product",
    "adminGifts.customText": "Custom Text",
    "adminGifts.image": "Image",
    "adminGifts.status": "Status",
    "adminGifts.total": "Total",
    "adminGifts.yes": "Yes",
    "adminGifts.no": "No",
    "adminGifts.viewDetails": "View Details",
    "adminGifts.markInProduction": "Mark In Production",
    "adminGifts.markShipped": "Mark Shipped",
    "adminGifts.markDelivered": "Mark Delivered",
    "adminGifts.delete": "Delete",
    "adminGifts.noOrdersSearch": "No orders match your search.",
    "adminGifts.noOrders": "No gift orders found.",
    "adminGifts.orderDetails": "Gift Order Details",
    "adminGifts.date": "Date",
    "adminGifts.customer": "Customer",
    "adminGifts.productDetails": "Product Details",
    "adminGifts.type": "Type",
    "adminGifts.color": "Color",
    "adminGifts.size": "Size",
    "adminGifts.quantity": "Quantity",
    "adminGifts.customization": "Customization",
    "adminGifts.customImage": "Custom Image",
    "adminGifts.notes": "Notes",
    "adminGifts.statusUpdated": "Gift order status updated",
    "adminGifts.orderDeleted": "Gift order deleted",
    
    // Admin Printing
    "adminPrinting.title": "Printing Services",
    "adminPrinting.subtitle": "Manage print orders and jobs",
    "adminPrinting.activeJobs": "Active Jobs",
    "adminPrinting.todaysRevenue": "Today's Revenue",
    "adminPrinting.completed": "Completed",
    "adminPrinting.pending": "Pending",
    "adminPrinting.search": "Search print orders...",
    "adminPrinting.order": "Order",
    "adminPrinting.file": "File",
    "adminPrinting.sizeType": "Size/Type",
    "adminPrinting.copies": "Copies",
    "adminPrinting.status": "Status",
    "adminPrinting.total": "Total",
    "adminPrinting.viewDetails": "View Details",
    "adminPrinting.markPrinting": "Mark Printing",
    "adminPrinting.markReady": "Mark Ready",
    "adminPrinting.markCompleted": "Mark Completed",
    "adminPrinting.delete": "Delete",
    "adminPrinting.noOrdersSearch": "No orders match your search.",
    "adminPrinting.noOrders": "No print orders found.",
    "adminPrinting.orderDetails": "Print Order Details",
    "adminPrinting.date": "Date",
    "adminPrinting.customer": "Customer",
    "adminPrinting.printDetails": "Print Details",
    "adminPrinting.paper": "Paper",
    "adminPrinting.doubleSided": "Double-sided",
    "adminPrinting.notes": "Notes",
    "adminPrinting.statusUpdated": "Print order status updated",
    "adminPrinting.orderDeleted": "Print order deleted",
    
    // Admin Overview
    "adminOverview.title": "Overview",
    "adminOverview.welcome": "Hello admin, welcome to your dashboard",
    "adminOverview.totalRevenue": "Total Revenue",
    "adminOverview.activeOrders": "Active Orders",
    "adminOverview.awaitProcessing": "await processing",
    "adminOverview.totalCustomers": "Total Customers",
    "adminOverview.activeProducts": "Active Products",
    "adminOverview.productsInStore": "products in store",
    "adminOverview.salesOverview": "Sales Overview",
    "adminOverview.quickStats": "Quick Stats",
    "adminOverview.processing": "Processing",
    "adminOverview.ordersInProgress": "Orders in progress",
    "adminOverview.delivered": "Delivered",
    "adminOverview.completedOrders": "Completed orders",
    "adminOverview.newCustomers": "New Customers",
    "adminOverview.thisMonth": "This month",
    "adminOverview.shipped": "Shipped",
    "adminOverview.onTheWay": "On the way",
    
    // Admin Products
    "adminProducts.title": "Products",
    "adminProducts.subtitle": "products in your store",
    "adminProducts.addProduct": "Add Product",
    "adminProducts.editProduct": "Edit Product",
    "adminProducts.addNewProduct": "Add New Product",
    "adminProducts.search": "Search products...",
    "adminProducts.allCategories": "All Categories",
    "adminProducts.productName": "Product name",
    "adminProducts.nameAr": "Product name in Arabic (optional)",
    "adminProducts.descriptionAr": "Description in Arabic (optional)",
    "adminProducts.price": "Price",
    "adminProducts.originalPrice": "Original price (optional)",
    "adminProducts.category": "Category",
    "adminProducts.noCategories": "No categories - Add some first",
    "adminProducts.noCategoriesFound": "No categories found",
    "adminProducts.goToCategories": "Go to Categories page to add some first",
    "adminProducts.imageUrl": "Image URL",
    "adminProducts.description": "Description",
    "adminProducts.specifications": "Specifications",
    "adminProducts.specKey": "Key (e.g. Pages)",
    "adminProducts.specValue": "Value (e.g. 320)",
    "adminProducts.inStock": "In Stock",
    "adminProducts.saving": "Saving...",
    "adminProducts.saveChanges": "Save Changes",
    "adminProducts.saveProduct": "Save Product",
    "adminProducts.clickSetMain": "Click to set as main image",
    "adminProducts.product": "Product",
    "adminProducts.rating": "Rating",
    "adminProducts.stock": "Stock",
    "adminProducts.inStockStatus": "In Stock",
    "adminProducts.outStatus": "Out",
    "adminProducts.view": "View",
    "adminProducts.edit": "Edit",
    "adminProducts.delete": "Delete",
    "adminProducts.noProducts": "No products found",
    "adminProducts.productUpdated": "Product updated successfully",
    "adminProducts.productCreated": "Product created successfully",
    "adminProducts.productDeleted": "Product deleted successfully",
    
    // Admin Orders
    "adminOrders.title": "Orders",
    "adminOrders.subtitle": "Track and manage customer orders",
    "adminOrders.search": "Search orders...",
    "adminOrders.allStatus": "All Status",
    "adminOrders.orderId": "Order ID",
    "adminOrders.customer": "Customer",
    "adminOrders.date": "Date",
    "adminOrders.items": "Items",
    "adminOrders.total": "Total",
    "adminOrders.status": "Status",
    "adminOrders.payment": "Payment",
    "adminOrders.viewDetails": "View Details",
    "adminOrders.markProcessing": "Mark Processing",
    "adminOrders.markShipped": "Mark Shipped",
    "adminOrders.markDelivered": "Mark Delivered",
    "adminOrders.delete": "Delete",
    "adminOrders.noOrdersFound": "No orders found",
    "adminOrders.noOrdersMatch": "No orders match your filters",
    "adminOrders.orderDetails": "Order Details",
    "adminOrders.shippingAddress": "Shipping Address",
    "adminOrders.qty": "Qty",
    "adminOrders.itemsCount": "items",
    "adminOrders.orderStatusUpdated": "Order status updated",
    "adminOrders.orderDeleted": "Order deleted successfully",
    
    // Admin Categories
    "adminCategories.title": "Categories",
    "adminCategories.subtitle": "Manage product categories",
    "adminCategories.addCategory": "Add Category",
    "adminCategories.editCategory": "Edit Category",
    "adminCategories.addNewCategory": "Add New Category",
    "adminCategories.search": "Search categories...",
    "adminCategories.categoryName": "Category name",
    "adminCategories.nameAr": "Category name in Arabic (optional)",
    "adminCategories.categoryIcon": "Category icon",
    "adminCategories.productsCount": "Products count",
    "adminCategories.noCategories": "No categories found",
    "adminCategories.categoryAdded": "Category added successfully",
    "adminCategories.categoryUpdated": "Category updated successfully",
    "adminCategories.categoryDeleted": "Category deleted successfully",
    
    // Admin Customers
    "adminCustomers.title": "Customers",
    "adminCustomers.subtitle": "Manage customer accounts",
    "adminCustomers.search": "Search customers...",
    "adminCustomers.customer": "Customer",
    "adminCustomers.email": "Email",
    "adminCustomers.phone": "Phone",
    "adminCustomers.orders": "Orders",
    "adminCustomers.joined": "Joined",
    "adminCustomers.noCustomers": "No customers found",
    "adminCustomers.total": "Total",
    "adminCustomers.active": "Active",
    "adminCustomers.vip": "VIP",
    "adminCustomers.new": "New",
    "adminCustomers.totalSpent": "Total Spent",
    "adminCustomers.status": "Status",
    "adminCustomers.viewProfile": "View Profile",
    "adminCustomers.markActive": "Mark Active",
    "adminCustomers.markVIP": "Mark VIP",
    "adminCustomers.markInactive": "Mark Inactive",
    "adminCustomers.delete": "Delete",
    "adminCustomers.noCustomersSearch": "No customers match your search",
    "adminCustomers.customerProfile": "Customer Profile",
    "adminCustomers.accountInfo": "Account Info",
    "adminCustomers.memberSince": "Member Since",
    "adminCustomers.lastLogin": "Last Login",
    "adminCustomers.role": "Role",
    "adminCustomers.address": "Address",
    "adminCustomers.userDeleted": "Customer deleted successfully",
    "adminCustomers.statusUpdated": "Status updated successfully",
    
    // Admin Settings
    "adminSettings.title": "Settings",
    "adminSettings.subtitle": "Manage store settings",
    "adminSettings.storeName": "Store Name",
    "adminSettings.storeEmail": "Store Email",
    "adminSettings.storePhone": "Store Phone",
    "adminSettings.storeAddress": "Store Address",
    "adminSettings.currency": "Currency",
    "adminSettings.taxRate": "Tax Rate",
    "adminSettings.shippingFee": "Shipping Fee",
    "adminSettings.saveSettings": "Save Changes",
    "adminSettings.settingsUpdated": "Settings updated successfully",
    "adminSettings.storeInfo": "Store Information",
    "adminSettings.storeDetails": "Store Details",
    "adminSettings.storeDescription": "Store Description",
    "adminSettings.notifications": "Notifications",
    "adminSettings.notificationPrefs": "Notification Preferences",
    "adminSettings.newOrderAlerts": "New Order Alerts",
    "adminSettings.newOrderDesc": "Receive notification when a new order is placed",
    "adminSettings.lowStockWarnings": "Low Stock Warnings",
    "adminSettings.lowStockDesc": "Receive notification when product stock is low",
    "adminSettings.customerMessages": "Customer Messages",
    "adminSettings.customerDesc": "Receive notification when a customer sends a message",
    "adminSettings.shippingRate": "Shipping Rate",
    
    // Admin Shipping
    "adminShipping.title": "Shipping Management",
    "adminShipping.governorates": "Governorates",
    "adminShipping.addGovernorate": "Add Governorate",
    "adminShipping.noRates": "No shipping rates found. Add your first governorate.",
    "adminShipping.governorateName": "Governorate Name",
    "adminShipping.selectGovernorate": "Select Governorate",
    "adminShipping.shippingRate": "Shipping Rate (EGP)",
    "adminShipping.available": "Available for Shipping",
    "adminShipping.active": "Active",
    "adminShipping.inactive": "Inactive",
    "adminShipping.editGovernorate": "Edit Governorate",
    "adminShipping.saveGovernorate": "Save Governorate",
    "adminShipping.saving": "Saving...",
    "adminShipping.rateUpdated": "Shipping rate updated",
    "adminShipping.rateAdded": "Shipping rate added",
    "adminShipping.rateDeleted": "Shipping rate deleted",
    
    // Admin Seed Data
    "adminSeed.title": "Seed Data",
    "adminSeed.subtitle": "Add sample data for testing",
    "adminSeed.addProducts": "Add Sample Products",
    "adminSeed.addOrders": "Add Sample Orders",
    "adminSeed.addCustomers": "Add Sample Customers",
    "adminSeed.clearAll": "Clear All Data",
    "adminSeed.success": "Data added successfully",
    "adminSeed.cleared": "All data cleared",
    
    // Admin Analytics
    "adminAnalytics.title": "Analytics",
    "adminAnalytics.subtitle": "Store and sales analytics",
    "adminAnalytics.salesChart": "Sales Chart",
    "adminAnalytics.topProducts": "Top Products",
    "adminAnalytics.revenueByCategory": "Revenue by Category",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Load from localStorage or default to Arabic
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("shopvibe_language") as Language | null;
      return cached === "en" ? "en" : "ar";
    }
    return "ar";
  });

  // Set direction based on language
  const dir: "rtl" | "ltr" = language === "ar" ? "rtl" : "ltr";
  const isRTL = language === "ar";

  // Update localStorage and document direction when language changes
  useEffect(() => {
    localStorage.setItem("shopvibe_language", language);
    
    // Update HTML dir and lang attributes
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
    
    // Update document title based on language
    document.title = language === "ar" ? "دار الصفوة | مكتبة تعليمية" : "Dar Al Safwa | Educational Store";
    
    // Store in cache for offline support
    const cache = {
      language,
      timestamp: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  }, [language, dir]);

  // Initialize on mount
  useEffect(() => {
    // Check for cached language on mount
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      try {
        const { language: cachedLang } = JSON.parse(cached);
        if (cachedLang && (cachedLang === "ar" || cachedLang === "en")) {
          setLanguageState(cachedLang);
        }
      } catch {
        // Invalid cache, ignore
      }
    }
    
    // Set initial direction
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  // Translation function
  const t = (key: string): string | Record<string, string> => {
    const value = translations[language][key];
    return value ?? key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

// Hook for nested object translations
export function useNestedT(key: string): Record<string, string> {
  const { t } = useLanguage();
  const value = t(key);
  return typeof value === "object" ? value : {};
}
