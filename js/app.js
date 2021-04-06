"use strict";

// future implementation of an api request
const apiShopItems = [
  {
    "price": 22.00,
    "id": 1,
    "title": "Polenta Squares with Gorgonzola and Pine Nuts",
    "thumnailUrl": "../../img/shop/shop/polenta-squares-with-gorgonzola-and-pine-nuts.webp",
    "hasDiscount": true,
    "discount": 50,
    "promotion": [
      "50% off"
    ],
    "description": "Instead of crostini, try gluten-free polenta squares as the base for a variety of toppings. Creamy polenta becomes perfectly firm once chilled; it will hold its shape when sliced and seared. The result is a golden brown crust outside and a creamy, not rubbery, texture inside. We top ours with a funky Gorgonzola cheese, balsamic reduction, faintly sweet dried currants, and pine nuts. You could substitute chopped dried figs or cranberries for the currants, or come up with your own flavor combo. Try diced marinated tomato and basil, sautéed mushrooms and garlic, or more substantial shredded pork shoulder."
  },
  {
    "price": 103.25,
    "id": 2,
    "title": "Maple-Sesame Cauliflower Bites",
    "thumnailUrl": "../../img/shop/shop/maple-sesame-cauliflower-bites.webp",
    "hasDiscount": false,
    "discount": 0,
    "promotion": [],
    "description": "Chickpea flour is gluten-free, protein packed, and makes an incredibly light batter for baked cauliflower. Look for it near the other gluten-free flours at your local health food store. Tamari is a slightly thicker, wheat-free alternative to soy sauce with a more robust flavor. These bites can double as an appetizer or side dish served with grilled fish or baked chicken."
  },
  {
    "price": 77.99,
    "id": 3,
    "title": "Double-Serrano Watermelon Bites",
    "thumnailUrl": "../../img/shop/shop/double-serrano-watermelon-bites.webp",
    "hasDiscount": false,
    "discount": 0,
    "promotion": [
      "Special offer"
    ],
    "description": "These bites are a step up from classic prosciutto-wrapped melon and provide sweet, spicy, salty, tart, and meaty tastes. If you can’t find serrano ham, use prosciutto; you also can use balsamic glaze in place of pomegranate molasses."
  },
  {
    "price": 98.00,
    "id": 4,
    "title": "Smoked Salmon Bites",
    "thumnailUrl": "../../img/shop/shop/smoked-salmon-bites.webp",
    "hasDiscount": false,
    "discount": 0,
    "promotion": [],
    "description": "If you're looking for an appetizer that will delight your guests with its gorgeous presentation and rich, delicious taste, the search stops here. These beautiful canapés start with a base of candy cane (or Chioggia) beet squares, whose alternating ruby and white rings are stunning. (You can add more color to the platter by alternating candy cane beet and golden beet slices.) The beet stays raw, so the slices are crunchy and sweet and hold up nicely. The jewel-like topping of easy-to-find salmon caviar turns what's truly a simple make-ahead nibble into an absolute work of art that'll make you the talk of your social circle."
  },
  {
    "price": 109.00,
    "id": 5,
    "title": "French Onion Dip With Sweet Potato Chips",
    "thumnailUrl": "../../img/shop/shop/french-onion-dip-with-sweet-potato-chips.webp",
    "hasDiscount": false,
    "discount": 0,
    "promotion": [],
    "description": "With big flavor and less heft, our healthier ode to the classic French onion dip is a delicious way to sneak in extra vegetables. Ditch the sodium-bomb seasoning packets and sour cream-and-mayonnaise–laden dip (which can pack a small meal’s worth of calories and sat fat into a single serving) for our homemade dip. And be patient with the caramelizing process—slowly sizzled onions have noteworthy sweetness and concentrated umami. And because no dip is complete without a dipper, baked sweet potatoes will satisfy your chip craving for half the calories of most bagged varieties."
  },
  {
    "price": 89.99,
    "id": 6,
    "title": "Roasted Banana Bars with Browned Butter–Pecan Frosting",
    "thumnailUrl": "../../img/shop/shop/roasted-banana-bars-with-browned-butter–pecan-frosting.webp",
    "hasDiscount": false,
    "discount": 0,
    "promotion": [],
    "description": "Put those ripe, speckled bananas to good use. This dish starts with roasting bananas which adds caramelized notes to their tropical sweetness. The bananas flavor the light-and-fluffy bars, which are topped with cream cheese icing and chopped pecans for the perfect amount of tanginess and crunch."
  },
  {
    "price": 25.80,
    "id": 7,
    "title": "Texas Sheet Cake",
    "thumnailUrl": "../../img/shop/shop/texas-sheet-cake.webp",
    "hasDiscount": false,
    "discount": 0,
    "promotion": [],
    "description": "This recipe uses butter and buttermilk in quantities that give it the right indulgently moist texture and rich flavor, but keep a serving's fat at just 10 grams and calories at about 300."
  },
  {
    "price": 50.00,
    "id": 8,
    "title": "Espresso Crinkles",
    "thumnailUrl": "../../img/shop/shop/espresso-crinkles.webp",
    "hasDiscount": true,
    "discount": 20,
    "promotion": [
      "New",
      "20% off"
    ],
    "description": "Unsweetened chocolate and instant espresso powder give depth of flavor to these sophisticated cookies. A dredge in powdered sugar before baking ensures sweetness, and also gives them a unique cracked surface and snow-covered look."
  },
  {
    "price": 40.73,
    "id": 9,
    "title": "Vanilla Cheesecake with Cherry Topping",
    "thumnailUrl": "../../img/shop/shop/vanilla-cheesecake-with-cherry-topping.webp",
    "hasDiscount": false,
    "discount": 0,
    "promotion": [
      "Special offer"
    ],
    "description": "In this rich cheesecake, we use the entire vanilla bean, so none of it is wasted: The seeds flavor the cheesecake, and the bean halves flavor the topping."
  },
  {
    "price": 90.14,
    "id": 10,
    "title": "Amaretto Apple Streusel Cupcakes",
    "thumnailUrl": "../../img/shop/shop/amaretto-apple-streusel-cupcakes.webp",
    "hasDiscount": false,
    "discount": 0,
    "promotion": [],
    "description": "Top tender apple cupcakes with a sweet and crunchy topping of brown sugar and almonds, then drizzle with a powdered sugar glaze. The amaretto adds an even more distinct almond flavor to the cupcakes, but if you don't have it, you can use almond extract instead."
  },
  {
    "price": 47.80,
    "id": 11,
    "title": "Salted Caramel Ice Cream",
    "thumnailUrl": "../../img/shop/shop/salted-caramel-ice-cream.webp",
    "hasDiscount": false,
    "discount": 0,
    "promotion": [],
    "description": "It's hard to beat the sweet-salty goodness of this indulgent yet light caramel ice cream. Light ice cream has evolved from its watery ice-milk days and in the Test Kitchen, we like to get creative with ingredients and flavors, but we hold fast to settling for nothing less than smooth, creamy, rich results."
  },
  {
    "price": 75.89,
    "id": 12,
    "title": "Tiramisu",
    "thumnailUrl": "../../img/shop/shop/tiramisu.webp",
    "hasDiscount": false,
    "discount": 0,
    "promotion": [],
    "description": "Tiramisu is Italian for 'lift me up.' And its indulgent creamy, mocha-tinged flavor is indeed uplifting. With layers of ladyfingers, coffee, mascarpone cheese, and shaved or grated chocolate, traditional tiramisu is a cross between a trifle and bread pudding. Our lightened version is less than 300 calories per serving, and makes for a sophisticated dinner-party treat."
  },
  {
    "price": 30.53,
    "id": 13,
    "title": "Rum-Spiked Grilled Pineapple with Toasted Coconut",
    "thumnailUrl": "../../img/shop/shop/rum-spiked-grilled-pineapple-with-toasted-coconut.webp",
    "hasDiscount": false,
    "discount": 0,
    "promotion": [
      "Special offer"
    ],
    "description": "Perfect for a backyard cookout with friends, just six ingredients make one delicious dessert in less than 10 minutes. Grilling caramelizes the sugars in the fruit for a light treat that is delicious on its own or served with low-fat vanilla ice cream."
  },
  {
    "price": 60.00,
    "id": 14,
    "title": "Carrot Cake",
    "thumnailUrl": "../../img/shop/shop/carrot-cake.webp",
    "hasDiscount": true,
    "discount": 80,
    "promotion": [
      "80% off"
    ],
    "description": "This lighter twist on traditional carrot cake features a tender cake packed with grated carrot, juicy pineapple, flaked coconut, and chopped pecans. Cream cheese frosting and a garnish of grated carrot tops the cake."
  },
  {
    "price": 3.00,
    "id": 15,
    "title": "Chicken Sandwich",
    "thumnailUrl": "../../img/shop/shop/chicken-sandwich.webp",
    "hasDiscount": false,
    "discount": 0,
    "promotion": [],
    "description": "The perfect combination of a generous portion of breaded chicken, soft bun, and tart pickles, it's enhanced by only one thing: Polynesian sauce."
  },
  {
    "price": 38.41,
    "id": 16,
    "title": "Cheesy Gordita Crunch",
    "thumnailUrl": "../../img/shop/shop/cheesy-gordita-crunch.webp",
    "hasDiscount": false,
    "discount": 0,
    "promotion": [],
    "description": "An effective fast-food experience hinges on texture. Mouthfeel. Most fast food is rough and salty or mushy and gelatinous. But rarely the twain shall meet in one package."
  }
];

