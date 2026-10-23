import { Pressable, View, useWindowDimensions } from "react-native";
import Svg, { Path } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "../generic/themed-text";
import { useAppTheme } from "../theme/theme-provider";

const BAR_HEIGHT = 70;
const BAR_RADIUS = 35;
const SIDE_MARGIN = 16;
const JOURNEY_SIZE = 60;
const NOTCH_GAP = 10; // space between the button and the cutout edge
const NOTCH_RADIUS = JOURNEY_SIZE / 2 + NOTCH_GAP; // cutout radius
const NOTCH_SHOULDER = 14; // roundness of the edges left/right of the cutout
const ICON_SIZE = 24;
const BOTTOM_GAP = 12;

// Space the floating bar occupies above the safe-area inset.
export const BOTTOM_TAB_BAR_HEIGHT = BAR_HEIGHT + BOTTOM_GAP;

const JOURNEY_HREF = "/tabs/journey"; // change to your actual route

const TABS = [
  {
    href: "/tabs/home",
    label: "Home",
    icon: "home-outline",
    iconActive: "home",
  },
  {
    href: "/tabs/ai-chat",
    label: "AI Chat",
    icon: "chatbubble-ellipses-outline",
    iconActive: "chatbubble-ellipses",
  },
  {
    href: "/tabs/explore",
    label: "Explore",
    icon: "map-outline",
    iconActive: "map",
  },
  {
    href: "/no-tabs/profile",
    label: "Profile",
    icon: "person-circle-outline",
    iconActive: "person-circle",
  },
] as const;

function buildBarPath(w: number, h: number) {
  const r = BAR_RADIUS;
  const cx = w / 2;
  const R = NOTCH_RADIUS;
  const s = NOTCH_SHOULDER;

  // Rounded shoulder tangent to both the flat top edge and the circular
  // cutout. The cutout's centre sits on the top edge (same as the centre
  // of the Journey button).
  const dx = Math.sqrt((R + s) ** 2 - s ** 2); // where the flat top ends
  const k = R / (R + s);
  const tx = dx * k; // where the shoulder meets the cutout
  const ty = s * k;

  return [
    `M ${r} 0`,
    `L ${cx - dx} 0`,
    `A ${s} ${s} 0 0 1 ${cx - tx} ${ty}`, // left shoulder
    `A ${R} ${R} 0 0 0 ${cx + tx} ${ty}`, // cutout
    `A ${s} ${s} 0 0 1 ${cx + dx} 0`, // right shoulder
    `L ${w - r} 0`,
    `A ${r} ${r} 0 0 1 ${w} ${r}`,
    `L ${w} ${h - r}`,
    `A ${r} ${r} 0 0 1 ${w - r} ${h}`,
    `L ${r} ${h}`,
    `A ${r} ${r} 0 0 1 0 ${h - r}`,
    `L 0 ${r}`,
    `A ${r} ${r} 0 0 1 ${r} 0`,
    "Z",
  ].join(" ");
}

export default function BottomTabBar() {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const { width: screenWidth } = useWindowDimensions();
  const { colors } = useAppTheme();

  const barWidth = screenWidth - SIDE_MARGIN * 2;
  const journeyActive = pathname === JOURNEY_HREF;

  const renderTab = (tab: (typeof TABS)[number]) => {
    const active = pathname === tab.href;
    const color = active ? colors.highlight : colors.heading;

    return (
      <Pressable
        key={tab.href}
        onPress={() => router.navigate(tab.href)}
        accessibilityRole="tab"
        accessibilityState={{ selected: active }}
        accessibilityLabel={tab.label}
        style={{ flex: 1, alignItems: "center", gap: 2 }}
      >
        <Ionicons
          name={active ? tab.iconActive : tab.icon}
          size={ICON_SIZE}
          color={color}
        />
        <ThemedText style={{ fontSize: 13, color }} variant="heading">
          {tab.label}
        </ThemedText>
      </Pressable>
    );
  };

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        left: SIDE_MARGIN,
        right: SIDE_MARGIN,
        bottom: Math.max(insets.bottom - 6, BOTTOM_GAP),
        height: BAR_HEIGHT,
      }}
    >
      {/* Bar background with the curved cutout */}
      <Svg
        width={barWidth}
        height={BAR_HEIGHT}
        style={{ position: "absolute", left: 0, top: 0 }}
      >
        <Path
          d={buildBarPath(barWidth, BAR_HEIGHT)}
          fill={colors.surface}
          stroke={colors.border}
          strokeWidth={1}
        />
      </Svg>

      {/* Tab row */}
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 10,
        }}
      >
        {renderTab(TABS[0])}
        {renderTab(TABS[1])}

        {/* Center slot: label lines up with the other tabs */}
        <View style={{ flex: 1, alignItems: "center", gap: 2 }}>
          <View style={{ height: ICON_SIZE }} />
          <ThemedText
            style={{
              fontSize: 13,
              color: journeyActive ? colors.highlight : colors.heading,
              marginTop: 8,
            }}
            variant="heading"
          >
            Journey
          </ThemedText>
          <View style={{ width: 4, height: 4 }} />
        </View>

        {renderTab(TABS[2])}
        {renderTab(TABS[3])}
      </View>

      {/* Raised Journey button, half above the bar and half in the cutout */}
      <Pressable
        onPress={() => router.navigate(JOURNEY_HREF)}
        accessibilityRole="tab"
        accessibilityState={{ selected: journeyActive }}
        accessibilityLabel="Journey"
        style={{
          position: "absolute",
          left: barWidth / 2 - JOURNEY_SIZE / 2,
          top: -JOURNEY_SIZE / 2,
          width: JOURNEY_SIZE,
          height: JOURNEY_SIZE,
          borderRadius: JOURNEY_SIZE / 2,
          backgroundColor: colors.heading,
          alignItems: "center",
          justifyContent: "center",
          shadowColor: colors.heading,
          shadowOpacity: 0.25,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
          elevation: 6,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 3,
            width: 23,
          }}
        >
          {Array.from({ length: 4 }, (_, index) => (
            <View
              key={index}
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: colors.surface,
              }}
            />
          ))}
        </View>
      </Pressable>
    </View>
  );
}
