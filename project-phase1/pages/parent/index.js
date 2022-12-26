import React from "react";
import Header from "../../components/Header";
import StudentsCards from "../../components/StudentsCards";
import {useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { useQuery } from "@tanstack/react-query";

export default function Parent() {
  const [qatariId, setQatariId] = useState(0);

  const parentsQuery = useQuery(["parents"], async () => {
    const res = await fetch(`/api/parents`);
    return await res.json();
  });

  const parent = parentsQuery.data?.data.find(p => p.qatariId == qatariId);


  useEffect(() => {
    setQatariId(JSON.parse(localStorage.user).qatariId)
  }, [])
  

  return (
    <>
      <Header id={parent?.qatariId}/>
      <Grid container component="main" justifyContent="center" alignItems="center"
        sx={{ gridTemplateColumns: 'repeat(3, 1fr)', columnGap: 5, width: "100%" }}
      >
        {parent?.students
          .map((s) => (
            <Grid item key={s.studentId} xs={6} md={4} lg={3}>
              <StudentsCards student={s} role="teacher"/>
            </Grid>
          ))}
      </Grid>
    </>
  );
}
