import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { Paper, Grid, makeStyles, Button, Typography } from "@material-ui/core";
import { setBreadcrumps } from "../../../actions";
import { encrypt } from "../../../utils/crypt";
import Header from "../../../components/Header";
import axios from "../../../api";
import Card from "../../../components/Card";

function LudicAppointmentList(props) {
  const { setBreadcrumps, permission, token } = props;
  const history = useHistory();
  const classes = useStyles();
  const [filtro, setFiltro] = useState([]);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [selectedLudic, setSelectedLudic] = useState(null);
  const [ludic, setLudic] = useState([]);

  useEffect(() => {
    if (permission.includes(1)) {
      getSpots();
      setBreadcrumps([
        { name: "Recursos lúdicos" },
        { name: "Reserva de recursos lúdicos" },
      ]);
    } else {
      history.push("/");
      window.location.reload();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedSpot !== null) {
      getLudic();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSpot]);

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

  const getLudic = async () => {
    const { data } = await axios.post(
      `/ludicResources/getLudicResources`,
      { id_espacios: selectedSpot.id },
      {
        headers: { "access-token": token },
      }
    );
    setLudic(data?.ludicResources);
  };

  const handleClick = (e, id, action, row) => {
    switch (action) {
      case "select":
        setSelectedSpot(row);
        break;
      case "unselect":
        setSelectedSpot(null);
        break;
      case "selectLudic":
        setSelectedLudic(row);
        break;
      case "unselectLudic":
        setSelectedLudic(null);
        break;
      case "goReserve":
        history.push(`/reserve/ludic/${encrypt(id)}`);
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
            {!selectedSpot &&
              filtro.map((row) => (
                <Grid item xs={12} sm={4} key={`row${row.id}`}>
                  <Card
                    name={row.nombre}
                    img={`${axios.defaults.baseURL}${row.url_imagen}`}
                    action={(e) => {
                      handleClick(e, row.id, "select", row);
                    }}
                  />
                </Grid>
              ))}
            {selectedSpot && !selectedLudic && (
              <>
                <Grid item xs={12}>
                  <Typography variant="h6" container="div">
                    Recursos lúdicos para {selectedSpot.nombre}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={(e) => {
                      handleClick(e, null, "unselect");
                    }}
                  >
                    Atrás
                  </Button>
                </Grid>

                {ludic.length > 0 ? (
                  ludic.map((row) => (
                    <Grid item xs={12} sm={4} key={`row${row.id}`}>
                      <Card
                        name={row.nombre}
                        description={row.descripcion}
                        img={`${axios.defaults.baseURL}${row.url_imagen}`}
                        action={(e) => {
                          handleClick(e, row.id, "selectLudic", row);
                        }}
                      />
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12}>
                    <Typography align="center" variant="body2">
                      No se ha encontrado ningún recurso lúdico para el espacio
                      seleccionado
                    </Typography>
                  </Grid>
                )}
              </>
            )}
            {selectedLudic && (
              <>
                <Grid item xs={12}>
                  <Typography variant="h6" container="div">
                    Existencias para {selectedLudic.nombre}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={(e) => {
                      handleClick(e, null, "unselectLudic");
                    }}
                  >
                    Atrás
                  </Button>
                </Grid>

                {selectedLudic.existencias.length > 0 ? (
                  selectedLudic.existencias.map((row) => (
                    <Grid item xs={12} sm={4} key={`row${row.id}`}>
                      <Card
                        name={row.codigo_barras}
                        img={`${axios.defaults.baseURL}${selectedLudic.url_imagen}`}
                        action={(e) => {
                          handleClick(e, row.id, "goReserve");
                        }}
                      />
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12}>
                    <Typography align="center" variant="body2">
                      No se ha encontrado ninguna existencia para el recurso
                      lúdico seleccionado
                    </Typography>
                  </Grid>
                )}
              </>
            )}
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
)(LudicAppointmentList);
