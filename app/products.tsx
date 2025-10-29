import React, { useEffect } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { useStore } from "../context/StoreContext";

const { width } = Dimensions.get("window");

export default function index() {
  const { products, addToCart, loading, error } = useStore();
  console.log(products);

  const fadeAnim = useSharedValue(0);

  useEffect(() => {
    fadeAnim.value = withTiming(1, {
      duration: 800,
      easing: Easing.out(Easing.ease),
    });
  }, []);

  const renderItem = ({ item, index }: any) => {
    const animatedStyle = useAnimatedStyle(() => ({
      opacity: fadeAnim.value,
      transform: [
        {
          translateY: withDelay(
            index * 100,
            withTiming(0, { duration: 500, easing: Easing.out(Easing.ease) })
          ),
        },
        {
          scale: withDelay(
            index * 100,
            withTiming(1, { duration: 500, easing: Easing.out(Easing.ease) })
          ),
        },
      ],
    }));

    return (
      <Animated.View style={[styles.card, animatedStyle]}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.price}>${item.price}</Text>
        <Pressable style={styles.button} onPress={() => addToCart(item)}>
          <Text style={styles.buttonText}>Ajouter au panier</Text>
        </Pressable>
      </Animated.View>
    );
  };

  if (loading) return <Text style={styles.center}>Chargement...</Text>;
  if (error) return <Text style={styles.center}>Erreur: {error}</Text>;

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f5f5f5",
    paddingBottom: 32,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    transform: [{ scale: 0.95 }],
  },
  image: {
    width: width - 64,
    height: 200,
    resizeMode: "contain",
    borderRadius: 12,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },
  price: {
    fontSize: 14,
    color: "#8B5CF6",
    fontWeight: "600",
    marginBottom: 8,
  },
  button: {
    backgroundColor: "#8B5CF6",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  center: {
    flex: 1,
    textAlign: "center",
  },
});
