import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { setBreadcrumps } from "../../../actions";
import {
  makeStyles,
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  Divider,
} from "@material-ui/core";
import Swal from "sweetalert2";
import Header from "../../../components/Header";
import Backdrop from "../../../components/Backdrop";
import axios from "../../../api";
import { decrypt } from "../../../utils/crypt";

function FormGroup(props) {
  const { setBreadcrumps, userId, permission, token } = props;
  const classes = useStyles();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
  });

  useEffect(() => {
    if (permission.includes(2) || permission.includes(3)) {
      if (props.match.params.id) {
        getGroup();
        setBreadcrumps([
          { name: "Configuración" },
          { name: "Grupos de usuarios", route: "/userGroups" },
          { name: "Editar" },
        ]);
      } else {
        setBreadcrumps([
          { name: "Configuración" },
          { name: "Grupos de usuarios", route: "/userGroups" },
          { name: "Crear" },
        ]);
      }
    } else {
      history.push("/");
      window.location.reload();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getGroup = async () => {
    const id = decrypt(props.match.params.id);
    const { data } = await axios.get(`/userGroup/${id}`, {
      headers: { "access-token": token },
    });
    setForm(data.group);
  };

  const handleInput = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleCancel = () => {
    history.push("/userGroups");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    if (!props.match.params.id) {
      axios
        .post(
          `/userGroup/`,
          { ...form, userId },
          {
            headers: { "access-token": token },
          }
        )
        .then((res) => {
          setLoading(false);
          history.push("/userGroups");
          Swal.fire({
            icon: "success",
            text: "Creado exitosamente.",
            showConfirmButton: false,
            timer: 3000,
          });
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
          `/userGroup/${id}`,
          { ...form, userId },
          {
            headers: { "access-token": token },
          }
        )
        .then((res) => {
          setLoading(false);
          history.push("/userGroups");
          Swal.fire({
            icon: "success",
            text: "Editado exitosamente.",
            showConfirmButton: false,
            timer: 3000,
          });
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
    <>
      <Paper elevation={3}>
        <Header
          search={false}
          buttonText={"Volver"}
          buttonRoute={"/userGroups"}
        />
        <Divider />
        <div className={classes.paper}>
          <div className={classes.container}>
            <Typography component="h1" variant="h5">
              {props.match.params.id ? "Editar" : "Crear"} grupo de usuarios
            </Typography>
            <form className={classes.root} onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} lg={12}>
                  <TextField
                    required
                    fullWidth
                    label="Grupo de usuario"
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
      </Paper>
      <Backdrop loading={loading} />
    </>
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
      .filter((data) => data.modulosAcciones?.id_modulos === 1)
      .map((item) => item.modulosAcciones?.id_acciones),
  };
};

const mapDispatchToProps = {
  setBreadcrumps,
};

export default connect(mapStateToProps, mapDispatchToProps)(FormGroup);
