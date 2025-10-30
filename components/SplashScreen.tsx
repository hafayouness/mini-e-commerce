import React, { useEffect } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

export default function SplashScreen() {
  const scale = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    scale.value = withSpring(1, {
      damping: 12,
      stiffness: 100,
    });

    rotate.value = withSequence(
      withTiming(360, { duration: 800, easing: Easing.out(Easing.ease) }),
      withTiming(0, { duration: 0 })
    );

    opacity.value = withDelay(400, withTiming(1, { duration: 600 }));
    translateY.value = withDelay(400, withSpring(0, { damping: 15 }));

    pulseScale.value = withDelay(
      1000,
      withRepeat(
        withSequence(
          withTiming(1.05, { duration: 800 }),
          withTiming(1, { duration: 800 })
        ),
        -1,
        true
      )
    );
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value * pulseScale.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.circleBackground}>
        <View style={[styles.circle, styles.circle1]} />
        <View style={[styles.circle, styles.circle2]} />
        <View style={[styles.circle, styles.circle3]} />
      </View>

      <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
        <View style={styles.logo}>
          <Text style={styles.logoIcon}>🛍️</Text>
        </View>

        <View style={styles.shine} />
      </Animated.View>

      <Animated.View style={[styles.textContainer, textAnimatedStyle]}>
        <Text style={styles.title}>Tout en Un</Text>
        <View style={styles.subtitleContainer}>
          <View style={styles.line} />
          <Text style={styles.subtitle}>Votre boutique en ligne</Text>
          <View style={styles.line} />
        </View>

        <View style={styles.loadingContainer}>
          <View style={styles.loadingBar}>
            <Animated.View style={styles.loadingProgress} />
          </View>
        </View>
      </Animated.View>

      <Animated.View style={[styles.footer, textAnimatedStyle]}>
        <Text style={styles.version}>by youness hafa</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#8B5CF6",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  circleBackground: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  circle: {
    position: "absolute",
    borderRadius: 1000,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  circle1: {
    width: 300,
    height: 300,
    top: -100,
    left: -100,
  },
  circle2: {
    width: 200,
    height: 200,
    bottom: 100,
    right: -50,
  },
  circle3: {
    width: 150,
    height: 150,
    top: "50%",
    right: 50,
  },
  logoContainer: {
    position: "relative",
    marginBottom: 40,
  },
  logo: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 15,
    borderWidth: 4,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  logoIcon: {
    fontSize: 70,
  },
  shine: {
    position: "absolute",
    top: 10,
    left: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
  },
  textContainer: {
    alignItems: "center",
  },
  title: {
    color: "white",
    fontSize: 48,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    letterSpacing: -1,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
  },
  subtitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
  },
  line: {
    width: 40,
    height: 2,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginHorizontal: 12,
  },
  subtitle: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 16,
    textAlign: "center",
    letterSpacing: 1,
    fontWeight: "500",
  },
  loadingContainer: {
    width: width * 0.6,
    alignItems: "center",
  },
  loadingBar: {
    width: "100%",
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 2,
    overflow: "hidden",
  },
  loadingProgress: {
    width: "50%",
    height: "100%",
    backgroundColor: "white",
  },
  footer: {
    position: "absolute",
    bottom: 20,
  },
  version: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
  },
});
