"use strict";
//-----------------------------------------------------------


//future class implementation

//const disabledClass = document.getElementsByClassName('disabled');
//for (const elem of disabledClass) {
//elem.disabled = true;
//}


//default version of the filters (the user can modify them at will)
const userFiltersBase = {
  sortby: "", //Featured, Low to high, High to low
  region: [], //North america, United states, Europe, Global
  discount: [], //25, 50, 75, 100, customMinMax
  customDiscount: "",
  ratings: [], //1, 2, 3, 4
  payment: [], //In 12 installments, In 6 installments, In cash
  promotions: [], //Special offer, New
  delivery: [], //Free shipping, Withdrawal in person
  price: [], //$0 - $10, $10 - $50, $50 - $100, $100+, customMinMax
  customPrice: "",
  customSearch: "",
}

//manager of the shopping cart mini submenu (saved in sessionStorage)
const submenuSession = {
  rendered: false,
  active: false
}

//templates-----------------------------------------------------------------------------------------

const templateShopLi = document.getElementById('template-item-li').content;
const templateCartSubmenu = document.getElementById('template-cart-checkout-submenu').content;
const templateCartSubmenuProduct = document.getElementById('template-cart-product-submenu').content;

//containers/arrays-----------------------------------------------------------------------------------------

//shopping cart containing all the items that we are adding
let cart = JSON.parse(localStorage.getItem('cart')) || {};
//where our products will be loaded (on the right side)
const shopItems = document.getElementById('shop-items-display');
//units icon that appears in the navigation bar
const cartMiniIcon = document.querySelector('span.position-absolute.top-0.start-100.translate-middle.badge.rounded-pill.bg-primary.h-pointer span');
//this container includes the product loading section and the filter categories
const mainShopContainer = document.getElementById('main-shop-container');
//filter category container
const filtersBtnsContainer = document.getElementById('filters-btns-container');
//all buttons disabled (html default class)
const arrayInactiveBtns = [...filtersBtnsContainer.querySelectorAll('.sel-none')];
//this function clears all filters and resets everything to its original state (inputs = "", select = default value)
const cleanAllFiltersBtn = document.getElementById('clean-all-filters');
//this basically selects all the buttons that contain the star icons (which are difficult to select normally) and adds the same properties to them as the other filters.
const ratingBtnsArray = document.querySelectorAll('.sel-none[data-stars]');
//select tag that controls filters of 'Featured', 'Low to high', 'High to low'
const sortByLabel = document.getElementById('sortby');
//Custom prices
const minPriceInput = document.getElementById('pri-from');
const maxPriceInput = document.getElementById('pri-to');
const priceFilterBtn = document.getElementById('price-filter');
//Custom discounts
const minDiscountInput = document.getElementById('dis-from');
const maxDiscountInput = document.getElementById('dis-to');
const discountFilterBtn = document.getElementById('discount-filter');
//Custom search
const searchInput = document.getElementById('s-shop');
const searchFilterBtn = document.getElementById('si-shop');
//Cart submenu
const cartCheckout = document.getElementById('cart-checkout');

//selectors-----------------------------------------------------------------------------------------

//these are the images that are rendered for each product in shop.html
const itemImageSelector = 'img';
//title of each product
const itemTitleSelector = 'h5 a';
//the final price of each product (counting discounts)
const itemFinalPriceSelector = 'div.ff-mont-6 span';
//the parent element of the "itemFinalPriceSelector", we use it to add the free shipping icon
const finalPriceParentSelector = 'div.ff-mont-6';
//the parent element of "finalPriceParentSelector", we use it to manage the promotion/discount labels that appear on each item, for example "50% off", "Special offer"
const priceAndShippingSelector = 'div.overflow-hidden.text-truncate-2';
//selector used to insert the description of each product
const itemDescriptionSelector = 'div.text-truncate';
//blue button that appears on each product
const addToCartSelector = '.btn-primary';
//this selects the main parent of each product, which would be the "white square"
const fullItemSelector = '.border.m-2.rounded';
//label that is added in case the product has free shipping, appears on some items only
const shippingTagSelector = 'span.text-green-5 span.visually-hidden';
//unit selector that is added inside the product title
const itemUnitsSelector = 'span.mx-2.text-darker-4.d-none';
//cross icon in the new generated filters
const filterCrossIconSelector = '.sel-primary .fa-times';
//blue button to add to the shopping cart, present in each of the products
const productCartBtnSelector = 'button.btn.btn-primary.d-block.w-100.ff-lato-4';
//icon that appears in the products section of the store when the items are being loaded through AJAX
const loadingIconSelector = 'div.spinner-grow.text-secondary.my-2';
//original price tag that appears with a line through it on some products
const originalPriceSelector = 'span.text-decoration-line-through.me-1';
//promotional label that appears on some products
const promotionBadgeSelector = 'span.badge.bg-primary.me-1';
//button that is rendered in case of having one or more active filters in a particular section
const clearSectionFilterBtnSelector = 'div.col-md-3.text-end';
//submenu handlers
const submenuTriangleSelector = '.position-absolute.top-100.start-50.translate-middle.mt-1.cart-triangle';
const submenuDataContainerSelector = '.position-absolute.end-0.mt-2.w-500px.ff-lato-4';
//handlers of a particular product from the submenu
const submenuMainProductSelector = 'a.row.align-items-center.m-auto';
const submenuProductPriceSelector = 'div.col-2.pe-0.text-truncate.fw-bold';
const submenuSaveForLaterSelector = '.c-under.pe-2.animation-cart-option';
const submenuRemoveSelector = '.c-under.pe-2';
const submenuImageSelector = 'img.img-fluid.h-60px.w-100.obfit-cover';
const submenuTitleSelector = 'div.col-5 span.text-truncate-1.fw-bold';
const submenuDiscountSelector = 'div.col-2 span.badge.bg-primary.p-2';
//submenu data container handlers
const submenuTotalProductsSelector = '.col-12.fw-bold.text-truncate';
const submenuTotalPriceSelector = 'div.row.align-items-center div.text-truncate.fw-bold';

