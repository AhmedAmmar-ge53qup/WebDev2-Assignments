const fs = require("fs");

export default function handler(req, res) {
  switch (req.method) {
    case "POST":
      const staff = JSON.parse(fs.readFileSync("_data/staff.json"));
      staff.push(req.body);

      fs.writeFile("_data/staff.json", JSON.stringify(staff), (err) => {
        if (err) {
          console.log(err);
          res.status(500).json({ failed: `Posting Staff Failed` });
        } else {
          console.log("File written successfully\n");
          console.log("The written has the following contents:");
          console.log(JSON.parse(fs.readFileSync("_data/staff.json")));
          res.status(200).json({ success: `Staff Added` });
        }
      });
      break;
    case "PUT":
      res.status(200).json({ method: "PUT" });
      break;
    case "GET":
      fs.readFile("_data/staff.json", (err, data) => {
        if (err) res.status(500).json({ error: err });
        else res.status(200).json({ data: JSON.parse(data) });
        
      });
      break;
    default:
      break;
  }
}
