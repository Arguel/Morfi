//templates
const templateCartItem = document.getElementById('template-cart-item').content;
const templateCartFooter = document.getElementById('template-cart-footer').content;
//containers
const cartItems = document.getElementById('cart-items');
const cartMainContainer = document.getElementById('cart-container');

const fragment = document.createDocumentFragment();

//items added from shop page
let itemsToBuy = localStorage.getItem('cart');

if (itemsToBuy === null) {
  renderEmptyCart();
} else {
  try {
    itemsToBuy = JSON.parse(itemsToBuy);
    renderCartItems(itemsToBuy);
  } catch (error) {
    console.log(error);
  }
}

cartItems.addEventListener('click', (e) => {
  unitManager(e);
})

function renderEmptyCart() {
  //container showing that the cart is empty

  cartItems.innerHTML = '';

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

  cartItems.classList.add('text-center');
  cartItems.appendChild(fragment);
}

function renderCartItems(arrayItems) {

  cartItems.innerHTML = '';

  Object.values(arrayItems).forEach(product => {
    //title
    templateCartItem.querySelector('div.fw-bold.mb-1').textContent = product.title;
    //quantity
    templateCartItem.querySelector('input[name="quantity"]').value = product.quantity;
    //increase/reduce quantity buttons
    templateCartItem.querySelector('input[name="reducequantity"]').dataset.id = product.id;
    templateCartItem.querySelector('input[name="increasequantity"]').dataset.id = product.id;
    //final price
    templateCartItem.querySelector('div.d-flex div.text-truncate').textContent = product.quantity * product.finalPrice;
    //image
    const productImage = templateCartItem.querySelector('img');
    const altAttribute = product.title.toLowerCase().replaceAll(" ", "-");
    productImage.setAttribute("src", product.thumnailUrl);
    productImage.setAttribute("alt", altAttribute);
    //shipping
    if (product.hasFreeShipping) {
      //shipping container creation
      const divShipping = document.createElement('div');
      divShipping.classList.add('text-green-5', 'mb-1');
      const iconShipping = document.createElement('i');
      iconShipping.classList.add('fas', 'fa-truck', 'me-1');
      const spanShipping = document.createElement('span');
      spanShipping.classList.add('fw-bold');
      spanShipping.textContent = 'Free shipping';
      divShipping.appendChild(iconShipping);
      divShipping.appendChild(spanShipping);

      templateCartItem.querySelector('.mx-2').appendChild(divShipping);
    }

    const clone = templateCartItem.cloneNode(true);
    fragment.appendChild(clone);

    //if the shipping container was added we remove it
    if (product.hasFreeShipping) {
      const shippingContainer = templateCartItem.querySelector('.mx-2');
      shippingContainer.removeChild(shippingContainer.lastChild);
    }
  });
  cartItems.appendChild(fragment);

  renderCartFooter(itemsToBuy);
}

function renderCartFooter(arrayItems) {

  //This basically checks if the footer was created, so we don't render it again
  const cartFooter = cartMainContainer.querySelector('h1.fs-3.fw-bold');
  if (cartFooter != null) {
    cartMainContainer.removeChild(cartMainContainer.lastElementChild);
  }

  //we add all the units
  const nQuantity = Object.values(arrayItems).reduce((acc, {quantity}) => acc + quantity, 0);
  //we add all the prices to calculate the total
  const nFinalPrice = Object.values(arrayItems).reduce((acc, {quantity, finalPrice}) => acc + quantity * finalPrice, 0);
  //top cart label in checkout
  cartMainContainer.querySelector('span').textContent = `(${nQuantity})`;

  //final calculation of the checkout (coupons, shipping, discounts, etc)
  templateCartFooter.querySelector('div.d-flex div.text-truncate').textContent = nFinalPrice;
  templateCartFooter.querySelectorAll('div.d-flex div.text-truncate')[3].textContent = nFinalPrice; //the last item

  const clone = templateCartFooter.cloneNode(true);
  fragment.appendChild(clone);

  //we add the cost calculator and the button to finish the purchase
  cartMainContainer.appendChild(fragment);

  //button events
  const buyBtn = document.querySelectorAll('button.btn.btn-primary.ff-lato-7')[1];
  const clearBtn = document.querySelectorAll('button.btn.btn-primary.ff-lato-7')[0];
  buyBtn.addEventListener('click', () => {
    return;
  })
  clearBtn.addEventListener('click', () => {
    localStorage.removeItem('cart');

    cartMainContainer.querySelector('span').textContent = '(0)';
    cartMainContainer.removeChild(cartMainContainer.lastElementChild);
    renderEmptyCart();
  })
}

function unitManager(e) {
  if (e.target.name == 'reducequantity') {
    //this prevent the parent form from reloading the page
    e.target.parentNode.addEventListener('submit', event => {
      event.preventDefault();
    })
    //this is as if we were to search for a particular object within itemsToBuy with an id/index
    const product = itemsToBuy[e.target.dataset.id];
    product.quantity--;
    itemsToBuy[e.target.dataset.id] = {...product};
    localStorage.setItem('cart', JSON.stringify(itemsToBuy));
    renderCartItems(itemsToBuy);
  }

  e.stopPropagation();
}







