import React, { useState } from "react";
import { Text, Pressable, StyleSheet } from "react-native";
import BaseModal from "./BaseModal";
import Field from "./Field";
import Button from "./Button";
import { useAuth } from "../context/AuthContext";
import { colors } from "../theme";

export default function LoginModal({ visible, onClose, onGoToRegister }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const close = () => {
    setEmail("");
    setSenha("");
    setError("");
    onClose();
  };

  const submit = async () => {
    if (!email.trim() || !senha) return setError("Informe e-mail e senha.");
    setLoading(true);
    setError("");
    try {
      await login(email.trim(), senha);
      close();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseModal visible={visible} title="Entrar" onClose={close}>
      <Field
        label="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholder="voce@email.com"
      />
      <Field
        label="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        placeholder="Sua senha"
      />
      {!!error && <Text style={s.error}>{error}</Text>}
      <Button label="Entrar" onPress={submit} loading={loading} />
      <Pressable
        onPress={() => {
          close();
          onGoToRegister();
        }}
        style={s.link}
      >
        <Text style={s.linkText}>
          Ainda não tem conta? <Text style={s.linkBold}>Cadastre-se</Text>
        </Text>
      </Pressable>
    </BaseModal>
  );
}

const s = StyleSheet.create({
  error: { color: colors.red, marginBottom: 12, fontSize: 14 },
  link: { marginTop: 16, alignItems: "center" },
  linkText: { color: colors.muted, fontSize: 14 },
  linkBold: { color: colors.orange, fontWeight: "700" },
});
