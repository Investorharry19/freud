import { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/build/Feather";
import LottieView from "lottie-react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeOut,
  interpolateColor,
  steps,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { ThemedText } from "../../components/generic/themed-text";
import { router } from "expo-router";

// ---- Theme ----------------------------------------------------------------

const BROWN = "#4E3322";
const MUTED = "#6F6A66";
const TRACK = "#E8DDD9";
const PROGRESS = "#96614A";

// ---- Content --------------------------------------------------------------

type Part = { text: string; accent?: boolean };

const INTRO = {
  bg: "#F8F4F1",
  accent: "#96614A",
  animation: require("../../assets/lottie/intro.json"),
  title: [
    { text: "Welcome to the ultimate " },
    { text: "freud", accent: true },
    { text: " UI Kit!" },
  ] as Part[],
  subtitle: "Your mindful mental health AI companion for everyone, anywhere 🌿",
};

const STEPS = [
  {
    label: "Step One",
    bg: "#E4EAD6",
    accent: "#9BB168",
    animation: require("../../assets/lottie/step-one.json"),
    title: [
      { text: "Personalize Your Mental " },
      { text: "Health State", accent: true },
      { text: " With AI" },
    ] as Part[],
  },
  {
    label: "Step Two",
    bg: "#FDC59B",
    accent: "#EB7D1B",
    animation: require("../../assets/lottie/step-two.json"),
    title: [
      { text: "Intelligent", accent: true },
      { text: " Mood Tracking & AI Emotion Insights" },
    ] as Part[],
  },
  {
    label: "Step Three",
    bg: "#FDEFD0",
    accent: "#FCBE1D",
    animation: require("../../assets/lottie/step-three.json"),
    title: [
      { text: "Mindful " },
      { text: "Resources", accent: true },
      { text: " That Makes You Happy" },
    ] as Part[],
  },
];

// index 0 = intro, 1..3 = onboarding steps
const BACKGROUNDS = [INTRO.bg, ...STEPS.map((s) => s.bg)];

// ---- Small pieces ---------------------------------------------------------

function PressableScale({
  onPress,
  style,
  children,
}: {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}) {
  const scale = useSharedValue(1);
  const animated = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => (scale.value = withSpring(0.94, { damping: 15 }))}
      onPressOut={() => (scale.value = withSpring(1, { damping: 12 }))}
    >
      <Animated.View style={[style, animated]}>{children}</Animated.View>
    </Pressable>
  );
}

function RichTitle({
  parts,
  accent,
  style,
}: {
  parts: Part[];
  accent: string;
  style?: object;
}) {
  return (
    <ThemedText
      variant="heading"
      style={[{ color: BROWN, textAlign: "center" }, style]}
    >
      {parts.map((p, i) => (
        <ThemedText
          key={i}
          variant="heading"
          style={[{ color: p.accent ? accent : BROWN }, style]}
        >
          {p.text}
        </ThemedText>
      ))}
    </ThemedText>
  );
}

