import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { setBreadcrumps } from "../../../../actions";
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
import { decrypt } from "../../../../utils/crypt";
import Header from "../../../../components/Header";
import Swal from "sweetalert2";
import Backdrop from "../../../../components/Backdrop";
import axios from "../../../../api";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Table from "../../../../components/Table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import DeleteIcon from "@material-ui/icons/HighlightOff";
import EditActivity from "./edit";
import CreateExpenses from "./expenses/create";
import ListExpenses from "./expenses/list";
import Modal from "../../../../components/Modal";
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import AddCardOutlinedIcon from '@mui/icons-material/AddCardOutlined';


function FormUser(props) {
  const { userId, setBreadcrumps, groupId, permission, token } = props;
  const classes = useStyles();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [idEdit, setIdEdit] = useState(null);
  const [indicator, setIndicator] = useState([]);
  const [modalActivity, setModalActivity] = useState(false);
  const [modalExpense, setModalExpense] = useState(false);
  const [modalListExpense, setModalListExpense] = useState(false);
  const [filtro, setFiltro] = useState([]);
  const [project, setProject] = useState([]);
  const [error, setError] = useState({});
  const [form, setForm] = useState({
    nombre: "",
    descripcion_tecnica: "",
    fecha_inicio: new Date(),
    fecha_fin: new Date(),
    id_indicadores:decrypt(props.match.params.id),
    vp_estado_actividad:1
  });

  useEffect(() => {
    getIndicator();
    getActivities();
      if (props.match.url.includes('edit')) {        
        setBreadcrumps([
          { name: "Configuración" },
          { name: "Proyecto", route: "/projects" },
          { name: "Editar" },
        ]);
      } else {
        setBreadcrumps([
          { name: "Proyecto", route: "/projects" },
          { name: "Crear" },
        ]);
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getIndicator = async () => {
    try {
      const id = decrypt(props.match.params.id);
      const { data } = await axios.get(`/indicator/${id}`, {
        headers: { "access-token": token },
      });
      setIndicator(data.indicator);
    } catch (error) {
      history.push("/projects");
      window.location.reload();
    }
  };

  const getActivities = async () => {
    try {
      const id = decrypt(props.match.params.id);
      const { data } = await axios.post(
        `/activity/getActivities`,
        {"id_indicadores":id},
        {
          headers: { "access-token": token },
        }
      );
        setFiltro(data.activities);
    } catch (error) {
      history.push(`/projects`);
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
    e.preventDefault();
    setLoading(true);
      if (props.match.url.includes('create')) {
        axios
          .post(
            `/activity`,
            { ...form},
            {
              headers: { "access-token": token },
            }
          )
          .then((res) => {
            setLoading(false);
            if (res.data.activity) {
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

  const handleClick = (id, action) => {
    setIdEdit(id)
    switch (action) {
      case "delete":
        //modalDelete(id);
        break;
      case "edit":
        setModalActivity(!modalActivity)
        break;
      case "expense":
        setModalExpense(!modalExpense)
        break;
      case "listExpense":
        setModalListExpense(!modalListExpense)
        break;
      case "create":
        //history.push(`/users/create`);
        break;
      default:
        break;
    }
  };

  const handleSelectEstado= (estado)=>{

    if(estado==1){
      return "Pendiente";
    }
    if(estado==2){
      return "En proceso";
    }
    if(estado==3){
      return "Finalizado";
    }
  }
  return (
    <Paper elevation={0}>
      <Header search={false} buttonText={"Volver"} buttonRoute={"/users"} />
      <Divider />
      <div className={classes.paper}>
        <div className={classes.container}>
          <Typography component="h1" variant="h5">
            {indicator.nombre}
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
              <Grid item xs={12} sm={12}>
                <TextField
                  required
                  fullWidth
                  label="descripcion"
                  name="descripcion_tecnica"
                  multiline
                  value={form.descripcion_tecnica}
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
              <Grid item xs={12} sm={6}>
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
      <Typography component="h1" variant="h5" align="center">
            Lista Actividades
      </Typography>
      <Table columns={columns} rows={filtro}>
        <TableBody>
          {filtro?.length > 0 ? (
            <>
              {filtro
                .map((row, index) => (
                  <TableRow key={`row${index}`}>
                    <TableCell align="center">{row.nombre}</TableCell>
                    <TableCell align="center">{row.descripcion_tecnica}</TableCell>
                    <TableCell align="center">{handleSelectEstado(row.vp_estado_actividad)}</TableCell>
                    <TableCell align="center">
                    <Tooltip title="Agregar Gasto">
                          <IconButton
                            aria-label="edit"
                            onClick={() => handleClick(row.id, "expense")}
                          >
                            <AddCardOutlinedIcon/>
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Lista de Gastos">
                          <IconButton
                            aria-label="edit"
                            onClick={() => handleClick(row.id, "listExpense")}
                          >
                            <PaidOutlinedIcon/>
                          </IconButton>
                        </Tooltip>
                      <Tooltip title="Editar">
                          <IconButton
                            aria-label="edit"
                            onClick={() => handleClick(row.id, "edit")}
                          >
                            <FontAwesomeIcon icon={faEdit} size={"xs"} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton
                            aria-label="delete"
                            onClick={(e) => handleClick(e, row.id, "delete")}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
            </>
          ) : (
            <TableCell align="center" colSpan="8">
              No hay datos registrados
            </TableCell>
          )}
        </TableBody>
      </Table>
      <Modal
        estado={modalActivity}
        cambiarEstado={setModalActivity}
        titulo={"Editar Actividad"}
        mostrarHeader={true}
      >
        <EditActivity
          id={idEdit}
          token={token}
          metodo={getActivities}
        />
      </Modal>
      <Modal
        estado={modalExpense}
        cambiarEstado={setModalExpense}
        titulo={"Agregar Gastos"}
        mostrarHeader={true}
      >
        <CreateExpenses
          id={idEdit}
          token={token}
          metodo={getActivities}
        />
      </Modal>
      <Modal
        estado={modalListExpense}
        cambiarEstado={setModalListExpense}
        titulo={"Lista de Gastos"}
        mostrarHeader={true}
      >
        <ListExpenses
          id={idEdit}
          token={token}
        />
      </Modal>
      <Backdrop loading={loading} />
    </Paper>
  );
}

const columns = [
  {
    id: "name",
    label: "Nombre",
    minWidth: 100,
    align: "center",
  },
  {
    id: "lastname",
    label: "descripción",
    minWidth: 100,
    align: "center",
  },
  
  {
    id: "lastname",
    label: "Estado",
    minWidth: 100,
    align: "center",
  },
  {
    id: "actions",
    label: "",
    minWidth: 10,
    align: "center",
    colSpan: 2,
  },
];

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
