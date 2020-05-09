// ICON/BUTTON SELECTORS
const closeCartBtn = document.getElementById('close-cart-btn');
const cartIcon = document.getElementById('cart-icon');
const navToggle = document.getElementById('nav-toggle');
const checkout = document.getElementById('checkout');
const clearBtn = document.getElementById('clear-btn');
const finalClear = document.getElementById('final-clear');
const finalCheckout = document.getElementById('final-checkout');

// IMAGE

const itemImage = [...document.querySelectorAll('.item-image')];

// DOM SELECTORS
const cartContainer = document.getElementById('cart-container');
const cartItems = document.getElementById('cart-items');
const hamMenu = document.getElementById('ham-menu');
const galleryContainer = document.getElementById('gallery-container');
const numItemsInCart = document.getElementById('num-items-in-cart');
let cartTotalPrice = document.getElementById('cart-total-price');

// GET GALLERY DATA

let cartTotalGlobal = 0;
let cartGlobal = [];
let numberCartItems = cartGlobal.length;
let changeCartItems = 0;
let changeCartTotal = 0;
let numItemsRemoved = 0;
let accumeRemoved = 0;
let totalToRemove = 0;

getGalleryData();

async function getGalleryData() {
  const res = await fetch('products.json');
  const data = await res.json();

  //   SET EACH DATA ITEM TO GALLERY ITEM IN HTML

  data.items.map((item, index) => {
    galleryContainer.innerHTML += `
      <div class="item">
            <div class="item-image" id=${index + 1}>
              <img
                src=${item.image}
                alt=""
              />
              <button class="add-to-cart hidden" id="${index + 1}">
                Add to Cart
              </button>
            </div>
            <div class="description">
              <p class="item-title">${item.title}</p>
              <p class="item-price">$${item.price}</p>
            </div>
          </div>
      `;
  });

  addToCartBtns = [...document.querySelectorAll('.add-to-cart')];

  showItemsInCart(data.items, addToCartBtns);
  //   showTotal(data.items, addToCartBtns);
  addItemToLS(data.items);
  addLSToCart(data.items);
  clearCart(data.items, addToCartBtns);
}

// CLEAR CART

function clearCart(data, btns) {
  clearBtn.addEventListener('click', () => {
    data.map(item => {
      localStorage.removeItem(item.title);
      document.getElementById('cart-items').innerHTML = '';
      document.getElementById('cart-total-price').innerHTML = '$0.00';
      numItemsInCart.innerText = 0;
      cartTotalGlobal = 0;
      cartGlobal = [];
      changeCartItems = 0;
      changeCartTotal = 0;
      btns.map(btn => {
        btn.disabled = false;
        btn.innerText = 'Add to Cart';
      });
    });
  });
  finalClear.addEventListener('click', () => {
    data.map(item => {
      localStorage.removeItem(item.title);
      document.getElementById('cart-items').innerHTML = '';
      document.getElementById('cart-total-price').innerHTML = '$0.00';
      numItemsInCart.innerText = 0;
      cartTotalGlobal = 0;
      cartGlobal = [];
      changeCartItems = 0;
      changeCartTotal = 0;
      btns.map(btn => {
        btn.disabled = false;
        btn.innerText = 'Add to Cart';
      });
    });
  });
}

// ADD ITEMS(PRODUCTS) TO LOCAL STORAGE

function addItemToLS(data) {
  addToCartBtns.map(btn => {
    btn.addEventListener('click', e => {
      data.map(item => {
        if (item.id === e.target.id) {
          localStorage.setItem(`${item.title}`, JSON.stringify(item));
        }
      });
    });
  });
}

function addLSToCart(data) {
  let cart = [];

  data.map(item => {
    if (item.title in localStorage && !cart.includes(item)) {
      cart.push(JSON.parse(localStorage.getItem(`${item.title}`)));
    }
  });
  cartGlobal = cart;

  displayItemsInCart(cartGlobal, addToCartBtns);
  numItemsInCart.innerText = cart.length;
}

// CART DOM FUNCTIONALITY AFTER RELOAD

