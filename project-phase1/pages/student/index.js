import React from "react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Layout from "../../components/Layout";
import StudentCard from "../../components/student/StudentCard";
import TaskCard from "../../components/task/TaskCard";
import {
  Grid,
  Link,
  Stack,
  InputLabel,
  Button,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";

export default function Student() {
  const router = useRouter();
  const { studentId } = router.query;

  const [students, setStudents] = useState([]);
  const [student, setStudent] = useState(null);
  const [parent, setParent] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [status, setStatus] = useState("All");
  const [role, setRole] = useState("");

  const parentsQuery = useQuery(["parents"], async () => {
    const res = await fetch(`/api/parents`);
    return await res.json();
  });

  const tasksQuery = useQuery(["tasks"], async () => {
    const res = await fetch(`/api/tasks`);
    return await res.json();
  });

  useEffect(() => {
    setRole(localStorage.role);
  }, []);

  useEffect(() => {
    if (parentsQuery.status == "success") {
      const tmp = [];
      parentsQuery.data.data.forEach((parent) =>
        parent.students.forEach((student) => tmp.push(student))
      );
      setStudents(tmp);
    }
  }, [parentsQuery.status]);

  useEffect(() => {
    const temp = students?.find((s) => s.studentId == studentId);
    setStudent(temp);
    const tempParent = parentsQuery.data?.data.find((p) =>
      p.students.find((s) => s.studentId == studentId)
    );
    setParent(tempParent);
    const tempTasks = tasksQuery.data?.data.filter(t => t.studentId == studentId);
    setTasks(tempTasks);
  }, [students, studentId]);

  return (
    <Layout>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        direction="column"
        rowGap={3}
      >
        {/* student Card  */}
        <StudentCard parent={parent} student={student} />

        {/*send Message & Add Task Button & Filter bar */}
        <Stack
          direction="row"
          sx={{ p: "15px", width: 0.7 }}
          justifyContent="space-evenly"
          alignItems="center"
        >
          {role?.toLowerCase() == "teacher" && (
            <Link
              href={`/teacher/message?studentId=${studentId}`}
              underline="none"
            >
              Send Message to {parent?.firstName} {parent?.lastName}
            </Link>
          )}
          {role?.toLowerCase() == "teacher" && (
            <Link
              sx={{ width: 0.125 }}
              href={`/student/task/add?studentId=${studentId}`}
              underline="none"
            >
              <Button variant="outlined">Add Task</Button>
            </Link>
          )}
          <FormControl sx={{ width: 0.25 }}>
            <InputLabel id="demo-simple-select-label">Status</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={status}
              label="Status"
              onChange={(e) => setStatus(e.target.value)}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Pending">pending</MenuItem>
            </Select>
          </FormControl>
        </Stack>
        <Grid
          container
          component="main"
          justifyContent="center"
          alignItems="flex-start"
          sx={{
            gridTemplateColumns: "repeat(3, 1fr)",
            columnGap: 5,
            width: "100%",
          }}
        >
          {/* Task Cards */}
          {status == "All" &&
            tasks?.map((task) => (
              <Grid item key={task?.taskId} xs={6} md={4} lg={3}>
                <TaskCard task={task} role={role} />
              </Grid>
            ))}
          {status == "Completed" &&
            tasks
              ?.filter((task) => task.completedDate != null)
              .map((task) => (
                <Grid item key={task?.taskId} xs={6} md={4} lg={3}>
                  <TaskCard task={task} role={role} />
                </Grid>
              ))}
          {status == "Pending" &&
            tasks
              ?.filter((task) => task?.completedDate == null)
              .map((task) => (
                <Grid item key={task?.taskId} xs={6} md={4} lg={3}>
                  <TaskCard task={task} role={role} />
                </Grid>
              ))}
        </Grid>
      </Grid>
    </Layout>
  );
}
