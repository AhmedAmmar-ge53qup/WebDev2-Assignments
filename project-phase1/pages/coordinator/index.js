import React from "react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { Grid, Paper, Button, Typography, Link } from "@mui/material";
import StudentsCards from "../../components/StudentsCards";
import Layout from "../../components/Layout";

export default function Coordinator() {
  const router = useRouter();

  const parentsQuery = useQuery(["parents"], async () => {
    const res = await fetch(`/api/parents`);
    return await res.json();
  });

  const [students, setStudents] = useState([]);
  useEffect(() => {
    if (parentsQuery.status == "success") {
      const tmp = [];
      parentsQuery.data.data.forEach(parent => parent.students.forEach(student => tmp.push(student)));
      setStudents(tmp);
    }
  }, [parentsQuery.status])

  return (
    <Layout>
      <Grid
        container
        rowGap={1}
        justifyContent={"center"}
        flexDirection="column"
        alignItems={"center"}
        marginTop="10px"
      >
        <Paper elevation={3} sx={{ width: "100%" }}>
          <Grid
            container
            rowGap={3}
            justifyContent={"center"}
            flexDirection="column"
            alignItems={"center"}
          >
            <Typography variant="h1" component="div">
              Coordinator Dashboard
            </Typography>
            <Grid
              container
              rowGap={3}
              justifyContent={"center"}
              flexDirection="row"
              alignItems={"center"}
            >
              <Button variant="text" sx={{ m: "5px" }} onClick={() => router.push(`/coordinator/students-crud/add`)}>
                Add Student
              </Button>
              <Button variant="text" sx={{ m: "5px" }} onClick={() => router.push("/coordinator/announcement")}>
                Post Announcement
              </Button>
            </Grid>
          </Grid>
        </Paper>
        <Paper elevation={3} sx={{ width: "100%" }}>
          <Grid
            container
            rowGap={3}
            justifyContent={"center"}
            flexDirection="column"
            alignItems={"center"}
          >
            <Typography variant="h2" component="div">
              Students
            </Typography>
            <Grid
              container
              gap={3}
              justifyContent={"center"}
              flexDirection="row"
              paddingBottom="15px"
            >
              {students.map((a) => {
                const parent = parentsQuery.data.data.find(parent => parent.students.find(student => student.studentId == a.studentId))
                return <StudentsCards key={a.studentId} student={a} parent={parent} role="coordinator" backgroundColor="rgb(0,45,60)" />
              }
              )}
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Layout>
  );
}


