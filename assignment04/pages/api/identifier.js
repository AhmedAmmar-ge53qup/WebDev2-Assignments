import { v4 as uuidv4 } from "uuid";
import fs from "fs";

export default async function handler(req, res) {
  let users = [];
  if (fs.existsSync("/tmp/users.json"))
  {
    const file = await fs.promises.readFile("/tmp/users.json");
    users = JSON.parse(file);
  }
  else
    fs.writeFile("/tmp/users.json", "[]", function (err) {
      if (err) throw err;
      console.log("Users.json created !");
    });

  switch (req.method) {
    case "POST":
      res.status(500).json({ error: `POST not supported` });
      break;
    case "PUT":
      res.status(500).json({ error: `PUT not supported` });
      break;
    case "DELETE":
      res.status(500).json({ error: `DELETE not supported` });
      break;
    case "GET":
      if (!req.query.uuid) {
        const tmpUuid = uuidv4();
        users.push(tmpUuid);
        console.log("=========== users ===========");
        console.log(users);
        fs.writeFile("/tmp/users.json", JSON.stringify(users), (err) => {
          if (err) {
            console.log(err);
            res.status(500).json({ failed: `Generating UUID Failed` });
          } else {
            console.log("File written successfully\n");
            console.log("The written has the following contents:");
            res.status(200).json(tmpUuid);
          }
        });
      }

      // if (req.query.uuid)
      //     res.status(500).json("User Already Exists, cant re-generate")
      // else
      //     res.status(200).json(uuidv4());
      break;
    default:
      break;
  }
}
