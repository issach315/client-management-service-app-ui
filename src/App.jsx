// App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ClientRoutes } from "@/routes";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root */}
        <Route path="/" element={<Navigate to="/clients" replace />} />

        {/* Clients Module */}
        <Route path="/clients/*" element={<ClientRoutes />} />

        {/* Page Not Found */}
        <Route path="*" element={<Navigate to="/clients" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