//fragments-----------------------------------------------------------------------------------------

const fragment = document.createDocumentFragment();

//events handlers-----------------------------------------------------------------------------------------

for (const ratingFilterBtn of ratingBtnsArray) {
  ratingFilterBtn.addEventListener('click', event => {
    if (!ratingFilterBtn.classList.contains('sel-primary')) {
      event.stopPropagation();
      const filters = JSON.parse(localStorage.getItem('filters')) || {...userFiltersBase};
      const starIdentifier = `${ratingFilterBtn.dataset.stars} star` // '1 star' for example

      filtersEvents(ratingFilterBtn, filters, 'ratings', starIdentifier);
      renderClearBtn(event.target, 'ratings');

      //this checks that our filter is not in the list already
      if (!filters.ratings.includes(starIdentifier)) filters.ratings = [...filters.ratings, starIdentifier];

      localStorage.setItem('filters', JSON.stringify(filters));
      updateListing(false);
    }
  });
}
sortByLabel.addEventListener('change', () => {
  const filters = JSON.parse(localStorage.getItem('filters')) || {...userFiltersBase};

  filtersConfigHandler(sortByLabel.value, filters, null, false);
  updateListing(false);
});
priceFilterBtn.addEventListener('click', event => {
  priceAndDiscountFilter(event, minPriceInput, maxPriceInput, 'customPrice', 'price', 'CustomPrice: ');
});
discountFilterBtn.addEventListener('click', event => {
  priceAndDiscountFilter(event, minDiscountInput, maxDiscountInput, 'customDiscount', 'discount', 'CustomDiscount: ');
});
searchInput.closest('form').addEventListener('submit', event => {
  event.preventDefault();
  searchFilter(event);
});
searchFilterBtn.addEventListener('click', event => {
  searchFilter(event);
});
cleanAllFiltersBtn.addEventListener('click', e => {
  e.stopPropagation();
  localStorage.setItem('filters', JSON.stringify({...userFiltersBase}));
  updateListing(false);

  //select all active filters (all those with the cross icon)
  const previousFilters = document.querySelectorAll(filterCrossIconSelector);
  const previousCleanBtns = document.querySelectorAll(clearSectionFilterBtnSelector);
  if (previousCleanBtns) {
    for (const oldCleanBtn of previousCleanBtns) {
      oldCleanBtn.parentNode.removeChild(oldCleanBtn);
    }
  }
  if (previousFilters) {
    for (const oldFilter of previousFilters) {
      const parent = oldFilter.closest('li');
      parent.removeChild(parent.lastChild);
      parent.firstElementChild.classList.remove('sel-primary');
      parent.firstElementChild.classList.add('sel-none');
    }

    //reset our filters to their default state
    minPriceInput.value = "";
    maxPriceInput.value = "";
    minDiscountInput.value = "";
    maxDiscountInput.value = "";
    sortByLabel.value = "Featured";
  }
});
mainShopContainer.addEventListener('click', e => {
  e.stopPropagation();
  if (e.target.matches(productCartBtnSelector)) {
    addToCart(e);
    updateSubmenuContent();
    renderCartIcons(cart);
  }
  if (e.target.classList.contains('sel-none')) {
    filtersClickHandler(e);
  }
});
cartCheckout.addEventListener('click', e => {
  e.preventDefault();

  const presentItemsArray = submenuChecker();

  const submenuSessionData = JSON.parse(sessionStorage.getItem('cartSubmenu')) || submenuSession;

  if (presentItemsArray[0] && presentItemsArray[1]) {

    const triangleHasClass = presentItemsArray[0].classList.contains('d-none');
    const submenuHasClass = presentItemsArray[1].classList.contains('d-none');

    if (triangleHasClass && submenuHasClass) {
      presentItemsArray[0].classList.remove('d-none');
      presentItemsArray[1].classList.remove('d-none');
      submenuSessionData.active = true;
    } else {
      presentItemsArray[0].classList.add('d-none');
      presentItemsArray[1].classList.add('d-none');
      submenuSessionData.active = false;
    }

    sessionStorage.setItem('cartSubmenu', JSON.stringify(submenuSessionData));

  } else {
    renderCartSubmenu();
  }
});
cartCheckout.parentNode.addEventListener('click', e => {
  e.stopPropagation();
  //this manages clicks on the submenu products (on the "remove" and "save for later" tags)

  if (e.target.matches(submenuRemoveSelector) && e.target.textContent === 'Remove') {
    e.preventDefault();
    const productId = e.target.closest(submenuMainProductSelector).dataset.productid;
    cart = JSON.parse(localStorage.getItem('cart'));
    //if our cart contains the property (this is in case the user deletes the shopping cart while on another page)
    if (cart[productId]) {
      delete cart[productId];
      localStorage.setItem('cart', JSON.stringify(cart));
      if (Object.values(cart).length === 0) {
        //if our cart is empty we will return the values to default
        localStorage.removeItem('cart');
        renderCartSubmenu();
        const parent = cartCheckout.parentNode;
        parent.querySelector(submenuTotalProductsSelector).textContent = '0 Products added';
        parent.querySelector(submenuTotalPriceSelector).textContent = '$0.00';
        cartMiniIcon.textContent = '0';
      } else {
        renderCartSubmenu();
        renderCartIcons(cart);
      }
    }
  }

  if (e.target.matches(submenuSaveForLaterSelector) && e.target.textContent === 'Save for later') {
    e.preventDefault();
    const productId = e.target.closest(submenuMainProductSelector).dataset.productid;
    cart = JSON.parse(localStorage.getItem('cart'));
    const savedForLater = JSON.parse(localStorage.getItem('savedForLater')) || {};
    //if our cart contains the property (this is in case the user deletes the shopping cart while on another page)
    if (cart[productId]) {
      const productToSave = cart[productId];
      savedForLater[productId] = {...productToSave};
      localStorage.setItem('savedForLater', JSON.stringify(savedForLater));
    }
  }
});
//-----------------------------------------------------------------------------------------

