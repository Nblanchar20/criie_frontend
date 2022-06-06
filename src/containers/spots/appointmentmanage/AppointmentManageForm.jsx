import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { setBreadcrumps } from "../../../actions";
import {
  makeStyles,
  TextField,
  Button,
  Grid,
  Paper,
  Divider,
  FormControl,
  Select,
  Typography,
  useTheme,
  MenuItem,
  InputLabel,
  IconButton,
  Tooltip,
  TableCell,
  TableRow,
  TableBody,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/HighlightOff";
import { decrypt } from "../../../utils/crypt";
import Header from "../../../components/Header";
import Swal from "sweetalert2";
import Backdrop from "../../../components/Backdrop";
import axios from "../../../api";
import Table from "../../../components/Table";

function AppointmentManageForm(props) {
  const { setBreadcrumps, permission, token, rowsPerPage, page, userId } = props;
  const classes = useStyles();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    observacion: "",
    estado: 1,
  });
  const [observaciones, setObservaciones] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    if (permission.includes(2) || permission.includes(3)) {
      if (props.match.params.id) {
        getSpotBooking();
        setBreadcrumps([
          { name: "Espacios" },
          { name: "Gestión de reservas de espacios", route: "/reserves/spots" },
          { name: "Editar" },
        ]);
      } else {
        history.push("/reserves/spots");
        history.location.reload();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getSpotBooking = async () => {
    try {
      const id = decrypt(props.match.params.id);
      const { data } = await axios.get(`/spotBooking/${id}`, {
        headers: { "access-token": token },
      });
      setForm(data.spotBooking);
      setObservaciones(data.spotBooking.observaciones);
    } catch (error) {
      history.push("/reserves/spots");
      window.location.reload();
    }
  };

  const handleInputForm = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleCancel = () => {
    history.push("/reserves/spots");
  };

  const addObservation = () => {
    let obj = {
      detalle: form.observacion,
      fecha: new Date().toISOString(),
      id_usuarios: userId,
    };
    setObservaciones([...observaciones, obj]);
    setForm({
      ...form,
      observacion: "",
    });
  };

  const modalDelete = (index) => {
    Swal.fire({
      text: "¿Está seguro que desea eliminar esta observación?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: theme.palette.primary.main,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.value) {
        sendApprove(index);
      }
    });
  };

  const sendApprove = async (index) => {
    setObservaciones([...observaciones.filter((e, idx) => idx !== index)]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let updateForm = { form, observations: observaciones, userId };
    const id = decrypt(props.match.params.id);

    axios
      .put(
        `/spotBooking/${id}`,
        { ...updateForm },
        {
          headers: { "access-token": token },
        }
      )
      .then((res) => {
        setLoading(false);
        if (res.data.updated) {
          history.push("/reserves/spots");
          Swal.fire({
            icon: "success",
            text: "Editado exitosamente.",
            showConfirmButton: false,
            timer: 3000,
          });
        } else {
          Swal.fire({
            icon: "error",
            text: res.data.updated.message,
            showConfirmButton: false,
            timer: 3000,
          });
        }
      })
      .catch((error) => {
        setLoading(false);
        Swal.fire({
          icon: "error",
          text: "No se ha podido editar.",
          showConfirmButton: false,
          timer: 3000,
        });
      });
  };

  return (
    <Paper elevation={0}>
      <Header search={false} buttonText={"Volver"} buttonRoute={"/users"} />
      <Divider />
      <div className={classes.paper}>
        <div className={classes.container}>
          <Typography component="h1" variant="h5">
            Editar reserva de espacio
          </Typography>
          <Divider />
          <br />
          <form className={classes.root} onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Estado</InputLabel>
                  <Select
                    label="Estado"
                    name="estado"
                    onChange={handleInputForm}
                    value={form?.estado}
                  >
                    <MenuItem value="" disabled>
                      <em>Seleccione una opción</em>
                    </MenuItem>
                    <MenuItem value={1}>Activa</MenuItem>
                    <MenuItem value={2}>Finalizada</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  fullWidth
                  label="Observación"
                  name="observacion"
                  value={form.observacion}
                  variant="outlined"
                  onChange={handleInputForm}
                  InputProps={{
                    classes: {
                      root: classes.container__input_root,
                    },
                  }}
                />
                <Button
                  color="primary"
                  variant="contained"
                  className={classes.button}
                  onClick={addObservation}
                >
                  Añadir observación
                </Button>
              </Grid>
              <Grid item xs={12} sm={12}>
                <Table
                  columns={columns}
                  rows={observaciones}
                  rowsPerPageOptions={[5]}
                >
                  <TableBody>
                    {observaciones
                      ?.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((e, index) => (
                        <TableRow key={`date${e?.id || e.observacion}`}>
                          <TableCell align="center">
                            {new Date(e.fecha).toLocaleString("en-GB")}
                          </TableCell>
                          <TableCell align="center">{e.detalle}</TableCell>
                          <TableCell align="center">
                            <Tooltip title="Borrar observación">
                              <IconButton
                                aria-label="delete"
                                onClick={() => {
                                  modalDelete(index);
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </Grid>
            </Grid>

            <div className={classes.containerButton}>
              <Button
                color="primary"
                variant="contained"
                className={classes.button}
                type="submit"
              >
                Guardar
              </Button>
              <Button
                color="primary"
                variant="contained"
                className={classes.button}
                onClick={handleCancel}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </div>
      <Backdrop loading={loading} />
    </Paper>
  );
}

const columns = [
  {
    id: "date",
    label: "Fecha",
    minWidth: 100,
    align: "center",
  },
  {
    id: "observation",
    label: "Observación",
    minWidth: 10,
    align: "center",
    colSpan: 1,
  },
  {
    id: "actions",
    label: "Eliminar",
    minWidth: 10,
    align: "center",
    colSpan: 1,
  },
];

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: "1em",
  },
  paper: {
    margin: theme.spacing(2, 2),
    paddingBottom: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  container: {
    width: "80%",
  },
  containerButton: {
    marginTop: "1em",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    [theme.breakpoints.up("sm")]: {
      display: "block",
      marginTop: "1em",
      marginBottom: "1em",
    },
  },
  button: {
    margin: "0.5em",
    padding: ".5em 3em",
    borderRadius: "10px",
  },
  container__input_root: {
    borderRadius: "10px",
  },
}));

const mapStateToProps = (state) => {
  return {
    userId: state.user.id,
    token: state.token,
    page: state.page,
    rowsPerPage: state.rowsPerPage,
    permission: (state.permission || [])
      .filter((data) => data.modulosAcciones?.id_modulos === 10)
      .map((item) => item.modulosAcciones?.id_acciones),
  };
};

const mapDispatchToProps = {
  setBreadcrumps,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppointmentManageForm);
