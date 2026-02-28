/* eslint-disable no-unused-vars */
/* eslint-disable require-jsdoc */
/* eslint-disable object-curly-spacing */
import React, { useMemo } from "react";
import { connect } from "react-redux";
import { getAllMentees } from "../../store/allMentees";

import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { visuallyHidden } from "@mui/utils";
import CircularProgress from "@mui/material/CircularProgress";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";

function MenteeTable({ menteeData: mentees, menteesLoading, allMenteesError }) {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("firstName");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [statusFilter, setStatusFilter] = React.useState("");

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.name);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    window.location.href = `/applications/${id}`;
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const filteredMentees = useMemo(() => {
    if (!Array.isArray(mentees)) return [];
    if (statusFilter === "") return mentees;
    return mentees.filter((m) => m.acceptedStatus === statusFilter);
  }, [mentees, statusFilter]);

  const sortedMentees = useMemo(
    () => filteredMentees.slice().sort(getComparator(order, orderBy)),
    [filteredMentees, order, orderBy],
  );

  const visibleRows = useMemo(
    () =>
      menteesLoading || allMenteesError
        ? []
        : sortedMentees.slice(
            page * rowsPerPage,
            page * rowsPerPage + rowsPerPage,
          ),
    [sortedMentees, page, rowsPerPage, menteesLoading, allMenteesError],
  );

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - sortedMentees.length) : 0;

  React.useEffect(() => setPage(0), [statusFilter]);

  const maxPage = Math.max(
    0,
    Math.ceil(sortedMentees.length / rowsPerPage) - 1,
  );
  React.useEffect(() => {
    if (page > maxPage) setPage(maxPage);
  }, [maxPage, page]);

  return (
    <Box sx={{ width: "90%" }}>
      <Paper sx={{ width: "100%", mb: 2, boxShadow: "none" }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
        <TableContainer sx={{ width: "100%" }}>
          <Table
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
            sx={{ width: "100%" }}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={sortedMentees.length}
            />
            <TableBody>
              {menteesLoading || allMenteesError ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Box
                      style={{ width: "100%", height: "20vh", display: "grid" }}
                    >
                      <CircularProgress
                        style={{ justifySelf: "center", alignSelf: "center" }}
                      />
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {visibleRows.map((row, index) => {
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, row.id)}
                        tabIndex={-1}
                        key={row.id}
                        sx={{ cursor: "pointer" }}
                      >
                        <TableCell component="th" id={labelId} scope="row">
                          {row.firstName}
                        </TableCell>
                        <TableCell align="left">{row.lastName}</TableCell>
                        <TableCell align="left">{row.email}</TableCell>
                        <TableCell align="left">
                          {row.cohort?.cohortId ?? "—"}
                        </TableCell>
                        <TableCell align="left">{row.acceptedStatus}</TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow
                      style={{
                        height: (dense ? 33 : 53) * emptyRows,
                      }}
                    >
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={sortedMentees.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </Box>
  );
}
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const headCells = [
  {
    id: "firstName",
    numeric: false,
    disablePadding: false,
    label: "FIRST NAME",
  },
  {
    id: "lastName",
    numeric: false,
    disablePadding: false,
    label: "LAST NAME",
  },
  {
    id: "email",
    numeric: false,
    disablePadding: false,
    label: "EMAIL",
  },
  {
    id: "cohort",
    numeric: false,
    disablePadding: false,
    label: "COHORT",
  },
  {
    id: "acceptedStatus",
    numeric: false,
    disablePadding: false,
    label: "STATUS",
  },
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    statusFilter,
    setStatusFilter,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
  statusFilter: PropTypes.string.isRequired,
  setStatusFilter: PropTypes.func.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected, setStatusFilter, statusFilter } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity,
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
          <Typography
            sx={{ flex: "1 1 100%" }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            MENTEE APPLICATIONS
          </Typography>
          <FormControl size="small" sx={{ minWidth: 200, ml: "auto" }}>
            <InputLabel id="demo-simple-select-label" sx={{ pr: 4 }}>
              Filter by status
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              size="small"
              value={statusFilter ?? ""}
              label="Filter by status"
              onChange={(event) => {
                setStatusFilter(event.target.value);
              }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="PENDING">PENDING</MenuItem>
              <MenuItem value="ACCEPTED">ACCEPTED</MenuItem>
              <MenuItem value="NOT ACCEPTED">NOT ACCEPTED</MenuItem>
              <MenuItem value="STRONG ACCEPT">STRONG ACCEPT</MenuItem>
              <MenuItem value="LOW PRIORITY ACCEPT">
                LOW PRIORITY ACCEPT
              </MenuItem>
              <MenuItem value="WAITLIST">WAITLIST</MenuItem>
            </Select>
          </FormControl>
        </Box>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  setStatusFilter: PropTypes.func.isRequired,
  statusFilter: PropTypes.string.isRequired,
};

const mapDispatch = {
  getAllMentees,
};

export default connect(null, mapDispatch)(MenteeTable);
