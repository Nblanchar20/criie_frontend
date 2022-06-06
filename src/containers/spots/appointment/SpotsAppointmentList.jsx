import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { Paper, Grid, makeStyles } from "@material-ui/core";
import { setBreadcrumps } from "../../../actions";
import { encrypt } from "../../../utils/crypt";
import Header from "../../../components/Header";
import axios from "../../../api";
import Card from "../../../components/Card";

function SpotsAppointmentList(props) {
  const { setBreadcrumps, permission, token } = props;
  const history = useHistory();
  const classes = useStyles();
  const [filtro, setFiltro] = useState([]);

  useEffect(() => {
    if (permission.includes(1)) {
      getSpots();
      setBreadcrumps([{ name: "Espacios" }, { name: "Reserva de espacios" }]);
    } else {
      history.push("/");
      window.location.reload();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getSpots = async () => {
    const { data } = await axios.post(
      `/spot/getSpots`,
      {},
      {
        headers: { "access-token": token },
      }
    );
    setFiltro(data?.spots);
  };

  const handleClick = (e, id, action) => {
    switch (action) {
      case "select":
        history.push(`/reserve/spot/${encrypt(id)}`);
        break;
      default:
        break;
    }
  };

  return (
    <Paper elevation={3}>
      <div className={classes.paper}>
        <div className={classes.container}>
          <Header search={false} />
          <Grid container spacing={2}>
            {filtro.map((row) => (
              <Grid item xs={12} sm={4} key={`row${row.id}`}>
                <Card
                  name={row.nombre}
                  img={`${axios.defaults.baseURL}${row.url_imagen}`}
                  action={(e) => {
                    handleClick(e, row.id, "select");
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </div>
      </div>
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
    page: state.page,
    rowsPerPage: state.rowsPerPage,
    token: state.token,
    permission: (state.permission || [])
      .filter((data) => data.modulosAcciones?.id_modulos === 10)
      .map((item) => item.modulosAcciones?.id_acciones),
    groupId: state.user.id_grupos_usuarios,
  };
};

const mapDispatchToProps = {
  setBreadcrumps,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SpotsAppointmentList);
