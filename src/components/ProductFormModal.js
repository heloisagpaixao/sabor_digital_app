import React, { useEffect, useState } from 'react';
import { View, Text, Image, Switch, Pressable, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import BaseModal from './BaseModal';
import Field from './Field';
import Button from './Button';
import { colors, radius } from '../theme';
import { imageUrl, isAvailable } from '../utils';

const MAX_SIZE = 5 * 1024 * 1024; // 5MB, limite da API
const empty = { nome: '', descricao: '', preco: '', categoria: '', disponivel: true, imagem: null };

// Serve para cadastrar (produto = null) e editar (produto = objeto)
export default function ProductFormModal({ visible, produto, onClose, onSave }) {
  const editing = !!produto;
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!visible) return;
    setError('');
    setForm(
      produto
        ? {
            nome: produto.nome || '',
            descricao: produto.descricao || '',
            preco: String(produto.preco ?? '').replace('.', ','),
            categoria: produto.categoria || '',
            disponivel: isAvailable(produto.disponivel),
            imagem: null, // só preenchida se o admin escolher uma nova foto
          }
        : empty
    );
  }, [visible, produto]);

  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7 });
    if (result.canceled) return;
    const asset = result.assets[0];
    if (asset.fileSize && asset.fileSize > MAX_SIZE) return setError('A imagem deve ter no máximo 5MB.');
    const ext = asset.uri.split('.').pop()?.toLowerCase();
    if (ext && !['jpg', 'jpeg', 'png'].includes(ext)) return setError('Use uma imagem JPG ou PNG.');
    setError('');
    setForm((f) => ({
      ...f,
      imagem: { uri: asset.uri, name: asset.fileName || `produto.${ext || 'jpg'}`, type: asset.mimeType || 'image/jpeg' },
    }));
  };

  const submit = async () => {
    const preco = Number(String(form.preco).replace(',', '.'));
    if (!form.nome.trim() || !form.descricao.trim() || !form.categoria.trim()) return setError('Preencha nome, descrição e categoria.');
    if (!preco || preco <= 0) return setError('Informe um preço válido, ex.: 12,50.');
    if (!editing && !form.imagem) return setError('Escolha uma imagem para o produto.');

    setLoading(true); setError('');
    try {
      await onSave({ ...form, nome: form.nome.trim(), descricao: form.descricao.trim(), categoria: form.categoria.trim(), preco }, produto?.id);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const preview = form.imagem?.uri || (editing ? imageUrl(produto.imagem) : null);

  return (
    <BaseModal visible={visible} title={editing ? 'Editar produto' : 'Novo produto'} onClose={onClose}>
      <Pressable onPress={pickImage} style={s.picker}>
        {preview ? (
          <Image source={{ uri: preview }} style={s.preview} resizeMode="cover" />
        ) : (
          <Text style={s.pickerText}>Toque para escolher uma imagem (JPG ou PNG, até 5MB)</Text>
        )}
      </Pressable>
      {!!preview && <Text style={s.change} onPress={pickImage}>Trocar imagem</Text>}

      <Field label="Nome" value={form.nome} onChangeText={set('nome')} placeholder="Ex.: Pizza Margherita" />
      <Field label="Descrição" value={form.descricao} onChangeText={set('descricao')} multiline placeholder="Ingredientes e detalhes" />
      <Field label="Preço (R$)" value={form.preco} onChangeText={set('preco')} keyboardType="decimal-pad" placeholder="0,00" />
      <Field label="Categoria" value={form.categoria} onChangeText={set('categoria')} placeholder="Ex.: Pizzas, Bebidas, Massas" />

      <View style={s.switchRow}>
        <Text style={s.switchLabel}>Disponível no cardápio</Text>
        <Switch value={form.disponivel} onValueChange={set('disponivel')} trackColor={{ true: colors.orange }} thumbColor="#fff" />
      </View>

      {!!error && <Text style={s.error}>{error}</Text>}
      <View style={s.row}>
        <Button label="Cancelar" outline color={colors.muted} onPress={onClose} style={s.flex} disabled={loading} />
        <Button label={editing ? 'Salvar alterações' : 'Cadastrar produto'} onPress={submit} loading={loading} style={s.flex} />
      </View>
    </BaseModal>
  );
}

const s = StyleSheet.create({
  picker: {
    height: 160, borderRadius: radius.md, borderWidth: 1.5, borderStyle: 'dashed', borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: 8, backgroundColor: '#FAFBFB',
  },
  pickerText: { color: colors.muted, textAlign: 'center', paddingHorizontal: 24 },
  preview: { width: '100%', height: '100%' },
  change: { color: colors.blue, fontWeight: '600', marginBottom: 14, textAlign: 'center' },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  switchLabel: { fontSize: 15, fontWeight: '600', color: colors.navy },
  error: { color: colors.red, marginBottom: 12, fontSize: 14 },
  row: { flexDirection: 'row', gap: 10 },
  flex: { flex: 1 },
});
