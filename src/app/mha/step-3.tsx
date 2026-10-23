import { useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "../../../components/generic/themed-text";
import AssessmentHeader from "../../../components/generic/assessment-header";
import ContinueButton from "../../../components/generic/continue-button";
import { COLORS } from "../../../constants/assessment-colors";
import WheelPicker from "../../../components/generic/wheel-picker";
import { router } from "expo-router";

// TODO: drive these from the real assessment flow
const STEP = 3;
const TOTAL_STEPS = 10;

const MIN_AGE = 13;
const MAX_AGE = 100;
const DEFAULT_AGE = 18;

export default function AssessmentAge() {
  const insets = useSafeAreaInsets();
  const [age, setAge] = useState(DEFAULT_AGE);

  const handleContinue = () => {
    // TODO: save age + go to next question
    router.push("/mha/step-4");
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
        What's your age?
      </ThemedText>

      {/* Wheel takes the free space between the title and the button */}
      <View style={{ flex: 1, justifyContent: "center" }}>
        <WheelPicker
          min={MIN_AGE}
          max={MAX_AGE}
          value={age}
          onChange={setAge}
        />
      </View>

      <ContinueButton onPress={handleContinue} />
    </View>
  );
}
