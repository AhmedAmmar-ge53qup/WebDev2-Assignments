import { useEffect, useState, useRef } from "react";
import {
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";

export default function PostAnnouncement() {

  const router = useRouter();
  const { operation, announcementId } = router.query;
  const announcementRef = useRef();
  const imageRef = useRef();

  const announcementsQuery = useQuery(["announcements"], async () => {
    const res = await fetch(`/api/announcements`);
    return await res.json();
  });

  const [announcementText, setAnnouncementText] = useState("");
  const [announcementImage, setAnnouncementImage] = useState("");
  useEffect(() => {
    if (announcementsQuery.status == "success" && operation == "update")
    {
      const announcement = announcementsQuery.data.data.find(a => a.announcementId == announcementId)
      setAnnouncementText(announcement?.announcement);  
      setAnnouncementImage(announcement?.image);
    }
  }, [announcementsQuery.status, announcementId])


  const postAnnouncement = (announcement, image) => {
    axios
      .post("/api/announcements", {
        announcementId: Date.now(),
        announcement: announcement,
        image: image
      })
      .then((res) => {console.log(res); router.back();})
      .catch((err) => {console.log(err); alert("ERROR POSTING");});
  };

  const updateAnnouncement = (announcement, image) => {
    const announcementObj = {announcementId, announcement, image}
    axios
      .put("/api/announcements", {announcement: announcementObj, announcementId})
      .then((res) => {console.log(res); router.back()})
      .catch((err) => {console.log(err); alert("ERROR POSTING");});
  }

  return (
    <Container key={announcementImage}>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: "100vh" }}
        justifyContent={"center"}
      >
        <Grid minWidth={600}>
          <Paper elevation={15} sx={{ minHeight: 400, padding: 2 }}>
            <Grid container>
              <Grid
                container
                minHeight={400}
                rowGap={3}
                justifyContent={"center"}
                flexDirection="column"
                alignItems={"center"}
              >
                <Typography
                  variant="h5"
                  component="div"
                  sx={{ textAlign: "center" }}
                >
                  {operation?.toLowerCase() == "update" ? "Update Announcement" : "Post Announcement"}
                </Typography>

                <TextField
                  sx={{ minWidth: 400}}
                  minRows={4}
                  maxRows={20}
                  multiline
                  id="announcement-input"
                  label="Announcement"
                  inputRef={announcementRef}
                  defaultValue={announcementText}
                />

                <TextField
                  sx={{ minWidth: 250 }}
                  id="image-input"
                  label="Image URL"
                  inputRef={imageRef}
                  defaultValue={announcementImage}
                />

                <Button
                  variant="contained"
                  onClick={() => {
                    if (operation?.toLocaleLowerCase() == "update")
                      updateAnnouncement(announcementRef.current.value, imageRef.current.value);
                    else
                      postAnnouncement(announcementRef.current.value, imageRef.current.value);
                  }}
                >
                  {operation?.toLowerCase() == "update" ? "Update Announcement" : "Post Announcement"}
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
