import { useEffect } from "react";
import { LayoutChangeEvent, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { ThemedText } from "../generic/themed-text";
import { COLORS } from "../../constants/assessment-colors";

const TRACK_HEIGHT = 84;
const KNOB_SIZE = 67;
const HALO = 4; // halo ring thickness in px
const SPRING = { damping: 18, stiffness: 180 };

type RatingScaleProps = {
  count: number;
  value: number; // 1-based
  onChange: (value: number) => void;
  color?: string;
  haloColor?: string;
};

export default function RatingScale({
  count,
  value,
  onChange,
  color = COLORS.orange,
  haloColor = COLORS.orangeHalo,
}: RatingScaleProps) {
  const trackWidth = useSharedValue(0);
  const position = useSharedValue(value - 1); // fractional index, drives the knob
  const lastIndex = useSharedValue(value - 1);

  // Keep the knob in sync if the value is changed from outside
  useEffect(() => {
    lastIndex.value = value - 1;
    position.value = withSpring(value - 1, SPRING);
  }, [value, position, lastIndex]);

  const onLayout = (e: LayoutChangeEvent) => {
    trackWidth.value = e.nativeEvent.layout.width;
  };

  // Tap and drag are the same gesture: wherever the finger is, the nearest slot wins
  const selectAt = (x: number) => {
    "worklet";
    const step = (trackWidth.value - TRACK_HEIGHT) / (count - 1);
    if (step <= 0) return;
    const raw = Math.round((x - TRACK_HEIGHT / 2) / step);
    const index = Math.min(count - 1, Math.max(0, raw));
    position.value = withSpring(index, SPRING);
    if (index !== lastIndex.value) {
      lastIndex.value = index;
      runOnJS(onChange)(index + 1);
    }
  };

  const gesture = Gesture.Pan()
    .minDistance(0)
    .onBegin((e) => selectAt(e.x))
    .onUpdate((e) => selectAt(e.x));

  const knobStyle = useAnimatedStyle(() => {
    const step = (trackWidth.value - TRACK_HEIGHT) / (count - 1);
    return {
      transform: [
        {
          translateX:
            position.value * step + (TRACK_HEIGHT - (KNOB_SIZE + HALO * 2)) / 2,
        },
      ],
    };
  });

  return (
    <GestureDetector gesture={gesture}>
      <View
        onLayout={onLayout}
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel="Rating"
        accessibilityValue={{ min: 1, max: count, now: value }}
        accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
        onAccessibilityAction={(e) => {
          const next =
            value + (e.nativeEvent.actionName === "increment" ? 1 : -1);
          onChange(Math.min(count, Math.max(1, next)));
        }}
        style={{
          height: TRACK_HEIGHT,
          borderRadius: TRACK_HEIGHT / 2,
          backgroundColor: COLORS.white,
          justifyContent: "center",
        }}
      >
        {/* Sliding knob with its halo ring */}
        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: "absolute",
              left: 0,
              width: KNOB_SIZE + HALO * 2,
              height: KNOB_SIZE + HALO * 2,
              borderRadius: (KNOB_SIZE + HALO * 2) / 2,
              borderWidth: HALO,
              borderColor: haloColor,
              backgroundColor: color,
            },
            knobStyle,
          ]}
        />

        {/* Numbers sit on top; each slot is centred on its knob position */}
        <View
          pointerEvents="none"
          style={{
            flexDirection: "row",
            paddingHorizontal: (TRACK_HEIGHT - KNOB_SIZE) / 2,
          }}
        >
          {Array.from({ length: count }, (_, i) => (
            <View
              key={i}
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ThemedText
                style={{
                  fontSize: 30,
                  color: value === i + 1 ? COLORS.white : COLORS.brown,
                }}
                variant="heading"
              >
                {i + 1}
              </ThemedText>
            </View>
          ))}
        </View>
      </View>
    </GestureDetector>
  );
}
