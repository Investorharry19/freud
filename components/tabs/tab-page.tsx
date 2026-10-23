import type { ReactNode } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "../generic/themed-text";
import BottomTabBar from "../navigation/bottom-tab-bar";
import { useAppTheme } from "../theme/theme-provider";

type TabPageProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

export default function TabPage({ title, subtitle, children }: TabPageProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          paddingTop: insets.top + 24,
          paddingBottom: insets.bottom + 120,
        }}
      >
        <ThemedText
          style={{ fontSize: 16, color: colors.subtleText }}
          variant="heading"
        >
          freud.ai
        </ThemedText>
        <ThemedText
          style={{
            fontSize: 34,
            lineHeight: 40,
            color: colors.heading,
            marginTop: 28,
          }}
          variant="heading"
        >
          {title}
        </ThemedText>
        <ThemedText
          style={{
            fontSize: 18,
            lineHeight: 26,
            color: colors.subtleText,
            marginTop: 8,
          }}
        >
          {subtitle}
        </ThemedText>
        <View style={{ marginTop: 28 }}>{children}</View>
      </ScrollView>
      <BottomTabBar />
    </View>
  );
}
