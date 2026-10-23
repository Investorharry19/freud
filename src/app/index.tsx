import React, { useEffect } from "react";
import Lottie from "lottie-react-native";
import { View } from "react-native";
import { ThemedText } from "../../components/generic/themed-text";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { router } from "expo-router";
import { useAppTheme } from "../../components/theme/theme-provider";

const PracticeLottie = () => {
  const { colors } = useAppTheme();
  const translateY = useSharedValue(12); // starts 12px lower
  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const handleFinish = (isCancelled: boolean) => {
    if (isCancelled) return;
    translateY.value = withTiming(0, {
      duration: 350,
      easing: Easing.out(Easing.cubic),
    });
    opacity.value = withTiming(1, { duration: 350 });
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace("/tabs/home");
    }, 6000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.background,
      }}
    >
      <Lottie
        source={require("../../assets/lottie/practice.json")}
        autoPlay
        style={{ width: 300, height: 300 }}
        loop={false}
        onAnimationFinish={handleFinish}
      />
      <Animated.View
        style={[
          {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
          },
          animatedStyle,
        ]}
      >
        <ThemedText
          variant="heading"
          style={{ color: colors.heading, fontSize: 36 }}
        >
          freud.ai
        </ThemedText>
      </Animated.View>
    </View>
  );
};

export default PracticeLottie;
