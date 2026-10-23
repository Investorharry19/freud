import { useEffect, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import Animated, {
  FadeInDown,
  interpolateColor,
  SlideInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  ZoomIn,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import Svg, { Circle, ClipPath, Defs, G, Path } from "react-native-svg";
import { router } from "expo-router";
import { ThemedText } from "../../../components/generic/themed-text";
import { useAppTheme } from "../../../components/theme/theme-provider";

const COLORS = {
  green: "#9BB168",
  greenLight: "rgba(255,255,255,0.28)",
  greenDark: "#7E8F58",
  brown: "#4F3422",
  white: "#FFFFFF",
  chip: "#F7F4F1",
};

type Topic = {
  id: string;
  label: string;
  color: string; // selected fill (halo is derived from it)
  selectedText: string;
};

const TOPICS: Topic[] = [
  {
    id: "performance",
    label: "Performance",
    color: "#4DA3FF",
    selectedText: "#FFFFFF",
  },
  { id: "bug", label: "Bug", color: "#F97316", selectedText: "#FFFFFF" },
  { id: "uiux", label: "UI/UX", color: "#D9D9D9", selectedText: "#101113" },
  {
    id: "crashes",
    label: "Crashes",
    color: "#EF4444",
    selectedText: "#FFFFFF",
  },
  {
    id: "loading",
    label: "Loading",
    color: "#14B8A6",
    selectedText: "#FFFFFF",
  },
  {
    id: "support",
    label: "Support",
    color: "#9BB168",
    selectedText: "#FFFFFF",
  },
  {
    id: "navigation",
    label: "Navigation",
    color: "#FFCE5C",
    selectedText: "#FFFFFF",
  },
  {
    id: "pricing",
    label: "Pricing & Scheme",
    color: "#EC6BB0",
    selectedText: "#FFFFFF",
  },
  { id: "other", label: "Other", color: "#3DEB93", selectedText: "#FFFFFF" },
  { id: "ai", label: "AI & ML", color: "#06B6D4", selectedText: "#FFFFFF" },
  {
    id: "slow",
    label: "Slow Response",
    color: "#8B7AE5",
    selectedText: "#FFFFFF",
  },
];

const SHEET_TOP = 290;
const AVATAR_RING = 91;
const HALO = 3;

/* ---------- Head illustration (react-native-svg) ---------- */

function HeadBadge({ size = 68 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 202 202">
      <Defs>
        <ClipPath id="clip">
          <Circle cx="101" cy="101" r="101" />
        </ClipPath>
      </Defs>
      <Circle cx="101" cy="101" r="101" fill="#E4E9D7" />
      <G clipPath="url(#clip)">
        <Path
          d="M 125 0 L 202 0 L 202 160 L 68 160 L 68 125 L 42 125 L 65 79 C 70 40 95 5 125 0 Z"
          fill={COLORS.green}
        />
        <Path
          d="M 102 160 L 202 160 L 202 202 L 102 202 Z"
          fill={COLORS.brown}
        />
        <Circle cx="101" cy="84" r="8" fill={COLORS.brown} />
      </G>
    </Svg>
  );
}

/* ---------- Floating background circle ---------- */
// Outer view owns the entering animation, inner view owns the float,
// so the two never fight over `transform`.

function FloatingCircle({
  size,
  color,
  style,
  delay = 0,
}: {
  size: number;
  color: string;
  style: object;
  delay?: number;
}) {
  const y = useSharedValue(0);

  useEffect(() => {
    y.value = withRepeat(
      withSequence(
        withTiming(10, { duration: 3200 }),
        withTiming(-10, { duration: 3200 }),
      ),
      -1,
      true,
    );
  }, [y]);

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: y.value }],
  }));

  return (
    <Animated.View
      entering={ZoomIn.delay(delay).duration(500)}
      style={[{ position: "absolute", width: size, height: size }, style]}
    >
      <Animated.View
        style={[
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color,
          },
          floatStyle,
        ]}
      />
    </Animated.View>
  );
}

