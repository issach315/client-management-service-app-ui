import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchClients,
  addClient,
  removeClient,
  clearMutateStatus,
} from "../../store/slices/clientsSlice";
import {
  selectClientsList,
  selectClientsTotalPages,
  selectClientsTotalItems,
  selectClientsListLoading,
  selectMutating,
  selectMutateError,
  selectLastMutateSuccess,
} from "../../store/selectors/clientsSelectors";
import { DataTable, Dialog, FormGenerator } from "@/components";
import {
  Chip,
  IconButton,
  Tooltip,
  Alert,
  Snackbar,
  Button,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import TagIcon from "@mui/icons-material/Tag";
import BadgeIcon from "@mui/icons-material/Badge";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import BusinessIcon from "@mui/icons-material/Business";
import CircleIcon from "@mui/icons-material/Circle";
import LocationOnIcon from "@mui/icons-material/LocationOn";

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

const EMPTY_FORM = {
  clientName: "",
  contactPerson: "",
  email: "",
  phoneNumber: "",
  industry: "",
  status: "ACTIVE",
  location: "",
};

const ClientsList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ── Redux state ───────────────────────────────────────────────────────────
  const clients = useSelector(selectClientsList);
  const totalPages = useSelector(selectClientsTotalPages);
  const totalElements = useSelector(selectClientsTotalItems);
  const listLoading = useSelector(selectClientsListLoading);
  const mutating = useSelector(selectMutating);
  const mutateError = useSelector(selectMutateError);
  const lastMutateSuccess = useSelector(selectLastMutateSuccess);

  // ── Local UI state ────────────────────────────────────────────────────────
  const [tableRefreshKey, setTableRefreshKey] = useState(0);
  const refresh = () => setTableRefreshKey((k) => k + 1);

  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState(EMPTY_FORM);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const showSnackbar = (message, severity) =>
    setSnackbar({ open: true, message, severity });

  // ── React to mutation results ─────────────────────────────────────────────
  useEffect(() => {
    if (lastMutateSuccess === "added") {
      showSnackbar("Client created successfully!", "success");
      setAddOpen(false);
      setAddForm(EMPTY_FORM);
      refresh();
      dispatch(clearMutateStatus());
    }
    if (lastMutateSuccess === "deleted") {
      showSnackbar(
        `Client "${selectedClient?.clientName}" deleted successfully!`,
        "success",
      );
      setDeleteOpen(false);
      setSelectedClient(null);
      refresh();
      dispatch(clearMutateStatus());
    }
  }, [lastMutateSuccess]);

  useEffect(() => {
    if (mutateError) {
      showSnackbar(mutateError, "error");
      dispatch(clearMutateStatus());
    }
  }, [mutateError]);

  // ── DataTable fetch callback ───────────────────────────────────────────────
  // DataTable calls this with { page, size, search, sortField, sortOrder, filters }
  const fetchData = useCallback(
    async ({ page, size, search, sortField, sortOrder, filters }) => {
      const result = await dispatch(
        fetchClients({
          page,
          size,
          search,
          sortBy: sortField,
          sortDir: sortOrder,
          ...filters,
        }),
      ).unwrap();
      // DataTable expects { content, totalElements, totalPages } or a plain array
      return result;
    },
    [dispatch],
  );

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleAddFormChange = (e) => {
    const { name, value } = e.target;
    setAddForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSave = () => {
    dispatch(addClient(addForm));
  };

  const handleDeleteClick = (client) => {
    setSelectedClient(client);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedClient) return;
    dispatch(removeClient(selectedClient.id));
  };

  // ── Columns ───────────────────────────────────────────────────────────────
  const columns = [
    { field: "id", headerName: "ID", icon: <TagIcon fontSize="small" /> },
    {
      field: "clientName",
      headerName: "Client Name",
      icon: <BadgeIcon fontSize="small" />,
    },
    {
      field: "email",
      headerName: "Email",
      icon: <EmailIcon fontSize="small" />,
    },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
      icon: <PhoneIcon fontSize="small" />,
    },
    {
      field: "industry",
      headerName: "Industry",
      icon: <BusinessIcon fontSize="small" />,
    },
    {
      field: "status",
      headerName: "Status",
      icon: <CircleIcon fontSize="small" />,
      renderCell: (row) => (
        <Chip
          label={row.status}
          color={row.status === "ACTIVE" ? "success" : "error"}
          size="small"
          sx={{ fontWeight: 600, minWidth: 72 }}
        />
      ),
    },
    {
      field: "location",
      headerName: "Location",
      icon: <LocationOnIcon fontSize="small" />,
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      filterable: false,
      renderCell: (row) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Tooltip title="View Details">
            <IconButton
              size="small"
              color="default"
              onClick={() => navigate(`${row.id}`)}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              color="primary"
              onClick={() => navigate(`${row.id}/edit`)}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDeleteClick(row)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
      ),
    },
  ];

  const filtersConfig = [
    {
      field: "status",
      label: "Status",
      type: "select",
      options: ["ACTIVE", "INACTIVE"],
    },
    {
      field: "industry",
      label: "Industry",
      type: "select",
      options: [
        "IT",
        "Finance",
        "Healthcare",
        "Retail",
        "Manufacturing",
        "Other",
      ],
    },
    { field: "clientName", label: "Client Name", type: "text" },
  ];

  return (
    <>
      <DataTable
        key={tableRefreshKey}
        title="Clients List"
        headerIcon={<PeopleAltIcon />}
        columns={columns}
        fetchData={fetchData}
        filtersConfig={filtersConfig}
        onAdd={() => {
          setAddForm(EMPTY_FORM);
          setAddOpen(true);
        }}
        enableAdd={true}
      />

      {/* ── Add Dialog ── */}
      <Dialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add New Client"
        maxWidth="md"
        showActions={true}
        onSubmit={handleAddSave}
        submitText="Create Client"
        cancelText="Cancel"
        loading={mutating}
      >
        <FormGenerator
          fields={CLIENT_FORM_FIELDS}
          values={addForm}
          onChange={handleAddFormChange}
          hideSubmit
          showSubmit={false}
        />
      </Dialog>

      {/* ── Delete Confirm Dialog ── */}
      <Dialog
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setSelectedClient(null);
        }}
        title="Confirm Delete"
        maxWidth="xs"
        showActions={false}
      >
        <DialogContentText sx={{ mb: 2 }}>
          Are you sure you want to delete{" "}
          <strong>"{selectedClient?.clientName}"</strong>?
          <br />
          <br />
          This action cannot be undone.
        </DialogContentText>
        <DialogActions sx={{ p: 0, mt: 2 }}>
          <Button
            onClick={() => {
              setDeleteOpen(false);
              setSelectedClient(null);
            }}
            disabled={mutating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={mutating}
          >
            {mutating ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Snackbar ── */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ClientsList;
