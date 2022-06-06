import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  makeStyles,
  Grid,
  FormControl,
  TextField,
  Paper,
  Typography,
  MenuItem,
  Select,
  Button,
} from "@material-ui/core";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import axios from "../api";
import { setPage } from "../actions";
import moment from "moment";
import MomentUtils from "@date-io/moment";
import "moment/locale/es";
moment.locale("es");

const Filter = (props) => {
  const { setItems, setPage, token, setLoading, setToExport } = props;
  const classes = useStyles();
  const [parameters, setParameters] = useState([]);
  const [parametersIdentidad, setParametersIdentidad] = useState([]);
  const [yellow, setYellow] = useState([]);
  const [blue, setBlue] = useState([]);
  const [red, setRed] = useState([]);
  const [filtro, setFiltro] = useState({
    cedula_amarillo: "",
    cedula_azul: "",
    cedula_rojo: "",
    nombre_amarillo: "",
    nombre_azul: "",
    nombre_rojo: "",
    cedula_blanco: "",
    novedad_identidad: "",
    novedad_puesto: "",
    nombre_blanco: "",
  });
  const [fecha_inicial, setFecha_inicial] = useState(null);
  const [fecha_final, setFecha_final] = useState(null);

  useEffect(() => {
    getParameters();
    getParametersIdentidad();
    getYellow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getBlue(filtro.nombre_amarillo);
    setFiltro({ ...filtro, nombre_azul: "", nombre_rojo: "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtro.nombre_amarillo]);

  useEffect(() => {
    getRed(filtro.nombre_azul);
    setFiltro({ ...filtro, nombre_rojo: "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtro.nombre_azul]);

  const getParameters = async () => {
    const { data } = await axios.post(
      `/parameter/getParameters`,
      { id: 2 },
      {
        headers: { "access-token": token },
      }
    );
    setParameters(
      data?.parameters[0]?.valoresParametros?.sort((a, b) =>
        a.orden < b.orden ? -1 : 1
      )
    );
  };

  const getParametersIdentidad = async () => {
    const { data } = await axios.post(
      `/parameter/getParameters`,
      { id: 3 },
      {
        headers: { "access-token": token },
      }
    );
    setParametersIdentidad(
      data?.parameters[0]?.valoresParametros?.sort((a, b) =>
        a.orden < b.orden ? -1 : 1
      )
    );
  };

  const getYellow = async () => {
    const { data } = await axios.post(
      `/yellow/getYellows`,
      {},
      {
        headers: { "access-token": token },
      }
    );
    setYellow(
      data.yellow?.sort((a, b) =>
        `${a.nombres} ${a.apellidos}` < `${b.nombres} ${b.apellidos}` ? -1 : 1
      )
    );
  };

  const getBlue = async (id_amarillos) => {
    const { data } = await axios.post(
      `/blue/getBlues`,
      { id_amarillos },
      {
        headers: { "access-token": token },
      }
    );
    setBlue(
      data.blue?.sort((a, b) =>
        `${a.nombres} ${a.apellidos}` < `${b.nombres} ${b.apellidos}` ? -1 : 1
      )
    );
  };

  const getRed = async (id_azules) => {
    const { data } = await axios.post(
      `/red/getReds`,
      { id_azules },
      {
        headers: { "access-token": token },
      }
    );
    setRed(
      data.red?.sort((a, b) =>
        `${a.nombres} ${a.apellidos}` < `${b.nombres} ${b.apellidos}` ? -1 : 1
      )
    );
  };

  const handleChange = (e) => {
    if (
      e.target.name !== "novedad_puesto" &&
      e.target.name !== "novedad_identidad" &&
      e.target.name !== "nombre_amarillo" &&
      e.target.name !== "nombre_azul" &&
      e.target.name !== "nombre_rojo"
    ) {
      setFiltro({
        ...filtro,
        [e.target.name]: e.target.value.toUpperCase(),
      });
    } else {
      setFiltro({
        ...filtro,
        [e.target.name]: e.target.value,
      });
    }
  };

  const getWhites = async () => {
    setLoading(true);
    const { data } = await axios.post(`/white/filter`, filtro, {
      headers: { "access-token": token },
    });

    const arrayDate = [];
    if (fecha_inicial !== null || fecha_final !== null) {
      const initialDate = fecha_inicial
        ? `${moment(fecha_inicial).format("YYYY-MM-DD")} 00:00:00`
        : "2022-01-01 00:00:00";

      const finalDate = `${moment(fecha_final || new Date()).format(
        "YYYY-MM-DD"
      )} 23:59:59`;
      // eslint-disable-next-line array-callback-return
      data?.white?.map((item) => {
        const dateItem = `${moment(item.fecha_digitacion).format(
          "YYYY-MM-DD HH:mm:ss"
        )}`;
        new Date(dateItem) >= new Date(initialDate) &&
          new Date(dateItem) <= new Date(finalDate) &&
          arrayDate.push(item);
      });
      const ordered = arrayDate?.sort((a, b) =>
        a.fecha_digitacion > b.fecha_digitacion ? -1 : 1
      );

      let hash = {};
      const filtered = ordered?.filter((item) =>
        hash[item.documento] ? false : (hash[item.documento] = true)
      );
      setToExport(ordered);
      setItems(filtered);
    } else {
      const ordered = data.white?.sort((a, b) =>
        a.fecha_digitacion > b.fecha_digitacion ? -1 : 1
      );

      let hash = {};
      const filtered = ordered?.filter((item) =>
        hash[item.documento] ? false : (hash[item.documento] = true)
      );
      setToExport(ordered);
      setItems(filtered);
    }
    setPage(0);
    setLoading(false);
  };

  const handleClear = () => {
    setLoading(true);
    setFiltro({
      cedula_amarillo: "",
      cedula_azul: "",
      cedula_rojo: "",
      nombre_amarillo: "",
      nombre_azul: "",
      nombre_rojo: "",
      cedula_blanco: "",
      novedad_identidad: "",
      novedad_puesto: "",
      nombre_blanco: "",
    });
    setFecha_inicial(null);
    setFecha_final(null);
    setItems([]);
    setPage(0);
    setLoading(false);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <Paper className={classes.card}>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <Typography>
              Fecha inicial:
              <DatePicker
                autoOk
                disableFuture
                clearable
                cancelLabel="Cancelar"
                format="DD/MM/YYYY"
                label=""
                value={fecha_inicial}
                onChange={setFecha_inicial}
                maxDate={fecha_final || new Date()}
                inputProps={{ style: { textAlign: "center" } }}
              />
            </Typography>
          </MuiPickersUtilsProvider>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Paper className={classes.card}>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <Typography>
              Fecha final:
              <DatePicker
                autoOk
                disableFuture
                clearable
                cancelLabel="Cancelar"
                format="DD/MM/YYYY"
                label=""
                value={fecha_final}
                onChange={setFecha_final}
                minDate={fecha_inicial || new Date()}
                inputProps={{ style: { textAlign: "center" } }}
              />
            </Typography>
          </MuiPickersUtilsProvider>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Paper className={classes.card}>
          <Typography>
            Cédula amarillo{" "}
            <TextField
              name="cedula_amarillo"
              value={filtro?.cedula_amarillo}
              onChange={handleChange}
              inputProps={{ style: { textAlign: "center" } }}
            />
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Paper className={classes.card}>
          <Typography>
            Cédula azul{" "}
            <TextField
              name="cedula_azul"
              value={filtro?.cedula_azul}
              onChange={handleChange}
              inputProps={{ style: { textAlign: "center" } }}
            />
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Paper className={classes.card}>
          <Typography>
            Cédula rojo{" "}
            <TextField
              name="cedula_rojo"
              value={filtro?.cedula_rojo}
              onChange={handleChange}
              inputProps={{ style: { textAlign: "center" } }}
            />
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Paper className={classes.card}>
          <Typography>
            Nombre amarillo{" "}
            <FormControl style={{ marginLeft: ".5em" }}>
              <Select
                value={filtro.nombre_amarillo}
                onChange={handleChange}
                name="nombre_amarillo"
                style={{ minWidth: "10em" }}
              >
                <MenuItem value="">
                  <em>Seleccione una opción</em>
                </MenuItem>
                {yellow.map((data) => {
                  return (
                    <MenuItem key={`parameter-${data.id}`} value={data.id}>
                      {`${data.nombres} ${data.apellidos}`}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Paper className={classes.card}>
          <Typography>
            Nombre azul{" "}
            <FormControl style={{ marginLeft: ".5em" }}>
              <Select
                value={filtro.nombre_azul}
                onChange={handleChange}
                name="nombre_azul"
                style={{ minWidth: "10em" }}
              >
                <MenuItem value="">
                  <em>Seleccione una opción</em>
                </MenuItem>
                {blue.map((data) => {
                  return (
                    <MenuItem key={`parameter-${data.id}`} value={data.id}>
                      {`${data.nombres} ${data.apellidos}`}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Paper className={classes.card}>
          <Typography>
            Nombre rojo{" "}
            <FormControl style={{ marginLeft: ".5em" }}>
              <Select
                value={filtro.nombre_rojo}
                onChange={handleChange}
                name="nombre_rojo"
                style={{ minWidth: "10em" }}
              >
                <MenuItem value="">
                  <em>Seleccione una opción</em>
                </MenuItem>
                {red.map((data) => {
                  return (
                    <MenuItem key={`parameter-${data.id}`} value={data.id}>
                      {`${data.nombres} ${data.apellidos}`}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Paper className={classes.card}>
          <Typography>
            Cédula blanco{" "}
            <TextField
              name="cedula_blanco"
              value={filtro?.cedula_blanco}
              onChange={handleChange}
              inputProps={{ style: { textAlign: "center" } }}
            />
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Paper className={classes.card}>
          <Typography>
            Nombre blanco{" "}
            <TextField
              name="nombre_blanco"
              value={filtro?.nombre_blanco}
              onChange={handleChange}
              inputProps={{ style: { textAlign: "center" } }}
            />
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Paper className={classes.card}>
          <Typography>
            Novedad identidad{" "}
            <FormControl style={{ marginLeft: ".5em" }}>
              <Select
                value={filtro.novedad_identidad}
                onChange={handleChange}
                name="novedad_identidad"
                style={{ minWidth: "10em" }}
              >
                <MenuItem value="">
                  <em>Seleccione una opción</em>
                </MenuItem>
                {parametersIdentidad.map((data) => {
                  return (
                    <MenuItem key={`parameter-${data.id}`} value={data.id}>
                      {data.valor_parametro}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Paper className={classes.card}>
          <Typography>
            Novedad puesto{" "}
            <FormControl style={{ marginLeft: ".5em" }}>
              <Select
                value={filtro.novedad_puesto}
                onChange={handleChange}
                name="novedad_puesto"
                style={{ minWidth: "10em" }}
              >
                <MenuItem value="">
                  <em>Seleccione una opción</em>
                </MenuItem>
                {parameters.map((data) => {
                  return (
                    <MenuItem key={`parameter-${data.id}`} value={data.id}>
                      {data.valor_parametro}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Button
          color="primary"
          variant="contained"
          className={classes.button}
          onClick={() => getWhites()}
        >
          Filtrar
        </Button>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Button
          color="primary"
          variant="contained"
          className={classes.button}
          onClick={() => handleClear()}
        >
          Limpiar
        </Button>
      </Grid>
    </Grid>
  );
};

const useStyles = makeStyles((theme) => ({
  icon: {
    color: "#9B9B9B",
  },
  submit: {
    borderRadius: "10px",
  },
  container__input_root: {
    borderRadius: "10px",
  },
  card: {
    border: "0.1px solid",
    borderColor: "gray",
    padding: ".2em 0em",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    borderRadius: "10px",
    marginLeft: ".5em",
  },
  button: {
    margin: "0.5em",
    padding: ".5em 3em",
    borderRadius: "10px",
  },
}));

const mapDispatchToProps = { setPage };

export default connect(null, mapDispatchToProps)(Filter);
