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
            {(permission.includes(1) ||
              permission.includes(2) ||
              permission.includes(3) ||
              permission.includes(4) ||
              permission.includes(5) ||
              permission.includes(6) ||
              permission.includes(7)) && (
              <>
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
                  {permission.includes(1) && (
                    <List component="div" disablePadding>
                      <ListItem button onClick={() => toLink("/userGroups")}>
                        <ListItemText inset primary="Grupos de usuarios" />
                      </ListItem>
                    </List>
                  )}
                  {permission.includes(2) && (
                    <List component="div" disablePadding>
                      <ListItem button onClick={() => toLink("/users")}>
                        <ListItemText inset primary="Usuarios" />
                      </ListItem>
                    </List>
                  )}
                  {permission.includes(3) && (
                    <List component="div" disablePadding>
                      <ListItem button onClick={() => toLink("/modules")}>
                        <ListItemText inset primary="Módulos" />
                      </ListItem>
                    </List>
                  )}
                  {permission.includes(4) && (
                    <List component="div" disablePadding>
                      <ListItem button onClick={() => toLink("/actions")}>
                        <ListItemText inset primary="Acciones" />
                      </ListItem>
                    </List>
                  )}
                  {permission.includes(5) && (
                    <List component="div" disablePadding>
                      <ListItem button onClick={() => toLink("/permissions")}>
                        <ListItemText inset primary="Permisos" />
                      </ListItem>
                    </List>
                  )}
                  {permission.includes(6) && (
                    <List component="div" disablePadding>
                      <ListItem button onClick={() => toLink("/parameters")}>
                        <ListItemText inset primary="Parámetros" />
                      </ListItem>
                    </List>
                  )}
                  {permission.includes(7) && (
                    <List component="div" disablePadding>
                      <ListItem button onClick={() => toLink("/sessions")}>
                        <ListItemText inset primary="Sesiones" />
                      </ListItem>
                    </List>
                  )}
                </Collapse>
              </>
            )}
            {permission.includes(8) && (
              <>
                <ListItem button onClick={() => toLink("/approve")}>
                  <ListItemIcon>
                    <PersonOutline className={classes.icon} />
                  </ListItemIcon>
                  <ListItemText primary="Aprobación de usuarios" />
                </ListItem>
              </>
            )}
            {(permission.includes(9) ||
              permission.includes(10) ||
              permission.includes(11)) && (
              <>
                <ListItem button onClick={() => handleChange("panel3")}>
                  <ListItemIcon>
                    <Business className={classes.icon} />
                  </ListItemIcon>
                  <ListItemText primary="Espacios" />
                </ListItem>
                <Collapse
                  in={selected === "panel3"}
                  timeout="auto"
                  unmountOnExit
                >
                  {permission.includes(9) && (
                    <List component="div" disablePadding>
                      <ListItem button onClick={() => toLink("/spots")}>
                        <ListItemText inset primary="Gestión de espacios" />
                      </ListItem>
                    </List>
                  )}
                  {permission.includes(10) && (
                    <List component="div" disablePadding>
                      <ListItem
                        button
                        onClick={() => toLink("/reserves/spots")}
                      >
                        <ListItemText
                          inset
                          primary="Gestión de reservas de espacios"
                        />
                      </ListItem>
                    </List>
                  )}
                  {permission.includes(11) && (
                    <List component="div" disablePadding>
                      <ListItem
                        button
                        onClick={() => toLink("/reserve/spots")}
                      >
                        <ListItemText inset primary="Reserva de espacios" />
                      </ListItem>
                    </List>
                  )}
                </Collapse>
              </>
            )}

            {(permission.includes(12) ||
              permission.includes(13) ||
              permission.includes(14)) && (
              <>
                <ListItem button onClick={() => handleChange("panel4")}>
                  <ListItemIcon>
                    <Toys className={classes.icon} />
                  </ListItemIcon>
                  <ListItemText primary="Recursos lúdicos" />
                </ListItem>
                <Collapse
                  in={selected === "panel4"}
                  timeout="auto"
                  unmountOnExit
                >
                  {permission.includes(12) && (
                    <List component="div" disablePadding>
                      <ListItem button onClick={() => toLink("/ludic")}>
                        <ListItemText
                          inset
                          primary="Gestión de recursos lúdicos"
                        />
                      </ListItem>
                    </List>
                  )}
                  {permission.includes(13) && (
                    <List component="div" disablePadding>
                      <ListItem
                        button
                        onClick={() => toLink("/reserves/ludic")}
                      >
                        <ListItemText
                          inset
                          primary="Gestión de reservas de recursos lúdicos"
                        />
                      </ListItem>
                    </List>
                  )}
                  {permission.includes(14) && (
                    <List component="div" disablePadding>
                      <ListItem button onClick={() => toLink("/reserve/ludic")}>
                        <ListItemText
                          inset
                          primary="Reserva de recursos lúdicos"
                        />
                      </ListItem>
                    </List>
                  )}
                </Collapse>
              </>
            )}

            {permission.includes(15) && (
              <>
                <ListItem button onClick={() => toLink("/reports")}>
                  <ListItemIcon>
                    <BarChart className={classes.icon} />
                  </ListItemIcon>
                  <ListItemText primary="Reportes" />
                </ListItem>
              </>
            )}
            {permission.includes(16) && (
              <>
                <ListItem button onClick={() => toLink("/logs")}>
                  <ListItemIcon>
                    <Book className={classes.icon} />
                  </ListItemIcon>
                  <ListItemText primary="Logs" />
                </ListItem>
              </>
            )}

            <ListItem button onClick={() => handleChange("panel6")}>
              <ListItemIcon>
                <Person className={classes.icon} />
              </ListItemIcon>
              <ListItemText primary="Perfil" />
            </ListItem>
            <Collapse in={selected === "panel6"} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem
                  button
                  onClick={() => toLink(`/profile/edit/${encrypt(user.id)}`)}
                >
                  <ListItemText inset primary="Editar perfil" />
                </ListItem>
              </List>
              <List component="div" disablePadding>
                <ListItem
                  button
                  onClick={() =>
                    toLink(`/profile/password/${encrypt(user.id)}`)
                  }
                >
                  <ListItemText inset primary="Cambiar contraseña" />
                </ListItem>
              </List>
            </Collapse>
            <ListItem button onClick={handleSesion}>
              <ListItemIcon>
                <FontAwesomeIcon
                  icon={faSignOutAlt}
                  size={"lg"}
                  className={classes.iconAwesome}
                />
              </ListItemIcon>
              <ListItemText primary="Cerrar sesión" />
            </ListItem>
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