function displayItemsInCart(cart, btns) {
  let totalCart = 0;

  cart.map(item => {
    cartItems.innerHTML += `
        <div class="cart-item" id=${item.id}>
        <div class="item-image-cart">
        <img
        src=${item.image}
        alt=""
      />
        </div>
        <div class="item-info">
          <div class="item-title">${item.title}</div>
          <div class="item-price-cart">$${item.price}</div>
          <div class="remove-item" id=${item.id}>remove</div>
        </div>
        <div class="amount-select">
          <i class="amount-icon fas fa-chevron-up" id="up-${item.id}"></i>
          <span class="amount-number" id=${item.id}>${item.amount}</span>
          <i class="amount-icon fas fa-chevron-down" id="down-${item.id}"></i>
        </div>
      </div>
        `;

    // DISABLE BUTTONS IF ITEM IS IN CART

    cart.map(item => {
      btns.map(btn => {
        if (btn.id === item.id) {
          btn.innerHTML = `<i class='fas fa-check'></i> In Cart`;
          btn.disabled = true;
        }
      });
    });

    // ON CLICK OF REMOVE BUTTON IMEDIATELY DELETES FROM LS --- REMOVES FROM DOM AFTER INITIAL RELOAD

    let removeItems = [...document.querySelectorAll('.remove-item')];
    let productsInCart = [...document.querySelectorAll('.cart-item')];
    removeItems.map(remove => {
      remove.addEventListener('click', e => {
        numItemsInCart.innerText = parseInt(numItemsInCart.innerText) - 1;
        productsInCart.map(product => {
          if (product.id === e.target.id) {
            product.innerHTML = '';
            console.log(numberCartItems);
          }
        });
        cartGlobal.map(item => {
          if (e.target.id === item.id) {
            localStorage.removeItem(item.title);
            amountNum.map(amount => {
              if (amount.id === e.target.id) {
                let removeAmount =
                  parseInt(amount.innerText) * parseFloat(item.price);
                console.log(cartTotalGlobal);
                cartTotalGlobal -= removeAmount;
                cartTotalPrice.innerText =
                  '$' + Math.abs(cartTotalGlobal.toFixed(2));
              }
            });
          }
        });
        btns.map(btn => {
          if (btn.id === e.target.id) {
            btn.disabled = false;
            btn.innerHTML = `Add to Cart`;
          }
        });
      });
    });

    // SETS CART ITEM AMOUNT AFTER PAGE IS RELOADED

    let amountSelect = [...document.querySelectorAll('.amount-select')];
    let amountNum = [...document.querySelectorAll('.amount-number')];
    amountSelect.map(i => {
      i.addEventListener('click', e => {
        cartGlobal.map(item => {
          amountNum.map(num => {
            if (num.id === item.id) {
              amount = num;
            }
          });

          if (
            e.target.id === `up-${item.id}` &&
            parseInt(amount.innerText) <= 9
          ) {
            // SET AMOUNTS TO LOCAL STORAGE / DISPLAYED ON RELOAD
            cartTotalGlobal += item.price;
            console.log(cartTotalGlobal);
            document.getElementById(
              'cart-total-price'
            ).innerHTML = cartTotalGlobal.toFixed(2);
            let itemTarget = JSON.parse(localStorage.getItem(item.title));
            itemTarget.amount += 1;
            localStorage.setItem(item.title, JSON.stringify(itemTarget));
            amount.innerText = itemTarget.amount;
          }
          if (
            e.target.id === `down-${item.id}` &&
            parseInt(amount.innerText) > 0
          ) {
            // SET AMOUNTS TO LOCAL STORAGE / DISPLAYED ON RELOAD
            cartTotalGlobal -= item.price;
            document.getElementById(
              'cart-total-price'
            ).innerHTML = cartTotalGlobal.toFixed(2);
            let itemTarget = JSON.parse(localStorage.getItem(item.title));
            itemTarget.amount -= 1;
            localStorage.setItem(item.title, JSON.stringify(itemTarget));
            amount.innerText = itemTarget.amount;
          }
        });
      });
    });

    totalCart += item.amount * item.price;
    cartTotalPrice.innerText = '$' + totalCart.toFixed(2);
    cartTotalGlobal = totalCart;
  });
}

// EVENT LISTENERS

// OPEN CART EVENTS / ANIMATION

checkout.addEventListener('click', () => {
  cartContainer.classList.remove('slide-out');
  cartContainer.classList.add('show-cart');
  setTimeout(() => {
    cartContainer.classList.add('slide-in');
  }, 100);
});

cartIcon.addEventListener('click', () => {
  cartContainer.classList.remove('slide-out');
  cartContainer.classList.add('show-cart');
  setTimeout(() => {
    cartContainer.classList.add('slide-in');
  }, 100);
});

