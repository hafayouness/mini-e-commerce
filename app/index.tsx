import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ProductCard from "../components/ProductCard";
import SplashScreen from "../components/SplashScreen";
import { useStore } from "../context/StoreContext";

export default function Index() {
  const router = useRouter();
  const {
    totalItems,
    categories,
    products,
    loading,
    addToCart,
    fetchProducts,
  } = useStore();
  const [showSplash, setShowSplash] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showAddSuccess, setShowAddSuccess] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  };

  const getCategoryCount = (category: string) =>
    products.filter((p) => p.category === category).length;

  const categoryData = [
    { id: "all", name: "Tous", icon: "🏪", color: "#8B5CF6" },
    { id: "electronics", name: "Électronique", icon: "📱", color: "#3B82F6" },
    { id: "jewelery", name: "Bijoux", icon: "💎", color: "#EC4899" },
    { id: "men's clothing", name: "Homme", icon: "👔", color: "#10B981" },
    { id: "women's clothing", name: "Femme", icon: "👗", color: "#F59E0B" },
  ];

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const handleAddToCart = (product: any) => {
    addToCart(product);
    setShowAddSuccess(product.id);
    setTimeout(() => setShowAddSuccess(null), 1500);
  };

  if (showSplash) return <SplashScreen />;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.title}>Tout en Un</Text>
            <Text style={styles.subtitle}>Que cherchez-vous aujourd'hui ?</Text>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/Cart")}
            style={styles.cartButton}
          >
            <Text style={styles.cartIcon}>🛒</Text>
            {totalItems > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{totalItems}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.categoriesSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categoryData.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryChip,
                selectedCategory === category.id && styles.categoryChipActive,
                { borderColor: category.color },
              ]}
              onPress={() => setSelectedCategory(category.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.categoryChipIcon}>{category.icon}</Text>
              <Text
                style={[
                  styles.categoryChipText,
                  selectedCategory === category.id &&
                    styles.categoryChipTextActive,
                ]}
              >
                {category.name}
              </Text>
              <View
                style={[
                  styles.categoryCount,
                  { backgroundColor: category.color },
                ]}
              >
                <Text style={styles.categoryCountText}>
                  {category.id === "all"
                    ? products.length
                    : getCategoryCount(category.id)}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      a
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B5CF6" />
          <Text style={styles.loadingText}>Chargement des produits...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#8B5CF6"
              colors={["#8B5CF6"]}
            />
          }
          renderItem={({ item, index }) => (
            <ProductCard
              item={item}
              index={index}
              onPress={() => router.push(`./details?id=${item.id}`)}
              onAddToCart={() => handleAddToCart(item)}
              showSuccess={showAddSuccess === item.id}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text>Aucun produit</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    backgroundColor: "#8B5CF6",
    paddingTop: 15,

    paddingBottom: 20,
  },
  headerContent: {
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: {
    color: "white",
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
  },
  cartButton: {
    position: "relative",
    marginTop: 8,
  },
  cartIcon: {
    fontSize: 32,
  },
  badge: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#EF4444",
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
    borderWidth: 2,
    borderColor: "white",
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  categoriesSection: {
    backgroundColor: "white",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    marginRight: 12,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryChipActive: {
    backgroundColor: "#F3E8FF",
    borderWidth: 2,
  },
  categoryChipIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    marginRight: 8,
  },
  categoryChipTextActive: {
    color: "#8B5CF6",
    fontWeight: "700",
  },
  categoryCount: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 24,
    alignItems: "center",
  },
  categoryCountText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  infoSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  resultCount: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
  },
  categorySelected: {
    fontSize: 14,
    color: "#8B5CF6",
    fontWeight: "600",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
  row: {
    justifyContent: "space-between",
  },
  cardWrapper: {
    // width: CARD_WIDTH,
    marginBottom: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    position: "relative",
    backgroundColor: "#F9FAFB",
    padding: 16,
    height: 160,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  categoryBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryIconSmall: {
    fontSize: 16,
  },
  promoBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#EF4444",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  promoText: {
    color: "white",
    fontSize: 11,
    fontWeight: "bold",
  },
  cardContent: {
    padding: 12,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
    height: 40,
    lineHeight: 20,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  starIcon: {
    fontSize: 12,
    marginRight: 1,
  },
  ratingText: {
    fontSize: 11,
    color: "#6B7280",
    marginLeft: 4,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#8B5CF6",
  },
  oldPrice: {
    fontSize: 11,
    color: "#9CA3AF",
    textDecorationLine: "line-through",
    marginTop: 2,
  },
  addButton: {
    backgroundColor: "#8B5CF6",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  addButtonSuccess: {
    backgroundColor: "#10B981",
  },
  addButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  // successOverlay: {
  //   ...StyleSheet.absoluteFillObject,
  //   backgroundColor: "rgba(16, 185, 129, 0.95)",
  //   justifyContent: "center",
  //   alignItems: "center",
  //   borderRadius: 16,
  // },
  // successContent: {
  //   alignItems: "center",
  // },
  // successIcon: {
  //   fontSize: 48,
  //   color: "white",
  //   fontWeight: "bold",
  //   marginBottom: 8,
  // },
  // successText: {
  //   color: "white",
  //   fontSize: 16,
  //   fontWeight: "bold",
  // },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6B7280",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },
});
