const itemsContainer = document.getElementById('items-container');
const itemSelect = document.getElementById('item-select');
const orderForm = document.getElementById('order-form');
const messageDiv = document.getElementById('message');

async function loadItems() {
  const res = await fetch('/api/items');
  const items = await res.json();

  itemsContainer.innerHTML = '';
  itemSelect.innerHTML = '';
  items.forEach((item) => {
    const col = document.createElement('div');
    col.className = 'col-12 col-sm-6 col-md-4';

    const card = document.createElement('div');
    card.className = 'item-card card p-3';

    card.innerHTML = `
      <img src=${item.imageUrl} class="card-img-top" alt="${item.title}">
      <h3>${item.title}</h3>
      <p>${item.description}</p>
      <p class="fw-bold">£${item.price}</p>
    `;

    col.appendChild(card);
    itemsContainer.appendChild(col);

    const option = document.createElement('option');
    option.value = item._id;
    option.textContent = item.title;
    itemSelect.appendChild(option);
  });
}

orderForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const orderData = {
    itemId: itemSelect.value,
    customer: {
      fullName: document.getElementById('fullName').value,
      addressLine1: document.getElementById('addressLine1').value,
      addressLine2: document.getElementById('addressLine2').value,
      city: document.getElementById('city').value,
      postcode: document.getElementById('postcode').value,
    },
    notes: document.getElementById('notes').value || '',
  };

  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });

  const result = await res.json();
  messageDiv.textContent = result.message;

  orderForm.reset();
});

loadItems();