closeCartBtn.addEventListener('click', () => {
  cartContainer.classList.add('slide-out');
  setTimeout(() => {
    cartContainer.classList.remove('show-cart');
  }, 400);
});

// CART DOM FUNTIONALITY

function showItemsInCart(data, btns) {
  btns.map(btn =>
    btn.addEventListener('click', e => {
      e.target.disabled = true;
      e.target.innerHTML = `<i class='fas fa-check'></i> In Cart`;
      changeCartItems += 1;
      numItemsInCart.innerText = parseInt(numItemsInCart.innerText) + 1;
      clearBtn.addEventListener('click', () => {
        changeCartItems = 0;
      });

      data.map(item => {
        if (item.id === e.target.id) {
          // WHAT IS CART TOTAL AT THIS PONT?
          changeCartTotal += item.price;
          totalToRemove = cartTotalGlobal + changeCartTotal;
          cartTotalPrice.innerText =
            '$' + (cartTotalGlobal + changeCartTotal).toFixed(2);
          cartItems.innerHTML += `
              <div class="cart-item" id=${item.id}>
              <div class="item-image-cart">
              <img
              src=${item.image}
              alt=""
            />
              </div>
              <div class="item-info">
                <div class="item-title">${item.title}</div>
                <div class="item-price-cart">$${item.price}</div>
                <div class="remove-item" id=${item.id}>remove</div>
              </div>
              <div class="amount-select">
              <i class="amount-icon fas fa-chevron-up" id="up-${item.id}"></i>
              <span class="amount-number" id=${item.id}>${item.amount}</span>
              <i class="amount-icon fas fa-chevron-down" id="down-${item.id}"></i>
              </div>
            </div>
              `;
          let removeItems = [...document.querySelectorAll('.remove-item')];
          let productsInCart = [...document.querySelectorAll('.cart-item')];
          removeItems.map(remove => {
            remove.addEventListener('click', e => {
              numItemsInCart.innerText = parseInt(numItemsInCart.innerText) - 1;
              productsInCart.map(product => {
                if (product.id === e.target.id) {
                  product.innerHTML = '';
                }
              });
              data.map(item => {
                if (e.target.id === item.id) {
                  localStorage.removeItem(item.title);

                  amountNum.map(amount => {
                    if (amount.id === e.target.id && cartTotalGlobal === 0) {
                      let removeAmount =
                        parseInt(amount.innerText) * parseFloat(item.price);

                      changeCartTotal -= removeAmount;
                      cartTotalPrice.innerText =
                        '$' + Math.abs(changeCartTotal.toFixed(2));
                    }
                    if (amount.id === e.target.id && cartTotalGlobal > 0) {
                      let removeAmount =
                        parseInt(amount.innerText) * parseFloat(item.price);
                      totalToRemove -= removeAmount;
                      changeCartTotal -= removeAmount;
                      //   let display = cartTotalPrice.innerHTML;
                      console.log(totalToRemove);
                      cartTotalPrice.innerText =
                        '$' + Math.abs(totalToRemove.toFixed(2));
                    }
                  });
                }
              });
              btns.map(btn => {
                if (btn.id === e.target.id) {
                  btn.disabled = false;
                  btn.innerHTML = 'Add to Cart';
                }
              });
            });
          });

          //   SET ITEM AMOUNTS ON ITITIAL DOM ITEM SELECT
          let amountSelect = [...document.querySelectorAll('.amount-select')];
          let amountNum = [...document.querySelectorAll('.amount-number')];
          amountSelect.map(i => {
            i.addEventListener('click', e => {
              data.map(item => {
                amountNum.map(num => {
                  if (num.id === item.id) {
                    amount = num;
                  }
                });

                if (
                  e.target.id === `up-${item.id}` &&
                  parseInt(amount.innerText) <= 9 &&
                  cartTotalGlobal === 0
                ) {
                  changeCartTotal += item.price;
                  document.getElementById(
                    'cart-total-price'
                  ).innerHTML = Math.abs(changeCartTotal.toFixed(2));
                  let itemTarget = JSON.parse(localStorage.getItem(item.title));
                  itemTarget.amount += 1;
                  localStorage.setItem(item.title, JSON.stringify(itemTarget));
                  amount.innerText = itemTarget.amount;
                }

                if (
                  e.target.id === `up-${item.id}` &&
                  parseInt(amount.innerText) <= 9 &&
                  cartTotalGlobal > 0
                ) {
                  changeCartTotal += item.price;
                  totalToRemove += item.price;
                  let display = changeCartTotal + cartTotalGlobal;
                  document.getElementById(
                    'cart-total-price'
                  ).innerHTML = Math.abs(display.toFixed(2));
                  let itemTarget = JSON.parse(localStorage.getItem(item.title));
                  itemTarget.amount += 1;
                  localStorage.setItem(item.title, JSON.stringify(itemTarget));
                  amount.innerText = itemTarget.amount;
                }

                if (
                  e.target.id === `down-${item.id}` &&
                  parseInt(amount.innerText) > 0 &&
                  cartTotalGlobal === 0
                ) {
                  changeCartTotal -= item.price;
                  let display = changeCartTotal + cartTotalGlobal;
                  document.getElementById(
                    'cart-total-price'
                  ).innerHTML = Math.abs(display.toFixed(2));
                  let itemTarget = JSON.parse(localStorage.getItem(item.title));
                  itemTarget.amount -= 1;
                  localStorage.setItem(item.title, JSON.stringify(itemTarget));
                  amount.innerText = itemTarget.amount;
                }
                if (
                  e.target.id === `down-${item.id}` &&
                  parseInt(amount.innerText) > 0 &&
                  cartTotalGlobal > 0
                ) {
                  changeCartTotal -= item.price;
                  totalToRemove -= item.price;
                  let display = changeCartTotal + cartTotalGlobal;
                  document.getElementById(
                    'cart-total-price'
                  ).innerHTML = Math.abs(display.toFixed(2));
                  let itemTarget = JSON.parse(localStorage.getItem(item.title));
                  itemTarget.amount -= 1;
                  localStorage.setItem(item.title, JSON.stringify(itemTarget));
                  amount.innerText = itemTarget.amount;
                }
              });
            });
          });
        }
      });
    })
  );
}

