import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Button from './Button';
import { colors, radius } from '../theme';
import { formatPrice, imageUrl, isAvailable } from '../utils';

export default function ProductCard({ produto, isAdmin, onEdit, onDelete }) {
  const uri = imageUrl(produto.imagem);
  const available = isAvailable(produto.disponivel);

  return (
    <View style={s.card}>
      {uri ? (
        <Image source={{ uri }} style={s.image} resizeMode="cover" />
      ) : (
        <View style={[s.image, s.placeholder]}>
          <Text style={s.placeholderText}>Sem imagem</Text>
        </View>
      )}
      {!available && (
        <View style={s.badge}>
          <Text style={s.badgeText}>Indisponível</Text>
        </View>
      )}

      <View style={s.body}>
        <Text style={s.name}>{produto.nome}</Text>
        {!!produto.categoria && <Text style={s.category}>{produto.categoria}</Text>}
        <Text style={s.desc}>{produto.descricao}</Text>
        <Text style={s.price}>{formatPrice(produto.preco)}</Text>

        {isAdmin && (
          <View style={s.actions}>
            <Button label="Editar" small color={colors.blue} onPress={() => onEdit(produto)} />
            <Button label="Excluir" small color={colors.red} onPress={() => onDelete(produto)} />
          </View>
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: colors.card, borderRadius: radius.lg, overflow: 'hidden', marginBottom: 18,
    elevation: 3, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 4 },
  },
  image: { width: '100%', height: 200, backgroundColor: '#E9ECEE' },
  placeholder: { alignItems: 'center', justifyContent: 'center' },
  placeholderText: { color: colors.muted },
  badge: { position: 'absolute', top: 12, right: 12, backgroundColor: colors.red, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  body: { padding: 18 },
  name: { fontSize: 20, fontWeight: '800', color: colors.navy },
  category: { fontSize: 13, color: colors.blue, fontWeight: '600', marginTop: 2 },
  desc: { fontSize: 15, color: colors.muted, marginTop: 6 },
  price: { fontSize: 24, fontWeight: '800', color: colors.orange, marginTop: 10 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 14 },
});
