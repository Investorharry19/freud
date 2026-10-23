import { useRef, useState } from "react";
import {
  Image,
  ImageSourcePropType,
  PanResponder,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ThemedText } from "../../../components/generic/themed-text";

const COLORS = {
  background: "#F8F4F1",
  brown: "#4F3422",
  orange: "#EE7B14",
  orangeDark: "#C96100",
  orangeRing: "#F9D5C4",
  pillBg: "#E9DCD6",
  pillText: "#8A5A44",
  trackBg: "#E9DDDA",
  labelMuted: "#ABA6A2",
  hoursMuted: "#C7C3C0",
  white: "#FFFFFF",
};

// Slider geometry
const ROW_HEIGHT = 100;
const FACE = 50;
const TRACK_WIDTH = 17;
const TRACK_INSET_TOP = 36; // track extends this far above the first row's centre
const TRACK_INSET_BOTTOM = 26; // ...and below the last row's centre
const THUMB = 66;
const HALO = 4; // ring thickness around the thumb

const CURRENT_STEP = 8;
const TOTAL_STEPS = 10;

type Rating = "excellent" | "good" | "fair" | "poor" | "worst";

const OPTIONS: {
  value: Rating;
  label: string;
  hours: string;
  face: ImageSourcePropType;
}[] = [
  {
    value: "excellent",
    label: "Excellent",
    hours: "7-9 hours",
    face: require("../../../assets/sleep-excellent.png"),
  },
  {
    value: "good",
    label: "Good",
    hours: "6-7 hours",
    face: require("../../../assets/sleep-good.png"),
  },
  {
    value: "fair",
    label: "Fair",
    hours: "5 hours",
    face: require("../../../assets/sleep-fair.png"),
  },
  {
    value: "poor",
    label: "Poor",
    hours: "3-4 hours",
    face: require("../../../assets/sleep-poor.png"),
  },
  {
    value: "worst",
    label: "Worst",
    hours: "<3 hours",
    face: require("../../../assets/sleep-worst.png"),
  },
];

const LAST = OPTIONS.length - 1;
const SLIDER_HEIGHT = ROW_HEIGHT * OPTIONS.length;

const centerOf = (i: number) => i * ROW_HEIGHT + ROW_HEIGHT / 2;
const TRACK_TOP = centerOf(0) - TRACK_INSET_TOP;
const TRACK_BOTTOM = centerOf(LAST) + TRACK_INSET_BOTTOM;

const clampY = (y: number) =>
  Math.min(Math.max(y, centerOf(0)), centerOf(LAST));

const indexFromY = (y: number) =>
  Math.min(Math.max(Math.round((y - ROW_HEIGHT / 2) / ROW_HEIGHT), 0), LAST);

