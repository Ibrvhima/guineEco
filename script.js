'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

////////////////////////////////////////////////////////////////
const movementTypeDeposit = document.querySelector('.movements__type--deposit');
const somValue = document.querySelector('.movements__value');
const movementType = document.querySelectorAll('.movements__type');
const movementDate = document.querySelectorAll('.movements__date');
const movementRow = document.querySelector('.movements__row');
const defaultRow = document.querySelectorAll('.default_row');
const transferLabel = document.querySelector('.form__label');
const loanLabel = document.querySelector('.form__label--loan');
///////////////////////////////////////////////////////////////

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
let currentAccount;
let totalBalance;
function login(e) {
  e.preventDefault();
  console.log(inputLoginUsername.value);
  console.log(inputLoginPin.value);
  if (inputLoginUsername.value === '' || inputLoginPin.value === '') {
    labelWelcome.textContent = 'Veuillez remplir tous les champs !';
  } else {
    const checkedId = accounts.find(account => {
      return (
        account.owner.toLowerCase() === inputLoginUsername.value.toLowerCase()
      );
    });
    console.log(checkedId);
    if (checkedId?.pin === Number(inputLoginPin.value)) {
      labelWelcome.textContent = `Bienvenue ${checkedId.owner}`;
      containerApp.classList.remove('hidden');
      inputLoginUsername.value = inputLoginPin.value = '';
      currentAccount = checkedId;
      displayMovements(currentAccount.movements);
      calcDisplayBalance();
      calcDisplaySummary();
    } else {
      labelWelcome.textContent = 'Nom d’utilisateur ou PIN incorrect';
    }
  }
}

btnLogin.addEventListener('click', login);
//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////

function displayMovements(arr) {
  containerMovements.innerHTML = '';
  arr.forEach((element, idx) => {
    let type = element > 0 ? 'deposit' : 'withdrawal';
    let typeText = type === 'deposit' ? 'Dépot' : 'Rétrait';
    containerMovements.insertAdjacentHTML(
      'beforeend',
      `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
        idx + 1
      } ${typeText}</div>
        <div class="movements__date">Il y a 3 jours</div>
        <div class="movements__value">${element}€</div>
      </div>
      `
    );
  });
}

/////////////////////////////////////////////////////////////

function sorted() {
  if (currentAccount) {
    currentAccount.movements.sort((a, b) => b - a);
    displayMovements(currentAccount.movements);
  }
}

btnSort.addEventListener('click', sorted);

/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////

function calcDisplayBalance() {
  const balance = currentAccount.movements.reduce(
    (sum, current) => sum + current
  );

  totalBalance = balance;
  labelBalance.textContent = `${balance}€`;
}

//////////////////////////////////////////////////////////////

function calcDisplaySummary() {
  const deposits = currentAccount.movements
    .filter(mov => mov > 0)
    .reduce((sum, current) => sum + current, 0);
  labelSumIn.textContent = `+${deposits}€`;

  const withdrawals = currentAccount.movements
    .filter(mov => mov < 0)
    .reduce((sum, current) => sum + current, 0);
  labelSumOut.textContent = `${withdrawals}€`;

  const rate = currentAccount.interestRate;

  const interestTotal = currentAccount.movements
    .map(current => current * rate)
    .filter(current => current >= 1)
    .reduce((sum, current) => sum + current, 0);

  labelSumInterest.textContent = `+${interestTotal}€`;
  console.log(interestTotal);
}

//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
function sendMoney(e) {
  e.preventDefault();
  const amount = inputTransferAmount.value;
  const checkRecipient = accounts.find(
    recipient => recipient.owner === inputTransferTo.value
  );
  if (checkRecipient) {
    if (amount > 0 && amount <= totalBalance) {
      checkRecipient.movements.push(amount * 1);
      currentAccount.movements.push(amount * -1);
      displayMovements(currentAccount.movements);
      calcDisplaySummary();
      calcDisplayBalance();
      transferLabel.classList.remove('red');
      transferLabel.textContent = 'Transfert effectué avec succès';
      inputTransferTo.value = inputTransferAmount.value = '';
    } else {
      transferLabel.textContent = 'Solde insuffisant !!';
    }
  } else {
    transferLabel.textContent = 'Destinataire introuvable';
  }
}

btnTransfer.addEventListener('click', sendMoney);

//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////

function requestLoan(e) {
  e.preventDefault();
  const requestAmount = inputLoanAmount.value;
  const checkAmount = currentAccount.movements.find(
    amount => amount >= (requestAmount * 10) / 100
  );
  if (requestAmount > 0) {
    if (checkAmount) {
      currentAccount.movements.push(requestAmount * 1);
      displayMovements(currentAccount.movements);
      calcDisplaySummary();
      calcDisplayBalance();
      inputLoanAmount.value = '';
      loanLabel.textContent = 'Prêt effectué avec succès'.classList.remove(
        'red'
      );
    } else {
      loanLabel.textContent = 'Montant élévé';
    }
  } else {
    loanLabel.textContent = 'Montant invalide';
  }
}

btnLoan.addEventListener('click', requestLoan);

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////

function closeAccount(e) {
  e.preventDefault();
  const index = accounts.indexOf(currentAccount);
  if (
    inputCloseUsername.value === currentAccount.owner &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    accounts.splice(index, 1);
    containerApp.classList.add('hidden');
    labelWelcome.textContent = 'Connectez-vous pour commencer';
    alert(`${inputCloseUsername.value} est retiré avec succès `)
  } else {
    alert('les information ne correspondent pas');
  }
}

btnClose.addEventListener('click', closeAccount);

////////////////////////////////////////////////////////////////////

let timer;


function startLogoutTimer() {
  let time = 300; 
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, '0');
    const sec = String(time % 60).padStart(2, '0');

    labelTimer.textContent = `${min}:${sec}`;
    if (time === 0) {
      clearInterval(timer);
      alert('Vous avez été déconnecté(e) pour cause d’inactivité.');

      containerApp.classList.add('hidden');
    }
    time--;
  };

  // Exécuter la fonction tick toutes les secondes
  tick(); // Appeler immédiatement pour afficher la première mise à jour
  timer = setInterval(tick, 1000); // Appeler tick toutes les 1 seconde
};

