import { useRef, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import { ThemedText } from "../../../components/generic/themed-text";
import Fonts from "../../../constants/fonts";
import { router } from "expo-router";

const COLORS = {
  background: "#F8F4F1",
  green: "#9BB168",
  greenHalo: "rgba(155, 177, 104, 0.28)",
  brown: "#4F3422",
  orange: "#EE7B14",
  orangeHalo: "rgba(238, 123, 20, 0.22)",
  errorBg: "#FFEFE3",
  grey: "#6F6661",
  placeholder: "#7A716C",
  border: "#C9C3BF",
  white: "#FFFFFF",
};

const INPUT_HEIGHT = 58;
const HALO = 5; // halo ring thickness in px

type SocialProvider = "facebook" | "google" | "instagram";
const SOCIALS: SocialProvider[] = ["facebook", "google", "instagram"];

type FieldName = "email" | "password";
type Values = Record<FieldName, string>;
type Errors = Partial<Record<FieldName, string>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validateField(field: FieldName, value: string) {
  switch (field) {
    case "email": {
      const v = value.trim();
      if (!v) return "Email Address is required!!!";
      if (!EMAIL_REGEX.test(v)) return "Invalid Email Address!!!";
      return undefined;
    }
    case "password":
      if (!value) return "Password is required!!!";
      if (value.length < 8) return "Use at least 8 characters!!!";
      return undefined;
  }
}

export default function SignIn() {
  const insets = useSafeAreaInsets();

  const [values, setValues] = useState<Values>({ email: "", password: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [focused, setFocused] = useState<FieldName | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const passwordRef = useRef<TextInput>(null);

  const handleChange = (field: FieldName, text: string) => {
    setValues((prev) => ({ ...prev, [field]: text }));

    // Once a field has an error, re-validate live so it clears as soon as it's fixed
    setErrors((prev) =>
      prev[field] ? { ...prev, [field]: validateField(field, text) } : prev,
    );
  };

  const handleBlur = (field: FieldName) => {
    setFocused(null);
    // Don't nag about empty fields just because the user tapped past them
    if (!values[field]) return;
    setErrors((prev) => ({
      ...prev,
      [field]: validateField(field, values[field]),
    }));
  };

  const handleSignIn = () => {
    const nextErrors: Errors = {
      email: validateField("email", values.email),
      password: validateField("password", values.password),
    };
    setErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean)) return;

    router.replace("/tabs/home");
  };

  const handleSocial = (provider: SocialProvider) => {
    // TODO: wire up social auth
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
    marginTop,
  }: {
    field: FieldName;
    label: string;
    placeholder: string;
    icon: "mail" | "lock";
    inputRef?: React.RefObject<TextInput | null>;
    secure?: boolean;
    returnKeyType: "next" | "done";
    onSubmitEditing: () => void;
    inputProps?: React.ComponentProps<typeof TextInput>;
    marginTop: number;
  }) => {
    const error = errors[field];
    const isFocused = focused === field;

    return (
      <View style={{ marginTop }}>
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
              secureTextEntry={secure ? !showPassword : false}
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
                onPress={() => setShowPassword((v) => !v)}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel={
                  showPassword ? "Hide password" : "Show password"
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
                  name={showPassword ? "eye-off" : "eye"}
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
        backgroundColor: COLORS.background,
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
            }}
          >
            <View
              style={{
                height: 350,
                width: "150%",
                backgroundColor: COLORS.green,
                borderRadius: "100%",
                position: "absolute",
                alignSelf: "center",
                top: -180,
                alignItems: "center",
                justifyContent: "flex-end",
                paddingBottom: 30,
              }}
            >
              <Image
                source={require("../../../assets/auth-screen-logo.png")}
                style={{ width: 40, height: 40 }}
              />
            </View>
          </View>

          <ThemedText
            style={{
              fontSize: 34,
              color: COLORS.brown,
              textAlign: "center",
              marginTop: 20,
              lineHeight: 40,
            }}
            variant="heading"
          >
            Sign In To freud.ai
          </ThemedText>
          <ThemedText style={{ textAlign: "center", color: COLORS.grey }}>
            Demo only: credentials are not sent to an authentication service.
          </ThemedText>

          {renderField({
            field: "email",
            label: "Email Address",
            placeholder: "Enter your email...",
            icon: "mail",
            returnKeyType: "next",
            onSubmitEditing: () => passwordRef.current?.focus(),
            marginTop: 56,
            inputProps: {
              keyboardType: "email-address",
              autoComplete: "email",
              textContentType: "emailAddress",
            },
          })}

          {renderField({
            field: "password",
            label: "Password",
            placeholder: "Enter your password...",
            icon: "lock",
            inputRef: passwordRef,
            secure: true,
            returnKeyType: "done",
            onSubmitEditing: handleSignIn,
            marginTop: 24,
            inputProps: {
              autoComplete: "password",
              textContentType: "password",
            },
          })}

          {/* Sign in button */}
          <Pressable
            onPress={handleSignIn}
            accessibilityRole="button"
            style={({ pressed }) => ({
              marginTop: 28,
              height: INPUT_HEIGHT,
              borderRadius: INPUT_HEIGHT / 2,
              backgroundColor: COLORS.brown,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              opacity: pressed ? 0.9 : 1,
            })}
          >
            <ThemedText
              style={{ fontSize: 20, color: COLORS.white }}
              variant="heading"
            >
              Sign In
            </ThemedText>
            <Feather name="arrow-right" size={24} color={COLORS.white} />
          </Pressable>

          {/* Social sign in */}
          <View
            style={{
              marginTop: 48,
              flexDirection: "row",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {SOCIALS.map((provider) => (
              <Pressable
                key={provider}
                onPress={() => handleSocial(provider)}
                accessibilityRole="button"
                accessibilityLabel={`Continue with ${provider}`}
                style={({ pressed }) => ({
                  width: 58,
                  height: 58,
                  borderRadius: 29,
                  borderWidth: 1,
                  borderColor: COLORS.border,
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <FontAwesome name={provider} size={26} color={COLORS.brown} />
              </Pressable>
            ))}
          </View>

          {/* Footer links */}
          <View style={{ marginTop: 56, alignItems: "center", gap: 14 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <ThemedText
                style={{ fontSize: 17, color: COLORS.grey }}
                variant="heading"
              >
                Don't have an account?{" "}
              </ThemedText>
              <Pressable
                hitSlop={8}
                onPress={() => {
                  router.push("/auth/sign-up");
                }}
              >
                <ThemedText
                  style={{
                    fontSize: 17,
                    color: COLORS.orange,
                    textDecorationLine: "underline",
                  }}
                  variant="heading"
                >
                  Sign Up.
                </ThemedText>
              </Pressable>
            </View>

            <Pressable
              hitSlop={8}
              onPress={() => {
                router.push("/auth/forgot-password");
              }}
            >
              <ThemedText
                style={{
                  fontSize: 17,
                  color: COLORS.orange,
                  textDecorationLine: "underline",
                }}
                variant="heading"
              >
                Forgot Password
              </ThemedText>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Animated.View>
  );
}
