import { Button, CardActions, TextField, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useRef } from "react";
import Form from "../components/Form";
import axios from "axios";

export default function Home() {
  const usernameRef = useRef();
  const passwordRef = useRef();
  const router = useRouter();

  function login(username, password) {
    axios
      .post("/api/login", { username, password })
      .then((res) => {
        console.log(res);
        if (res.data.role == "coordinator") {
          router.push("/coordinator");
          localStorage.role = res.data.role;
          localStorage.user = JSON.stringify(res.data.user);
        } else if (res.data.role == "teacher") {
          router.push("/teacher");
          localStorage.role = res.data.role;
          localStorage.user = JSON.stringify(res.data.user);
        } else if (res.data.role == "parent") {
          router.push("/parent");
          localStorage.role = res.data.role;
          localStorage.user = JSON.stringify(res.data.user);
        } else {
          alert(res.data.error);
        }
      })
      .catch((err) => {
        console.log(err);
        alert("ERROR POSTING");
      });
  }

  return (
    <Form
      login={
        <CardActions>
          <Button size="small">Register Here !</Button>
        </CardActions>
      }
    >
      <Typography variant="h5" component="div" sx={{ textAlign: "center" }}>
        Login
      </Typography>

      <TextField
        sx={{ minWidth: 250 }}
        id="username-input"
        label="Username"
        inputRef={usernameRef}
      />
      <TextField
        sx={{ minWidth: 250 }}
        id="password-input"
        label="Password"
        type="password"
        inputRef={passwordRef}
      />

      <Button
        variant="contained"
        sx={{ minWidth: 100 }}
        onClick={() =>
          login(usernameRef.current.value, passwordRef.current.value)
        }
      >
        Login
      </Button>
    </Form>
  );
}
