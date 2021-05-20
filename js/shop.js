"use strict";
//-----------------------------------------------------------

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

const filtersBtnsCotainer = document.getElementById('filters-btns-container');
const arrayInactiveBtns = [...filtersBtnsCotainer.querySelectorAll('.sel-none')];

const ratingBtnsArray = document.querySelectorAll('.sel-none[data-stars]');
for (const ratingFilterBtn of ratingBtnsArray) {
  ratingFilterBtn.addEventListener('click', event => {
    if (!ratingFilterBtn.classList.contains('sel-primary')) {
      event.stopPropagation();
      const filters = JSON.parse(localStorage.getItem('filters')) || {...userFiltersBase};
      const starIdentifier = `${ratingFilterBtn.dataset.stars} star`
      filtersEvents(ratingFilterBtn, filters, 'ratings', starIdentifier);
      renderClearBtn(event.target, 'ratings');
      if (!filters.ratings.includes(starIdentifier)) filters.ratings = [...filters.ratings, starIdentifier];
      localStorage.setItem('filters', JSON.stringify(filters));
      updateListing(false);
    }
  });
}

const sortByLabel = document.getElementById('sortby');
sortByLabel.addEventListener('change', () => {
  const filters = JSON.parse(localStorage.getItem('filters')) || {...userFiltersBase};

  filtersConfigHandler(sortByLabel.value, filters, null, false);
  updateListing(false);
});

//const disabledClass = document.getElementsByClassName('disabled');
//for (const elem of disabledClass) {
//elem.disabled = true;
//}

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

function priceAndDiscountFilter(event, minContainer, maxContainer, filterProperty, productProperty, stringTemplate) {
  event.stopPropagation();

  const filters = JSON.parse(localStorage.getItem('filters')) || {...userFiltersBase};

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

const cleanAllFiltersBtn = document.getElementById('clean-all-filters');
cleanAllFiltersBtn.addEventListener('click', e => {
  e.stopPropagation();
  localStorage.setItem('filters', JSON.stringify({...userFiltersBase}));
  updateListing(false);
  //select all remove's buttons
  const previousFilters = document.querySelectorAll('.sel-primary .fa-times');
  if (previousFilters) {
    for (let oldFilter of previousFilters) {
      const parent = oldFilter.closest('li');
      parent.removeChild(parent.lastChild);
      parent.firstElementChild.classList.remove('sel-primary');
      parent.firstElementChild.classList.add('sel-none');
    }
    minPriceInput.value = "";
    maxPriceInput.value = "";
    minDiscountInput.value = "";
    maxDiscountInput.value = "";
    sortByLabel.value = "Featured";
  }
});

//templates
const templateShopLi = document.getElementById('template-item-li').content;

//containers
const shopItems = document.getElementById('shop-items-display');
const cartMiniIcon = document.querySelector('span.position-absolute.top-0.start-100.translate-middle.badge.rounded-pill.bg-primary.h-pointer span');
const mainShopContainer = document.getElementById('main-shop-container');

//fragments
const fragment = document.createDocumentFragment();

let cart = JSON.parse(localStorage.getItem('cart')) || {};


//selectors

//these are the images that are rendered for each product in shop.html
const itemImageSelector = 'img';
//title of each product
const itemTitleSeletor = 'h5 a';
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


document.addEventListener('DOMContentLoaded', () => {
  fetchShopItems();
});

mainShopContainer.addEventListener('click', e => {
  e.stopPropagation();
  renderCartIcons(cart);
  if (e.target.matches('button.btn.btn-primary.d-block.w-100.ff-lato-4')) {
    addToCart(e);
  }
  if (e.target.classList.contains('sel-none')) {
    filtersClickHandler(e);
  }
})


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
        document.querySelector('div.spinner-grow.text-secondary.my-2').classList.add('d-none');
        apiShopItems = data;
      });

    apiShopItems = filterResults(apiShopItems, loadPreviousFilters);

    if (apiShopItems.length !== 0) {
      renderShopItems(apiShopItems);
      renderCartIcons(cart);
    } else {
      renderCartIcons(cart);
      renderPageError('no items found', true);
    }

  } catch (error) {
    renderPageError(error);
  }
}