/* ---------- Pressable with quick scale ---------- */

function ScalePressable({
  onPress,
  children,
  style,
  scaleTo = 0.96,
  disabled,
}: {
  onPress?: () => void;
  children: React.ReactNode;
  style?: any;
  scaleTo?: number;
  disabled?: boolean;
}) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      onPressIn={() => (scale.value = withTiming(scaleTo, { duration: 80 }))}
      onPressOut={() => (scale.value = withTiming(1, { duration: 120 }))}
    >
      <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
    </Pressable>
  );
}

/* ---------- Topic chip ---------- */

function TopicChip({
  topic,
  selected,
  index,
  onPress,
  chipColor,
  textColor,
}: {
  topic: Topic;
  selected: boolean;
  index: number;
  onPress: () => void;
  chipColor: string;
  textColor: string;
}) {
  const progress = useSharedValue(selected ? 1 : 0);
  const scale = useSharedValue(1);

  useEffect(() => {
    progress.value = withTiming(selected ? 1 : 0, { duration: 220 });
    if (selected) {
      // small, quick pulse with no overshoot
      scale.value = withSequence(
        withTiming(1.03, { duration: 90 }),
        withTiming(1, { duration: 140 }),
      );
    }
  }, [selected, progress, scale]);

  const haloStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      progress.value,
      [0, 1],
      [topic.color + "00", topic.color + "55"],
    ),
    transform: [{ scale: scale.value }],
  }));

  const fillStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [chipColor, topic.color],
    ),
  }));

  const selectedTextStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
  }));

  const baseTextStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
  }));

  return (
    <Animated.View entering={FadeInDown.delay(350 + index * 45).duration(350)}>
      <Pressable
        onPress={onPress}
        onPressIn={() => (scale.value = withTiming(0.96, { duration: 80 }))}
        onPressOut={() => (scale.value = withTiming(1, { duration: 120 }))}
      >
        <Animated.View
          style={[
            {
              borderWidth: HALO,
              borderRadius: 100,
            },
            haloStyle,
          ]}
        >
          <Animated.View
            style={[
              {
                height: 52,
                paddingHorizontal: 26,
                borderRadius: 100,
                alignItems: "center",
                justifyContent: "center",
              },
              fillStyle,
            ]}
          >
            {/* Two stacked labels crossfade, so no text color animation is needed */}
            <Animated.View style={baseTextStyle}>
              <ThemedText style={{ fontSize: 18, color: textColor }}>
                {topic.label}
              </ThemedText>
            </Animated.View>
            <Animated.View
              pointerEvents="none"
              style={[
                {
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                  alignItems: "center",
                  justifyContent: "center",
                },
                selectedTextStyle,
              ]}
            >
              <ThemedText style={{ fontSize: 18, color: topic.selectedText }}>
                {topic.label}
              </ThemedText>
            </Animated.View>
          </Animated.View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

/* ---------- Screen ---------- */

export default function SendFeedback() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useAppTheme();
  const [selected, setSelected] = useState<string[]>([]);

  const hasSelection = selected.length > 0;
  const buttonOpacity = useSharedValue(0.5);

  useEffect(() => {
    buttonOpacity.value = withTiming(hasSelection ? 1 : 0.5, { duration: 200 });
  }, [hasSelection, buttonOpacity]);

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
  }));

  const toggle = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const handleSubmit = () => {
    if (!hasSelection) return;
    const labels = TOPICS.filter((t) => selected.includes(t.id)).map(
      (t) => t.label,
    );
    console.log("Feedback areas:", labels);
    // TODO: send to your API, then navigate
    // router.back();
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDark ? colors.background : COLORS.green,
        overflow: "hidden",
      }}
    >
      {/* ---------- Decorative circles ---------- */}
      <FloatingCircle
        size={110}
        color={COLORS.greenLight}
        style={{ left: -44, top: 137 }}
        delay={100}
      />
      <FloatingCircle
        size={220}
        color={COLORS.greenLight}
        style={{ right: -93, top: 181 }}
        delay={200}
      />
      <FloatingCircle
        size={54}
        color={COLORS.greenDark}
        style={{ right: -15, top: 57 }}
        delay={300}
      />

      {/* ---------- Header ---------- */}
      <Animated.View
        entering={FadeInDown.duration(400)}
        style={{
          position: "absolute",
          top: insets.top + 12,
          left: 21,
          right: 21,
          flexDirection: "row",
          alignItems: "center",
          gap: 20,
          zIndex: 5,
        }}
      >
        <ScalePressable
          onPress={() => router.back()}
          style={{
            height: 50,
            width: 50,
            borderRadius: 25,
            borderWidth: 1,
            borderColor: isDark ? colors.border : "rgba(255,255,255,0.65)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons
            name="return-up-back-outline"
            size={22}
            color={isDark ? colors.heading : "rgba(255,255,255,0.9)"}
          />
        </ScalePressable>
        <ThemedText
          variant="heading"
          style={{
            fontSize: 28,
            color: isDark ? colors.heading : "rgba(255,255,255,0.95)",
          }}
        >
          Send Feedback
        </ThemedText>
      </Animated.View>

      {/* ---------- Sheet ---------- */}
      <Animated.View
        entering={SlideInDown.delay(150).duration(450)}
        style={{
          flex: 1,
          marginTop: SHEET_TOP,
          backgroundColor: colors.surface,
          borderTopLeftRadius: 48,
          borderTopRightRadius: 48,
        }}
      >
        {/* Avatar badge straddling the sheet edge */}
        <Animated.View
          entering={ZoomIn.delay(450).duration(350)}
          style={{
            position: "absolute",
            top: -AVATAR_RING / 2,
            alignSelf: "center",
            height: AVATAR_RING,
            width: AVATAR_RING,
            borderRadius: AVATAR_RING / 2,
            backgroundColor: colors.surface,
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2,
          }}
        >
          <HeadBadge size={68} />
        </Animated.View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: AVATAR_RING / 2 + 32,
            paddingHorizontal: 12,
            paddingBottom: 24,
          }}
        >
          <Animated.View entering={FadeInDown.delay(300).duration(450)}>
            <ThemedText
              variant="heading"
              style={{
                fontSize: 30,
                lineHeight: 44,
                color: colors.heading,
                textAlign: "center",
                paddingHorizontal: 12,
              }}
            >
              Which of the area needs improvement?
            </ThemedText>
          </Animated.View>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 2,
              marginTop: 40,
            }}
          >
            {TOPICS.map((topic, i) => (
              <TopicChip
                key={topic.id}
                topic={topic}
                index={i}
                selected={selected.includes(topic.id)}
                onPress={() => toggle(topic.id)}
                chipColor={isDark ? colors.background : COLORS.chip}
                textColor={colors.heading}
              />
            ))}
          </View>
        </ScrollView>

        {/* ---------- Submit ---------- */}
        {/* Outer view: entering animation. Inner view: animated opacity. */}
        <Animated.View
          entering={FadeInDown.delay(800).duration(450)}
          style={{ paddingHorizontal: 16, paddingBottom: insets.bottom + 16 }}
        >
          <Animated.View style={buttonStyle}>
            <ScalePressable
              onPress={handleSubmit}
              disabled={!hasSelection}
              scaleTo={0.97}
              style={{
                height: 60,
                borderRadius: 30,
                backgroundColor: colors.heading,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 14,
              }}
            >
              <ThemedText
                variant="heading"
                style={{ color: colors.surface, fontSize: 20 }}
              >
                Submit Feedback
              </ThemedText>
              <Feather
                name="arrow-right"
                size={24}
                color={colors.surface}
              />
            </ScalePressable>
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </View>
  );
}
