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
  setPage,
  setExpanded,
  setSelected,
  setToken,
} from "../actions";
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import KeyIcon from '@mui/icons-material/Key';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import Tooltip from "@mui/material/Tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { encrypt } from "../utils/crypt";
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

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const toLink = (ruta) => {
    setPage(0);
    setDrawer(false);
    history.push(ruta);
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
          {/* <AccountCircle color="primary" /> */}
          <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: "#212121" }}>{`${user?.nombres[0]?.toUpperCase()}${user?.apellidos[0]?.toUpperCase()}`}</Avatar>
          </IconButton>
        </Tooltip>
          <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem>
          <Avatar />
          Bienvenido<br/>
          {`${user?.nombres?.toUpperCase()} ${user?.apellidos?.toUpperCase()}`}
        </MenuItem>
        <Divider />
        <MenuItem
        onClick={() => toLink(`/profile/edit/${encrypt(user.id)}`)}
        >
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon> Editar Perfil
        </MenuItem>
        <MenuItem
        onClick={() =>
          toLink(`/profile/password/${encrypt(user.id)}`)
        }
        >
          <ListItemIcon>
            <KeyIcon fontSize="small" />
          </ListItemIcon>
          Cambiar Contraseña
        </MenuItem>
        <MenuItem onClick={handleSesion}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
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
