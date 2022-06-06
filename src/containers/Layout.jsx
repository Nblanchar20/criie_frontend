import React, { Fragment } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { makeStyles, Grid } from "@material-ui/core";
import { BrowserRouter, Switch } from "react-router-dom";
import Appbar from "../components/Appbar";
import Menu from "../components/Menu";

function Layout(props) {
  const { user, children, expanded } = props;
  const history = useHistory();
  const classes = useStyles();

  if (!user) {
    history.push("/");
  }

  return (
    <BrowserRouter>
      <Fragment>
        <Appbar />
        <div className={expanded ? classes.root_expanded : classes.root}>
          <Grid container spacing={0}>
            <Grid
              item
              xs={false}
              md={expanded ? 2 : false}
              className={classes.menu}
            >
              <Menu />
            </Grid>
            <Grid item xs={12} md={expanded ? 10 : 12}>
              <Switch>{children}</Switch>
            </Grid>
          </Grid>
        </div>
      </Fragment>
    </BrowserRouter>
  );
}

const useStyles = makeStyles((theme) => ({
  root_expanded: {
    marginTop: "4.5em",
    [theme.breakpoints.up(1500)]: {
      marginLeft: "-1.8em",
    },
  },
  root: {
    marginTop: "4.5em",
  },
  menu: {
    backgroundColor: theme.palette.background.main,
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
}));

const mapStateToProps = (state) => {
  return {
    user: state.user,
    expanded: state.expanded,
  };
};

export default connect(mapStateToProps, null)(Layout);