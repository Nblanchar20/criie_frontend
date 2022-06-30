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
  TableBody,
  TableCell,
  TableRow,
  Tooltip,
  IconButton,
} from "@material-ui/core";
import { decrypt, encrypt } from "../../utils/crypt";
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
import Projects from "./Projects";


function FormUser(props) {
  const { userId, setBreadcrumps, groupId, permission, token } = props;
  const classes = useStyles();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});;
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
        setBreadcrumps([
          { name: "Proyecto", route: "/projects" },
          { name: "Crear" },
        ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    e.preventDefault();
    setLoading(true);
    console.log("entre")
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
              //history.push("/projects");
              history.push(`/objectives/create/${encrypt(res.data.project)}`);
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
      <Header search={false}
       />
      <Divider />
      <div className={classes.paper}>
        <div className={classes.container}>
          <Typography component="h1" variant="h5">
            Crear Proyecto
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
            {props.match.url.includes('create') ? 
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
            :null}              
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
