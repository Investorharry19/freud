import { useEffect, useState } from "react";
import { Image, Modal, Pressable, ScrollView, View } from "react-native";
import Svg, {
  Circle,
  ClipPath,
  Defs,
  G,
  Polygon,
  Polyline,
  Rect,
} from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { ThemedText } from "../../../components/generic/themed-text";

const COLORS = {
  background: "#F8F4F1",
  green: "#9BB168",
  greenHalo: "rgba(155, 177, 104, 0.28)",
  greenTint: "#E5EAD6",
  brown: "#4F3422",
  grey: "#6F6661",
  white: "#FFFFFF",
  overlay: "rgba(20, 14, 8, 0.8)",
};

const CARD_HEIGHT = 120;
const BUTTON_HEIGHT = 58;
const HALO = 5; // halo ring thickness in px
const RESEND_SECONDS = 30;

// TODO: replace with the real user's details (route params, store, etc.)
const USER = {
  email: "princesskaguya@gmail.com",
  phone: "+2348012345624",
};

type Method = "email" | "sms" | "authenticator";

const maskEmail = (email: string) => {
  const [name, domain] = email.split("@");
  if (!name || !domain) return email;
  return `${name.slice(0, 2)}${"*".repeat(Math.max(name.length - 2, 3))}@${domain}`;
};
const maskPhone = (phone: string) => `****-****-***${phone.slice(-2)}`;

/* ---------- Option icons (simple geometric SVG circles) ---------- */

function EmailIcon({ size = 100 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Circle cx="50" cy="50" r="50" fill={COLORS.greenTint} />
      <Rect x="18" y="30" width="64" height="42" rx="6" fill={COLORS.green} />
      <Polyline
        points="18,34 50,58 82,34"
        fill="none"
        stroke={COLORS.brown}
        strokeWidth="7"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </Svg>
  );
}

function SmsIcon({ size = 100 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <ClipPath id="smsClip">
          <Circle cx="50" cy="50" r="50" />
        </ClipPath>
      </Defs>
      <G clipPath="url(#smsClip)">
        <Rect x="0" y="0" width="100" height="100" fill={COLORS.greenTint} />
        <Rect x="50" y="0" width="50" height="58" fill={COLORS.green} />
        <Rect x="0" y="58" width="50" height="42" fill={COLORS.brown} />
      </G>
    </Svg>
  );
}

function AuthenticatorIcon({ size = 100 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <ClipPath id="authClip">
          <Circle cx="50" cy="50" r="50" />
        </ClipPath>
      </Defs>
      <G clipPath="url(#authClip)">
        <Rect x="0" y="0" width="100" height="100" fill={COLORS.greenTint} />
        <Polygon points="50,50 8,8 92,8" fill={COLORS.green} />
        <Polygon points="50,50 18,82 82,82" fill={COLORS.green} />
        <Rect x="0" y="82" width="100" height="18" fill={COLORS.brown} />
        <Polygon
          points="50,50 18,82 0,82 0,100 100,100 100,82 82,82"
          fill="none"
        />
      </G>
    </Svg>
  );
}

const OPTIONS: {
  id: Method;
  label: string;
  Icon: (props: { size?: number }) => React.JSX.Element;
}[] = [
  { id: "email", label: "Email", Icon: EmailIcon },
  { id: "sms", label: "Text Message", Icon: SmsIcon },
  {
    id: "authenticator",
    label: "Google Authenticator",
    Icon: AuthenticatorIcon,
  },
];

/* ---------- Screen ---------- */

