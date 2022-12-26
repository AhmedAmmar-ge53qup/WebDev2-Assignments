const fs = require("fs");

export default function handler(req, res) {
  switch (req.method) {
    case "POST":
      const parents = JSON.parse(fs.readFileSync("_data/parents.json"));
      parents.push(req.body);

      fs.writeFile("_data/parents.json", JSON.stringify(parents), (err) => {
        if (err) {
          console.log(err);
          res.status(500).json({ failed: `Posting Parent Failed` });
        } else {
          console.log("File written successfully\n");
          console.log("The written has the following contents:");
          console.log(JSON.parse(fs.readFileSync("_data/parents.json")));
          res.status(200).json({ success: `Parent Added` });
        }
      });
      break;
    case "PUT":
      res.status(200).json({ method: "PUT" });
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
