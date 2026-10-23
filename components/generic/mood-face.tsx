import Svg, { Circle, G, Line, Path } from "react-native-svg";
import { COLORS } from "../../constants/assessment-colors";

// `color` is the segment / big-face background, `ink` is the face colour on the
// dial, `bigInk` is the face colour on the large preview.
// TODO: confirm the labels and the two off-screen moods (awful / thrilled) with design.
export const MOODS = [
  {
    id: "awful",
    label: "Awful",
    color: "#8C6048",
    ink: "#4A2C1A",
    bigInk: "#2B1709",
  },
  {
    id: "angry",
    label: "Angry",
    color: COLORS.orange,
    ink: "#6B3600",
    bigInk: COLORS.brown,
  },
  {
    id: "neutral",
    label: "Neutral",
    color: "#FECD5D",
    ink: "#705400",
    bigInk: COLORS.brown,
  },
  {
    id: "happy",
    label: "Happy",
    color: COLORS.green,
    ink: "#3A4A22",
    bigInk: COLORS.brown,
  },
  {
    id: "thrilled",
    label: "Thrilled",
    color: "#A293F2",
    ink: "#3D2F8C",
    bigInk: COLORS.brown,
  },
] as const;

export type Mood = (typeof MOODS)[number];
export type MoodId = Mood["id"];

type FaceFeaturesProps = { id: MoodId; ink: string };

// Features drawn in a 100-unit box centred on (0, 0), so the same shapes
// work on the big preview and on the rotated dial segments.
export function FaceFeatures({ id, ink }: FaceFeaturesProps) {
  const common = {
    stroke: ink,
    strokeWidth: 8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    fill: "none",
  };

  switch (id) {
    case "awful":
      return (
        <G {...common}>
          <Line x1={-29} y1={-18} x2={-15} y2={-27} />
          <Line x1={29} y1={-18} x2={15} y2={-27} />
          <Line x1={-22} y1={-8} x2={-22} y2={0} />
          <Line x1={22} y1={-8} x2={22} y2={0} />
          <Path d="M -22 28 Q 0 8 22 28" />
        </G>
      );
    case "angry":
      return (
        <G {...common}>
          <Line x1={-28} y1={-24} x2={-17} y2={-12} />
          <Line x1={28} y1={-24} x2={17} y2={-12} />
          <Path d="M -24 26 Q 0 2 24 26" />
        </G>
      );
    case "neutral":
      return (
        <G {...common}>
          <Line x1={-25} y1={-17} x2={-25} y2={-4} />
          <Line x1={25} y1={-17} x2={25} y2={-4} />
          <Line x1={-25} y1={16.5} x2={25} y2={16.5} />
        </G>
      );
    case "happy":
      return (
        <G {...common}>
          <Path d="M -29 -6 Q -23 -22 -13 -10" />
          <Path d="M 13 -6 Q 23 -22 29 -10" />
          <Path d="M -28 2 C -20 34 20 34 28 2" />
        </G>
      );
    case "thrilled":
      return (
        <G {...common}>
          <Path d="M -30 -8 Q -22 -22 -14 -8" />
          <Path d="M 14 -8 Q 22 -22 30 -8" />
          <Path d="M -26 8 Q 0 40 26 8 Z" fill={ink} />
        </G>
      );
  }
}

export default function MoodFace({ mood, size }: { mood: Mood; size: number }) {
  return (
    <Svg width={size} height={size} viewBox="-50 -50 100 100">
      <Circle r={50} fill={mood.color} />
      <FaceFeatures id={mood.id} ink={mood.bigInk} />
    </Svg>
  );
}
