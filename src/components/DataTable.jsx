import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Box,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  TableSortLabel,
  TextField,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Stack,
  Typography,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Badge,
  Chip,
  Button,
  Divider,
  alpha,
  Skeleton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import FilterListIcon from "@mui/icons-material/FilterList";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import TuneIcon from "@mui/icons-material/Tune";
import ClearIcon from "@mui/icons-material/Clear";

const DataTable = ({
  columns = [],
  fetchData,
  filtersConfig = [],
  title = "Data Table",
  headerIcon = null,
  searchDebounceMs = 500,
  enableAdd = false,
  onAdd = null,
}) => {
  const [rows, setRows] = useState([]);
  const [totalRows, setTotalRows] = useState(0);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [search, setSearch] = useState("");
  const [searchText, setSearchText] = useState("");

  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const [filters, setFilters] = useState({});
  const [filterAccordionOpen, setFilterAccordionOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Debounce timer ref
  const debounceTimerRef = useRef(null);

  // Count active filters for badge
  const activeFilterCount = Object.values(filters).filter(
    (v) => v !== "" && v !== null && v !== undefined,
  ).length;

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchData({
        page,
        size: rowsPerPage,
        search,
        sortField,
        sortOrder,
        filters,
      });
      setRows(response?.content || []);
      setTotalRows(response?.totalElements || 0);
    } catch (error) {
      console.error("Error loading data:", error);
      setRows([]);
      setTotalRows(0);
    } finally {
      setLoading(false);
    }
  }, [
    page,
    rowsPerPage,
    search,
    sortField,
    sortOrder,
    filters,
    refreshKey,
    fetchData,
  ]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Debounced search effect
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      if (searchText !== search) {
        setSearch(searchText);
        setPage(0);
      }
    }, searchDebounceMs);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchText, searchDebounceMs, search]);

  const handleSort = (field) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setSortField(field);
    setSortOrder(isAsc ? "desc" : "asc");
    setPage(0);
  };

  const handleFilterChange = (field, value) => {
    setPage(0);
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleClearFilters = () => {
    setFilters({});
    setPage(0);
  };

  const handleSearchImmediate = () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    setSearch(searchText);
    setPage(0);
  };

  const handleClearSearch = () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    setSearchText("");
    setSearch("");
    setPage(0);
  };

  const handleRefresh = () => {
    setRefreshKey((k) => k + 1);
  };

  // Render a single filter input based on its type
  const renderFilterInput = (filter) => {
    const value = filters[filter.field] ?? "";

    if (filter.type === "select") {
      return (
        <FormControl key={filter.field} size="small" fullWidth>
          <InputLabel>{filter.label}</InputLabel>
          <Select
            value={value}
            label={filter.label}
            onChange={(e) => handleFilterChange(filter.field, e.target.value)}
            sx={{ borderRadius: 2 }}
          >
            <MenuItem value="">All</MenuItem>
            {(filter.options || []).map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    }

    if (filter.type === "date") {
      return (
        <TextField
          key={filter.field}
          size="small"
          label={filter.label}
          type="date"
          fullWidth
          value={value}
          onChange={(e) => handleFilterChange(filter.field, e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
        />
      );
    }

    return (
      <TextField
        key={filter.field}
        size="small"
        label={filter.label}
        type="text"
        fullWidth
        value={value}
        onChange={(e) => handleFilterChange(filter.field, e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && loadData()}
        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
      />
    );
  };

  // Loading skeleton for table rows
  const LoadingSkeleton = () => (
    <>
      {[...Array(rowsPerPage)].map((_, index) => (
        <TableRow key={`skeleton-${index}`}>
          {columns.map((col, colIndex) => (
            <TableCell key={`skeleton-${index}-${colIndex}`} sx={{ py: 1.5 }}>
              <Skeleton
                variant="text"
                width={colIndex === 0 ? "80%" : "60%"}
                animation="wave"
                sx={{ display: "inline-block" }}
              />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
      }}
    >
      {/* SEARCH + FILTER TOGGLE + REFRESH BUTTON */}
      <Box sx={{ px: 3, py: 2, bgcolor: "background.paper" }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          alignItems="center"
        >
          {/* Search with Debounce */}
          <TextField
            fullWidth
            size="small"
            placeholder="Search..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            helperText={
              searchText !== search && searchText
                ? `Searching after ${searchDebounceMs}ms...`
                : ""
            }
            FormHelperTextProps={{
              sx: { ml: 0, mt: 0.5, fontSize: "0.7rem" },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2.5,
                transition: "box-shadow 0.2s",
                "&:hover": { boxShadow: "0 0 0 3px rgba(25,118,210,0.08)" },
                "&.Mui-focused": {
                  boxShadow: "0 0 0 3px rgba(25,118,210,0.15)",
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <SearchIcon
                  sx={{ mr: 1, color: "text.disabled", fontSize: 20 }}
                />
              ),
              endAdornment: (
                <>
                  {searchText && searchText !== search && (
                    <CircularProgress size={16} sx={{ mr: 0.5 }} />
                  )}
                  {searchText && (
                    <Tooltip title="Clear search">
                      <IconButton
                        size="small"
                        onClick={handleClearSearch}
                        sx={{
                          mr: 0.5,
                          color: "text.secondary",
                          "&:hover": { color: "error.main" },
                        }}
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </>
              ),
            }}
          />

          {/* Manual Search button */}
          <Button
            variant="contained"
            onClick={handleSearchImmediate}
            disableElevation
            sx={{
              borderRadius: 2.5,
              px: 3,
              whiteSpace: "nowrap",
              minWidth: 110,
            }}
          >
            Search
          </Button>

          {/* Refresh Button */}
          <Tooltip title="Refresh data">
            <IconButton
              onClick={handleRefresh}
              disabled={loading}
              sx={{
                color: "primary.main",
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                borderRadius: 2.5,
                "&:hover": {
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.2),
                },
                "&.Mui-disabled": {
                  bgcolor: (theme) => alpha(theme.palette.grey[500], 0.1),
                },
              }}
            >
              <RefreshIcon
                sx={{
                  transition: "transform 0.4s",
                  ...(loading && { animation: "spin 1s linear infinite" }),
                  "@keyframes spin": {
                    from: { transform: "rotate(0deg)" },
                    to: { transform: "rotate(360deg)" },
                  },
                }}
              />
            </IconButton>
          </Tooltip>

          {/* Filter toggle */}
          {filtersConfig.length > 0 && (
            <Tooltip
              title={filterAccordionOpen ? "Hide Filters" : "Show Filters"}
            >
              <Badge badgeContent={activeFilterCount} color="error">
                <Button
                  variant={filterAccordionOpen ? "contained" : "outlined"}
                  disableElevation
                  startIcon={<TuneIcon />}
                  onClick={() => setFilterAccordionOpen((o) => !o)}
                  sx={{
                    borderRadius: 2.5,
                    whiteSpace: "nowrap",
                    minWidth: 120,
                    transition: "all 0.2s",
                  }}
                >
                  Filters
                </Button>
              </Badge>
            </Tooltip>
          )}

          {/* Add Button */}
          {enableAdd && onAdd && (
            <Button
              variant="contained"
              onClick={onAdd}
              disableElevation
              sx={{
                borderRadius: 2.5,
                whiteSpace: "nowrap",
                minWidth: 100,
                bgcolor: "success.main",
                "&:hover": {
                  bgcolor: "success.dark",
                },
              }}
            >
              + Add
            </Button>
          )}
        </Stack>
      </Box>

      {/* FILTER ACCORDION */}
      {filtersConfig.length > 0 && (
        <Accordion
          expanded={filterAccordionOpen}
          onChange={() => setFilterAccordionOpen((o) => !o)}
          disableGutters
          elevation={0}
          sx={{
            "&:before": { display: "none" },
            borderTop: filterAccordionOpen ? "1px solid" : "none",
            borderColor: "divider",
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              px: 3,
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
              minHeight: 44,
              "& .MuiAccordionSummary-content": { my: 0.75 },
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <FilterListIcon fontSize="small" color="primary" />
              <Typography variant="body2" fontWeight={600} color="primary">
                Advanced Filters
              </Typography>
              {activeFilterCount > 0 && (
                <Chip
                  label={`${activeFilterCount} active`}
                  size="small"
                  color="primary"
                  sx={{ height: 20, fontSize: 10, fontWeight: 700 }}
                />
              )}
            </Stack>
          </AccordionSummary>

          <AccordionDetails sx={{ px: 3, py: 2 }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              flexWrap="wrap"
              useFlexGap
            >
              {filtersConfig.map((filter) => (
                <Box
                  key={filter.field}
                  sx={{ minWidth: 180, flex: "1 1 180px" }}
                >
                  {renderFilterInput(filter)}
                </Box>
              ))}
            </Stack>

            {activeFilterCount > 0 && (
              <Box mt={1.5}>
                <Button
                  size="small"
                  variant="text"
                  color="error"
                  startIcon={<ClearAllIcon />}
                  onClick={handleClearFilters}
                  sx={{ borderRadius: 2, textTransform: "none" }}
                >
                  Clear all filters
                </Button>
              </Box>
            )}
          </AccordionDetails>
        </Accordion>
      )}

      <Divider />

      {/* TABLE */}
      <Box sx={{ overflowX: "auto" }}>
        <Table>
          <TableHead>
            <TableRow
              sx={{
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
              }}
            >
              {columns.map((col) => (
                <TableCell
                  key={col.field}
                  sx={{
                    fontWeight: 700,
                    fontSize: 13,
                    color: "text.secondary",
                    letterSpacing: 0.4,
                    textTransform: "uppercase",
                    borderBottom: "2px solid",
                    borderColor: "divider",
                    py: 1.5,
                    whiteSpace: "nowrap",
                  }}
                >
                  <TableSortLabel
                    active={sortField === col.field}
                    direction={sortField === col.field ? sortOrder : "asc"}
                    onClick={() => handleSort(col.field)}
                    sx={{
                      "& .MuiTableSortLabel-icon": { opacity: 0.4 },
                      "&.Mui-active .MuiTableSortLabel-icon": { opacity: 1 },
                    }}
                  >
                    {col.icon && (
                      <Box
                        component="span"
                        sx={{
                          mr: 0.75,
                          display: "inline-flex",
                          verticalAlign: "middle",
                          color:
                            sortField === col.field
                              ? "primary.main"
                              : "text.disabled",
                          transition: "color 0.2s",
                        }}
                      >
                        {col.icon}
                      </Box>
                    )}
                    {col.headerName}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <LoadingSkeleton />
            ) : rows.length > 0 ? (
              rows.map((row, rowIndex) => (
                <TableRow
                  key={row.id ?? rowIndex}
                  hover
                  sx={{
                    transition: "background-color 0.15s",
                    "&:hover": {
                      bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, 0.04),
                    },
                    "&:last-child td": { border: 0 },
                  }}
                >
                  {columns.map((col) => (
                    <TableCell
                      key={col.field}
                      sx={{ py: 1.25, fontSize: 13.5, color: "text.primary" }}
                    >
                      {col.renderCell
                        ? col.renderCell(row)
                        : (row[col.field] ?? "—")}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  align="center"
                  sx={{ py: 8 }}
                >
                  <Stack alignItems="center" spacing={1}>
                    <FilterListIcon
                      sx={{ fontSize: 40, color: "text.disabled" }}
                    />
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      fontWeight={500}
                    >
                      No results found
                    </Typography>
                    <Typography variant="caption" color="text.disabled">
                      Try adjusting your search or filters
                    </Typography>
                  </Stack>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>

      {/* PAGINATION */}
      <Box
        sx={{
          borderTop: "1px solid",
          borderColor: "divider",
          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.03),
        }}
      >
        <TablePagination
          component="div"
          count={totalRows}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25, 50]}
          sx={{
            "& .MuiTablePagination-toolbar": { px: 2 },
            "& .MuiTablePagination-select": { borderRadius: 1.5 },
          }}
        />
      </Box>
    </Paper>
  );
};

export default DataTable;