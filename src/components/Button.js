import React from "react";
import { Pressable, Text, ActivityIndicator, StyleSheet } from "react-native";
import { colors, radius } from "../theme";

export default function Button({
  label,
  onPress,
  color = colors.orange,
  small,
  outline,
  loading,
  disabled,
  style,
}) {
  const inactive = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      android_ripple={{ color: "rgba(255,255,255,0.25)" }}
      style={({ pressed }) => [
        s.btn,
        small && s.small,
        outline
          ? {
              borderWidth: 1.5,
              borderColor: color,
              backgroundColor: "transparent",
            }
          : { backgroundColor: color },
        pressed && { opacity: 0.85 },
        inactive && { opacity: 0.55 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={outline ? color : "#fff"} />
      ) : (
        <Text style={[s.label, small && s.labelSmall, outline && { color }]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const s = StyleSheet.create({
  btn: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  small: { paddingVertical: 8, paddingHorizontal: 14 },
  label: { color: "#fff", fontWeight: "700", fontSize: 15 },
  labelSmall: { fontSize: 14 },
});
