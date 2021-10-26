"use strict";

//coupons object (aka valid coupons)
const validCoupons = {
  christmas2020: 15,
  thanksgivingday: 30,
  test: 20,
};

//templates
const templateCartItem = document.getElementById("template-cart-item").content;
const templateCartCheckout = document.getElementById("template-cart-checkout").content;
const templateCartPurchase = document.getElementById("template-cart-purchase").content;

//containers
const cartItems = document.getElementById("cart-items");
const cartMainContainer = document.getElementById("cart-container");

//fragments
const fragment = document.createDocumentFragment();

//cart selectors

//final price per item, it is also used in the footer to make the final calculations
const finalPriceSelector = "div.d-flex div.text-truncate";
//title
const itemTitleSelector = "div.fw-bold.mb-1";
//main row with data-id
const itemMainRowSelector = ".row";
//input with the current number of units
const inputUnitSelector = 'input[name="quantity"]';
//main item image
const itemImageSelector = "img";
//main container that stores the title (we use it to insert the label that says free shipping)
const titleContainerSelector = ".mx-2";
//it helps us to check if the container containing the footer was created or not
const footerContainerSelector = ".col-12.col-sm-11.col-md-10.py-5.border-bottom.ff-lato-4.mx-auto";
//main label containing the total number of units in the cart
const cartLabelSelector = "span#cart-label";
//main label containing the total number of units in the saved cart
const savedLabelSelector = "span#saved-label";
//remove span (used to remove the items when you click it, it is present in each rendered item)
const itemSpanSelector = ".h-pointer.ps-1.ps-sm-0.pe-1.pe-sm-2";
//present in each item (it is the button that appears with the value of "-" and allows to decrease the number of units of the item)
const inputReduceSelector = 'input[name="reducequantity"]';
//present in each item (it is the button that appears with the value of "+" and allows to increase the number of units of the item)
const inputIncreaseSelector = 'input[name="increasequantity"]';
//handles the span tags that appear at the end of the checkout section (final price, discounts, original amount)
const checkoutCalculationSeletor = "div.text-break.text-truncate-2 span";
//this is where all the items rendered in the checkout will be saved (one below the other)
const checkoutItemContainerSelector = "div.col-xs-12.col-md-8.my-2";
//these are the labels that appear at the top of the cart showing the quantities of units with the name of "cart" and "saved" respectively
const cartLabelsContainerSelector = ".col-10";
//button that is rendered at the top of the cart while the checkout is loading
const goBackBtnSelector = "div.col-12.text-primary.fs-5.mb-3";
//unit selector for each item (this appears below the input that handles the units)
const itemUnitsSelector = "div.text-center span.text-muted";
//main container to manage the units of each item
const unitsContainerSelector = ".border.p-2";
//footer buttons (clean cart and checkout)
const footerButtonsSelector = "button.btn.btn-primary.ff-lato-7";

//items added from shop page
let itemsToBuy = localStorage.getItem("cart");
//checkout status
let checkoutStatus = JSON.parse(localStorage.getItem("checkoutStatus")) || {
  inCart: true,
  chosenPaymentMethod: "paypal",
  activeCoupon: undefined,
};
let savedForLaterItems = localStorage.getItem("savedForLater");

if (savedForLaterItems === null) {
  renderEmptySavedCart();
} else {
  try {
    savedForLaterItems = JSON.parse(savedForLaterItems);
    footerCalculator(savedForLaterItems);
    renderCartItems(savedForLaterItems);
  } catch (error) {
    console.log(error);
  }
}
if (itemsToBuy === null) {
  cartMainContainer.querySelector(cartLabelSelector).textContent = "(0)";
} else {
  try {
    itemsToBuy = JSON.parse(itemsToBuy);
    updateLabel(itemsToBuy);
  } catch (error) {
    console.log(error);
  }
}

cartMainContainer.addEventListener("click", (e) => {
  cartManager(e);
});

function renderEmptySavedCart() {
  //container showing that the cart is empty

  cartItems.innerHTML = "";

  const h1Header = document.createElement("h1");
  h1Header.classList.add("mt-4", "p-2", "fs-4");
  h1Header.textContent = "You have no saved products";
  const textFace = document.createElement("div");
  textFace.classList.add("fs-4", "fw-bold");
  textFace.textContent = "¯\\_(ツ)_/¯";
  const divInfo = document.createElement("div");
  divInfo.classList.add("mt-4", "fs-5");
  divInfo.textContent = "If you have not yet decided to buy a product from your cart, you can leave it here.";

  fragment.appendChild(h1Header);
  fragment.appendChild(textFace);
  fragment.appendChild(divInfo);

  //this class will be automatically removed when the page is updated
  cartItems.classList.add("text-center");
  cartItems.appendChild(fragment);
}

