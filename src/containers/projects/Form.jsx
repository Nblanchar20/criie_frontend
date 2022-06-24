import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { setBreadcrumps } from "../../actions";
import {
  makeStyles,
  TextField,
  Button,
  Grid,
  Paper,
  Divider,
  Typography,
} from "@material-ui/core";
import { decrypt } from "../../utils/crypt";
import Header from "../../components/Header";
import Swal from "sweetalert2";
import Backdrop from "../../components/Backdrop";
import axios from "../../api";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Modal from "../../components/Modal";
import Objectives from"./objectives/create";
import Deliverables from"./deliverables/create";
import Indicators from"./indicators/create";


function FormUser(props) {
  const { userId, setBreadcrumps, groupId, permission, token } = props;
  const classes = useStyles();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [modalObjective, setmodalObjective] = useState(false);
  const [modalDeliverable, setmodalDeliverable] = useState(false);
  const [modalIndicator, setmodalIndicator] = useState(false);
  const [error, setError] = useState({});
  const [form, setForm] = useState({
    nombre: "",
    fecha_inicio: new Date(),
    fecha_fin: new Date(),
    fecha_inicio_esperado: new Date(),
    fecha_fin_esperado: new Date(),
    alcance: "",
    presupuesto:""
  });

  useEffect(() => {
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
        nombre: data.project?.nombre,
        fecha_inicio: data.project?.fecha_inicio,
        fecha_fin: data.project?.fecha_fin,
        fecha_inicio_esperado: data.project?.fecha_inicio_esperado,
        fecha_fin_esperado: data.project?.fecha_fin_esperado,
        alcance: data.project?.alcance,
        presupuesto: data.project?.presupuesto
      });
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

  const handleCancel = () => {
    history.push("/projects");
  };

  const handleSubmit = (e) => {
    console.log(form)
    e.preventDefault();
    setLoading(true);
      if (!props.match.params.id) {
        axios
          .post(
            `/project/`,
            { ...form},
            {
              headers: { "access-token": token },
            }
          )
          .then((res) => {
            setLoading(false);
            if (res.data.project) {
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

  
  const handleChangeInit = (newValue) => {
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
  };
  const handleChangeExpectedInit = (newValue) => {
    setForm({
      ...form,
      fecha_inicio_esperado: newValue
    });
  };
  const handleChangeExpectedEnd = (newValue) => {
    setForm({
      ...form,
      fecha_fin_esperado: newValue
    });
  };

  return (
    <Paper elevation={0}>
      <Header search={false} buttonText={"Volver"} buttonRoute={"/users"}

      ObjectiveButton={props.match.url.includes('edit') ? true:false}
      modalObjective={modalObjective}
      setmodalObjective={setmodalObjective}

      DeliverableButton={props.match.url.includes('edit') ? true:false}
      modalDeliverable={modalDeliverable}
      setmodalDeliverable={setmodalDeliverable}

      IndicatorButton={props.match.url.includes('edit') ? true:false}
      modalIndicator={modalIndicator}
      setmodalIndicator={setmodalIndicator}
       />
      <Divider />
      <div className={classes.paper}>
        <div className={classes.container}>
          <Typography component="h1" variant="h5">
            {props.match.params.id ? "Editar" : "Crear"} Proyecto
          </Typography>
          <form className={classes.root} onSubmit={handleSubmit}>
            <Grid container spacing={2}>
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
              <Grid item xs={12} sm={3}>
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
              <Grid item xs={12} sm={3}>
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
              </Grid>
              
              <Grid item xs={12} sm={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                required
                fullWidth
                label="Inicio Esperado"
                inputFormat="dd/MM/yyyy"
                value={form.fecha_inicio_esperado}
                onChange={handleChangeExpectedInit}
                renderInput={(params) => <TextField {...params} />}
              /> 
              </LocalizationProvider>              
              </Grid>
              <Grid item xs={12} sm={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                required
                fullWidth
                label="Finalizacion Esperada"
                inputFormat="dd/MM/yyyy"
                value={form.fecha_fin_esperado}
                onChange={handleChangeExpectedEnd}
                renderInput={(params) => <TextField {...params} />}
              /> 
              </LocalizationProvider>              
              </Grid>
              <Grid item xs={12} sm={12}>
              <TextField
                  required
                  fullWidth
                  label="Presupuesto"
                  name="presupuesto"
                  value={form.presupuesto}
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
                  label="Alcance"
                  name="alcance"
                  multiline
                  value={form.alcance}
                  rows ={6}
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
        {props.match.url.includes('edit') ? 
      <div className={classes.containerButton}>
          {/* Modal Indicadores */}
          <Modal
            estado={modalIndicator}
            cambiarEstado={setmodalIndicator}
            titulo={"Agregar Indicadores "}
            mostrarHeader={true}

          >
            <Indicators
            id={decrypt(props.match.params.id)}
            token={token}
            />
          </Modal>
          {/* Modal Objetivos */}
          <Modal
            estado={modalObjective}
            cambiarEstado={setmodalObjective}
            titulo={"Agregar objetivo "}
            mostrarHeader={true}

          >
            <Objectives
            id={decrypt(props.match.params.id)}
            token={token}
            />
          </Modal>
          {/* Modal Entregables */}
          <Modal
            estado={modalDeliverable}
            cambiarEstado={setmodalDeliverable}
            titulo={"Agregar Entregables "}
            mostrarHeader={true}

          >
            <Deliverables
            id={decrypt(props.match.params.id)}
            token={token}
            />
          </Modal>
      </div>
      :null     
      }        
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
