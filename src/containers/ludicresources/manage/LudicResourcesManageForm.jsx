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
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Typography,
} from "@material-ui/core";
import { decrypt } from "../../../utils/crypt";
import Header from "../../../components/Header";
import Swal from "sweetalert2";
import Backdrop from "../../../components/Backdrop";
import axios from "../../../api";
import Dropzone from "../../../components/Dropzone";
function LudicResourcesManageForm(props) {
  const { setBreadcrumps, permission, token } = props;
  const classes = useStyles();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [spots, setSpots] = useState([]);
  const [photo, setPhoto] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    id_espacios:""
  });

  useEffect(() => {
    if (permission.includes(2) || permission.includes(3)) {
      getSpots();
      if (props.match.params.id) {
        getLudicResource();
        setBreadcrumps([
          { name: "Recursos Lúdicos" },
          { name: "Gestión de recursos lúdicos", route: "/ludic" },
          { name: "Editar" },
        ]);
      } else {
        setBreadcrumps([
          { name: "Recursos Lúdicos" },
          { name: "Gestión de recursos lúdicos", route: "/ludic" },
          { name: "Crear" },
        ]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getLudicResource = async () => {
    try {
      const id = decrypt(props.match.params.id);
      const { data } = await axios.get(`/ludicResources/${id}`, {
        headers: { "access-token": token },
      });
      setPhoto([
        {
          ruta: data.ludicResource.url_imagen,
          id: data.ludicResource.url_imagen,
        },
      ]);
      setForm(data.ludicResource);
    } catch (error) {
      history.push("/ludic");
      window.location.reload();
    }
  };

  const getSpots = async () => {
    try {
      const { data } = await axios.post(
        `/spot/getSpots`,
        {},
        {
          headers: { "access-token": token },
        }
      );
      setSpots(data.spots);
    } catch (error) {
      history.push("/ludic");
      window.location.reload();
    }
  };

  const handleInputForm = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleCancel = () => {
    history.push("/ludic");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!props.match.params.id) {
      axios
        .post(
          `/ludicResources/`,
          {
            ...form,
            url_imagen: "",
          },
          {
            headers: { "access-token": token },
          }
        )
        .then(async (res) => {
          setLoading(false);
          if (res.data.created) {
            const formFiles = new FormData();
            formFiles.append("file", photo[0]);
            let id = res.data.created;
            let ruta = await axios
              .post(`/file/${"archivos_recursos_ludicos"}/${id}`, formFiles, {
                headers: { "access-token": token },
              })
              .then((res) => {
                if (res.data.success) return res.data.ruta;
              });
            axios
              .put(
                `/ludicResources/${id}`,
                {
                  url_imagen: ruta,
                },
                {
                  headers: { "access-token": token },
                }
              )
              .then(async (res) => {
                if (res.data.updated) {
                  history.push("/ludic");
                  Swal.fire({
                    icon: "success",
                    text: "Recurso lúdico creado correctamente",
                    showConfirmButton: false,
                    timer: 3000,
                  });
                } else {
                  history.push("/ludic");
                  Swal.fire({
                    icon: "error",
                    text: "Se creó el recurso lúdico, mas no fue posible anexarle la imagen subida",
                    showConfirmButton: false,
                    timer: 3000,
                  });
                }
              });
          } else {
            Swal.fire({
              icon: "error",
              text: res.data.created.message,
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
      let updateForm = { ...form };
      const id = decrypt(props.match.params.id);
      if (!photo[0].id) {
        let formFiles = new FormData();
        formFiles.append("file", photo[0]);
        let ruta = await axios
          .post(`/file/${"archivos_asesores"}/${id}`, formFiles, {
            headers: { "access-token": token },
          })
          .then((res) => {
            if (res.data.success) return res.data.ruta;
          });
        updateForm.url_imagen = ruta;
      }
      axios
        .put(
          `/ludicResources/${id}`,
          { ...updateForm },
          {
            headers: { "access-token": token },
          }
        )
        .then((res) => {
          setLoading(false);
          if (res.data.updated) {
            history.push("/ludic");
            Swal.fire({
              icon: "success",
              text: "Editado exitosamente.",
              showConfirmButton: false,
              timer: 3000,
            });
          } else {
            Swal.fire({
              icon: "error",
              text: res.data.updated.message,
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
            {props.match.params.id ? "Editar" : "Crear"} recurso lúdico
          </Typography>
          <Divider />
          <br />
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
                  onChange={handleInputForm}
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
                  multiLine
                  label="Descripción"
                  name="descripcion"
                  value={form.descripcion}
                  variant="outlined"
                  onChange={handleInputForm}
                  InputProps={{
                    classes: {
                      root: classes.container__input_root,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="spotLabel">Espacio</InputLabel>
                  <Select
                    labelId="spotLabel"
                    label="Espacio"
                    value={form.id_espacios}
                    name="id_espacios"
                    onChange={(e) => {
                      handleInputForm(e);
                    }}
                  >
                    <MenuItem value="">
                      <em>Seleccione una opción</em>
                    </MenuItem>
                    {spots
                      .sort((a, b) => (a.nombre > b.nombre ? 1 : -1))
                      .map((e) => (
                        <MenuItem key={e.id} value={e.id}>
                          {e.nombre}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12}>
                <Typography>Imagen recurso lúdico (*)</Typography>
                <Dropzone
                  accept={{
                    "image/*": [".png", ".jpg", ".jpeg"],
                  }}
                  deletable={props.match.params.id ? false : true}
                  specificFiles={1}
                  files={photo}
                  setFiles={setPhoto}
                />
              </Grid>
            </Grid>
            <div className={classes.containerButton}>
              <Button
                disabled={
                  !form.nombre.trim() ||
                  !form.descripcion.trim() ||
                  !`${form.id_espacios}`.trim() ||
                  photo.length === 0
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
    token: state.token,
    permission: (state.permission || [])
      .filter((data) => data.modulosAcciones?.id_modulos === 9)
      .map((item) => item.modulosAcciones?.id_acciones),
  };
};

const mapDispatchToProps = {
  setBreadcrumps,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LudicResourcesManageForm);
