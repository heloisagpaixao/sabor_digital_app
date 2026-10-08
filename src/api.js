import axios from "axios";
import { BASE_URL } from "./config";

const client = axios.create({
  baseURL: BASE_URL,
});

export function setToken(token) {
  if (token) {
    client.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete client.defaults.headers.common.Authorization;
  }
}

export const api = {
  listarProdutos: async () => {
    const response = await client.get("/produtos");
    return response.data;
  },

  login: async (email, senha) => {
    const response = await client.post("/auth/login", {
      email,
      senha,
    });
    return response.data;
  },

  registrar: async (dados) => {
    const response = await client.post("/auth/register", dados);
    return response.data;
  },

  criarProduto: async (dados) => {
    const response = await client.post("/produtos", dados);
    return response.data;
  },

  editarProduto: async (id, dados) => {
    const response = await client.put(`/produtos/${id}`, dados);
    return response.data;
  },

  excluirProduto: async (id) => {
    const response = await client.delete(`/produtos/${id}`);
    return response.data;
  },
};