function renderPageError(error, emptySearch = false) {

  shopItems.innerHTML = '';

  const errorContainer = document.createElement('h4');
  errorContainer.classList.add('text-center', 'my-4', 'mx-4', 'fw-bold', 'ff-lato-4');
  errorContainer.textContent = 'Error while loading items.';

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

function renderCartIcons(arrayItems) {
  const itemsInCart = Object.values(arrayItems).reduce((acc, {quantity}) => acc + quantity, 0);
  if (itemsInCart <= 9) {
    cartMiniIcon.textContent = itemsInCart;
  } else {
    cartMiniIcon.textContent = '+9';
  }
}

function renderShopItems(arrayItems) {

  shopItems.innerHTML = '';

  let createdDiv = false;

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
    templateShopLi.querySelector(itemTitleSeletor).textContent = product.title;
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
      var divContainer = createSubContainer();

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
        var divContainer = createSubContainer();
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
  setToCart(e.target.closest(fullItemSelector));
  e.stopPropagation();
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
  const basePriceElem = parentItem.querySelector('span.text-decoration-line-through.me-1');
  let basePrice = false;
  let discount = false;
  if (basePriceElem !== null) {
    //If we detect that our final price exists then our discount will also exist
    basePrice = parseFloat(basePriceElem.textContent.substr(1));
    //This is when we get our discount percentage back
    const discountElem = parentItem.querySelector('span.badge.bg-primary.me-1');
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
    title: parentItem.querySelector(itemTitleSeletor).textContent,
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

function filterResults(objArray, loadPreviousFilters) {

  const filters = JSON.parse(localStorage.getItem('filters')) || {...userFiltersBase};

  for (const prop in filters) {
    objArray = filtersConfigHandler(filters[prop], filters, null, loadPreviousFilters);
  }

  return objArray;

}

function filtersClickHandler(event) {

  const filters = JSON.parse(localStorage.getItem('filters')) || {...userFiltersBase};

  filtersConfigHandler(event.target.textContent, filters, event.target, false);
  updateListing(false);

}

function filtersConfigHandler(item, objFilters, eventTarget, loadPreviousFilters) {
  //This function has double functionality, it manages the filters and on the other hand it manages the user clicks on the filter buttons (on the shop.html page)

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
        apiShopItems = Object.values(apiShopItems).sort(obj1 => obj1.id);;
        objFilters.sortby = 'Featured';
        sortby.value = 'Featured';
        break;

      case 'Low to high':
        apiShopItems = Object.values(apiShopItems).sort((obj1, obj2) => obj1.price - obj2.price);
        objFilters.sortby = 'Low to high';
        sortby.value = 'Low to high';
        break;

      case 'High to low':
        apiShopItems = Object.values(apiShopItems).sort((obj1, obj2) => obj2.price - obj1.price);
        objFilters.sortby = 'High to low';
        sortby.value = 'High to low';
        break;

      //---------------------Region
      case 'North America':
        apiShopItems = Object.values(apiShopItems).filter(obj1 => obj1.region.includes('North America'));
        if (!objFilters.region.includes('North America')) objFilters.region = [...objFilters.region, 'North America'];
        if (loadPreviousFilters) eventTarget = arrayInactiveBtns.filter(btn => btn.innerText == 'North America')[0];
        filtersEvents(eventTarget, objFilters, 'region', 'North America');
        renderClearBtn(eventTarget, 'region');
        break;

      case 'United States':
        apiShopItems = Object.values(apiShopItems).filter(obj1 => obj1.region.includes('United States'));
        if (!objFilters.region.includes('United States')) objFilters.region = [...objFilters.region, 'United States'];
        if (loadPreviousFilters) eventTarget = arrayInactiveBtns.filter(btn => btn.innerText == 'United States')[0];
        filtersEvents(eventTarget, objFilters, 'region', 'United States');
        renderClearBtn(eventTarget, 'region');
        break;

      case 'Europe':
        apiShopItems = Object.values(apiShopItems).filter(obj1 => obj1.region.includes('Europe'));
        if (!objFilters.region.includes('Europe')) objFilters.region = [...objFilters.region, 'Europe'];
        if (loadPreviousFilters) eventTarget = arrayInactiveBtns.filter(btn => btn.innerText == 'Europe')[0];
        filtersEvents(eventTarget, objFilters, 'region', 'Europe');
        renderClearBtn(eventTarget, 'region');
        break;

      case 'Global':
        apiShopItems = Object.values(apiShopItems).filter(obj1 => obj1.region.includes('Global'));
        if (!objFilters.region.includes('Global')) objFilters.region = [...objFilters.region, 'Global'];
        if (loadPreviousFilters) eventTarget = arrayInactiveBtns.filter(btn => btn.innerText == 'Global')[0];
        filtersEvents(eventTarget, objFilters, 'region', 'Global');
        renderClearBtn(eventTarget, 'region');
        break;

      //---------------------Discount
      case '25%':
        apiShopItems = Object.values(apiShopItems).filter(obj1 => obj1.discount >= 25);
        if (!objFilters.discount.includes('25%')) objFilters.discount = [...objFilters.discount, '25%'];
        if (loadPreviousFilters) eventTarget = arrayInactiveBtns.filter(btn => btn.innerText == '25%')[0];
        filtersEvents(eventTarget, objFilters, 'discount', '25%');
        renderClearBtn(eventTarget, 'discount');
        break;

      case '50%':
        apiShopItems = Object.values(apiShopItems).filter(obj1 => obj1.discount >= 50);
        if (!objFilters.discount.includes('50%')) objFilters.discount = [...objFilters.discount, '50%'];
        if (loadPreviousFilters) eventTarget = arrayInactiveBtns.filter(btn => btn.innerText == '50%')[0];
        filtersEvents(eventTarget, objFilters, 'discount', '50%');
        renderClearBtn(eventTarget, 'discount');
        break;

      case '75%':
        apiShopItems = Object.values(apiShopItems).filter(obj1 => obj1.discount >= 75);
        if (!objFilters.discount.includes('75%')) objFilters.discount = [...objFilters.discount, '75%'];
        if (loadPreviousFilters) eventTarget = arrayInactiveBtns.filter(btn => btn.innerText == '75%')[0];
        filtersEvents(eventTarget, objFilters, 'discount', '75%');
        renderClearBtn(eventTarget, 'discount');
        break;

      case '100%':
        apiShopItems = Object.values(apiShopItems).filter(obj1 => obj1.discount >= 100);
        if (!objFilters.discount.includes('100%')) objFilters.discount = [...objFilters.discount, '100%'];
        if (loadPreviousFilters) eventTarget = arrayInactiveBtns.filter(btn => btn.innerText == '100%')[0];
        filtersEvents(eventTarget, objFilters, 'discount', '100%');
        renderClearBtn(eventTarget, 'discount');
        break;

      //---------------------Ratings
      case '1 star':
        apiShopItems = Object.values(apiShopItems).filter(obj1 => obj1.rating >= 1);
        if (loadPreviousFilters) eventTarget = arrayInactiveBtns.filter(btn => btn.dataset.stars == '1')[0];
        filtersEvents(eventTarget, objFilters, 'ratings', '1 star');
        renderClearBtn(eventTarget, 'ratings');
        break;

      case '2 star':
        apiShopItems = Object.values(apiShopItems).filter(obj1 => obj1.rating >= 2);
        if (loadPreviousFilters) eventTarget = arrayInactiveBtns.filter(btn => btn.dataset.stars == '2')[0];
        filtersEvents(eventTarget, objFilters, 'ratings', '2 star');
        renderClearBtn(eventTarget, 'ratings');
        break;

      case '3 star':
        apiShopItems = Object.values(apiShopItems).filter(obj1 => obj1.rating >= 3);
        if (loadPreviousFilters) eventTarget = arrayInactiveBtns.filter(btn => btn.dataset.stars == '3')[0];
        filtersEvents(eventTarget, objFilters, 'ratings', '3 star');
        renderClearBtn(eventTarget, 'ratings');
        break;

      case '4 star':
        apiShopItems = Object.values(apiShopItems).filter(obj1 => obj1.rating >= 4);
        if (loadPreviousFilters) eventTarget = arrayInactiveBtns.filter(btn => btn.dataset.stars == '4')[0];
        filtersEvents(eventTarget, objFilters, 'ratings', '4 star');
        renderClearBtn(eventTarget, 'ratings');
        break;

      //---------------------Payment
      case 'In 12 installments':
        apiShopItems = Object.values(apiShopItems).filter(obj1 => obj1.payment.includes('In 12 installments'));
        if (!objFilters.payment.includes('In 12 installments')) objFilters.payment = [...objFilters.payment, 'In 12 installments'];
        if (loadPreviousFilters) eventTarget = arrayInactiveBtns.filter(btn => btn.innerText == 'In 12 installments')[0];
        filtersEvents(eventTarget, objFilters, 'payment', 'In 12 installments');
        renderClearBtn(eventTarget, 'payment');
        break;

      case 'In 6 installments':
        apiShopItems = Object.values(apiShopItems).filter(obj1 => obj1.payment.includes('In 6 installments'));
        if (!objFilters.payment.includes('In 6 installments')) objFilters.payment = [...objFilters.payment, 'In 6 installments'];
        if (loadPreviousFilters) eventTarget = arrayInactiveBtns.filter(btn => btn.innerText == 'In 6 installments')[0];
        filtersEvents(eventTarget, objFilters, 'payment', 'In 6 installments');
        renderClearBtn(eventTarget, 'payment');
        break;

      case 'In cash':
        apiShopItems = Object.values(apiShopItems).filter(obj1 => obj1.payment.includes('In cash'));
        if (!objFilters.payment.includes('In cash')) objFilters.payment = [...objFilters.payment, 'In cash'];
        if (loadPreviousFilters) eventTarget = arrayInactiveBtns.filter(btn => btn.innerText == 'In cash')[0];
        filtersEvents(eventTarget, objFilters, 'payment', 'In cash');
        renderClearBtn(eventTarget, 'payment');
        break;

      //---------------------Promotions
      case 'Special offer':
        apiShopItems = Object.values(apiShopItems).filter(obj1 => obj1.promotion.includes('Special offer'));
        if (!objFilters.promotions.includes('Special offer')) objFilters.promotions = [...objFilters.promotions, 'Special offer'];
        if (loadPreviousFilters) eventTarget = arrayInactiveBtns.filter(btn => btn.innerText == 'Special offer')[0];
        filtersEvents(eventTarget, objFilters, 'promotions', 'Special offer');
        renderClearBtn(eventTarget, 'promotions');
        break;

      case 'New':
        apiShopItems = Object.values(apiShopItems).filter(obj1 => obj1.promotion.includes('New'));
        if (!objFilters.promotions.includes('New')) objFilters.promotions = [...objFilters.promotions, 'New'];
        if (loadPreviousFilters) eventTarget = arrayInactiveBtns.filter(btn => btn.innerText == 'New')[0];
        filtersEvents(eventTarget, objFilters, 'promotions', 'New');
        renderClearBtn(eventTarget, 'promotions');
        break;

      //---------------------Delivery
      case 'Free shipping':
        apiShopItems = Object.values(apiShopItems).filter(obj1 => obj1.hasFreeShipping);
        if (!objFilters.delivery.includes('Free shipping')) objFilters.delivery = [...objFilters.delivery, 'Free shipping'];
        if (loadPreviousFilters) eventTarget = arrayInactiveBtns.filter(btn => btn.innerText == 'Free shipping')[0];
        filtersEvents(eventTarget, objFilters, 'delivery', 'Free shipping');
        renderClearBtn(eventTarget, 'delivery');
        break;

      case 'Withdrawal in person':
        apiShopItems = Object.values(apiShopItems).filter(obj1 => !obj1.hasFreeShipping);
        if (!objFilters.delivery.includes('Withdrawal in person')) objFilters.delivery = [...objFilters.delivery, 'Withdrawal in person'];
        if (loadPreviousFilters) eventTarget = arrayInactiveBtns.filter(btn => btn.innerText == 'Withdrawal in person')[0];
        filtersEvents(eventTarget, objFilters, 'delivery', 'Withdrawal in person');
        renderClearBtn(eventTarget, 'delivery');
        break;

      //---------------------Price
      case '$0 - $10':
        apiShopItems = Object.values(apiShopItems).filter(obj1 => obj1.price > 0 && obj1.price <= 10);
        if (!objFilters.price.includes('$0 - $10')) objFilters.price = [...objFilters.price, '$0 - $10'];
        if (loadPreviousFilters) eventTarget = arrayInactiveBtns.filter(btn => btn.innerText == '$0 - $10')[0];
        filtersEvents(eventTarget, objFilters, 'price', '$0 - $10');
        renderClearBtn(eventTarget, 'price');
        break;

      case '$10 - $50':
        apiShopItems = Object.values(apiShopItems).filter(obj1 => obj1.price > 10 && obj1.price <= 50);
        if (!objFilters.price.includes('$10 - $50')) objFilters.price = [...objFilters.price, '$10 - $50'];
        if (loadPreviousFilters) eventTarget = arrayInactiveBtns.filter(btn => btn.innerText == '$10 - $50')[0];
        filtersEvents(eventTarget, objFilters, 'price', '$10 - $50');
        renderClearBtn(eventTarget, 'price');
        break;

      case '$50 - $100':
        apiShopItems = Object.values(apiShopItems).filter(obj1 => obj1.price > 50 && obj1.price <= 100);
        if (!objFilters.price.includes('$50 - $100')) objFilters.price = [...objFilters.price, '$50 - $100'];
        if (loadPreviousFilters) eventTarget = arrayInactiveBtns.filter(btn => btn.innerText == '$50 - $100')[0];
        filtersEvents(eventTarget, objFilters, 'price', '$50 - $100');
        renderClearBtn(eventTarget, 'price');
        break;

      case '$100+':
        apiShopItems = Object.values(apiShopItems).filter(obj1 => obj1.price > 100);
        if (!objFilters.price.includes('$100+')) objFilters.price = [...objFilters.price, '$100+'];
        if (loadPreviousFilters) eventTarget = arrayInactiveBtns.filter(btn => btn.innerText == '$100+')[0];
        filtersEvents(eventTarget, objFilters, 'price', '$100+');
        renderClearBtn(eventTarget, 'price');
        break;

    }

    if (item.startsWith('CustomPrice:')) {
      renderClearBtn(minPriceInput, 'customPrice');
      const bothPricesArray = item.split('-').map(string => string.replace(/\D/g, ''));
      apiShopItems = Object.values(apiShopItems).filter(obj1 => obj1.price >= bothPricesArray[0] && obj1.price <= bothPricesArray[1]);

      minPriceInput.value = bothPricesArray[0];
      maxPriceInput.value = bothPricesArray[1];
    }

    if (item.startsWith('CustomDiscount:')) {
      renderClearBtn(minDiscountInput, 'customDiscount');
      const bothDiscountsArray = item.split('-').map(string => string.replace(/\D/g, ''));
      apiShopItems = Object.values(apiShopItems).filter(obj1 => obj1.discount >= bothDiscountsArray[0] && obj1.discount <= bothDiscountsArray[1]);

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
    closeBtn.addEventListener('click', e => {
      e.stopPropagation();
      filterArray = JSON.parse(localStorage.getItem('filters')) || {...userFiltersBase};
      closeBtn.parentNode.removeChild(closeBtn);
      eventTarget.classList.remove('sel-primary');
      eventTarget.classList.add('sel-none');

      filterArray[filterArrayProp].splice(filterArray[filterArrayProp].indexOf(itemToRemove), 1);
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

function updateListing(loadPreviousFilters) {
  //we show the loading icon 
  document.querySelector('div.spinner-grow.text-secondary.my-2').classList.remove('d-none');
  fetchShopItems(loadPreviousFilters);
}

function renderClearBtn(eventTarget, propertyToDelete) {

  if (eventTarget) {

    const parentElem = eventTarget.closest('div');
    const childDivElem = eventTarget.closest('div').firstElementChild;
    const previouslyCreated = childDivElem.querySelector('div.col-md-3.text-end');

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

        filters[propertyToDelete] = [];

        const previousFilters = parentElem.querySelectorAll('.sel-primary .fa-times');
        for (let oldFilter of previousFilters) {
          const parent = oldFilter.closest('li');
          parent.removeChild(parent.lastChild);
          parent.firstElementChild.classList.remove('sel-primary');
          parent.firstElementChild.classList.add('sel-none');
        }

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
