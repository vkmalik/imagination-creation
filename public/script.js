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

  const submitBtn = orderForm.querySelector('button[type="submit"]');
  const originalBtnHTML = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.setAttribute('aria-disabled', 'true');
  submitBtn.innerHTML =
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Placing...';

  try {
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

    if (res.ok) {
      orderForm.reset();
    }
  } catch (err) {
    console.error('Order request failed', err);
    messageDiv.textContent = 'Sorry — could not place order. Please try again.';
  } finally {
    submitBtn.disabled = false;
    submitBtn.removeAttribute('aria-disabled');
    submitBtn.innerHTML = originalBtnHTML;
  }
});

loadItems();
