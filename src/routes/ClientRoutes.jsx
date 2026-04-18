import React from "react";
import { Routes, Route } from "react-router-dom";
import {
  ClientsList,
  AddClientPage,
  ClientDetailPage,
  EditClientPage,
} from "@/components";

const ClientRoutes = () => (
  <Routes>
    <Route path="/" element={<ClientsList />} />
    <Route path="/add" element={<AddClientPage />} />
    <Route path="/:id" element={<ClientDetailPage />} />
    <Route path="/:id/edit" element={<EditClientPage />} />
  </Routes>
);

export default ClientRoutes;
