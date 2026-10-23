import type { ReactNode } from "react";
import { Pressable, ScrollView, View } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "../generic/themed-text";
import { useAppTheme } from "../theme/theme-provider";

export const APP_COLORS = {
  brown: "#4F3422",
  green: "#8FA66A",
  orange: "#DE6420",
  greenSoft: "#E6ECD8",
  orangeSoft: "#FBE3D3",
  border: "#E8DECF",
  muted: "#7A716C",
  white: "#FFFFFF",
};

export function AppPage({
  title,
  subtitle,
  children,
  back = true,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  back?: boolean;
}) {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          paddingTop: insets.top + 12,
          paddingBottom: insets.bottom + 30,
        }}
      >
        {back && (
          <Pressable
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={8}
            style={({ pressed }) => ({
              width: 46,
              height: 46,
              borderRadius: 23,
              borderWidth: 1,
              borderColor: colors.border,
              alignItems: "center",
              justifyContent: "center",
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Feather name="chevron-left" size={24} color={colors.heading} />
          </Pressable>
        )}
        <ThemedText
          variant="heading"
          style={{
            marginTop: back ? 24 : 8,
            color: colors.heading,
            fontSize: 32,
            lineHeight: 39,
          }}
        >
          {title}
        </ThemedText>
        {subtitle ? (
          <ThemedText
            style={{
              marginTop: 8,
              color: colors.subtleText,
              fontSize: 16,
              lineHeight: 24,
            }}
          >
            {subtitle}
          </ThemedText>
        ) : null}
        <View style={{ marginTop: 24, gap: 14 }}>{children}</View>
      </ScrollView>
    </View>
  );
}

export function AppCard({
  children,
  style,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const { colors } = useAppTheme();
  return (
    <View
      style={[
        {
          padding: 18,
          borderRadius: 22,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.surface,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function AppButton({
  label,
  onPress,
  secondary = false,
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  secondary?: boolean;
  disabled?: boolean;
}) {
  const { colors } = useAppTheme();
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      style={({ pressed }) => ({
        minHeight: 54,
        paddingHorizontal: 22,
        borderRadius: 27,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: secondary ? colors.surface : colors.heading,
        borderWidth: secondary ? 1 : 0,
        borderColor: colors.border,
        opacity: disabled ? 0.45 : pressed ? 0.82 : 1,
      })}
    >
      <ThemedText
        variant="heading"
        style={{
          color: secondary ? colors.heading : colors.surface,
          fontSize: 17,
        }}
      >
        {label}
      </ThemedText>
    </Pressable>
  );
}

export function AppChoice({
  label,
  selected,
  onPress,
  detail,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  detail?: string;
}) {
  const { colors } = useAppTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      style={({ pressed }) => ({
        padding: 16,
        minHeight: 56,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: selected ? colors.accent : colors.border,
        backgroundColor: colors.surface,
        opacity: pressed ? 0.8 : 1,
      })}
    >
      <ThemedText variant="heading" style={{ color: colors.heading }}>
        {label}
      </ThemedText>
      {detail ? (
        <ThemedText style={{ color: colors.subtleText, marginTop: 4 }}>
          {detail}
        </ThemedText>
      ) : null}
    </Pressable>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  const { colors } = useAppTheme();
  return (
    <ThemedText
      variant="heading"
      style={{ color: colors.heading, fontSize: 21, marginTop: 8 }}
    >
      {children}
    </ThemedText>
  );
}
