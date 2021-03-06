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

function FormUserRole(props) {
  const { userId, setBreadcrumps, groupId, permission, token } = props;
  const classes = useStyles();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState([]);
  const [role, setRoles] = useState([]);
  const [user, setUsers] = useState([]);
  const [error, setError] = useState({});
  const [form, setForm] = useState({
    id_usuarios:"",
    id_proyectos:"",
    id_roles:"",
    beneficiarios:""
  });

  useEffect(() => {
      getProjects();
      getUsers();
      getRoles();
      if (props.match.params.id) {
        getProjectsUsersRoles();
        setBreadcrumps([
          { name: "Proyecto", route: "/projects" },
          { name: "Objetivos", route: "/objectives" },
          { name: "Editar" },
        ]);
      } else {
        setBreadcrumps([
          { name: "Proyecto", route: "/projects" },
          { name: "Usuarios", },
          { name: "Agregar" },
        ]);
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getProjectsUsersRoles = async () => {
    try {
      const id = decrypt(props.match.params.id);
      const { data } = await axios.get(`/objective/${id}`, {
        headers: { "access-token": token },
      });
      setForm({        
        id_proyectos:data.objective?.id_proyectos,
        id_usuarios:data.objective?.id_usuarios,
        id_roles:data.objective?.id_roles,
        beneficiarios:data.objective?.beneficiarios,
      });
    } catch (error) {
      history.push("/objectives");
      window.location.reload();
    }
  };

  const getRoles = async () => {
    try {
      const { data } = await axios.post(
        `/role/getRoles`,
        {},
        {
          headers: { "access-token": token },
        }
      );
        setRoles(data.roles);
    } catch (error) {
      history.push("/objectives");
      window.location.reload();
    }
  };

  const getUsers = async () => {
    try {
      const { data } = await axios.post(
        `/user/getUsers`,
        {},
        {
          headers: { "access-token": token },
        }
      );
        setUsers(data.users);
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
            `/userProject/`,
            { ...form},
            {
              headers: { "access-token": token },
            }
          )
          .then((res) => {
            setLoading(false);
            if (res.data.userProject) {
              history.push("/projects");
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
            {props.match.params.id ? "Editar" : "Agregar"} Objetivos
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
                      <em>Seleccione una opci??n</em>
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
              <Grid item xs={12}>
                <FormControl required fullWidth variant="outlined">
                  <InputLabel id="RolesLabel">Roles</InputLabel>
                  <Select
                    labelId="RolesLabel"
                    label="Roles"
                    value={form.id_roles}
                    onChange={handleInput}
                    name="id_roles"
                    className={classes.container__input_root}
                  >
                    <MenuItem value="" disabled>
                      <em>Seleccione una opci??n</em>
                    </MenuItem>
                    {role
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
              <Grid item xs={12}>
                <FormControl required fullWidth variant="outlined">
                  <InputLabel id="usersLabel">Usuarios</InputLabel>
                  <Select
                    labelId="usersLabel"
                    label="usuarios"
                    value={form.id_usuarios}
                    onChange={handleInput}
                    name="id_usuarios"
                    className={classes.container__input_root}
                  >
                    <MenuItem value="" disabled>
                      <em>Seleccione una opci??n</em>
                    </MenuItem>
                    {user
                      .sort((a, b) => (a.nombre < b.nombre ? -1 : 1))
                      .map((data) => {
                        return (
                          <MenuItem key={`group-${data.id}`} value={data.id}>
                            {data.nombres+" "+data.apellidos+"  "+data.email}
                          </MenuItem>
                        );
                      })}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl required fullWidth variant="outlined">
                  <InputLabel id="beneficiaryLabel">Beneficiario</InputLabel>
                  <Select
                    labelId="beneficiaryLabel"
                    label="beneficiary"
                    value={form.beneficiarios}
                    onChange={handleInput}
                    name="beneficiarios"
                    className={classes.container__input_root}
                  >
                    <MenuItem value="" disabled>
                      <em>Seleccione una opci??n</em>
                    </MenuItem>
                    <MenuItem value="1">
                      <em>Si</em>
                    </MenuItem>
                    <MenuItem value="2">
                      <em>No</em>
                    </MenuItem>
                  </Select>
                </FormControl>
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

export default connect(mapStateToProps, mapDispatchToProps)(FormUserRole);