function Logo() {
  const dot = {
    position: "absolute" as const,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
  };
  return (
    <View
      style={{
        width: 76,
        height: 76,
        borderRadius: 38,
        backgroundColor: BROWN,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View style={{ width: 38, height: 38 }}>
        <View style={[dot, { top: 0, left: 9 }]} />
        <View style={[dot, { top: 9, left: 0 }]} />
        <View style={[dot, { top: 9, right: 0 }]} />
        <View style={[dot, { bottom: 0, left: 9 }]} />
      </View>
    </View>
  );
}

// ---- Screen ---------------------------------------------------------------

type WelcomeProps = {
  onSignIn?: () => void;
  onFinish?: () => void;
};

export default function Welcome({ onSignIn, onFinish }: WelcomeProps) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  // 0 = intro, 1..3 = onboarding steps
  const [step, setStep] = useState(0);

  const bgIndex = useSharedValue(0);
  const progress = useSharedValue(0);

  useEffect(() => {
    bgIndex.value = withTiming(step, { duration: 550 });
    progress.value = withTiming(step / STEPS.length, {
      duration: 600,
      easing: Easing.out(Easing.cubic),
    });
  }, [step, bgIndex, progress]);

  const backgroundStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      bgIndex.value,
      BACKGROUNDS.map((_, i) => i),
      BACKGROUNDS,
    ),
  }));

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  const next = () => {
    if (step < STEPS.length) setStep(step + 1);
    else onFinish?.();
  };

  const current = step > 0 ? STEPS[step - 1] : null;

  // curved white sheet geometry
  const sheetHeight = Math.max(height * 0.4, 330);
  const arcDepth = width * 0.12;
  const illustrationHeight = height - sheetHeight + arcDepth + 8;

  return (
    <Animated.View style={[{ flex: 1 }, backgroundStyle]}>
      {step === 0 ? (
        // ---------------- Intro ----------------
        <Animated.View
          key="intro"
          entering={FadeIn.duration(400)}
          exiting={FadeOut.duration(250)}
          style={[
            StyleSheet.absoluteFill,
            {
              alignItems: "center",
              paddingTop: insets.top + 36,
              paddingBottom: insets.bottom + 24,
              paddingHorizontal: 24,
            },
          ]}
        >
          <Animated.View entering={FadeInDown.duration(500)}>
            <Logo />
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(500).delay(100)}>
            <RichTitle
              parts={INTRO.title}
              accent={INTRO.accent}
              style={{ fontSize: 34, lineHeight: 44, marginTop: 28 }}
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(500).delay(200)}>
            <ThemedText
              style={{
                color: MUTED,
                textAlign: "center",
                fontSize: 17,
                lineHeight: 28,
                marginTop: 16,
              }}
            >
              {INTRO.subtitle}
            </ThemedText>
          </Animated.View>

          <Animated.View
            entering={FadeIn.duration(700).delay(250)}
            style={{ flex: 1, width: "90%", marginVertical: 16 }}
          >
            <LottieView
              source={INTRO.animation}
              autoPlay
              loop
              resizeMode="cover"
              style={{
                width: "90%",
                height: "90%",
                transform: [{ scale: 0.9 }, { translateY: 80 }],
              }}
            />
          </Animated.View>

          <PressableScale
            onPress={next}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 14,
              backgroundColor: BROWN,
              paddingHorizontal: 44,
              height: 60,
              borderRadius: 30,
            }}
          >
            <ThemedText
              variant="heading"
              style={{ color: "#fff", fontSize: 20 }}
            >
              Get Started
            </ThemedText>
            <Feather name="arrow-right" size={24} color="#fff" />
          </PressableScale>

          <Pressable
            onPress={() =>
              onSignIn ? onSignIn() : router.replace("/auth/sign-in")
            }
            style={{ marginTop: 22 }}
          >
            <ThemedText style={{ color: MUTED, fontSize: 15 }}>
              Already have an account?{" "}
              <ThemedText
                style={{
                  color: "#EB7D1B",
                  textDecorationLine: "underline",
                  fontSize: 15,
                }}
              >
                Sign In.
              </ThemedText>
            </ThemedText>
          </Pressable>
        </Animated.View>
      ) : (
        // ---------------- Steps 1 to 3 ----------------
        <Animated.View
          key="steps"
          entering={FadeIn.duration(400)}
          exiting={FadeOut.duration(250)}
          style={StyleSheet.absoluteFill}
        >
          {/* illustration, crossfades between steps */}
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: illustrationHeight,
            }}
          >
            <Animated.View
              key={`art-${step}`}
              entering={FadeIn.duration(500)}
              exiting={FadeOut.duration(300)}
              style={StyleSheet.absoluteFill}
            >
              <LottieView
                source={current!.animation}
                autoPlay
                loop
                resizeMode="cover"
                style={{ width: "100%", height: "100%" }}
              />
            </Animated.View>
          </View>

          {/* "Step One" pill */}
          <View
            style={{
              position: "absolute",
              top: insets.top,
              left: 0,
              right: 0,
              alignItems: "center",
            }}
          >
            <Animated.View
              key={`pill-${step}`}
              entering={FadeInDown.duration(400)}
              style={{
                borderWidth: 1.5,
                borderColor: BROWN,
                borderRadius: 30,
                paddingHorizontal: 32,
                paddingVertical: 12,
              }}
            >
              <ThemedText
                variant="heading"
                style={{ color: BROWN, fontSize: 18 }}
              >
                {current!.label}
              </ThemedText>
            </Animated.View>
          </View>

          {/* curved white sheet */}
          <View
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: sheetHeight,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                position: "absolute",
                top: 0,
                left: -width * 0.6,
                width: width * 2.2,
                height: width * 2.2,
                borderRadius: width * 1.1,
                backgroundColor: "#fff",
              }}
            />

            <View
              style={{
                ...StyleSheet.absoluteFill,
                alignItems: "center",
                justifyContent: "space-between",
                paddingTop: arcDepth + 28,
                paddingBottom: insets.bottom + 28,
                paddingHorizontal: 24,
              }}
            >
              {/* progress */}
              <View
                style={{
                  width: width * 0.48,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: TRACK,
                  overflow: "hidden",
                }}
              >
                <Animated.View
                  style={[
                    {
                      height: "100%",
                      borderRadius: 5,
                      backgroundColor: PROGRESS,
                    },
                    progressStyle,
                  ]}
                />
              </View>

              {/* title */}
              <Animated.View
                key={`title-${step}`}
                entering={FadeInDown.duration(450).delay(150)}
              >
                <RichTitle
                  parts={current!.title}
                  accent={current!.accent}
                  style={{ fontSize: 30, lineHeight: 42 }}
                />
              </Animated.View>

              {/* next */}
              <PressableScale
                onPress={() => {
                  if (step === STEPS.length) {
                    router.replace("/auth/sign-in");
                  } else {
                    next();
                  }
                }}
                style={{
                  width: 84,
                  height: 84,
                  borderRadius: 42,
                  backgroundColor: BROWN,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Feather
                  name={step === STEPS.length ? "check" : "arrow-right"}
                  size={30}
                  color="#fff"
                />
              </PressableScale>
            </View>
          </View>
        </Animated.View>
      )}
    </Animated.View>
  );
}