function renderCartItems(arrayItems) {
  cartItems.innerHTML = "";

  Object.values(arrayItems).forEach((product) => {
    //title
    templateCartItem.querySelector(itemTitleSelector).textContent = product.title;

    //quantity
    //we check if the units are within the appropriate range
    if (product.quantity > 1 && product.quantity < product.unitsAvailable) {
      templateCartItem.querySelector(inputReduceSelector).removeAttribute("disabled");
      //Trying to delete an attribute that does not exist will NOT throw an error, so we can use it safely
      templateCartItem.querySelector(inputIncreaseSelector).removeAttribute("disabled");
      templateCartItem.querySelector(inputUnitSelector).value = product.quantity;
    }
    //in case the units exceed the maximum available/stock
    else if (product.quantity >= product.unitsAvailable) {
      templateCartItem.querySelector(inputReduceSelector).removeAttribute("disabled");
      templateCartItem.querySelector(inputIncreaseSelector).setAttribute("disabled", "");
      templateCartItem.querySelector(inputUnitSelector).value = product.unitsAvailable;
    }
    //this in case the value of the units is less than or equal to 1
    else {
      templateCartItem.querySelector(inputReduceSelector).setAttribute("disabled", "");
      templateCartItem.querySelector(inputUnitSelector).value = product.quantity;
    }
    //label that appears below the inputs that manage the units
    templateCartItem.querySelector(itemUnitsSelector).textContent = `${product.unitsAvailable} available`;
    //main row container
    templateCartItem.querySelector(itemMainRowSelector).dataset.id = product.id;
    //final price
    templateCartItem.querySelector(finalPriceSelector).textContent = (product.quantity * product.finalPrice).toFixed(2);
    //image
    const productImage = templateCartItem.querySelector(itemImageSelector);
    const altAttribute = product.title.toLowerCase().replaceAll(" ", "-");
    productImage.setAttribute("src", product.thumnailUrl);
    productImage.setAttribute("alt", altAttribute);
    //shipping
    if (product.hasFreeShipping) {
      //shipping container creation
      const divShipping = document.createElement("div");
      divShipping.classList.add("text-green-5", "mb-1");
      const iconShipping = document.createElement("i");
      iconShipping.classList.add("fas", "fa-truck", "me-1");
      const spanShipping = document.createElement("span");
      spanShipping.classList.add("fw-bold");
      spanShipping.textContent = "Free shipping";
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

  //we remove the border of the last element to make it visually more attractive
  cartItems.lastElementChild.classList.remove("border-bottom");

  footerCalculator(arrayItems);
}

function cartManager(e) {
  //-----cart summary
  switch (e.target.name) {
    case "reducequantity":
    case "increasequantity":
      e.target.parentNode.addEventListener("submit", (event) => {
        event.preventDefault();
      });

      //we capture the object to modify
      const product = savedForLaterItems[e.target.closest(itemMainRowSelector).dataset.id];

      //We check if the input has the name "reducequantity", if it is true we reduce the quantity by 1, if it is false we are referring to the input of "increasequantity" so we have to increase the quantity by 1
      e.target.name === "reducequantity" ? product.quantity-- : product.quantity++;

      savedForLaterItems[e.target.closest(itemMainRowSelector).dataset.id] = {...product};
      localStorage.setItem("savedForLater", JSON.stringify(savedForLaterItems));
      updateCartContent(e);
      break;

    case "quantity":
      //this will basically search by id for an object within our collection of objects "itemsToBuy"
      const maxUnits = itemsToBuy[e.target.closest(itemMainRowSelector).dataset.id].unitsAvailable;

      let actualNumber;
      e.target.addEventListener("keyup", () => {
        if (actualNumber >= 0 && actualNumber <= maxUnits && actualNumber !== null) {
          actualNumber = parseInt(e.target.value, 10);
        } else if (actualNumber > maxUnits) {
          actualNumber = maxUnits;
        } else {
          actualNumber = 0;
        }
        savedForLaterItems[e.target.closest(itemMainRowSelector).dataset.id].quantity = actualNumber;
        localStorage.setItem("savedForLater", JSON.stringify(savedForLaterItems));
        updateCartContent(e);
      });
      break;
  }

  //-----cart item remove label
  if (e.target.matches(itemSpanSelector) && e.target.textContent === "Remove") {
    delete savedForLaterItems[e.target.closest(itemMainRowSelector).dataset.id];
    localStorage.setItem("savedForLater", JSON.stringify(savedForLaterItems));
    Object.values(savedForLaterItems).length === 0 ? resetCart() : renderCartItems(savedForLaterItems);
  }

  //-----cart item buy now label
  if (e.target.matches(itemSpanSelector) && e.target.textContent === "Buy now") {
    //we select only 1 item only
    const buyNowItem = savedForLaterItems[e.target.closest(itemMainRowSelector).dataset.id];
    //And here pay attention, we add it to a list and pass it as an argument to the renderCheckout() function, (all this is temporary, if the user reloads the page the rest of the items will be added)
    keepPaymentUpdated();
    renderCheckout([buyNowItem], checkoutStatus.chosenPaymentMethod);
  }

  //-----cart item add to cart label
  if (e.target.matches(itemSpanSelector) && e.target.textContent === "Add to cart") {
    //Id
    const targetId = e.target.closest(itemMainRowSelector).dataset.id;
    //Object
    const addToCart = savedForLaterItems[targetId];

    itemsToBuy[targetId] = {...addToCart};
    localStorage.setItem("cart", JSON.stringify(itemsToBuy));
    updateLabel(itemsToBuy);
  }

  e.stopPropagation();
}

function updateCartContent(element) {
  //Objects
  const mainObject = savedForLaterItems[element.target.closest(itemMainRowSelector).dataset.id];
  if (mainObject !== undefined) {
    const itemQuantity = mainObject.quantity;
    const itemUnitssAvailable = mainObject.unitsAvailable;
    const itemPrice = mainObject.finalPrice;

    /* we select the container div (main container of units)
     * element.target.closest(unitsContainerSelector)
     *
     * this next line brings up the number of units of the object with a given id
     * savedForLaterItems[element.target.closest(itemMainRowSelector).dataset.id].quantity
     */

    //this basically dynamically selects the rendered items in the shopping cart
    //for example.querySelector('.row[data-id="1"]')
    const itemRow = cartItems.querySelector('.row[data-id="' + mainObject.id + '"]');

    //we check if the units are within the appropriate range
    if (itemQuantity > 1 && itemQuantity < itemUnitssAvailable) {
      itemRow.querySelector(inputReduceSelector).removeAttribute("disabled");
      //Trying to delete an attribute that does not exist will NOT throw an error, so we can use it safely
      itemRow.querySelector(inputIncreaseSelector).removeAttribute("disabled");
      element.target.closest(unitsContainerSelector).querySelector(inputUnitSelector).value = itemQuantity;
    }
    //in case the units exceed the maximum available/stock
    else if (itemQuantity >= itemUnitssAvailable) {
      itemRow.querySelector(inputReduceSelector).removeAttribute("disabled");
      itemRow.querySelector(inputIncreaseSelector).setAttribute("disabled", "");
      element.target.closest(unitsContainerSelector).querySelector(inputUnitSelector).value = itemUnitssAvailable;
    }
    //this in case the value of the units is less than or equal to 1
    else {
      itemRow.querySelector(inputReduceSelector).setAttribute("disabled", "");
      element.target.closest(unitsContainerSelector).querySelector(inputUnitSelector).value = itemQuantity;
    }

    // price multiplied by number of units
    element.target.closest(itemMainRowSelector).querySelector(finalPriceSelector).textContent = (
      itemQuantity * itemPrice
    ).toFixed(2);
  }
  footerCalculator(savedForLaterItems);
}

function footerCalculator(arrayItems) {
  //n stands for new
  //we add all the units
  const nQuantity = Object.values(arrayItems).reduce((acc, {quantity}) => acc + quantity, 0);
  //we add all the final prices to calculate the total
  const nFinalPrice = Object.values(arrayItems).reduce((acc, {quantity, finalPrice}) => acc + quantity * finalPrice, 0);
  //we add all the prices to calculate the total
  const nPrice = Object.values(arrayItems).reduce((acc, {quantity, price}) => acc + quantity * price, 0);
  //shipping

  //This basically adds up to $50 for each product that does not have free shipping
  let nShipping = Object.values(arrayItems).reduce((acc, {hasFreeShipping}) => {
    if (!hasFreeShipping) acc += 50;
    return acc;
  }, 0);

  //top cart label in checkout
  cartMainContainer.querySelector(savedLabelSelector).textContent = `(${nQuantity})`;

  const paymentMethod = checkoutStatus.chosenPaymentMethod;
  let [nMethodFee, nCouponDiscount] = [0, 0];
  switch (paymentMethod) {
    case "paypal":
      nMethodFee = 15;
      break;
    case "mastercard":
      nMethodFee = 10;
      break;
    case "visaandmaster":
      nMethodFee = 21;
      break;
    case "paysafecard":
      nMethodFee = 8;
      break;
    case "klarna":
      nMethodFee = 2;
      break;
  }
  //percentage that will be added to the final price of the product
  nMethodFee = (nFinalPrice * nMethodFee) / 100;
  localStorage.setItem("checkoutStatus", JSON.stringify(checkoutStatus));

  //percentage that will be removed from the final price of the product
  if (checkoutStatus.activeCoupon) {
    //nCouponDiscount in this case is the percentage that will be subtracted from the final price, for example the "test" coupon applies a 20% discount, then nCouponDiscount would be equal to 20
    nCouponDiscount = (nFinalPrice * validCoupons[checkoutStatus.activeCoupon]) / 100;
  }
  //r stands for results
  return {
    rfinalPrice: nFinalPrice,
    rshipping: nShipping,
    rquantity: nQuantity,
    rpaymentMethod: nMethodFee,
    rprice: nPrice,
    rcoupondiscount: nCouponDiscount,
  };
}

function resetCart() {
  localStorage.removeItem("savedForLater");
  cartMainContainer.querySelector(savedLabelSelector).textContent = "(0)";
  renderEmptySavedCart();
}

function renderCheckout(arrayItems, paymentMethod) {
  //we clean the board to render the new purchase order
  cartItems.innerHTML = "";
  footerHasBeenCreated();

  const {rfinalPrice, rshipping, rpaymentMethod, rprice, rcoupondiscount} = footerCalculator(arrayItems, paymentMethod);

  //Here we create the "go back" button to return to the shopping cart
  const divGoBackContainer = document.createElement("div");
  divGoBackContainer.classList.add("col-12", "text-primary", "fs-5", "mb-3");
  const goBackBtn = document.createElement("button");
  goBackBtn.classList.add("border-0", "bg-transparent", "ms-4");
  const spanGoBack = document.createElement("span");
  spanGoBack.classList.add("h-pointer");
  spanGoBack.textContent = "Go back";
  const innerSpanGoBack = document.createElement("span");
  innerSpanGoBack.classList.add("p-1", "mx-2", "rounded", "bg-primary", "text-white", "rounded");
  const leftArrowIcon = document.createElement("i");
  leftArrowIcon.classList.add("fas", "fa-chevron-left", "fa-fw");

  goBackBtn.addEventListener("click", () => {
    //we make our labels reappear
    cartMainContainer.querySelector(cartLabelsContainerSelector).classList.remove("d-none");
    //this removes the "go back" button
    cartMainContainer.removeChild(cartMainContainer.querySelector(goBackBtnSelector));
    keepPaymentUpdated();
    renderCartItems(savedForLaterItems);
  });

  innerSpanGoBack.appendChild(leftArrowIcon);
  spanGoBack.appendChild(innerSpanGoBack);
  //this basically adds our icon before the "Go back" text
  spanGoBack.insertBefore(innerSpanGoBack, spanGoBack.childNodes[0]);
  goBackBtn.appendChild(spanGoBack);
  divGoBackContainer.appendChild(goBackBtn);

  //we insert our "go back" button at the beginning of our board
  cartMainContainer.insertBefore(divGoBackContainer, cartMainContainer.childNodes[0]);

  //this next line refers to the "cart" and "saved" boxes (which appear at the beginning of the cart)
  //We do not delete the child in case the user wants to re-render the cart (that's easier and we only delete the class we just added)
  cartMainContainer.querySelector(cartLabelsContainerSelector).classList.add("d-none");

  //Here we render each of the items that had been added to the cart (one below the other)
  const productsContainer = templateCartCheckout.querySelector(checkoutItemContainerSelector);
  Object.values(arrayItems).forEach((product) => {
    //items
    const mainProductContainer = document.createElement("div");
    mainProductContainer.classList.add(
      "d-flex",
      "flex-column",
      "flex-sm-row",
      "justify-content-between",
      "text-center",
      "my-1",
    );
    const leftDivContainer = document.createElement("div");
    leftDivContainer.classList.add("text-truncate", "w-checkout-item-title");
    const spanUnits = document.createElement("span");
    spanUnits.classList.add("fw-bold");
    spanUnits.textContent = product.quantity;
    const spanSeparator = document.createElement("span");
    spanSeparator.textContent = " - ";
    const spanItemTitle = document.createElement("span");
    spanItemTitle.textContent = product.title;
    const rightDivContainer = document.createElement("div");
    rightDivContainer.classList.add("text-truncate", "w-checkout-item-price", "pe-auto", "pe-sm-2");
    rightDivContainer.textContent = `$${(product.quantity * product.finalPrice).toFixed(2)}`;

    leftDivContainer.appendChild(spanUnits);
    leftDivContainer.appendChild(spanSeparator);
    leftDivContainer.appendChild(spanItemTitle);

    mainProductContainer.appendChild(leftDivContainer);
    mainProductContainer.appendChild(rightDivContainer);
    //main data/product container
    productsContainer.appendChild(mainProductContainer);
  });

  const discountPercentage = Math.ceil(
    ((rprice - (rfinalPrice - rcoupondiscount)) * 100) / (rprice + rshipping + rpaymentMethod),
  );
  //base price excluding discounts
  templateCartCheckout.querySelectorAll(checkoutCalculationSeletor)[1].textContent = `$${(
    rprice +
    rshipping +
    rpaymentMethod
  ).toFixed(2)}`;
  //discounts
  templateCartCheckout.querySelectorAll(checkoutCalculationSeletor)[2].textContent = `-$${(
    rprice -
    (rfinalPrice - rcoupondiscount)
  ).toFixed(2)}`;
  //discount percentage
  templateCartCheckout.querySelectorAll(checkoutCalculationSeletor)[3].textContent = `(${discountPercentage}%)`;
  //final price counting discounts
  templateCartCheckout.querySelectorAll(checkoutCalculationSeletor)[4].textContent = `$${(
    rfinalPrice +
    rshipping +
    rpaymentMethod -
    rcoupondiscount
  ).toFixed(2)}`;

  const clone = templateCartCheckout.cloneNode(true);
  fragment.appendChild(clone);
  cartItems.appendChild(fragment);
  //to delete the previous items and leave the template in its original state (this in case an item is deleted)
  productsContainer.innerHTML = "";

  const finishBuy = document.querySelector(footerButtonsSelector);
  finishBuy.addEventListener("click", (e) => {
    renderPurchaseFinished(arrayItems);
    e.stopPropagation();
  });
}

function footerHasBeenCreated() {
  //This basically checks if the footer was created, so we don't render it again
  const cartFooter = cartMainContainer.querySelector(footerContainerSelector);
  if (cartFooter != null) {
    //If we enter the "if" it is because the footer is rendered, so we are going to eliminate it to avoid errors
    cartMainContainer.removeChild(cartMainContainer.lastElementChild);
    return true;
  }
  return false;
}

function updateLabel(arrayItems) {
  //This function only updates the top labels that show the quantities of items in each section (cart / saved)
  const nQuantity = Object.values(arrayItems).reduce((acc, {quantity}) => acc + quantity, 0);
  cartMainContainer.querySelector(cartLabelSelector).textContent = `(${nQuantity})`;
}

function keepPaymentUpdated() {
  //This function basically fixes the payment method error when having several tabs open editing the same content
  checkoutStatus = JSON.parse(localStorage.getItem("checkoutStatus")) || {
    inCart: true,
    chosenPaymentMethod: "paypal",
  };
}

function renderPurchaseFinished(arrayItems) {
  cartMainContainer.innerHTML = "";
  cartMainContainer.classList.remove("my-5");
  cartMainContainer.classList.add("h-100");
  cartItems.classList.add("h-100");

  const clone = templateCartPurchase.cloneNode(true);
  fragment.appendChild(clone);
  cartMainContainer.appendChild(fragment);

  checkoutStatus.inCart = true;
  localStorage.setItem("checkoutStatus", JSON.stringify(checkoutStatus));

  Object.values(arrayItems).forEach((product) => {
    if (itemsToBuy[product.id]) {
      delete itemsToBuy[product.id];
    }

    if (savedForLaterItems[product.id]) {
      delete savedForLaterItems[product.id];
    }
  });

  localStorage.setItem("cart", JSON.stringify(itemsToBuy));
  localStorage.setItem("savedForLater", JSON.stringify(savedForLaterItems));

  if (Object.values(itemsToBuy).length === 0) {
    localStorage.removeItem("cart");
  }

  if (Object.values(savedForLaterItems).length === 0) {
    localStorage.removeItem("savedForLater");
  }
}
