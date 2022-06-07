import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { setBreadcrumps } from "../../../actions";
import {
  makeStyles,
  Paper,
  Divider,
  Typography,
  Grid,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import { encrypt } from "../../../utils/crypt";
import Header from "../../../components/Header";
import Backdrop from "../../../components/Backdrop";
import axios from "../../../api";
import { ViewState } from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  WeekView,
  Appointments,
  AppointmentTooltip,
} from "@devexpress/dx-react-scheduler-material-ui";
import { DatePicker } from "@material-ui/pickers";
import MoreIcon from "@material-ui/icons/MoreVert";
import CancelIcon from "@material-ui/icons/Cancel";
import CheckIcon from "@material-ui/icons/Check";
import Swal from "sweetalert2";

function LudicAppointmentManageList(props) {
  const { setBreadcrumps, permission, token, groupId, userId } = props;
  const classes = useStyles();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [reserveDate, setReserveDate] = useState(new Date());
  const [spots, setSpots] = useState([]);
  const [currentSpot, setCurrentSpot] = useState("");
  const [ludic, setLudic] = useState([]);
  const [currentLudic, setCurrentLudic] = useState("");
  const [existences, setExistences] = useState([]);
  const [currentExistence, setCurrentExistence] = useState("");

  useEffect(() => {
    if (permission.includes(1)) {
      getSpots();
      setBreadcrumps([
        { name: "Recursos lúdicos" },
        { name: "Gestión de reservas de recursos lúdicos" },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentSpot !== null && `${currentSpot}`.trim()) {
      getLudic();
      setCurrentExistence("");
    } else {
      setCurrentLudic("");
      setLudic([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSpot]);

  useEffect(() => {
    if (currentExistence !== null && `${currentExistence}`.trim()) {
      getBookings();
    } else {
      setBookings([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentExistence]);

  useEffect(() => {
    if (currentLudic !== null && `${currentLudic}`.trim()) {
      let existences = ludic.filter((e) => e.id === currentLudic);
      if (existences.length > 0 && existences[0].existencias.length > 0) {
        setCurrentExistence(existences[0]?.existencias[0].id);
        setExistences(existences[0]?.existencias);
      } else {
        setExistences([]);
        setCurrentExistence("");
      }
    } else {
      setExistences([]);
      setCurrentExistence("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLudic]);

  const getSpots = async () => {
    const { data } = await axios.post(
      `/spot/getSpots`,
      {},
      {
        headers: { "access-token": token },
      }
    );
    setCurrentSpot(data?.spots[0].id);
    setSpots(data?.spots);
  };

  const getLudic = async () => {
    const { data } = await axios.post(
      `/ludicResources/getLudicResources`,
      {
        id_espacios: currentSpot,
      },
      {
        headers: { "access-token": token },
      }
    );
    setLudic(data?.ludicResources);

    setCurrentLudic(data?.ludicResources[0]?.id || "");
  };

  const getBookings = async () => {
    try {
      setLoading(true);
      let where = { estado: [1, 2] };
      if (groupId === 3) {
        where.id_usuarios = userId;
      }
      if (currentExistence) {
        where.id_existencia_recurso = currentExistence;
      }
      const { data } = await axios.post(
        `/ludicResourcesBooking/getLudicResourcesBooking`,
        where,
        {
          headers: { "access-token": token },
        }
      );
      setBookings(convertBookingsToAppointments(data.ludicResourcesBookings));
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
      history.push("/reserve/ludic");
      window.location.reload();
    }
  };

  const convertBookingsToAppointments = (bookings) => {
    let appointments = [];
    bookings.forEach((e) => {
      e.bloques.forEach((e2) => {
        let estado = e.estado === 1 ? "Activa" : "Finalizada";
        appointments.push({
          startDate: e2.fecha_inicio,
          endDate: e2.fecha_fin,
          title: `Reserva por ${e.solicitante.nombres || ""} ${
            e.solicitante.apellidos || ""
          }, recurso ${e.existencia.recurso.nombre}, estado: ${estado}`.trim(),
          id: e.id,
          firstDate: e.bloques[0].fecha_inicio,
          estado: e.estado,
          id_usuario_recibe: e.id_usuario_recibe,
          id_usuario: e.id_usuarios,
        });
      });
    });
    return appointments;
  };

  const modalDelete = (id) => {
    Swal.fire({
      text: "¿Está seguro que desea cancelar esta reserva?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.value) {
        sendApprove(id);
      }
    });
  };

  const sendApprove = async (id) => {
    setLoading(true);
    axios
      .delete(`/ludicResourcesBooking/${id}`, {
        headers: { "access-token": token },
      })
      .then((res) => {
        setLoading(false);
        if (res.data.deleted) {
          Swal.fire({
            icon: "success",
            text: "Cancelada exitosamente.",
            showConfirmButton: false,
            timer: 3000,
          });
          getBookings();
        } else {
          Swal.fire({
            icon: "error",
            text: "Error al cancelar la reserva",
            showConfirmButton: false,
            timer: 3000,
          });
        }
      })
      .catch((error) => {
        setLoading(false);
        Swal.fire({
          icon: "error",
          text: "No se ha podido cancelar.",
          showConfirmButton: false,
          timer: 3000,
        });
      });
  };

  const modalAssign = (id) => {
    Swal.fire({
      text: "¿Está seguro de recibir esta reserva?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.value) {
        sendAssign(id);
      }
    });
  };

  const sendAssign = async (id) => {
    setLoading(true);
    axios
      .put(
        `/ludicResourcesBooking/${id}`,
        {
          form: { id_usuario_recibe: userId },
        },
        {
          headers: { "access-token": token },
        }
      )
      .then((res) => {
        setLoading(false);
        if (res.data.updated) {
          Swal.fire({
            icon: "success",
            text: "Recibida exitosamente.",
            showConfirmButton: false,
            timer: 3000,
          });
          getBookings();
        } else {
          Swal.fire({
            icon: "error",
            text: "Error al recibir la reserva",
            showConfirmButton: false,
            timer: 3000,
          });
        }
      })
      .catch((error) => {
        setLoading(false);
        Swal.fire({
          icon: "error",
          text: "No se ha podido recibir.",
          showConfirmButton: false,
          timer: 3000,
        });
      });
  };

  const CustomHeader = ({ children, appointmentData, ...restProps }) => (
    <AppointmentTooltip.Header {...restProps} appointmentData={appointmentData}>
      {permission.includes(3) && (
        <>
          {appointmentData.id_usuario_recibe !== null ? (
            <Tooltip title="Editar reserva">
              <IconButton
                onClick={() => {
                  if (appointmentData.id_usuario_recibe === userId) {
                    history.push(
                      `/reserves/ludic/${encrypt(appointmentData.id)}`
                    );
                  }
                }}
                className={classes.commandButton}
                size="large"
              >
                <MoreIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Recibir reserva">
              <IconButton
                onClick={() => {
                  modalAssign(appointmentData.id);
                  restProps.onHide();
                }}
                className={classes.commandButton}
                size="large"
              >
                <CheckIcon />
              </IconButton>
            </Tooltip>
          )}
        </>
      )}
      {appointmentData.estado === 1 &&
        (appointmentData.id_usuarios === userId ||
          [1, 2].includes(groupId)) && (
          <Tooltip title="Cancelar reserva">
            <IconButton
              onClick={() => {
                if (new Date(appointmentData.firstDate) > new Date()) {
                  modalDelete(appointmentData.id);
                  restProps.onHide();
                } else {
                  Swal.fire({
                    icon: "warning",
                    text: "La reserva ya no puede ser cancelada debido a que ya se cumplió su tiempo.",
                  });
                }
              }}
              className={classes.commandButton}
              size="large"
            >
              <CancelIcon />
            </IconButton>
          </Tooltip>
        )}
    </AppointmentTooltip.Header>
  );

  return (
    <Paper elevation={0}>
      <Header search={false} buttonText={"Volver"} buttonRoute={"/users"} />
      <Divider />
      <div className={classes.paper}>
        <div className={classes.container}>
          <Typography component="h1" variant="h5">
            Calendario de reservas
          </Typography>
          <Divider />
          <br />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <DatePicker
                format="DD/MM/yyyy"
                inputVariant="outlined"
                label="Fecha a revisar"
                fullWidth
                autoOk
                value={reserveDate}
                onChange={(date) => setReserveDate(date)}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="spotLabel">Espacio</InputLabel>
                <Select
                  labelId="spotLabel"
                  label="Espacio"
                  value={currentSpot}
                  name="id_espacios"
                  onChange={(e) => {
                    setCurrentSpot(e.target.value);
                  }}
                >
                  <MenuItem value="">
                    <em>Seleccione una opción</em>
                  </MenuItem>
                  {spots
                    .sort((a, b) => (a.nombre > b.nombre ? 1 : -1))
                    .map((e) => (
                      <MenuItem key={e.id} value={e.id}>
                        {e.nombre}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="ludicLabel">Recurso lúdico</InputLabel>
                <Select
                  labelId="ludicLabel"
                  label="Recurso lúdico"
                  value={currentLudic}
                  name="id_recursos_ludicos"
                  onChange={(e) => {
                    setCurrentLudic(e.target.value);
                  }}
                >
                  <MenuItem value="">
                    <em>Seleccione una opción</em>
                  </MenuItem>
                  {ludic
                    .sort((a, b) => (a.nombre > b.nombre ? 1 : -1))
                    .map((e) => (
                      <MenuItem key={e.id} value={e.id}>
                        {e.nombre}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="existenceLabel">Existencia</InputLabel>
                <Select
                  labelId="existenceLabel"
                  label="Existencia"
                  value={currentExistence}
                  name="id_existencia"
                  onChange={(e) => {
                    setCurrentExistence(e.target.value);
                  }}
                >
                  <MenuItem value="">
                    <em>Seleccione una opción</em>
                  </MenuItem>
                  {existences
                    .sort((a, b) =>
                      a.codigo_barras > b.codigo_barras ? 1 : -1
                    )
                    .map((e) => (
                      <MenuItem key={e.id} value={e.id}>
                        {e.codigo_barras}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <br />
          <br />

          <Scheduler data={bookings} locale={"es-ES"}>
            <ViewState currentDate={reserveDate} />
            <WeekView startDayHour={8} endDayHour={18} />
            <Appointments />
            <AppointmentTooltip
              showCloseButton
              headerComponent={CustomHeader}
            />
          </Scheduler>
        </div>
      </div>
      <Backdrop loading={loading} />
    </Paper>
  );
}

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
    groupId: state.user.grupoUsuarios.id,
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
)(LudicAppointmentManageList);