// HAM MENU HOVER ANIMATION

navToggle.addEventListener('mouseover', () => {
  hamMenu.classList.remove('hide-ham-menu');
  hamMenu.classList.add('show-ham-menu');
});

hamMenu.addEventListener('mouseleave', () => {
  hamMenu.classList.add('hide-ham-menu');
});

navToggle.addEventListener('click', () => {
  if (hamMenu.classList.contains('show-ham-menu')) {
    hamMenu.classList.remove('show-ham-menu');
    hamMenu.classList.add('hide-ham-menu');
  } else {
    hamMenu.classList.remove('hide-ham-menu');
    hamMenu.classList.add('show-ham-menu');
  }
});

// CHECKOUT BTN

final = document.getElementById('checkout-cart-btn');

final.addEventListener('click', () => {
  if (parseInt(numItemsInCart.innerText) > 0) {
    addToCartBtns = [...document.querySelectorAll('.add-to-cart')];
    addToCartBtns.map(btn => {
      btn.disabled = true;
    });
    let downBtns = [...document.querySelectorAll('.fa-chevron-down')];
    downBtns.map(i => {
      i.style.display = 'none';
    });
    let upBtns = [...document.querySelectorAll('.fa-chevron-up')];
    upBtns.map(i => {
      i.style.display = 'none';
    });

    letRemoves = [...document.querySelectorAll('.remove-item')];
    letRemoves.map(remove => {
      console.log(remove);
      remove.style.display = 'none';
    });

    final.style.display = 'none';
    clearBtn.style.display = 'none';
    finalCheckout.style.display = 'block';
    finalClear.style.display = 'block';

    finalClear.addEventListener('click', () => {
      addToCartBtns.map(btn => {
        btn.disabled = false;
      });
      finalClear.style.display = 'none';
      finalCheckout.style.display = 'none';
      final.style.display = 'block';
      clearBtn.style.display = 'block';
    });
  } else {
    document.getElementById('no-items-popup').classList.add('display');
    setTimeout(() => {
      document.getElementById('no-items-popup').classList.remove('display');
    }, 2000);
  }
});

finalCheckout.addEventListener('click', () => {
  location.reload();
  localStorage.clear();
});

// MAKE NAV BIGGER ON MOBILE
// SHOW CASE NOT CENTERED MOBILE
// MESS WITH CART POSITION FOR MOBILE --- fixed or absolute
