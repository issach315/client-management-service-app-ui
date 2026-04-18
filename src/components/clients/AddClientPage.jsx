import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from "@/services";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  Snackbar,
  Stack,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FormGenerator from "@/components/FormGenerator";

const CLIENT_FORM_FIELDS = [
  {
    type: "text",
    name: "clientName",
    label: "Client Name",
    xs: 12,
    sm: 6,
    required: true,
  },
  {
    type: "text",
    name: "contactPerson",
    label: "Contact Person",
    xs: 12,
    sm: 6,
  },
  {
    type: "email",
    name: "email",
    label: "Email",
    xs: 12,
    sm: 6,
    required: true,
  },
  {
    type: "text",
    name: "phoneNumber",
    label: "Phone Number",
    xs: 12,
    sm: 6,
    required: true,
  },
  {
    type: "select",
    name: "industry",
    label: "Industry",
    xs: 12,
    sm: 6,
    options: [
      { label: "IT", value: "IT" },
      { label: "Finance", value: "Finance" },
      { label: "Healthcare", value: "Healthcare" },
      { label: "Retail", value: "Retail" },
      { label: "Manufacturing", value: "Manufacturing" },
      { label: "Other", value: "Other" },
    ],
  },
  {
    type: "select",
    name: "status",
    label: "Status",
    xs: 12,
    sm: 6,
    required: true,
    options: [
      { label: "ACTIVE", value: "ACTIVE" },
      { label: "INACTIVE", value: "INACTIVE" },
    ],
  },
  { type: "text", name: "location", label: "Location", xs: 12 },
];

const EMPTY = {
  clientName: "",
  contactPerson: "",
  email: "",
  phoneNumber: "",
  industry: "",
  status: "ACTIVE",
  location: "",
};

const AddClientPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setSaving(true);
    try {
      const response = await createClient(formData);
      const newId = response.data?.data?.id ?? response.data?.id;
      setSnackbar({
        open: true,
        message: "Client created successfully!",
        severity: "success",
      });
      setTimeout(
        () => navigate(newId ? `../${newId}` : "..", { relative: "path" }),
        1200,
      );
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Error creating client",
        severity: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box p={3}>
      <Stack direction="row" spacing={1} mb={2} alignItems="center">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          size="small"
        >
          Back
        </Button>
        <Typography variant="h6" fontWeight={600}>
          Add New Client
        </Typography>
      </Stack>

      <Card variant="outlined">
        <CardContent sx={{ p: 3 }}>
          <FormGenerator
            fields={CLIENT_FORM_FIELDS}
            values={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            submitText={saving ? "Creating..." : "Create Client"}
          />
        </CardContent>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddClientPage;
