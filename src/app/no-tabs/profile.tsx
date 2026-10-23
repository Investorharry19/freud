import { useEffect, useRef, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { ThemedText } from "../../../components/generic/themed-text";
import { useAppTheme } from "../../../components/theme/theme-provider";
import Fonts from "../../../constants/fonts";
import { router } from "expo-router";

const COLORS = {
  green: "#9BB168",
  greenHalo: "rgba(155, 177, 104, 0.28)",
  brown: "#4F3422",
  orange: "#EE7B14",
  orangeHalo: "rgba(238, 123, 20, 0.22)",
  errorBg: "#FFEFE3",
  grey: "#6F6661",
  placeholder: "#7A716C",
  white: "#FFFFFF",
};

const INPUT_HEIGHT = 58;
const HALO = 5; // halo ring thickness in px

type FieldName = "email" | "password" | "confirm";
type Values = Record<FieldName, string>;
type Errors = Partial<Record<FieldName, string>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validateField(field: FieldName, value: string, all: Values) {
  const v = value.trim();

  switch (field) {
    case "email":
      if (!v) return "Email Address is required!!!";
      if (!EMAIL_REGEX.test(v)) return "Invalid Email Address!!!";
      return undefined;

    case "password":
      if (!value) return "Password is required!!!";
      if (value.length < 8) return "Use at least 8 characters!!!";
      return undefined;

    case "confirm":
      if (!value) return "Please confirm your password!!!";
      if (value !== all.password) return "Passwords do not match!!!";
      return undefined;
  }
}

export default function Profile() {
  const insets = useSafeAreaInsets();
  const { isDark, toggleTheme, colors } = useAppTheme();
  const toggleProgress = useSharedValue(isDark ? 1 : 0);
  const toggleThumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: toggleProgress.value * 25 }],
  }));

  useEffect(() => {
    toggleProgress.value = withTiming(isDark ? 1 : 0, { duration: 220 });
  }, [isDark, toggleProgress]);

  const [values, setValues] = useState<Values>({
    email: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [focused, setFocused] = useState<FieldName | null>(null);
  const [visible, setVisible] = useState({ password: false, confirm: false });

  const handleChange = (field: FieldName, text: string) => {
    const next = { ...values, [field]: text };
    setValues(next);

    // Once a field has an error, re-validate live so it clears as soon as it's fixed
    setErrors((prev) => {
      const updated = { ...prev };
      if (prev[field]) updated[field] = validateField(field, text, next);
      if (field === "password" && prev.confirm) {
        updated.confirm = validateField("confirm", next.confirm, next);
      }
      return updated;
    });
  };

  const handleBlur = (field: FieldName) => {
    setFocused(null);
    // Don't nag about empty fields just because the user tapped past them
    if (!values[field]) return;
    setErrors((prev) => ({
      ...prev,
      [field]: validateField(field, values[field], values),
    }));
  };

  // Absolutely-positioned ring just outside the input pill.
  // Never affects layout; rendered as a border so it's a true ring.
  const haloStyle = (color: string) => ({
    position: "absolute" as const,
    top: -HALO,
    left: -HALO,
    right: -HALO,
    bottom: -HALO,
    borderRadius: (INPUT_HEIGHT + HALO * 2) / 2,
    borderWidth: HALO,
    borderColor: color,
  });

  // Plain render helper (called as a function, not used as a component),
  // so the TextInputs never remount while typing.
  const renderField = ({
    field,
    label,
    placeholder,
    icon,
    inputRef,
    secure,
    returnKeyType,
    onSubmitEditing,
    inputProps,
  }: {
    field: FieldName;
    label: string;
    placeholder: string;
    icon: "mail" | "lock";
    inputRef?: React.RefObject<TextInput | null>;
    secure?: "password" | "confirm";
    returnKeyType: "next" | "done";
    onSubmitEditing: () => void;
    inputProps?: React.ComponentProps<typeof TextInput>;
  }) => {
    const error = errors[field];
    const isFocused = focused === field;
    const showText = secure ? visible[secure] : false;

    return (
      <View style={{ marginTop: 24 }}>
        <ThemedText
          style={{ fontSize: 16, color: COLORS.brown, marginBottom: 8 }}
          variant="heading"
        >
          {label}
        </ThemedText>

        <View style={{ height: INPUT_HEIGHT }}>
          {isFocused && (
            <View
              pointerEvents="none"
              style={haloStyle(error ? COLORS.orangeHalo : COLORS.greenHalo)}
            />
          )}

          <View
            style={{
              flex: 1,
              borderRadius: INPUT_HEIGHT / 2,
              backgroundColor: COLORS.white,
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 18,
              borderWidth: 1,
              borderColor: error
                ? COLORS.orange
                : isFocused
                  ? COLORS.green
                  : "transparent",
            }}
          >
            <Feather name={icon} size={22} color={COLORS.brown} />
            <TextInput
              ref={inputRef}
              value={values[field]}
              onChangeText={(t) => handleChange(field, t)}
              onFocus={() => setFocused(field)}
              onBlur={() => handleBlur(field)}
              placeholder={placeholder}
              placeholderTextColor={COLORS.placeholder}
              selectionColor={error ? COLORS.orange : COLORS.green}
              secureTextEntry={secure ? !showText : false}
              returnKeyType={returnKeyType}
              onSubmitEditing={onSubmitEditing}
              autoCapitalize="none"
              autoCorrect={false}
              style={{
                flex: 1,
                marginLeft: 14,
                fontSize: 18,
                color: COLORS.grey,
                fontFamily: Platform.OS === "ios" ? "System" : Fonts.regular,
              }}
              {...inputProps}
            />
            {secure && (
              <Pressable
                onPress={() =>
                  setVisible((v) => ({ ...v, [secure]: !v[secure] }))
                }
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel={
                  showText ? "Hide password" : "Show password"
                }
                style={{
                  width: 36,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: "#C8C6C5",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Feather
                  name={showText ? "eye-off" : "eye"}
                  size={14}
                  color={COLORS.white}
                />
              </Pressable>
            )}
          </View>
        </View>

        {error ? (
          <View
            accessibilityRole="alert"
            style={{
              marginTop: 12,
              minHeight: 46,
              borderRadius: 23,
              borderWidth: 1,
              borderColor: COLORS.orange,
              backgroundColor: COLORS.errorBg,
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 16,
              paddingVertical: 8,
              gap: 10,
            }}
          >
            <Ionicons name="warning" size={22} color={COLORS.orange} />
            <ThemedText
              style={{ flex: 1, fontSize: 16, color: COLORS.brown }}
              variant="heading"
            >
              {error}
            </ThemedText>
          </View>
        ) : null}
      </View>
    );
  };

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
              height: 200,
              marginHorizontal: -16,
              position: "relative",
              marginBottom: 50,
            }}
          >
            <View
              style={{
                position: "absolute",
                top: 45,
                left: 20,
                zIndex: 3,
                borderRadius: 30,
                paddingVertical: 8,
                paddingHorizontal: 15,
                borderWidth: 1,
                borderColor: COLORS.white,
              }}
            >
              <Ionicons
                name="return-up-back-outline"
                color={"white"}
                size={25}
              />
            </View>
            <View
              style={{
                height: 420,
                width: "110%",
                backgroundColor: COLORS.brown,
                borderRadius: "15%",
                position: "absolute",
                alignSelf: "center",
                top: -180,
                alignItems: "center",
                justifyContent: "flex-end",
                paddingBottom: 30,
              }}
            ></View>
            <ThemedText
              variant="heading"
              style={{
                position: "absolute",
                bottom: 10,
                color: "white",
                fontSize: 35,
                left: 20,
              }}
            >
              Account Settings
            </ThemedText>
          </View>
          <View style={{ marginTop: 10 }}>
            <ThemedText variant="heading" style={{ fontSize: 30 }}>
              General
            </ThemedText>
            <View style={{ marginTop: 20, gap: 15 }}>
              <Pressable
                onPress={() => router.push("/no-tabs/settings-notification")}
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
                <ThemedText variant="heading" style={{ fontSize: 18 }}>
                  Notification
                </ThemedText>
                <MaterialCommunityIcons
                  name="moon-waxing-crescent"
                  size={20}
                  color={colors.icon}
                  style={{ marginLeft: "auto" }}
                />
              </Pressable>
              <Pressable
                onPress={() =>
                  router.push("/no-tabs/settings-personal-information")
                }
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
                <ThemedText variant="heading" style={{ fontSize: 18 }}>
                  Personal Information
                </ThemedText>
                <MaterialCommunityIcons
                  name="moon-waxing-crescent"
                  size={20}
                  color={colors.icon}
                  style={{ marginLeft: "auto" }}
                />
              </Pressable>
              <Pressable
                onPress={() => {
                  (router.push("/no-tabs/settings-feedback"),
                    console.log("feedback route"));
                }}
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
                <ThemedText variant="heading" style={{ fontSize: 18 }}>
                  Submit Feedback
                </ThemedText>
                <MaterialCommunityIcons
                  name="moon-waxing-crescent"
                  size={20}
                  color={colors.icon}
                  style={{ marginLeft: "auto" }}
                />
              </Pressable>

              <Pressable
                onPress={toggleTheme}
                accessibilityRole="switch"
                accessibilityState={{ checked: isDark }}
                accessibilityLabel="Dark mode"
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 15,
                  padding: 10,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Feather
                  name={isDark ? "moon" : "sun"}
                  size={25}
                  color={colors.icon}
                  style={{ margin: 10 }}
                />
                <ThemedText variant="heading" style={{ fontSize: 18 }}>
                  Dark Mode
                </ThemedText>
                <View
                  style={{
                    height: 38,
                    width: 65,
                    backgroundColor: isDark ? colors.highlight : "#C8C6C5",
                    marginLeft: "auto",
                    borderRadius: 10,
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    overflow: "hidden",
                  }}
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
                      toggleThumbStyle,
                    ]}
                  />
                </View>
              </Pressable>

              <Pressable
                onPress={() => {
                  (router.push("/no-tabs/settings-linked-devices"),
                    console.log("linked devices route"));
                }}
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 15,
                  padding: 10,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Feather
                  name="watch"
                  size={25}
                  color={colors.icon}
                  style={{ margin: 10 }}
                />
                <ThemedText variant="heading" style={{ fontSize: 18 }}>
                  Linked Devices
                </ThemedText>
                <MaterialCommunityIcons
                  name="moon-waxing-crescent"
                  size={20}
                  color={colors.icon}
                  style={{ marginLeft: "auto" }}
                />
              </Pressable>
            </View>
          </View>

          <View style={{ marginTop: 30 }}>
            <ThemedText variant="heading" style={{ fontSize: 30 }}>
              Account & Privacy
            </ThemedText>
            <View style={{ marginTop: 20, gap: 15 }}>
              <Pressable
                onPress={() => router.push("/security")}
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 15,
                  padding: 10,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Feather
                  name="lock"
                  size={25}
                  color={colors.icon}
                  style={{ margin: 10 }}
                />
                <ThemedText variant="heading" style={{ fontSize: 18 }}>
                  Main Security
                </ThemedText>
                <MaterialCommunityIcons
                  name="moon-waxing-crescent"
                  size={20}
                  color={colors.text}
                  style={{ marginLeft: "auto" }}
                />
              </Pressable>

              <Pressable
                onPress={() => router.push("/security")}
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 15,
                  padding: 10,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <MaterialCommunityIcons
                  name="security"
                  size={25}
                  color={colors.icon}
                  style={{ margin: 10 }}
                />
                <ThemedText variant="heading" style={{ fontSize: 18 }}>
                  2 FA
                </ThemedText>
                <MaterialCommunityIcons
                  name="moon-waxing-crescent"
                  size={20}
                  color={colors.text}
                  style={{ marginLeft: "auto" }}
                />
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Animated.View>
  );
}
