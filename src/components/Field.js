import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { colors, radius } from "../theme";

export default function Field({ label, style, multiline, ...props }) {
  return (
    <View style={s.wrap}>
      <Text style={s.label}>{label}</Text>
      <TextInput
        placeholderTextColor="#9AA1A8"
        multiline={multiline}
        style={[
          s.input,
          multiline && { height: 80, textAlignVertical: "top" },
          style,
        ]}
        {...props}
      />
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { marginBottom: 14 },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.navy,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.text,
    backgroundColor: "#FAFBFB",
  },
});
