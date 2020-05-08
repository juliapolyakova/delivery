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

let login = localStorage.getItem('delivery');

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

    buttonOut.removeEventListener('click', logOut);
    checkAuth();
    containerPromo.classList.remove('hide');
    restaurants.classList.remove('hide');
    menu.classList.add('hide');
  }

  userName.textContent = login;

  buttonAuth.style.display = 'none';
  userName.style.display = 'inline';
  buttonOut.style.display = 'block';
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
        <button class="button button-primary button-add-cart">
          <span class="button-card-text">В корзину</span>
          <span class="button-cart-svg"></span>
        </button>
        <strong class="card-price-bold">${price} ₽</strong>
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
  
  cartButton.addEventListener("click", toggleModal);
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

  checkAuth();



  new Swiper('.swiper-container', {
    loop: true,
    autoplay: {
      delay: 2000,
    },  
  })
}

init();