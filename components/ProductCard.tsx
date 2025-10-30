import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

interface CardProductProps {
  item: any;
  index: number;
  onPress: () => void;
  onAddToCart: () => void;
  showSuccess: boolean;
}

const ProductCard = ({
  item,
  index,
  onPress,
  onAddToCart,
  showSuccess,
}: CardProductProps) => {
  const scale = useSharedValue(1);
  const { width } = Dimensions.get("window");
  const CARD_WIDTH = (width - 48) / 2;

  const tapGesture = Gesture.Tap()
    .onStart(() => {
      scale.value = withSpring(0.95);
    })
    .onEnd(() => {
      scale.value = withSpring(1);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "electronics":
        return "📱";
      case "jewelery":
        return "💎";
      case "men's clothing":
        return "👔";
      case "women's clothing":
        return "👗";
      default:
        return "📦";
    }
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50).springify()}
      style={[{ width: CARD_WIDTH, marginBottom: 16 }, animatedStyle]}
    >
      <GestureDetector gesture={tapGesture}>
        <TouchableOpacity
          style={styles.card}
          onPress={onPress}
          activeOpacity={0.9}
        >
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: item.image }}
              style={styles.image}
              resizeMode="contain"
            />
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryIconSmall}>
                {getCategoryIcon(item.category)}
              </Text>
            </View>
            {index % 4 === 0 && (
              <View style={styles.promoBadge}>
                <Text style={styles.promoText}>-15%</Text>
              </View>
            )}
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.productTitle} numberOfLines={2}>
              {item.title}
            </Text>

            <View style={styles.ratingRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Text key={star} style={styles.starIcon}>
                  {star <= Math.round(item.rating?.rate || 4.5) ? "⭐" : "☆"}
                </Text>
              ))}
              <Text style={styles.ratingText}>({item.rating?.count || 0})</Text>
            </View>

            <View style={styles.footer}>
              <View>
                <Text style={styles.price}>${item.price.toFixed(2)}</Text>
                {index % 4 === 0 && (
                  <Text style={styles.oldPrice}>
                    ${(item.price * 1.18).toFixed(2)}
                  </Text>
                )}
              </View>

              <TouchableOpacity
                style={[
                  styles.addButton,
                  showSuccess && styles.addButtonSuccess,
                ]}
                onPress={(e) => {
                  e.stopPropagation();
                  onAddToCart();
                }}
              >
                <Text style={styles.addButtonText}>
                  {showSuccess ? "✓" : "+"}
                </Text>
                {showSuccess && (
                  <View style={styles.iconAlert}>
                    <Text style={styles.iconAlertText}></Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </GestureDetector>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
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
  iconAlert: {
    position: "absolute",
    top: -10,
    right: -10,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },

  iconAlertText: {
    color: "white",
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
export default ProductCard;
