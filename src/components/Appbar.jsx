import React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  useTheme,
  makeStyles,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  Typography,
} from "@material-ui/core";
import {
  logoutRequest,
  setPermissions,
  setDrawer,
  setExpanded,
  setSelected,
  setToken,
} from "../actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
/* import { AccountCircle } from "@material-ui/icons"; */
import MenuIcon from "@material-ui/icons/Menu";
import Swal from "sweetalert2";
import clsx from "clsx";
import Sidebar from "./Menu";

const Appbar = (props) => {
  const {
    logoutRequest,
    setPermissions,
    setExpanded,
    expanded,
    setDrawer,
    drawer,
    setSelected,
    user,
    setToken,
  } = props;
  const classes = useStyles();
  const history = useHistory();
  const theme = useTheme();

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
        history.push("/sign-in");
        window.location.reload();
        logoutRequest();
        setPermissions();
        setToken();
      }
    });
  };

  const handleMenuOpen = () => {
    setSelected(expanded === false && false);
    setExpanded(!expanded);
  };

  const handleDrawerOpen = () => {
    setExpanded(true);
    setDrawer(!drawer);
  };

  return (
    <>
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: expanded,
        })}
      >
        <Toolbar>
          <div className={classes.appbar__toolbar_sectionDesktop}>
            <IconButton
              edge="start"
              onClick={handleMenuOpen}
              color="inherit"
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
          </div>

          <div className={classes.appbar__toolbar_sectionMobile}>
            <IconButton
              edge="start"
              onClick={handleDrawerOpen}
              color="inherit"
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
          </div>

          <div className={classes.appbar__toolbar_logocontainer}></div>

          <div className={classes.container_username}>
            <Typography
              align="right"
              style={{ fontWeight: "bolder", color: "white" }}
            >
              {`${user?.nombres?.toUpperCase()} ${user?.apellidos?.toUpperCase()}`}
            </Typography>
          </div>
          {/* <AccountCircle color="primary" /> */}
          <div>
            <IconButton
              aria-label="show more"
              aria-haspopup="true"
              onClick={handleSesion}
              //color="primary"
              style={{ color: "white" }}
            >
              <FontAwesomeIcon icon={faSignOutAlt} size={"sm"} />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="temporary"
        anchor={"left"}
        open={drawer}
        onClose={handleDrawerOpen}
        classes={{
          paper: classes.drawer__paper,
        }}
      >
        <Sidebar />
      </Drawer>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  appbar__toolbar_logocontainer: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    [theme.breakpoints.up("md")]: {
      display: "flex",
      justifyContent: "start",
      width: "100%",
    },
  },
  appbar__toolbar_sectionDesktop: {
    color: "#fff",
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  appbar__toolbar_sectionMobile: {
    display: "flex",
    color: "#fff",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  appbar__toolbar_logocontainer_img: {
    display: "block",
    width: "8em",
    [theme.breakpoints.up("md")]: {
      display: "block",
      width: "10em",
    },
  },
  icon: {
    fontSize: "1em",
    marginRight: ".5em",
  },
  text: {
    margin: "1em .5em 1em 0",
  },
  textMenu: {
    color: theme.palette.primary.main,
  },
  drawer: {
    width: 240,
    flexShrink: 0,
  },
  drawer__paper: {
    width: 240,
    backgroundColor: theme.palette.background.main,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: theme.palette.background.main,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    [theme.breakpoints.up("md")]: {
      marginLeft: 240,
      width: `calc(100% - 240px)`,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
  },
  container_username: {
    width: "100em",
    [theme.breakpoints.up("md")]: {
      width: "30em",
    },
  },
}));

const mapStateToProps = (state) => {
  return {
    drawer: state.drawer,
    expanded: state.expanded,
    user: state.user,
  };
};

const mapDispatchToProps = {
  logoutRequest,
  setPermissions,
  setDrawer,
  setExpanded,
  setSelected,
  setToken,
};

export default connect(mapStateToProps, mapDispatchToProps)(Appbar);
