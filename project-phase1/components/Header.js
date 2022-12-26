import React, { useEffect, useState } from "react";
import { Container, Stack, Link, Typography, Button } from "@mui/material";
import { useRouter } from "next/router";

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState({});

  useEffect(() => {
    setUser(JSON.parse(localStorage.user));
  }, []);

  let HOME_PAGE;

  if (user.isCoordinator) HOME_PAGE = "/coordinator";
  else if (user.qatariId) HOME_PAGE = "/parent";
  else HOME_PAGE = "/teacher";

  return (
    <Container
      component="header"
      sx={{ mb: 5, pt: 2, width: 1, height: "75px" }}
    >
      <Stack
        component="nav"
        direction="row"
        justifyContent="space-between"
        sx={{ width: "100%", height: "95%" }}
      >
        <Typography fontWeight={"bold"} variant="h3">
          Halaqa Metrash
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <Link href={HOME_PAGE} underline="none">
            Home
          </Link>
          { !user.isCoordinator && (
            <Link href={`/messages`} underline="none">
              Messages
            </Link>
          )}
          <Link href="/announcements" underline="none">
            Announcements
          </Link>
          <Link href="/" underline="none">
            Sign out
          </Link>
        </Stack>
      </Stack>
    </Container>
  );
}
