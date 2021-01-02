import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import { Link, useHistory } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  image: {
    backgroundImage: "url(https://source.unsplash.com/random)",
    backgroundRepeat: "no-repeat",
    backgroundColor: theme.palette.type === "light" ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  blue: {
    color: "blue",
  },
}));

export default function SignUp() {
  const classes = useStyles();
  const history = useHistory();

  const [openOTP, setOpenOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const handleOTP = () => {
    setOpenOTP(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== password2) {
      console.log("Password  don't match");
    } else {
      handleOTP();
      axios
        .post("/api/v1/auth/signup/email", {
          name: fullName,
          email: email,
          password: password,
        })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleToken = (e) => {
    e.preventDefault();
    if (otp !== "") {
      axios
        .post("/api/v1/auth/email/verify", {
          email,
          otp,
        })
        .then((response) => {
          console.log(response);
          const userId = response.data.data._id;
          localStorage.setItem("userId", userId);
          history.push("/sharememe");
        })
        .then((error) => {
          console.log(error);
        });
    }
  };

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            Sign Up
          </Typography>
          <form className={classes.form} noValidate onSubmit={(e) => handleSubmit(e)}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              label="Full Name"
              name="full_name"
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              name="password2"
              label="Password"
              type="password"
              id="password2"
              autoComplete="current-password"
            />
            <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
              Sign Up
            </Button>
          </form>
          <Grid container>
            <Grid item>
              <Link to="/signin" variant="body2" className={classes.blue}>
                {"I have an account? Sign In"}
              </Link>
            </Grid>
          </Grid>
          <br /> <br />
          {openOTP && (
            <>
              <form onSubmit={(e) => handleToken(e)}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  id="otp"
                  label="Give OTP"
                  name="otp"
                  autoFocus
                />
                <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
                  Verify
                </Button>
              </form>
            </>
          )}
        </div>
      </Grid>
    </Grid>
  );
}
