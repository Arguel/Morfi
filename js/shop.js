"use strict";
//-----------------------------------------------------------

//templates
const templateShopLi = document.getElementById('template-item-li').content;

//containers
const shopItems = document.getElementById('shop-items-display');
const cartMiniIcon = document.querySelector('span.position-absolute.top-0.start-100.translate-middle.badge.rounded-pill.bg-primary.h-pointer span');

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
})
shopItems.addEventListener('click', e => {
  addToCart(e);
  renderCartIcons(cart);
})


let apiShopItems;
const fetchShopItems = async () => {
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

    apiShopItems = filterResults(apiShopItems);
    console.log(apiShopItems);

    renderShopItems(apiShopItems);
    renderCartIcons(cart);
  } catch (error) {
    renderPageError(error);
  }
}

function renderPageError(error) {
  console.log(error);
  const errorContainer = document.createElement('h4');
  errorContainer.classList.add('text-center', 'm-4');
  errorContainer.textContent = 'Error while loading items.';
  fragment.appendChild(errorContainer);
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
  if (e.target.classList.contains('btn-primary')) {
    setToCart(e.target.closest(fullItemSelector));
  };
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

function filterResults(objCollection) {

  const filters = JSON.parse(localStorage.getItem('filters')) || {
    sortby: 'Featured', //Low to high, High to low
    region: 'North america', //United states, Europe, Global
    discount: 25, //50, 75, 100, customMinMax
    ratings: 1, //2, 3, 4
    payment: 'In 12 installments', //In 6 installments, In cash
    promotions: [
      'Special offer',
    ], //New
    delivery: 'Free shipping', //Withdrawal in person
    price: '$0 - $10', //customMinMax
  };

  for (const prop in filters) {
    objCollection = filtersHandler(filters[prop], filters, apiShopItems);
  }


  return objCollection;
}


function filtersHandler(item, objFilters, defaultArray) {

  switch (item) {

    //---------------------Sortby
    case 'Featured':
      apiShopItems = Object.values(apiShopItems).sort(obj1 => obj1.id);;
      objFilters.sortby = 'Featured';
      break;

    case 'Low to high':
      apiShopItems = Object.values(apiShopItems).sort((obj1, obj2) => obj1.price - obj2.price);
      objFilters.sortby = 'Low to high';
      break;

    case 'High to low':
      apiShopItems = Object.values(apiShopItems).sort((obj1, obj2) => obj2.price - obj1.price);
      objFilters.sortby = 'High to low';
      break;

    //---------------------Region
    case 'United states':
      apiShopItems = Object.values(apiShopItems).filter(obj1 => obj1.region === 'United states');
      objFilters.region = 'United states';
      break;

    case 'Europe':
      apiShopItems = Object.values(apiShopItems).filter(obj1 => obj1.region === 'Europe');
      objFilters.region = 'Europe';
      break;

    case 'Global':
      apiShopItems = Object.values(apiShopItems).filter(obj1 => obj1.region === 'Global');
      objFilters.region = 'Global';
      break;

    //---------------------Discount
    case '25%':
      apiShopItems = Object.values(apiShopItems).filter(obj1 => obj1.discount >= 25);
      objFilters.discount = '25%';
      break;

    case '50%':
      apiShopItems = Object.values(apiShopItems).filter(obj1 => obj1.discount >= 50);
      objFilters.discount = '50%';
      break;

    case '75%':
      apiShopItems = Object.values(apiShopItems).filter(obj1 => obj1.discount >= 75);
      objFilters.discount = '75%';
      break;

    case '100%':
      apiShopItems = Object.values(apiShopItems).filter(obj1 => obj1.discount >= 100);
      objFilters.discount = '100%';
      break;

    //---------------------Payment
    //case 'In 12 installments':
    //apiShopItems = Object.values(apiShopItems).filter(obj1 => obj1.payment === 'In 12 installments');
    //objFilters.payment = 'In 12 installments';
    //break;

    //case 'In 6 installments':
    //apiShopItems = Object.values(apiShopItems).filter(obj1 => obj1.payment === 'In 6 installments');
    //objFilters.payment = 'In 6 installments';
    //break;

    //case 'In cash':
    //apiShopItems = Object.values(apiShopItems).filter(obj1 => obj1.payment === 'In cash');
    //objFilters.payment = 'In cash';
    //break;

    //---------------------Promotions
    //case 'Special offer':
    //apiShopItems = Object.values(apiShopItems).filter(obj1 => obj1.promotions.includes('Special offer'));
    //objFilters.promotions = 'Special offer';
    //break;

    //case 'New':
    //apiShopItems = Object.values(apiShopItems).filter(obj1 => obj1.promotions.includes('New'));
    //objFilters.promotions = 'New';
    //break;

    //---------------------Delivery
    case 'Free shipping':
      apiShopItems = Object.values(apiShopItems).filter(obj1 => obj1.hasFreeShipping);
      objFilters.delivery = 'Free shipping';
      break;

    case 'Withdrawal in person':
      apiShopItems = Object.values(apiShopItems).filter(obj1 => !obj1.hasFreeShipping);
      objFilters.delivery = 'Withdrawal in person';
      break;

    //---------------------Price
    case '$0 - $10':
      apiShopItems = Object.values(apiShopItems).filter(obj1 => obj1.price > 0 && obj1.price <= 10);
      objFilters.price = '$0 - $10';
      break;

    case '$10 - $50':
      apiShopItems = Object.values(apiShopItems).filter(obj1 => obj1.price > 10 && obj1.price <= 50);
      objFilters.price = '$10 - $50';
      break;

    case '$50 - $100':
      apiShopItems = Object.values(apiShopItems).filter(obj1 => obj1.price > 50 && obj1.price <= 100);
      objFilters.price = '$50 - $100';
      break;

    case '$100+':
      apiShopItems = Object.values(apiShopItems).filter(obj1 => obj1.price > 100);
      objFilters.price = '$100+';
      break;

    //---------------------Buttons
    case 'Clean all filters':
      objFilters = ;
      break;

    default:
      localStorage.setItem('filters', JSON.stringify(objFilters));
  }

  console.log(apiShopItems);
  return apiShopItems;
}
