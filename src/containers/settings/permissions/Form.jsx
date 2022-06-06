import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { setBreadcrumps } from "../../../actions";
import {
  makeStyles,
  Button,
  Select,
  FormControl,
  InputLabel,
  useTheme,
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
import axios from "../../../api";
import Backdrop from "../../../components/Backdrop";
import Swal from "sweetalert2";

function FormPermissions(props) {
  const { userId, setBreadcrumps, permission, token } = props;
  const classes = useStyles();
  const history = useHistory();
  const theme = useTheme();
  const [actions, setActions] = useState([]);
  const [checked, setChecked] = useState([]);
  const [userGroup, setUserGroup] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    id_grupos_usuarios: "",
    id_modulos: "",
    id_acciones: [],
  });

  useEffect(() => {
    if (permission.includes(2) || permission.includes(3)) {
      getUserGroups();
      getModules();
      if (props.match.params.id) {
        setBreadcrumps([
          { name: "Configuración" },
          { name: "Permisos", route: "/permissions" },
          { name: "Editar" },
        ]);
      } else {
        setBreadcrumps([
          { name: "Configuración" },
          { name: "Permisos", route: "/permissions" },
          { name: "Crear" },
        ]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getActions(form.id_modulos);
    getPermissions(form);
    // eslint-disable-next-line
  }, [form.id_modulos, form.id_grupos_usuarios]);

  const getPermissions = async (formData) => {
    const { data } = await axios.post(
      `/permission/getPermissions`,
      {},
      {
        headers: { "access-token": token },
      }
    );
    const check = [];
    data.permissions
      ?.filter(
        (item) => item.id_grupos_usuarios === formData.id_grupos_usuarios
      )
      // eslint-disable-next-line array-callback-return
      .map((item) => {
        if (item.accionesModulos?.id_modulos === formData?.id_modulos) {
          check.push(item.id_acciones_modulos);
        }
      });
    setChecked(check);
    setForm({
      ...form,
      id_acciones: check,
    });
  };

  const getUserGroups = async () => {
    const { data } = await axios.post(
      `/userGroup/getGroups`,
      {},
      {
        headers: { "access-token": token },
      }
    );
    setUserGroup(data.groups?.sort((a, b) => (a.nombre < b.nombre ? -1 : 1)));
  };

  const getModules = async () => {
    const { data } = await axios.post(
      `/module/getModules`,
      {},
      {
        headers: { "access-token": token },
      }
    );
    setModules(data.modules?.sort((a, b) => (a.nombre < b.nombre ? -1 : 1)));
  };

  const getActions = async (id_modulos) => {
    const { data } = await axios.post(
      `/moduleAction/getActionsModules`,
      {
        id_modulos,
      },
      {
        headers: { "access-token": token },
      }
    );
    setActions(
      data.actions?.sort((a, b) =>
        a.acciones?.nombre < b.acciones?.nombre ? -1 : 1
      )
    );
  };

  const handleInput = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleCancel = () => {
    history.push("/permissions");
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
          .post(
            `/permission/`,
            { ...form, userId },
            {
              headers: { "access-token": token },
            }
          )
          .then((res) => {
            setLoading(false);
            if (res.data.created.success) {
              history.push("/permissions");
              Swal.fire({
                icon: "success",
                text: "Creado exitosamente.",
                showConfirmButton: false,
                timer: 3000,
              });
            }
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
      }
    } else {
      setLoading(false);
      Swal.fire({
        icon: "error",
        text: "Seleccione al menos una acción.",
        showConfirmButton: false,
        timer: 3000,
      });
    }
  };

  return (
    <Paper elevation={3}>
      <Header
        search={false}
        buttonText={"Volver"}
        buttonRoute={"/permissions"}
      />
      <Divider />
      <div className={classes.paper}>
        <div className={classes.container}>
          <Typography component="h1" variant="h5">
            {props.match.params.id ? "Editar" : "Crear"} Permiso
          </Typography>
          <form className={classes.root} onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl required fullWidth variant="outlined">
                  <InputLabel id="gruposLabel">Grupo de usuarios</InputLabel>
                  <Select
                    labelId="gruposLabel"
                    label="Grupo de usuarios"
                    value={form.id_grupos_usuarios}
                    onChange={handleInput}
                    name="id_grupos_usuarios"
                    className={classes.container__input_root}
                  >
                    <MenuItem value="" disabled>
                      <em>Seleccione una opción</em>
                    </MenuItem>
                    {userGroup.map((data) => (
                      <MenuItem key={`group-${data.id}`} value={data.id}>
                        {data.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl required fullWidth variant="outlined">
                  <InputLabel id="gruposLabel">Módulos</InputLabel>
                  <Select
                    labelId="gruposLabel"
                    label="Módulos"
                    value={form.id_modulos}
                    onChange={handleInput}
                    name="id_modulos"
                    className={classes.container__input_root}
                  >
                    <MenuItem value="" disabled>
                      <em>Seleccione una opción</em>
                    </MenuItem>
                    {modules.map((data) => (
                      <MenuItem key={data.id} value={data.id}>
                        {data.nombre}
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
                    <ListItemText id="nombre" primary={data.acciones?.nombre} />
                    <Checkbox
                      className={classes.check}
                      color="primary"
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
  iconMargin: {
    margin: theme.spacing(2),
  },
  check: {
    padding: "5px",
    color: theme.palette.primary.main,
  },
  container__input_root: {
    borderRadius: "10px",
  },
}));

const mapStateToProps = (state) => {
  return {
    userId: state.user.id,
    token: state.token,
    permission: [1, 2, 3, 4, 5],
    /* permission: (state.permission || [])
      .filter((data) => data.accionesModulos?.id_modulos === 5)
      .map((item) => item.accionesModulos?.id_acciones), */
  };
};

const mapDispatchToProps = {
  setBreadcrumps,
};

export default connect(mapStateToProps, mapDispatchToProps)(FormPermissions);
