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
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@material-ui/core";
import { decrypt } from "../../../utils/crypt";
import Header from "../../../components/Header";
import Swal from "sweetalert2";
import Backdrop from "../../../components/Backdrop";
import axios from "../../../api";

function FormUser(props) {
  const { userId, setBreadcrumps, groupId, permission, token } = props;
  const classes = useStyles();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [userGroup, setUserGroup] = useState([]);
  const [error, setError] = useState({});
  const [form, setForm] = useState({
    nombres: "",
    apellidos: "",
    documento: "",
    telefono: "",
    email: "",
    password: "",
    confirmPassword: "",
    id_grupos_usuarios: "",
  });

  useEffect(() => {
    if (permission.includes(2) || permission.includes(3)) {
      getUserGroups();
      if (props.match.params.id) {
        getUser();
        setBreadcrumps([
          { name: "Configuración" },
          { name: "Usuarios", route: "/users" },
          { name: "Editar" },
        ]);
      } else {
        setBreadcrumps([
          { name: "Configuración" },
          { name: "Usuarios", route: "/users" },
          { name: "Crear" },
        ]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getUser = async () => {
    try {
      const id = decrypt(props.match.params.id);
      const { data } = await axios.get(`/user/${id}`, {
        headers: { "access-token": token },
      });
      setForm({
        nombres: data.user?.nombres,
        apellidos: data.user?.apellidos,
        documento: data.user?.documento,
        telefono: data.user?.telefono,
        email: data.user?.email,
        id_grupos_usuarios: data.user?.id_grupos_usuarios,
      });
    } catch (error) {
      history.push("/users");
      window.location.reload();
    }
  };

  const getUserGroups = async () => {
    try {
      const { data } = await axios.post(
        `/userGroup/getGroups`,
        {},
        {
          headers: { "access-token": token },
        }
      );
      if (groupId === 1) {
        setUserGroup(data.groups);
      } else {
        setUserGroup(data.groups.filter((item) => item.id !== 1));
      }
    } catch (error) {
      history.push("/users");
      window.location.reload();
    }
  };

  const handleInput = (event) => {
    const email =
      // eslint-disable-next-line no-useless-escape
      /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    const letters = /^[a-zA-ZÀ-ÿ\u00f1\u00d1 ]+$/;
    const document = /^([0-9]{6,10})+$/;
    const tel = /^([0-9]{7,10})+$/;

    if (event.target.name === "nombres" || "apellidos") {
      if (letters.test(event.target.value) || event.target.value === "") {
        setError({ ...error, [event.target.name]: false });
      } else {
        setError({ ...error, [event.target.name]: true });
      }
    }

    if (event.target.name === "documento") {
      if (document.test(event.target.value) || event.target.value === "") {
        setError({ ...error, [event.target.name]: false });
      } else {
        setError({ ...error, [event.target.name]: true });
      }
    }

    if (event.target.name === "telefono") {
      if (tel.test(event.target.value) || event.target.value === "") {
        setError({ ...error, [event.target.name]: false });
      } else {
        setError({ ...error, [event.target.name]: true });
      }
    }

    if (event.target.name === "email") {
      if (email.test(event.target.value) || event.target.value === "") {
        setError({ ...error, [event.target.name]: false });
      } else {
        setError({ ...error, [event.target.name]: true });
      }
    }

    if (event.target.name === "password") {
      if (event.target.value.length >= 6 || event.target.value === "") {
        setError({ ...error, [event.target.name]: false });
      } else {
        setError({ ...error, [event.target.name]: true });
      }
    }

    if (event.target.name === "confirmPassword") {
      if (event.target.value === form.password || event.target.value === "") {
        setError({ ...error, [event.target.name]: false });
      } else {
        setError({ ...error, [event.target.name]: true });
      }
    }

    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleCancel = () => {
    history.push("/users");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    if (form.password !== form.confirmPassword) {
      setLoading(false);
      setError({ ...error, confirmPassword: true });
    } else {
      if (!props.match.params.id) {
        axios
          .post(
            `/user/`,
            { ...form, userId },
            {
              headers: { "access-token": token },
            }
          )
          .then((res) => {
            setLoading(false);
            if (res.data.userCreated.success) {
              history.push("/users");
              Swal.fire({
                icon: "success",
                text: "Creado exitosamente.",
                showConfirmButton: false,
                timer: 3000,
              });
            } else {
              Swal.fire({
                icon: "error",
                text: res.data.userCreated.message,
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
      } else {
        const id = decrypt(props.match.params.id);
        axios
          .put(
            `/user/${id}`,
            { ...form, userId },
            {
              headers: { "access-token": token },
            }
          )
          .then((res) => {
            setLoading(false);
            if (res.data.userUpdated.success) {
              history.push("/users");
              Swal.fire({
                icon: "success",
                text: "Editado exitosamente.",
                showConfirmButton: false,
                timer: 3000,
              });
            } else {
              Swal.fire({
                icon: "error",
                text: res.data.userUpdated.message,
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
      }
    }
  };

  return (
    <Paper elevation={0}>
      <Header search={false} buttonText={"Volver"} buttonRoute={"/users"} />
      <Divider />
      <div className={classes.paper}>
        <div className={classes.container}>
          <Typography component="h1" variant="h5">
            {props.match.params.id ? "Editar" : "Crear"} usuario
          </Typography>
          <form className={classes.root} onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <TextField
                  required
                  fullWidth
                  label="Nombres"
                  name="nombres"
                  value={form.nombres}
                  variant="outlined"
                  onChange={handleInput}
                  error={error.nombres}
                  helperText={error.nombres && "Solo se permite letras."}
                  InputProps={{
                    classes: {
                      root: classes.container__input_root,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  required
                  fullWidth
                  label="Apellidos"
                  name="apellidos"
                  value={form.apellidos}
                  variant="outlined"
                  onChange={handleInput}
                  error={error.apellidos}
                  helperText={error.apellidos && "Solo se permite letras."}
                  InputProps={{
                    classes: {
                      root: classes.container__input_root,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Documento"
                  name="documento"
                  value={form.documento}
                  variant="outlined"
                  onChange={handleInput}
                  error={error.documento}
                  helperText={
                    error.documento &&
                    "Solo se permite números entre 6 y 10 dígitos."
                  }
                  InputProps={{
                    classes: {
                      root: classes.container__input_root,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Teléfono"
                  name="telefono"
                  type="tel"
                  value={form.telefono}
                  variant="outlined"
                  onChange={handleInput}
                  error={error.telefono}
                  helperText={
                    error.telefono &&
                    "Solo se permite números de hasta 10 dígitos."
                  }
                  InputProps={{
                    classes: {
                      root: classes.container__input_root,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  required
                  fullWidth
                  label="Correo electrónico"
                  name="email"
                  type="email"
                  value={form.email}
                  variant="outlined"
                  onChange={handleInput}
                  error={error.email}
                  helperText={
                    error.email && "El correo electrónico es inválido."
                  }
                  InputProps={{
                    classes: {
                      root: classes.container__input_root,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required={!props.match.params.id}
                  fullWidth
                  label="Contraseña"
                  name="password"
                  type="password"
                  value={form.password}
                  variant="outlined"
                  onChange={handleInput}
                  error={error.password}
                  helperText={
                    error.password && "Solo se permite mínimo 6 caracteres."
                  }
                  InputProps={{
                    classes: {
                      root: classes.container__input_root,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required={!props.match.params.id}
                  fullWidth
                  label="Confirmar contraseña"
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  variant="outlined"
                  onChange={handleInput}
                  error={error.confirmPassword}
                  helperText={
                    error.confirmPassword && "Las contraseñas no coinciden."
                  }
                  InputProps={{
                    classes: {
                      root: classes.container__input_root,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl required fullWidth variant="outlined">
                  <InputLabel id="gruposLabel">Grupo de usuario</InputLabel>
                  <Select
                    labelId="gruposLabel"
                    label="Grupo de usuario"
                    value={form.id_grupos_usuarios}
                    onChange={handleInput}
                    name="id_grupos_usuarios"
                    className={classes.container__input_root}
                  >
                    <MenuItem value="" disabled>
                      <em>Seleccione una opción</em>
                    </MenuItem>
                    {userGroup
                      .sort((a, b) => (a.nombre < b.nombre ? -1 : 1))
                      .map((data) => {
                        return (
                          <MenuItem key={`group-${data.id}`} value={data.id}>
                            {data.nombre}
                          </MenuItem>
                        );
                      })}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <div className={classes.containerButton}>
              <Button
                disabled={
                  error.nombres ||
                  error.apellidos ||
                  error.documento ||
                  error.telefono ||
                  error.email ||
                  error.password ||
                  error.confirmPassword
                }
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
  container__input_root: {
    borderRadius: "10px",
  },
}));

const mapStateToProps = (state) => {
  return {
    userId: state.user.id,
    groupId: state.user.id_grupos_usuarios,
    token: state.token,
    permission: (state.permission || [])
      .filter((data) => data.modulosAcciones?.id_modulos === 2)
      .map((item) => item.modulosAcciones?.id_acciones),
  };
};

const mapDispatchToProps = {
  setBreadcrumps,
};

export default connect(mapStateToProps, mapDispatchToProps)(FormUser);
