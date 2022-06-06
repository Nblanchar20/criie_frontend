import React, { useEffect } from "react";
import { connect } from "react-redux";
import {
  makeStyles,
  withStyles,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TablePagination,
  TableCell,
  TableRow,
} from "@material-ui/core";
import { setPage, setRowsPerPage } from "../actions";

const StyledTableCell = withStyles(() => ({
  head: {
    fontWeight: "bold",
    fontSize: 16,
  },
}))(TableCell);

const useStyles = makeStyles({
  table: {
    minWidth: "auto",
  },
  adjustWidth: {
    maxWidth: "100%",
  },
});

const BasicTable = (props) => {
  const { rows, columns, children, page, rowsPerPage, small = false, rowsPerPageOptions=[10, 25, 100] } = props;
  const classes = useStyles();

  useEffect((e) => {
    if (rowsPerPageOptions.length > 0) {
      setRowsPerPage(rowsPerPageOptions[0])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handlesetPage = (event, newPage) => {
    props.setPage(newPage);
  };

  const handlesetRowsPerPage = (event) => {
    props.setRowsPerPage(+event.target.value);
    props.setPage(0);
  };

  return (
    <Paper className={classes.adjustWidth}>
      <TableContainer component={Paper}>
        <Table
          className={classes.table}
          aria-label="simple table"
          size={small && "small"}
        >
          <TableHead>
            <TableRow>
              {columns?.map((column) => (
                <StyledTableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth, width: column.width }}
                  colSpan={column.colSpan}
                >
                  {column.label}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          {children}
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={rowsPerPageOptions}
        component="div"
        count={rows ? rows?.length : 1}
        rowsPerPage={rowsPerPage}
        page={page}
        labelRowsPerPage="Filas por página"
        onChangePage={handlesetPage}
        onChangeRowsPerPage={handlesetRowsPerPage}
      />
    </Paper>
  );
};

const mapStateToProps = (state) => {
  return {
    page: state.page,
    rowsPerPage: state.rowsPerPage,
  };
};

const mapDispatchToProps = {
  setPage,
  setRowsPerPage,
};

export default connect(mapStateToProps, mapDispatchToProps)(BasicTable);
