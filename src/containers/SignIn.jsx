import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { loginRequest, setPermissions, setToken } from "../actions";
import {
  makeStyles,
  Grid,
  Button,
  CssBaseline,
  Paper,
  Typography,
  Link,
  TextField,
} from "@material-ui/core";
import axios from "../api";
import Swal from "sweetalert2";
import HomeBackground from "../assets/img/fondo.jpg";
import Backdrop from "../components/Backdrop";

function SignIn(props) {
  const { user, loginRequest, setPermissions, setToken } = props;
  const history = useHistory();
  const classes = useStyles();
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);

  if (Object.keys(user || {}).length > 0) {
    if (user?.id_grupos_usuarios === 1 || user?.id_grupos_usuarios === 2) {
      history.push("/users");
    } else {
      history.push("/type");
      window.location.reload();
    }
  }

  const handleInput = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post(`/user/signin`, form)
      .then((res) => {
        if (res.data.user.success) {
          loginRequest(res.data?.user?.user);
          setPermissions(res.data?.user?.permissions);
          setToken(res.data?.user?.token);
          if (
            res.data?.user?.user?.id_grupos_usuarios === 1 ||
            res.data?.user?.user?.id_grupos_usuarios === 2
          ) {
            history.push("/users");
          } else {
            history.push("/reserve/spots");
            window.location.reload();
          }
          setLoading(false);
        } else {
          setLoading(false);
          Swal.fire({
            icon: "error",
            text: res.data.user.message,
            showConfirmButton: false,
            timer: 3000,
          });
        }
      })
      .catch((error) => {
        setLoading(false);
        Swal.fire({
          icon: "error",
          text: "Error al iniciar sesión.",
          showConfirmButton: false,
          timer: 3000,
        });
      });
  };

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} md={7} className={classes.image}>
        {/* <Typography component="h1" variant="h4" className={classes.textField}>
          Aprende a desarrollar mejores prácticas para el Aula
        </Typography> */}
      </Grid>
      <Grid item xs={12} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <div className={classes.containerLogo}>
            {/* <img alt="logo" src={Logo} /> */}
          </div>
          <Grid container>
            <Grid item xs={12}>
              <Typography
                component="h1"
                variant="h4"
                style={{ fontWeight: "bolder", letterSpacing: "-1px" }}
              >
                Acceder
              </Typography>
            </Grid>
          </Grid>
          <form className={classes.form} onSubmit={handleSubmit}>
            <TextField
              required
              fullWidth
              variant="outlined"
              margin="normal"
              label="Correo electrónico"
              name="email"
              autoComplete="email"
              type="email"
              onChange={handleInput}
              InputProps={{
                classes: {
                  root: classes.container__input_root,
                },
              }}
            />
            <TextField
              required
              fullWidth
              variant="outlined"
              margin="normal"
              label="Contraseña"
              name="password"
              autoComplete="current-password"
              type="password"
              onChange={handleInput}
              InputProps={{
                classes: {
                  root: classes.container__input_root,
                },
              }}
            />
            <Button
              color="primary"
              type="submit"
              variant="contained"
              className={classes.submit}
            >
              Iniciar sesión
            </Button>
            <Grid container>
              <Grid item xs>
                <Link
                  href="#"
                  variant="body2"
                  onClick={() => history.push("/account/forget")}
                  color="primary"
                  style={{ fontWeight: "bolder" }}
                >
                  ¿Olvidaste la contraseña?
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Grid>
      <Backdrop loading={loading} />
    </Grid>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  image: {
    backgroundImage: `url(${HomeBackground})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    margin: theme.spacing(16, 6),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    [theme.breakpoints.up("md")]: {
      margin: theme.spacing(17, 6),
    },
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(2, 0, 2),
    width: "13em",
    fontWeight: "bolder",
    borderRadius: "10px",
  },
  container__input_root: {
    borderRadius: "10px",
  },
  containerLogo: {
    margin: "-3em 0 3em 0",
  },
  textField: {
    margin: "11em 1em 0 1em",
    color: theme.palette.background.main,
    fontWeight: "bolder",
    fontSize: "42px",
    textShadow: "2px 2px 2px black",
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
}));

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToprops = {
  loginRequest,
  setPermissions,
  setToken,
};

export default connect(mapStateToProps, mapDispatchToprops)(SignIn);
