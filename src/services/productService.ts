import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  setDoc,
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  startAfter,
  DocumentSnapshot,
  QueryDocumentSnapshot,
  serverTimestamp,
  writeBatch
} from "firebase/firestore";
import { db } from "./firebase";
import type { Product, Category } from "@/data/products";

// Re-export types
export type { Product, Category };

const PRODUCTS_COLLECTION = "products";
const CATEGORIES_COLLECTION = "categories";

// ==================== PRODUCTS ====================

export const getAllProducts = async (limitCount: number = 100): Promise<Product[]> => {
  try {
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    } as Product));
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
};

export const getProductById = async (productId: string): Promise<Product | null> => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, productId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Product;
    }
    return null;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw new Error("Failed to fetch product");
  }
};

/** Match URL param to products whether `category` was saved as doc id or slug */
const normCat = (v: string | undefined) => (v ?? "").trim().toLowerCase();

export const getProductsByCategory = async (categoryId: string): Promise<Product[]> => {
  try {
    const [allProducts, allCategories] = await Promise.all([
      getAllProducts(5000),
      getAllCategories(),
    ]);
    const param = normCat(categoryId);
    const cat = allCategories.find(
      (c) => normCat(c.id) === param || normCat(c.slug) === param
    );
    const matchKeys = new Set<string>([param]);
    if (cat) {
      matchKeys.add(normCat(cat.id));
      if (cat.slug) matchKeys.add(normCat(cat.slug));
    }
    return allProducts.filter((p) => matchKeys.has(normCat(p.category)));
  } catch (error) {
    console.error("Error fetching products by category:", error);
    throw new Error("Failed to fetch products");
  }
};

export const getBestSellers = async (limitCount: number = 10): Promise<Product[]> => {
  try {
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      where("badge", "in", ["Best Seller", "Top Rated"]),
      orderBy("rating", "desc"),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    } as Product));
  } catch (error) {
    console.error("Error fetching best sellers:", error);
    return [];
  }
};

export const getDeals = async (limitCount: number = 8): Promise<Product[]> => {
  try {
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      where("originalPrice", ">", 0),
      orderBy("originalPrice", "desc"),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    } as Product));
  } catch (error) {
    console.error("Error fetching deals:", error);
    return [];
  }
};

export const searchProducts = async (searchTerm: string): Promise<Product[]> => {
  try {
    // Firestore doesn't support full-text search, so we fetch and filter
    const productsQuery = query(
      collection(db, PRODUCTS_COLLECTION),
      orderBy("name"),
      limit(100)
    );
    const snapshot = await getDocs(productsQuery);
    const products = snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    } as Product));
    
    // Filter client-side
    const needle = searchTerm.toLowerCase();
    return products.filter((p) => {
      const nameAr = p.nameAr?.toLowerCase() ?? "";
      const descAr = p.descriptionAr?.toLowerCase() ?? "";
      return (
        p.name.toLowerCase().includes(needle) ||
        nameAr.includes(needle) ||
        p.category.toLowerCase().includes(needle) ||
        p.description.toLowerCase().includes(needle) ||
        descAr.includes(needle)
      );
    });
  } catch (error) {
    console.error("Error searching products:", error);
    throw new Error("Failed to search products");
  }
};

// Admin: Create product
export const createProduct = async (product: Omit<Product, "id">): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
      ...product,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error("Failed to create product");
  }
};

// Admin: Update product
export const updateProduct = async (productId: string, updates: Partial<Product>): Promise<void> => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, productId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating product:", error);
    throw new Error("Failed to update product");
  }
};

// Admin: Delete product
export const deleteProduct = async (productId: string): Promise<void> => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, productId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting product:", error);
    throw new Error("Failed to delete product");
  }
};

// Admin: Batch create products (for seeding)
export const batchCreateProducts = async (products: Omit<Product, "id">[]): Promise<void> => {
  try {
    const batch = writeBatch(db);
    products.forEach(product => {
      const docRef = doc(collection(db, PRODUCTS_COLLECTION));
      batch.set(docRef, {
        ...product,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    });
    await batch.commit();
  } catch (error) {
    console.error("Error batch creating products:", error);
    throw new Error("Failed to create products");
  }
};

// ==================== CATEGORIES ====================

export const getAllCategories = async (): Promise<Category[]> => {
  try {
    const q = query(collection(db, CATEGORIES_COLLECTION), orderBy("name"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    } as Category));
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Failed to fetch categories");
  }
};

export const getCategoryById = async (categoryId: string): Promise<Category | null> => {
  try {
    const docRef = doc(db, CATEGORIES_COLLECTION, categoryId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Category;
    }
    return null;
  } catch (error) {
    console.error("Error fetching category:", error);
    throw new Error("Failed to fetch category");
  }
};

// Admin: Create category
export const createCategory = async (category: Omit<Category, "id">): Promise<string> => {
  try {
    // Use slug as the document ID for consistent URLs (fallback if Arabic-only name strips to empty)
    let slug =
      (category.slug || "").trim() ||
      category.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    if (!slug) slug = `cat-${Date.now()}`;
    const docRef = doc(db, CATEGORIES_COLLECTION, slug);
    await setDoc(docRef, {
      ...category,
      slug,
    });
    return slug;
  } catch (error) {
    console.error("Error creating category:", error);
    throw new Error("Failed to create category");
  }
};

// Admin: Update category
export const updateCategory = async (categoryId: string, updates: Partial<Category>): Promise<void> => {
  try {
    const docRef = doc(db, CATEGORIES_COLLECTION, categoryId);
    await updateDoc(docRef, updates);
  } catch (error) {
    console.error("Error updating category:", error);
    throw new Error("Failed to update category");
  }
};

// Admin: Delete category
export const deleteCategory = async (categoryId: string): Promise<void> => {
  try {
    const docRef = doc(db, CATEGORIES_COLLECTION, categoryId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting category:", error);
    throw new Error("Failed to delete category");
  }
};

// ==================== SEEDING ====================

// Seed initial data from static files
export const seedDatabase = async (
  initialProducts: Omit<Product, "id">[],
  initialCategories: Category[]
): Promise<void> => {
  try {
    // Check if data already exists
    const productsSnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
    const categoriesSnapshot = await getDocs(collection(db, CATEGORIES_COLLECTION));
    
    if (productsSnapshot.size > 0 || categoriesSnapshot.size > 0) {
      console.log("Database already seeded");
      return;
    }

    // Seed categories with specific IDs
    const categoriesBatch = writeBatch(db);
    initialCategories.forEach(cat => {
      const docRef = doc(db, CATEGORIES_COLLECTION, cat.id);
      categoriesBatch.set(docRef, {
        name: cat.name,
        slug: cat.slug || cat.id,
        icon: cat.icon,
        image: cat.image,
        count: cat.count,
      });
    });
    await categoriesBatch.commit();

    // Seed products
    const productsBatch = writeBatch(db);
    initialProducts.forEach(prod => {
      const docRef = doc(collection(db, PRODUCTS_COLLECTION));
      productsBatch.set(docRef, {
        ...prod,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    });
    await productsBatch.commit();

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw new Error("Failed to seed database");
  }
};