export default function ForgotPassword() {
  const insets = useSafeAreaInsets();

  const [selected, setSelected] = useState<Method>("email");
  const [sentTo, setSentTo] = useState<string | null>(null); // masked destination, set once sent
  const [cooldown, setCooldown] = useState(0);

  const isAuthenticator = selected === "authenticator";

  // Resend countdown
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const sendCode = (method: Method) => {
    // TODO: call your API to send the code via `method`
    setSentTo(
      method === "email" ? maskEmail(USER.email) : maskPhone(USER.phone),
    );
    setCooldown(RESEND_SECONDS);
  };

  const handleContinue = () => {
    if (isAuthenticator) {
      // Authenticator codes are generated in the app, nothing to send
      // TODO: route to your code entry screen
      router.push("/auth/verify-code");
      return;
    }
    sendCode(selected);
  };

  const handleResend = () => {
    if (cooldown > 0) return;
    sendCode(selected);
  };

  // Absolutely-positioned ring just outside the selected card (never affects layout)
  const haloStyle = {
    position: "absolute" as const,
    top: -HALO,
    left: -HALO,
    right: -HALO,
    bottom: -HALO,
    borderRadius: (CARD_HEIGHT + HALO * 2) / 2,
    borderWidth: HALO,
    borderColor: COLORS.greenHalo,
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: insets.top + 24,
          paddingHorizontal: 16,
          paddingBottom: insets.bottom + 24,
        }}
      >
        {/* Back */}
        <Pressable
          onPress={() => router.back()}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            borderWidth: 1,
            borderColor: COLORS.grey,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Feather name="chevron-left" size={26} color={COLORS.brown} />
        </Pressable>

        <ThemedText
          style={{
            fontSize: 34,
            lineHeight: 40,
            color: COLORS.brown,
            marginTop: 40,
          }}
          variant="heading"
        >
          Forgot Password
        </ThemedText>

        <ThemedText
          style={{
            fontSize: 18,
            lineHeight: 28,
            color: COLORS.grey,
            marginTop: 14,
          }}
          variant="heading"
        >
          Choose how you want to verify it&apos;s you and reset your password.
        </ThemedText>

        {/* Method options */}
        <View style={{ marginTop: 32, gap: 16 }} accessibilityRole="radiogroup">
          {OPTIONS.map(({ id, label, Icon }) => {
            const isSelected = selected === id;
            return (
              <Pressable
                key={id}
                onPress={() => setSelected(id)}
                accessibilityRole="radio"
                accessibilityState={{ selected: isSelected }}
                style={{ height: CARD_HEIGHT }}
              >
                {isSelected && <View pointerEvents="none" style={haloStyle} />}

                <View
                  style={{
                    flex: 1,
                    borderRadius: CARD_HEIGHT / 2,
                    backgroundColor: COLORS.white,
                    flexDirection: "row",
                    alignItems: "center",
                    paddingLeft: 10,
                    paddingRight: 20,
                    borderWidth: 1,
                    borderColor: isSelected ? COLORS.green : "transparent",
                    shadowColor: COLORS.brown,
                    shadowOpacity: isSelected ? 0 : 0.08,
                    shadowRadius: 14,
                    shadowOffset: { width: 0, height: 6 },
                    elevation: isSelected ? 0 : 2,
                  }}
                >
                  <Icon size={100} />
                  <ThemedText
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    style={{
                      flex: 1,
                      marginLeft: 24,
                      fontSize: 22,
                      color: COLORS.brown,
                    }}
                    variant="heading"
                  >
                    {label}
                  </ThemedText>
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Continue */}
        <Pressable
          onPress={handleContinue}
          accessibilityRole="button"
          style={({ pressed }) => ({
            marginTop: 32,
            height: BUTTON_HEIGHT,
            borderRadius: BUTTON_HEIGHT / 2,
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
            {isAuthenticator ? "Enter Code" : "Send Code"}
          </ThemedText>
          <Feather
            name={isAuthenticator ? "arrow-right" : "lock"}
            size={24}
            color={COLORS.white}
          />
        </Pressable>
      </ScrollView>

      {/* Code sent modal */}
      <Modal
        visible={sentTo !== null}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setSentTo(null)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: COLORS.overlay,
            justifyContent: "center",
            paddingHorizontal: 19,
          }}
        >
          <View
            style={{
              backgroundColor: COLORS.white,
              borderRadius: 40,
              padding: 16,
            }}
          >
            {/* TODO: export the lock illustration from your design to this path */}
            <Image
              source={require("../../../assets/forgot-password-illustration.png")}
              resizeMode="cover"
              style={{ width: "100%", height: 258, borderRadius: 28 }}
            />

            <ThemedText
              style={{
                fontSize: 28,
                lineHeight: 34,
                color: COLORS.brown,
                marginTop: 28,
              }}
              variant="heading"
            >
              Demo verification code for {sentTo}
            </ThemedText>

            <ThemedText
              style={{
                fontSize: 18,
                lineHeight: 30,
                color: COLORS.grey,
                marginTop: 14,
              }}
              variant="heading"
            >
              Demo mode: no message is sent. Continue to enter the sample code
              123456.
            </ThemedText>
            <Pressable
              onPress={() => router.push("/auth/verify-code")}
              accessibilityRole="button"
              style={{
                marginTop: 18,
                height: BUTTON_HEIGHT + 4,
                borderRadius: (BUTTON_HEIGHT + 4) / 2,
                backgroundColor: COLORS.green,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ThemedText
                style={{ fontSize: 18, color: COLORS.white }}
                variant="heading"
              >
                Enter demo code
              </ThemedText>
            </Pressable>

            <Pressable
              onPress={handleResend}
              disabled={cooldown > 0}
              accessibilityRole="button"
              accessibilityState={{ disabled: cooldown > 0 }}
              style={({ pressed }) => ({
                marginTop: 28,
                height: BUTTON_HEIGHT + 4,
                borderRadius: (BUTTON_HEIGHT + 4) / 2,
                backgroundColor: COLORS.brown,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                opacity: cooldown > 0 ? 0.55 : pressed ? 0.9 : 1,
              })}
            >
              <ThemedText
                style={{ fontSize: 20, color: COLORS.white }}
                variant="heading"
              >
                {cooldown > 0
                  ? `Reset demo code in ${cooldown}s`
                  : "Restart demo code timer"}
              </ThemedText>
              <Feather name="lock" size={24} color={COLORS.white} />
            </Pressable>
          </View>

          {/* Close */}
          <Pressable
            onPress={() => setSentTo(null)}
            accessibilityRole="button"
            accessibilityLabel="Close"
            style={{
              alignSelf: "center",
              marginTop: 16,
              width: 66,
              height: 66,
              borderRadius: 33,
              backgroundColor: COLORS.white,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Feather name="x" size={28} color={COLORS.brown} />
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}
