import React from "react";
import { connect } from "react-redux";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import {
  Dialog,
  DialogContent,
  Typography,
  IconButton,
  Grid,
  TableRow,
  TableCell,
  Tooltip,
  Button,
} from "@material-ui/core";
import { Add } from "@material-ui/icons";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import CloseIcon from "@material-ui/icons/Close";
import Table from "./Table";
import AddBoxIcon from "@material-ui/icons/AddBox";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const RedDialog = (props) => {
  const {
    open = false,
    setOpen,
    red = [],
    page,
    rowsPerPage,
    setForm,
    setVisibleForm,
    setReadOnly,
    setError,
    handleAddRead,
  } = props;

  const classes = useStyles();
  const closeDialog = () => {
    setOpen(false);
  };

  const handleSelect = (
    id,
    documento,
    nombres,
    apellidos,
    telefono,
    id_azules,
    id_amarillos
  ) => {
    setForm({
      id,
      documento,
      nombres,
      apellidos,
      telefono,
      id_azules,
      id_amarillos,
    });
    setVisibleForm(true);
    setReadOnly(true);
    setError([]);
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={closeDialog} fullWidth={true} maxWidth={"md"}>
      <DialogTitle align="center" onClose={closeDialog}>
        Seleccione un rojo:
      </DialogTitle>
      <DialogContent>
        <Grid container className={classes.container} spacing={2}>
          <Button
            color="primary"
            variant="contained"
            className={classes.button}
            startIcon={<Add />}
            onClick={() => handleAddRead()}
          >
            Crear rojo
          </Button>
          <Grid item xs={12} sm={12} className={classes.grid} align="center">
            <Table columns={columns} rows={red} small={true}>
              {red
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow key={`row${index}`}>
                    <TableCell align="center">
                      <Tooltip title="Seleccionar">
                        <IconButton
                          aria-label="edit"
                          onClick={() =>
                            handleSelect(
                              row.id,
                              row.documento,
                              row.nombres,
                              row.apellidos,
                              row.telefono,
                              row.id_azules,
                              row.id_amarillos
                            )
                          }
                        >
                          <AddBoxIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center">{row.documento}</TableCell>
                    <TableCell align="center">{row.nombres}</TableCell>
                    <TableCell align="center">{row.apellidos}</TableCell>
                    <TableCell align="center">{row.telefono}</TableCell>
                  </TableRow>
                ))}
            </Table>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

const columns = [
  { id: "acciones", label: "", align: "center", minWidth: 10 },
  {
    id: "document",
    label: "Documento",
    minWidth: 100,
    align: "center",
  },
  {
    id: "name",
    label: "Nombres",
    minWidth: 100,
    align: "center",
  },
  {
    id: "lastname",
    label: "Apellidos",
    minWidth: 100,
    align: "center",
  },
  {
    id: "tel",
    label: "Teléfono",
    minWidth: 100,
    align: "center",
  },
];

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    border: "2.8px solid #cacaca",
    borderRadius: "10px",
    boxShadow: "4px 5px 4px 2px rgba(0, 0, 0, 0.2)",
    marginBottom: "1rem",
  },
  alert: {
    backgroundColor: theme.palette.primary.light,
  },
  divider: {
    marginTop: "-.5rem",
  },
  grid: {
    paddingRight: ".8em",
    [theme.breakpoints.up("sm")]: {
      paddingRight: "5em",
    },
  },
  button: {
    margin: "0.5em",
    padding: ".5em 1em",
    borderRadius: "10px",
  },
  container__input_root: {
    borderRadius: "10px",
  },
}));

const mapStateToProps = (state) => {
  return {
    page: state.page,
    rowsPerPage: state.rowsPerPage,
  };
};

export default connect(mapStateToProps, null)(RedDialog);
