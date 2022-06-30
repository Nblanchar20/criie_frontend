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
  TableBody,
  TableCell,
  TableRow,
  Tooltip,
  IconButton,
} from "@material-ui/core";
import { decrypt,encrypt } from "../../../utils/crypt";
import Header from "../../../components/Header";
import Swal from "sweetalert2";
import Backdrop from "../../../components/Backdrop";
import axios from "../../../api";
import Table from "../../../components/Table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import DeleteIcon from "@material-ui/icons/HighlightOff";

function FormUser(props) {
  const { userId, setBreadcrumps, groupId, permission, token } = props;
  const classes = useStyles();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState([]);
  const [filtro, setFiltro] = useState([]);
  const [error, setError] = useState({});
  const id=decrypt(props.match.params.id);
  const [form, setForm] = useState({
    nombre: "",
    descripcion:"",
    id_proyectos:id,
  });

  useEffect(() => {
    
      getProject();
      getDeliverables();      
      setBreadcrumps([
        { name: "Proyecto", route: "/projects" },
        { name: "Entregables"},
      ]);
      if (props.match.url.includes('edit')) {
        getDeliverable();
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getDeliverables = async () => {
    try {
        const { data } = await axios.post(
          `/deliverable/getDeliverables`,
          {"id_proyectos":id},
          {
            headers: { "access-token": token },
          }
        );
          setFiltro(data.deliverables);
      } catch (error) {
        history.push(`/projects`);
        window.location.reload();
      }
    };

  const getDeliverable = async () => {
    try {
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

  const getProject = async () => {
    try {
      const { data } = await axios.get(`/project/${id}`, {
        headers: { "access-token": token },
      });
        setProject(data.project);
    } catch (error) {
      history.push(`/projects`)
      window.location.reload();
    }
  };

  const handleClick = (e, id, action) => {
    switch (action) {
      case "delete":
        //modalDelete(id);
        break;
      case "edit":
        //history.push(`/users/edit/${encrypt(id)}`);
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

  const handleCancel = () => {
    history.push("/objectives");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
      if (!props.match.url.includes('edit')) {
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
              getDeliverables();
              setForm({
                nombre: "",
                descripcion:"",
                id_proyectos:id,
              })
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
      <Header search={false}      
      button={true} 
      buttonText={"Indicadores"}
      buttonRoute={`/indicators/create/${encrypt(id)}`}
      />
      <Divider />
      <div className={classes.paper}>
        <div className={classes.container}>
          <Typography component="h1" variant="h5">
            {project.nombre} 
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
      <Typography component="h1" variant="h5" align="center">
            Lista Objetivos
      </Typography>
      <Table columns={columns} rows={filtro}>
        <TableBody>
          {filtro?.length > 0 ? (
            <>
              {filtro
                .map((row, index) => (
                  <TableRow key={`row${index}`}>
                    <TableCell align="center">{row.nombre}</TableCell>
                    <TableCell align="center">{row.descripcion}</TableCell>
                    <TableCell align="center">
                        <Tooltip title="Editar">
                          <IconButton
                            aria-label="edit"
                            onClick={(e) => handleClick(e, row.id, "edit")}
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
