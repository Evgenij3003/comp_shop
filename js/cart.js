/*==========================================================================================================================================================================*/
/* Обработка и редактирование заказа */
document.addEventListener("DOMContentLoaded", orderListProcessing);
function orderListProcessing() {
	let orderList = localStorage.getItem("orderList");
	orderList = JSON.parse(orderList);
	let order = document.createElement("div");
	order.innerHTML = orderList;
	let orderProductsItem = order.querySelectorAll(".cart-list__item");
	for (let index = 0; index < orderProductsItem.length; index++) {
		const orderProductItem = orderProductsItem[index];
		let orderProductsImage = orderProductItem.querySelectorAll(".cart-list__image img");
		let orderProductsTitle = orderProductItem.querySelectorAll(".cart-list__title");
		let orderProductsPrice = orderProductItem.querySelectorAll(".cart-list__price");
		let orderProductsQuantity = orderProductItem.querySelectorAll(".cart-list__quantity span");
		let orderProductInfo;
		let orderProductPrice;
		let orderProductPriceNumber;
		let orderProductQuantity;
		let productPriceNumber = "";
		for (let i = 0; i < orderProductsImage.length; i++) {
			let orderProductImage = orderProductsImage[i].getAttribute("src");
			for (let item = 0; item < orderProductsTitle.length; item++) {
				let orderProductTitle = orderProductsTitle[item].innerText;
				orderProductInfo =
					`
                    <div class="product-cart__info">
                        <div class="product-cart__image">
                            <a href="product.html">
                                <img src="${orderProductImage}" alt="${orderProductTitle}">
                            </a>
                        </div>
                        <div class="product-cart__label">
                            <a href="product.html">${orderProductTitle}</a>
                        </div>
                    </div>
                `;
			}
			for (let i = 0; i < orderProductsPrice.length; i++) {
				let productPriceValue = orderProductsPrice[i].innerText;
				for (let number in productPriceValue) {
					if (parseInt(productPriceValue[number]) || parseInt(productPriceValue[number]) === 0) {
						productPriceNumber += productPriceValue[number];
						orderProductPrice =
							` 
						<div class="product-cart__price price-product">
							<p class="price-product__value">${productPriceNumber}</p>
							<span>₽</span>
						</div>
						`;
					}
				}
			}
			let orderCartColumnOne =
				`
                <div class="product-cart__column">
                    ${orderProductInfo}
                    ${orderProductPrice}
                </div>
	        `;
			for (let i = 0; i < orderProductsQuantity.length; i++) {
				orderProductQuantity = Number(orderProductsQuantity[i].innerText);
			}
			let orderCartColumnTwo =
				`
                <div class="product-cart__column actions-cart">
                    <div class="actions-cart__quantity quantity">
                        <div class="quantity__button quantity__button_minus _icon-chevron"></div>
                        <div class="quantity__input">
                            <input autocomplete="off" type="text" name="form" value="${orderProductQuantity}">
                        </div>
                        <div class="quantity__button quantity__button_plus _icon-chevron"></div>
                    </div>
                    <div class="product-cart__total price-products">
                        <div class="price-products__total">
                            <p>Всего:</p>
                            <span class="price-products__value">${productPriceNumber * orderProductQuantity}</span>
                            <span>₽</span>
                        </div>
                        <button class="price-products__delete _btn _icon-trash _icon-use">Удалить</button>
                    </div>
                </div>
            `;
			const orderProductCart =
				`
                <div class="shop-cart__product product-cart">
                    <div class="product-cart__body">
                        ${orderCartColumnOne}
                        ${orderCartColumnTwo}
                    </div>
					<div class="shop-cart__restore restore-cart">
                        <div class="restore-cart__text">Товар удален из корзины</div>
                        <div class="restore-cart__button">Восстановить</div>
                    </div>
                </div>
            `
			let orderCart = document.querySelector(".shop-cart__products");
			orderCart.insertAdjacentHTML("afterbegin", orderProductCart);
		}
	}
	calculatePrice();
	totalPrice();
	deleteCart();
}



/*==========================================================================================================================================================================*/
/* Calculate Price */
function calculatePrice() {
	let quantityButtons = document.querySelectorAll(".quantity__button");
	if (quantityButtons.length > 0) {
		for (let index = 0; index < quantityButtons.length; index++) {
			let quantityButton = quantityButtons[index];
			quantityButton.addEventListener("click", function (e) {
				if (this.parentElement.classList.contains("actions-cart__quantity")) {
					let productPrice = quantityButton.closest(".quantity").nextElementSibling.querySelector(".price-products__value");
					let productPriceValue = parseInt(quantityButton.closest(".shop-cart__product").querySelector(".price-product__value").textContent);
					let value = parseInt(quantityButton.closest(".quantity").querySelector("input").value);
					let valueNewPrice = "";
					if (quantityButton.classList.contains("quantity__button_plus")) {
						value++;
						valueNewPrice = productPriceValue * value;
						productPrice.textContent = valueNewPrice;
					} else {
						value--;
						valueNewPrice = productPriceValue * value;
						productPrice.textContent = valueNewPrice;
						if (value < 1) {
							value = 1;
							productPrice.textContent = productPriceValue;
						}
					}
					quantityButton.closest(".quantity").querySelector("input").value = value;
					totalPrice();
				};
			})
		};
	}
}


