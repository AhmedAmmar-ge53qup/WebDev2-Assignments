import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { Grid, Paper, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Header from "../components/Header";
import axios from "axios";

export default function Messages() {
  const router = useRouter();
  const [user, setUser] = useState([]);
  const [role, setRole] = useState([]);
  const [messages, setMessages] = useState([]);
  
  const staffQuery = useQuery(["staff"], async () => {
    const res = await fetch(`/api/staff`);
    return await res.json();
  });

  const parentsQuery = useQuery(["parents"], async () => {
    const res = await fetch(`/api/parents`);
    return await res.json();
  });

  const messagesQuery = useQuery(["messages"], async () => {
    const res = await fetch(`/api/messages`);
    return await res.json();
  });

  useEffect(() => {
    setUser(JSON.parse(localStorage?.user));
    setRole(localStorage.role)
  }, []);

  useEffect(() => {
    if (messagesQuery.status == "success") {
      if (role == "teacher") {
        const tempMessages = [];
        messagesQuery.data.data
          .filter((m) => m.teacherId == user.staffNo)
          .map((m) => tempMessages.push(m));
        setMessages(tempMessages);
      } else if (role == "parent") {
        const tempMessages = [];
        messagesQuery.data.data
          .filter((m) => m.parentId == user.qatariId)
          .map((m) => tempMessages.push(m));
        setMessages(tempMessages);
      }
    }
  }, [messagesQuery.data, messagesQuery.status, role, user]);



  const deleteMessage = (id) => {
    if (confirm("Are You sure?"))
      axios
        .delete("/api/messages", { data: { messageId: id } })
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
  };

  const parentView = (m) => (
    <Paper
      sx={{
        backgroundColor: "rgb(0,30,60)",
        minHeight: 80,
        minWidth: 400,
        padding: 1,
      }}
      elevation={5}
      key={m.messageId}
    >
      <Typography variant="h6" component="div">
        About Student: {m.studentName}
      </Typography>
      <Typography variant="h6" component="div">
        {m.message}
      </Typography>
      <Typography variant="h10" color={"grey"} component="div">
        From: {staffQuery?.data.data.find((s) => s.staffNo == m.teacherId)?.firstName}{" "}
        {staffQuery?.data.data.find((s) => s.staffNo == m.teacherId)?.lastName}
      </Typography>
    </Paper>
  );
  const teacherView = (m) => (
    <Paper
      sx={{
        backgroundColor: "rgb(0,30,60)",
        minHeight: 80,
        minWidth: 400,
        padding: 1,
      }}
      elevation={5}
      key={m.messageId}
    >
      <Typography variant="h10" color={"grey"} component="div">
        About Student: {m.studentName}
      </Typography>
      <Typography variant="h6" component="div">
        {m.message}
      </Typography>
      <IconButton
        aria-label="delete"
        size="large"
        onClick={() => deleteMessage(m.messageId)}
      >
        <DeleteIcon fontSize="inherit" />
      </IconButton>
      <IconButton
        aria-label="edit"
        size="large"
        onClick={() =>
          router.push(
            `/teacher/message?operation=update&messageId=${m.messageId}`
          )
        }
      >
        <EditIcon fontSize="inherit" />
      </IconButton>
      <Typography variant="h10" color={"grey"} component="div">
        To: {parentsQuery?.data.data.find((p) => p.qatariId == m.parentId)?.firstName}{" "}
        {parentsQuery?.data.data.find((p) => p.qatariId == m.parentId)?.lastName}
      </Typography>
    </Paper>
  );
  // You can return the either this or that, based on certain conditions
  // that you can test in the return later

  return (
    <Grid
      container
      rowGap={1}
      justifyContent={"center"}
      flexDirection="column"
      alignItems={"center"}
    >
      <Header />
      <Typography variant="h2" component="div">
        Messages
      </Typography>
      <Paper elevation={10} sx={{ width: "80%", minHeight: 300, padding: 2 }}>
        <Grid container gap={3} justifyContent={"center"} flexDirection="row">
          {messages.map((m) => {
            if (role == "teacher") {
              return teacherView(m);
            } else if (role == "parent") {
              return parentView(m);
            }
          })}
        </Grid>
      </Paper>
    </Grid>
  );
}
