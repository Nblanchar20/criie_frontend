import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { setBreadcrumps } from "../../../../../actions";
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
import { decrypt } from "../../../../../utils/crypt";
import Header from "../../../../../components/Header";
import Swal from "sweetalert2";
import Backdrop from "../../../../../components/Backdrop";
import axios from "../../../../../api";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

function FormUser(props) {
  const { userId, setBreadcrumps, groupId, permission, token } = props;
  const classes = useStyles();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [indicator, setIndicator] = useState([]);
  const [activities, setActivities] = useState([]);
  const [project, setProject] = useState([]);
  const [error, setError] = useState({});
  const [form, setForm] = useState({
    gasto: "",
    descripcion: "",
    id_actividades:"",
  });

  useEffect(() => {    
      getProjects()
      if (props.match.url.includes('edit')) {
        getProject();
        setBreadcrumps([
          { name: "Configuración" },
          { name: "Proyecto", route: "/projects" },
          { name: "Editar" },
        ]);
      } else {
        setBreadcrumps([
          { name: "Configuración" },
          { name: "Proyecto", route: "/projects" },
          { name: "Crear" },
        ]);
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getProject = async () => {
    try {
      const id = decrypt(props.match.params.id);
      const { data } = await axios.get(`/project/${id}`, {
        headers: { "access-token": token },
      });
      setForm({        
        gasto: data.project?.gasto,
        descripcion: data.project?.descripcion,
      });
    } catch (error) {
      history.push("/users");
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
        setProject(data.projects);
    } catch (error) {
      history.push("/objectives");
      window.location.reload();
    }
  };

  const getIndicators = async (id) => {
    try {
      const { data } = await axios.post(
        `/indicator/getIndicators`,
        {"id_proyectos":id},
        {
          headers: { "access-token": token },
        }
      );
        setIndicator(data.indicators);
    } catch (error) {
      history.push("/users");
      window.location.reload();
    }
  };

  const getActivities = async (id) => {
    try {
      const { data } = await axios.post(
        `/activity/getActivities`,
        {"id_indicadores":id},
        {
          headers: { "access-token": token },
        }
      );
        setActivities(data.activities);
    } catch (error) {
      history.push("/users");
      window.location.reload();
    }
  };

  const handleInput = (event) => {
    
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleIndicators = (event)=>{
    const id = event.target.value;     
    getIndicators(id)
  }
  const handleActivities = (event)=>{
    const id = event.target.value;     
    getActivities(id)
  }

  const handleCancel = () => {
    history.push("/projects");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
      if (!props.match.params.id) {
        console.log(form)
        axios
          .post(
            `/expense`,
            { ...form},
            {
              headers: { "access-token": token },
            }
          )
          .then((res) => {
            setLoading(false);
            if (res.data.expense) {
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
          .post(
            `/project/updateProject/${id}`,
            { ...form},
            {
              headers: { "access-token": token },
            }
          )
          .then((res) => {
            setLoading(false);
            if (res.data.updated) {
              history.push("/projects");
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

  
  /* const handleChangeInit = (newValue) => {
    setForm({
      ...form,
      fecha_inicio: newValue
    });
  };
  const handleChangeEnd = (newValue) => {
    setForm({
      ...form,
      fecha_fin: newValue
    });
  }; */
  return (
    <Paper elevation={0}>
      <Header search={false} buttonText={"Volver"} buttonRoute={"/users"} />
      <Divider />
      <div className={classes.paper}>
        <div className={classes.container}>
          <Typography component="h1" variant="h5">
            {props.match.params.id ? "Editar" : "Crear"} Gastos por Actividades
          </Typography>
          <form className={classes.root} onSubmit={handleSubmit}>
            <Grid container spacing={2}>
            <Grid item xs={12}>
                <FormControl required fullWidth variant="outlined">
                  <InputLabel id="projectsLabel">Proyectos</InputLabel>
                  <Select
                    labelId="projectsLabel"
                    label="Proyectos"
                    onClick={handleIndicators}
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
            <Grid item xs={12}>
                <FormControl required fullWidth variant="outlined">
                  <InputLabel id="indicatorsLabel">Indicadores</InputLabel>
                  <Select
                    labelId="indicatorsLabel"
                    label="Indicadores"
                    value={form.id_indicadores}
                    onChange={handleActivities}
                    name="id_indicadores"
                    className={classes.container__input_root}
                  >
                    <MenuItem value="" disabled>
                      <em>Seleccione una opción</em>
                    </MenuItem>
                     {indicator
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
                  <InputLabel id="activitiesLabel">Actividades</InputLabel>
                  <Select
                    labelId="activitiesLabel"
                    label="Actividades"
                    value={form.id_actividades}
                    onChange={handleInput}
                    name="id_actividades"
                    className={classes.container__input_root}
                  >
                    <MenuItem value="" disabled>
                      <em>Seleccione una opción</em>
                    </MenuItem>
                     {activities
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
                  label="Valor del Gasto"
                  name="gasto"
                  value={form.gasto}
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
                  label="descripcion"
                  name="descripcion"
                  multiline
                  value={form.descripcion}
                  rows ={4}
                  variant="outlined"
                  onChange={handleInput}
                  InputProps={{
                    classes: {
                      root: classes.container__input_root,
                    },
                  }}
                />
              </Grid>
              {/* <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                required
                fullWidth
                label="Fecha Inicio"
                inputFormat="dd/MM/yyyy"
                value={form.fecha_inicio}
                onChange={handleChangeInit}
                renderInput={(params) => <TextField {...params} />}
              /> 
              </LocalizationProvider>              
              </Grid>
              <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                required
                fullWidth
                label="Fecha Finalizacion"
                inputFormat="dd/MM/yyyy"
                value={form.fecha_fin}
                onChange={handleChangeEnd}
                renderInput={(params) => <TextField {...params} />}
              /> 
              </LocalizationProvider>              
              </Grid> */}
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
  container__input_root: {
    borderRadius: "10px",
  },
}));

const mapStateToProps = (state) => {
  return {
    userId: state.user.id,
    groupId: state.user.id_grupoUsuarios,
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
