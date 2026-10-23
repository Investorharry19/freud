import { useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  AntDesign,
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { router } from "expo-router";
import { ThemedText } from "../../../components/generic/themed-text";
import { useAppTheme } from "../../../components/theme/theme-provider";

const COLORS = {
  green: "#9BB168",
  grey: "#6F6661",
};

type NotificationSetting =
  | "push"
  | "support"
  | "alert"
  | "sound"
  | "vibration"
  | "updates";

type NotificationSwitchProps = {
  enabled: boolean;
  activeColor: string;
  inactiveColor: string;
};

function NotificationSwitch({
  enabled,
  activeColor,
  inactiveColor,
}: NotificationSwitchProps) {
  const progress = useSharedValue(enabled ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(enabled ? 1 : 0, { duration: 220 });
  }, [enabled, progress]);

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: withTiming(enabled ? activeColor : inactiveColor, {
      duration: 220,
    }),
  }));
  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * 25 }],
  }));

  return (
    <Animated.View
      style={[
        {
          height: 38,
          width: 65,
          marginLeft: "auto",
          borderRadius: 10,
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        },
        trackStyle,
      ]}
    >
      <Animated.View
        style={[
          {
            height: 32,
            width: 32,
            position: "absolute",
            left: 4,
            backgroundColor: "#FFFFFF",
            borderRadius: 8,
          },
          thumbStyle,
        ]}
      />
    </Animated.View>
  );
}

