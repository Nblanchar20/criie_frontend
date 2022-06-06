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
} from "@material-ui/core";
import { decrypt } from "../../../utils/crypt";
import Header from "../../../components/Header";
import Backdrop from "../../../components/Backdrop";
import axios from "../../../api";
import { ViewState } from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  WeekView,
  Appointments,
} from "@devexpress/dx-react-scheduler-material-ui";
import { DatePicker } from "@material-ui/pickers";
import {
  DayScaleCell,
  TimeTableCell,
} from "../../../components/scheduler/Components";
import { getDayAvailableHours } from "../../../utils/hours";

function SpotsAppointmentForm(props) {
  const { setBreadcrumps, permission, token } = props;
  const classes = useStyles();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const id = props.match.params.id;
  const [form, setForm] = useState({
    nombre: "",
  });
  const [bookings, setBookings] = useState([]);

  const [reserveDate, setReserveDate] = useState(new Date());
  const [disabledDates, setDisabledDates] = useState([]);


  useEffect(() => {
    if (permission.includes(2) || permission.includes(3)) {
      if (props.match.params.id) {
        getSpot();
        getBookings();
        setBreadcrumps([
          { name: "Espacios" },
          { name: "Reserva de espacios", route: "/reserve/spots" },
          { name: "Crear" },
        ]);
      } else {
        history.push("/reserve/spots");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getSpot = async () => {
    try {
      const id = decrypt(props.match.params.id);
      const { data } = await axios.get(`/spot/${id}`, {
        headers: { "access-token": token },
      });
      setForm(data.spot);
      setDisabledDates(
        data.spot?.diasInactivo?.map((e) =>
          new Date(`${e.fecha} `).toLocaleDateString("en-GB")
        ) || []
      );
    } catch (error) {
      history.push("/reserve/spots");
      window.location.reload();
    }
  };

  const getBookings = async () => {
    try {
      setLoading(true);
      const id = decrypt(props.match.params.id);
      const { data } = await axios.post(
        `/spotBooking/getSpotsBookings`,
        {
          id_espacios: id,
        },
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
        appointments.push({
          startDate: e2.fecha_inicio,
          endDate: e2.fecha_fin,
          title: `Reserva por ${e.solicitante.nombres || ""} ${
            e.solicitante.apellidos || ""
          }`.trim(),
        });
      });
    });
    return appointments;
  };

  return (
    <Paper elevation={0}>
      <Header search={false} buttonText={"Volver"} buttonRoute={"/users"} />
      <Divider />
      <div className={classes.paper}>
        <div className={classes.container}>
          <Typography component="h1" variant="h5">
            Reservar {form?.nombre}
          </Typography>
          <Divider />
          <br />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <DatePicker
                format="DD/MM/yyyy"
                inputVariant="outlined"
                label="Fecha a reservar"
                fullWidth
                minDate={new Date()}
                autoOk
                value={reserveDate}
                onChange={(date) => setReserveDate(date)}
              />
            </Grid>
          </Grid>
          <br />
          <br />

          <Scheduler data={bookings} locale={"es-ES"}>
            <ViewState currentDate={reserveDate} />
            <WeekView
              startDayHour={8}
              endDayHour={18}
              timeTableCellComponent={(props) => {
                let hours = getDayAvailableHours(props.startDate, bookings);
                let appointment = bookings.filter(
                  (e) =>
                    new Date(e.startDate) <= props.startDate &&
                    new Date(e.endDate) >=
                      new Date(props.startDate.getTime() + 30 * 60000)
                );
                return (
                  <TimeTableCell
                    {...props}
                    spotId={id ? decrypt(id) : ""}
                    setLoading={setLoading}
                    disabledDates={disabledDates}
                    availableHours={hours}
                    cellAppointment={appointment}
                    currentBookings={bookings}
                  />
                );
              }}
              dayScaleCellComponent={(props) => {
                return (
                  <DayScaleCell {...props} disabledDates={disabledDates} />
                );
              }}
            />
            <Appointments />
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
    rowsPerPage: state.rowsPerPage,
    permission: (state.permission || [])
      .filter((data) => data.modulosAcciones?.id_modulos === 9)
      .map((item) => item.modulosAcciones?.id_acciones),
  };
};

const mapDispatchToProps = {
  setBreadcrumps,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SpotsAppointmentForm);
