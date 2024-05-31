"use client";
import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import Form from "../../components/Form";
import moment from "moment/moment";
import { useMutation, useQuery, useQueryClient } from "react-query";

export default function Ideas() {
  const [isClicked, setIsClicked] = useState(false);
  const [ideas, setIdeas] = useState([]);
  const titleRef = useRef();
  const descriptionRef = useRef();
  const [isTitle, setIsTitle] = useState(false);
  const [isDescription, setIsDescription] = useState(false);

   // Load ideas from localStorage when component mounts
   useEffect(() => {
    const storedIdeas = JSON.parse(localStorage.getItem("ideas"));
    if (storedIdeas) {
      setIdeas(storedIdeas);
    }
  }, []);

  const addIdea = () => {
    const newIdea = {
      id: Math.floor(Math.random() * 100000000),
      title: titleRef.current.value,
      description: descriptionRef.current.value,
      date: moment().format("MMMM Do YYYY, h:mm:ss a"),
    };
    // Update localStorage
    const updatedIdeas = [...ideas, newIdea];
    localStorage.setItem("ideas", JSON.stringify(updatedIdeas));
    // Update state
    setIdeas(updatedIdeas);
    setIsClicked(false);
    titleRef.current.value = "";
    descriptionRef.current.value = "";
  };
  
  const deleteIdea = (id) => {
    // Update localStorage
    const updatedIdeas = ideas.filter((idea) => idea.id !== id);
    localStorage.setItem("ideas", JSON.stringify(updatedIdeas));
    // Update state
    setIdeas(updatedIdeas);
  };

  const buttonOrNot = isClicked ? (
    <Form>
      <TextField sx={{ minWidth: 250 }} label="Title" inputRef={titleRef} onInput={(e) => e.target.value != "" ? setIsTitle(true) : setIsTitle(false)}/>
      <TextField
        sx={{ minWidth: 250 }}
        label="Description"
        multiline
        rows={10}
        inputRef={descriptionRef}
        onInput={(e) => e.target.value != "" ? setIsDescription(true) : setIsDescription(false)}
      />
      <Grid>
        <IconButton
          onClick={addIdea}
          disabled={isTitle && isDescription ? false : true}
        >
          {false ? (
            <CircularProgress />
          ) : (
            <SaveIcon color={isTitle && isDescription ? "success" : "disabled"} />
          )}
        </IconButton>
        <IconButton onClick={() => setIsClicked(false)}>
          <CancelIcon color="error" />
        </IconButton>
      </Grid>
    </Form>
  ) : (
    <Button variant="outlined" onClick={() => setIsClicked(true)}>
      <AddIcon />
    </Button>
  );

  return (
    <Container>
      <Grid
        container
        flexDirection={"column"}
        alignItems={"center"}
        justifyContent={"center"}
        marginTop={1}
        rowGap={2}
      >
        {buttonOrNot}
        <Grid container flexDirection={"column"} rowGap={1.5} maxWidth={600}>
          {!ideas ? (
            <CircularProgress />
          ) : (
            ideas.map((idea)=> (
              <Card key={idea.id}>
                <CardContent>
                  <Typography variant="h4">{idea.title}</Typography>
                  <Typography
                    fontWeight={"light"}
                    variant="subtitle2"
                    display="block"
                  >
                    {idea.description}
                  </Typography>
                  <Typography
                    fontWeight={"light"}
                    marginTop={0.5}
                    variant="caption"
                    display="block"
                  >
                    {idea.date}
                  </Typography>
                  {false? (
                    <CircularProgress />
                  ) : (
                    <IconButton
                      onClick={() =>  deleteIdea(idea.id)}
                    >
                      <DeleteIcon color="error" />
                    </IconButton>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