//-----------------------------------------------------------

const items = document.getElementById('shop-items-display');
const templateLi = document.getElementById('template-item-li').content;
const fragment = document.createDocumentFragment();
let cart = {};

document.addEventListener('DOMContentLoaded', () => {
  fetchShopItems();
})
items.addEventListener('click', e => {
  addToCart(e);
})

const fetchShopItems = async () => {
  try {
    //const res = await fetch('shop items');
    //const data = await res.json();
    renderShopItems(apiShopItems);
  } catch (error) {
    console.log(error);
    items.innerHTML = '<h4 class="text-center m-4">Error while loading items.</h4>';
  }
}


function renderShopItems(arrayItems) {

  let createdDiv = false;

  function createSubContainer() {
    const divContainer = document.createElement('div');
    divContainer.classList.add('text-break', 'd-flex', 'align-items-center');
    createdDiv = true;
    return divContainer;
  }

  arrayItems.forEach(product => {
    //image
    const productImage = templateLi.querySelector('img');
    const altAttribute = product.title.toLowerCase().replaceAll(" ", "-");
    productImage.setAttribute("src", product.thumnailUrl);
    productImage.setAttribute("alt", altAttribute);
    //title
    templateLi.querySelector('h5 a').textContent = product.title;
    //final price
    templateLi.querySelector('div.ff-mont-6.text-break').textContent = `$${(product.price - product.price * product.discount / 100).toFixed(2)}`;

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
      templateLi.querySelector('div.overflow-hidden.text-truncate-2').appendChild(divContainer);
    }

    //description
    templateLi.querySelector('div.text-truncate').textContent = product.description;

    //add to cart button
    templateLi.querySelector('.btn-primary').dataset.id = product.id;

    //we clone the template because there can only be one
    const clone = templateLi.cloneNode(true);
    fragment.appendChild(clone);

    //check if the discounts/promotions container was created, and if it was created, it will delete it so it is not added to all items and only applies to the necessary ones
    if (createdDiv) {
      const mainContainer = templateLi.querySelector('div.overflow-hidden.text-truncate-2');
      mainContainer.removeChild(mainContainer.lastChild); //here we remove the new child that we create "divContainer"
      createdDiv = false; //it is important to reset the variable
    }
  })
  items.appendChild(fragment);
}

function addToCart(e) {
  if (e.target.classList.contains('btn-primary')) {
    setToCart(e.target.parentElement.parentElement);
  };
  e.stopPropagation();
}

function setToCart(parentItem) {
  const product = {
    id: parentItem.querySelector('.btn-primary').dataset.id,
    title: parentItem.querySelector('h5 a').textContent,
    finalPrice: parentItem.querySelector('div.ff-mont-6.text-break').textContent,
    amount: 1,
  }
  if (cart.hasOwnProperty(product.id)) {
    product.amount = cart[product.id].amount + 1;
  }
  cart[product.id] = {...product};
  console.log(cart);
}













