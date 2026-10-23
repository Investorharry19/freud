import { useState } from "react";
import { Image, Pressable, ScrollView, View } from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { ThemedText } from "../../../components/generic/themed-text";

const COLORS = {
  background: "#F8F4F1",
  green: "#9BB168",
  greenRing: "#E1E6D2",
  brown: "#4F3422",
  pillBg: "#E9DCD6",
  pillText: "#8A5A44",
  white: "#FFFFFF",
};

const BUTTON_HEIGHT = 58;
const HALO = 4; // ring thickness around the selected answer

const CURRENT_STEP = 6;
const TOTAL_STEPS = 10;

type Answer = "yes" | "no";

const ANSWERS: { value: Answer; label: string }[] = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

export default function AssessmentProfessionalHelp() {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<Answer | null>(null);

  const canContinue = selected !== null;

  const handleContinue = () => {
    if (!selected) return;
    // TODO: persist answer + go to next step
    router.push("/mha/step-7");
  };

  // Absolutely-positioned ring just outside the pill.
  // Never affects layout; rendered as a border so it's a true ring.
  const haloStyle = {
    position: "absolute" as const,
    top: -HALO,
    left: -HALO,
    right: -HALO,
    bottom: -HALO,
    borderRadius: (BUTTON_HEIGHT + HALO * 2) / 2,
    borderWidth: HALO,
    borderColor: COLORS.greenRing,
  };

  // Plain render helper (called as a function, not used as a component)
  const renderAnswer = (option: (typeof ANSWERS)[number]) => {
    const isSelected = selected === option.value;

    return (
      <Pressable
        key={option.value}
        onPress={() => setSelected(option.value)}
        accessibilityRole="radio"
        accessibilityState={{ selected: isSelected }}
        accessibilityLabel={option.label}
        style={{ flex: 1, height: BUTTON_HEIGHT }}
      >
        {isSelected && <View pointerEvents="none" style={haloStyle} />}

        <View
          style={{
            flex: 1,
            borderRadius: BUTTON_HEIGHT / 2,
            backgroundColor: isSelected ? COLORS.green : COLORS.white,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ThemedText
            style={{
              fontSize: 20,
              color: isSelected ? COLORS.white : COLORS.brown,
            }}
            variant="heading"
          >
            {option.label}
          </ThemedText>
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
          }}
          variant="heading"
        >
          Have you sought professional help before?
        </ThemedText>

        {/* Illustration (white circle + character + question marks, one asset) */}
        <View
          style={{
            flex: 1,
            minHeight: 240,
            marginVertical: 32,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={require("../../../assets/assessment-professional-help.png")}
            resizeMode="contain"
            style={{ width: "100%", height: "100%", maxHeight: 320 }}
          />
        </View>

        {/* Yes / No */}
        <View
          accessibilityRole="radiogroup"
          style={{ flexDirection: "row", gap: 16, paddingHorizontal: 4 }}
        >
          {ANSWERS.map(renderAnswer)}
        </View>

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
