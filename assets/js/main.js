const inputTarefa = document.querySelector(".input-tarefa");
const btnTarefa = document.querySelector(".btn-tarefa");
const tarefas = document.querySelector(".tarefas");

function criaLi() {
  const li = document.createElement("li");
  return li;
}

inputTarefa.addEventListener("keypress", function (e) {
  if (e.keyCode === 13) {
    if (!inputTarefa.value) return;
    criaTarefa(inputTarefa.value);
  }
});

function limpaInput() {
  inputTarefa.value = "";
  inputTarefa.focus();
}

function criaBotao(li, inputValue) {
  const textoTarefa = li.firstChild.textContent;

  const botaoApagar = document.createElement("button");
  botaoApagar.setAttribute("class", "apagar");
  botaoApagar.setAttribute("title", "apagar esta tarefa");

  const botaoChecar = document.createElement("button");
  botaoChecar.setAttribute("class", "checar");
  botaoChecar.setAttribute("title", "checar esta tarefa");

  const inputNumber = document.createElement("input");
  inputNumber.setAttribute("type", "number");
  inputNumber.setAttribute("class", "numero");
  inputNumber.value = (inputValue !== undefined && inputValue !== null) ? inputValue : 0; // Define o valor inicial como 0 se o inputValue for indefinido ou nulo
  inputNumber.min = 0; // Define o valor mínimo como 0
  

  inputNumber.addEventListener("keydown", function (event) {
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
    }
  });

  const botaoQuantidade = document.createElement("button");
  botaoQuantidade.setAttribute("class", "quantidade");

  const botaoIncremento = document.createElement("span");
  botaoIncremento.innerText = "+";
  botaoIncremento.setAttribute("class", "incremento");
  botaoIncremento.addEventListener("click", function () {
    inputNumber.stepUp();
    salvarTarefas();
  });

  const botaoDecremento = document.createElement("span");
  botaoDecremento.innerText = "-";
  botaoDecremento.setAttribute("class", "decremento");
  botaoDecremento.addEventListener("click", function () {
    if (inputNumber.value > 0) {
      inputNumber.stepDown();
      salvarTarefas();
    }
  });

  botaoQuantidade.appendChild(botaoIncremento);
  botaoQuantidade.appendChild(inputNumber);
  botaoQuantidade.appendChild(botaoDecremento);

  const imagemChecar = document.createElement("i");
  imagemChecar.classList.add("fas", "fa-circle-check", "fa-bounce");
  botaoChecar.appendChild(imagemChecar);

  const imagemApagar = document.createElement("i");
  imagemApagar.classList.add("fas", "fa-trash-can");
  botaoApagar.appendChild(imagemApagar);

  li.textContent = "";
  li.appendChild(document.createTextNode(textoTarefa));
  li.appendChild(botaoChecar);
  li.appendChild(botaoQuantidade);
  li.appendChild(botaoApagar);

  botaoApagar.addEventListener("click", function () {
    li.remove();
    salvarTarefas();
  });

  botaoChecar.addEventListener("click", function () {
    const novaCor = li.getAttribute("data-color") ? "" : "green";
    li.setAttribute("data-color", novaCor);
    salvarTarefas();
  });

  inputNumber.addEventListener("input", function () {
    salvarTarefas();
  });
}

function criaTarefa(textoInput, corInput, inputValue = 0) {
  const li = criaLi();
  li.innerText = textoInput;
  tarefas.appendChild(li);
  limpaInput();
  criaBotao(li, inputValue);

  li.setAttribute("data-color", corInput);
  li.querySelector(".numero").value = inputValue;

  salvarTarefas();
}

btnTarefa.addEventListener("click", (e) => {
  if (!inputTarefa.value) return;
  criaTarefa(inputTarefa.value, "", 0);
  criaBotao(tarefas.lastChild, 0); // Chama a função criaBotao para o novo li
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("apagar")) {
    const liElement = e.target.closest("li");
    liElement?.remove();
    salvarTarefas();
  }
});

function salvarTarefas() {
  const liTarefas = tarefas.querySelectorAll("li");
  const listaDeTarefas = [];
  for (let tarefa of liTarefas) {
    let tarefaTexto = tarefa.innerText;
    tarefaTexto = tarefaTexto.replace("Apagar", "").trim();
    const tarefaCor = tarefa.getAttribute("data-color");
    const tarefaInputValue = tarefa.querySelector(".numero").value;
    const tarefaObjeto = {
      texto: tarefaTexto,
      cor: tarefaCor,
      inputValue: tarefaInputValue,
    };
    listaDeTarefas.push(tarefaObjeto);
  }
  const tarefasJson = JSON.stringify(listaDeTarefas);
  localStorage.setItem("tarefas", tarefasJson);
}

function adicionaTarefasSalvas() {
  const tarefas = localStorage.getItem("tarefas");
  if (tarefas) {
    const listaDeTarefas = JSON.parse(tarefas);
    if (Array.isArray(listaDeTarefas)) {
      for (let tarefaObjeto of listaDeTarefas) {
        const tarefaTexto = tarefaObjeto.texto;
        const tarefaCor = tarefaObjeto.cor;
        const tarefaInputValue = tarefaObjeto.inputValue;
        criaTarefa(tarefaTexto, tarefaCor, tarefaInputValue);
      }
    }
  }
}

adicionaTarefasSalvas();