//this calls our main function once the page is done parsing
document.addEventListener('DOMContentLoaded', () => {
  fetchShopItems();
});

//this variable will store all the products that are loaded from the JSON
let apiShopItems;
const fetchShopItems = async (loadPreviousFilters = true) => {
  try {

    // future implementation of an api request

    //const res = await fetch('shop items');
    //const data = await res.json();

    await $.ajax({
      url: '../../js/api.json',
      method: 'GET',
    })
      //The error case is not handled because below it is handled with try / catch
      .done(data => {
        //we hide the loading icon and proceed to render the store items
        document.querySelector(loadingIconSelector).classList.add('d-none');
        apiShopItems = data;
      });

    //filter our results in case there are filters saved in localStorage
    apiShopItems = filterResults(apiShopItems, loadPreviousFilters);

    if (apiShopItems.length !== 0) {
      renderCartIcons(cart);
      renderShopItems(apiShopItems);
    } else {
      renderCartIcons(cart);
      renderPageError('no items found', true);
    }

    const submenuSessionData = JSON.parse(sessionStorage.getItem('cartSubmenu')) || submenuSession;
    if (submenuSessionData.active) renderCartSubmenu();

  } catch (error) {
    renderPageError(error);
  }
}

//this function can handle 2 types of errors, error loading the products or a general functionality error
function renderPageError(error, emptySearch = false) {
  shopItems.innerHTML = '';

  const errorContainer = document.createElement('h4');
  errorContainer.classList.add('text-center', 'my-4', 'mx-4', 'fw-bold', 'ff-lato-4');
  errorContainer.textContent = 'Error while loading items.';

  //this in case of errors with the products or filters
  if (emptySearch) {
    errorContainer.textContent = "Oops... we didn't find anything for this search :(";
    const errorDesc = document.createElement('h5');
    errorDesc.classList.add('text-center', 'mx-4', 'ff-lato-4');
    errorDesc.textContent = 'You can try a more general term or check that it is well written';
    fragment.appendChild(errorContainer);
    fragment.appendChild(errorDesc);
  } else {
    console.log(error);
    fragment.appendChild(errorContainer);
  }

  shopItems.appendChild(fragment);
}

//this function manages the units label of the shopping cart (top right in the navigation bar)
function renderCartIcons(arrayItems) {
  //sum the total of all the units of the products in the cart
  const itemsInCart = Object.values(arrayItems).reduce((acc, {quantity}) => acc + quantity, 0);
  if (itemsInCart <= 9) {
    cartMiniIcon.textContent = itemsInCart;
  } else {
    cartMiniIcon.textContent = '+9';
  }
}

//this function renders all products
function renderShopItems(arrayItems) {

  shopItems.innerHTML = '';

  let createdDiv = false;
  var divContainer;

  function createSubContainer() {
    const divContainer = document.createElement('div');
    divContainer.classList.add('text-break', 'text-truncate-1');
    createdDiv = true;
    return divContainer;
  }

  arrayItems.forEach(product => {
    //image
    const productImage = templateShopLi.querySelector(itemImageSelector);
    const altAttribute = product.title.toLowerCase().replaceAll(" ", "-");
    productImage.setAttribute("src", product.thumnailUrl);
    productImage.setAttribute("alt", altAttribute);
    //units
    const spanItemUnits = document.createElement('span');
    spanItemUnits.classList.add('mx-2', 'text-darker-4', 'd-none')
    spanItemUnits.textContent = `[u/${product.unitsAvailable}]`;
    //units label (hidden)
    templateShopLi.querySelector(finalPriceParentSelector).appendChild(spanItemUnits);
    //title
    templateShopLi.querySelector(itemTitleSelector).textContent = product.title;
    //final price
    templateShopLi.querySelector(itemFinalPriceSelector).textContent = `$${(product.price - product.price * product.discount / 100).toFixed(2)}`;
    //shipping
    if (product.hasFreeShipping) {
      const spanShippingIcon = document.createElement('span');
      spanShippingIcon.classList.add('badge', 'bg-white', 'rounded', 'text-green-5');

      const spanShippingLabel = document.createElement('span');
      spanShippingLabel.classList.add('visually-hidden');
      spanShippingLabel.textContent = 'Free shipping';
      spanShippingIcon.appendChild(spanShippingLabel);

      const shippingIcon = document.createElement('i');
      shippingIcon.classList.add('fas', 'fa-truck');
      spanShippingIcon.appendChild(shippingIcon);

      templateShopLi.querySelector(finalPriceParentSelector).appendChild(spanShippingIcon);
    }

    if (product.hasDiscount) {
      divContainer = createSubContainer();

      //price
      const spanPrice = document.createElement('span');
      spanPrice.classList.add('text-decoration-line-through', 'me-1');
      spanPrice.textContent = `$${product.price.toFixed(2)}`;
      divContainer.appendChild(spanPrice);
    }

    //check if the list of promotions is empty
    if (product.promotion.length !== 0) {
      //If the container was not created for any discount, we will create it
      if (!createdDiv) {
        divContainer = createSubContainer();
      }
      //promotions
      product.promotion.forEach(x => {
        const spanPromotion = document.createElement('span');
        spanPromotion.classList.add('badge', 'bg-primary', 'me-1');
        spanPromotion.textContent = x;
        divContainer.appendChild(spanPromotion);
      })
    }

    //we check if the container has been created and if it is true we add it to our template temporarily
    if (createdDiv) {
      //here we add the possible labels to each item
      templateShopLi.querySelector(priceAndShippingSelector).appendChild(divContainer);
    }

    //description
    templateShopLi.querySelector(itemDescriptionSelector).textContent = product.description;

    //add to cart button
    templateShopLi.querySelector(addToCartSelector).dataset.id = product.id;


    //we clone the template because there can only be one
    const clone = templateShopLi.cloneNode(true);
    fragment.appendChild(clone);

    //check if the discounts/promotions/shipping container was created, and if it was created, it will delete it so it is not added to all items and only applies to the necessary ones
    if (createdDiv) {
      const mainContainer = templateShopLi.querySelector(priceAndShippingSelector);
      mainContainer.removeChild(mainContainer.lastChild); //here we remove the new child that we create "divContainer"
      createdDiv = false; //it is important to reset the variable
    }
    if (product.hasFreeShipping) {
      const priceContainer = templateShopLi.querySelector(finalPriceParentSelector);
      priceContainer.removeChild(priceContainer.lastChild);
    }
    //the number of units is updated according to each product
    templateShopLi.querySelector(finalPriceParentSelector).removeChild(spanItemUnits);

  });
  shopItems.appendChild(fragment);
}

