# TP 2 - Backend Coderhouse (Websockets + Handlebars)

## ✨ Descripción

Este proyecto extiende el trabajo del TP01 incorporando **vistas dinámicas** con Handlebars y **actualización en tiempo real** usando WebSockets (Socket.io). El sistema permite visualizar, agregar y eliminar productos en una vista interactiva, sin necesidad de recargar la página.

---

## 📦 Tecnologías utilizadas

- Node.js
- Express
- Express-Handlebars
- Socket.io
- JavaScript (ESModules)
- File System (`fs/promises`)
- Font Awesome (íconos)
- Google Fonts (`Quicksand`)
- CSS personalizado

---

## 🚀 Cómo ejecutar el proyecto

1. **Clonar el repositorio**

```bash
git clone https://github.com/TuUsuario/TP02-BACK.git
cd TP02-BACK
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Iniciar el servidor**

```bash
node src/app.js
```

El servidor estará disponible en:  
📍 `http://localhost:8080`

---

## 🌐 Vistas disponibles

### 🔹 `/home` (vista tradicional con Handlebars)

- Lista estática de productos al momento de cargar la página.
- Datos renderizados del archivo `products.json`.

### 🔹 `/realtimeproducts` (vista en tiempo real)

- Lista de productos actualizable en tiempo real.
- Formulario para agregar productos sin recargar.
- Botón de eliminar producto con actualización inmediata vía WebSocket.
- Estilo visual amigable, rosado y moderno ✨

---

## 🧠 Funcionalidades en tiempo real

- Comunicación WebSocket (`socket.io`)
- Broadcast a todos los clientes conectados cuando:
  - Se agrega un producto
  - Se elimina un producto
- Renderizado dinámico del DOM con JS

---

## 🔁 Endpoints REST existentes

(Preservados del TP01)

### Productos - `/api/products`

| Método | Ruta    | Descripción                   |
| ------ | ------- | ----------------------------- |
| GET    | `/`     | Listar todos los productos    |
| GET    | `/:pid` | Obtener un producto por su ID |
| POST   | `/`     | Agregar un nuevo producto     |
| PUT    | `/:pid` | Actualizar un producto por ID |
| DELETE | `/:pid` | Eliminar un producto por ID   |

### Carritos - `/api/carts`

| Método | Ruta                 | Descripción                               |
| ------ | -------------------- | ----------------------------------------- |
| POST   | `/`                  | Crear un carrito nuevo                    |
| GET    | `/:cid`              | Obtener productos de un carrito por su ID |
| POST   | `/:cid/product/:pid` | Agregar un producto al carrito específico |

---

## 📁 Estructura del proyecto

```
├── products.json
├── public/
│   └── js/
│       └── realtime.js
│   └── style.css
├── views/
│   ├── layouts/
│   │   └── main.handlebars
│   ├── home.handlebars
│   └── realTimeProducts.handlebars
├── src/
│   ├── app.js
│   ├── routes/
│   │   ├── products.router.js
│   │   └── carts.router.js
│   └── managers/
│       ├── ProductManager.js
│       └── CartManager.js
├── .gitignore
├── package.json
└── README.md
```

---

## ✅ Requisitos cumplidos

- Handlebars como motor de vistas
- WebSockets con Socket.io
- Rutas `/home` y `/realtimeproducts`
- Actualización de productos en tiempo real
- Estilo visual cuidado y moderno
- Persistencia en archivo `.json`
- Separación clara de responsabilidades (rutas, lógica, vistas)

---

## 📬 Autora

Paula Cedones – Curso Backend 1 – Coderhouse
# TP03-BACK
