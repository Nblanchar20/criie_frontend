import React, { useState, useEffect } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import {
  Dialog,
  DialogContent,
  Typography,
  IconButton,
  Grid,
  Button,
  FormControl,
  Select,
  MenuItem,
  Checkbox,
} from "@material-ui/core";
import moment from "moment";
import { useHistory } from "react-router-dom";
import { Clear, Save } from "@material-ui/icons";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import CloseIcon from "@material-ui/icons/Close";
import Swal from "sweetalert2";
import { getDayHours } from "../utils/hours";
import { DatePicker } from "@material-ui/pickers";
import axios from "../api";
import { connect } from "react-redux";
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

const ScheduleDialogLudic = (props) => {
  const {
    open = false,
    setOpen,
    startHour,
    availableHours,
    currentBookings,
    token,
    setLoading,
    userId,
    ludicResourceExistenceId,
  } = props;
  const history = useHistory();
  const classes = useStyles();
  const [form, setForm] = useState({
    startHour: startHour.toLocaleTimeString("en-GB", {
      minute: "numeric",
      hour: "numeric",
    }),
    endHour: new Date(startHour.getTime() + 30 * 60000).toLocaleTimeString(
      "en-GB",
      {
        minute: "numeric",
        hour: "numeric",
      }
    ),
    day: startHour.toLocaleDateString("en-GB"),
    date: moment(startHour).format().split("T")[0],
    repeat: false,
    repeatKind: "",
    endDate: null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    Swal.fire({
      icon: "info",
      text: "¿Está seguro de querer realizar una reserva a las horas marcadas (Si eligió la opción repetir, esta no aplicará a los fines de semana)?",
      showConfirmButton: true,
      showCancelButton: true,
    }).then((res) => {
      if (res.value) {
        if (form.repeat) {
          if (form.endDate === null || !form.repeatKind.trim()) {
            setLoading(false);
            Swal.fire({
              icon: "error",
              text: "Debe llenar una fecha fin y una frecuencia para poder realizar una reserva que se repita",
            });
          } else {
            setLoading(true);
            axios
              .post(
                `/ludicResourcesBooking/`,
                {
                  ...form,
                  id_usuarios: userId,
                  id_existencia_recurso: ludicResourceExistenceId,
                },
                {
                  headers: {
                    "access-token": token,
                  },
                }
              )
              .then((res) => {
                setLoading(false);
                if (res.data.created.success) {
                  Swal.fire({
                    icon: "success",
                    text: "Reserva creada correctamente.",
                  }).then((e) => {
                    history.push("/reserves/ludic");
                  });
                } else {
                  Swal.fire({
                    icon: "error",
                    text: res.data.created.message,
                  }).then();
                }
              });
          }
        } else {
          setLoading(true);
          axios
            .post(
              `/ludicResourcesBooking/`,
              {
                ...form,
                id_usuarios: userId,
                id_existencia_recurso: ludicResourceExistenceId,
              },
              {
                headers: {
                  "access-token": token,
                },
              }
            )
            .then((res) => {
              setLoading(false);
              if (res.data.created.success) {
                history.push("/reserves/ludic");
                Swal.fire({
                  icon: "success",
                  text: "Reserva creada correctamente.",
                });
              } else {
                Swal.fire({
                  icon: "error",
                  text: res.data.created.message,
                });
              }
            });
        }
      }
    });
  };

  const [dayHours, setDayHours] = useState([]);

  const checkForDate = (e, date) => {
    return (
      new Date(e.startDate) <= date &&
      new Date(e.endDate) >= new Date(date.getTime() + 30 * 60000)
    );
  };
  const checkForHours = () => {
    const _dayHours = getDayHours(
      startHour.getHours(),
      17,
      startHour.getMinutes()
    );
    const offset = startHour.getTimezoneOffset();
    let date = new Date(startHour.getTime() - offset * 60 * 1000);
    date = date.toISOString().split("T")[0];
    let hours = [];
    _dayHours.every((e) => {
      if (
        currentBookings.filter((e2) =>
          checkForDate(e2, new Date(`${date} ${e}`))
        ).length === 0
      ) {
        hours.push(e);
        return true;
      } else {
        hours.push(e);
        return false;
      }
    });

    setDayHours(hours);
  };
  useEffect(() => {
    checkForHours(availableHours);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const closeDialog = () => {
    setOpen(false);
    setForm({
      startHour: startHour.toLocaleTimeString("en-GB", {
        minute: "numeric",
        hour: "numeric",
      }),
      day: startHour.toLocaleDateString("en-GB"),
      endHour: new Date(startHour.getTime() + 30 * 60000).toLocaleTimeString(
        "en-GB",
        {
          minute: "numeric",
          hour: "numeric",
        }
      ),
      repeat: false,
      repeatKind: "",
      endDate: null,
    });
  };

  const handleInput = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };
  function disableWeekends(date) {
    return date._d.getDay() === 0 || date._d.getDay() === 6;
  }

  return (
    <Dialog open={open} onClose={closeDialog} fullWidth={true} maxWidth={"xs"}>
      <DialogTitle align="center" onClose={closeDialog}>
        Agregar reserva:
      </DialogTitle>
      <DialogContent>
        <div className={classes.paper}>
          <div className={classes.container}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
                  Fecha: {form.day}
                </Grid>
                <Grid item xs={12} sm={12}>
                  Hora inicio: {form?.startHour}
                </Grid>
                <Grid item xs={12} sm={12}>
                  Hora fin:
                  <FormControl style={{ marginLeft: ".5em" }}>
                    <Select
                      value={form.endHour}
                      name="endHour"
                      onChange={(e) => {
                        handleInput(e);
                      }}
                    >
                      {dayHours?.map((e) => {
                        return (
                          <MenuItem key={e} value={e}>
                            {e}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={12}>
                  Repetir:
                  <Checkbox
                    checked={form.repeat}
                    name="repeat"
                    onChange={(e) => {
                      setForm({ ...form, [e.target.name]: e.target.checked });
                    }}
                  />
                </Grid>
                {form.repeat && (
                  <>
                    <Grid item xs={12} sm={12}>
                      Frecuencia:
                      <FormControl style={{ marginLeft: ".5em" }}>
                        <Select
                          value={form.repeatKind}
                          name="repeatKind"
                          onChange={(e) => {
                            handleInput(e);
                          }}
                        >
                          <MenuItem value="">
                            <em>Seleccione una opción</em>
                          </MenuItem>
                          <MenuItem value="daily">Diaria</MenuItem>
                          <MenuItem value="weekly">Semanal</MenuItem>
                          <MenuItem value="monthly">Mensual</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      Hasta:{" "}
                      <DatePicker
                        onChange={(date) => setForm({ ...form, endDate: date })}
                        format="DD/MM/yyyy"
                        inputVariant="outlined"
                        label="Fecha fin"
                        fullWidth
                        minDate={form.date}
                        autoOk
                        value={form.endDate}
                        daysOf
                        shouldDisableDate={disableWeekends}
                      />
                    </Grid>
                  </>
                )}
              </Grid>
              <div className={classes.containerButton}>
                <Button
                  color="primary"
                  variant="contained"
                  startIcon={<Save />}
                  className={classes.button}
                  type="submit"
                >
                  Reservar
                </Button>
                <Button
                  color="primary"
                  variant="contained"
                  startIcon={<Clear />}
                  className={classes.button}
                  onClick={closeDialog}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const useStyles = makeStyles((theme) => ({
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
    },
  },
  button: {
    margin: "0.5em",
    padding: ".5em 3em",
    borderRadius: "10px",
  },
  container__input_root: {
    borderRadius: "10px",
    "&.Mui-disabled": {
      backgroundColor: "#F5F5F5",
    },
  },
}));

const mapStateToProps = (state) => {
  return {
    userId: state.user.id,
    token: state.token,
  };
};

export default connect(mapStateToProps, null)(ScheduleDialogLudic);
