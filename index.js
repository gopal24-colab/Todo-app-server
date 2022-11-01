const express = require("express");
const fs = require("fs");
const app = express();
const port = 3000;
const PATH = "/public/database.txt";
const bodyparser = require("body-parser");
const parser = bodyparser.urlencoded({ extended: false });
app.use(express.static("public"), express.json());

app.post("/sendData", parser, (req, res) => {
  const recivedData = req.body;
  let userList = [];
  fs.readFile(
    __dirname + PATH,
    {
      encoding: "utf8",
      flag: "r",
    },
    (err, data) => {
      if (err) console.error(err);
      if (data == "") userList = [];
      else userList = JSON.parse(data);
      userList.push(recivedData);
      fs.writeFile(__dirname + PATH, JSON.stringify(userList), (err) => {
        if (err) console.error(err);
        console.log("data saved");
      });
    }
  );
  res.send({ message: "data received" });
});
app.get("/getList", (req, res) => {
  console.log(req.url);
  fs.readFile(
    __dirname + PATH,
    {
      encoding: "utf8",
      flag: "r",
    },
    (err, data) => {
      if (err) console.error(err);
      res.end(data);
    }
  );
});

app.post("/deleteList", parser, (req, res) => {
  console.log(req.url);
  const deleteId = req.body;
  console.log(deleteId);
  let userList = [];
  fs.readFile(
    __dirname + PATH,
    {
      encoding: "utf8",
      flag: "r",
    },
    (err, data) => {
      if (err) console.error(err);
      if (data == "") userList = [];
      else userList = JSON.parse(data);
      let i,
        index = 0;
      const len = userList.length;
      for (i = 0; i < len; i++) {
        if (userList[i].id == deleteId.id) {
          index = i;
          break;
        }
      }
      userList.splice(index, 1);
      fs.writeFile(__dirname + PATH, JSON.stringify(userList), (err) => {
        if (err) console.error(err);
        console.log("list delete and file save again");
      });
    }
  );
  res.send({ message: "delete successful" });
});
app.post("/changeStatus", parser, (req, res) => {
  console.log(req.url);
  const deleteId = req.body;
  console.log(deleteId);
  let userList = [];
  fs.readFile(
    __dirname + PATH,
    {
      encoding: "utf8",
      flag: "r",
    },
    (err, data) => {
      if (err) {
        console.log(`status-1 ${err}`);
        res.send({ message: "error" });
      }
      if (data == "") userList = [];
      else userList = JSON.parse(data);
      //console.log(userList);
      let status1 = userList.filter((obj) => {
        if (obj.id == deleteId.id) {
          return true;
        }
      });
      if (status1.length == 1) {
        if (status1[0].status == "checked") {
          status1[0].status = "";
        } else {
          status1[0].status = "checked";
        }
      }
      fs.writeFile(__dirname + PATH, JSON.stringify(userList), (err) => {
        if (err) {
          console.error(`status error-2 ${err}`);
          res.send({ message: "error" });
        }
        console.log("status changed and save");
        res.send({ message: "status changed" });
      });
    }
  );
});

app.listen(port, (err) => {
  if (err) throw err;
  else console.log(`Server started on port ${port}`);
});