export default function Notification() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useAppTheme();
  const [settings, setSettings] = useState<
    Record<NotificationSetting, boolean>
  >({
    push: true,
    support: false,
    alert: true,
    sound: true,
    vibration: true,
    updates: true,
  });

  const toggleSetting = (setting: NotificationSetting) => {
    setSettings((current) => ({ ...current, [setting]: !current[setting] }));
  };

  const activeSwitchColor = isDark ? colors.accent : COLORS.green;
  const inactiveSwitchColor = isDark ? colors.border : COLORS.grey;

  return (
    <Animated.View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        overflow: "hidden",
      }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={
            Platform.OS === "ios" ? "interactive" : "on-drag"
          }
          showsVerticalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 16,
            paddingBottom: insets.bottom + 24,
          }}
        >
          <View
            style={{
              position: "relative",
              marginBottom: 50,
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
              marginTop: 50,
            }}
          >
            <View
              style={{
                zIndex: 3,
                borderRadius: 30,
                paddingVertical: 8,
                paddingHorizontal: 15,
                borderWidth: 1,
                borderColor: colors.heading,
                width: 60,
              }}
            >
              <Ionicons
                name="return-up-back-outline"
                color={colors.heading}
                size={25}
              />
            </View>

            <ThemedText
              variant="heading"
              style={{
                color: colors.heading,
                fontSize: 28,
                lineHeight: 30,
              }}
            >
              Linked Devices
            </ThemedText>
          </View>

          <View style={{ marginTop: 10 }}>
            <View style={{ flexDirection: "row", gap: 10, marginBottom: 20 }}>
              <View
                style={{
                  backgroundColor: "#fff",
                  padding: 20,
                  borderRadius: 10,
                  width: "50%",
                }}
              >
                <Image
                  style={{ width: 100, height: 100 }}
                  source={require("../../../assets/ld-smart-watch.png")}
                />
                <ThemedText
                  variant="heading"
                  style={{
                    color: colors.heading,
                    fontSize: 22,
                    lineHeight: 30,
                    marginTop: 10,
                  }}
                >
                  Smart Watch
                </ThemedText>
                <ThemedText
                  variant="body"
                  style={{
                    color: colors.mutedText,
                    fontSize: 15,
                    lineHeight: 20,
                    marginTop: 10,
                  }}
                >
                  80% ~ inactive
                </ThemedText>
                <Pressable
                  style={{
                    marginTop: 10,
                    borderColor: colors.accent,
                    borderWidth: 1,
                    padding: 10,
                    borderRadius: 50,
                    alignItems: "center",
                  }}
                >
                  <ThemedText>Connect</ThemedText>
                </Pressable>
              </View>
              <View
                style={{
                  backgroundColor: "#fff",
                  padding: 20,
                  borderRadius: 10,
                  width: "50%",
                }}
              >
                <Image
                  style={{ width: 100, height: 100 }}
                  source={require("../../../assets/ld-smart-patch.png")}
                />
                <ThemedText
                  variant="heading"
                  style={{
                    color: colors.heading,
                    fontSize: 22,
                    lineHeight: 30,
                    marginTop: 10,
                  }}
                >
                  Smart Patch
                </ThemedText>
                <ThemedText
                  variant="body"
                  style={{
                    color: colors.mutedText,
                    fontSize: 15,
                    lineHeight: 20,
                    marginTop: 10,
                  }}
                >
                  80% ~ active
                </ThemedText>
                <Pressable
                  style={{
                    marginTop: 10,
                    borderColor: colors.highlight,
                    borderWidth: 1,
                    backgroundColor: colors.highlight,
                    padding: 10,
                    borderRadius: 50,
                    alignItems: "center",
                  }}
                >
                  <ThemedText style={{ color: "#fff" }}>Disconnect</ThemedText>
                </Pressable>
              </View>
            </View>
            <View style={{ flexDirection: "row", gap: 10, marginBottom: 20 }}>
              <View
                style={{
                  backgroundColor: "#fff",
                  padding: 20,
                  borderRadius: 10,
                  width: "50%",
                }}
              >
                <Image
                  style={{ width: 100, height: 100 }}
                  source={require("../../../assets/ld-mini-ecg.png")}
                />
                <ThemedText
                  variant="heading"
                  style={{
                    color: colors.heading,
                    fontSize: 22,
                    lineHeight: 30,
                    marginTop: 10,
                  }}
                >
                  Mini ECG
                </ThemedText>
                <ThemedText
                  variant="body"
                  style={{
                    color: colors.mutedText,
                    fontSize: 15,
                    lineHeight: 20,
                    marginTop: 10,
                  }}
                >
                  75% ~ active
                </ThemedText>
                <Pressable
                  style={{
                    marginTop: 10,
                    borderColor: colors.highlight,
                    backgroundColor: colors.highlight,
                    borderWidth: 1,
                    padding: 10,
                    borderRadius: 50,
                    alignItems: "center",
                  }}
                >
                  <ThemedText style={{ color: "#fff" }}>Disconnect</ThemedText>
                </Pressable>
              </View>
              <View
                style={{
                  backgroundColor: "#fff",
                  padding: 20,
                  borderRadius: 10,
                  width: "50%",
                }}
              >
                <Image
                  style={{ width: 100, height: 100 }}
                  source={require("../../../assets/ld-bp-monitor.png")}
                />
                <ThemedText
                  variant="heading"
                  style={{
                    color: colors.heading,
                    fontSize: 22,
                    lineHeight: 30,
                    marginTop: 10,
                  }}
                >
                  BP Monitor
                </ThemedText>
                <ThemedText
                  variant="body"
                  style={{
                    color: colors.mutedText,
                    fontSize: 15,
                    lineHeight: 20,
                    marginTop: 10,
                  }}
                >
                  33% ~ inactive
                </ThemedText>
                <Pressable
                  style={{
                    marginTop: 10,
                    borderColor: colors.accent,
                    borderWidth: 1,
                    padding: 10,
                    borderRadius: 50,
                    alignItems: "center",
                  }}
                >
                  <ThemedText>Connect</ThemedText>
                </Pressable>
              </View>
            </View>
          </View>

          <Pressable
            style={{
              marginTop: 20,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: colors.brown,
              padding: 10,
              borderRadius: 50,
              height: 60,
            }}
          >
            <ThemedText
              style={{ color: "#fff", fontSize: 18 }}
              variant="heading"
            >
              Save Settings
            </ThemedText>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </Animated.View>
  );
}
