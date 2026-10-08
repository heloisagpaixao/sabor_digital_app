import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import BaseModal from './BaseModal';
import Button from './Button';
import { colors } from '../theme';

// Usado para confirmar exclusão de produto e saída da conta
export default function ConfirmModal({ visible, title, message, confirmLabel = 'Confirmar', confirmColor = colors.red, loading, onConfirm, onCancel }) {
  return (
    <BaseModal visible={visible} title={title} onClose={onCancel}>
      <Text style={s.message}>{message}</Text>
      <View style={s.row}>
        <Button label="Cancelar" outline color={colors.muted} onPress={onCancel} style={s.flex} disabled={loading} />
        <Button label={confirmLabel} color={confirmColor} onPress={onConfirm} loading={loading} style={s.flex} />
      </View>
    </BaseModal>
  );
}

const s = StyleSheet.create({
  message: { fontSize: 15, color: colors.muted, lineHeight: 22, marginBottom: 20 },
  row: { flexDirection: 'row', gap: 10 },
  flex: { flex: 1 },
});
