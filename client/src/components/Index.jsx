import React, { useState, useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { Grid } from "@material-ui/core";
import ItemCard from "./ItemCard";
import axios from "axios";

function Index() {
  const [lists, setLists] = useState([]);

  useEffect(() => {
    axios.get("/api/v1/posts").then((response) => {
      setLists(response.data.data);
    });
  }, []);

  return (
    <div>
      <Container fixed>
        <Grid container direction="row" justify="center" alignItems="flex-start">
          <Typography variant="h3">Meme</Typography>
        </Grid>
        <Grid container spacing={3}>
          {lists.map((list) => (
            <Grid item xs={12} sm={6} key={list._id}>
              <ItemCard item={list} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
}

export default Index;
