import React, { useState } from "react";
import { connect } from "react-redux";
import { setToken } from "../../actions";
import {
  makeStyles,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
} from "@material-ui/core";
import api from "../../api";
import Backdrop from "../../components/Backdrop";
import Swal from "sweetalert2";
//import HomeBackground from "../../assets/img/Login.jpg";

function ForgetPassword(props) {
  const { setToken } = props;
  const classes = useStyles();
  const [form, setForm] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInput = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    api
      .post("/user/forgetPassword", form)
      .then((res) => {
        setLoading(false);
        if (res.data.success) {
          setToken(res.data.token);
          Swal.fire({
            icon: "success",
            title: "Mensaje enviado",
            text: "Revise su bandeja de entrada.",
            showConfirmButton: false,
            timer: 3000,
          }).then(() => {
            props.history.push("/sign-in");
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
          text: "Ha ocurrido un error. Intenta nuevamente.",
          showConfirmButton: false,
          timer: 3000,
        });
      });
  };

  return (
    <div className="App">
      <div className={`App-header ${classes.background}`}>
        <Card className={classes.card}>
          <CardContent>
            <Typography
              component="h1"
              variant="h5"
              className={classes.textField}
              gutterBottom
            >
              Recuperar tu contraseña
            </Typography>
            <Typography>
              Para recuperar tu cuenta ingresa tu correo electrónico y
              posteriormente se le enviará un mensaje.
            </Typography>
            <Typography>
              Si no encuentra el mensaje tal vez esté en la bandeja de correos
              no deseados.
            </Typography>
            <form className={classes.root} onSubmit={handleSubmit}>
              <TextField
                required
                fullWidth
                variant="outlined"
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
              <div className={`text-center ${classes.root}`}>
                <Button
                  variant="contained"
                  color="primary"
                  className={`my-2 ${classes.button}`}
                  type="submit"
                >
                  Enviar
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  className={`my-2 ${classes.button}`}
                  onClick={() => props.history.push("/sign-in")}
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
      margin: "1em 6em 0 6em",
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

const mapDispatchToProps = {
  setToken,
};

export default connect(null, mapDispatchToProps)(ForgetPassword);
