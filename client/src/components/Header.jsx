import React from "react";
import { AppBar, Button, IconButton, Toolbar, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  greencolor: {
    backgroundColor: "green",
  },
}));

function Header() {
  const classes = useStyles();
  return (
    <div>
      <AppBar position="static" className={classes.greencolor}>
        <Toolbar>
          <Link to="/">
            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
              MemeVerse
            </IconButton>
          </Link>
          <Typography variant="h6" className={classes.title}></Typography>
          <Link to="/signup">
            <Button color="inherit">SignUp</Button>
          </Link>
          <Link to="/signin">
            <Button color="inherit">SignIn</Button>
          </Link>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Header;
