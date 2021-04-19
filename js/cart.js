//templates
const templateCartItem = document.getElementById('template-cart-item').content;
const templateCartFooter = document.getElementById('template-cart-footer').content;
//containers
const cartItems = document.getElementById('cart-items');
const cartMainContainer = document.getElementById('cart-container');

const fragment = document.createDocumentFragment();



//cart selectors

//final price per item, it is also used in the footer to make the final calculations
const finalPriceSelector = 'div.d-flex div.text-truncate';
//title
const itemTitleSelector = 'div.fw-bold.mb-1';
//main row with data-id
const itemMainRowSelector = '.row';
//input with the current number of units
const inputUnitSelector = 'input[name="quantity"]';
//main item image
const itemImageSelector = 'img';
//main container that stores the title (we use it to insert the label that says free shipping)
const titleContainerSelector = '.mx-2';
//it helps us to check if the container containing the footer was created or not
const footerContainerSelector = 'h1.fs-3.fw-bold';
//main label containing the total number of units in the cart
const mainUnitLabelSelector = 'span';
//footer buttons (clean cart and checkout)
const footerButtonsSelector = 'button.btn.btn-primary.ff-lato-7';

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

cartItems.addEventListener('click', e => {
  itemManager(e);
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
    templateCartItem.querySelector(itemTitleSelector).textContent = product.title;
    //quantity
    templateCartItem.querySelector(inputUnitSelector).value = product.quantity;
    if (product.quantity > 1) {
      templateCartItem.querySelector('input[name="reducequantity"]').removeAttribute('disabled');
    } else {
      templateCartItem.querySelector('input[name="reducequantity"]').setAttribute('disabled', '');
    }
    //main row container
    templateCartItem.querySelector(itemMainRowSelector).dataset.id = product.id;
    //final price
    templateCartItem.querySelector(finalPriceSelector).textContent = product.quantity * product.finalPrice;
    //image
    const productImage = templateCartItem.querySelector(itemImageSelector);
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

      templateCartItem.querySelector(titleContainerSelector).appendChild(divShipping);
    }

    const clone = templateCartItem.cloneNode(true);
    fragment.appendChild(clone);

    //if the shipping container was added we remove it
    if (product.hasFreeShipping) {
      const shippingContainer = templateCartItem.querySelector(titleContainerSelector);
      shippingContainer.removeChild(shippingContainer.lastChild);
    }
  });
  cartItems.appendChild(fragment);

  renderCartFooter(itemsToBuy);
}

function renderCartFooter(arrayItems) {

  //This basically checks if the footer was created, so we don't render it again
  const cartFooter = cartMainContainer.querySelector(footerContainerSelector);
  if (cartFooter != null) {
    cartMainContainer.removeChild(cartMainContainer.lastElementChild);
  }

  const {rfinalPrice} = footerCalculator(arrayItems);
  //final calculation of the checkout (coupons, shipping, discounts, etc)
  templateCartFooter.querySelector(finalPriceSelector).textContent = rfinalPrice;
  templateCartFooter.querySelectorAll(finalPriceSelector)[3].textContent = rfinalPrice; //the last item

  const clone = templateCartFooter.cloneNode(true);
  fragment.appendChild(clone);

  //we add the cost calculator and the button to finish the purchase
  cartMainContainer.appendChild(fragment);

  //button events
  const buyBtn = document.querySelectorAll(footerButtonsSelector)[1];
  const clearBtn = document.querySelectorAll(footerButtonsSelector)[0];
  buyBtn.addEventListener('click', () => {
    return;
  })
  clearBtn.addEventListener('click', () => {
    resetCart();
  })
}

