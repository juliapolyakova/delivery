'use strict';

const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const loginForm = document.querySelector('#logInForm');
const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const loginInput = document.querySelector('#login');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');
const loginError = document.querySelector('.login-error');
const cardsRestaurants = document.querySelector('.cards-restaurants');
const containerPromo = document.querySelector('.container-promo');
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const cardsMenu = document.querySelector('.cards-menu');
const restaurantTitle = document.querySelector('.restaurant-title');
const rating = document.querySelector('.rating');
const minPrice = document.querySelector('.price');
const category = document.querySelector('.category');
const inputSearch = document.querySelector('.input-search');
const modalBody = document.querySelector('.modal-body');
const modalPrice = document.querySelector('.modal-pricetag');
const clearCart = document.querySelector('.clear-cart');

let login = localStorage.getItem('delivery');

const cart = []; 

const getData = async function(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Error ${url}, status ${response.status}`);
  };

  return await response.json();
};


const valid = function(str) {
  const nameReg = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$ /;// нет латиницы
  
  return nameReg.test(str);
}
valid();

const toggleModal = function() {
  modal.classList.toggle("is-open");
}

function toggleModalAuth() {
  loginError.style.display = '';
  modalAuth.classList.toggle('is-open');
  
}

function authorised() {
  function logOut() {
    login = null;
    localStorage.removeItem('delivery');

    buttonAuth.style.display ='';
    userName.style.display = '';
    buttonOut.style.display = '';
    cartButton.style.display = '';

    buttonOut.removeEventListener('click', logOut);
    checkAuth();
    containerPromo.classList.remove('hide');
    restaurants.classList.remove('hide');
    menu.classList.add('hide');
  }

  userName.textContent = login;

  buttonAuth.style.display = 'none';
  userName.style.display = 'inline';
  buttonOut.style.display = 'flex';
  cartButton.style.display = 'flex';
  buttonOut.addEventListener('click', logOut);
}

function notAuthorised() {
  
  function logIn(event) {
    event.preventDefault();
    login = loginInput.value;
    if (!login) {
      loginError.style.display = 'block';
      return;
    }

    localStorage.setItem('delivery', login);
    toggleModalAuth();

    buttonAuth.removeEventListener('click', toggleModalAuth);
    closeAuth.removeEventListener('click', toggleModalAuth);
    loginForm.removeEventListener('submit', logIn)
    loginForm.reset();
    checkAuth();

  }

  buttonAuth.addEventListener('click', toggleModalAuth);
  closeAuth.addEventListener('click', toggleModalAuth);
  loginForm.addEventListener('submit', logIn)
}


function createCardRectaurant(restaurant) {
  const { image, kitchen, name, price, stars, products, 
    time_of_delivery: timeOfDelovery } = restaurant;

  const card = `
  <a class="card card-restaurant" data-products="${products}"
    data-info="${[name, price, stars, kitchen]}">
						<img src="${image}" alt="image" class="card-image"/>
						<div class="card-text">
							<div class="card-heading">
								<h3 class="card-title">${name}</h3>
								<span class="card-tag tag">${timeOfDelovery} мин</span>
							</div>
							<div class="card-info">
								<div class="rating">
									${stars}
								</div>
								<div class="price">От ${price} ₽</div>
								<div class="category">${kitchen}</div>
							</div>
						</div>
          </a>
        `;

  cardsRestaurants.insertAdjacentHTML('beforeend', card);
}

// открыват меню ресторана
function openGoods(event) {
  const target = event.target;
  const restaurant = target.closest('.card-restaurant');

  if (login) {
    if(restaurant) {
      const info = restaurant.dataset.info.split(',');
      const [ name, price, stars, kitchen ] = info;

      cardsMenu.textContent = '';

      containerPromo.classList.add('hide');
      restaurants.classList.add('hide');
      menu.classList.remove('hide');
 
      restaurantTitle.textContent = name;
      rating.textContent = stars;
      minPrice.textContent = `От ${price} ₽`;
      category.textContent = kitchen;

      getData(`./db/${restaurant.dataset.products}`).then(function(data) {
        data.forEach(createCardGood);
      });
      
    } 

  } else {
    toggleModalAuth();
  } 
}

function createCardGood(goods) {
  const { description, id, image, name, price } = goods;
  const card = document.createElement('div');
  card.className = 'card';

  card.insertAdjacentHTML('beforeend',  `
    <img src="${image}" alt="${name}" class="card-image"/>
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title card-title-reg">${name}</h3>
      </div>
      <div class="card-info">
        <div class="ingredients">${description}
        </div>
      </div>
      <div class="card-buttons">
        <button class="button button-primary button-add-cart" id="${id}">
          <span class="button-card-text">В корзину</span>
          <span class="button-cart-svg"></span>
        </button>
        <strong class="card-price card-price-bold">${price} ₽</strong>
      </div>
    </div>
  `);

  cardsMenu.insertAdjacentElement('beforeend', card);
}

function checkAuth() {
  if (login) {
    authorised();
  } else {
    notAuthorised();
  }
}

function addToCart(event) {
  const target = event.target;
  const buttonAddToCart = target.closest('.button-add-cart');
  
  if (buttonAddToCart) {
    const card = target.closest('.card');
    const title = card.querySelector('.card-title-reg').textContent;
    const cost = card.querySelector('.card-price').textContent;
    const id = buttonAddToCart.id;
    const food = cart.find(item => item.id === id);
    
    if (food) {
      food.count += 1;
    } else {
      cart.push({
        id,
        title,
        cost,
        count: 1
      });
    }   

  }

}

function renderCart() {
  modalBody.textContent = '';

  cart.forEach(function({ id, title, cost, count }) {
    const itemCart = `
      <div class="food-row">
        <span class="food-name">${title}</span>
        <strong class="food-price">${cost} </strong>
        <div class="food-counter">
          <button class="counter-button counter-minus" data-id=${id}>-</button>
          <span class="counter">${count}</span>
          <button class="counter-button counter-plus" data-id=${id}>+</button>
        </div>
      </div>
    `;
    modalBody.insertAdjacentHTML('afterbegin', itemCart);
  });

  const totalPrice = cart.reduce((result, item) => result + (parseFloat(item.cost)) * item.count, 0 );
  modalPrice.textContent = totalPrice + '₽';
}

function changeCount(event) {
  const target = event.target;

  if (target.classList.contains('counter-button')) {
    const food = cart.find(item => item.id === target.dataset.id);

    if (target.classList.contains('counter-minus')) {
      food.count--;
      if (food.count === 0) {
        cart.splice(cart.indexOf(food), 1);
      }
    }
    if (target.classList.contains('counter-plus')) food.count++;

    renderCart();
  }  

}


function init() {
  getData('./db/partners.json').then(function(data) {
    data.forEach(createCardRectaurant)
  });
  
  
  cardsRestaurants.addEventListener('click', openGoods);
  
  logo.addEventListener('click', function() {
    containerPromo.classList.remove('hide');
    restaurants.classList.remove('hide');
    menu.classList.add('hide');
  })
  
  cartButton.addEventListener("click", () => {
    renderCart();
    toggleModal();
  });

  clearCart.addEventListener('click', () => {
    cart.length = 0;
    renderCart();
  })

  close.addEventListener("click", toggleModal);
  
  inputSearch.addEventListener('keydown', (event) => {
    if (event.keyCode === 13) {
      const target = event.target;
      const goods = [];
      const value = target.value.toLowerCase().trim();
      if (!value) {
        target.style.backgroundColor = 'red';
        setTimeout(() => target.style.backgroundColor = '', 2000);
        return;
      }

      target.value = '';

      getData('./db/partners.json').then(function(data) {
        const products = data.map(item => item.products);
        
        products.forEach(function(product){
          getData(`./db/${product}`).then(function(data) {
          
          goods.push(...data);
          const searchGoods = goods.filter(item => item.name.toLowerCase().includes(value));

          cardsMenu.textContent = '';

          containerPromo.classList.add('hide');
          restaurants.classList.add('hide');
          menu.classList.remove('hide');
    
          restaurantTitle.textContent = 'Результат поиска';
          rating.textContent = '';
          minPrice.textContent = '';
          category.textContent = '';

          searchGoods.forEach(createCardGood);
          
          })
        })
      });
      
    }
  })

  cardsMenu.addEventListener('click', addToCart);

  modalBody.addEventListener('click', changeCount);

  checkAuth();



  new Swiper('.swiper-container', {
    loop: true,
    autoplay: {
      delay: 2000,
    },  
  })
}

init();