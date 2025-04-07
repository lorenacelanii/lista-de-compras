const inputItem = document.getElementById("input-item");
const botaoAdicionar = document.getElementById("adicionar-item");
const listaCompras = document.getElementById("lista-de-compras");
const mensagemErro = document.getElementById("mensagem-erro");

document.addEventListener("DOMContentLoaded", carregarLista);
botaoAdicionar.addEventListener("click", adicionarItem);


inputItem.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault(); // Evita envio do formulário
    adicionarItem();
  }
});

function adicionarItem() {
  const nomeItem = inputItem.value.trim();

  if (nomeItem === "") {
    mensagemErro.classList.remove("escondido");
    setTimeout(() => {
      mensagemErro.classList.add("escondido");
    }, 2000);
    return;
  }

  const dataAtual = new Date();
  const dataFormatada = dataAtual.toLocaleDateString("pt-BR");
  const horaFormatada = dataAtual.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit"
  });

  const item = {
    id: Date.now(),
    nome: nomeItem,
    data: dataFormatada,
    hora: horaFormatada,
    comprado: false
  };

  salvarItem(item);
  renderizarItem(item);

  inputItem.value = "";
}

function renderizarItem(item) {
  const li = document.createElement("li");

  li.innerHTML = `
    <div class="lista-item-container">
      <input type="checkbox" ${item.comprado ? "checked" : ""} data-id="${item.id}" />
      <p class="${item.comprado ? "comprado" : ""}">${item.nome}</p>
      <button class="botao-remover" data-id="${item.id}">🗑️</button>
    </div>
    <p class="texto-data">${formatarDiaSemana(item.data)} às ${item.hora}</p>
  `;

  const checkbox = li.querySelector("input[type='checkbox']");
  checkbox.addEventListener("change", alternarComprado);

  const botaoRemover = li.querySelector(".botao-remover");
  botaoRemover.addEventListener("click", removerItem);

  listaCompras.appendChild(li);
}

function salvarItem(item) {
  const lista = buscarListaSalva();
  lista.push(item);
  localStorage.setItem("listaCompras", JSON.stringify(lista));
}

function carregarLista() {
  const lista = buscarListaSalva();
  lista.forEach(renderizarItem);
}

function removerItem(event) {
  const id = event.target.dataset.id;
  let lista = buscarListaSalva();
  lista = lista.filter(item => item.id != id);
  localStorage.setItem("listaCompras", JSON.stringify(lista));
  event.target.closest("li").remove();
}

function alternarComprado(event) {
  const id = event.target.dataset.id;
  const lista = buscarListaSalva();
  const item = lista.find(item => item.id == id);
  item.comprado = event.target.checked;
  localStorage.setItem("listaCompras", JSON.stringify(lista));

  const p = event.target.nextElementSibling;
  p.classList.toggle("comprado");
}

function buscarListaSalva() {
  return JSON.parse(localStorage.getItem("listaCompras")) || [];
}

function formatarDiaSemana(dataStr) {
  const dias = [
    "Domingo", "Segunda-feira", "Terça-feira",
    "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"
  ];
  const partes = dataStr.split("/");
  const data = new Date(`${partes[2]}-${partes[1]}-${partes[0]}`);
  return `${dias[data.getDay()]} (${dataStr})`;
}
