//templates
const templateCartItem = document.getElementById('template-cart-item').content;
const templateCartFooter = document.getElementById('template-cart-footer').content;
//containers
const cartItems = document.getElementById('cart-items');
const cartMainContainer = document.getElementById('cart-container');

const fragment = document.createDocumentFragment();

let itemsToBuy = localStorage.getItem('cart');

if (itemsToBuy === null) {
  const divEmptyContainer = document.createElement('div');
  divEmptyContainer.classList.add('my-4', 'p-2', 'fs-5');
  divEmptyContainer.textContent = 'Your shopping cart is empty';

  const aCatalog = document.createElement('a');
  aCatalog.setAttribute('href', '../shop/shop.html');

  const aCatalogBtn = document.createElement('button');
  aCatalogBtn.classList.add('btn', 'btn-primary', 'ff-lato-7', 'fs-5', 'my-5', 'col-md-8', 'col-lg-4');
  aCatalogBtn.textContent = 'Check catalog';

  aCatalog.appendChild(aCatalogBtn);
  fragment.appendChild(divEmptyContainer);
  fragment.appendChild(aCatalog);

  itemsToBuy.classList.add('text-center');
  cartItems.appendChild(fragment);
} else {
  try {
    itemsToBuy = JSON.parse(itemsToBuy);
    renderCartItems(itemsToBuy);
  } catch (error) {
    console.log(error);
  }
}


function renderCartItems(arrayItems) {
  Object.values(arrayItems).forEach(product => {
    //title
    templateCartItem.querySelector('div.fw-bold.mb-1').textContent = product.title;
    //quantity
    templateCartItem.querySelector('input[name="quantity"]').value = product.quantity;
    //increase/reduce quantity buttons
    templateCartItem.querySelector('input[name="reducequantity"]').dataset.id = product.id;
    templateCartItem.querySelector('input[name="increasequantity"]').dataset.id = product.id;
    //final price
    templateCartItem.querySelectorAll('div.fw-bold.ff-lato-4 span')[1].textContent = product.quantity * product.finalPrice;
    //image
    const productImage = templateCartItem.querySelector('img');
    const altAttribute = product.title.toLowerCase().replaceAll(" ", "-");
    productImage.setAttribute("src", product.thumnailUrl);
    productImage.setAttribute("alt", altAttribute);

    const clone = templateCartItem.cloneNode(true);
    fragment.appendChild(clone);
  });
  cartItems.appendChild(fragment);

  renderCartFooter(itemsToBuy);
}

function renderCartFooter(arrayItems) {
  const nQuantity = Object.values(arrayItems).reduce((acc, {quantity}) => acc + quantity, 0);
  const nFinalPrice = Object.values(arrayItems).reduce((acc, {quantity, finalPrice}) => acc + quantity * finalPrice, 0);
  cartMainContainer.querySelector('span').textContent = `(${nQuantity})`; //cart label in checkout

  templateCartFooter.querySelectorAll('span')[2].textContent = nFinalPrice;
  templateCartFooter.querySelectorAll('span')[11].textContent = nFinalPrice; //the last item

  const clone = templateCartFooter.cloneNode(true);
  fragment.appendChild(clone);

  const divBuyBtn = document.createElement('div');
  divBuyBtn.classList.add('col-10', 'py-5', 'pe-0', 'text-end');

  const buyBtn = document.createElement('button');
  buyBtn.classList.add('btn', 'btn-primary', 'ff-lato-7', 'fs-5');
  buyBtn.textContent = 'Finish buy';

  divBuyBtn.appendChild(buyBtn);
  fragment.appendChild(divBuyBtn);

  cartMainContainer.appendChild(fragment);
}









