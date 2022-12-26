const fs = require("fs");

export default function handler(req, res) {
  const messages = JSON.parse(fs.readFileSync("_data/messages.json"));
  switch (req.method) {
    case "POST":
      messages.push(req.body);
      fs.writeFile("_data/messages.json", JSON.stringify(messages), (err) => {
        if (err) {
          console.log(err);
          res.status(500).json({ failed: `Posting Message Failed` });
        } else {
          console.log("File written successfully\n");
          console.log("The written has the following contents:");
          console.log(JSON.parse(fs.readFileSync("_data/messages.json")));
          res.status(200).json({ success: `Message Added` });
        }
      });
      break;
    case "PUT":
      const updatedMessages = [...messages.filter(message => message.messageId != req.body.messageId), req.body.message]
      fs.writeFile("_data/messages.json", JSON.stringify(updatedMessages), (err) => {
        if (err) {
          console.log(err);
          res.status(500).json({ failed: `Update Message Failed` });
        } else {
          console.log("File written successfully\n");
          console.log("The written has the following contents:");
          console.log(JSON.parse(fs.readFileSync("_data/messages.json")));
          res.status(200).json({ success: `Message Updated` });
        }
      });
      break;
    case "DELETE":
      const newMessages = [...messages.filter(message => message.messageId != req.body.messageId)]
      fs.writeFile("_data/messages.json", JSON.stringify(newMessages), (err) => {
        if (err) {
          console.log(err);
          res.status(500).json({ failed: `Deleting Message Failed` });
        } else {
          console.log("File written successfully\n");
          console.log("The written has the following contents:");
          console.log(JSON.parse(fs.readFileSync("_data/messages.json")));
          res.status(200).json({ success: `Message Deleted` });
        }
      });
      break;
    case "GET":
      fs.readFile("_data/messages.json", (err, data) => {
        if (err) res.status(500).json({ error: err });
        else res.status(200).json({ data: JSON.parse(data) });
      });
      break;
    default:
      break;
  }
}
