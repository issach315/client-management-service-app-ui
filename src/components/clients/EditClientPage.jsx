import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchClientById,
  editClient,
  clearSelectedClient,
  clearMutateStatus,
} from "../../store/slices/clientsSlice";
import {
  selectSelectedClient,
  selectDetailLoading,
  selectDetailError,
  selectMutating,
  selectMutateError,
  selectLastMutateSuccess,
} from "../../store/selectors/clientsSelectors";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
  Stack,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {FormGenerator} from "@/components";

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

const toFormData = (client) => ({
  clientName: client?.clientName || "",
  contactPerson: client?.contactPerson || "",
  email: client?.email || "",
  phoneNumber: client?.phoneNumber || "",
  industry: client?.industry || "",
  status: client?.status || "ACTIVE",
  location: client?.location || "",
});

const EditClientPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const client = useSelector(selectSelectedClient);
  const detailLoading = useSelector(selectDetailLoading);
  const detailError = useSelector(selectDetailError);
  const mutating = useSelector(selectMutating);
  const mutateError = useSelector(selectMutateError);
  const lastMutateSuccess = useSelector(selectLastMutateSuccess);

  const [formData, setFormData] = useState(toFormData(null));
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    dispatch(fetchClientById(id));
    return () => {
      dispatch(clearSelectedClient());
    };
  }, [id, dispatch]);

  // Populate form once client is loaded
  useEffect(() => {
    if (client) setFormData(toFormData(client));
  }, [client]);

  // React to save result
  useEffect(() => {
    if (lastMutateSuccess === "updated") {
      setSnackbar({
        open: true,
        message: "Client updated successfully!",
        severity: "success",
      });
      dispatch(clearMutateStatus());
      setTimeout(() => navigate("/clients"), 1200);
    }
  }, [lastMutateSuccess]);

  useEffect(() => {
    if (mutateError) {
      setSnackbar({ open: true, message: mutateError, severity: "error" });
      dispatch(clearMutateStatus());
    }
  }, [mutateError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    dispatch(editClient({ id, data: formData }));
  };

  if (detailLoading)
    return (
      <Box display="flex" justifyContent="center" p={6}>
        <CircularProgress />
      </Box>
    );
  if (detailError)
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {detailError}
      </Alert>
    );

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
          Edit Client
        </Typography>
      </Stack>

      <Card variant="outlined">
        <CardContent sx={{ p: 3 }}>
          <FormGenerator
            fields={CLIENT_FORM_FIELDS}
            values={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            submitText={mutating ? "Saving..." : "Update Client"}
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

export default EditClientPage;
