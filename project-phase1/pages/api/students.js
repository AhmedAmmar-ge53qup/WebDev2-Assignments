const fs = require("fs");

export default function handler(req, res) {

  const parents = JSON.parse(fs.readFileSync("_data/parents.json"));

  switch (req.method) {
    case "POST":
      parents[
        parents.findIndex(
          (parent) => parent.qatariId === parseInt(req.body.qatariId)
        )
      ].students.push(req.body.student);

      fs.writeFile("_data/parents.json", JSON.stringify(parents), (err) => {
        if (err) {
          console.log(err);
          res.status(500).json({ failed: `Posting Student Failed` });
        } else {
          console.log("File written successfully\n");
          console.log("The written has the following contents:");
          console.log(JSON.parse(fs.readFileSync("_data/parents.json")));
          res.status(200).json({ success: `Student Added` });
        }
      });
      break;
    case "PUT":
      const studentsForParent = parents[
        parents.findIndex(
          (parent) => parent.qatariId === parseInt(req.body.qatariId)
        )
      ].students;
      
      parents[
        parents.findIndex(
          (parent) => parent.qatariId === parseInt(req.body.qatariId)
        )
      ].students = [...studentsForParent.filter(a => a.studentId != req.body.student.studentId), req.body.student];

      fs.writeFile("_data/parents.json", JSON.stringify(parents), (err) => {
        if (err) {
          console.log(err);
          res.status(500).json({ failed: `Updating Student Failed` });
        } else {
          console.log("File written successfully\n");
          console.log("The written has the following contents:");
          console.log(JSON.parse(fs.readFileSync("_data/parents.json")));
          res.status(200).json({ success: `Student Updated` });
        }
      });
      break;
    case "GET":
      fs.readFile("_data/parents.json", (err, data) => {
        if (err) res.status(500).json({ error: err });
        else res.status(200).json({ data: JSON.parse(data) });
        
      });
      break;
    default:
      break;
  }
}
