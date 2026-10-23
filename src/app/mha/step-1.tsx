import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { ThemedText } from "../../../components/generic/themed-text";
import OptionCard from "../../../components/generic/option-card";
import { COLORS } from "../../../constants/assessment-colors";

const BUTTON_HEIGHT = 58;

// TODO: drive these from the real assessment flow
const STEP = 1;
const TOTAL_STEPS = 10;

const OPTIONS = [
  { id: "stress", label: "I wanna reduce stress", icon: "heart" },
  { id: "ai-therapy", label: "I wanna try AI Therapy", icon: "robot-happy" },
  { id: "trauma", label: "I want to cope with trauma", icon: "flag" },
  {
    id: "better-person",
    label: "I want to be a better person",
    icon: "emoticon-happy",
  },
  {
    id: "just-trying",
    label: "Just trying out the app, mate!",
    icon: "cellphone",
  },
] as const;

type OptionId = (typeof OPTIONS)[number]["id"];

export default function Assessment() {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<OptionId | null>(null);

  const canContinue = selected !== null;

  const handleContinue = () => {
    if (!canContinue) return;
    // TODO: save answer + go to next question
    router.push("/mha/step-2");
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 16,
          paddingTop: insets.top + 8,
          paddingBottom: insets.bottom + 24,
        }}
      >
        {/* Header */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Pressable
            onPress={() => router.back()}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              borderWidth: 1.5,
              borderColor: COLORS.brown,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Feather name="chevron-left" size={24} color={COLORS.brown} />
          </Pressable>

          <ThemedText
            style={{
              flex: 1,
              marginLeft: 14,
              fontSize: 24,
              color: COLORS.brown,
            }}
            variant="heading"
          >
            Assessment
          </ThemedText>

          <View
            style={{
              height: 30,
              paddingHorizontal: 12,
              borderRadius: 15,
              backgroundColor: COLORS.pillBg,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ThemedText
              style={{ fontSize: 17, color: COLORS.pillText }}
              variant="heading"
            >
              {STEP} of {TOTAL_STEPS}
            </ThemedText>
          </View>
        </View>

        {/* Question */}
        <ThemedText
          style={{
            fontSize: 34,
            lineHeight: 40,
            color: COLORS.brown,
            textAlign: "center",
            marginTop: 40,
          }}
          variant="heading"
        >
          What's your health goal for today?
        </ThemedText>

        {/* Options */}
        <View accessibilityRole="radiogroup" style={{ marginTop: 48, gap: 13 }}>
          {OPTIONS.map((option) => (
            <OptionCard
              key={option.id}
              label={option.label}
              icon={option.icon}
              selected={selected === option.id}
              onPress={() => setSelected(option.id)}
            />
          ))}
        </View>

        <View style={{ flex: 1, minHeight: 32 }} />

        {/* Continue button */}
        <Pressable
          onPress={handleContinue}
          disabled={!canContinue}
          accessibilityRole="button"
          accessibilityState={{ disabled: !canContinue }}
          style={({ pressed }) => ({
            height: BUTTON_HEIGHT,
            borderRadius: BUTTON_HEIGHT / 2,
            backgroundColor: COLORS.brown,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            opacity: !canContinue ? 0.5 : pressed ? 0.9 : 1,
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
    </View>
  );
}
