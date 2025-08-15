// public/js/realtime.js
const socket = io();

// Submit alta
document.getElementById("productForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const product = Object.fromEntries(fd);
  socket.emit("newProduct", product);
  e.target.reset();
});

// Delegación: eliminar
document.getElementById("productList")?.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-delete")) {
    const id = e.target.getAttribute("data-id");
    socket.emit("deleteProduct", { id });
  }
});

// Render de la lista
function renderList(products) {
  const list = document.getElementById("productList");
  if (!list) return;
  list.innerHTML = "";
  products.forEach((p) => {
    const li = document.createElement("li");
    li.setAttribute("data-id", p.id);
    li.innerHTML = `
      <strong>${p.title}</strong> - $${p.price}
      <small>(código: ${p.code ?? ""})</small>
      <button class="btn-delete" data-id="${p.id}">Eliminar</button>
    `;
    list.appendChild(li);
  });
}

socket.on("updateProducts", (products) => {
  renderList(products);
});

socket.on("errorMessage", (msg) => {
  alert(msg);
});
