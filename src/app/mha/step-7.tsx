import { useState } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "../../../components/generic/themed-text";
import { COLORS } from "../../../constants/assessment-colors";
import AssessmentHeader from "../../../components/generic/assessment-header";
import ContinueButton from "../../../components/generic/continue-button";
import ChoiceCard from "../../../components/generic/choice-card";
import { router } from "expo-router";

// TODO: drive these from the real assessment flow
const STEP = 7;
const TOTAL_STEPS = 10;

const CHOICES = [
  {
    id: "yes",
    title: "Yes, one or multiple",
    description:
      "I'm experiencing physical pain in different place over my body.",
    icon: "check",
  },
  {
    id: "no",
    title: "No Physical Pain At All",
    description: "I'm not experiencing any physical pain in my body at all :)",
    icon: "x",
  },
] as const;

type ChoiceId = (typeof CHOICES)[number]["id"];

export default function AssessmentPhysicalDistress() {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<ChoiceId | null>(null);

  const canContinue = selected !== null;

  const handleContinue = () => {
    if (!canContinue) return;
    // TODO: save answer + go to next question
    router.push("/mha/step-8");
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
        <AssessmentHeader step={STEP} total={TOTAL_STEPS} />

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
          Are you experiencing any physical distress?
        </ThemedText>

        <View accessibilityRole="radiogroup" style={{ marginTop: 48, gap: 14 }}>
          {CHOICES.map((choice) => (
            <ChoiceCard
              key={choice.id}
              title={choice.title}
              description={choice.description}
              icon={choice.icon}
              selected={selected === choice.id}
              onPress={() => setSelected(choice.id)}
            />
          ))}
        </View>

        <View style={{ flex: 1, minHeight: 32 }} />

        <ContinueButton onPress={handleContinue} disabled={!canContinue} />
      </ScrollView>
    </View>
  );
}
