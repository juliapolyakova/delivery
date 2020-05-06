const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const loginForm = document.querySelector('#logInForm');


cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);

function toggleModal() {
  modal.classList.toggle("is-open");
}

//
const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const loginInput = document.querySelector('#login');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');
const loginError = document.querySelector('.login-error');

let login = localStorage.getItem('delivery');

function toggleModalAuth() {
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



function checkAuth() {
  if (login) {
    authorised();
  } else {
    notAuthorised();
  }
}

checkAuth();