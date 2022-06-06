import React, { useState, useEffect, Fragment } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { setBreadcrumps } from "../../actions";
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
import api from "../../api";
import Appbar from "../../components/Appbar";

function ChangePassProfile(props) {
  const { userId, setBreadcrumps, token } = props;
  const classes = useStyles();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [form, setForm] = useState({
    currentPassword: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    //getUser();
    setBreadcrumps([{ name: "Cambiar contraseña" }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInput = (event) => {
    if (event.target.name === "password") {
      if (event.target.value.length >= 6 || event.target.value === "") {
        setError({ ...error, [event.target.name]: false });
      } else {
        setError({ ...error, [event.target.name]: true });
      }
    }

    if (event.target.name === "confirmPassword") {
      if (event.target.value === form.password || event.target.value === "") {
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
    const id = decrypt(props.match.params.id);
    setLoading(true);
    if (form.password === form.confirmPassword) {
      api
        .put(
          `/user/changePassword/${id}`,
          { ...form, userId },
          { headers: { "access-token": token } }
        )
        .then((res) => {
          setLoading(false);
          if (res.data.userUpdated.success) {
            Swal.fire({
              icon: "success",
              text: "Contraseña actualizada exitosamente.",
              showConfirmButton: false,
              timer: 3000,
            }).then(() => {
              history.push("/users");
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
            text: "Contraseña actual incorrecta",
            showConfirmButton: false,
            timer: 3000,
          });
        });
    }
  };

  return (
    <Fragment>
      <Appbar />
      <Header search={false} buttonText={"Volver"} buttonRoute={"/users"} />
      <Divider />
      <div className={classes.paper}>
        <div className={classes.container}>
          <Typography component="h1" variant="h5">
            Cambiar contraseña
          </Typography>
          <form className={classes.root} onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Contraseña actual"
                  name="currentPassword"
                  variant="outlined"
                  type="password"
                  onChange={handleInput}
                  InputProps={{
                    classes: {
                      root: classes.container__input_root,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Nueva contraseña"
                  name="password"
                  variant="outlined"
                  type="password"
                  onChange={handleInput}
                  error={error.password}
                  helperText={
                    error.password && "Solo se permite mínimo 6 caracteres."
                  }
                  InputProps={{
                    classes: {
                      root: classes.container__input_root,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Confirmar contraseña"
                  name="confirmPassword"
                  variant="outlined"
                  type="password"
                  onChange={handleInput}
                  error={error.confirmPassword}
                  helperText={
                    error.confirmPassword && "Las contraseñas no coinciden."
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
                disabled={error.password || error.confirmPassword}
                variant="contained"
                color="primary"
                className={classes.button}
                type="submit"
              >
                Aceptar
              </Button>
              <Button
                variant="contained"
                color="primary"
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
    [theme.breakpoints.up("sm")]: {
      width: "60%",
    },
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
  };
};

const mapDispatchToProps = {
  setBreadcrumps,
};

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassProfile);
