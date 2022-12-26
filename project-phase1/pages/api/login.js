const fs = require("fs");

export default function handler(req, res) {
  const parents = JSON.parse(fs.readFileSync("_data/parents.json"));
  const staff = JSON.parse(fs.readFileSync("_data/staff.json"));

  switch (req.method) {
    case "POST":
      res.status(200).json(login(req.body.username, req.body.password));
      break;
    case "PUT":
      res.status(200).json({ method: "PUT IS NOT SUPPORTED" });
      break;
    case "DELETE":
      res.status(200).json({ method: "DELETE IS NOT SUPPORTED" });
      break;
    case "GET":
      res.status(200).json({ method: "GET IS NOT SUPPORTED" });
      break;
    default:
      break;
  }

  function login(username, password) {
    const tempStaff = staff;
    const tempParents = parents;

    const userStaff = tempStaff.find((staff) => staff?.username === username);
    const userParent = tempParents.find(
      (parent) => parent?.username === username
    );

    console.log(userParent);

    if (userStaff && userStaff.password === password)
      if (userStaff.isCoordinator) {
        return { user: userStaff, role: "coordinator" };
      } else {
        return { user: userStaff, role: "teacher" };
      }
    else if (userParent && userParent.password === password) {
      return { user: userParent, role: "parent" };
    } 
    else return { error: "USER DOES NOT EXIST" };
  }
}