function addToCart(e) {
  e.stopPropagation();
  setToCart(e.target.closest(fullItemSelector));
}

function setToCart(parentItem) {

  //to keep our cart updated (in case the user is editing several tabs at the same time)
  cart = JSON.parse(localStorage.getItem('cart')) || {};

  const shippingElem = parentItem.querySelector(shippingTagSelector);
  let shipping = false;
  if (shippingElem !== null) {
    shipping = true
  }

  let finalPriceSelector = parentItem.querySelector(itemFinalPriceSelector).textContent;
  finalPriceSelector = parseFloat(finalPriceSelector.substr(1));

  //original price of the product that appears in the items in case of discount
  const basePriceElem = parentItem.querySelector(originalPriceSelector);
  let basePrice;
  let discount = false;
  if (basePriceElem !== null) {
    //If we detect that our final price exists then our discount will also exist
    basePrice = parseFloat(basePriceElem.textContent.substr(1));
    //This is when we get our discount percentage back
    const discountElem = parentItem.querySelector(promotionBadgeSelector);
    //It only brings us the numbers, which is what we care about
    discount = parseInt(discountElem.textContent);
  } else {
    basePrice = finalPriceSelector;
  }

  //the units come in "u/XX" format, where "X" is the number of units, we are going to use only the numbers that is why we use substr(2)
  const units = parseInt(parentItem.querySelector(itemUnitsSelector).textContent.substr(3));

  const product = {
    price: basePrice,
    finalPrice: finalPriceSelector,
    id: parentItem.querySelector(addToCartSelector).dataset.id,
    title: parentItem.querySelector(itemTitleSelector).textContent,
    thumnailUrl: parentItem.querySelector(itemImageSelector).getAttribute('src'),
    hasFreeShipping: shipping,
    hasDiscount: discount,
    unitsAvailable: units,
    quantity: 1,
  }
  if (cart.hasOwnProperty(product.id)) {
    product.quantity = cart[product.id].quantity + 1;
  }
  cart[product.id] = {...product};

  localStorage.setItem('cart', JSON.stringify(cart));
}

//this function filters our results according to the filters that we have saved in localStorage
function filterResults(objArray, loadPreviousFilters) {

  const filters = JSON.parse(localStorage.getItem('filters')) || {...userFiltersBase};

  for (const prop in filters) {
    objArray = filtersConfigHandler(filters[prop], filters, null, loadPreviousFilters);
  }

  return objArray;

}
//this function handles user clicks in the filters section (it only activates when an element with the class ".sel-none" is clicked)
function filtersClickHandler(event) {

  const filters = JSON.parse(localStorage.getItem('filters')) || {...userFiltersBase};

  filtersConfigHandler(event.target.textContent, filters, event.target, false);
  updateListing(false);

}

