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
  const [project, setProject] = useState([]);
  const [error, setError] = useState({});
  const [form, setForm] = useState({
    nombre: "",
    descripcion:"",
    id_proyectos:"",
  });

  useEffect(() => {
    
      getProjects();
      if (props.match.params.id) {
        getDeliverables();
        setBreadcrumps([
          { name: "Proyecto", route: "/projects" },
          { name: "Entregable"},
          { name: "Editar" },
        ]);
      } else {
        setBreadcrumps([
          { name: "Proyecto", route: "/projects" },
          { name: "Entregable"},
          { name: "Crear" },
        ]);
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getDeliverables = async () => {
    try {
      const id = decrypt(props.match.params.id);
      const { data } = await axios.get(`/deliverable/${id}`, {
        headers: { "access-token": token },
      });
      setForm({
        nombre: data.deliverable?.nombre,
        descripcion:data.deliverable?.descripcion,
        id_proyectos:data.deliverable?.id_proyectos,
      });
    } catch (error) {
      history.push("/objectives");
      window.location.reload();
    }
  };

  const getProjects = async () => {
    try {
      const { data } = await axios.post(
        `/project/getProjects`,
        {},
        {
          headers: { "access-token": token },
        }
      );
      if (groupId === 1) {
        setProject(data.projects);
      } else {
        setProject(data.projects.filter((item) => item.id !== 1));
      }
    } catch (error) {
      history.push("/objectives");
      window.location.reload();
    }
  };

  const handleInput = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleCancel = () => {
    history.push("/objectives");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
      if (!props.match.params.id) {
        axios
          .post(
            `/deliverable/`,
            { ...form},
            {
              headers: { "access-token": token },
            }
          )
          .then((res) => {
            setLoading(false);
            if (res.data.deliverable) {
              Swal.fire({
                icon: "success",
                text: "Creado exitosamente.",
                showConfirmButton: false,
                timer: 3000,
              });
            } else {
              Swal.fire({
                icon: "error",
                text: res.data.message,
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
  };

  return (
    <Paper elevation={0}>
      <Header search={false} buttonText={"Volver"} buttonRoute={"/users"} />
      <Divider />
      <div className={classes.paper}>
        <div className={classes.container}>
          <Typography component="h1" variant="h5">
            {props.match.params.id ? "Editar" : "Agregar"} Entregables
          </Typography>
          <form className={classes.root} onSubmit={handleSubmit}>
            <Grid container spacing={2}>
            <Grid item xs={12}>
                <FormControl required fullWidth variant="outlined">
                  <InputLabel id="projectsLabel">Proyectos</InputLabel>
                  <Select
                    labelId="projectsLabel"
                    label="Proyectos"
                    value={form.id_proyectos}
                    onChange={handleInput}
                    name="id_proyectos"
                    className={classes.container__input_root}
                  >
                    <MenuItem value="" disabled>
                      <em>Seleccione una opción</em>
                    </MenuItem>
                    {project
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
              <Grid item xs={12} sm={12}>
                <TextField
                  required
                  fullWidth
                  label="Nombre"
                  name="nombre"
                  value={form.nombre}
                  variant="outlined"
                  onChange={handleInput}
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
                  label="Descripción"
                  name="descripcion"
                  value={form.descripcion}
                  variant="outlined"
                  onChange={handleInput}
                  InputProps={{
                    classes: {
                      root: classes.container__input_root,
                    },
                  }}
                />
              </Grid>              
                            
            </Grid>
            <div className={classes.containerButton}>
              <Button
                color="primary"
                variant="contained"
                className={classes.button}
                type="submit"
              >
                Agregar
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
