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
import EditObjectives from"./objectives/edit";
import EditDeliverables from"./deliverables/edit";
import EditIndicators from"./indicators/edit";
import Table from "../../components/Table";
import {FindInPageOutlined } from "@material-ui/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import DeleteIcon from "@material-ui/icons/HighlightOff";


function FormUser(props) {
  const { userId, setBreadcrumps, groupId, permission, token } = props;
  const classes = useStyles();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [modalObjective, setmodalObjective] = useState(false);
  const [modalEditObjective, setmodalEditObjective] = useState(false);
  const [modalEditIndicator, setmodalEditIndicator] = useState(false);
  const [modalEditDeliverable, setmodalEditDeliverable] = useState(false);
  const [modalDeliverable, setmodalDeliverable] = useState(false);
  const [modalIndicator, setmodalIndicator] = useState(false);
  const [error, setError] = useState({});
  const id=decrypt(props.match.params.id);
  const [form, setForm] = useState({});
  const [objetives, setObjectives] = useState({});
  const [indicators, setIndicators] = useState({});
  const [deliverables, setDeliverables] = useState({});
  const [idEdit, setIdEdit] = useState(null);

  useEffect(() => {      
        getProject();
        getObjectives();
        getDeliverables();
        getIndicators();
        setBreadcrumps([
          { name: "Proyecto", route: "/projects" },
          { name: "Editar" },
        ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getProject = async () => {
    try {
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
      history.push("/projects");
      window.location.reload();
    }
  };

  const getObjectives = async () => {
    try {
      const { data } = await axios.post(
        `/objective/getObjectives`,
        {"id_proyectos":id},
        {
          headers: { "access-token": token },
        }
      );
        setObjectives(data.objectives);
        } catch (error) {
        history.push(`/projects`);
        window.location.reload();
        }
    };

    const getIndicators = async () => {
        try {
            const { data } = await axios.post(
              `/indicator/getIndicators`,
              {"id_proyectos":id},
              {
                headers: { "access-token": token },
              }
            );
              setIndicators(data.indicators);
          } catch (error) {
            history.push(`/projects`);
            window.location.reload();
          }
        };

    const getDeliverables = async () => {
        try {
            const { data } = await axios.post(
              `/deliverable/getDeliverables`,
              {"id_proyectos":id},
              {
                headers: { "access-token": token },
              }
            );
              setDeliverables(data.deliverables);
          } catch (error) {
            history.push(`/projects`);
            window.location.reload();
          }
        };

  const handleClick = (idedit, action) => {
    setIdEdit(idedit)
    switch (action) {
      case "delete":
        //modalDelete(id);
        break;
      case "editObjective":
        setmodalEditObjective(!modalEditObjective)
        break;
      case "editIndicator":
        setmodalEditIndicator(!modalEditIndicator)
        break;
      case "editDeliverable":
        setmodalEditDeliverable(!modalEditDeliverable)
        console.log()
        break;
      case "create":
        //history.push(`/users/create`);
        break;
      default:
        break;
    }
  };

  const handleInput = (event) => {
    
    setForm({
      ...form,
      [event.target.name]: event.target.value,
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
      saveButton={true}
      id={id}
      form={form}
      button={true}
      buttonText={"Cerrar"}
      buttonRoute={"/projects"}
       />
      <Divider />
      <div className={classes.paper}>
        <div className={classes.container}>
          <Typography component="h1" variant="h5">
            {form.nombre}
          </Typography>
          <form className={classes.root}>
            <Grid container spacing={2}>
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
              <Grid item xs={12} sm={4}>
              <Tooltip title="Agregar Objetivo">
              <Button
                color="primary"
                variant="contained"
                className={classes.button}
                onClick={()=>setmodalObjective(!modalObjective)}
              >
                +
              </Button>
              </Tooltip>
      <Table columns={columnsObjectives} rows={objetives}>
        <TableBody>
          {objetives?.length > 0 ? (
            <>
              {objetives
                .map((row, index) => (
                  <TableRow key={`row${index}`}>
                    <TableCell align="center">{row.nombre}</TableCell>
                    <TableCell align="center">
                        <Tooltip title="Editar">
                          <IconButton
                            aria-label="edit"
                            onClick={() => handleClick( row.id, "editObjective")}
                          >
                            <FontAwesomeIcon icon={faEdit} size={"xs"} />
                          </IconButton>
                        </Tooltip>
                    </TableCell>
                    <TableCell align="center">
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
              </Grid>
              <Grid item xs={12} sm={4}>
              <Tooltip title="Agregar Entregable">
              <Button
                color="primary"
                variant="contained"
                className={classes.button}
                onClick={()=>setmodalDeliverable(!modalDeliverable)}
              >
                +
              </Button>

              </Tooltip>
      <Table columns={columnsDeliverables} rows={deliverables}>
        <TableBody>
          {deliverables?.length > 0 ? (
            <>
              {deliverables
                .map((row, index) => (
                  <TableRow key={`row${index}`}>
                    <TableCell align="center">{row.nombre}</TableCell>
                    <TableCell align="center">
                        <Tooltip title="Editar">
                          <IconButton
                            aria-label="edit"
                            onClick={() => handleClick(row.id, "editDeliverable")}
                          >
                            <FontAwesomeIcon icon={faEdit} size={"xs"} />
                          </IconButton>
                        </Tooltip>
                    </TableCell>
                    <TableCell align="center">
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
              </Grid>
              <Grid item xs={12} sm={4}>
              <Tooltip title="Agregar Indicadores">                
              <Button
                color="primary"
                variant="contained"
                className={classes.button}
                onClick={()=>setmodalIndicator(!modalIndicator)}
              >
                +
              </Button>
              </Tooltip>
      <Table columns={columnsIndicators} rows={indicators}>
        <TableBody>
          {indicators?.length > 0 ? (
            <>
              {indicators
                .map((row, index) => (
                  <TableRow key={`row${index}`}>
                    <TableCell align="center">{row.nombre}</TableCell>
                    <TableCell align="center">
                        <Tooltip title="Ver Indicador">
                          <IconButton
                            aria-label="edit"
                            onClick={() => history.push(`/activities/create/${encrypt(row.id)}`)}
                          >
                            <FindInPageOutlined />
                          </IconButton>
                        </Tooltip>
                    </TableCell>
                    <TableCell align="center">
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
              </Grid>
            </Grid>              
          </form>          
        </div>
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
            metodo={getIndicators}
            />
          </Modal>
          <Modal
          estado={modalEditIndicator}
          cambiarEstado={setmodalEditIndicator}
          titulo={"Editar Indicador "}
          mostrarHeader={true}
          >
            <EditIndicators
            id={idEdit}
            token={token}
            metodo={getIndicators}
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
            metodo={getObjectives}
            />
          </Modal>
          <Modal
          estado={modalEditObjective}
          cambiarEstado={setmodalEditObjective}
          titulo={"Editar objetivo "}
          mostrarHeader={true}
          >
            <EditObjectives
            id={idEdit}
            token={token}
            metodo={getObjectives}
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
            metodo={getDeliverables}
            />
          </Modal>
          <Modal
          estado={modalEditDeliverable}
          cambiarEstado={setmodalEditDeliverable}
          titulo={"Editar Entregable"}
          mostrarHeader={true}
          >
            <EditDeliverables
            id={idEdit}
            token={token}
            metodo={getDeliverables}
            />
          </Modal>
      </div>
      </div>      
      <Backdrop loading={loading} />
    </Paper>
  );
}

const columnsDeliverables = [
    {
      id: "name",
      label: "Entregables",
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
  const columnsIndicators = [
    {
      id: "name",
      label: "Indicadores",
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
  const columnsObjectives = [
    {
      id: "name",
      label: "Objetivos",
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
