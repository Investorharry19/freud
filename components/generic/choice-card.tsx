import { ComponentProps } from "react";
import { Pressable, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "../generic/themed-text";
import { COLORS } from "../../constants/assessment-colors";

const RADIUS = 36;
const HALO = 4; // halo ring thickness in px
const BADGE_SIZE = 52;

type ChoiceCardProps = {
  title: string;
  description: string;
  icon: ComponentProps<typeof Feather>["name"];
  selected: boolean;
  onPress: () => void;
};

export default function ChoiceCard({
  title,
  description,
  icon,
  selected,
  onPress,
}: ChoiceCardProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={`${title}. ${description}`}
      style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}
    >
      {/* Halo ring just outside the card. Never affects layout. */}
      {selected && (
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: -HALO,
            left: -HALO,
            right: -HALO,
            bottom: -HALO,
            borderRadius: RADIUS + HALO,
            borderWidth: HALO,
            borderColor: COLORS.greenHalo,
          }}
        />
      )}

      <View
        style={{
          borderRadius: RADIUS,
          backgroundColor: selected ? COLORS.green : COLORS.white,
          paddingHorizontal: 18,
          paddingTop: 18,
          paddingBottom: 24,
          shadowColor: COLORS.brown,
          shadowOpacity: selected ? 0 : 0.08,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 4 },
          elevation: selected ? 0 : 2,
        }}
      >
        {/* Icon badge */}
        <View
          style={{
            width: BADGE_SIZE,
            height: BADGE_SIZE,
            borderRadius: BADGE_SIZE / 2,
            backgroundColor: selected ? COLORS.badgeBgSelected : COLORS.badgeBg,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Feather
            name={icon}
            size={24}
            color={selected ? COLORS.white : COLORS.badgeIcon}
          />
        </View>

        {/* Radio, pinned to the right at the title's height */}
        <View
          style={{
            position: "absolute",
            right: 18,
            top: 18 + BADGE_SIZE + 12,
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

        <ThemedText
          style={{
            marginTop: 20,
            fontSize: 22,
            color: selected ? COLORS.white : COLORS.brown,
          }}
          variant="heading"
        >
          {title}
        </ThemedText>

        <ThemedText
          style={{
            marginTop: 6,
            paddingRight: 36,
            fontSize: 18,
            lineHeight: 28,
            color: selected ? COLORS.white : COLORS.descriptionGrey,
          }}
        >
          {description}
        </ThemedText>
      </View>
    </Pressable>
  );
}
