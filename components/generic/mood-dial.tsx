import { View, useWindowDimensions } from "react-native";
import Svg, { Circle, G, Path } from "react-native-svg";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { FaceFeatures, MOODS } from "./mood-face";
import { COLORS } from "../../constants/assessment-colors";

const DESIGN_WIDTH = 393; // the mockup's width in pt; everything scales from this
const STEP = 30; // degrees per mood
const CENTER_INDEX = Math.floor(MOODS.length / 2);
const MAX_INDEX = MOODS.length - 1;
const MAX_ROTATION = CENTER_INDEX * STEP;
const SPRING = { damping: 18, stiffness: 160 };

// Rotating the dial clockwise by r brings the segment at -r under the pointer.
function rotationFor(index: number) {
  "worklet";
  return -(index - CENTER_INDEX) * STEP;
}

function clampIndex(index: number) {
  "worklet";
  return Math.min(MAX_INDEX, Math.max(0, index));
}

type MoodDialProps = {
  initialIndex: number;
  onChange: (index: number) => void;
};

export default function MoodDial({ initialIndex, onChange }: MoodDialProps) {
  const { width } = useWindowDimensions();

  const s = width / DESIGN_WIDTH;
  const OUTER = width;
  const INNER = width * 0.58;
  const BAND = 18 * s; // darker strip along the inner edge
  const SIZE = OUTER * 2;
  const C = OUTER; // dial centre, in svg coords
  const VISIBLE = 276 * s; // how much of the dial peeks above the bottom edge
  const FACE_R = (OUTER + INNER) / 2;

  const rotation = useSharedValue(rotationFor(initialIndex));
  const startRotation = useSharedValue(0);

  const radToDeg = 180 / Math.PI / FACE_R; // 1pt of drag along the ring -> degrees

  const pan = Gesture.Pan()
    .onBegin(() => {
      startRotation.value = rotation.value;
    })
    .onUpdate((e) => {
      const next = startRotation.value + e.translationX * radToDeg;
      rotation.value = Math.min(MAX_ROTATION, Math.max(-MAX_ROTATION, next));
    })
    .onEnd((e) => {
      // Project a little with the fling velocity, then snap to the nearest mood
      const projected = rotation.value + e.velocityX * radToDeg * 0.15;
      const target = clampIndex(Math.round(CENTER_INDEX - projected / STEP));
      rotation.value = withSpring(rotationFor(target), SPRING);
    });

  // Tell the screen whenever the mood under the pointer changes
  useAnimatedReaction(
    () => clampIndex(Math.round(CENTER_INDEX - rotation.value / STEP)),
    (index, previous) => {
      if (previous !== null && index !== previous) runOnJS(onChange)(index);
    },
  );

  const dialStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const polar = (r: number, deg: number) => {
    const rad = (deg * Math.PI) / 180;
    return [C + r * Math.sin(rad), C - r * Math.cos(rad)];
  };

  // Annular sector between two angles (0deg = straight up, clockwise positive)
  const sector = (a1: number, a2: number, rOut: number, rIn: number) => {
    const [x1, y1] = polar(rOut, a1);
    const [x2, y2] = polar(rOut, a2);
    const [x3, y3] = polar(rIn, a2);
    const [x4, y4] = polar(rIn, a1);
    return `M ${x1} ${y1} A ${rOut} ${rOut} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${rIn} ${rIn} 0 0 0 ${x4} ${y4} Z`;
  };

  const shift = (delta: number) => {
    const current = clampIndex(
      Math.round(CENTER_INDEX - rotation.value / STEP),
    );
    rotation.value = withSpring(
      rotationFor(clampIndex(current + delta)),
      SPRING,
    );
  };

  return (
    <GestureDetector gesture={pan}>
      <View
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel="Mood"
        accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
        onAccessibilityAction={(e) =>
          shift(e.nativeEvent.actionName === "increment" ? 1 : -1)
        }
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: VISIBLE,
        }}
      >
        <Animated.View
          style={[
            {
              position: "absolute",
              top: 0,
              left: (width - SIZE) / 2,
              width: SIZE,
              height: SIZE,
            },
            dialStyle,
          ]}
        >
          <Svg width={SIZE} height={SIZE}>
            {MOODS.map((mood, i) => {
              const angle = (i - CENTER_INDEX) * STEP;
              return (
                <Path
                  key={mood.id}
                  d={sector(angle - STEP / 2, angle + STEP / 2, OUTER, INNER)}
                  fill={mood.color}
                />
              );
            })}

            <Path
              d={sector(
                -MAX_ROTATION - STEP / 2,
                MAX_ROTATION + STEP / 2,
                INNER + BAND,
                INNER,
              )}
              fill="rgba(0,0,0,0.12)"
            />

            {MOODS.map((mood, i) => {
              const angle = (i - CENTER_INDEX) * STEP;
              const [x, y] = polar(FACE_R, angle);
              return (
                <G
                  key={`${mood.id}-face`}
                  transform={`translate(${x} ${y}) rotate(${angle}) scale(${s})`}
                >
                  <FaceFeatures id={mood.id} ink={mood.ink} />
                </G>
              );
            })}
          </Svg>
        </Animated.View>

        {/* Fixed pointer */}
        <View
          pointerEvents="none"
          style={{ position: "absolute", alignSelf: "center", bottom: 76 * s }}
        >
          <Svg width={40} height={62} viewBox="0 0 40 62">
            <Path
              d="M17 5 L23 5 L36 43 L4 43 Z"
              fill={COLORS.brown}
              stroke={COLORS.brown}
              strokeWidth={10}
              strokeLinejoin="round"
            />
            <Circle cx={20} cy={43} r={19} fill={COLORS.brown} />
            <Circle cx={20} cy={43} r={6.5} fill={COLORS.white} />
          </Svg>
        </View>
      </View>
    </GestureDetector>
  );
}
