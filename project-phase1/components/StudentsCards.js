import React from "react";
import { Grid, Paper, Link, Typography, Stack, Button, FormGroup, FormControlLabel, Switch } from "@mui/material";
import axios from "axios";

export default function StudentsCards(props) {
  const student = props.student;
  const parent = props.parent;
  const role = props.role;

  return (
    // Modify minWidth to make it work, 40vh was good?
    <Paper sx={{ backgroundColor: props.backgroundColor || "", m: "15px", p: "15px", minWidth: "300px", minHeight: "20vh" }}>
      <Grid columnGap={1} margin="10px">
        <Grid container flexDirection="column" rowGap={1} margin="10px">
          <Typography variant="h10" component="div">
            Name: {student.firstName} {student.lastName}
          </Typography>
          <Typography variant="h10" component="div">
            Student ID: {student.studentId}
          </Typography>
          <Typography variant="h10" component="div">
            Gender: {student.gender?.toLowerCase() === "m" ? "Male" : "Female"}
          </Typography>
          <Typography variant="h10" component="div">
            {/* if Coordinator or parent ADD Teacher Name */}
          </Typography>
          <Typography variant="h10" component="div">
             {/* if Coordinator or parent ADD Halqa Name */}
          </Typography>
          <Stack direction="row" sx={{ p: "15px", width: 1 }} justifyContent="space-evenly" alignItems="center">
            <Link href={`/student?studentId=${student.studentId}`} underline="none" >
              More Information
            </Link>
            {role == "coordinator" && <Button><Link href={`/coordinator/students-crud/update?studentId=${student.studentId}`}>Update Student</Link></Button>}
          </Stack>
          <FormGroup>
              <FormControlLabel label="InActive" control={<Switch onChange={(e) => {student.isInActive = e.target.checked; 
                  axios
                  .put("/api/students", { qatariId: parent.qatariId, student })
                  .then((res) => console.log(res))
                  .catch((err) => console.log(err));
                }} 
              defaultChecked={student.isInActive ? true : false} sx={{marginRight: 1}} 
              disabled={role == "coordinator" ? false : true}/>}/>
          </FormGroup>
        </Grid>
      </Grid>
    </Paper>
  );
}
