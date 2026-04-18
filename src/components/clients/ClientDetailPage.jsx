// src/components/clients/ClientDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getClientById } from "@/services";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Grid,
  Divider,
  CircularProgress,
  Alert,
  Stack,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";

const DetailRow = ({ label, value }) => (
  <Box>
    <Typography
      variant="caption"
      color="text.secondary"
      fontWeight={600}
      sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}
    >
      {label}
    </Typography>
    <Typography variant="body1" mt={0.25}>
      {value || "—"}
    </Typography>
  </Box>
);

const ClientDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const response = await getClientById(id);
        // Handles both { data: client } and { data: { data: client } } shapes
        setClient(response.data?.data ?? response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load client");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" p={6}>
        <CircularProgress />
      </Box>
    );
  if (error)
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  if (!client)
    return (
      <Alert severity="warning" sx={{ m: 2 }}>
        Client not found.
      </Alert>
    );

  return (
    <Box p={3}>
      <Stack direction="row" spacing={1} mb={2}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          size="small"
        >
          Back
        </Button>
        <Button
          startIcon={<EditIcon />}
          variant="contained"
          size="small"
          onClick={() => navigate(`../${id}/edit`, { relative: "path" })}
        >
          Edit
        </Button>
      </Stack>

      <Card variant="outlined">
        <CardContent sx={{ p: 3 }}>
          {/* Header */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
          >
            <Box>
              <Typography variant="h5" fontWeight={600}>
                {client.clientName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {client.industry || "N/A"}
              </Typography>
            </Box>
            <Chip
              label={client.status}
              color={client.status === "ACTIVE" ? "success" : "error"}
              sx={{ fontWeight: 600 }}
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <DetailRow label="Client ID" value={`#${client.id}`} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DetailRow label="Contact Person" value={client.contactPerson} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DetailRow label="Email" value={client.email} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DetailRow label="Phone Number" value={client.phoneNumber} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DetailRow label="Industry" value={client.industry} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DetailRow label="Location" value={client.location} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ClientDetailPage;
