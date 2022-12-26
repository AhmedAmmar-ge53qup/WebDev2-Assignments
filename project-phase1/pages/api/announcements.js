const fs = require("fs");

export default function handler(req, res) {
  const announcements = JSON.parse(fs.readFileSync("_data/announcements.json"));
  switch (req.method) {
    case "POST":
      announcements.push(req.body);

      fs.writeFile("_data/announcements.json", JSON.stringify(announcements), (err) => {
        if (err) {
          console.log(err);
          res.status(500).json({ failed: `Posting Announcement Failed` });
        } else {
          console.log("File written successfully\n");
          console.log("The written has the following contents:");
          console.log(JSON.parse(fs.readFileSync("_data/announcements.json")));
          res.status(200).json({ success: `Announcement Added` });
        }
      });
      break;
    case "PUT":
      const updatedAnnouncements = [...announcements.filter(announcement => announcement.announcementId != req.body.announcementId), req.body.announcement]
      fs.writeFile("_data/announcements.json", JSON.stringify(updatedAnnouncements), (err) => {
        if (err) {
          console.log(err);
          res.status(500).json({ failed: `Updating Announcement Failed` });
        } else {
          console.log("File written successfully\n");
          console.log("The written has the following contents:");
          console.log(JSON.parse(fs.readFileSync("_data/announcements.json")));
          res.status(200).json({ success: `Message Updated` });
        }
      });
      break;
    case "DELETE":
      const newAnnouncements = [...announcements.filter(announcement => announcement.announcementId != req.body.announcementId)]
      fs.writeFile("_data/announcements.json", JSON.stringify(newAnnouncements), (err) => {
        if (err) {
          console.log(err);
          res.status(500).json({ failed: `Deleting Announcement Failed` });
        } else {
          console.log("File written successfully\n");
          console.log("The written has the following contents:");
          console.log(JSON.parse(fs.readFileSync("_data/announcements.json")));
          res.status(200).json({ success: `Message Deleted` });
        }
      });
      break;
    case "GET":
      fs.readFile("_data/announcements.json", (err, data) => {
        if (err) res.status(500).json({ error: err });
        else res.status(200).json({ data: JSON.parse(data) });
      });
      break;
    default:
      break;
  }
}
