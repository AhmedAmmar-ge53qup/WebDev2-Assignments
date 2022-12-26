const fs = require("fs");

export default function handler(req, res) {
  const tasks = JSON.parse(fs.readFileSync("_data/tasks.json"));

  switch (req.method) {
    case "POST":
      tasks.push(req.body.task);

      fs.writeFile("_data/tasks.json", JSON.stringify(tasks), (err) => {
        if (err) {
          console.log(err);
          res.status(500).json({ failed: `Posting Task Failed` });
        } else {
          console.log("File written successfully\n");
          console.log("The written has the following contents:");
          console.log(JSON.parse(fs.readFileSync("_data/tasks.json")));
          res.status(200).json({ success: `Task Added` });
        }
      });
      break;
    case "PUT":
      const updatedTasks = [...tasks.filter(a => a.taskId != req.body.taskId), req.body.task];

      fs.writeFile("_data/tasks.json", JSON.stringify(updatedTasks), (err) => {
        if (err) {
          console.log(err);
          res.status(500).json({ failed: `Updating Task Failed` });
        } else {
          console.log("File written successfully\n");
          console.log("The written has the following contents:");
          console.log(JSON.parse(fs.readFileSync("_data/tasks.json")));
          res.status(200).json({ success: `Task Updated` });
        }
      });
      break;
    case "GET":
      fs.readFile("_data/tasks.json", (err, data) => {
        if (err) res.status(500).json({ error: err });
        else res.status(200).json({ data: JSON.parse(data) });
      });
      break;
    case "DELETE":
      const newTasks = [...tasks.filter((task) => task.taskId != req.body.taskId)]
      
      fs.writeFile("_data/tasks.json", JSON.stringify(newTasks), (err) => {
        if (err) {
          console.log(err);
          res.status(500).json({ failed: `Deleting Task Failed` });
        } else {
          console.log("File written successfully\n");
          console.log("The written has the following contents:");
          //console.log(JSON.parse(fs.readFileSync("_data/tasks.json")));
          res.status(200).json({ success: `Task Deleted` });
        }
      });
      break;
    default:
      break;
  }
}
