const ul = document.getElementById("ul");
const button = document.getElementById("submit");
const input = document.getElementById("inputText");
let list = [];
let count = 0;
const myKey = "chiave";
const modifyText= document.querySelector("#modificaText");
const modifyButton = document.querySelector("#modifica")

function loadList() {
  fetch("/todo", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  })
  .then(response => response.json())
  .then(data => {
    console.log(data.todos);
    list = data.todos;
    render();
  })
}
loadList();

button.onclick = () => {
  const data = {
    inputValue: input.value,
    completed: false,
  };

  fetch("/todo/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      list.push(result.todo); 
      render();
      input.value = ""; 
    });
};

function render() {
  let html = "";
  list.forEach((element, id) => {
    let completedClass = element.completed ? "done" : "";
    html += `<li id='li_${element.id}' class='divs ${completedClass}'>
      ${element.inputValue}
      <button type='button' class='pulsantiConferma' id='bottoneC_${id}'>conferma</button>
      <button type='button' class='pulsantiElimina' id='bottoneE_${element.id}'>elimina</button>
      

    </li>`;
    /*<button type='button' class='pulsantiModifica' id='bottoneM_${element.id}'>modifica</button>*/
  });
  ul.innerHTML = html;

  document.querySelectorAll(".pulsantiElimina").forEach((button) => {
    button.onclick = () => {
      const id = button.id.replace("bottoneE_", "");
      remove(id);
    };
  });

  document.querySelectorAll(".pulsantiConferma").forEach((button) => {
    button.onclick = () => {
      const id = button.id.replace("bottoneC_", "");
      update(id);
    };
  });
 /* document.querySelectorAll(".pulsantiModifica").forEach((button) => {
    button.onclick = () => {
      
      const id = button.id.replace("bottoneM_", "");
      
      modifyText.classList.remove("hide")
      modifyText.classList.add("show")
      modifyButton.classList.remove("hide")
      modifyButton.classList.add("show")
      console.log("text",modifyText.classList)
      console.log("button",modifyButton.classList)
      modifyButton.onclick=()=>{
        modifyText.classList.remove("show")
        modifyText.classList.add("hide")
        modify(list[id]);
      }
      
    };
  });*/
}


function update(id) {
  console.log(id)
  const todo = list[id];
  fetch("/todo/complete", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todo),
  })
    .then((response) => response.json())
    .then(() => {
      if(!todo.completed){
      todo.completed = true;
      }else{
        todo.completed=false
      } 
      render();
    });
}
function remove(id) {
  console.log(id);

    render();
  fetch(`/todo/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then(() => {
      loadList();
      render();
    });
}
function modify(todo) {
  //const todo = list.find((item) => item.id === id);
  fetch("/todo/modify", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todo),
  })
    .then((response) => response.json())
    .then(() => {
     todo.inputValue= modifyText.value;
      render();
    });
}

render();