function totalPrice() {
	let productsPrice = document.querySelectorAll(".price-products__value");
	let totalPrice = document.querySelector(".total-cart__value");
	let totalPriceValue = 0;
	for (let index = 0; index < productsPrice.length; index++) {
		let productPrice = parseInt(productsPrice[index].textContent);
		totalPriceValue += productPrice;
	}
	totalPrice.textContent = totalPriceValue;
}



/*==========================================================================================================================================================================*/
/* Delete & Restore Product */
function deleteCart() {
	let deleteButtons = document.querySelectorAll(".price-products__delete");
	let restoreButtons = document.querySelectorAll(".restore-cart__button");
	if (deleteButtons.length > 0) {
		for (let index = 0; index < deleteButtons.length; index++) {
			let deleteButton = deleteButtons[index];
			deleteButton.addEventListener("click", () => {
				deleteButton.closest(".product-cart__body").classList.add("_delete");
				setTimeout(() => {
					deleteButton.closest(".product-cart__body").style.display = "none";
					deleteButton.closest(".shop-cart__product").querySelector(".shop-cart__restore").classList.add("_show");
				}, 400);
			});
		};
	}
	if (restoreButtons.length > 0) {
		for (let index = 0; index < restoreButtons.length; index++) {
			const restoreButton = restoreButtons[index];
			restoreButton.addEventListener("click", () => {
				restoreButton.closest(".shop-cart__restore").classList.remove("_show");
				restoreButton.closest(".shop-cart__product").querySelector(".product-cart__body").classList.remove("_delete");
				restoreButton.closest(".shop-cart__product").querySelector(".product-cart__body").style.display = "flex";
			});
		};
	}
}



/*==========================================================================================================================================================================*/
/* Select */
let selects = document.getElementsByTagName('select');
if (selects.length > 0) {
	selects_init();
}


function selects_init() {
	for (let index = 0; index < selects.length; index++) {
		const select = selects[index];
		select_init(select);
	}
	document.addEventListener('click', function (e) {
		selects_close(e);
	});
	document.addEventListener('keydown', function (e) {
		if (e.which == 27) {
			selects_close(e);
		}
	});
}


function selects_close(e) {
	const selects = document.querySelectorAll('.select');
	if (!e.target.closest('.select')) {
		for (let index = 0; index < selects.length; index++) {
			const select = selects[index];
			const select_body_options = select.querySelector('.select__options');
			select.classList.remove('_active');
			_slideUp(select_body_options, 100);
		}
	}
}


function select_init(select) {
	const select_parent = select.parentElement;
	const select_modifikator = select.getAttribute('class');
	const select_selected_option = select.querySelector('option:checked');
	select.setAttribute('data-default', select_selected_option.value);
	select.style.display = 'none';
	select_parent.insertAdjacentHTML('beforeend', '<div class="select select_' + select_modifikator + '"></div>');
	let new_select = select.parentElement.querySelector('.select');
	new_select.appendChild(select);
	select_item(select);
}


function select_item(select) {
	const select_parent = select.parentElement;
	const select_items = select_parent.querySelector('.select__item');
	const select_options = select.querySelectorAll('option');
	const select_selected_option = select.querySelector('option:checked');
	const select_selected_text = select_selected_option.text;
	const select_type = select.getAttribute('data-type');
	if (select_items) {
		select_items.remove();
	}
	let select_type_content = '';
	if (select_type == 'input') {
		select_type_content = '<div class="select__value icon-select-arrow"><input autocomplete="off" type="text" name="form[]" value="' + select_selected_text + '" data-error="Ошибка" data-value="' + select_selected_text + '" class="select__input"></div>';
	} else {
		select_type_content = '<div class="select__value icon-select-arrow"><span>' + select_selected_text + '</span></div>';
	}
	select_parent.insertAdjacentHTML('beforeend',
		'<div class="select__item">' +
		'<div class="select__title">' + select_type_content + '</div>' +
		'<div class="select__options">' + select_get_options(select_options) + '</div>' +
		'</div></div>');
	select_actions(select, select_parent);
}


