import { CardMedia, Container, Grid, List, ListItem, ListItemText, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import axios from "axios";

const useStyles = makeStyles({
  media: {
    height: 140,
  },
});

function Item() {
  const classes = useStyles();
  const [post, setPost] = useState([]);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    let url = window.location.pathname;
    url = url.replace("/items/", "");
    console.log(url);

    axios
      .get(`/api/v1/posts/${url}`)
      .then((res) => {
        let data = res.data.data;
        setPost(data);

        let cmt = res.data.data.comments;
        setComments(cmt);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <Container fixed>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <CardMedia className={classes.media} component="img" image={post.pictureURL} height="300" title={post.name} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="h3" color="textSecondary">
            {post.name}
          </Typography>
          <Typography variant="body1">{post.description}</Typography>
        </Grid>
      </Grid>

      <br />
      <br />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <List>
            {comments.map((comment) => {
              <ListItem alignItems="flex-start" key={comment._id}>
                <ListItemText>
                  <Typography variant="h6"> {comment.user.name} </Typography>
                  <Typography component="span" variant="body2">
                    {comment.text}
                  </Typography>
                </ListItemText>
              </ListItem>;
            })}
          </List>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Item;
