import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
interface Rating {
  rate: number;
  count: number;
}

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: Rating;
}

interface CartItem extends Product {
  quantity: number;
}

interface StoreContextType {
  cart: CartItem[];
  products: Product[];
  categories: string[];
  loading: boolean;
  error: string | null;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, delta: number) => void;
  clearCart: () => void;
  totalPrice: number;
  totalItems: number;
  fetchProducts: () => Promise<void>;
  fetchCategories: (category: string) => Promise<void>;
  fetchProductsByCategory: (category: string) => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore doit être utilisé dans un StoreProvider");
  }
  return context;
};

interface StoreProviderProps {
  children: ReactNode;
}

export const StoreProvider = ({ children }: StoreProviderProps) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("https://fakestoreapi.com/products");
      console.log(response);

      if (!response.ok) {
        throw new Error("Erreur lors du chargement des produits");
      }

      const data: Product[] = await response.json();
      console.log(data);
      setProducts(data);
    } catch (err) {
      console.error("Erreur:", err);
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const fetchProductsByCategory = async (category: string) => {
    try {
      setLoading(true);
      setError(null);

      const url =
        category === "all"
          ? "https://fakestoreapi.com/products"
          : `https://fakestoreapi.com/products/category/${category}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Erreur lors du chargement des produits");
      }

      const data: Product[] = await response.json();
      setProducts(data);
    } catch (err) {
      console.error("Erreur:", err);
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };
  const fetchCategories = async () => {
    try {
      const response = await fetch(
        "https://fakestoreapi.com/products/categories"
      );

      if (!response.ok) {
        throw new Error("Erreur lors du chargement des catégories");
      }

      const data: string[] = await response.json();
      setCategories(data);
    } catch (err) {
      console.error("Erreur catégories:", err);
    }
  };
  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchCategories();
  }, []);
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };
  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === productId) {
            const newQuantity = item.quantity + delta;

            if (newQuantity <= 0) {
              return null;
            }

            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <StoreContext.Provider
      value={{
        cart,
        products,
        categories,
        loading,
        error,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalPrice,
        totalItems,
        fetchProducts,
        fetchProductsByCategory,
        fetchCategories,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};
