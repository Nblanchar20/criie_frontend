import React, { useState, useEffect, Fragment } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { setBreadcrumps, loginRequest } from "../../actions";
import { decrypt } from "../../utils/crypt";
import {
  makeStyles,
  TextField,
  Button,
  Grid,
  Divider,
  Typography,
} from "@material-ui/core";
import Header from "../../components/Header";
import Swal from "sweetalert2";
import Backdrop from "../../components/Backdrop";
import axios from "../../api";
import Appbar from "../../components/Appbar";

function EditProfile(props) {
  const { userId, setBreadcrumps, loginRequest, token } = props;
  const classes = useStyles();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [form, setForm] = useState({
    nombres: "",
    apellidos: "",
    documento: "",
    telefono: "",
    email: "",
  });

  useEffect(() => {
    getUser();
    setBreadcrumps([{ name: "Editar perfil" }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getUser = async () => {
    const id = decrypt(props.match.params.id);
    const { data } = await axios.get(`/user/${id}`, {
      headers: { "access-token": token },
    });
    setForm({
      nombres: data.user?.nombres,
      apellidos: data.user?.apellidos,
      documento: data.user?.documento,
      telefono: data.user?.telefono,
      email: data.user?.email,
    });
  };

  const handleInput = (event) => {
    const email =
      // eslint-disable-next-line no-useless-escape
      /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    const letters = /^[a-zA-ZÀ-ÿ\u00f1\u00d1 ]+$/;
    const document = /^([0-9]{7,10})+$/;
    const tel = /^([0-9]{7,10})+$/;

    if (event.target.name === "nombres" || "apellidos") {
      if (letters.test(event.target.value) || event.target.value === "") {
        setError({ ...error, [event.target.name]: false });
      } else {
        setError({ ...error, [event.target.name]: true });
      }
    }

    if (event.target.name === "documento") {
      if (document.test(event.target.value) || event.target.value === "") {
        setError({ ...error, [event.target.name]: false });
      } else {
        setError({ ...error, [event.target.name]: true });
      }
    }

    if (event.target.name === "telefono") {
      if (tel.test(event.target.value) || event.target.value === "") {
        setError({ ...error, [event.target.name]: false });
      } else {
        setError({ ...error, [event.target.name]: true });
      }
    }

    if (event.target.name === "email") {
      if (email.test(event.target.value) || event.target.value === "") {
        setError({ ...error, [event.target.name]: false });
      } else {
        setError({ ...error, [event.target.name]: true });
      }
    }

    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleCancel = () => {
    history.push("/users");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const id = decrypt(props.match.params.id);
    axios
      .put(
        `/user/${id}`,
        { ...form, userId },
        { headers: { "access-token": token } }
      )
      .then((res) => {
        setLoading(false);
        if (res.data.userUpdated.success) {
          loginRequest(res.data.userUpdated.userUpdated);
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
  };

  return (
    <Fragment>
      <Appbar />
      <Header search={false} buttonText={"Volver"} buttonRoute={"/users"} />
      <Divider />
      <div className={classes.paper}>
        <div className={classes.container}>
          <Typography component="h1" variant="h5">
            Editar perfil
          </Typography>
          <form className={classes.root} onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <TextField
                  required
                  fullWidth
                  label="Nombres"
                  name="nombres"
                  value={form.nombres}
                  variant="outlined"
                  onChange={handleInput}
                  error={error.nombres}
                  helperText={error.nombres && "Solo se permite letras."}
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
                  label="Apellidos"
                  name="apellidos"
                  value={form.apellidos}
                  variant="outlined"
                  onChange={handleInput}
                  error={error.apellidos}
                  helperText={error.apellidos && "Solo se permite letras."}
                  InputProps={{
                    classes: {
                      root: classes.container__input_root,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Documento"
                  name="documento"
                  value={form.documento}
                  variant="outlined"
                  onChange={handleInput}
                  error={error.documento}
                  helperText={
                    error.documento &&
                    "Solo se permite números entre 7 y 10 dígitos."
                  }
                  InputProps={{
                    classes: {
                      root: classes.container__input_root,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Teléfono"
                  name="telefono"
                  type="tel"
                  value={form.telefono}
                  variant="outlined"
                  onChange={handleInput}
                  error={error.telefono}
                  helperText={
                    error.telefono &&
                    "Solo se permite números de hasta 10 dígitos."
                  }
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
                  label="Correo electrónico"
                  name="email"
                  type="email"
                  value={form.email}
                  variant="outlined"
                  onChange={handleInput}
                  error={error.email}
                  helperText={
                    error.email && "El correo electrónico es inválido."
                  }
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
                disabled={
                  error.nombres ||
                  error.apellidos ||
                  error.documento ||
                  error.telefono ||
                  error.email
                }
                variant="contained"
                className={classes.button}
                type="submit"
                color="primary"
              >
                Guardar
              </Button>
              <Button
                variant="contained"
                className={classes.button}
                onClick={handleCancel}
                color="primary"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </div>
      <Backdrop loading={loading} />
    </Fragment>
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
  label: {
    display: "flex",
    justifyContent: "start",
  },
  container__input_root: {
    borderRadius: "10px",
  },
}));

const mapStateToProps = (state) => {
  return {
    userId: state.user.id,
    token: state.token,
  };
};

const mapDispatchToProps = {
  setBreadcrumps,
  loginRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);
