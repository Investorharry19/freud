import { useEffect, useState } from "react";
import {
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
              Notification Settings
            </ThemedText>
          </View>

          <View style={{ marginTop: 10 }}>
            <ThemedText style={{ fontSize: 30, color: colors.heading }}>
              General
            </ThemedText>
            <View style={{ marginTop: 20, gap: 15 }}>
              <Pressable
                onPress={() => toggleSetting("push")}
                accessibilityRole="switch"
                accessibilityState={{ checked: settings.push }}
                accessibilityLabel="Push Notification"
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 15,
                  padding: 10,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <MaterialIcons
                  name="notifications-none"
                  size={25}
                  color={colors.icon}
                  style={{ margin: 10 }}
                />
                <ThemedText style={{ fontSize: 18 }}>
                  Push Notification
                </ThemedText>
                <NotificationSwitch
                  enabled={settings.push}
                  activeColor={activeSwitchColor}
                  inactiveColor={inactiveSwitchColor}
                />
              </Pressable>

              <Pressable
                onPress={() => toggleSetting("support")}
                accessibilityRole="switch"
                accessibilityState={{ checked: settings.support }}
                accessibilityLabel="Support Notification"
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 15,
                  padding: 10,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <MaterialIcons
                  name="person-outline"
                  size={25}
                  color={colors.icon}
                  style={{ margin: 10 }}
                />
                <ThemedText style={{ fontSize: 18 }}>
                  Support Notification
                </ThemedText>
                <NotificationSwitch
                  enabled={settings.support}
                  activeColor={activeSwitchColor}
                  inactiveColor={inactiveSwitchColor}
                />
              </Pressable>

              <Pressable
                onPress={() => toggleSetting("alert")}
                accessibilityRole="switch"
                accessibilityState={{ checked: settings.alert }}
                accessibilityLabel="Alert Notification"
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 15,
                  padding: 10,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Ionicons
                  name="call-outline"
                  size={25}
                  color={colors.icon}
                  style={{ margin: 10 }}
                />
                <ThemedText style={{ fontSize: 18 }}>
                  Alert Notification
                </ThemedText>
                <NotificationSwitch
                  enabled={settings.alert}
                  activeColor={activeSwitchColor}
                  inactiveColor={inactiveSwitchColor}
                />
              </Pressable>

              <Pressable
                onPress={() => toggleSetting("sound")}
                accessibilityRole="switch"
                accessibilityState={{ checked: settings.sound }}
                accessibilityLabel="Sound"
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 15,
                  padding: 10,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <AntDesign
                  name="sound"
                  size={25}
                  color={colors.icon}
                  style={{ margin: 10 }}
                />
                <ThemedText style={{ fontSize: 18 }}>Sound</ThemedText>
                <NotificationSwitch
                  enabled={settings.sound}
                  activeColor={activeSwitchColor}
                  inactiveColor={inactiveSwitchColor}
                />
              </Pressable>

              <Pressable
                onPress={() => toggleSetting("vibration")}
                accessibilityRole="switch"
                accessibilityState={{ checked: settings.vibration }}
                accessibilityLabel="Vibration"
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 15,
                  padding: 10,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <MaterialIcons
                  name="vibration"
                  size={25}
                  color={colors.icon}
                  style={{ margin: 10 }}
                />
                <ThemedText style={{ fontSize: 18 }}>Vibration</ThemedText>
                <NotificationSwitch
                  enabled={settings.vibration}
                  activeColor={activeSwitchColor}
                  inactiveColor={inactiveSwitchColor}
                />
              </Pressable>
            </View>
          </View>

          <View style={{ marginTop: 30 }}>
            <ThemedText style={{ fontSize: 30, color: colors.heading }}>
              Misc
            </ThemedText>
            <View style={{ marginTop: 20, gap: 15 }}>
              <Pressable
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 15,
                  padding: 10,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Feather
                  name="gift"
                  size={25}
                  color={colors.icon}
                  style={{ margin: 10 }}
                />
                <ThemedText style={{ fontSize: 18 }}>Offers</ThemedText>

                <ThemedText
                  style={{ fontSize: 14, opacity: 0.6, marginLeft: "auto" }}
                >
                  50% off
                </ThemedText>

                <MaterialCommunityIcons
                  name="moon-waxing-crescent"
                  size={20}
                  color={colors.icon}
                  style={{}}
                />
              </Pressable>

              <Pressable
                onPress={() => toggleSetting("updates")}
                accessibilityRole="switch"
                accessibilityState={{ checked: settings.updates }}
                accessibilityLabel="App Updates"
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 15,
                  padding: 10,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <MaterialIcons
                  name="system-update-alt"
                  size={25}
                  color={colors.icon}
                  style={{ margin: 10 }}
                />
                <ThemedText style={{ fontSize: 18 }}>App Updates</ThemedText>
                <NotificationSwitch
                  enabled={settings.updates}
                  activeColor={activeSwitchColor}
                  inactiveColor={inactiveSwitchColor}
                />
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Animated.View>
  );
}
