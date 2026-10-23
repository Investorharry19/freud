import { useState } from "react";
import {
  Image,
  ImageSourcePropType,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ThemedText } from "../../../components/generic/themed-text";

const COLORS = {
  background: "#F8F4F1",
  green: "#9BB168",
  greenSoft: "#E4E8D5",
  brown: "#4F3422",
  brownHalo: "rgba(79, 52, 34, 0.16)",
  pillBg: "#E9DCD6",
  pillText: "#8A5A44",
  charcoal: "#3D3A35",
  white: "#FFFFFF",
};

const BUTTON_HEIGHT = 58;
const CARD_HEIGHT = 160;
const CARD_RADIUS = 48;
const HALO = 8; // halo ring thickness in px

const CURRENT_STEP = 2;
const TOTAL_STEPS = 10;

type Choice = "male" | "female" | "skip";

const OPTIONS: {
  value: Exclude<Choice, "skip">;
  label: string;
  icon: "male-outline" | "female-outline";
  image: ImageSourcePropType;
}[] = [
  {
    value: "male",
    label: "I am Male",
    icon: "male-outline",
    image: require("../../../assets/assessment-male.png"),
  },
  {
    value: "female",
    label: "I am Female",
    icon: "female-outline",
    image: require("../../../assets/assessment-female.png"),
  },
];

export default function AssessmentGender() {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<Choice | null>("male");

  const canContinue = selected !== null;

  const handleContinue = () => {
    if (!selected) return;
    // TODO: persist answer + go to next step
    router.push("/mha/step-3");
  };

  // Absolutely-positioned ring just outside the card.
  // Never affects layout; rendered as a border so it's a true ring.
  const haloStyle = {
    position: "absolute" as const,
    top: -HALO,
    left: -HALO,
    right: -HALO,
    bottom: -HALO,
    borderRadius: CARD_RADIUS + HALO,
    borderWidth: HALO,
    borderColor: COLORS.brownHalo,
  };

  // Plain render helper (called as a function, not used as a component)
  const renderCard = (option: (typeof OPTIONS)[number]) => {
    const isSelected = selected === option.value;

    return (
      <Pressable
        key={option.value}
        onPress={() => setSelected(option.value)}
        accessibilityRole="radio"
        accessibilityState={{ selected: isSelected }}
        accessibilityLabel={option.label}
        style={{
          height: CARD_HEIGHT,
          marginTop: 12,
          borderRadius: CARD_RADIUS,
          backgroundColor: COLORS.white,
          shadowColor: COLORS.brown,
          shadowOpacity: isSelected ? 0 : 0.08,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 6 },
          elevation: isSelected ? 0 : 3,
        }}
      >
        {isSelected && <View pointerEvents="none" style={haloStyle} />}

        <View
          style={{
            flex: 1,
            borderRadius: CARD_RADIUS,
            overflow: "hidden",
            backgroundColor: COLORS.white,
          }}
        >
          {/* Illustration, pinned bottom-right */}
          <Image
            source={option.image}
            resizeMode="cover"
            style={{
              position: "absolute",
              right: 0,
              bottom: 0,
              width: "62%",
              height: "100%",
            }}
          />

          {/* Label + gender icon */}
          <View
            style={{
              flex: 1,
              paddingHorizontal: 28,
              paddingTop: 22,
              paddingBottom: 24,
              justifyContent: "space-between",
            }}
          >
            <ThemedText
              style={{ fontSize: 20, color: COLORS.charcoal }}
              variant="heading"
            >
              {option.label}
            </ThemedText>
            <Ionicons name={option.icon} size={30} color={COLORS.charcoal} />
          </View>

          {/* Selected border drawn on top so the image never covers it */}
          {isSelected && (
            <View
              pointerEvents="none"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: CARD_RADIUS,
                borderWidth: 1.5,
                borderColor: COLORS.brown,
              }}
            />
          )}
        </View>
      </Pressable>
    );
  };

  return (
    <Animated.View
      style={{
        flex: 1,
        backgroundColor: COLORS.background,
        overflow: "hidden",
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 16,
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 24,
        }}
      >
        {/* Header */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Pressable
            onPress={() => router.back()}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            style={({ pressed }) => ({
              width: 52,
              height: 52,
              borderRadius: 26,
              borderWidth: 1.5,
              borderColor: COLORS.brown,
              alignItems: "center",
              justifyContent: "center",
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Feather name="chevron-left" size={26} color={COLORS.brown} />
          </Pressable>

          <ThemedText
            style={{
              flex: 1,
              marginLeft: 16,
              fontSize: 22,
              color: COLORS.brown,
            }}
            variant="heading"
          >
            Assessment
          </ThemedText>

          <View
            style={{
              height: 38,
              paddingHorizontal: 16,
              borderRadius: 19,
              backgroundColor: COLORS.pillBg,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ThemedText
              style={{ fontSize: 17, color: COLORS.pillText }}
              variant="heading"
            >
              {CURRENT_STEP} of {TOTAL_STEPS}
            </ThemedText>
          </View>
        </View>

        {/* Question */}
        <ThemedText
          style={{
            fontSize: 34,
            lineHeight: 42,
            color: COLORS.brown,
            textAlign: "center",
            marginTop: 56,
            marginBottom: 28,
            paddingHorizontal: 24,
          }}
          variant="heading"
        >
          What’s your official gender?
        </ThemedText>

        {/* Options */}
        <View accessibilityRole="radiogroup">{OPTIONS.map(renderCard)}</View>

        {/* Pushes actions to the bottom on tall screens */}
        <View style={{ flex: 1, minHeight: 32 }} />

        {/* Skip */}
        <Pressable
          onPress={() => setSelected("skip")}
          accessibilityRole="radio"
          accessibilityState={{ selected: selected === "skip" }}
          style={({ pressed }) => ({
            height: BUTTON_HEIGHT,
            borderRadius: BUTTON_HEIGHT / 2,
            backgroundColor: COLORS.greenSoft,
            borderWidth: 1,
            borderColor: selected === "skip" ? COLORS.green : "transparent",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
            opacity: pressed ? 0.85 : 1,
          })}
        >
          <ThemedText
            style={{ fontSize: 20, color: COLORS.green }}
            variant="heading"
          >
            Prefer to skip, thanks
          </ThemedText>
          <Feather name="x" size={24} color={COLORS.green} />
        </Pressable>

        {/* Continue */}
        <Pressable
          onPress={handleContinue}
          disabled={!canContinue}
          accessibilityRole="button"
          accessibilityState={{ disabled: !canContinue }}
          style={({ pressed }) => ({
            marginTop: 16,
            height: BUTTON_HEIGHT,
            borderRadius: BUTTON_HEIGHT / 2,
            backgroundColor: COLORS.brown,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            opacity: !canContinue ? 0.4 : pressed ? 0.9 : 1,
          })}
        >
          <ThemedText
            style={{ fontSize: 20, color: COLORS.white }}
            variant="heading"
          >
            Continue
          </ThemedText>
          <Feather name="arrow-right" size={24} color={COLORS.white} />
        </Pressable>
      </ScrollView>
    </Animated.View>
  );
}
