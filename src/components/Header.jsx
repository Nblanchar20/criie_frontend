import React from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { makeStyles, Grid, Tooltip, Button, Fab } from "@material-ui/core";
import Breadcrumps from "./Breadcrumps";
import Search from "./Search";
import ReloadIcon from "@material-ui/icons/CachedRounded";
import EditIcon from "@material-ui/icons/Edit";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ExportExcel from "./ExportExcel";
import { useState } from "react";
import axios from "../api";
import Swal from "sweetalert2";

function Header(props) {
  const {
    search = false,
    button = false,
    exportButton = false,
    buttonRoute,
    crump,
    tableName,
    items,
    setItems,
    buttonText = "Crear",
    dataToExcel,
    reloadButton = false,
    reload,
    editButton = false,
    routeEditButton,
    backButton = false,
    backRoute,
    createButton = false,
    createRoute,
    addButton = false,
    addClick,
    token,
    ObjectiveButton= false,
    modalObjective,
    setmodalObjective,
    DeliverableButton= false,
    modalDeliverable,
    setmodalDeliverable,
    IndicatorButton= false,
    modalIndicator,
    setmodalIndicator,
    ResponsabilityButton= false,
    modalResponsability,
    setmodalResponsability,
    saveButton,
    form,
    id
  } = props;
  const classes = useStyles({ backButton });
  const history = useHistory();


  const handleSubmit = () => {
    console.log("entre")
        axios
          .post(
            `/project/updateProject/${id}`,
            { ...form},
            {
              headers: { "access-token": token },
            }
          )
          .then((res) => {
            if (res.data.updated) {
              history.push("/projects");
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
            Swal.fire({
              icon: "error",
              text: "No se ha podido editar.",
              showConfirmButton: false,
              timer: 3000,
            });
          });
    
  };
  return (
    <div className={classes.header} variant="outlined">
      <Grid container spacing={0}>
        {backButton && (
          <Grid item xs={1} sm={1}>
            <Fab
              size="small"
              color="primary"
              aria-label="back"
              className={classes.back_button}
              onClick={() => history.push(backRoute)}
            >
              <ArrowBackIcon />
            </Fab>
          </Grid>
        )}
        <Grid item xs={11} sm={backButton ? 5 : 6}>
          <div className={classes.containerCrumps}>
            <Breadcrumps crumps={crump} />
          </div>
        </Grid>
        <Grid
          item
          xs={12}
          sm={button || reloadButton ? 3 : 4}
          className={classes.containerSearch}
        >
          {search && (
            <Search
              tableName={tableName}
              items={items}
              setItems={setItems}
              token={token}
            />
          )}
        </Grid>
        <Grid
          item
          xs={12}
          sm={button || reloadButton ? 3 : 2}
          className={classes.containerSearch}
        >          
          {saveButton && (
            <Button
              color="primary"
              variant="contained"
              className={classes.button}
              onClick={()=> handleSubmit()}
            >
              Guardar
            </Button>
          )}
          {button && (
            <Button
              color="primary"
              variant="contained"
              className={classes.button}
              onClick={() => history.push(buttonRoute)}
            >
              {buttonText}
            </Button>
          )}
          {addButton && (
            <Button
              color="primary"
              variant="contained"
              className={classes.button}
              onClick={() => addClick()}
            >
              A??adir
            </Button>
          )}
          {exportButton && (
            <ExportExcel
              jsonData={dataToExcel?.csvData}
              fileName={dataToExcel?.fileName}
            />
          )}
          {reloadButton && (
            <Tooltip title="Actualizar">
              <Button
                color="primary"
                variant="contained"
                className={classes.button}
                onClick={() => reload()}
              >
                <ReloadIcon />
              </Button>
            </Tooltip>
          )}
          {editButton && (
            <Tooltip title="Editar">
              <Button
                color="primary"
                variant="contained"
                className={classes.button}
                onClick={() => history.push(routeEditButton)}
              >
                <EditIcon />
              </Button>
            </Tooltip>
          )}
          {createButton && (
            <Tooltip title="Crear">
              <Button
                color="primary"
                variant="contained"
                className={classes.button}
                onClick={() => history.push(createRoute)}
              >
                Crear
              </Button>
            </Tooltip>
          )}
          {ObjectiveButton && (
            <>
            <Tooltip title="Objetivo">
            <Button
                color="primary"
                variant="contained"
                className={classes.button}
                onClick={()=>setmodalObjective(!modalObjective)}
              >
                Obj
            </Button>
            </Tooltip>
            </>              
                        
          )}
          {DeliverableButton && (
              <Tooltip title="Entregables">
              <Button
                color="primary"
                variant="contained"
                className={classes.button}
                onClick={()=>setmodalDeliverable(!modalDeliverable)}
              >
                Ent
              </Button> 
              </Tooltip>       
          )}
          {IndicatorButton && (
              <Tooltip title="Indicadores">
              <Button
                color="primary"
                variant="contained"
                className={classes.button}
                onClick={()=>setmodalIndicator(!modalIndicator)}
              >
                Ind
              </Button>
              </Tooltip>       
          )}
          {ResponsabilityButton && (
              <Button
                color="primary"
                variant="contained"
                className={classes.button}
                onClick={()=>setmodalResponsability(!modalResponsability)}
              >
                Responsabilidades
              </Button>       
          )}          
        </Grid>        
      </Grid>
    </div>
    
  );
}

const useStyles = makeStyles((theme) => ({
  header: {
    padding: theme.spacing(2.5),
  },
  containerSearch: {
    display: "flex",
    justifyContent: "center",
    marginBottom: theme.spacing(1),
    [theme.breakpoints.up("sm")]: {
      justifyContent: "flex-end",
    },
  },
  containerCrumps: {
    marginTop: ({ backButton }) => `${backButton ? ".5em" : "0"}`,
    marginLeft: ({ backButton }) => `${backButton ? "1em" : "0"}`,
    [theme.breakpoints.up("sm")]: {
      margin: ({ backButton }) => `.5em 0 0 ${backButton ? "-2em" : "1em"}`,
    },
  },
  button: {
    color: theme.palette.background.main,
    marginRight: theme.spacing(0.8),
    padding: ".5em 3em",
    borderRadius: "10px",
  },
  back_button: {
    margin: "0",
    [theme.breakpoints.up("sm")]: {
      marginLeft: "1em",
    },
  },
}));

const mapStateToProps = (state) => {
  return {
    crump: state.crump || [],
    expanded: state.expanded,
    token: state.token,
  };
};

export default connect(mapStateToProps, null)(Header);