//this function has double functionality, it manages the filters and on the other hand it manages the user clicks on the filter buttons (on the shop.html page)
function filtersConfigHandler(item, objFilters, eventTarget, loadPreviousFilters) {

  //this part manages the filters/property part (NOT the shop buttons)
  if (Array.isArray(item) && item.length !== 0) {
    for (const value of item) {
      filtersConfigHandler(value, objFilters, null, loadPreviousFilters);
    }
  }

  //this handles the shop buttons and active filters/properties
  if (typeof item === 'string') {

    switch (item) {

      //---------------------Sortby
      case 'Featured':
        //apiShopItems being our array of products
        apiShopItems = Object.values(apiShopItems).sort(obj1 => obj1.id);
        //objFilters being our filters stored in localStorage
        objFilters.sortby = 'Featured';
        //sortByLabel being the <select> tag that manages the formation of our items
        sortByLabel.value = 'Featured';
        break;

      case 'Low to high':
        apiShopItems = Object.values(apiShopItems).sort((obj1, obj2) => obj1.price - obj2.price);
        objFilters.sortby = 'Low to high';
        sortByLabel.value = 'Low to high';
        break;

      case 'High to low':
        apiShopItems = Object.values(apiShopItems).sort((obj1, obj2) => obj2.price - obj1.price);
        objFilters.sortby = 'High to low';
        sortByLabel.value = 'High to low';
        break;

      //---------------------Region
      case 'North America':
        apiShopItems = Object.values(apiShopItems).filter(obj1 => obj1.region.includes('North America'));
        //this checks if the filter is not already saved
        if (!objFilters.region.includes('North America')) objFilters.region = [...objFilters.region, 'North America'];
        //here we check if loadPreviousFilters is true, which means that we have to load the previous filters (classes and buttons) and that it is the first time the page is loaded
        if (loadPreviousFilters) eventTarget = arrayInactiveBtns.filter(btn => btn.innerText === 'North America')[0];
        //filtersEvents() function adds classes and functionalities to remove filters
        filtersEvents(eventTarget, objFilters, 'region', 'North America');
        //renderClearBtn() renders the clear button, which clears all the filters of that particular section (only if it is not created yet, if the button is already created this function does nothing)
        renderClearBtn(eventTarget, 'region');
        break;

      case 'United States':
        apiShopItems = Object.values(apiShopItems).filter(obj1 => obj1.region.includes('United States'));
        if (!objFilters.region.includes('United States')) objFilters.region = [...objFilters.region, 'United States'];
        if (loadPreviousFilters) eventTarget = arrayInactiveBtns.filter(btn => btn.innerText === 'United States')[0];
        filtersEvents(eventTarget, objFilters, 'region', 'United States');
        renderClearBtn(eventTarget, 'region');
        break;

      case 'Europe':
        apiShopItems = Object.values(apiShopItems).filter(obj1 => obj1.region.includes('Europe'));
        if (!objFilters.region.includes('Europe')) objFilters.region = [...objFilters.region, 'Europe'];
        if (loadPreviousFilters) eventTarget = arrayInactiveBtns.filter(btn => btn.innerText === 'Europe')[0];
        filtersEvents(eventTarget, objFilters, 'region', 'Europe');
        renderClearBtn(eventTarget, 'region');
        break;

      case 'Global':
        apiShopItems = Object.values(apiShopItems).filter(obj1 => obj1.region.includes('Global'));
        if (!objFilters.region.includes('Global')) objFilters.region = [...objFilters.region, 'Global'];
        if (loadPreviousFilters) eventTarget = arrayInactiveBtns.filter(btn => btn.innerText === 'Global')[0];
        filtersEvents(eventTarget, objFilters, 'region', 'Global');
        renderClearBtn(eventTarget, 'region');
        break;

      //---------------------Discount
      case '25%':
        apiShopItems = Object.values(apiShopItems).filter(obj1 => obj1.discount >= 25);
        if (!objFilters.discount.includes('25%')) objFilters.discount = [...objFilters.discount, '25%'];
        if (loadPreviousFilters) eventTarget = arrayInactiveBtns.filter(btn => btn.innerText === '25%')[0];
        filtersEvents(eventTarget, objFilters, 'discount', '25%');
        renderClearBtn(eventTarget, 'discount');
        break;

      case '50%':
        apiShopItems = Object.values(apiShopItems).filter(obj1 => obj1.discount >= 50);
        if (!objFilters.discount.includes('50%')) objFilters.discount = [...objFilters.discount, '50%'];
        if (loadPreviousFilters) eventTarget = arrayInactiveBtns.filter(btn => btn.innerText === '50%')[0];
        filtersEvents(eventTarget, objFilters, 'discount', '50%');
        renderClearBtn(eventTarget, 'discount');
        break;

      case '75%':
        apiShopItems = Object.values(apiShopItems).filter(obj1 => obj1.discount >= 75);
        if (!objFilters.discount.includes('75%')) objFilters.discount = [...objFilters.discount, '75%'];
        if (loadPreviousFilters) eventTarget = arrayInactiveBtns.filter(btn => btn.innerText === '75%')[0];
        filtersEvents(eventTarget, objFilters, 'discount', '75%');
        renderClearBtn(eventTarget, 'discount');
        break;

      case '100%':
        apiShopItems = Object.values(apiShopItems).filter(obj1 => obj1.discount >= 100);
        if (!objFilters.discount.includes('100%')) objFilters.discount = [...objFilters.discount, '100%'];
        if (loadPreviousFilters) eventTarget = arrayInactiveBtns.filter(btn => btn.innerText === '100%')[0];
        filtersEvents(eventTarget, objFilters, 'discount', '100%');
        renderClearBtn(eventTarget, 'discount');
        break;

      //---------------------Ratings
      case '1 star':
        apiShopItems = Object.values(apiShopItems).filter(obj1 => obj1.rating >= 1);
        if (loadPreviousFilters) eventTarget = arrayInactiveBtns.filter(btn => btn.dataset.stars === '1')[0];
        filtersEvents(eventTarget, objFilters, 'ratings', '1 star');
        renderClearBtn(eventTarget, 'ratings');
        break;

      case '2 star':
        apiShopItems = Object.values(apiShopItems).filter(obj1 => obj1.rating >= 2);
        if (loadPreviousFilters) eventTarget = arrayInactiveBtns.filter(btn => btn.dataset.stars === '2')[0];
        filtersEvents(eventTarget, objFilters, 'ratings', '2 star');
        renderClearBtn(eventTarget, 'ratings');
        break;

      case '3 star':
        apiShopItems = Object.values(apiShopItems).filter(obj1 => obj1.rating >= 3);
        if (loadPreviousFilters) eventTarget = arrayInactiveBtns.filter(btn => btn.dataset.stars === '3')[0];
        filtersEvents(eventTarget, objFilters, 'ratings', '3 star');
        renderClearBtn(eventTarget, 'ratings');
        break;

      case '4 star':
        apiShopItems = Object.values(apiShopItems).filter(obj1 => obj1.rating >= 4);
        if (loadPreviousFilters) eventTarget = arrayInactiveBtns.filter(btn => btn.dataset.stars === '4')[0];
        filtersEvents(eventTarget, objFilters, 'ratings', '4 star');
        renderClearBtn(eventTarget, 'ratings');
        break;

      //---------------------Payment
      case 'In 12 installments':
        apiShopItems = Object.values(apiShopItems).filter(obj1 => obj1.payment.includes('In 12 installments'));
        if (!objFilters.payment.includes('In 12 installments')) objFilters.payment = [...objFilters.payment, 'In 12 installments'];
        if (loadPreviousFilters) eventTarget = arrayInactiveBtns.filter(btn => btn.innerText === 'In 12 installments')[0];
        filtersEvents(eventTarget, objFilters, 'payment', 'In 12 installments');
        renderClearBtn(eventTarget, 'payment');
        break;

      case 'In 6 installments':
        apiShopItems = Object.values(apiShopItems).filter(obj1 => obj1.payment.includes('In 6 installments'));
        if (!objFilters.payment.includes('In 6 installments')) objFilters.payment = [...objFilters.payment, 'In 6 installments'];
        if (loadPreviousFilters) eventTarget = arrayInactiveBtns.filter(btn => btn.innerText === 'In 6 installments')[0];
        filtersEvents(eventTarget, objFilters, 'payment', 'In 6 installments');
        renderClearBtn(eventTarget, 'payment');
        break;

      case 'In cash':
        apiShopItems = Object.values(apiShopItems).filter(obj1 => obj1.payment.includes('In cash'));
        if (!objFilters.payment.includes('In cash')) objFilters.payment = [...objFilters.payment, 'In cash'];
        if (loadPreviousFilters) eventTarget = arrayInactiveBtns.filter(btn => btn.innerText === 'In cash')[0];
        filtersEvents(eventTarget, objFilters, 'payment', 'In cash');
        renderClearBtn(eventTarget, 'payment');
        break;

      //---------------------Promotions
      case 'Special offer':
        apiShopItems = Object.values(apiShopItems).filter(obj1 => obj1.promotion.includes('Special offer'));
        if (!objFilters.promotions.includes('Special offer')) objFilters.promotions = [...objFilters.promotions, 'Special offer'];
        if (loadPreviousFilters) eventTarget = arrayInactiveBtns.filter(btn => btn.innerText === 'Special offer')[0];
        filtersEvents(eventTarget, objFilters, 'promotions', 'Special offer');
        renderClearBtn(eventTarget, 'promotions');
        break;

      case 'New':
        apiShopItems = Object.values(apiShopItems).filter(obj1 => obj1.promotion.includes('New'));
        if (!objFilters.promotions.includes('New')) objFilters.promotions = [...objFilters.promotions, 'New'];
        if (loadPreviousFilters) eventTarget = arrayInactiveBtns.filter(btn => btn.innerText === 'New')[0];
        filtersEvents(eventTarget, objFilters, 'promotions', 'New');
        renderClearBtn(eventTarget, 'promotions');
        break;

      //---------------------Delivery
      case 'Free shipping':
        apiShopItems = Object.values(apiShopItems).filter(obj1 => obj1.hasFreeShipping);
        if (!objFilters.delivery.includes('Free shipping')) objFilters.delivery = [...objFilters.delivery, 'Free shipping'];
        if (loadPreviousFilters) eventTarget = arrayInactiveBtns.filter(btn => btn.innerText === 'Free shipping')[0];
        filtersEvents(eventTarget, objFilters, 'delivery', 'Free shipping');
        renderClearBtn(eventTarget, 'delivery');
        break;

      case 'Withdrawal in person':
        apiShopItems = Object.values(apiShopItems).filter(obj1 => !obj1.hasFreeShipping);
        if (!objFilters.delivery.includes('Withdrawal in person')) objFilters.delivery = [...objFilters.delivery, 'Withdrawal in person'];
        if (loadPreviousFilters) eventTarget = arrayInactiveBtns.filter(btn => btn.innerText === 'Withdrawal in person')[0];
        filtersEvents(eventTarget, objFilters, 'delivery', 'Withdrawal in person');
        renderClearBtn(eventTarget, 'delivery');
        break;

      //---------------------Price
      case '$0 - $10':
        apiShopItems = Object.values(apiShopItems).filter(obj1 => obj1.price > 0 && obj1.price <= 10);
        if (!objFilters.price.includes('$0 - $10')) objFilters.price = [...objFilters.price, '$0 - $10'];
        if (loadPreviousFilters) eventTarget = arrayInactiveBtns.filter(btn => btn.innerText === '$0 - $10')[0];
        filtersEvents(eventTarget, objFilters, 'price', '$0 - $10');
        renderClearBtn(eventTarget, 'price');
        break;

      case '$10 - $50':
        apiShopItems = Object.values(apiShopItems).filter(obj1 => obj1.price > 10 && obj1.price <= 50);
        if (!objFilters.price.includes('$10 - $50')) objFilters.price = [...objFilters.price, '$10 - $50'];
        if (loadPreviousFilters) eventTarget = arrayInactiveBtns.filter(btn => btn.innerText === '$10 - $50')[0];
        filtersEvents(eventTarget, objFilters, 'price', '$10 - $50');
        renderClearBtn(eventTarget, 'price');
        break;

      case '$50 - $100':
        apiShopItems = Object.values(apiShopItems).filter(obj1 => obj1.price > 50 && obj1.price <= 100);
        if (!objFilters.price.includes('$50 - $100')) objFilters.price = [...objFilters.price, '$50 - $100'];
        if (loadPreviousFilters) eventTarget = arrayInactiveBtns.filter(btn => btn.innerText === '$50 - $100')[0];
        filtersEvents(eventTarget, objFilters, 'price', '$50 - $100');
        renderClearBtn(eventTarget, 'price');
        break;

      case '$100+':
        apiShopItems = Object.values(apiShopItems).filter(obj1 => obj1.price > 100);
        if (!objFilters.price.includes('$100+')) objFilters.price = [...objFilters.price, '$100+'];
        if (loadPreviousFilters) eventTarget = arrayInactiveBtns.filter(btn => btn.innerText === '$100+')[0];
        filtersEvents(eventTarget, objFilters, 'price', '$100+');
        renderClearBtn(eventTarget, 'price');
        break;

    }

    if (item.startsWith('CustomPrice:')) {
      renderClearBtn(minPriceInput, 'customPrice');
      //Example string: CustomPrice: 13 - 14141 ( the array of ['13','14141'] would be stored in the variable bothPricesArray )
      const bothPricesArray = item.split('-').map(string => string.replace(/\D/g, ''));
      apiShopItems = Object.values(apiShopItems).filter(obj1 => obj1.price >= parseInt(bothPricesArray[0]) && obj1.price <= parseInt(bothPricesArray[1]));

      minPriceInput.value = bothPricesArray[0];
      maxPriceInput.value = bothPricesArray[1];
    }

    if (item.startsWith('CustomDiscount:')) {
      renderClearBtn(minDiscountInput, 'customDiscount');
      const bothDiscountsArray = item.split('-').map(string => string.replace(/\D/g, ''));
      apiShopItems = Object.values(apiShopItems).filter(obj1 => obj1.discount >= parseInt(bothDiscountsArray[0]) && obj1.discount <= parseInt(bothDiscountsArray[1]));

      minDiscountInput.value = bothDiscountsArray[0];
      maxDiscountInput.value = bothDiscountsArray[1];
    }

    if (item.startsWith('CustomSearch:')) {
      const text = item.substr(14);
      apiShopItems = Object.values(apiShopItems).filter(obj1 => obj1.title.toLowerCase().startsWith(text.toLowerCase()));

      searchInput.value = text;
    }

  }

  localStorage.setItem('filters', JSON.stringify(objFilters));
  return apiShopItems;
}

