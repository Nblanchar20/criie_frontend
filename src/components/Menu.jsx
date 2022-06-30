import React from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import {
  useTheme,
  makeStyles,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
} from "@material-ui/core";
import {
  Settings,
  Person,
  BarChart,
  Business,
  Toys,
  PersonOutline,
  Book,
} from "@material-ui/icons";
import {
  logoutRequest,
  setPermissions,
  setPage,
  setDrawer,
  setSelected,
  setExpanded,
  setToken,
} from "../actions";
import { encrypt } from "../utils/crypt";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import clsx from "clsx";
/* import Logo from "../assets/img/Logo.png"; */

const Menu = (props) => {
  const {
    logoutRequest,
    setPage,
    setPermissions,
    permission,
    setDrawer,
    expanded,
    selected,
    setSelected,
    user,
    setExpanded,
    setToken,
  } = props;
  const classes = useStyles();
  const history = useHistory();
  const theme = useTheme();

  const toLink = (ruta) => {
    setPage(0);
    setDrawer(false);
    history.push(ruta);
  };

  const handleSesion = () => {
    Swal.fire({
      text: "¿Está seguro que desea salir?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: theme.palette.primary.main,
      confirmButtonText: "Salir",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.value) {
        history.push("/");
        window.location.reload();
        logoutRequest();
        setPermissions();
        setToken();
      }
    });
  };

  const handleChange = (panel) => {
    setExpanded(panel && true);
    setSelected(selected !== panel ? panel : false);
  };

  return (
    <>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: expanded,
          [classes.drawerClose]: !expanded,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: expanded,
            [classes.drawerClose]: !expanded,
          }),
        }}
      >
        <div className={classes.toolbar}>
          {/* <img alt="logo" src={Logo} width="90%" /> */}
        </div>
        <Divider className={classes.divider} />
        <div>
          <List className={classes.list}>
              <>
                <ListItem button onClick={() => toLink("/users")}>
                  <ListItemIcon>
                    <PersonOutline className={classes.icon} />
                  </ListItemIcon>
                  <ListItemText primary="Usuarios" />
                </ListItem>
              </>
              <>
                <ListItem button onClick={() => toLink("/projects")}>
                  <ListItemIcon>
                    <BarChart className={classes.icon} />
                  </ListItemIcon>
                  <ListItemText primary="Proyectos" />
                </ListItem>
                <ListItem button onClick={() => toLink("/roles")}>
                  <ListItemIcon>
                    <BarChart className={classes.icon} />
                  </ListItemIcon>
                  <ListItemText primary="Roles" />
                </ListItem>
              </>
              {/* <>
                <ListItem button onClick={() => handleChange("panel1")}>
                  <ListItemIcon>
                    <Settings className={classes.icon} />
                  </ListItemIcon>
                  <ListItemText primary="Configuración" />
                </ListItem>
                <Collapse
                  in={selected === "panel1"}
                  timeout="auto"
                  unmountOnExit
                >
                    <List component="div" disablePadding>
                      <ListItem button onClick={() => toLink("/userGroups")}>
                        <ListItemText inset primary="Grupos de usuarios" />
                      </ListItem>
                    </List>
                    <List component="div" disablePadding>
                      <ListItem button onClick={() => toLink("/modules")}>
                        <ListItemText inset primary="Módulos" />
                      </ListItem>
                    </List>
                    <List component="div" disablePadding>
                      <ListItem button onClick={() => toLink("/actions")}>
                        <ListItemText inset primary="Acciones" />
                      </ListItem>
                    </List>
                    <List component="div" disablePadding>
                      <ListItem button onClick={() => toLink("/permissions")}>
                        <ListItemText inset primary="Permisos" />
                      </ListItem>
                    </List>
                    <List component="div" disablePadding>
                      <ListItem button onClick={() => toLink("/parameters")}>
                        <ListItemText inset primary="Parámetros" />
                      </ListItem>
                    </List>
                    <List component="div" disablePadding>
                      <ListItem button onClick={() => toLink("/sessions")}>
                        <ListItemText inset primary="Sesiones" />
                      </ListItem>
                    </List>
                </Collapse>
              </> */}
          </List>
        </div>
      </Drawer>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: "-4em",
    width: "85%",
    height: "100vh",
  },
  drawerOpen: {
    width: 240,
    backgroundColor: theme.palette.primary.main,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    backgroundColor: theme.palette.primary.main,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    //width: theme.spacing(4) + 1,
    [theme.breakpoints.up("sm")]: {
      width: 0,
    },
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    //marginLeft: theme.spacing(1),
    backgroundColor: theme.palette.background.main,
    color: theme.palette.primary.main,
    ...theme.mixins.toolbar,
  },
  text: {
    marginLeft: theme.spacing(1),
  },
  list: {
    color: "#FFF",
  },
  icon: {
    color: "#FFF",
  },
  iconAwesome: {
    marginLeft: ".1em",
    color: "#FFF",
  },
}));

const mapStateToProps = (state) => {
  return {
    expanded: state.expanded,
    selected: state.selected,
    user: state.user,
    permission: (state.permission || [])
      .filter((data) => data.modulosAcciones?.id_acciones === 1)
      .map((item) => item.modulosAcciones?.id_modulos),
  };
};

const mapDispatchToProps = {
  logoutRequest,
  setPage,
  setPermissions,
  setDrawer,
  setSelected,
  setExpanded,
  setToken,
};

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
