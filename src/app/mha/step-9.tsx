import { useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "../../../components/generic/themed-text";
import AssessmentHeader from "../../../components/generic/assessment-header";
import ContinueButton from "../../../components/generic/continue-button";
import RatingScale from "../../../components/generic/rating-scale";
import { COLORS } from "../../../constants/assessment-colors";
import { router } from "expo-router";

// TODO: drive these from the real assessment flow
const STEP = 9;
const TOTAL_STEPS = 10;

const DEFAULT_LEVEL = 3;

// TODO: confirm the copy for 1-4 with design (only 5 is in the mockup)
const LEVEL_LABELS = [
  "You Are Completely Relaxed.",
  "You Are Feeling Calm.",
  "You Are A Little Stressed.",
  "You Are Very Stressed.",
  "You Are Extremely Stressed Out.",
];

export default function AssessmentStress() {
  const insets = useSafeAreaInsets();
  const [level, setLevel] = useState(DEFAULT_LEVEL);

  const handleContinue = () => {
    // TODO: save level + go to next question
    router.push("/assessment/voice-consent");
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.background,
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
        How would you rate your stress level?
      </ThemedText>

      {/* Big number takes the free space between the title and the scale */}
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ThemedText
          style={{
            fontSize: 190,
            lineHeight: 210,
            color: COLORS.brown,
            textAlign: "center",
          }}
          variant="heading"
        >
          {level}
        </ThemedText>
      </View>

      <View style={{ marginHorizontal: 4 }}>
        <RatingScale count={5} value={level} onChange={setLevel} />
      </View>

      <ThemedText
        style={{
          fontSize: 23,
          color: COLORS.grey,
          textAlign: "center",
          marginTop: 28,
          marginBottom: 48,
        }}
        variant="heading"
      >
        {LEVEL_LABELS[level - 1]}
      </ThemedText>

      <ContinueButton onPress={handleContinue} />
    </View>
  );
}
