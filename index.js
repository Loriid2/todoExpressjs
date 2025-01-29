const http=require("http");

const express = require("express");

const app = express();

const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({

   extended: true

}));

const path = require('path');

app.use("/", express.static(path.join(__dirname, "public")));

let todos = [];

app.post("/todo/add", (req, res) => {
   const { inputValue, completed = false } = req.body;
   const todo = {
     id: "" + new Date().getTime(), 
     inputValue,
     completed,
   };
   todos.push(todo);
   res.json({ result: "Ok", todo });
 });
 

app.get("/todo", (req, res) => {
console.log(todos);
   res.json({todos: todos});

});

const server = http.createServer(app);

server.listen(80, () => {

  console.log("- server running");

});

app.put("/todo/complete", (req, res) => {
console.log("dentro");
   let todo = req.body;

   try {

      todos = todos.map((element) => {

         if (element.id === todo.id) {
            element.completed = !todo.completed;

         }

         return element;

      })

   } catch (e) {

      console.log(e);

   }

   res.json({result: "Ok"});

});

app.delete("/todo/:id", (req, res) => {

   todos = todos.filter((element) => element.id !== req.params.id);

   res.json({result: "Ok"});  

})
app.put("/todo/modify", (req, res) => {
   console.log("dentro");
      let todo = req.body;
   
      try {
   
         todos = todos.map((element) => {
   
            if (element.id === todo.id) {
   
               element.inputValue = todo.inputValue;
   
            }
   
            return element;
   
         })
   
      } catch (e) {
   
         console.log(e);
   
      }
   
      res.json({result: "Ok"});
   
   });