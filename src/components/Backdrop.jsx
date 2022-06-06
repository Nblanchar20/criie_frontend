import React from "react";
import { Backdrop, CircularProgress, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 10000,
    color: "#fff",
  },
}));

const BackdropComponent = (props) => {
  const { loading = false } = props;
  const classes = useStyles();
  return (
    <Backdrop className={classes.backdrop} open={loading}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default BackdropComponent;