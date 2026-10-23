import { Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "../generic/themed-text";
import { COLORS } from "../../constants/assessment-colors";

const BUTTON_HEIGHT = 58;

type ContinueButtonProps = {
  onPress: () => void;
  disabled?: boolean;
};

export default function ContinueButton({
  onPress,
  disabled = false,
}: ContinueButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      style={({ pressed }) => ({
        height: BUTTON_HEIGHT,
        borderRadius: BUTTON_HEIGHT / 2,
        backgroundColor: COLORS.brown,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        opacity: disabled ? 0.5 : pressed ? 0.9 : 1,
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
  );
}
