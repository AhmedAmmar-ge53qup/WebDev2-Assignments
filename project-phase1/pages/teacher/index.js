import React from "react";
import Header from "../../components/Header";
import StudentsCards from "../../components/StudentsCards";
import { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { useQuery } from "@tanstack/react-query";

export default function Teacher() {

  const [staffNo, setStaffNo] = useState(0);
  const [students, setStudents] = useState([]);

  const parentsQuery = useQuery(["parents"], async () => {
    const res = await fetch(`/api/parents`);
    return await res.json();
  });
  
  useEffect(() => {
    setStaffNo(JSON.parse(localStorage.user).staffNo);
  }, [])

  useEffect(() => {
      if(parentsQuery.status == "success")
      {
        const tmp = [];
        parentsQuery.data.data.forEach(parent => parent.students.forEach(student => tmp.push(student)));
        setStudents(tmp);
      }
  }, [ parentsQuery.status ]);

  console.log(students);
  return (
    <>
      <Header id={staffNo} />
      <Grid container component="main" justifyContent="center" alignItems="center"
        sx={{ gridTemplateColumns: 'repeat(3, 1fr)', columnGap: 5, width: "100%" }}
      >
        {students
          .filter((s) => s.teacherId == staffNo)
          .map((s) => (
            <Grid item key={s.studentId} xs={6} md={4} lg={3}>
              <StudentsCards student={s} role="teacher" />
            </Grid>
          ))}
      </Grid>
    </>
  );
}
