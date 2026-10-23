import { Pressable, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { ThemedText } from "../generic/themed-text";
import { COLORS } from "../../constants/assessment-colors";

type AssessmentHeaderProps = {
  step: number;
  total: number;
  onBack?: () => void;
};

export default function AssessmentHeader({
  step,
  total,
  onBack = () => router.back(),
}: AssessmentHeaderProps) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Pressable
        onPress={onBack}
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
        style={{ flex: 1, marginLeft: 14, fontSize: 24, color: COLORS.brown }}
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
          {step} of {total}
        </ThemedText>
      </View>
    </View>
  );
}
