import React from "react";
import { useHistory } from "react-router-dom";
import { makeStyles, Breadcrumbs, Typography, Link } from "@material-ui/core";

function Breadcrumps(props) {
  const { crumps } = props;
  const classes = useStyles();
  const history = useHistory();

  if (!crumps) return;

  return (
    <div className={classes.root}>
      <Breadcrumbs
        color="primary"
        aria-label="breadcrumb"
        style={{ fontWeight: "bold", color: "#000" }}
      >
        {crumps.map((crump) => {
          if (!crump.route) {
            return (
              <Typography
                key={crump.name}
                color="primary"
                style={{ fontWeight: "bold", color: "#000" }}
              >
                {crump.name}
              </Typography>
            );
          } else {
            return (
              <Link
                color="primary"
                key={crump.name}
                className={classes.link}
                onClick={() => history.push(crump.route)}
              >
                {crump.name}
              </Link>
            );
          }
        })}
      </Breadcrumbs>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
  link: {
    cursor: "pointer",
    color: "#000",
  },
}));

export default Breadcrumps;
