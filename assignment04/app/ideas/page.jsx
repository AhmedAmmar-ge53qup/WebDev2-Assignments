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
  const titleRef = useRef();
  const descriptionRef = useRef();
  const [isTitle, setIsTitle] = useState(false);
  const [isDescription, setIsDescription] = useState(false);
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);

  // Get or generate user ID
  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    if (storedUserId) {
      setUser(storedUserId);
    } else {
      axios.get("/api/identifier").then((response) => {
        const newUserId = response.data.uuid;
        localStorage.setItem("user_id", newUserId);
        setUser(newUserId);
      });
    }
    
  }, []);
  

  // Fetch ideas
  const { data: ideas, isLoading, error } = useQuery(["ideas", user], async () => {
    if (user) {
      const response = await axios.get(`/api/${user}/ideas`);
      return response.data;
    }
    return [];
  });

  // Mutation for adding an idea
  const addIdeaMutation = useMutation(
    async (newIdea) => {
      await axios.post(`/api/${user}/ideas`, newIdea);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["ideas", user]);
      },
    }
  );

  // Mutation for deleting an idea
  const deleteIdeaMutation = useMutation(
    async (id) => {
      await axios.delete(`/api/${user}/ideas`, { data: { id } });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["ideas", user]);
      },
    }
  );

  const addIdea = () => {
    const newIdea = {
      id: Math.floor(Math.random() * 100000000),
      title: titleRef.current.value,
      description: descriptionRef.current.value,
      date: moment().format("MMMM Do YYYY, h:mm:ss a"),
    };
    addIdeaMutation.mutate(newIdea);
    setIsClicked(false);
    titleRef.current.value = "";
    descriptionRef.current.value = "";
  };

  const deleteIdea = (id) => {
    deleteIdeaMutation.mutate(id);
  };

  const buttonOrNot = isClicked ? (
    <Form>
      <TextField
        sx={{ minWidth: 250 }}
        label="Title"
        inputRef={titleRef}
        onInput={(e) =>
          e.target.value !== "" ? setIsTitle(true) : setIsTitle(false)
        }
      />
      <TextField
        sx={{ minWidth: 250 }}
        label="Description"
        multiline
        rows={10}
        inputRef={descriptionRef}
        onInput={(e) =>
          e.target.value !== "" ? setIsDescription(true) : setIsDescription(false)
        }
      />
      <Grid>
        <IconButton
          onClick={addIdea}
          disabled={!(isTitle && isDescription)}
        >
          {addIdeaMutation.isLoading ? (
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

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">Error loading ideas: {error.message}</Typography>;
  }

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
          {ideas?.map((idea) => (
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
                <Typography variant="subtitle2" fontWeight="light" display="block">User ID: {idea.user}</Typography>
                <IconButton onClick={() => deleteIdea(idea.id)}>
                  {deleteIdeaMutation.isLoading ? (
                    <CircularProgress />
                  ) : (
                    <DeleteIcon color="error" />
                  )}
                </IconButton>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Grid>
    </Container>
  );
}