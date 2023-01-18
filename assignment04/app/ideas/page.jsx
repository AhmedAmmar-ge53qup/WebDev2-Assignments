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

  // Generating the UUID for the first time
  useEffect(() => {
    axios
      .get("api/identifier", {
        params: {
          uuid: localStorage.user,
        },
      })
      .then((res) => {
        localStorage.user = res.data;
      });
  }, []);

  const ideasQuery = useQuery(["ideas"], async () => {
    const res = await fetch(`api/${localStorage.user}/ideas`);
    const json = await res.json();
    return json;
  });

  const createIdeaMutation = useMutation(
    async (newIdea) => {
      axios
        .post(`api/${localStorage.user}/ideas`, newIdea)
        .then((res) => {
          setIsClicked(false);
          return res;
        })
        .catch((err) => {
          console.log(err);
          alert("ERROR POSTING");
          return res;
        });
    },
    {
      onMutate: async (newIdea) => {
        await queryClient.cancelQueries(["ideas"]);
        const prevIdeas = queryClient.getQueriesData(["ideas"]);
        queryClient.setQueryData(["ideas", (old) => [...old, newIdea]]);

        return { prevIdeas };
      },
      onError: (err, newIdea, context) => {
        queryClient.setQueryData(["ideas"], context.prevIdeas);
      },
      onSettled: () => {
        queryClient.invalidateQueries(["ideas"]);
      },
    }
  );

  const deleteIdeaMutation = useMutation(
    async (id) => {
      return axios
        .delete(`api/${localStorage.user}/ideas`, { data: { id } })
        .then((res) => console.log(res))
        .catch((err) => {
          console.log(err);
          alert("ERROR DELTEING");
        });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["ideas"]);
      },
    }
  );

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
          onClick={() =>
            createIdeaMutation.mutate({
              id: Math.floor(Math.random() * 100000000),
              user: localStorage.user,
              title: titleRef.current.value,
              description: descriptionRef.current.value,
              date: moment().format("MMMM Do YYYY, h:mm:ss a"),
            })
          }
          disabled={isTitle && isDescription ? false : true}
        >
          {createIdeaMutation.isLoading ? (
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
          {ideasQuery.status == "loading" ? (
            <CircularProgress />
          ) : (
            ideasQuery.data.map((idea) => (
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
                  {deleteIdeaMutation.isLoading ? (
                    <CircularProgress />
                  ) : (
                    <IconButton
                      onClick={() => deleteIdeaMutation.mutate(idea.id)}
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
