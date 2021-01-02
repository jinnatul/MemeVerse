import { Button, Container, Grid, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useState, useEffect } from "react";
import axios from "axios";

const useStyles = makeStyles({
  marginTop: {
    marginTop: "20px",
  },
  image: {
    height: 200,
    width: 300,
  },
});

function ShareMeme() {
  const classes = useStyles();
  const [image, setImage] = useState("https://sg4africa.org/wp-content/uploads/blank-00cc00_040004001.png");
  const [imageId, setImageId] = useState("");
  const [postName, setPostName] = useState("");
  const [postDescription, setPostDescription] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const user_id = localStorage.getItem("userId");
    setUserId(user_id);
  }, []);

  const previewImage = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setImage(reader.result);
      }
    };
    reader.readAsDataURL(e.target.files[0]);

    // publish image
    const { files } = document.querySelector('input[type="file"]');
    const formData = new FormData();
    formData.append("file", files[0]);
    formData.append("upload_preset", "ml_default");
    const options = {
      method: "POST",
      body: formData,
    };

    return fetch("https://api.Cloudinary.com/v1_1/dck5ccwjv/image/upload", options)
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setImage(res.url);
        setImageId(res.asset_id);
      })
      .catch((err) => console.log(err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const postInfo = {
      name: postName,
      description: postDescription,
      pictureId: imageId,
      pictureURL: image,
    };
    axios
      .post(`/api/v1/posts/${userId}`, postInfo)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  };

  return (
    <Container fixed className={classes.marginTop}>
      <form onSubmit={(e) => handleSubmit(e)}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              value={postName}
              name="postName"
              onChange={(e) => setPostName(e.target.value)}
              variant="filled"
              label="Name"></TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              value={postDescription}
              onChange={(e) => setPostDescription(e.target.value)}
              variant="filled"
              label="Description"></TextField>
          </Grid>
          <Grid item xs={12}>
            <img src={image} alt="image" className={classes.image} />
          </Grid>
          <Grid item xs={12}>
            <input type="file" name="file" accept="image/*" onChange={previewImage} />
          </Grid>
          <Button type="submit" fullWidth variant="contained" color="primary" className={classes.marginTop}>
            Submit
          </Button>
        </Grid>
      </form>
    </Container>
  );
}

export default ShareMeme;
