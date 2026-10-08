import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from './Button';
import { colors } from '../theme';

export default function Header({ user, isAdmin, onLogin, onRegister, onNewProduct, onLogout }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[s.bar, { paddingTop: insets.top + 12 }]}>
      <View>
        <Text style={s.logo}>
          Sabor <Text style={s.accent}>Digital</Text>
        </Text>
        {user && <Text style={s.hello}>Olá, {user.nome?.split(' ')[0]}</Text>}
      </View>

      <View style={s.actions}>
        {!user && (
          <>
            <Button label="Entrar" small onPress={onLogin} />
            <Button label="Cadastrar" small outline color="#fff" onPress={onRegister} />
          </>
        )}
        {isAdmin && <Button label="Novo Produto" small onPress={onNewProduct} />}
        {user && <Button label="Sair" small color={colors.red} onPress={onLogout} />}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  bar: {
    backgroundColor: colors.navy, paddingHorizontal: 16, paddingBottom: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  logo: { color: '#fff', fontSize: 22, fontWeight: '800' },
  accent: { color: colors.orange },
  hello: { color: '#B7C4D6', fontSize: 12, marginTop: 2 },
  actions: { flexDirection: 'row', gap: 8 },
});
