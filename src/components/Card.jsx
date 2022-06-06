import * as React from "react";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
} from "@material-ui/core";

export default function MediaCard(props) {
  const { img, name, action, description = "" } = props;
  return (
    <Card style={{minHeight:250}}>
      <CardMedia component="img" height="140" image={img} alt="card photo" />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {name}
        </Typography>
        <Typography gutterBottom variant="body2" component="div">
          {description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          style={{ margin: "0 auto" }}
          onClick={action}
          variant="contained"
          color="primary"
          size="small"
        >
          Seleccionar
        </Button>
      </CardActions>
    </Card>
  );
}
