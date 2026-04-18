import { get, post, put, del } from "@/services/api";

const BASE = "/clients";

// Get all clients (with filters, search, sort, pagination)
export const getClients = (params) => {
  return get(BASE, params);
};

// Get client by ID
export const getClientById = (id) => {
  return get(`${BASE}/${id}`);
};

// Create client
export const createClient = (data) => {
  return post(BASE, data);
};

// Update client
export const updateClient = (id, data) => {
  return put(`${BASE}/${id}`, data);
};

// Delete client
export const deleteClient = (id) => {
  return del(`${BASE}/${id}`);
};