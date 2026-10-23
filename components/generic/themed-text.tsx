import { StyleSheet, Text, type TextProps } from "react-native";
import { useAppTheme } from "../theme/theme-provider";

type TextVariant = "display" | "heading" | "body" | "label" | "caption";
type TextTone = "primary" | "secondary" | "muted" | "accent" | "inverse";

type ThemedTextProps = TextProps & {
	variant?: TextVariant;
	tone?: TextTone;
};

export function ThemedText({
	variant = "body",
	tone = "primary",
	style,
	...props
}: ThemedTextProps) {
	const { colors } = useAppTheme();
	const themedTones = {
		primary: { color: colors.text },
		secondary: { color: colors.secondaryText },
		muted: { color: colors.mutedText },
		accent: { color: colors.accent },
		inverse: { color: "#FFFFFF" },
	};

	return <Text {...props} style={[styles[variant], themedTones[tone], style]} />;
}

const styles = StyleSheet.create({
	display: {
		fontFamily: "Fredoka-Medium",
		fontSize: 36,
		lineHeight: 42,
	},
	heading: {
		fontFamily: "Fredoka-Bold",
		fontSize: 23,
		lineHeight: 29,
	},
	body: {
		fontFamily: "Fredoka-Regular",
		fontSize: 15,
		lineHeight: 22,
	},
	label: {
		fontFamily: "Fredoka-Medium",
		fontSize: 13,
		lineHeight: 18,
	},
	caption: {
		fontFamily: "Fredoka-Regular",
		fontSize: 12,
		lineHeight: 17,
	},
});