function filtersEvents(eventTarget, filterArray, filterArrayProp, itemToRemove) {
  if (eventTarget) {
    eventTarget.classList.remove('sel-none');
    eventTarget.classList.add('sel-primary');

    const closeBtn = document.createElement('button');
    closeBtn.classList.add('sel-primary');
    const crossIcon = document.createElement('i');
    crossIcon.classList.add('fas', 'fa-times');

    closeBtn.appendChild(crossIcon)
    //this section generates the icon of a cross that will eliminate the classes and remove it from the active filters
    closeBtn.addEventListener('click', e => {
      e.stopPropagation();
      filterArray = JSON.parse(localStorage.getItem('filters')) || {...userFiltersBase};
      closeBtn.parentNode.removeChild(closeBtn);
      eventTarget.classList.remove('sel-primary');
      eventTarget.classList.add('sel-none');

      filterArray[filterArrayProp].splice(filterArray[filterArrayProp].indexOf(itemToRemove), 1);
      //this checks if the filter property is empty, if so, the clear button will be removed as well
      if (filterArray[filterArrayProp].length === 0 || filterArray[filterArrayProp] === "") {
        const parentElem = eventTarget.closest('div').firstElementChild;
        parentElem.removeChild(parentElem.lastChild);
      }
      localStorage.setItem('filters', JSON.stringify(filterArray));
      updateListing(false);
    });

    eventTarget.parentNode.appendChild(closeBtn);
  }
}

