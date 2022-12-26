import React, { useEffect, useState } from 'react'
import { Box, Button, Grid, Paper, Typography } from '@mui/material';
import Header from '../components/Header';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useQuery } from "@tanstack/react-query";

export default function Announcements() {
  const router = useRouter();
  const announcementsQuery = useQuery(["announcements"], async () => {
    const res = await fetch(`/api/announcements`);
    return await res.json();
  });

  const announcements = announcementsQuery.data?.data;

  const [user, setUser] = useState({});
  useEffect(() => {
    setUser(JSON.parse(localStorage.user))
  }, []);


  const deleteAnnouncement = (id) => {
    if (confirm("Are you sure ?"))
      axios
      .delete("/api/announcements", {
        data: {announcementId: id}
      })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };
  

  return (
    <Grid
      container
      rowGap={1}
      justifyContent={"center"}
      flexDirection="column"
      alignItems={"center"}>
      <Header />
      <Typography variant="h2" component="div">
        Announcements
      </Typography>
      <Paper elevation={10} sx={{ width: "80%", minHeight: 300, padding: 2 }}>
        <Grid
          container
          gap={3}
          justifyContent={"center"}
          flexDirection="row"
        >
          {announcements?.map((a) => (
            <Paper sx={{ backgroundColor: "rgb(0,45,60)", m: "15px", p: "15px", minWidth: "300px", minHeight: "20vh" }} elevation={5} key={a.announcementId}>
                <Typography variant="h6" component="div">
                  {a.announcement}
                </Typography>
                {a.image && <Grid container sx={{justifyContent: "center"}}>
                  <Box
                    component="img"
                    sx={{
                      marginTop: 2,
                      height: "auto",
                      width: 350,
                    }}
                    alt="Attached Image Not Loaded"
                    src={a.image}
                  />
                </Grid>}
                {user?.isCoordinator && 
                <Grid container justifyContent="space-around" sx={{marginTop: 2}}>
                  <Button variant='outlined' onClick={() => deleteAnnouncement(a.announcementId)}>Delete</Button>
                  <Button variant='outlined' onClick={() => router.push(`/coordinator/announcement?operation=update&announcementId=${a.announcementId}`)}>Update</Button>
                </Grid>}
            </Paper>
          ))}
        </Grid>
      </Paper>
    </Grid>
  )
}
