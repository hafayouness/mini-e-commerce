import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  Layout,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useStore } from "../context/StoreContext";

const { width } = Dimensions.get("window");

const CartItemCard = ({ item, index, onRemove, onUpdateQuantity }: any) => {
  const opacity = useSharedValue(1);
  const translateX = useSharedValue(0);

  const handleRemove = () => {
    opacity.value = withTiming(0, { duration: 200 });
    translateX.value = withTiming(width, { duration: 300 });
    setTimeout(() => onRemove(), 300);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50).springify()}
      layout={Layout.springify()}
      style={[styles.cartItem, animatedStyle]}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.itemImage}
        resizeMode="contain"
      />

      <View style={styles.itemContent}>
        <Text style={styles.itemTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.itemCategory}>{item.category}</Text>
        <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
      </View>

      <View style={styles.itemActions}>
        <TouchableOpacity onPress={handleRemove} style={styles.removeButton}>
          <Text style={styles.removeIcon}>🗑️</Text>
        </TouchableOpacity>

        <View style={styles.quantityControls}>
          <TouchableOpacity
            onPress={() => onUpdateQuantity(item.id, -1)}
            style={[
              styles.quantityButton,
              item.quantity === 1 && styles.quantityButtonDisabled,
            ]}
            disabled={item.quantity === 1}
          >
            <Text
              style={[
                styles.quantityButtonText,
                item.quantity === 1 && styles.quantityButtonTextDisabled,
              ]}
            >
              −
            </Text>
          </TouchableOpacity>

          <Text style={styles.quantityText}>{item.quantity}</Text>

          <TouchableOpacity
            onPress={() => onUpdateQuantity(item.id, 1)}
            style={styles.quantityButton}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.itemTotal}>
          ${(item.price * item.quantity).toFixed(2)}
        </Text>
      </View>
    </Animated.View>
  );
};

export default function CartPage() {
  const router = useRouter();
  const {
    cart,
    removeFromCart,
    updateQuantity,
    totalPrice,
    totalItems,
    clearCart,
  } = useStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleRemoveItem = (productId: number, productName: string) => {
    Alert.alert(
      "Supprimer l'article",
      `Voulez-vous retirer "${productName}" du panier ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => removeFromCart(productId),
        },
      ]
    );
  };

  const handleClearCart = () => {
    Alert.alert(
      "Vider le panier",
      "Êtes-vous sûr de vouloir vider tout le panier ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Vider",
          style: "destructive",
          onPress: clearCart,
        },
      ]
    );
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      Alert.alert(
        "Commande validée !",
        `Votre commande de ${totalItems} article(s) pour un total de ${totalPrice.toFixed(
          2
        )} a été validée.`,
        [
          {
            text: "OK",
            onPress: () => {
              clearCart();
              router.push("/");
            },
          },
        ]
      );
    }, 2000);
  };

  if (cart.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />

        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Mon Panier</Text>
            <View style={{ width: 40 }} />
          </View>
        </View>

        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyTitle}>Votre panier est vide</Text>
          <Text style={styles.emptySubtitle}>
            Ajoutez des produits pour commencer vos achats
          </Text>
          <TouchableOpacity
            onPress={() => router.push("./products?categories=all")}
            style={styles.emptyButton}
          >
            <Text style={styles.emptyButtonText}>Découvrir les produits</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const shippingCost = totalPrice > 100 ? 0 : 5.99;
  const finalTotal = totalPrice + shippingCost;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.title}>Mon Panier</Text>
            <Text style={styles.subtitle}>
              {totalItems} article{totalItems > 1 ? "s" : ""}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleClearCart}
            style={styles.clearButton}
          >
            <Text style={styles.clearIcon}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.itemsContainer}>
          {cart.map((item, index) => (
            <CartItemCard
              key={item.id}
              item={item}
              index={index}
              onRemove={() => handleRemoveItem(item.id, item.title)}
              onUpdateQuantity={updateQuantity}
            />
          ))}
        </View>

        {/* Résumé */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Résumé</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Sous-total</Text>
            <Text style={styles.summaryValue}>${totalPrice.toFixed(2)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              Livraison {totalPrice > 100 && "(Gratuite)"}
            </Text>
            <Text
              style={[
                styles.summaryValue,
                shippingCost === 0 && styles.freeShipping,
              ]}
            >
              {shippingCost === 0 ? "Gratuit" : `${shippingCost.toFixed(2)}`}
            </Text>
          </View>

          {totalPrice < 100 && (
            <View style={styles.freeShippingNotice}>
              <Text style={styles.freeShippingText}>
                💡 Plus que ${(100 - totalPrice).toFixed(2)} pour la livraison
                gratuite !
              </Text>
            </View>
          )}

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${finalTotal.toFixed(2)}</Text>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Footer fixe avec bouton */}
      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <View style={styles.footerTotal}>
            <Text style={styles.footerTotalLabel}>Total à payer</Text>
            <Text style={styles.footerTotalValue}>
              ${finalTotal.toFixed(2)}
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.checkoutButton,
              isCheckingOut && styles.checkoutButtonDisabled,
            ]}
            onPress={handleCheckout}
            disabled={isCheckingOut}
          >
            {isCheckingOut ? (
              <Text style={styles.checkoutButtonText}>Traitement...</Text>
            ) : (
              <>
                <Text style={styles.checkoutButtonIcon}>💳</Text>
                <Text style={styles.checkoutButtonText}>
                  Passer la commande
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
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
    paddingTop: Platform.OS === "ios" ? 50 : StatusBar.currentHeight || 40,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  backIcon: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    marginTop: 4,
  },
  clearButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  clearIcon: {
    fontSize: 24,
  },
  content: {
    flex: 1,
  },
  itemsContainer: {
    padding: 16,
  },
  cartItem: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
  },
  itemContent: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  itemCategory: {
    fontSize: 12,
    color: "#6B7280",
    textTransform: "capitalize",
    marginBottom: 8,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#8B5CF6",
  },
  itemActions: {
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  removeButton: {
    padding: 4,
  },
  removeIcon: {
    fontSize: 20,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    padding: 4,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#8B5CF6",
    justifyContent: "center",
    alignItems: "center",
  },
  quantityButtonDisabled: {
    backgroundColor: "#E5E7EB",
  },
  quantityButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  quantityButtonTextDisabled: {
    color: "#9CA3AF",
  },
  quantityText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1F2937",
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: "center",
  },
  itemTotal: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1F2937",
    marginTop: 8,
  },
  summaryContainer: {
    backgroundColor: "white",
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 15,
    color: "#6B7280",
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
  },
  freeShipping: {
    color: "#10B981",
  },
  freeShippingNotice: {
    backgroundColor: "#ECFDF5",
    padding: 12,
    borderRadius: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  freeShippingText: {
    fontSize: 13,
    color: "#047857",
    textAlign: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
  },
  totalValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#8B5CF6",
  },
  footer: {
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  footerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  footerTotal: {
    flex: 1,
  },
  footerTotalLabel: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 4,
  },
  footerTotalValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#8B5CF6",
  },
  checkoutButton: {
    backgroundColor: "#8B5CF6",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  checkoutButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  checkoutButtonIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  checkoutButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 12,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 32,
  },
  emptyButton: {
    backgroundColor: "#8B5CF6",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  emptyButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