//this function updates the products (to handle active filters)
function updateListing(loadPreviousFilters) {
  //we show the loading icon 
  document.querySelector(loadingIconSelector).classList.remove('d-none');
  fetchShopItems(loadPreviousFilters);
}

//this function creates a clear button next to each filter section to be able to remove several filters at the same time.
function renderClearBtn(eventTarget, propertyToDelete) {

  if (eventTarget) {

    const parentElem = eventTarget.closest('div');
    const childDivElem = eventTarget.closest('div').firstElementChild;
    const previouslyCreated = childDivElem.querySelector(clearSectionFilterBtnSelector);

    //check that the button has not been created previously
    if (!previouslyCreated) {

      const clearContainer = document.createElement('div');
      clearContainer.classList.add('col-md-3', 'text-end');
      const clearBtn = document.createElement('button');
      clearBtn.classList.add('sel-none');
      const spanClear = document.createElement('span');
      spanClear.classList.add('h-pointer', 'h-underline')
      spanClear.textContent = 'Clear';

      clearBtn.appendChild(spanClear);
      clearBtn.addEventListener('click', e => {
        e.stopPropagation();
        const filters = JSON.parse(localStorage.getItem('filters')) || {...userFiltersBase};
        childDivElem.removeChild(childDivElem.lastChild);

        //some properties are a string but it does not matter because when generating a new filter they are overwritten and become strings again
        filters[propertyToDelete] = [];

        //functionality quite similar to that of the cleanAllFiltersBtn button
        const previousFilters = parentElem.querySelectorAll(filterCrossIconSelector);
        for (let oldFilter of previousFilters) {
          const parent = oldFilter.closest('li');
          parent.removeChild(parent.lastChild);
          parent.firstElementChild.classList.remove('sel-primary');
          parent.firstElementChild.classList.add('sel-none');
        }

        //this serves to clean the inputs
        switch (propertyToDelete) {
          case 'price': case 'customPrice':
            filters.customPrice = "";
            minPriceInput.value = "";
            maxPriceInput.value = "";
            break;
          case 'discount': case 'customDiscount':
            filters.customDiscount = "";
            minDiscountInput.value = "";
            maxDiscountInput.value = "";
            break;
        }

        localStorage.setItem('filters', JSON.stringify(filters));
        updateListing(false);
      });

      clearContainer.appendChild(clearBtn);

      childDivElem.appendChild(clearContainer);

    }

  }

}

//filter based on what the user types
function searchFilter(event) {
  event.stopPropagation();

  const filters = JSON.parse(localStorage.getItem('filters')) || {...userFiltersBase};

  if (searchInput.value !== "") {
    apiShopItems = Object.values(apiShopItems).filter(obj1 => obj1.title.toLowerCase().startsWith(searchInput.value.toLowerCase()));
    filters.customSearch = `CustomSearch: ${searchInput.value}`;
  } else {
    filters.customSearch = "";
  }

  localStorage.setItem('filters', JSON.stringify(filters));
  updateListing(false);
}

