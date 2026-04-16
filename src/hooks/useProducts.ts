import { useState, useEffect, useCallback } from "react";
import {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  getBestSellers,
  getDeals,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllCategories,
  type Product,
  type Category,
} from "@/services/productService";

// ==================== PRODUCTS HOOK ====================

export const useProducts = (limit: number = 100) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getAllProducts(limit);
        setProducts(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [limit]);

  return { products, loading, error, refetch: () => getAllProducts(limit).then(setProducts) };
};

export const useProduct = (productId: string) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductById(productId);
        setProduct(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  return { product, loading, error, refetch: () => getProductById(productId).then(setProduct) };
};

export const useProductsByCategory = (categoryId: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!categoryId) return;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setProducts([]);
        const data = await getProductsByCategory(categoryId);
        setProducts(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

  return { products, loading, error, refetch: () => getProductsByCategory(categoryId).then(setProducts) };
};

export const useBestSellers = (limit: number = 10) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getBestSellers(limit);
        setProducts(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to fetch best sellers");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [limit]);

  return { products, loading, error };
};

export const useDeals = (limit: number = 8) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getDeals(limit);
        setProducts(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to fetch deals");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [limit]);

  return { products, loading, error };
};

export const useSearchProducts = (searchTerm: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!searchTerm || searchTerm.length < 2) {
      setProducts([]);
      return;
    }

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await searchProducts(searchTerm);
        setProducts(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to search products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchTerm]);

  return { products, loading, error };
};

// ==================== CATEGORIES HOOK ====================

// Category name translations
const categoryNameMap: Record<string, { ar: string; en: string }> = {
  "books": { ar: "كتب", en: "Books" },
  "educational": { ar: "مواد تعليمية", en: "Educational Materials" },
  "electronics": { ar: "إلكترونيات", en: "Electronics" },
  "toys": { ar: "ألعاب", en: "Toys & Games" },
  "gifts": { ar: "هدايا", en: "Gifts" },
  "art": { ar: "أدوات فنية", en: "Art Supplies" },
  "office": { ar: "أدوات مكتبية", en: "Office Supplies" },
  "digital": { ar: "منتجات رقمية", en: "Digital Products" },
};

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        // Get all categories from Firebase
        const categoriesData = await getAllCategories();
        
        // Get all products to calculate counts
        const productsData = await getAllProducts(1000);
        
        // Calculate product count for each category
        const categoriesWithCount = categoriesData.map(cat => {
          const slug = cat.slug || cat.id;
          const count = productsData.filter(p => {
            const pc = (p.category ?? "").trim().toLowerCase();
            return pc === cat.id.trim().toLowerCase() || (slug && pc === slug.trim().toLowerCase());
          }).length;

          return {
            ...cat,
            count,
            slug,
          };
        });

        setCategories(categoriesWithCount);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to fetch categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error, refetch: () => getAllCategories().then(setCategories) };
};

export const useCategory = (categoryId: string) => {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!categoryId) return;

    const fetchCategory = async () => {
      try {
        setLoading(true);
        // We'll use the categories list and find by id
        const { getCategoryById } = await import("@/services/productService");
        const data = await getCategoryById(categoryId);
        setCategory(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to fetch category");
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId]);

  return { category, loading, error };
};

// ==================== ADMIN HOOKS ====================

export const useProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllProducts(1000);
      setProducts(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addProduct = async (product: Omit<Product, "id">) => {
    try {
      setActionLoading(true);
      const id = await createProduct(product);
      await fetchProducts();
      return id;
    } catch (err: any) {
      setError(err.message || "Failed to create product");
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const editProduct = async (productId: string, updates: Partial<Product>) => {
    try {
      setActionLoading(true);
      await updateProduct(productId, updates);
      await fetchProducts();
    } catch (err: any) {
      setError(err.message || "Failed to update product");
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const removeProduct = async (productId: string) => {
    try {
      setActionLoading(true);
      await deleteProduct(productId);
      await fetchProducts();
    } catch (err: any) {
      setError(err.message || "Failed to delete product");
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  return {
    products,
    loading,
    error,
    actionLoading,
    addProduct,
    editProduct,
    removeProduct,
    refresh: fetchProducts,
  };
};

export const useCategoryManagement = () => {
  const { categories, loading, error, refetch } = useCategories();

  return {
    categories,
    loading,
    error,
    refresh: refetch,
  };
};
