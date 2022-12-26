import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";;
import Form from "../../components/Form";
import { Button, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export default function PostMessage() {

  const router = useRouter();
  const { operation, studentId, messageId } = router.query;
  const messageRef = useRef();

  const [student, setStudent] = useState(null);
  const [parent, setParent] = useState(null);

  const parentsQuery = useQuery(["parents"], async () => {
    const res = await fetch(`/api/parents`);
    return await res.json();
  });

  const messageQuery = useQuery(["messages"], async () => {
    const res = await fetch(`/api/messages`);
    return await res.json();  
  });

  useEffect(() => {
    if (parentsQuery.status == "success") {
      const tempParent = parentsQuery.data.data.find((p) => p.students.find(s => s.studentId == studentId));
      setParent(tempParent);
    }
  }, [parentsQuery.status, studentId]);

  useEffect(() => {
    if (parent)
      setStudent(parent.students?.find(s => s.studentId == studentId));
  }, [parent])
  

  const postMessage = (message) => {

    axios
      .post("/api/messages/", {
        messageId: Math.floor(Math.random() * 99999000),
        message: message,
        parentId: parent.qatariId,
        teacherId: JSON.parse(localStorage.user).staffNo,
        studentName:
          student?.firstName +
          " " +
          student?.lastName,
      })
        .then((res) => {console.log(res); router.back(); })
      .catch((err) => console.log(err));
  };

  const oldMessage = messageQuery.data?.data.find((m) => m.messageId == messageId);
  const updateMessage = (message) => {
    const newMessage = {
      messageId: oldMessage.messageId,
      message: message,
      parentId: oldMessage.parentId,
      teacherId: oldMessage.teacherId,
      studentName: oldMessage.studentName,
    };
    axios
      .put("/api/messages/", {
        message: newMessage,
        messageId
      })
      .then((res) => {console.log("MESSAGE UPDATED"); router.back();})
      .catch((err) => {console.log(err); alert("ERROR UPDATING")});
    
  };

  return (
    <>
      <Form key={oldMessage?.message}>
        <Typography variant="h5" component="div" sx={{ textAlign: "center" }}>
          {operation?.toLowerCase() == "update"
            ? "Update Message"
            : "Post Message"}
        </Typography>
        <TextField
          multiline
          sx={{ minWidth: 250 }}
          id="message-input"
          label="Message"
          type="text"
          inputRef={messageRef}
          defaultValue={
            operation?.toLocaleLowerCase() == "update" ? oldMessage?.message : ""
          }
        />

        <Button
          variant="contained"
          sx={{ minWidth: 100 }}
          onClick={() => {
            if (operation?.toLocaleLowerCase() == "update")
              updateMessage(messageRef.current.value);
            else postMessage(messageRef.current.value);
          }}
        >
          {operation?.toLowerCase() == "update"
            ? "Update Message"
            : "Post Message"}
        </Button>
      </Form>
    </>
  );
}
