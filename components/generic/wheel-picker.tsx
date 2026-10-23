import { useCallback, useMemo, useRef } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import Animated, {
  SharedValue,
  interpolate,
  interpolateColor,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import Fonts from "../../constants/fonts";
import { COLORS } from "../../constants/assessment-colors";

const ITEM_HEIGHT = 100;
const VISIBLE_ITEMS = 5; // keep odd so one item sits dead centre
const PILL_HEIGHT = 150;
const PILL_WIDTH = 270;
const HALO = 4; // halo ring thickness in px
const BASE_FONT_SIZE = 56;

type WheelPickerProps = {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
};

type WheelItemProps = {
  index: number;
  label: string;
  scrollY: SharedValue<number>;
  onPress: () => void;
};

// Each item reads the shared scroll offset and styles itself by its distance
// from the centre: biggest + white in the middle, fading out either side.
function WheelItem({ index, label, scrollY, onPress }: WheelItemProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const distance = Math.abs(scrollY.value / ITEM_HEIGHT - index);
    return {
      opacity: interpolate(distance, [0, 2.5], [1, 0.6], "clamp"),
      transform: [
        { scale: interpolate(distance, [0, 1, 2], [2, 1, 0.6], "clamp") },
      ],
    };
  });

  const colorStyle = useAnimatedStyle(() => {
    const distance = Math.abs(scrollY.value / ITEM_HEIGHT - index);
    return {
      color: interpolateColor(
        distance,
        [0, 1, 2],
        [COLORS.white, COLORS.wheelMid, COLORS.wheelFaint],
      ),
    };
  });

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="adjustable"
      accessibilityLabel={label}
      style={{
        height: ITEM_HEIGHT,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Animated.View style={animatedStyle}>
        <Animated.Text
          style={[
            {
              fontSize: BASE_FONT_SIZE,
              fontFamily: Fonts.bold ?? Fonts.regular,
              includeFontPadding: false,
            },
            colorStyle,
          ]}
        >
          {label}
        </Animated.Text>
      </Animated.View>
    </Pressable>
  );
}

export default function WheelPicker({
  min,
  max,
  value,
  onChange,
}: WheelPickerProps) {
  const scrollRef = useRef<ScrollView>(null);
  const scrollY = useSharedValue((value - min) * ITEM_HEIGHT);

  const numbers = useMemo(
    () => Array.from({ length: max - min + 1 }, (_, i) => min + i),
    [min, max],
  );

  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });

  // Settle on whichever number the wheel stopped at
  const commit = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
      const next = Math.min(max, Math.max(min, min + index));
      if (next !== value) onChange(next);
    },
    [min, max, value, onChange],
  );

  const scrollToIndex = (index: number) =>
    scrollRef.current?.scrollTo({ y: index * ITEM_HEIGHT, animated: true });

  return (
    <View
      accessibilityRole="adjustable"
      accessibilityValue={{ min, max, now: value }}
      style={{
        height: ITEM_HEIGHT * VISIBLE_ITEMS,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Fixed pill + halo behind the wheel; the numbers scroll over it */}
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          width: PILL_WIDTH + HALO * 2,
          height: PILL_HEIGHT + HALO * 2,
          borderRadius: (PILL_HEIGHT + HALO * 2) / 2,
          borderWidth: HALO,
          borderColor: COLORS.greenHalo,
        }}
      />
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          width: PILL_WIDTH,
          height: PILL_HEIGHT,
          borderRadius: PILL_HEIGHT / 2,
          backgroundColor: COLORS.green,
        }}
      />

      <Animated.ScrollView
        ref={scrollRef as any}
        onScroll={onScroll}
        scrollEventThrottle={16}
        onMomentumScrollEnd={commit}
        onScrollEndDrag={commit}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentOffset={{ x: 0, y: (value - min) * ITEM_HEIGHT }}
        contentContainerStyle={{
          paddingVertical: ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2),
        }}
        style={{ width: "100%" }}
      >
        {numbers.map((n, i) => (
          <WheelItem
            key={n}
            index={i}
            label={String(n)}
            scrollY={scrollY}
            onPress={() => scrollToIndex(i)}
          />
        ))}
      </Animated.ScrollView>
    </View>
  );
}
