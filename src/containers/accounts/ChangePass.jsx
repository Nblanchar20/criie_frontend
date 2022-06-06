import React, { useState } from "react";
import { connect } from "react-redux";
import {
  makeStyles,
  Card,
  CardContent,
  Grid,
  Button,
  Typography,
  TextField,
} from "@material-ui/core";
import { decrypt } from "../../utils/crypt";
import Swal from "sweetalert2";
import Backdrop from "../../components/Backdrop";
import api from "../../api";
/* import HomeBackground from "../../assets/img/Login.jpg"; */

function ChangePassword(props) {
  const { token } = props;
  const classes = useStyles();
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const userId = decrypt(props.match.params.userId);
    setLoading(true);
    if (form.password === form.confirmPassword) {
      api
        .put(`/user/changePassword/forget/${userId}`, { form, token })
        .then((res) => {
          setLoading(false);
          if (res.data.userUpdated.success) {
            Swal.fire({
              icon: "success",
              text: "Contraseña actualizada exitosamente.",
              showConfirmButton: false,
              timer: 3000,
            }).then(() => {
              props.user
                ? props.history.push("/users")
                : props.history.push("/sign-in");
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
            text: "Se ha vencido el tiempo de espera.",
            showConfirmButton: false,
            timer: 3000,
          });
        });
    } else {
      setLoading(false);
      Swal.fire({
        icon: "error",
        text: "Las contraseñas ingresadas no coinciden.",
        showConfirmButton: false,
        timer: 3000,
      });
    }
  };

  return (
    <div className="App">
      <div className={`App-header ${classes.background}`}>
        <Card className={classes.card}>
          <CardContent>
            <Typography variant="h5" className={classes.textField} gutterBottom>
              Cambiar contraseña
            </Typography>
            <form className={classes.root} onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Nueva contraseña"
                    name="password"
                    type="password"
                    variant="outlined"
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
                    type="password"
                    variant="outlined"
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
              <div className={`text-center ${classes.root}`}>
                <Button
                  disabled={error.password || error.confirmPassword}
                  variant="contained"
                  color="primary"
                  className={`my-2 ${classes.button}`}
                  type="submit"
                >
                  Aceptar
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  className={`my-2 ${classes.button}`}
                  onClick={() => {
                    props.history.push("/sign-in");
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        <Backdrop loading={loading} />
      </div>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: "1em",

    [theme.breakpoints.up("md")]: {
      margin: "1em 5em 0 5em",
    },
    [theme.breakpoints.up("sm")]: {
      margin: "1em 4em 0 4em",
    },
  },
  background: {
    //backgroundImage: `linear-gradient(rgba(97, 206, 112, 0.8), rgba(97, 206, 112, 0.8)), url(${HomeBackground})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  },
  card: {
    minWidth: 275,
  },
  button: {
    margin: "0.5em",
    padding: ".5em 2em",
    borderRadius: "10px",
    fontWeight: "bolder",
    [theme.breakpoints.up("md")]: {
      padding: ".5em 3em",
    },
  },
  container__input_root: {
    borderRadius: "10px",
  },
  textField: {
    margin: "1em",
    fontWeight: "bolder",
    letterSpacing: "-1px",
  },
}));

const mapStateToProps = (state) => {
  return {
    user: state.user,
    token: state.token,
  };
};

export default connect(mapStateToProps, null)(ChangePassword);
