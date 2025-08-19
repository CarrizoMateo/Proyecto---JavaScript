const db = {
  items: [],
  methods: {
    find: (id) => db.items.find((item) => item.id === id),
    remove: (items) => {
      items.forEach((item) => {
        const product = db.methods.find(item.id);
        product.qty = product.qty - item.qty;
      });
    },
  },
};

const shoppingFigus = {
  items: [],
  methods: {
    add: (id, qty) => {
      const figusItem = shoppingFigus.methods.get(id);
      if (figusItem) {
        if (shoppingFigus.methods.hasInventory(id, qty + figusItem.qty)) {
          figusItem.qty += qty;
        } else {
          Swal.fire("No hay suficiente stock");
        }
      } else {
        shoppingFigus.items.push({ id, qty });
      }
    },
    remove: (id, qty) => {
      const figusItem = shoppingFigus.methods.get(id);
      if (figusItem && figusItem.qty - qty > 0) {
        figusItem.qty -= qty;
      } else {
        shoppingFigus.items = shoppingFigus.items.filter(
          (item) => item.id != id
        );
      }
    },
    count: () => shoppingFigus.items.reduce((acc, item) => acc + item.qty, 0),
    get: (id) => {
      const index = shoppingFigus.items.findIndex((item) => item.id === id);
      return index >= 0 ? shoppingFigus.items[index] : null;
    },
    getTotal: () => {
      return shoppingFigus.items.reduce((acc, item) => {
        const found = db.methods.find(item.id);
        return acc + found.price * item.qty;
      }, 0);
    },
    hasInventory: (id, qty) => {
      return db.items.find((item) => item.id === id).qty - qty >= 0;
    },
    purchase: () => {
      db.methods.remove(shoppingFigus.items);
      shoppingFigus.items = [];
      Swal.fire("Compra realizada con éxito");
      renderStore();
    },
  },
};


fetch("productos.json")
  .then((res) => res.json())
  .then((data) => {
    db.items = data;
    renderStore();
  })
  .catch((err) => {
    console.error("Error cargando productos:", err);
    Swal.fire("Error cargando productos");
  });

function renderStore() {
  const html = db.items.map((item) => {
    return `
    <div class="item">
      <div>
        <div class="title">${item.title}</div>
        <div class="price">${numberToCurrency(item.price)}</div>
        <div class="qty">Stock: ${item.qty}</div>
        <div class="actions">
          <button class="add" data-id="${item.id}">Agregar</button>        
        </div>
      </div> 
    </div>
    `;
  });

  document.querySelector("#store-container").innerHTML = html.join("");

  document.querySelectorAll(".item .actions .add").forEach((button) => {
    button.addEventListener("click", (event) => {
      const id = parseInt(button.getAttribute("data-id"));
      const item = db.methods.find(id);

      if (item && item.qty >= 1) {
        shoppingFigus.methods.add(id, 1);
        renderShoppingFigus();
        renderStore();
      } else {
        Swal.fire("No hay suficiente stock para agregar esa cantidad");
      }
    });
  });
}

function renderShoppingFigus() {
  const html = shoppingFigus.items.map((item) => {
    const dbItem = db.methods.find(item.id);
    return `
    <div class="item">
      <div class="title">${dbItem.title}</div>
      <div class="price">${numberToCurrency(dbItem.price)}</div>
      <div class="qty">${item.qty} unidades</div>
      <div class="subtotal">subtotal: ${numberToCurrency(
        dbItem.price * item.qty
      )}</div>
      <div class="actions">
        <button class="addOne" data-id="${item.id}">+</button>
        <button class="removeOne" data-id="${item.id}">-</button>        
      </div>
    </div>
    `;
  });

  const closeButton = `
  <div class="figus-header">
    <button class="bClose">Cerrar</button>
  </div>
  `;

  const purchaseButton =
    shoppingFigus.items.length > 0
      ? `
  <div class="figus-actions">
    <button class="bPurchase">Finaliza compra</button>
  </div>
  `
      : "";

  const total = shoppingFigus.methods.getTotal();
  const totalContainer = `<div class="total">TOTAL: ${numberToCurrency(
    total
  )}</div>`;
  const shoppingFigusContainer = document.querySelector(
    "#shopping-figus-container"
  );

  shoppingFigusContainer.classList.remove("hide");
  shoppingFigusContainer.classList.add("show");
  shoppingFigusContainer.innerHTML =
    closeButton + html.join("") + totalContainer + purchaseButton;

  document.querySelectorAll(".addOne").forEach((button) => {
    button.addEventListener("click", (event) => {
      const id = parseInt(button.getAttribute("data-id"));
      shoppingFigus.methods.add(id, 1);
      renderShoppingFigus();
      renderStore();
    });
  });

  document.querySelectorAll(".removeOne").forEach((button) => {
    button.addEventListener("click", (event) => {
      const id = parseInt(button.getAttribute("data-id"));
      shoppingFigus.methods.remove(id, 1);
      renderShoppingFigus();
      renderStore();
    });
  });

  document.querySelector(".bClose").addEventListener("click", (event) => {
    shoppingFigusContainer.classList.remove("show");
    shoppingFigusContainer.classList.add("hide");
  });

  document.querySelectorAll(".bPurchase").forEach((button) => {
    button.addEventListener("click", (event) => {
      shoppingFigus.methods.purchase();
      renderShoppingFigus();
    });
  });
}

function numberToCurrency(number) {
  return new Intl.NumberFormat("es-AR", {
    maximumFractionDigits: 2,
    style: "currency",
    currency: "ARS",
  }).format(number);
}
