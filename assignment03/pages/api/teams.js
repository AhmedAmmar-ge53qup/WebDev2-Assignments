const fs = require("fs");

export default function handler(req, res) {
  switch (req.method) {
    case "GET":
      fs.readFile("data/teams.json", (err, data) => {
        if (err) res.status(500).json({ error: err });
        else res.status(200).json({ data: JSON.parse(data) });
      });
      break;
    default:
      break;
  }
}