//this function handles the results of the inputs that appear in the discount and price filters
function priceAndDiscountFilter(event, minContainer, maxContainer, filterProperty, productProperty, stringTemplate) {
  event.stopPropagation();

  const filters = JSON.parse(localStorage.getItem('filters')) || {...userFiltersBase};

  //this deletes signs that we don't want in our string
  minContainer.value = minContainer.value.replace(/[e\+\-]/gi, "");
  maxContainer.value = maxContainer.value.replace(/[e\+\-]/gi, "");

  if (minContainer.value !== "" && maxContainer.value !== "") {
    apiShopItems = Object.values(apiShopItems).filter(obj1 => obj1[productProperty] >= parseInt(minContainer.value) && obj1[productProperty] <= parseInt(maxContainer.value));
    filters[filterProperty] = stringTemplate + minContainer.value + ' - ' + maxContainer.value;
  } else {
    filters[filterProperty] = "";
  }

  localStorage.setItem('filters', JSON.stringify(filters));
  updateListing(false);
}
function renderCartSubmenu(visible = true) {
  cart = JSON.parse(localStorage.getItem('cart'));
  const submenuSessionData = JSON.parse(sessionStorage.getItem('cartSubmenu')) || submenuSession;

  const productsContainer = templateCartSubmenu.getElementById('cart-checkout-products');
  productsContainer.innerHTML = '';
  let presentItemsArray = submenuChecker();
  //this basically serves to delete old values and load new ones (something like returning the values to default)
  if (presentItemsArray[0] && presentItemsArray[1]) {
    const parent = presentItemsArray[0].parentNode;
    parent.removeChild(presentItemsArray[0]);
    parent.removeChild(presentItemsArray[1]);
  }

  if (cart) {
    const products = Object.values(cart);

    //products added label
    templateCartSubmenu.querySelector(submenuTotalProductsSelector).textContent = `${products.length} Products added`;
    //total prices
    const nDiscountedPrices = Object.values(products).reduce((acc, {price, hasDiscount, quantity}) => acc + (price - (price * hasDiscount / 100)) * quantity, 0);
    templateCartSubmenu.querySelector(submenuTotalPriceSelector).textContent = `$${nDiscountedPrices.toFixed(2)}`;

    //.........................

    products.forEach(product => {
      //id to identify the product
      templateCartSubmenuProduct.querySelector(submenuMainProductSelector).setAttribute('data-productid', product.id);
      //anchor/href
      //const pLink = templateCartSubmenuProduct.querySelector('a.row.align-items-center.m-auto.text-dark.child-underline');
      //productLink.setAttribute('href', product)
      //image
      const pImage = templateCartSubmenuProduct.querySelector(submenuImageSelector);
      const pImageAlt = product.title.toLowerCase().replaceAll(" ", "-");
      pImage.setAttribute('src', product.thumnailUrl);
      pImage.setAttribute('alt', pImageAlt);
      //title
      templateCartSubmenuProduct.querySelector(submenuTitleSelector).textContent = product.title;
      //discounts
      const pDiscount = templateCartSubmenuProduct.querySelector(submenuDiscountSelector);
      if (product.hasDiscount) {
        pDiscount.textContent = `-${product.hasDiscount}%`;
      } else {
        pDiscount.textContent = '';
      }
      //price
      templateCartSubmenuProduct.querySelector(submenuProductPriceSelector).textContent = `$${product.finalPrice * product.quantity}`;

      const clone = templateCartSubmenuProduct.cloneNode(true);
      fragment.appendChild(clone);
    });

    productsContainer.appendChild(fragment);
  } else {
    //this simply adds a tag in case there are no products to list

    const emptyProductDiv = document.createElement('div');
    emptyProductDiv.classList.add('border-top', 'border-darker-5', 'border-1', 'p-1');
    const emptyTextdiv = document.createElement('div');
    emptyTextdiv.classList.add('m-2', 'text-center', 'fw-bold');
    emptyTextdiv.textContent = 'The shopping cart is empty';

    emptyProductDiv.appendChild(emptyTextdiv);
    productsContainer.appendChild(emptyProductDiv);
  }

  //this part manages the visibility of our changes in the DOM
  presentItemsArray = submenuChecker(templateCartSubmenu);
  if (!visible) {
    presentItemsArray[0].classList.add('d-none');
    presentItemsArray[1].classList.add('d-none');
    submenuSessionData.active = false;
  } else {
    presentItemsArray[0].classList.remove('d-none');
    presentItemsArray[1].classList.remove('d-none');
    submenuSessionData.active = true;
  }
  //we clone the template because there can only be one
  const clone = templateCartSubmenu.cloneNode(true);
  fragment.appendChild(clone);

  cartCheckout.parentNode.appendChild(fragment);

  submenuSessionData.rendered = true;
  sessionStorage.setItem('cartSubmenu', JSON.stringify(submenuSessionData));
}
function updateSubmenuContent() {
  //this function manages the clicks and adds the items in the background if the cart is not visible
  const submenuSessionData = JSON.parse(sessionStorage.getItem('cartSubmenu')) || submenuSession;
  if (submenuSessionData.active) {
    //in case the cart is active (visible)
    renderCartSubmenu();
  } else {
    //in case the cart is not active (not visible)
    renderCartSubmenu(false);
  }
}
function submenuChecker(documentOrTemplate = document) {
  //this check if our cart is rendered or not, and returns the values (it can be a null value if the cart is not rendered, and the element in the DOM if it is rendered)
  const cartCheckoutTriangle = documentOrTemplate.querySelector(submenuTriangleSelector);
  const cartCheckoutSubmenu = documentOrTemplate.querySelector(submenuDataContainerSelector);
  //this returns a array
  return [cartCheckoutTriangle, cartCheckoutSubmenu];
}