function itemManager(e) {
  switch (e.target.name) {

    case 'reducequantity': case 'increasequantity':
      e.target.parentNode.addEventListener('submit', event => {
        event.preventDefault();
      })

      //we capture the object to modify
      const product = itemsToBuy[e.target.closest(itemMainRowSelector).dataset.id];
      if (e.target.name == 'reducequantity') {
        product.quantity--;
      }
      if (e.target.name == 'increasequantity') {
        product.quantity++;
      }
      itemsToBuy[e.target.closest(itemMainRowSelector).dataset.id] = {...product};
      localStorage.setItem('cart', JSON.stringify(itemsToBuy));
      updateCartContent(e)
      break;

    case 'quantity':
      e.target.addEventListener('keyup', () => {
        let actualNumber = parseInt(e.target.value, 10);
        if (actualNumber >= 0 && actualNumber !== NaN && actualNumber !== null) {
          actualNumber = actualNumber;
        } else {
          actualNumber = '';
        }
        itemsToBuy[e.target.closest(itemMainRowSelector).dataset.id].quantity = actualNumber;
        localStorage.setItem('cart', JSON.stringify(itemsToBuy));
        updateCartContent(e)
      })
      break;
  }

  if (e.target.classList.contains('h-pointer', 'ps-1', 'ps-sm-0', 'pe-1', 'pe-sm-2') && e.target.textContent === 'Remove') {
    delete itemsToBuy[e.target.closest(itemMainRowSelector).dataset.id];
    localStorage.setItem('cart', JSON.stringify(itemsToBuy));
    (Object.values(itemsToBuy).length == 0) ? resetCart() : renderCartItems(itemsToBuy);
  }

  e.stopPropagation();
}

function updateCartContent(element) {

  //Objects
  const mainObject = itemsToBuy[element.target.closest(itemMainRowSelector).dataset.id];
  const itemQuantity = mainObject.quantity;
  const itemPrice = mainObject.finalPrice;

  /* we select the container div (main container of units)
   * element.target.closest('.border.p-2')
   *
   * this brings up the number of units of the object with a given id
   * itemsToBuy[element.target.closest(itemMainRowSelector).dataset.id].quantity
    */

  //this basically dynamically selects the rendered items in the shopping cart
  //for example.querySelector('.row[data-id="1"]')
  const itemRow = cartItems.querySelector('.row[data-id="' + mainObject.id + '"]');
  if (itemQuantity > 1) {
    itemRow.querySelector('input[name="reducequantity"]').removeAttribute('disabled');
  } else {
    itemRow.querySelector('input[name="reducequantity"]').setAttribute('disabled', '');
  }

  //input containing the number of current units
  element.target.closest('.border.p-2').querySelector(inputUnitSelector).value = itemQuantity;

  // price multiplied by number of units
  element.target.closest(itemMainRowSelector).querySelector(finalPriceSelector).textContent = itemQuantity * itemPrice;

  const {rfinalPrice} = footerCalculator(itemsToBuy);

  //this selects the summary section of the shopping cart footer
  const newCartFooter = cartMainContainer.querySelector('.col-12.col-md-10.col-lg-4.mx-auto.mt-5.mt-lg-0');
  newCartFooter.querySelector(finalPriceSelector).textContent = rfinalPrice;
  newCartFooter.querySelectorAll(finalPriceSelector)[3].textContent = rfinalPrice; //the last item
}

function footerCalculator(arrayItems) {
  //n stands for new
  //we add all the units
  const nQuantity = Object.values(arrayItems).reduce((acc, {quantity}) => acc + quantity, 0);
  //we add all the prices to calculate the total
  const nFinalPrice = Object.values(arrayItems).reduce((acc, {quantity, finalPrice}) => acc + quantity * finalPrice, 0);
  //top cart label in checkout
  cartMainContainer.querySelector(mainUnitLabelSelector).textContent = `(${nQuantity})`;

  //r for results
  const finalResults = {
    rfinalPrice: nFinalPrice,
    rquantity: nQuantity
  }
  return finalResults;
}

function resetCart() {
  localStorage.removeItem('cart');
  cartMainContainer.querySelector(mainUnitLabelSelector).textContent = '(0)';
  cartMainContainer.removeChild(cartMainContainer.lastElementChild);
  renderEmptyCart();
}
