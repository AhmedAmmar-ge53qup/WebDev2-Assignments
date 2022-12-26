import {
  Button,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  NativeSelect
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useState, useEffect, useRef } from "react";
import Form from "../../../components/Form";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export default function CRUDStudent() {
  const router = useRouter();

  const parentsQuery = useQuery(["parents"], async () => {
    const res = await fetch(`/api/parents`);
    return await res.json();
  });

  const [students, setStudents] = useState([]);
  useEffect(() => {
    if(parentsQuery.status == "success")
      {
        const tmp = [];
        parentsQuery.data.data.forEach(parent => parent.students.forEach(student => tmp.push(student)));
        setStudents(tmp);
      }
  }, [parentsQuery.status])



  const staffQuery = useQuery(["staff"], async () => {
    const res = await fetch(`/api/staff`);
    return await res.json();
  });

  const [teachers, setTeachers] = useState([]);
  useEffect(() => {
    if(staffQuery.status == "success")
      {
        const tmp = [];
        staffQuery.data.data.forEach((a) => (a.isCoordinator ? "" : tmp.push(a)));
        setTeachers(tmp);
      }
  }, [staffQuery.status])

  
  //#region In case of UPDATE
    const [student, setStudent] = useState({});
    useEffect(() => {
      const tempStd = students.find(student => student.studentId == router.query.studentId);
      const tempPrnt = parentsQuery.data?.data.find(parent => parent.students.find(student => student.studentId == router.query.studentId));
      setStudent(tempStd);
      if (router.query.operation == "update")
      {
        setSelectedParent(tempPrnt?.qatariId);
        setSelectedGender(tempStd?.gender || "");
        setSelectedTeacher(tempStd?.teacherId || "")
        setDateOfBirth(new Date(tempStd?.dob))
      }
    }, [students, parentsQuery.data?.data, router.query.studentId, router.query.operation])
  //#endregion in case of UPDATE

  // Input Values
  const [selectedParent, setSelectedParent] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const schoolGradeRef = useRef();

  function addStudent() {
    const qatariId = selectedParent;
    const firstName = firstNameRef.current.value;
    const lastName = lastNameRef.current.value;
    const dob = moment(new Date(dateOfBirth)).format("MM/DD/YYYY");
    const gender = selectedGender;
    const schoolGrade = schoolGradeRef.current.value;
    const teacherId = selectedTeacher;

    
    const student = {
      studentId: Math.floor(Math.random() * 9999999999),
      firstName,
      lastName,
      dob,
      gender,
      schoolGrade,
      teacherId,
    };

    // Post the student to the server (it will then be stored to parents.json under the corresponding parent)
    axios
      .post("/api/students", { qatariId, student })
      .then((res) => {console.log(res); router.back();})
      .catch((err) => {console.log(err); alert("ERROR POSTING")});

    
  }

  function updateStudent() {
    console.log(`Update Student in this function: ${router.query.operation}`);
    const qatariId = selectedParent;
    const firstName = firstNameRef.current.value;
    const lastName = lastNameRef.current.value;
    const dob = moment(new Date(dateOfBirth)).format("MM/DD/YYYY");
    const gender = selectedGender;
    const schoolGrade = schoolGradeRef.current.value;
    const teacherId = selectedTeacher;
 
    const student = {
      studentId: router.query.studentId,
      firstName,
      lastName,
      dob,
      gender,
      schoolGrade,
      teacherId,
    };

    // Update student to the server (it will then be stored to parents.json under the corresponding parent)
    axios
      .put("/api/students", { qatariId, student })
      .then((res) => {console.log(res); router.back();})
      .catch((err) => {console.log(err); alert("ERROR UPDATING")});
  }

  // Operation can be add/update
  return (
    <Form key={student}>
      <Typography variant="h5" component="div" sx={{ textAlign: "center" }}>
        {router.query.operation?.toUpperCase()} Student
      </Typography>

      {router.query.operation?.toLowerCase() == "add" && <FormControl sx={{ minWidth: 250 }}>
        <InputLabel id="parent-select-label">Parent</InputLabel>
        <Select
          value={selectedParent}
          onChange={(e) => setSelectedParent(e.target.value)}
          id="parent-select"
          label="Parent"
        >
          {parentsQuery.data?.data.map((parent) => (
            <MenuItem key={parent.qatariId} value={parent.qatariId}>
              {parent.firstName} {parent.lastName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>}

      <TextField
        sx={{ minWidth: 250 }}
        id="firstname-input"
        label="Student's Firstname"
        inputRef={firstNameRef}
        defaultValue={student?.firstName}
      />

      <TextField
        sx={{ minWidth: 250 }}
        id="lastname-input"
        label="Student's Lastname"
        inputRef={lastNameRef}
        defaultValue={student?.lastName}
      />

      <FormControl sx={{ minWidth: 250 }}>
        <InputLabel id="gender-select-label">Gender</InputLabel>
        <Select
          value={selectedGender}
          onChange={(e) => setSelectedGender(e.target.value)}
          id="gender-select"
          label="Gender"
        >
          <MenuItem value={"M"}>Male</MenuItem>
          <MenuItem value={"F"}>Female</MenuItem>
        </Select>
      </FormControl>

      <TextField
        sx={{ minWidth: 250 }}
        id="schoolgrade-input"
        label="School Grade"
        type="number"
        inputRef={schoolGradeRef}
        defaultValue={student?.schoolGrade}
      />

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          sx={{ minWidth: 250 }}
          label="Date of Birth"
          value={dateOfBirth}
          onChange={(value) => {
            setDateOfBirth(value?.$d);
          }}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>

      <FormControl sx={{ minWidth: 250 }}>
        <InputLabel id="teacher-select-label">Teacher</InputLabel>
        <Select
          value={selectedTeacher}
          onChange={(e) => setSelectedTeacher(e.target.value)}
          id="teacher-select"
          label="Teacher"
        >
          {teachers.map((teacher) => (
            <MenuItem key={teacher.staffNo} value={teacher.staffNo}>
              {teacher.firstName} {teacher.lastName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        variant="contained"
        sx={{ minWidth: 100 }}
        onClick={() => {
          if (router.query.operation.toLowerCase() === "add") addStudent();
          else if (router.query.operation.toLowerCase() === "update")
            updateStudent();
          else alert("Undefined Operation: " + router.query.operation);
        }}
      >
        {router.query.operation?.toUpperCase()}
      </Button>
    </Form>
  );
}
