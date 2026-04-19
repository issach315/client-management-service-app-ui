import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addClient, clearMutateStatus } from "../../store/slices/clientsSlice";
import {
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
  const dispatch = useDispatch();

  const mutating = useSelector(selectMutating);
  const mutateError = useSelector(selectMutateError);
  const lastMutateSuccess = useSelector(selectLastMutateSuccess);

  const [formData, setFormData] = useState(EMPTY);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    if (lastMutateSuccess === "added") {
      setSnackbar({
        open: true,
        message: "Client created successfully!",
        severity: "success",
      });
      dispatch(clearMutateStatus());
      setTimeout(() => navigate(".."), 1200);
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
    dispatch(addClient(formData));
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
            submitText={mutating ? "Creating..." : "Create Client"}
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
