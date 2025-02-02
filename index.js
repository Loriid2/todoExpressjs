const http=require("http");

const express = require("express");

const app = express();

const bodyParser = require('body-parser');

const fs = require('fs');

const mysql = require('mysql2');

const conf = JSON.parse(fs.readFileSync('conf.json'));

const connection = mysql.createConnection({
   host: conf.host,
 
    user: conf.user,
 
    password: conf.password,
 
    database: conf.database,
    
    port: conf.port,

    ssl : {
     ca :  fs.readFileSync(__dirname + '/ca.pem')
    }    
});


app.use(bodyParser.json());

app.use(bodyParser.urlencoded({

   extended: true

}));

const path = require('path');

app.use("/", express.static(path.join(__dirname, "public")));

let todos = [];

app.post("/todo/add", async (req, res) => {
   const { inputValue } = req.body;
   console.log(inputValue)
   try {
     const result = await executeQuery("INSERT INTO todo (name) VALUES (?)", [inputValue]);
     res.json({ result: "Ok", todo: { id: result.insertId, inputValue, completed: false } });
   } catch (error) {
     res.status(500).json({ error: "Errore durante l'inserimento" });
   } 
 });
 

 app.get("/todo", async (req, res) => {
   try {
     const todos = await select();
     const formattedTodos = todos.map(todo => ({
       id: todo.id,
       inputValue: todo.name, 
       completed: todo.completed
     }));
     res.json({ todos: formattedTodos });
   } catch (error) {
     res.status(500).json({ error: "Errore nel recupero dei dati" });
   }
});


 app.put("/todo/complete", async (req, res) => {
   const { id, completed } = req.body;
   console.log(id);
   try {
     await executeQuery("UPDATE todo SET completed = ? WHERE id = ?", [!completed, id]);
     res.json({ result: "Ok" });
   } catch (error) {
     res.status(500).json({ error: "Errore durante l'aggiornamento" });
   }
 });

 app.delete("/todo/:id", async (req, res) => {
   try {
     await executeQuery("DELETE FROM todo WHERE id = ?", [req.params.id]);
     res.json({ result: "Ok" });
   } catch (error) {
     res.status(500).json({ error: "Errore durante l'eliminazione" });
   }
 });
/*app.put("/todo/modify", (req, res) => {
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
   
   });*/
  
   const executeQuery = (sql, params = []) => {
      return new Promise((resolve, reject) => {      
         connection.query(sql, params, function (err, result) {
            if (err) {
               console.error(err);
               reject(err); 
               return; 
            }   
            resolve(result);        
         });
      });
   };
   
   
const createTable = () => {
   console.log("create table")
   
      return executeQuery(`
   
      CREATE TABLE IF NOT EXISTS todo
   
         ( id INT PRIMARY KEY AUTO_INCREMENT, 
   
            name VARCHAR(255) NOT NULL, 
   
            completed BOOLEAN ) 
   
         `);      
   
   }

const select = () => {
   
      const sql = `
   
      SELECT id, name, completed FROM todo 
   
         `;
   
      return executeQuery(sql); 
   
   }  
const server = http.createServer(app);

server.listen(80, () => {

  console.log("- server running");

});
createTable()
   .then(() => {
     return console.log("creato")
   })
   .then(() => {
     return select();
   })
   .then((result) => {
     console.log("DATABASE", result);
   })
   .catch((err) => {
     console.error("Errore nell'inizializzazione del database:", err);
   });

