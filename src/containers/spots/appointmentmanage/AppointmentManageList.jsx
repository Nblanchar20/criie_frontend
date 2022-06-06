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

function AppointmentManageList(props) {
  const { setBreadcrumps, permission, token, groupId, userId } = props;
  const classes = useStyles();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [reserveDate, setReserveDate] = useState(new Date());
  const [spots, setSpots] = useState([]);
  const [currentSpot, setCurrentSpot] = useState("");

  useEffect(() => {
    if (permission.includes(1)) {
      getSpots();
      setBreadcrumps([
        { name: "Espacios" },
        { name: "Gestión de reservas de espacio" },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentSpot !== null && `${currentSpot}`.trim()) {
      getBookings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSpot]);

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

  const getBookings = async () => {
    try {
      setLoading(true);
      let where = { estado: [1, 2] };
      if (groupId === 3) {
        where.id_usuarios = userId;
      }
      if (currentSpot) {
        where.id_espacios = currentSpot;
      }
      const { data } = await axios.post(
        `/spotBooking/getSpotsBookings`,
        where,
        {
          headers: { "access-token": token },
        }
      );
      setBookings(convertBookingsToAppointments(data.spotBookings));
      setLoading(false);
    } catch (error) {
      setLoading(false);
      history.push("/reserve/spots");
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
          }, espacio ${e.espacio.nombre}, estado: ${estado}`.trim(),
          id: e.id,
          firstDate: e.bloques[0].fecha_inicio,
          estado: e.estado,
          id_usuario_recibe: e.id_usuario_recibe,
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
      .delete(`/spotBooking/${id}`, {
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
        `/spotBooking/${id}`,
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
                  if (permission.includes(3)) {
                    history.push(
                      `/reserves/spots/${encrypt(appointmentData.id)}`
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
                  if (permission.includes(3)) {
                    modalAssign(appointmentData.id);
                    restProps.onHide();
                  }
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
      {appointmentData.estado === 1 && (
        <Tooltip title="Cancelar reserva">
          <IconButton
            onClick={() => {
              if (groupId === 3) {
                if (new Date(appointmentData.firstDate) > new Date()) {
                  modalDelete(appointmentData.id);
                  restProps.onHide();
                } else {
                  Swal.fire({
                    icon: "warning",
                    text: "La reserva ya no puede ser cancelada debido a que ya se cumplió su tiempo.",
                  });
                }
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
                minDate={new Date()}
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
          </Grid>
          <br />
          <br />

          <Scheduler data={bookings} locale={"es-ES"}>
            <ViewState currentDate={reserveDate} />
            <WeekView
              startDayHour={8}
              endDayHour={18}
            />
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
)(AppointmentManageList);
