import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useStore } from "../context/StoreContext";
const { width, height } = Dimensions.get("window");

export default function details() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { products, addToCart, cart } = useStore();
  const [showSuccess, setShowSuccess] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const translateY = useSharedValue(height);
  const backdropOpacity = useSharedValue(0);
  const successScale = useSharedValue(0);

  const product = products.find((p) => p.id.toString() === id);

  useEffect(() => {
    translateY.value = withSpring(0, { damping: 20, stiffness: 90 });
    backdropOpacity.value = withTiming(1, { duration: 300 });
  }, []);

  if (!product) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Produit non trouvé</Text>
          <TouchableOpacity
            style={styles.errorButton}
            onPress={() => router.back()}
          >
            <Text style={styles.errorButtonText}>Retour</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const handleClose = () => {
    translateY.value = withTiming(height, { duration: 300 });
    backdropOpacity.value = withTiming(0, { duration: 300 });
    setTimeout(() => router.back(), 300);
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }

    setShowSuccess(true);
    successScale.value = withSpring(1, { damping: 12 });

    setTimeout(() => {
      successScale.value = withTiming(0, { duration: 200 });
      setTimeout(() => {
        setShowSuccess(false);
        handleClose();
      }, 200);
    }, 1800);
  };

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (e.translationY > 0) {
        translateY.value = e.translationY;
      }
    })
    .onEnd((e) => {
      if (e.translationY > 100) {
        handleClose();
      } else {
        translateY.value = withSpring(0);
      }
    });

  const animatedModalStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const animatedBackdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const animatedSuccessStyle = useAnimatedStyle(() => ({
    transform: [{ scale: successScale.value }],
    opacity: successScale.value,
  }));

  const totalPrice = product.price * quantity;
  const isInCart = cart.some((item) => item.id === product.id);
  const cartQuantity =
    cart.find((item) => item.id === product.id)?.quantity || 0;

  return (
    <View style={styles.modalOverlay}>
      <StatusBar barStyle="light-content" />

      <Animated.View style={[styles.backdrop, animatedBackdropStyle]}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          onPress={handleClose}
          activeOpacity={1}
        />
      </Animated.View>

      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.modalContent, animatedModalStyle]}>
          <View style={styles.dragIndicator} />

          <View style={styles.header}>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Détails du produit</Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView
            style={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: product.image }}
                style={styles.productImage}
                resizeMode="contain"
              />

              {isInCart && (
                <View style={styles.inCartBadge}>
                  <Text style={styles.inCartText}>
                    🛒 {cartQuantity} dans le panier
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.infoContainer}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryIcon}>
                  {product.category === "electronics"
                    ? "📱"
                    : product.category === "jewelery"
                    ? "💎"
                    : product.category === "men's clothing"
                    ? "👔"
                    : product.category === "women's clothing"
                    ? "👗"
                    : "📦"}
                </Text>
                <Text style={styles.categoryText}>
                  {product.category.charAt(0).toUpperCase() +
                    product.category.slice(1)}
                </Text>
              </View>

              <Text style={styles.productTitle}>{product.title}</Text>

              <View style={styles.ratingContainer}>
                <View style={styles.starsContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Text key={star} style={styles.star}>
                      {star <= Math.round(product.rating?.rate || 4.5)
                        ? "⭐"
                        : "☆"}
                    </Text>
                  ))}
                </View>
                <Text style={styles.ratingText}>
                  {product.rating?.rate || 4.5}
                </Text>
                <Text style={styles.reviewCount}>
                  ({product.rating?.count || 0} avis)
                </Text>
              </View>

              <View style={styles.priceContainer}>
                <Text style={styles.priceLabel}>Prix unitaire</Text>
                <Text style={styles.price}>${product.price.toFixed(2)}</Text>
              </View>

              <View style={styles.descriptionContainer}>
                <Text style={styles.descriptionTitle}>Description</Text>
                <Text style={styles.description}>{product.description}</Text>
              </View>

              <View style={styles.featuresContainer}>
                <Text style={styles.featuresTitle}>Avantages</Text>
                {[
                  "Livraison gratuite",
                  "Retour sous 30 jours",
                  "Garantie 1 an",
                  "Paiement sécurisé",
                ].map((feature, idx) => (
                  <View key={idx} style={styles.feature}>
                    <Text style={styles.featureIcon}>✓</Text>
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={{ height: 100 }} />
          </ScrollView>

          <View style={styles.footer}>
            <View style={styles.footerContent}>
              <View style={styles.footerPriceSection}>
                <Text style={styles.footerPriceLabel}>Total</Text>
                <Text style={styles.footerPrice}>${totalPrice.toFixed(2)}</Text>
              </View>

              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddToCart}
                activeOpacity={0.8}
              >
                <Text style={styles.addButtonIcon}>🛒</Text>
                <Text style={styles.addButtonText}>
                  Ajouter {quantity > 1 ? `(${quantity})` : ""}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </GestureDetector>

      <Modal transparent visible={showSuccess} animationType="none">
        <View style={styles.successOverlay}>
          <Animated.View style={[styles.successModal, animatedSuccessStyle]}>
            <View style={styles.successIconContainer}>
              <Text style={styles.successIcon}>✓</Text>
            </View>
            <Text style={styles.successTitle}>Ajouté au panier !</Text>
            <Text style={styles.successSubtitle} numberOfLines={2}>
              {product.title}
            </Text>
            <View style={styles.successQuantity}>
              <Text style={styles.successQuantityText}>
                Quantité : {quantity}
              </Text>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(139, 92, 246, 1)",
  },
  modalContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.95,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 20,
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: "#D1D5DB",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
  },
  closeIcon: {
    fontSize: 20,
    color: "#6B7280",
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
  },
  scrollContent: {
    flex: 1,
  },
  imageContainer: {
    backgroundColor: "#F9FAFB",
    padding: 24,
    alignItems: "center",
    position: "relative",
  },
  productImage: {
    width: width - 80,
    height: 280,
  },
  inCartBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "#10B981",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  inCartText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  infoContainer: {
    padding: 20,
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3E8FF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryText: {
    color: "#8B5CF6",
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  productTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 12,
    lineHeight: 32,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  starsContainer: {
    flexDirection: "row",
    marginRight: 8,
  },
  star: {
    fontSize: 16,
    marginRight: 2,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginRight: 6,
  },
  reviewCount: {
    fontSize: 14,
    color: "#6B7280",
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  priceLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  price: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#8B5CF6",
  },
  quantitySection: {
    marginBottom: 20,
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 12,
  },
  quantitySelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 8,
  },
  quantityButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#8B5CF6",
    justifyContent: "center",
    alignItems: "center",
  },
  quantityButtonDisabled: {
    backgroundColor: "#E5E7EB",
  },
  quantityButtonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  quantityButtonTextDisabled: {
    color: "#9CA3AF",
  },
  quantityDisplay: {
    width: 80,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 12,
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  quantityText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
  },
  totalPriceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FEF3C7",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#FCD34D",
  },
  totalPriceLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#92400E",
  },
  totalPrice: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#92400E",
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: "#4B5563",
    lineHeight: 24,
  },
  featuresContainer: {
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 12,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 16,
  },
  feature: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  featureIcon: {
    fontSize: 16,
    color: "#10B981",
    marginRight: 12,
    fontWeight: "bold",
  },
  featureText: {
    fontSize: 15,
    color: "#4B5563",
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  footerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  footerPriceSection: {
    flex: 1,
  },
  footerPriceLabel: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 4,
  },
  footerPrice: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#8B5CF6",
  },
  addButton: {
    backgroundColor: "#8B5CF6",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  addButtonIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  addButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  successOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  successModal: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    marginHorizontal: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    // shadowRadius: 12,
    elevation: 12,
    minWidth: 280,
  },
  successIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  successIcon: {
    fontSize: 40,
    color: "white",
    fontWeight: "bold",
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 12,
    textAlign: "center",
  },
  successSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  successQuantity: {
    backgroundColor: "#F3E8FF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  successQuantityText: {
    color: "#8B5CF6",
    fontSize: 14,
    fontWeight: "600",
  },
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  errorText: {
    fontSize: 18,
    color: "#6B7280",
    marginBottom: 20,
  },
  errorButton: {
    backgroundColor: "#8B5CF6",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
  },
  errorButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
