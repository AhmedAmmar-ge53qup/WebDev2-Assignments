import React from "react";
import { Grid, Paper, Link, Typography, Stack, Button } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";

export default function TaskCard(props) {
  const router = useRouter();
  const task = props.task;
  const deleteTask = () => {
    if (confirm('Are You sure?')) 
      axios.delete("api/tasks" , {data: {taskId: task.taskId}}).then((res) => console.log(res)).catch((err) => {console.log(err); alert("ERROR DELTEING")});
  }
  return (
    <Paper sx={{ m: "15px", p: "15px", minWidth: "300px", minHeight: "30vh" }}>
      <Grid columnGap={1} margin="10px">
        <Typography variant="h10" component="div">
          Task Type: {task?.type}
        </Typography>
        <Typography variant="h10" component="div">
          Surah name: {task?.surahName}
        </Typography>
        <Typography variant="h10" component="div">
          From Aya: {task?.fromAya}
        </Typography>
        <Typography variant="h10" component="div">
          To Aya: {task?.toAya}
        </Typography>
        <Typography variant="h10" component="div">
          Due Date: {task?.dueDate}
        </Typography>
        {task?.completedDate && (
          <Typography variant="h10" component="div">
            Completed Date: {task?.completedDate}
          </Typography>
        )}
        {task?.masteryLevel && (
          <Typography variant="h10" component="div">
            Mastery Level: {task?.masteryLevel}
          </Typography>
        )}
        {task?.comment && (
          <Typography variant="h10" component="div">
            Comments: {task?.comment}
          </Typography>
        )}
      </Grid>
      {props.role === "teacher" && (
        <Stack
          direction="column"
          justifyContent="flex-end"
          alignItems="flex-start"
          spacing={1}
          sx={{ p: "15px", width: 1 }}
        >
          {task?.completedDate == null && (
            <Link
              sx={{ width: 100 }}
              href={`/student/task/complete?taskId=${task?.taskId}`}
              underline="none"
            >
              <Button sx={{ width: 1 }} variant="outlined">
                Complete
              </Button>
            </Link>
          )}
          {task?.completedDate == null && (
            <Link
              sx={{ width: 100 }}
              href={`/student/task/update?taskId=${task?.taskId}`}
              underline="none"
            >
              <Button sx={{ width: 1 }} variant="outlined">
                Update
              </Button>
            </Link>
          )}
          <Button sx={{ width: 100 }} onClick={() => {deleteTask(); router.reload();} } variant="outlined">
            Delete
          </Button>
        </Stack>
      )}
    </Paper>
  );
}
