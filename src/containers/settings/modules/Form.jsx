import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { decrypt } from "../../../utils/crypt";
import { setBreadcrumps } from "../../../actions";
import {
  useTheme,
  makeStyles,
  Button,
  Select,
  FormControl,
  InputLabel,
  Typography,
  ListItem,
  ListItemText,
  Checkbox,
  Grid,
  Paper,
  Divider,
  MenuItem,
} from "@material-ui/core";
import Header from "../../../components/Header";
import Backdrop from "../../../components/Backdrop";
import Swal from "sweetalert2";
import axios from "../../../api";

function FormModules(props) {
  const { setBreadcrumps, permission, token } = props;
  const classes = useStyles();
  const history = useHistory();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [modules, setModules] = useState([]);
  const [actions, setActions] = useState([]);
  const [checked, setChecked] = useState([]);
  const [form, setForm] = useState({ id_modulos: "", id_acciones: [] });

  useEffect(() => {
    if (permission.includes(2) || permission.includes(3)) {
      getModules();
      getActions();
      if (props.match.params.id) {
        getModuleAction();
        setBreadcrumps([
          { name: "Configuración" },
          { name: "Módulos", route: "/modules" },
          { name: "Editar" },
        ]);
      } else {
        setBreadcrumps([
          { name: "Configuración" },
          { name: "Módulos", route: "/modules" },
          { name: "Crear" },
        ]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!props.match.params.id) {
      getActionsModules();
    }
    // eslint-disable-next-line
  }, [form.id_modulos]);

  const getActionsModules = async () => {
    const { data } = await axios.post(
      `/moduleAction/getActionsModules`,
      {},
      {
        headers: { "access-token": token },
      }
    );
    let check = [];
    data.actions
      .filter((item) => item.id_modulos === form.id_modulos)
      .map((item) => check.push(item.id_acciones));
    setChecked(check);
    setForm({
      ...form,
      id_acciones: check,
    });
  };

  const getModules = async () => {
    const { data } = await axios.post(
      `/module/getModules`,
      {},
      {
        headers: { "access-token": token },
      }
    );
    setModules(data.modules);
  };

  const getActions = async () => {
    const { data } = await axios.post(
      `/action/getActions`,
      {},
      {
        headers: { "access-token": token },
      }
    );
    setActions(data.actions?.sort((a, b) => (a.nombre < b.nombre ? -1 : 1)));
  };

  const getModuleAction = async () => {
    const id = decrypt(props.match.params.id);
    const { data } = await axios.get(`/moduleAction/${id}`, {
      headers: { "access-token": token },
    });
    const acciones = [];
    data?.moduleAction?.map((item) => acciones.push(item.id_acciones));
    setChecked(acciones);
    setForm({
      ...form,
      id_modulos: data?.moduleAction[0]?.id_modulos,
      id_acciones: acciones,
    });
  };

  const handleInput = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleToggleChecked = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
    setForm({
      ...form,
      id_acciones: newChecked,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    if (form.id_acciones.length > 0) {
      if (!props.match.params.id) {
        axios
          .post(`/moduleAction/`, form, {
            headers: { "access-token": token },
          })
          .then((res) => {
            setLoading(false);
            history.push("/modules");
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
          .put(`/moduleAction/${id}`, form, {
            headers: { "access-token": token },
          })
          .then((res) => {
            setLoading(false);
            history.push("/modules");
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
    } else {
      Swal.fire({
        icon: "error",
        text: "Seleccione al menos una acción",
        showConfirmButton: false,
        timer: 3000,
      });
    }
  };

  return (
    <Paper elevation={0}>
      <Header search={false} buttonText={"Volver"} buttonRoute={"/modules"} />
      <Divider />
      <div className={classes.paper}>
        <div className={classes.container}>
          <Typography component="h1" variant="h5">
            {props.match.params.id ? "Editar" : "Crear"} módulo
          </Typography>
          <form className={classes.root} onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth required variant="outlined">
                  <InputLabel id="id-module">Módulo</InputLabel>
                  <Select
                    labelId="id-module"
                    id="id-module"
                    value={form.id_modulos}
                    label="Módulo *"
                    name="id_modulos"
                    onChange={handleInput}
                    className={classes.container__input_root}
                  >
                    <MenuItem value="" disabled>
                      <em>Seleccione una opción</em>
                    </MenuItem>
                    {modules.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Typography align="left" component="h5" variant="h6">
                  Acciones *
                </Typography>
                {actions.map((data) => (
                  <ListItem
                    key={data.id}
                    role={undefined}
                    dense
                    button
                    onClick={handleToggleChecked(data.id)}
                  >
                    <ListItemText id="nombre" primary={data.nombre} />
                    <Checkbox
                      className={classes.check}
                      edge="start"
                      sx={{
                        color: theme.palette.primary.main,
                        "&.Mui-checked": {
                          color: theme.palette.primary.main,
                        },
                      }}
                      checked={checked.indexOf(data.id) !== -1}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ "aria-labelledby": data.nombre }}
                    />
                  </ListItem>
                ))}
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
                onClick={() => history.push("/modules")}
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
  container__input_root: {
    borderRadius: "10px",
  },
}));
const mapStateToProps = (state) => {
  return {
    userId: state.user.id,
    token: state.token,
    permission: (state.permission || [])
      .filter((data) => data.modulosAcciones?.id_modulos === 3)
      .map((item) => item.modulosAcciones?.id_acciones),
  };
};

const mapDispatchToProps = {
  setBreadcrumps,
};

export default connect(mapStateToProps, mapDispatchToProps)(FormModules);