export default function AssessmentSleepQuality() {
  const insets = useSafeAreaInsets();

  const [index, setIndex] = useState(3); // "Poor" to match the mockup
  const [dragY, setDragY] = useState<number | null>(null);
  const startY = useRef(0);

  // While dragging the thumb follows the finger; on release it snaps to a row.
  const thumbY = dragY ?? centerOf(index);
  const activeIndex = dragY === null ? index : indexFromY(dragY);

  // The responder sits on a transparent overlay above the slider, so
  // locationY is always relative to the slider, wherever the finger lands.
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false, // keep the page ScrollView from stealing the drag
      onPanResponderGrant: (e) => {
        startY.current = e.nativeEvent.locationY;
        setDragY(clampY(startY.current));
      },
      onPanResponderMove: (_, g) => {
        setDragY(clampY(startY.current + g.dy));
      },
      onPanResponderRelease: (_, g) => {
        setIndex(indexFromY(clampY(startY.current + g.dy)));
        setDragY(null);
        // TODO: persist answer
      },
      onPanResponderTerminate: () => setDragY(null),
    }),
  ).current;

  const nudge = (delta: number) =>
    setIndex((i) => Math.min(Math.max(i + delta, 0), LAST));

  const handleContinue = () => {
    // TODO: persist the selected sleep quality
    router.push("/mha/step-9");
  };

  // Plain render helper (called as a function, not used as a component)
  const renderRow = (option: (typeof OPTIONS)[number], i: number) => {
    const active = activeIndex === i;

    return (
      <View
        key={option.value}
        style={{
          height: ROW_HEIGHT,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View>
          <ThemedText
            style={{
              fontSize: 26,
              color: active ? COLORS.brown : COLORS.labelMuted,
            }}
            variant="heading"
          >
            {option.label}
          </ThemedText>
          <View
            style={{
              marginTop: 8,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Ionicons
              name="time"
              size={20}
              color={active ? COLORS.labelMuted : COLORS.hoursMuted}
            />
            <ThemedText
              style={{
                fontSize: 17,
                letterSpacing: 2,
                textTransform: "uppercase",
                color: active ? COLORS.brown : COLORS.hoursMuted,
              }}
              variant="heading"
            >
              {option.hours}
            </ThemedText>
          </View>
        </View>

        {active ? (
          <Pressable
            onPress={handleContinue}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={`Continue with ${option.label} sleep quality`}
          >
            <Image
              source={option.face}
              resizeMode="contain"
              style={{ width: FACE, height: FACE }}
            />
          </Pressable>
        ) : (
          <Image
            source={option.face}
            resizeMode="contain"
            style={{ width: FACE, height: FACE }}
          />
        )}
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
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 16,
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 24,
        }}
      >
        {/* Header */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Pressable
            onPress={() => router.back()}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            style={({ pressed }) => ({
              width: 52,
              height: 52,
              borderRadius: 26,
              borderWidth: 1.5,
              borderColor: COLORS.brown,
              alignItems: "center",
              justifyContent: "center",
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Feather name="chevron-left" size={26} color={COLORS.brown} />
          </Pressable>

          <ThemedText
            style={{
              flex: 1,
              marginLeft: 16,
              fontSize: 22,
              color: COLORS.brown,
            }}
            variant="heading"
          >
            Assessment
          </ThemedText>

          <View
            style={{
              height: 38,
              paddingHorizontal: 16,
              borderRadius: 19,
              backgroundColor: COLORS.pillBg,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ThemedText
              style={{ fontSize: 17, color: COLORS.pillText }}
              variant="heading"
            >
              {CURRENT_STEP} of {TOTAL_STEPS}
            </ThemedText>
          </View>
        </View>

        {/* Question */}
        <ThemedText
          style={{
            fontSize: 34,
            lineHeight: 42,
            color: COLORS.brown,
            textAlign: "center",
            marginTop: 56,
            paddingHorizontal: 8,
          }}
          variant="heading"
        >
          How would you rate your sleep quality?
        </ThemedText>

        <ThemedText
          style={{
            fontSize: 16,
            color: COLORS.labelMuted,
            textAlign: "center",
            marginTop: 12,
          }}
        >
          Choose with the slider, then tap the highlighted face to continue.
        </ThemedText>

        {/* Vertical slider */}
        <View
          accessible
          accessibilityRole="adjustable"
          accessibilityLabel="Sleep quality"
          accessibilityValue={{
            text: `${OPTIONS[activeIndex].label}, ${OPTIONS[activeIndex].hours}`,
          }}
          accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
          onAccessibilityAction={(e) =>
            // increment = better sleep = up the list
            nudge(e.nativeEvent.actionName === "increment" ? -1 : 1)
          }
          style={{ marginTop: 40, height: SLIDER_HEIGHT }}
        >
          {/* Track */}
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              left: "50%",
              marginLeft: -TRACK_WIDTH / 2,
              top: TRACK_TOP,
              width: TRACK_WIDTH,
              height: TRACK_BOTTOM - TRACK_TOP,
              borderRadius: TRACK_WIDTH / 2,
              backgroundColor: COLORS.trackBg,
            }}
          />

          {/* Filled part, from the thumb down to the bottom of the track */}
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              left: "50%",
              marginLeft: -TRACK_WIDTH / 2,
              top: thumbY,
              width: TRACK_WIDTH,
              height: TRACK_BOTTOM - thumbY,
              borderBottomLeftRadius: TRACK_WIDTH / 2,
              borderBottomRightRadius: TRACK_WIDTH / 2,
              backgroundColor: COLORS.orangeDark,
            }}
          />

          {/* Rows: label + hours on the left, face on the right */}
          {OPTIONS.map(renderRow)}

          {/* Thumb with halo ring */}
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              left: "50%",
              marginLeft: -(THUMB / 2 + HALO),
              top: thumbY - (THUMB / 2 + HALO),
              width: THUMB + HALO * 2,
              height: THUMB + HALO * 2,
              borderRadius: (THUMB + HALO * 2) / 2,
              borderWidth: HALO,
              borderColor: COLORS.orangeRing,
              backgroundColor: COLORS.orange,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="swap-vertical" size={24} color={COLORS.white} />
          </View>

          {/* Transparent touch layer, always on top */}
          <View
            {...panResponder.panHandlers}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: FACE + 8,
              bottom: 0,
            }}
          />
        </View>
      </ScrollView>
    </Animated.View>
  );
}
