import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import BaseModal from './BaseModal';
import Field from './Field';
import Button from './Button';
import { useAuth } from '../src/context/AuthContext';
import { colors, radius } from '../theme';

export default function RegisterModal({ visible, onClose, onGoToLogin }) {
  const { register } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [papel, setPapel] = useState('cliente');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const close = () => { setNome(''); setEmail(''); setSenha(''); setPapel('cliente'); setError(''); onClose(); };

  const submit = async () => {
    if (!nome.trim() || !email.trim() || !senha) return setError('Preencha todos os campos.');
    if (senha.length < 6) return setError('A senha precisa ter pelo menos 6 caracteres.');
    setLoading(true); setError('');
    try {
      await register({ nome: nome.trim(), email: email.trim(), senha, papel });
      close();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseModal visible={visible} title="Criar conta" onClose={close}>
      <Field label="Nome" value={nome} onChangeText={setNome} placeholder="Seu nome" />
      <Field label="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholder="voce@email.com" />
      <Field label="Senha" value={senha} onChangeText={setSenha} secureTextEntry placeholder="Mínimo 6 caracteres" />

      {/* Em produção, remova este seletor e deixe o papel fixo como "cliente" */}
      <Text style={s.label}>Tipo de conta</Text>
      <View style={s.segment}>
        {['cliente', 'admin'].map((p) => (
          <Pressable key={p} onPress={() => setPapel(p)} style={[s.option, papel === p && s.optionActive]}>
            <Text style={[s.optionText, papel === p && s.optionTextActive]}>{p === 'admin' ? 'Administrador' : 'Cliente'}</Text>
          </Pressable>
        ))}
      </View>

      {!!error && <Text style={s.error}>{error}</Text>}
      <Button label="Criar conta" onPress={submit} loading={loading} />
      <Pressable onPress={() => { close(); onGoToLogin(); }} style={s.link}>
        <Text style={s.linkText}>Já tem conta? <Text style={s.linkBold}>Entrar</Text></Text>
      </Pressable>
    </BaseModal>
  );
}

const s = StyleSheet.create({
  label: { fontSize: 14, fontWeight: '600', color: colors.navy, marginBottom: 6 },
  segment: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  option: { flex: 1, paddingVertical: 10, borderRadius: radius.sm, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center' },
  optionActive: { borderColor: colors.orange, backgroundColor: '#FFF3E6' },
  optionText: { color: colors.muted, fontWeight: '600' },
  optionTextActive: { color: colors.orange },
  error: { color: colors.red, marginBottom: 12, fontSize: 14 },
  link: { marginTop: 16, alignItems: 'center' },
  linkText: { color: colors.muted, fontSize: 14 },
  linkBold: { color: colors.orange, fontWeight: '700' },
});
