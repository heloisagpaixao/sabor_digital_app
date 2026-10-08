import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
  StyleSheet,
} from "react-native";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import LoginModal from "../components/LoginModal";
import RegisterModal from "../components/RegisterModal";
import ProductFormModal from "../components/ProductFormModal";
import ConfirmModal from "../components/ConfirmModal";
import Button from "../components/Button";
import { colors } from "../theme";
import { useAuth } from "../context/AuthContext";
import { api } from "../api";

export default function HomeScreen() {
  const { user, isAdmin, restoring, logout } = useAuth();

  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // Controle dos modais
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null); // produto sendo editado (null = novo)
  const [toDelete, setToDelete] = useState(null); // produto aguardando confirmação de exclusão
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    try {
      setError("");
      setProdutos(await api.listarProdutos());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openNew = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (produto) => {
    setEditing(produto);
    setFormOpen(true);
  };

  const saveProduct = async (valores, id) => {
    if (id) await api.editarProduto(id, valores);
    else await api.criarProduto(valores);
    setFormOpen(false);
    load();
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await api.excluirProduto(toDelete.id);
      setToDelete(null);
      load();
    } catch (e) {
      setToDelete(null);
      Alert.alert("Não foi possível excluir", e.message);
    } finally {
      setDeleting(false);
    }
  };

  const confirmLogout = async () => {
    setLogoutOpen(false);
    await logout();
  };

  if (restoring) {
    return (
      <View style={s.center}>
        <ActivityIndicator size="large" color={colors.orange} />
      </View>
    );
  }

  return (
    <View style={s.screen}>
      <Header
        user={user}
        isAdmin={isAdmin}
        onLogin={() => setLoginOpen(true)}
        onRegister={() => setRegisterOpen(true)}
        onNewProduct={openNew}
        onLogout={() => setLogoutOpen(true)}
      />

      {loading ? (
        <View style={s.center}>
          <ActivityIndicator size="large" color={colors.orange} />
        </View>
      ) : (
        <FlatList
          data={produtos}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={s.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                load();
              }}
              colors={[colors.orange]}
            />
          }
          ListHeaderComponent={<Text style={s.title}>Nossos Produtos</Text>}
          renderItem={({ item }) => (
            <ProductCard
              produto={item}
              isAdmin={isAdmin}
              onEdit={openEdit}
              onDelete={setToDelete}
            />
          )}
          ListEmptyComponent={
            error ? (
              <View style={s.empty}>
                <Text style={s.emptyText}>{error}</Text>
                <Button
                  label="Tentar novamente"
                  onPress={() => {
                    setLoading(true);
                    load();
                  }}
                />
              </View>
            ) : (
              <View style={s.empty}>
                <Text style={s.emptyText}>
                  Nenhum produto cadastrado ainda.
                </Text>
                {isAdmin && (
                  <Button
                    label="Cadastrar primeiro produto"
                    onPress={openNew}
                  />
                )}
              </View>
            )
          }
        />
      )}

      <LoginModal
        visible={loginOpen}
        onClose={() => setLoginOpen(false)}
        onGoToRegister={() => setRegisterOpen(true)}
      />
      <RegisterModal
        visible={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onGoToLogin={() => setLoginOpen(true)}
      />
      <ProductFormModal
        visible={formOpen}
        produto={editing}
        onClose={() => setFormOpen(false)}
        onSave={saveProduct}
      />

      <ConfirmModal
        visible={!!toDelete}
        title="Excluir produto"
        message={`Tem certeza que deseja excluir "${toDelete?.nome}"? Essa ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
      <ConfirmModal
        visible={logoutOpen}
        title="Sair da conta"
        message="Deseja realmente sair?"
        confirmLabel="Sair"
        onConfirm={confirmLogout}
        onCancel={() => setLogoutOpen(false)}
      />
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.bg,
  },
  list: { padding: 16, paddingBottom: 40 },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.navy,
    textAlign: "center",
    marginVertical: 14,
  },
  empty: {
    alignItems: "center",
    gap: 16,
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  emptyText: { color: colors.muted, fontSize: 15, textAlign: "center" },
});
