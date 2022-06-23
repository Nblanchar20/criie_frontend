import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { decrypt } from "../../../utils/crypt";
import { setBreadcrumps } from "../../../actions";
import {
  useTheme,
  makeStyles,
  TextField,
  Button,
  Grid,
  Paper,
  Divider,
  Typography,
  IconButton,
  Tooltip,
  InputAdornment,
} from "@material-ui/core";
import Header from "../../../components/Header";
import CloseIcon from "@material-ui/icons/Close";
import Backdrop from "../../../components/Backdrop";
import Swal from "sweetalert2";
import axios from "../../../api";
import UpIcon from "@material-ui/icons/ArrowUpward";
import DownIcon from "@material-ui/icons/ArrowDownward";

function FormParameters(props) {
  const { userId, setBreadcrumps, permission, token } = props;
  const classes = useStyles();
  const history = useHistory();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ nombre_parametro: "" });
  const [parameters, setParameters] = useState([
    { index: 1, valor_parametro: "", orden: 1 },
  ]);

  useEffect(() => {
      if (props.match.params.id) {
        getParameters();
        setBreadcrumps([
          { name: "Configuración" },
          { name: "Parámetros", route: "/parameters" },
          { name: "Editar" },
        ]);
      } else {
        setBreadcrumps([
          { name: "Configuración" },
          { name: "Parámetros", route: "/parameters" },
          { name: "Crear" },
        ]);
      }
  }, []);

  const getParameters = async () => {
    const id = decrypt(props.match.params.id);
    const { data } = await axios.get(`/parameter/${id}`, {
      headers: { "access-token": token },
    });
    setForm(data.parameter);
    setParameters([
      ...data.parameter?.valoresParametros
        ?.sort((a, b) => (a.orden < b.orden ? -1 : 1))
        .map((item) => ({
          id: item.id,
          index: item.orden,
          orden: item.orden,
          valor_parametro: item.valor_parametro,
        })),
    ]);
  };

  const handleInput = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleCancel = () => {
    history.push("/parameters");
  };

  const addAction = () => {
    const last = parameters[parameters.length - 1];
    setParameters([
      ...parameters,
      { index: last.index + 1, orden: last.orden + 1 },
    ]);
  };

  const deleteAction = (e, index) => {
    Swal.fire({
      text: "¿Está seguro que desea eliminar este valor parámetro?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: theme.palette.primary.main,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.value) {
        const actionDeleted = parameters.filter((item) => item.index !== index);
        actionDeleted.map((item, index) => {
          item["orden"] = index + 1;
          return item;
        });
        actionDeleted.sort((a, b) => (a.orden < b.orden ? -1 : 1));
        setParameters([...actionDeleted]);
      }
    });
  };

  const handleInputAction = (event, index) => {
    parameters.map((item) => {
      if (item.index === index) {
        item[event.target.name] = event.target.value;
      }
      return item;
    });
    setParameters([...parameters]);
  };

  const ordenUp = (orden) => {
    parameters.map((item) => {
      if (item.orden === orden) {
        item["orden"] = item.orden - 1;
      } else if (item.orden === orden - 1) {
        item["orden"] = item.orden + 1;
      }
      return item;
    });
    parameters.sort((a, b) => (a.orden < b.orden ? -1 : 1));
    setParameters([...parameters]);
  };

  const ordenDown = (orden) => {
    parameters.map((item) => {
      if (item.orden === orden) {
        item["orden"] = item.orden + 1;
      } else if (item.orden === orden + 1) {
        item["orden"] = item.orden - 1;
      }
      return item;
    });
    parameters.sort((a, b) => (a.orden < b.orden ? -1 : 1));
    setParameters([...parameters]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    if (!props.match.params.id) {
      axios
        .post(
          `/parameter/`,
          { form, parameters, userId },
          {
            headers: { "access-token": token },
          }
        )
        .then((res) => {
          setLoading(false);
          history.push("/parameters");
          Swal.fire({
            icon: "success",
            text: "Creado exitosamente.",
            showConfirmButton: false,
            timer: 3000,
          });
        })
        .catch((error) => {
          setLoading(false);
          Swal.fire({
            icon: "error",
            text: "No se ha podido crear.",
            showConfirmButton: false,
            timer: 3000,
          });
        });
    } else {
      const id = decrypt(props.match.params.id);
      axios
        .put(
          `/parameter/${id}`,
          { form, parameters, userId },
          {
            headers: { "access-token": token },
          }
        )
        .then((res) => {
          setLoading(false);
          history.push("/parameters");
          Swal.fire({
            icon: "success",
            text: "Editado exitosamente.",
            showConfirmButton: false,
            timer: 3000,
          });
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
    }
  };

  return (
    <Paper elevation={3}>
      <Header
        title={"Crear"}
        search={false}
        buttonText={"Volver"}
        buttonRoute={"/parameters"}
      />
      <Divider />
      <div className={classes.paper}>
        <div className={classes.container}>
          <Typography component="h1" variant="h5">
            {props.match.params.id ? "Editar" : "Crear"} párametro
          </Typography>
          <form className={classes.root} onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Párametro"
                  name="nombre_parametro"
                  value={form.nombre_parametro}
                  variant="outlined"
                  onChange={handleInput}
                  InputProps={{
                    classes: {
                      root: classes.container__input_root,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Typography align="left" component="h5" variant="h6">
                      Valores párametros:
                    </Typography>
                  </Grid>
                  {parameters.map((item, index) => (
                    <>
                      <Grid item xs={3} md={1} key={item.index}>
                        <TextField
                          disabled
                          fullWidth
                          type="number"
                          label="Orden"
                          variant="outlined"
                          name="orden"
                          value={item.orden}
                          InputProps={{
                            classes: {
                              root: classes.container__input_root,
                            },
                          }}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={parameters.length > 1 ? 8 : 9}
                        md={parameters.length > 1 ? 10 : 11}
                      >
                        <TextField
                          fullWidth
                          required
                          label="Valor párametro"
                          variant="outlined"
                          name="valor_parametro"
                          placeholder="Valor párametro"
                          value={item.valor_parametro}
                          onChange={(e) => handleInputAction(e, item.index)}
                          InputProps={{
                            classes: {
                              root: classes.container__input_root,
                            },
                            startAdornment: (
                              <InputAdornment position="start">
                                {index + 1 !== 1 && (
                                  <IconButton
                                    onClick={() => ordenUp(index + 1)}
                                  >
                                    <UpIcon
                                      fontSize="small"
                                      className={classes.icon}
                                    />
                                  </IconButton>
                                )}
                                {parameters.length !== index + 1 && (
                                  <IconButton
                                    onClick={() => ordenDown(index + 1)}
                                  >
                                    <DownIcon
                                      fontSize="small"
                                      className={classes.icon}
                                    />
                                  </IconButton>
                                )}
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      {parameters.length > 1 && (
                        <Grid item xs={1} md={1} key={"index2"}>
                          <Tooltip title="Eliminar valor párametro">
                            <IconButton
                              aria-label="delete"
                              className={classes.iconMargin}
                              size="small"
                              onClick={(e) => deleteAction(e, item.index)}
                            >
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Grid>
                      )}
                    </>
                  ))}
                </Grid>
              </Grid>
            </Grid>
            <div className={`text-right ${classes.containerAddButton}`}>
              <Button
                color="primary"
                variant="outlined"
                onClick={addAction}
                className={classes.addButton}
              >
                Añadir valor párametro
              </Button>
            </div>
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
  addButton: {
    textTransform: "none",
    transitionProperty: "none",
    borderRadius: "10px",
  },
  iconMargin: {
    margin: theme.spacing(2),
  },
  containerAddButton: {
    marginTop: "1em",
    display: "flex",
    justifyContent: "flex-end",
  },
  icon: {
    margin: "-1em",
  },
  container__input_root: {
    borderRadius: "10px",
  },
}));

const mapStateToProps = (state) => {
  return {
    userId: state.user.id,
    token: state.token,
    permission: (state.permission || [])
      .filter((data) => data.modulosAcciones?.id_modulos === 6)
      .map((item) => item.modulosAcciones?.id_acciones),
  };
};

const mapDispatchToProps = {
  setBreadcrumps,
};

export default connect(mapStateToProps, mapDispatchToProps)(FormParameters);
