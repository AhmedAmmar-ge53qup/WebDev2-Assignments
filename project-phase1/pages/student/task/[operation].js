import {
  Button,
  TextField,
  Typography,
  InputLabel,
  Select,
  MenuItem,
  NativeSelect,
  RadioGroup,
  FormControlLabel,
  Radio,
  Slider,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import Form from "../../../components/Form";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export default function CRUDTask() {
  const router = useRouter();
  const { studentId, taskId, operation } = router.query;

  const tasksQuery = useQuery(["tasks"], async () => {
    const res = await fetch(`/api/tasks`);
    return await res.json();
  });

  const surahsQuery = useQuery(["surahs"], async () => {
    const res = await fetch("http://erradi.github.io/json/surah.json");
    return await res.json();
  });


  useEffect(() => {
      const task = tasksQuery.data?.data.find((t) => t.taskId == taskId);
      if (surahsQuery.data)
        setSurahId(
          router.query.operation?.toLowerCase() == "add"
            ? surahsQuery.data[0].id
            : task?.surahId
        );
  }, [surahsQuery.status, surahsQuery.data, router.query, taskId, tasksQuery.data]);

  // Input Values
  const [surahId, setSurahId] = useState(1);
  const [fromAya, setFromAya] = useState();
  const [toAya, setToAya] = useState();
  const [type, setType] = useState();
  const [dueDate, setDueDate] = useState();
  const [completedDate, setCompletedDate] = useState();
  const [masteryLevel, setMasteryLevel] = useState();
  const [comment, setComment] = useState();
  
  const [foundSurah, setFoundSurah] = useState({});
  useEffect(() => {
    setFoundSurah(surahsQuery.data?.find((surah) => surah.id == surahId));
  }, [surahId, surahsQuery.status, surahsQuery.data]);

  useEffect(() => {
    if (router.query.operation?.toLowerCase() == "add") {
      setFromAya(1);
      setToAya(foundSurah?.ayaCount ? foundSurah.ayaCount : 100);
      setType("Memorization");
      setDueDate(new Date(new Date().getTime() + 86400000));
    } else if(router.query.operation?.toLowerCase() == "update" ){
      const task = tasksQuery.data?.data?.find((t) => t.taskId == taskId);
      setSurahId(task?.surahId);
      setFromAya(task?.fromAya);
      setToAya(task?.toAya);
      setType(task?.type);
      setDueDate(new Date(task?.dueDate));
    } else{
      const task = tasksQuery.data?.data?.find((t) => t.taskId == taskId);
      setSurahId(task?.surahId);
      setFromAya(task?.fromAya);
      setToAya(task?.toAya);
      setType(task?.type);
      setDueDate(new Date(task?.dueDate));
      setCompletedDate(new Date(task?.dueDate))
      setMasteryLevel("Excellent")
    }
  }, [surahsQuery.status, surahsQuery.data, router.query, foundSurah, tasksQuery.data, taskId]);

  function addTask() {
    const surah = surahsQuery.data?.find(
      (s) => parseInt(s.id) == parseInt(surahId)
    );
    const task = {
      taskId: Math.floor(Math.random() * 99999999),
      studentId: studentId,
      surahId: surahId,
      surahName: surah.englishName,
      fromAya: fromAya,
      toAya: toAya,
      type: type,
      dueDate: moment(new Date(dueDate)).format("MM/DD/YYYY"),
      completedDate: null,
      masteryLevel: null,
      comment: null,
    };

    console.log(task);
    axios
      .post("/api/tasks", { task })
      .then((res) => {
        console.log(res);
        router.back();
      })
      .catch((err) => {
        console.log(err);
        alert(err);
      });
  }

  function updateTask() {
    const task = tasksQuery.data?.data?.find((t) => t.taskId == taskId);
    const surah = surahsQuery.data?.find(
      (s) => parseInt(s.id) == parseInt(surahId)
    );

    const updatedTask = {
      taskId: taskId,
      studentId: task.studentId,
      surahId: surahId,
      surahName: surah.englishName,
      fromAya: fromAya,
      toAya: toAya,
      type: type,
      dueDate: moment(new Date(dueDate)).format("MM/DD/YYYY"),
      completedDate: null,
      masteryLevel: null,
      comment: null,
    };

    axios
      .put("/api/tasks", { task: updatedTask, taskId: parseInt(taskId) })
      .then((res) => {
        console.log(res);
        router.back();
      })
      .catch((err) => {
        console.log(err);
        alert(err);
      });
  }
  
  function completeTask(){
    const task = tasksQuery.data?.data?.find((t) => t.taskId == taskId);
    const surah = surahsQuery.data?.find(
      (s) => parseInt(s.id) == parseInt(surahId)
    );

    const completedTask = {
      taskId: taskId,
      studentId: task.studentId,
      surahId: surahId,
      surahName: surah.englishName,
      fromAya: fromAya,
      toAya: toAya,
      type: type,
      dueDate: moment(new Date(dueDate)).format("MM/DD/YYYY"),
      completedDate:  moment(new Date(completedDate)).format("MM/DD/YYYY"),
      masteryLevel: masteryLevel,
      comment: comment,
    };

    console.log(completedTask);
    axios
      .put("/api/tasks", { task: completedTask, taskId: parseInt(taskId) })
      .then((res) => {
        console.log(res);
        router.back();
      })
      .catch((err) => {
        console.log(err);
        alert(err);
      });
  }
  function valuetext(value) {
    return `${value}`;
  }

  return (
    <Form key={surahId}>
      <Typography variant="h5" component="div" sx={{ textAlign: "center" }}>
        {router.query.operation?.toUpperCase()} Task
      </Typography>

      <InputLabel sx={{ width: 0.5 }}> Select Surah: </InputLabel>
      <Select
        sx={{ width: 0.45, ml: 3 }}
        id="demo-multiple-name"
        value={parseInt(surahId) || ""}
        onChange={(e) => setSurahId(e.target.value)}
        disabled={
          router.query.operation?.toLowerCase() == "complete" ? true : false
        }
      >
        {surahsQuery.data?.map((surah) => (
          <MenuItem key={surah?.id} value={surah?.id}>
            {surah?.englishName} {surah?.name}
          </MenuItem>
        ))}
      </Select>

      <InputLabel sx={{ width: 0.5 }}>from Aya: </InputLabel>
      <Slider
        aria-label="Small steps"
        value={fromAya}
        getAriaValueText={valuetext}
        step={1}
        min={1}
        max={
          (foundSurah?.ayaCount !== "" ? foundSurah?.ayaCount - 1 : 100) || 100
        }
        onChange={(event) => setFromAya(parseInt(event.target.value))}
        valueLabelDisplay="auto"
        disabled={
          router.query.operation?.toLowerCase() == "complete" ? true : false
        }
      />

      <InputLabel sx={{ width: 0.5 }}>To Aya: </InputLabel>
      <Slider
        aria-label="Small steps"
        value={toAya}
        getAriaValueText={valuetext}
        step={1}
        min={(fromAya !== "" ? fromAya + 1 : 1) || 1}
        max={(foundSurah?.ayaCount !== "" ? foundSurah?.ayaCount : 100) || 100}
        onChange={(event) => setToAya(parseInt(event.target.value))}
        valueLabelDisplay="auto"
        disabled={
          router.query.operation?.toLowerCase() == "complete" ? true : false
        }
      />

      <InputLabel sx={{ width: 0.5 }}>Task Type: </InputLabel>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        value={type}
        onChange={(event) => setType(event.target.value)}
        disabled={
          router.query.operation?.toLowerCase() == "complete" ? true : false
        }
      >
        <FormControlLabel
          defaultValue
          value="Memorization"
          control={<Radio />}
          label="Memorization"
          disabled={
            router.query.operation?.toLowerCase() == "complete" ? true : false
          }
        />
        <FormControlLabel
          value="Revision"
          control={<Radio />}
          label="Revision"
          disabled={
            router.query.operation?.toLowerCase() == "complete" ? true : false
          }
        />
      </RadioGroup>

      <InputLabel sx={{ width: 0.5 }}>Due Date: </InputLabel>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          sx={{ minWidth: 250 }}
          label="Due Date"
          value={dueDate}
          onChange={(value) => {
            setDueDate(value?.$d);
          }}
          renderInput={(params) => <TextField {...params} />}
          disabled={
            router.query.operation?.toLowerCase() == "complete" ? true : false
          }
        />
      </LocalizationProvider>

      { router.query.operation?.toLowerCase() == "complete" &&
        <>
          <InputLabel sx={{ width: 0.5 }}>Completed Date: </InputLabel>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              sx={{ minWidth: 250 }}
              label="Completed Date"
              value={completedDate}
              onChange={(value) => {
                setCompletedDate(value?.$d);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>

          <InputLabel sx={{ width: 0.5 }}>Task Type: </InputLabel>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            value={masteryLevel}
            onChange={(event) => setMasteryLevel(event.target.value)}
          >
            <FormControlLabel
              defaultValue
              value="Excellent"
              control={<Radio />}
              label="Excellent"
            />
            <FormControlLabel value="Ok" control={<Radio />} label="Ok" />
            <FormControlLabel value="Poor" control={<Radio />} label="Poor" />
          </RadioGroup>

          <InputLabel sx={{ width: 0.5 }}>Comments: </InputLabel>
          <TextField
            sx={{ minWidth: 400 }}
            minRows={4}
            maxRows={20}
            multiline
            label="Comments"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            inputProps={{ maxLength: 200 }}
          />
        </>
      }

      <Button
        variant="contained"
        sx={{ minWidth: 100 }}
        onClick={() => {
          if (operation.toLowerCase() == "add") addTask();
          else if (operation.toLowerCase() == "update") updateTask();
          else if (operation.toLowerCase() == "complete") completeTask();
          else alert("Undefined Operation: " + operation);
        }}
      >
        {operation?.toUpperCase()} TASK
      </Button>
    </Form>
  );
}
