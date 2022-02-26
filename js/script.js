/*==========================================================================================================================================================================*/
/* Проверка устройства, на котором открыта страница */
const isMobile = {
    Android: function () {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function () {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function () {
        return (
            isMobile.Android() ||
            isMobile.BlackBerry() ||
            isMobile.iOS() ||
            isMobile.Opera() ||
            isMobile.Windows());
    }
};


function isIE() {
    ua = navigator.userAgent;
    var is_ie = ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1;
    return is_ie;
}
if (isIE()) {
    document.querySelector("body").classList.add("ie");
}
if (isMobile.any()) {
    document.querySelector("body").classList.add("_touch");
}



/*==========================================================================================================================================================================*/
/* Проверка браузера на поддержку формата webp */
function testWebP(callback) {
    let webP = new Image();
    webP.onload = webP.onerror = function () {
        callback(webP.height == 2);
    };
    webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}
testWebP(function (support) {
    if (support == true) {
        document.querySelector("body").classList.add("_webp");
    } else {
        document.querySelector("body").classList.add("_no-webp");
    }
});



/*==========================================================================================================================================================================*/
/* Menu Burger */
let iconMenu = document.querySelector(".menu-header__icon");
if (iconMenu != null) {
    let delay = 500;
    let body = document.querySelector("body");
    let menuBody = document.querySelector(".menu-header");
    iconMenu.addEventListener("click", function (e) {
        if (!body.classList.contains("_wait")) {
            body_lock(delay);
            iconMenu.classList.toggle("_active");
            menuBody.classList.toggle("_active");
        }
    });
};


function body_lock(delay) {
    let body = document.querySelector("body");
    if (body.classList.contains("_lock")) {
        body_lock_remove(delay);
    } else {
        body_lock_add(delay);
    }
}
let unlock = true;


function body_lock_remove(delay) {
    let body = document.querySelector("body");
    if (unlock) {
        let lock_padding = document.querySelectorAll("._lp");
        setTimeout(() => {
            for (let index = 0; index < lock_padding.length; index++) {
                const el = lock_padding[index];
                el.style.paddingRight = "0px";
            }
            body.style.paddingRight = "0px";
            body.classList.remove("_lock");
        }, delay);
        unlock = false;
        setTimeout(function () {
            unlock = true;
        }, delay);
    }
}


function body_lock_add(delay) {
    let body = document.querySelector("body");
    if (unlock) {
        let lock_padding = document.querySelectorAll("._lp");
        for (let index = 0; index < lock_padding.length; index++) {
            const el = lock_padding[index];
            el.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
        }
        body.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
        body.classList.add("_lock");
        unlock = false;
        setTimeout(function () {
            unlock = true;
        }, delay);
    }
}



/*==========================================================================================================================================================================*/
/* Скрытие header при скролле и показ при обратном скролле */
let header = document.querySelector(".header");
let scrollTop = 0;
window.addEventListener("scroll", function () {
    let scrolling = this.scrollY;
    if (scrolling > 150 && scrolling > scrollTop) {
        header.classList.add("_hidden");
    } else {
        header.classList.remove("_hidden");
    }
    scrollTop = scrolling;
});



/*==========================================================================================================================================================================*/
/* Динамический Адаптив */
(function () {
	let originalPositions = [];
	let daElements = document.querySelectorAll("[data-da]");
	let daElementsArray = [];
	let daMatchMedia = [];
	if (daElements.length > 0) {
		let number = 0;
		for (let index = 0; index < daElements.length; index++) {
			const daElement = daElements[index];
			const daMove = daElement.getAttribute("data-da");
			if (daMove != "") {
				const daArray = daMove.split(",");
				const daPlace = daArray[1] ? daArray[1].trim() : "last";
				const daBreakpoint = daArray[2] ? daArray[2].trim() : "767";
				const daType = daArray[3] === "min" ? daArray[3].trim() : "max";
				const daDestination = document.querySelector("." + daArray[0].trim())
				if (daArray.length > 0 && daDestination) {
					daElement.setAttribute("data-da-index", number);
					originalPositions[number] = {
						"parent": daElement.parentNode,
						"index": indexInParent(daElement)
					};
					daElementsArray[number] = {
						"element": daElement,
						"destination": document.querySelector("." + daArray[0].trim()),
						"place": daPlace,
						"breakpoint": daBreakpoint,
						"type": daType
					}
					number++;
				}
			}
		}
		dynamicAdaptSort(daElementsArray);
		for (let index = 0; index < daElementsArray.length; index++) {
			const el = daElementsArray[index];
			const daBreakpoint = el.breakpoint;
			const daType = el.type;
			daMatchMedia.push(window.matchMedia("(" + daType + "-width: " + daBreakpoint + "px)"));
			daMatchMedia[index].addListener(dynamicAdapt);
		}
	}


	function dynamicAdapt(e) {
		for (let index = 0; index < daElementsArray.length; index++) {
			const el = daElementsArray[index];
			const daElement = el.element;
			const daDestination = el.destination;
			const daPlace = el.place;
			const daBreakpoint = el.breakpoint;
			const daClassname = "_dynamic_adapt_" + daBreakpoint;
			if (daMatchMedia[index].matches) {
				if (!daElement.classList.contains(daClassname)) {
					let actualIndex = indexOfElements(daDestination)[daPlace];
					if (daPlace === "first") {
						actualIndex = indexOfElements(daDestination)[0];
					} else if (daPlace === "last") {
						actualIndex = indexOfElements(daDestination)[indexOfElements(daDestination).length];
					}
					daDestination.insertBefore(daElement, daDestination.children[actualIndex]);
					daElement.classList.add(daClassname);
				}
			} else {
				if (daElement.classList.contains(daClassname)) {
					dynamicAdaptBack(daElement);
					daElement.classList.remove(daClassname);
				}
			}
		}
	}


	dynamicAdapt();


	function dynamicAdaptBack(el) {
		const daIndex = el.getAttribute("data-da-index");
		const originalPlace = originalPositions[daIndex];
		const parentPlace = originalPlace["parent"];
		const indexPlace = originalPlace["index"];
		const actualIndex = indexOfElements(parentPlace, true)[indexPlace];
		parentPlace.insertBefore(el, parentPlace.children[actualIndex]);
	}


	function indexInParent(el) {
		var children = Array.prototype.slice.call(el.parentNode.children);
		return children.indexOf(el);
	}


	function indexOfElements(parent, back) {
		const children = parent.children;
		const childrenArray = [];
		for (let i = 0; i < children.length; i++) {
			const childrenElement = children[i];
			if (back) {
				childrenArray.push(i);
			} else {
				if (childrenElement.getAttribute("data-da") == null) {
					childrenArray.push(i);
				}
			}
		}
		return childrenArray;
	}


	function dynamicAdaptSort(arr) {
		arr.sort(function (a, b) {
			if (a.breakpoint > b.breakpoint) {
				return -1
			} else {
				return 1
			}
		});
		arr.sort(function (a, b) {
			if (a.place > b.place) {
				return 1
			} else {
				return -1
			}
		});
	}
}());



/*==========================================================================================================================================================================*/
/* Catalog Product */
let menuPageBurger = document.querySelector(".menu-catalog__burger");
let menuPageBody = document.querySelector(".menu-catalog__body");
if (menuPageBurger) {
	menuPageBurger.addEventListener("click", function (e) {
		menuPageBurger.classList.toggle("_active");
		_slideToggle(menuPageBody);
	});
}


let checkboxCategories = document.querySelectorAll(".categories-search__checkbox");
for (let index = 0; index < checkboxCategories.length; index++) {
    const checkboxCategory = checkboxCategories[index];
    checkboxCategory.addEventListener("change", function (e) {
        checkboxCategory.classList.toggle("_active");
        let checkboxActiveCategories = document.querySelectorAll(".categories-search__checkbox._active");
        if (checkboxActiveCategories.length > 0) {
            searchSelect.classList.add("_categories");
            let searchQuantity = searchSelect.querySelector(".search-page__quantity");
            searchQuantity.innerHTML = searchQuantity.getAttribute("data-text") + " " + checkboxActiveCategories.length;
        } else {
            searchSelect.classList.remove("_categories");
        }
    });
}


if (isMobile.any()) {
	let menuLinks = document.querySelectorAll(".menu-catalog__item_parent > a");
	for (let index = 0; index < menuLinks.length; index++) {
		const menuLink = menuLinks[index];
		menuLink.addEventListener("click", function (e) {
			e.preventDefault();
			menuLink.parentElement.classList.toggle("_active");
		});
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



/*==========================================================================================================================================================================*/
/* Slider Swiper */
window.onload = function () {
	if (document.querySelector(".products-main__slider")) {
		let mainProducts = new Swiper(".products-main__slider", {
			pagination: {
				el: ".swiper-pagination",
				type: "bullets",
				clickable: true,
				dynamicBullets: true,
				renderBullet: function (index, className) {
					return '<span class="' + className + '">' + (index + 1) + '</span>';
				},
			},
			keyboard: {
				enabled: true,
				onlyInViewport: true,
				pageUpDown: true,
			},
			speed: 800,
			slidesPerView: 1,
			centeredSlides: true,
		})
	}


	if (document.querySelector(".product__slider")) {
		let imagesProductSlider = new Swiper(".product__slider", {
			observer: true,
			observeParents: true,
			slidesPerView: 1,
			spaceBetween: 0,
			navigation: {
				nextEl: ".swiper-button-next",
				prevEl: ".swiper-button-prev"
			},
			loop: true,
			thumbs: {
				swiper: {
					el: ".product__thumbs",
					slidesPerView: 4,
				}
			},
			speed: 800,
		});
	}


	sessionStorage.setItem("is_reloaded", true);
	if (sessionStorage.getItem("is_reloaded")) {
		recoveryProductsList();
	}
};



/*==========================================================================================================================================================================*/
/* Popup */
const popupLinks = document.querySelectorAll("._popup-link");					
const body = document.querySelector("body");												
const lockPadding = document.querySelectorAll(".lock-padding");				
unlock = true;														
const timeout = 800;															


if (popupLinks.length > 0) {
	for (let index = 0; index < popupLinks.length; index++) {
		const popupLink = popupLinks[index];
		popupLink.addEventListener("click", function (e) {
			const popupName = popupLink.getAttribute("href").replace("#", "");
			const curentPopup = document.getElementById(popupName);
			popupOpen(curentPopup);
			e.preventDefault();
		});
	}
}


const popupCloseIcon = document.querySelectorAll("._popup ._icon-close");
if (popupCloseIcon.length > 0) {												
	for (let index = 0; index < popupCloseIcon.length; index++) {
		const el = popupCloseIcon[index];								
		el.addEventListener("click", function (e) {							
			popupClose(el.closest("._popup"));						
			e.preventDefault();												
		});
	}
}


function popupOpen(curentPopup) {											
	if (curentPopup && unlock) {							
		const popupActive = document.querySelector(".popup._open");
		if (popupActive) {														
			popupClose(popupActive, false);										
		} else {													
			bodyLock();
		}
		curentPopup.classList.add("_open");									
		curentPopup.addEventListener("click", function (e) {				
			if (!e.target.closest("._popup-body")) {						
				popupClose(e.target.closest("._popup"));				
			}
		});
	}
}


function popupClose(popupActive, doUnlock = true) {							
	if (unlock) {														
		popupActive.classList.remove("_open");								
		if (doUnlock) {															
			bodyUnLock();													
		}
	}
}


let popupUser = document.getElementById("popup-user");
let popupUserLink = document.getElementById("popup-user-link");
let popupRegister = document.getElementById("popup-register");
let popupRegisterLink = document.getElementById("popup-register-link");
let popupRecovery = document.getElementById("popup-recovery");
let popupRecoveryLink = document.getElementById("popup-recovery-link");
let popupBackLink = document.getElementById("popup-back-link");
if (popupUserLink) {
	popupUserLink.addEventListener("click", function (e) {
		popupUser.classList.add("_open");
		popupRegister.classList.remove("_open");
	});
}
if (popupRegisterLink) {
	popupRegisterLink.addEventListener("click", function (e) {
		popupRegister.classList.add("_open");
		popupUser.classList.remove("_open");
	});
}
if (popupRecoveryLink) {
	popupRecoveryLink.addEventListener("click", function (e) {
		popupRecovery.classList.add("_open");
		popupUser.classList.remove("_open");
	});
}
if (popupBackLink) {
	popupBackLink.addEventListener("click", function (e) {
		popupRecovery.classList.remove("_open");
		popupUser.classList.add("_open");
	});
}



/*==========================================================================================================================================================================*/
/* Скрытие, блокировка и разблокировка скролла */
function bodyLock() {															
	const lockPaddingValue = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
	if (lockPadding.length > 0) {												
		for (let index = 0; index < lockPadding.length; index++) {			
			const el = lockPadding[index];									
			el.style.paddingRight = lockPaddingValue;					
		}
	}
	body.style.paddingRight = lockPaddingValue;									
	body.classList.add("_lock");												
	unlock = false;															
	setTimeout(function () {												
		unlock = true;														
	}, timeout);																
}


function bodyUnLock() {														
	setTimeout(function () {													
		if (lockPadding.length > 0) {										
			for (let index = 0; index < lockPadding.length; index++) {		
				const el = lockPadding[index];									
				el.style.paddingRight = "0px";								
			}
		}
		body.style.paddingRight = "0px";									
		body.classList.remove("_lock");										
	}, timeout);															
	unlock = false;														
	setTimeout(function () {												
		unlock = true;															
	}, timeout);															
}



/*==========================================================================================================================================================================*/
/* Price Slider */
const priceSlider = document.querySelector(".price-filter__range");
if (priceSlider) {
	noUiSlider.create(priceSlider, {
		start: [0, 200],
		connect: true,
		tooltips: true,
		range: {
			"min": [0],
			"max": [200]
		}
	});
	const priceStart = document.getElementById("price-start");
	const priceEnd = document.getElementById("price-end");
	priceStart.addEventListener("change", setPriceValues);
	priceEnd.addEventListener("change", setPriceValues);


	function setPriceValues() {
		let priceStartValue;
		let priceEndValue;
		if (priceStart.value != "") {
			priceStartValue = priceStart.value;
		}
		if (priceEnd.value != "") {
			priceEndValue = priceEnd.value;
		}
		priceSlider.noUiSlider.set([priceStartValue, priceEndValue]);
	}
}


if (isMobile.any()) {
	const filterTitle = document.querySelector(".filter__title");
	if (filterTitle) {
		filterTitle.addEventListener("click", function (e) {
			this.classList.toggle("active");
			_slideToggle(filterTitle.nextElementSibling);
		});
	}
}



/*==========================================================================================================================================================================*/
/* Spollers */
let spollers = document.querySelectorAll("._spoller");
if (spollers.length > 0) {
	for (let index = 0; index < spollers.length; index++) {
		const spoller = spollers[index];
		spoller.addEventListener("click", function (e) {
			if (spoller.classList.contains("_spoller-992") && window.innerWidth > 992) {
				return false;
			}
			if (spoller.classList.contains("_spoller-768") && window.innerWidth > 768) {
				return false;
			}
			if (spoller.closest("._spollers").classList.contains("_one")) {
				let curent_spollers = spoller.closest("._spollers").querySelectorAll("._spoller");
				for (let i = 0; i < curent_spollers.length; i++) {
					let el = curent_spollers[i];
					if (el != spoller) {
						el.classList.remove("_active");
						_slideUp(el.nextElementSibling);
					}
				}
			}
			spoller.classList.toggle("_active");
			_slideToggle(spoller.nextElementSibling);
		});
	}
}


if (isMobile.any()) {
	let filterTitle = document.querySelector(".filter__title");
	if (filterTitle) {
		filterTitle.addEventListener("click", function (e) {
			if (this.classList.contains("_active")) {
				this.classList.remove("_active");
			} else {
				filterTitle.classList.add("_active");
				_slideToggle(filterTitle.nextElementSibling);
			}
		});
	}
}



/*==========================================================================================================================================================================*/
/* Remove Compare Item */
let buttonsRemove = document.querySelectorAll(".compare-filter__remove");
if (buttonsRemove) {
	for (let index = 0; index < buttonsRemove.length; index++) {
		let buttonRemove = buttonsRemove[index];
		removeItemCompare(buttonRemove);
	}
}


function removeItemCompare(buttonRemove) {
	buttonRemove.addEventListener("click", function (e) {
		e.preventDefault();
		buttonRemove.closest(".compare-filter__item").classList.add("_hide");
	});
}



/*==========================================================================================================================================================================*/
/* Toggle View Column */
let gridViewButton = document.querySelector(".view-catalog__item_grid");
let rowViewButton = document.querySelector(".view-catalog__item_list");
let columnCarts = document.querySelectorAll(".products-main__column_product");
if (columnCarts) {
	for (let index = 0; index < columnCarts.length; index++) {
		const columnCart = columnCarts[index];
		gridViewButton.addEventListener("click", function (e) {
			columnCart.classList.remove("_row");
		});
		rowViewButton.addEventListener("click", function (e) {
			columnCart.classList.add("_row");
		});
		if (columnCart.classList.contains("_row") && window.innerWidth < 992) {
			columnCart.classList.remove("_row");
		}
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
/* Плавная прокрутка до раздела сайта */
const menuLinks = document.querySelectorAll("[data-goto]");
if (menuLinks.length > 0) {
	menuLinks.forEach(menuLink => {
		menuLink.addEventListener("click", onMenuLinkClick);
	});
	function onMenuLinkClick(e) {
		const menuLink = e.target;
		if (menuLink.dataset.goto && document.querySelector(menuLink.dataset.goto)) {
			const gotoBlock = document.querySelector(menuLink.dataset.goto);
			const gotoBlockValue = gotoBlock.getBoundingClientRect().top + pageYOffset;
			if (iconMenu.classList.contains("_active")) {
				document.body.classList.remove("_lock");
				iconMenu.classList.remove("_active");
				menuBody.classList.remove("_active");
			}
			window.scrollTo({
				top: gotoBlockValue,
				behavior: "smooth"
			});
			e.preventDefault();
		}
	}
}



/*==========================================================================================================================================================================*/
/* Tabs */
let tabs = document.querySelectorAll("._tabs");
for (let index = 0; index < tabs.length; index++) {
	let tab = tabs[index];
	let tabs_items = tab.querySelectorAll("._tabs-nav");
	let tabs_blocks = tab.querySelectorAll("._tabs-item");
	for (let index = 0; index < tabs_items.length; index++) {
		let tabs_item = tabs_items[index];
		tabs_item.addEventListener("click", function (e) {
			for (let index = 0; index < tabs_items.length; index++) {
				let tabs_item = tabs_items[index];
				tabs_item.classList.remove("_active");
				tabs_blocks[index].classList.remove("_active");
			}
			tabs_item.classList.add("_active");
			tabs_blocks[index].classList.add("_active");
			e.preventDefault();
		});
	}
}



/*==========================================================================================================================================================================*/
/* Pagging */
let page = document.querySelector(".products-main__body");
let productList = document.querySelector(".products-main__page");
let productCarts = document.querySelectorAll(".products-main__column_product");
let parentPagination = document.querySelector(".navi-catalog__pages");
let currentPage = 1;
let numPages = 0;
let varproductPerPage = 6;
let index;


// Количество карточек товаров:
let numberOfProducts = function () {
	let numberOfProducts = productCarts.length;
	return (numberOfProducts);
}
numberOfProducts();


// Количество страниц:
let numberOfPages = function () {
	let numberOfPage = parseInt(numberOfProducts() / varproductPerPage);
	if (numberOfProducts() % varproductPerPage > 0) {
		numPages += 1;
	}
	createPages(numberOfPage);
}
numberOfPages();


// Создание страниц:
function createPages(numberOfPage) {
	let paginationLists = document.querySelectorAll(".pagging__list");
	for (let item = 0; item < paginationLists.length; item++) {
		let paginationList = paginationLists[item];
		for (let i = 1; i <= numberOfPage; i++) {
			numberPageProduct = i;
			paginationList.insertAdjacentHTML(
				"beforebegin",
				`<li class="pagging__item"><a href="#" data-page="${ numberPageProduct }" class="pagging__link">${ numberPageProduct }</a></li>`
			);
		}
	}
};
createPages();


function countProductCarts() {
	for (let i = 0; i < productCarts.length; i++) {
		const productCart = productCarts[i];
		navigationOnPagging(productCart)
	}
}
countProductCarts();


// Навигация по страницам:
function navigationOnPagging(productCart) {
	for (let item = 0; item < varproductPerPage; item++) {
		productCarts[item].classList.add("_show");
	}
	let paggingLinks = document.querySelectorAll(".pagging__link");
	if (paggingLinks.length > 2) {
		for (let i = 0; i < paggingLinks.length; i++) {
			const paggingLink = paggingLinks[i];
			if (paggingLink.dataset.page == 1) {
				paggingLink.classList.add("_active");
			}
			paggingLink.addEventListener("click", function (e) {
				e.preventDefault();
				let activeIndex = this.dataset.page;
				let indexLinks = document.querySelectorAll("[data-page]");
				for (let j = 0; j < varproductPerPage; j++) {
					index = activeIndex * varproductPerPage - varproductPerPage + j;
					if (productCart.classList.contains("_show")) {
						productCart.classList.remove("_show");
					}
					productCarts[index].classList.add("_show");
				}
				for (let i = 0; i < indexLinks.length; i++) {
					let indexLink = indexLinks[i].dataset.page;
					if (indexLink == activeIndex) {
						indexLinks[i].classList.add("_active");
					} else {
						indexLinks[i].classList.remove("_active");
					}
				}
			})
		}
	}
}


// function navigationOnArrows() {
// 	let arrows = document.querySelectorAll(".pagging__arrow");
// 	for (let i = 0; i < arrows.length; i++) {
// 		let arrow = arrows[i];
// 		arrow.addEventListener("click", function (e) {
// 			let activeLink = document.querySelector(".pagging__link._active");
// 			let activeLinkIndex = activeLink.dataset.page;
// 			console.log(activeLinkIndex);
// 			if (arrow.classList.contains("pagging__arrow_prev")) {
// 				activeLinkIndex--;
// 				console.log(activeLinkIndex);

// 			}
// 		})
// 	}
// }
// navigationOnArrows();



/*==========================================================================================================================================================================*/
/* Обработка "кликов" в документе */
document.addEventListener("click", documentActions);
function documentActions(e) {
	const targetElement = e.target;
	if (targetElement.classList.contains("search__icon")) {
		let searchWindow = document.querySelector(".header__search");
		searchWindow.classList.toggle("_active");
	} else if (!targetElement.closest(".header__search") && !targetElement.classList.contains("search__icon")) {
		document.querySelector(".header__search").classList.remove("_active");
	}
	if (targetElement.closest(".products-main__button")) {
		if (targetElement.closest(".products-main__column")) {
			const productId = targetElement.closest(".products-main__column").dataset.id;
			addToCart(targetElement, productId);
		}
		if (targetElement.closest(".same-product__item")) {
			const productId = targetElement.closest(".same-product__item").dataset.id;
			addToCart(targetElement, productId);
		}
	}
	if (targetElement.classList.contains("action-product__link")) {
		const productId = targetElement.closest(".product__section").dataset.id;
		addToProductCart(targetElement, productId);
	}
	if (targetElement.classList.contains("cart-header__icon") || targetElement.closest(".cart-header__icon")) {
		if (document.querySelector(".cart-list").children.length > 0) {
			document.querySelector(".cart-header").classList.toggle("_active");
		}
		if (document.querySelector(".header__search").classList.contains("_active")) {
			document.querySelector(".header__search").classList.remove("_active");
		}
		e.preventDefault();
	} else if (!targetElement.closest(".cart-header") && !targetElement.classList.contains("actions-product__button")) {
		document.querySelector(".cart-header").classList.remove("_active");
	}
	if (targetElement.classList.contains("cart-list__delete")) {
		const productId = targetElement.closest(".cart-list__item").dataset.cartId;
		updateCart(targetElement, productId, false);
		e.preventDefault();
	}
	if (targetElement.closest(".cart-header__order")) {
		let orderProducts = document.querySelector(".cart-header").innerHTML;
		localStorage.setItem("orderList", JSON.stringify(orderProducts));
	}
}



/*==========================================================================================================================================================================*/
/* Добавление товаров в корзину и ее редактирование */
function addToCart(productButton, productId) {														
	if (!productButton.classList.contains("_blocking")) {									
		productButton.classList.add("_blocking");
		// const cart = document.querySelector(".cart-header__icon");
		const cart = document.querySelector(".cart-header__icon");
		const product = document.querySelector(`[data-id="${productId}"]`);
		const productImage = product.querySelector(".products-main__image");					
		const productImageClone = productImage.cloneNode(true);
		const productImageCloneWidth = productImage.offsetWidth;										
		const productImageCloneHeight = productImage.offsetHeight;									
		const productImageCloneTop = productImage.getBoundingClientRect().top;
		const productImageCloneLeft = productImage.getBoundingClientRect().left;
		productImageClone.setAttribute("class", "_fly");
		productImageClone.style.cssText =
		`															
			left: ${productImageCloneLeft}px;
			top: ${productImageCloneTop}px;
			width: ${productImageCloneWidth}px;
			height: ${productImageCloneHeight}px;
		`;																					
		document.body.append(productImageClone);														
		const cartCoordTop = cart.getBoundingClientRect().top;									
		const cartCoordLeft = cart.getBoundingClientRect().left;															
		productImageClone.style.cssText = 															
		`
			left: ${cartCoordLeft}px;
			top: ${cartCoordTop}px;
			width: 0px;
			height: 0px;
			opacity:0;
		`;
		productImageClone.addEventListener("transitionend", function () {
			if (productButton.classList.contains("_blocking")) {
				productImageClone.remove();
				updateCart(productButton, productId);
				productButton.classList.remove("_blocking");
			}
		});
	}
}


function addToProductCart(productButton, productId) {
	if (!productButton.classList.contains("_blocking")) {
		productButton.classList.add("_blocking");
		setTimeout(function () {
			updateCart(productButton, productId);
			productButton.classList.remove("_blocking");
		}, 700);
	}
}


// Функция формирования и обновления корзины товаров:
function updateCart(productButton, productId, productAdd = true) {
	let cart = document.querySelector(".cart-header");
	let cartIcon = cart.querySelector(".cart-header__icon");
	let cartQuantity = cartIcon.querySelector("span");
	let cartProduct = document.querySelector(`[data-cart-id="${productId}"]`);
	let cartList = document.querySelector(".cart-header__list");
	if (productAdd) {
		if (cartQuantity) {
			cartQuantity.innerHTML = ++cartQuantity.innerHTML;
		} else {
			cartIcon.insertAdjacentHTML("beforeend", `<span>1</span>`);
		}
		if (!cartProduct) {
			let product = document.querySelector(`[data-id="${productId}"]`);
			let cartProductImage = product.querySelector(".products-main__image").getAttribute("src");
			let cartProductTitle;
			let cartProductPrice;
			if (product.classList.contains("products-main__column") || product.classList.contains("same-product__item")) {
				cartProductTitle = product.querySelector(".info-products__title a").innerHTML;
				cartProductPrice = product.querySelector(".info-products_new-price").innerHTML;
			} else {
				cartProductTitle = product.querySelector(".product__title").innerHTML;
				cartProductPrice = product.querySelector(".price-product__new-price").innerHTML;
			}
			const cartProductContent =
				`												
					<a href="product.html" class="cart-list__image">
						<img src="${cartProductImage}">
					</a>
					<div class="cart-list__body">
						<a href="product.html" class="cart-list__title">${cartProductTitle}</a>
						<div class="cart-list__quantity">Quantity: <span>1</span></div>
						<a href="" class="cart-list__delete">Delete</a>
						<p class="cart-list__price">${cartProductPrice}</p>
					</div>
			`;
			cartList.insertAdjacentHTML("beforeend", `<li data-cart-id="${productId}" class="cart-list__item">${cartProductContent}</li>`);
		} else {
			const cartProductQuantity = cartProduct.querySelector(".cart-list__quantity span");
			cartProductQuantity.innerHTML = ++cartProductQuantity.innerHTML;
		}
		productButton.classList.remove("_blocking");
	} else {
		const cartProductQuantity = cartProduct.querySelector(".cart-list__quantity span");
		cartProductQuantity.innerHTML = --cartProductQuantity.innerHTML;
		if (!parseInt(cartProductQuantity.innerHTML)) {
			cartProduct.remove();
		}
		const cartQuantityValue = --cartQuantity.innerHTML;
		if (cartQuantityValue) {
			cartQuantity.innerHTML = cartQuantityValue;
		} else {
			cartQuantity.remove();
			cart.classList.remove("_active");
		}
	}
}



/*==========================================================================================================================================================================*/
/* Сохранение корзины при перезагрузке страницы */
window.onbeforeunload = function (e) {
	let cartList = document.querySelector(".cart-header").innerHTML;
	localStorage.setItem("cartList", JSON.stringify(cartList));
}


function recoveryProductsList() {
	let cartList = document.querySelector(".cart-header");
	let recoveryCartList = localStorage.getItem("cartList");
	let recovery = JSON.parse(recoveryCartList);
	if (recovery !== null) {
		cartList.innerHTML = recovery;
	}
}