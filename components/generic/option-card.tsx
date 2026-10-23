import { ComponentProps } from "react";
import { Pressable, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ThemedText } from "../generic/themed-text";
import { COLORS } from "../../constants/assessment-colors";

const OPTION_HEIGHT = 58;
const HALO = 4; // halo ring thickness in px

type OptionCardProps = {
  label: string;
  icon: ComponentProps<typeof MaterialCommunityIcons>["name"];
  selected: boolean;
  onPress: () => void;
};

export default function OptionCard({
  label,
  icon,
  selected,
  onPress,
}: OptionCardProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={label}
      style={({ pressed }) => ({
        height: OPTION_HEIGHT,
        opacity: pressed ? 0.9 : 1,
      })}
    >
      {/* Halo ring just outside the pill. Never affects layout. */}
      {selected && (
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: -HALO,
            left: -HALO,
            right: -HALO,
            bottom: -HALO,
            borderRadius: (OPTION_HEIGHT + HALO * 2) / 2,
            borderWidth: HALO,
            borderColor: COLORS.greenHalo,
          }}
        />
      )}

      <View
        style={{
          flex: 1,
          borderRadius: OPTION_HEIGHT / 2,
          backgroundColor: selected ? COLORS.green : COLORS.white,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 18,
          gap: 12,
          shadowColor: COLORS.brown,
          shadowOpacity: selected ? 0 : 0.08,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 4 },
          elevation: selected ? 0 : 2,
        }}
      >
        <MaterialCommunityIcons
          name={icon}
          size={22}
          color={selected ? COLORS.white : COLORS.iconGrey}
        />

        <ThemedText
          style={{
            flex: 1,
            fontSize: 18,
            color: selected ? COLORS.white : COLORS.brown,
          }}
          variant="heading"
        >
          {label}
        </ThemedText>

        {/* Radio */}
        <View
          style={{
            width: 22,
            height: 22,
            borderRadius: 11,
            borderWidth: 2,
            borderColor: selected ? COLORS.white : COLORS.brown,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {selected && (
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: COLORS.white,
              }}
            />
          )}
        </View>
      </View>
    </Pressable>
  );
}
