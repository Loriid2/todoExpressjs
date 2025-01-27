const ul = document.getElementById("ul");
const button = document.getElementById("submit");
const input = document.getElementById("inputText");
let list = [];
let count = 0;
const myToken = "d6fe87f2-9677-4534-bd39-2a5ae35d8b14";
const myKey = "chiave";


function loadList() {
  fetch("https://ws.progettimolinari.it/cache/get", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "key": myToken
    },
    body: JSON.stringify({
      key: myKey,
    })
  })
  .then(response => response.json())
  .then(data => {
    list = JSON.parse(data.result);
    render();
  })
}
loadList();

button.onclick = () => {
  let data = {
    "inputValue": input.value,
    "completed": false
  };
  list.push(data);
  render();
  count++;
  input.value = "";
  update();
};

function render() {
  let html = "";
  list.forEach((element, id) => {
    let completedClass = element.completed ? "done" : "";
    html += `<li id='li_${id}' class='divs ${completedClass}'>${element.inputValue}<button type='button' class='pulsantiConferma' id='bottoneC_${id}'>conferma</button><button type='button' class='pulsantiElimina' id='bottoneE_${id}'>elimina</button></li>`;
  });
  ul.innerHTML = html;

  let eliminaButtons = document.querySelectorAll(".pulsantiElimina");
  eliminaButtons.forEach((button) => {
    button.onclick = () => {
      const id = parseInt(button.id.replace("bottoneE_", ""));
      list.splice(id, 1);
      count--;
      render();
      update();
    };
  });

  let confermaButtons = document.querySelectorAll(".pulsantiConferma");
  confermaButtons.forEach((button) => {
    button.onclick = () => {
      const id = parseInt(button.id.replace("bottoneC_", ""));
      list[id].completed = true;
      render();
      update();
    };
  });
}

function update() {
  fetch("https://ws.progettimolinari.it/cache/set", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "key": myToken
    },
    body: JSON.stringify({
      key: myKey,
      value: JSON.stringify(list)
    })
  })
  .then(response => response.json());
  
}

render();
