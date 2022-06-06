import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import DeleteIcon from "@material-ui/icons/HighlightOff";
import { setBreadcrumps } from "../../../actions";
import {
  makeStyles,
  Button,
  Grid,
  Paper,
  Divider,
  Typography,
  TableBody,
  TableCell,
  TableRow,
  Tooltip,
  IconButton,
  useTheme,
} from "@material-ui/core";
import { decrypt } from "../../../utils/crypt";
import Header from "../../../components/Header";
import Swal from "sweetalert2";
import Backdrop from "../../../components/Backdrop";
import axios from "../../../api";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRange } from "react-date-range";
import * as locales from "react-date-range/dist/locale";
import Table from "../../../components/Table";

function LudicExistenceManageForm(props) {
  const disableWeekends = (current) => {
    let _dates = dates?.map((e) => e.fecha.getTime());
    return (
      current.getDay() === 0 ||
      current.getDay() === 6 ||
      _dates?.includes(current.getTime())
    );
  };
  const { setBreadcrumps, permission, token, page, rowsPerPage } = props;
  const classes = useStyles();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
  });
  const theme = useTheme();
  const [dates, setDates] = useState([]);
  const [currentDates, setCurrentDates] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  function getDates(startDate, stopDate) {
    var dateArray = [];
    var currentDate = new Date(startDate.valueOf());
    while (currentDate <= stopDate) {
      if (!disableWeekends(new Date(currentDate.valueOf()))) {
        dateArray.push(new Date(currentDate.valueOf()));
      }
      currentDate = new Date(currentDate);
      currentDate = currentDate.setDate(currentDate.getDate() + 1);
    }
    return dateArray;
  }

  useEffect(() => {
    if (permission.includes(2) || permission.includes(3)) {
      if (props.match.params.id) {
        getResourceExistence();
        setBreadcrumps([
          { name: "Recursos Lúdicos" },
          { name: "Gestión de recursos lúdicos", route: "/ludic" },
          { name: "Editar existencia de recurso" },
        ]);
      } else {
        history.push("/ludic");
        window.location.reload();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getResourceExistence = async () => {
    try {
      const id = decrypt(props.match.params.id);
      const { data } = await axios.post(
        `/ludicResources/getExistence/${id}`,
        {},
        {
          headers: { "access-token": token },
        }
      );
      setForm(data.existence);
      setDates(
        data.existence?.diasInactivo?.map((e) => ({
          ...e,
          fecha: new Date(`${e.fecha} `),
        })) || []
      );
    } catch (error) {
      //history.push("/ludic");
      //window.location.reload();
    }
  };

  const addDays = async () => {
    let _dates = getDates(currentDates[0].startDate, currentDates[0].endDate);
    let currDates = dates?.map((e) => e.fecha.getTime());
    if (currDates) {
      _dates = _dates
        ?.filter((e) => !currDates.includes(e.getTime()))
        .map((e) => ({ fecha: e }));
    }
    let newDates = [...dates];
    newDates.push(..._dates);
    setDates(newDates);
  };
  const handleCancel = () => {
    history.push("/ludic");
  };

  const modalDelete = (date) => {
    Swal.fire({
      text: "¿Está seguro que desea eliminar esta fecha?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: theme.palette.primary.main,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.value) {
        sendApprove(date);
      }
    });
  };

  const sendApprove = async (date) => {
    setDates(dates.filter((e) => e.fecha.getTime() !== date));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let updateForm = { ...form };
    const id = decrypt(props.match.params.id);

    axios
      .post(
        `/ludicResources/updateExistence/${id}`,
        { ...updateForm, dias_inactivos: dates },
        {
          headers: { "access-token": token },
        }
      )
      .then((res) => {
        setLoading(false);
        if (res.data.updated) {
          history.push("/ludic");
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
            {props.match.params.id ? "Editar" : "Crear"} existencia recurso
            lúdico {form.codigo_barras || ""}
          </Typography>
          <Divider />
          <br />
          <form className={classes.root} onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <Typography>Días no disponible</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <DateRange
                  onChange={(item) => setCurrentDates([item.selection])}
                  moveRangeOnFirstSelection={false}
                  months={1}
                  locale={locales.es}
                  minDate={new Date()}
                  direction="vertical"
                  disabledDay={disableWeekends}
                  ranges={currentDates}
                  scroll={{ enabled: true }}
                />
                <Button
                  color="primary"
                  variant="contained"
                  className={classes.button}
                  onClick={addDays}
                >
                  Añadir días
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Table columns={columns} rows={dates} rowsPerPageOptions={[5]}>
                  <TableBody>
                    {dates
                      ?.sort((a, b) =>
                        a.fecha?.getTime() < b.fecha?.getTime() ? -1 : 1
                      )
                      ?.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((e) => (
                        <TableRow key={`date${e.fecha.getTime()}`}>
                          <TableCell align="center">
                            {e.fecha?.toLocaleString("en-GB").split(",")[0]}
                          </TableCell>
                          <TableCell align="center">
                            <Tooltip title="Borrar fecha inactividad">
                              <IconButton
                                aria-label="delete"
                                onClick={() => {
                                  modalDelete(e.fecha.getTime());
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
)(LudicExistenceManageForm);