function select_actions(original, select) {
	const select_item = select.querySelector('.select__item');
	const select_body_options = select.querySelector('.select__options');
	const select_options = select.querySelectorAll('.select__option');
	const select_type = original.getAttribute('data-type');
	const select_input = select.querySelector('.select__input');
	select_item.addEventListener('click', function () {
		let selects = document.querySelectorAll('.select');
		for (let index = 0; index < selects.length; index++) {
			const select = selects[index];
			const select_body_options = select.querySelector('.select__options');
			if (select != select_item.closest('.select')) {
				select.classList.remove('_active');
				_slideUp(select_body_options, 100);
			}
		}
		_slideToggle(select_body_options, 100);
		select.classList.toggle('_active');
	});
	for (let index = 0; index < select_options.length; index++) {
		const select_option = select_options[index];
		const select_option_value = select_option.getAttribute('data-value');
		const select_option_text = select_option.innerHTML;
		if (select_type == 'input') {
			select_input.addEventListener('keyup', select_search);
		} else {
			if (select_option.getAttribute('data-value') == original.value) {
				select_option.style.display = 'none';
			}
		}
		select_option.addEventListener('click', function () {
			for (let index = 0; index < select_options.length; index++) {
				const el = select_options[index];
				el.style.display = 'block';
			}
			if (select_type == 'input') {
				select_input.value = select_option_text;
				original.value = select_option_value;
			} else {
				select.querySelector('.select__value').innerHTML = '<span>' + select_option_text + '</span>';
				original.value = select_option_value;
				select_option.style.display = 'none';
			}
		});
	}
}


function select_get_options(select_options) {
	if (select_options) {
		let select_options_content = '';
		for (let index = 0; index < select_options.length; index++) {
			const select_option = select_options[index];
			const select_option_value = select_option.value;
			if (select_option_value != '') {
				const select_option_text = select_option.text;
				select_options_content = select_options_content + '<div data-value="' + select_option_value + '" class="select__option">' + select_option_text + '</div>';
			}
		}
		return select_options_content;
	}
}


function select_search(e) {
	let select_block = e.target.closest('.select ').querySelector('.select__options');
	let select_options = e.target.closest('.select ').querySelectorAll('.select__option');
	let select_search_text = e.target.value.toUpperCase();
	for (let i = 0; i < select_options.length; i++) {
		let select_option = select_options[i];
		let select_txt_value = select_option.textContent || select_option.innerText;
		if (select_txt_value.toUpperCase().indexOf(select_search_text) > -1) {
			select_option.style.display = "";
		} else {
			select_option.style.display = "none";
		}
	}
}


function selects_update_all() {
	let selects = document.querySelectorAll('select');
	if (selects) {
		for (let index = 0; index < selects.length; index++) {
			const select = selects[index];
			select_item(select);
		}
	}
}



/*==========================================================================================================================================================================*/
/* Slide Toggle */
let _slideUp = (target, duration = 500) => {
	target.style.transitionProperty = "height, margin, padding";
	target.style.transitionDuration = duration + "ms";
	target.style.height = target.offsetHeight + "px";
	target.offsetHeight;
	target.style.overflow = "hidden";
	target.style.height = 0;
	target.style.paddingTop = 0;
	target.style.paddingBottom = 0;
	target.style.marginTop = 0;
	target.style.marginBottom = 0;
	window.setTimeout(() => {
		target.style.display = "none";
		target.style.removeProperty("height");
		target.style.removeProperty("padding-top");
		target.style.removeProperty("padding-bottom");
		target.style.removeProperty("margin-top");
		target.style.removeProperty("margin-bottom");
		target.style.removeProperty("overflow");
		target.style.removeProperty("transition-duration");
		target.style.removeProperty("transition-property");
		target.classList.remove("_slide");
	}, duration);
}


let _slideDown = (target, duration = 500) => {
	target.style.removeProperty("display");
	let display = window.getComputedStyle(target).display;
	if (display === "none")
		display = "block";
	target.style.display = display;
	let height = target.offsetHeight;
	target.style.overflow = "hidden";
	target.style.height = 0;
	target.style.paddingTop = 0;
	target.style.paddingBottom = 0;
	target.style.marginTop = 0;
	target.style.marginBottom = 0;
	target.offsetHeight;
	target.style.transitionProperty = "height, margin, padding";
	target.style.transitionDuration = duration + "ms";
	target.style.height = height + "px";
	target.style.removeProperty("padding-top");
	target.style.removeProperty("padding-bottom");
	target.style.removeProperty("margin-top");
	target.style.removeProperty("margin-bottom");
	window.setTimeout(() => {
		target.style.removeProperty("height");
		target.style.removeProperty("overflow");
		target.style.removeProperty("transition-duration");
		target.style.removeProperty("transition-property");
		target.classList.remove("_slide");
	}, duration);
}


let _slideToggle = (target, duration = 500) => {
    if (!target.classList.contains("_slide")) {
        target.classList.add("_slide");
        if (window.getComputedStyle(target).display === "none") {
            return _slideDown(target, duration);
        } else {
            return _slideUp(target, duration);
        }
    }
}