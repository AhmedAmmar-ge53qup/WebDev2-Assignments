import fs from "fs";

export default async function handler(req, res) {

  let ideas = [];
  if (fs.existsSync("/tmp/ideas.json"))
  {
    const file = await fs.promises.readFile("/tmp/ideas.json");
    ideas = JSON.parse(file);
  }
  else
    fs.writeFile("/tmp/ideas.json", "[]", function (err) {
      if (err) throw err;
      console.log("ideas.json Created !");
    });
    
  switch (req.method) {
    case "POST":
      ideas.push(req.body);

      fs.writeFile("/tmp/ideas.json", JSON.stringify(ideas), (err) => {
        if (err) {
          console.log(err);
          res.status(500).json({ failed: `Posting Idea Failed` });
        } else {
          console.log("File written successfully\n");
          console.log("The written has the following contents:");
          res.status(200).json({ success: `Idea Added` });
        }
      });
      break;
    case "PUT":
      res.status(500).json({ error: `PUT not supported` });
      break;
    case "DELETE":
      const newIdeas = [...ideas.filter(idea => idea.id != req.body.id)]
      fs.writeFile("/tmp/ideas.json", JSON.stringify(newIdeas), (err) => {
        if (err) {
          console.log(err);
          res.status(500).json({ failed: `Deleting Idea Failed` });
        } else {
          console.log("File written successfully\n");
          console.log("The written has the following contents:");
          res.status(200).json({ success: `Idea Deleted` });
        }
      });
      break;
    case "GET":
      res.status(200).json(ideas.filter(idea => idea.user == req.query.user));
      break;
    default:
      break;
  }
}
