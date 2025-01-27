const http = require("http");

const express = require("express");

const app = express();

const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({

   extended: true

}));

const path = require('path');

app.use("/", express.static(path.join(__dirname, "public")));
const todos = [];

app.post("/todo/add", (req, res) => {

   const todo = req.body.todo;

   todo.id = "" + new Date().getTime();

   todos.push(todo);

   res.json({result: "Ok"});

});

app.get("/todo", (req, res) => {

   res.json({todos: todos});

});

const server = http.createServer(app);

server.listen(80, () => {

  console.log("- server running");

});