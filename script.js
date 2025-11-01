// =================================================================
// 0. DOM YUKLANGANDA ISHGA TUSHADI
// =================================================================
document.addEventListener("DOMContentLoaded", () => {
    
    // =================================================================
    // 1. ELEMENTLAR (DOM REFENSIYALARI)
    // =================================================================
    const els = {
        bookList: document.getElementById("book-list"),
        filterOptions: document.getElementById("filterOptions"),
        searchInput: document.getElementById("searchInput"),

        themeToggle: document.getElementById("theme-toggle"),
        toastContainer: document.getElementById('toast-container'),
        loaderOverlay: document.getElementById('loader'),
        
        modals: document.querySelectorAll(".modal-overlay"),
        loginModal: document.getElementById("login-modal"),
        registerModal: document.getElementById("register-modal"),
        orderModal: document.getElementById("order-modal"),
        detailModal: document.getElementById("book-detail-modal"),

        detailImage: document.getElementById("detail-image"),
        detailTitle: document.getElementById("detail-title"),
        detailAuthor: document.getElementById("detail-author"),
        detailCategory: document.getElementById("detail-category"),
        detailPrice: document.getElementById("detail-price"),
        detailDescription: document.getElementById("detail-description"),

        loginForm: document.getElementById("login-form"),
        registerForm: document.getElementById("register-form"),
        orderForm: document.getElementById("order-form"),
        
        userActions: document.querySelector('.user-actions'),
        userInfo: document.querySelector('.user-info'),
        userDisplayEmail: document.getElementById('user-display-email'),
        logoutBtn: document.getElementById('logout-btn'),
        
        cartCount: document.getElementById('cart-count'),
        cartItemsList: document.getElementById('cart-items-list'),
        cartTotalPrice: document.getElementById('cart-total-price'),
        orderAllBtn: document.getElementById('order-all-btn'),
        
        loginMessage: document.getElementById("login-message"),
        registerMessage: document.getElementById("register-message"),
        orderMessage: document.getElementById("order-message"),
    };
    
    // =================================================================
    // 2. MA'LUMOTLARNI BOSHQARISH
    // =================================================================
    const store = {
        books: [], users: [], cart: [],
        
        //kitoblarni yukayldi bravzerdi hotirasidan lacal savatni foydalnuvchisga yuklaydi
        // bu ham asinhiron funksiya
        async load() {
            try {
                this.users = JSON.parse(localStorage.getItem("users")) || [];
                this.cart = JSON.parse(localStorage.getItem("cart")) || [];
                
                const response = await fetch("../json/data.json");
                if (!response.ok) throw new Error("data.json yuklanmadi");
                const freshBooks = await response.json();
                if (Array.isArray(freshBooks) && freshBooks.length > 0) {
                    this.books = freshBooks;
                    this.save();
                } else {
                    this.books = JSON.parse(localStorage.getItem("books")) || [];
                }
            } catch (e) {
                console.error(e);
                this.books = JSON.parse(localStorage.getItem("books")) || [];
            }
        },
        // lacalga saqlaydi
        save() {
            localStorage.setItem("books", JSON.stringify(this.books));
            localStorage.setItem("users", JSON.stringify(this.users));
            localStorage.setItem("cart", JSON.stringify(this.cart));
        },
        //user ni bor yoqligni biladi
        getLoggedInUser: () => JSON.parse(localStorage.getItem("loggedInUser")),
        setLoggedInUser: user => localStorage.setItem("loggedInUser", JSON.stringify(user)),
        logout: () => localStorage.removeItem("loggedInUser")
    };
    
    // =================================================================
    // 3. INTERFEYS FUNKSIYALARI
    // =================================================================
    const ui = {
        // yashirin oynani ochadi va yopadi
        showModal: modal => {
            modal.classList.add("show");
            document.body.style.overflow = 'hidden';
        },
        hideModal: modal => {
            modal.classList.remove("show");
            document.body.style.overflow = '';
        },
        hideLoader() {
            els.loaderOverlay.style.opacity = '0';
            setTimeout(() => els.loaderOverlay.style.display = 'none', 500);
        },
        
        showLocalMsg(el, text, isSuccess) {
            el.textContent = text;
            el.style.color = isSuccess ? "green" : "red";
        },
        // habar beruvchi
        showToast(message, isSuccess = true) {
            const toast = document.createElement('div');
            toast.classList.add('toast', isSuccess ? 'success' : 'error');
            toast.textContent = message;
            els.toastContainer.appendChild(toast);
            setTimeout(() => toast.classList.add('show'), 10);
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 400);
            }, 3000);
        },
        // kitoblarni oladi va html shaklida yig'adi
        renderBooks(booksToRender) {
            if (booksToRender.length === 0) {
                els.bookList.innerHTML = `
                    <div class="empty-state-message">
                        <h3>Kitoblar topilmadi</h3>
                        <p>Qidiruv so'rovingizga mos keladigan hech qanday kitob yo'q.</p>
                    </div>
                `;
                return;
            }
            
            els.bookList.innerHTML = booksToRender.map(book => `
                <div class="product-card" data-id="${book.id}">
                    <img src="${book.image}" alt="${book.title}" class="product-img">
                    <h3 class="product-title">${book.title}</h3>
                    <p class="product-author">${book.author}</p> 
                    <p class="product-price">${book.price.toLocaleString("uz-UZ")} so'm</p>
                    
                    <div class="btn-group">
                        <button class="btn btn--primary add-to-cart-btn" data-id="${book.id}">Savatga</button>
                        <button class="btn btn--secondary show-detail-btn" data-id="${book.id}">Ma'lumot</button>
                    </div>
                </div>
            `).join("");
        },
        // store.cart dagi narsalarga qarab savat modildagi ro'yhatni yangillaydi
        // umumiy narx beradi
        renderCart() {
            const totalItems = store.cart.reduce((sum, item) => sum + item.quantity, 0);
            if (store.cart.length === 0) {
                els.cartItemsList.innerHTML = "<p class='muted' style='text-align: center;'>Savat bo'sh</p>";
                els.orderAllBtn.style.display = 'none';
                els.cartTotalPrice.textContent = "0 so'm";
            } else {
                els.cartItemsList.innerHTML = store.cart.map(item => `
                    <div class="cart-item" data-id="${item.id}">
                        <img src="${item.image}" alt="${item.title}" class="cart-item__img">
                        <div class="cart-item__details">
                            <p class="cart-item__title">${item.title}</p>
                            <p class="cart-item__price">${(item.price * item.quantity).toLocaleString("uz-UZ")} so'm</p>
                        </div>
                        <div class="cart-item__actions">
                            <div class="quantity-control">
                                <button class="quantity-decrease" data-id="${item.id}">-</button>
                                <span>${item.quantity}</span>
                                <button class="quantity-increase" data-id="${item.id}">+</button>
                            </div>
                            <button class="remove-from-cart-btn" data-id="${item.id}">×</button>
                        </div>
                    </div>
                `).join("");
                const total = store.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                els.cartTotalPrice.textContent = `${total.toLocaleString("uz-UZ")} so'm`;
                els.orderAllBtn.style.display = 'block';
            }
            els.cartCount.textContent = totalItems;
        },
        // royhatdan otsa email va chiqish ni korsatdi
        updateAuthUI() {
            const user = store.getLoggedInUser();
            if (user) {
                els.userActions.style.display = 'none';
                els.userInfo.style.display = 'flex';
                els.userDisplayEmail.textContent = user.email;
            } else {
                els.userActions.style.display = 'flex';
                els.userInfo.style.display = 'none';
            }
        },
        
        setTheme(isLight) {
            document.body.classList.toggle('light-mode', isLight);
        },
    };
    
    // =================================================================
    // 4. ILOVA BOSHQARUVCHI
    // =================================================================
    // app obyekti butun saytning asosiy funksional mantig'ini o'z ichiga oladi.
    const app = {
        // init() Dastur boshlanganda ishga tushadigan asosiy funksiya
        //store.load() orqali ma'lumotlarni yuklaydi va barcha tugmalarni
        // tinglash (event listener) uchun handleEvents() ni chaqiradi.
        //bu ansinhron funksiya
        async init() {
            await store.load();
            this.handleEvents();
            this.filterAndRender();
            ui.updateAuthUI();
            ui.renderCart();
            ui.hideLoader();
            this.checkInitialTheme();
        },
        
        // bu satdagi har bir tugamni funksyasini chaqirib beradi va bosilishga javobgar
        handleEvents() {
            // Modal ochish/yopish
            document.querySelectorAll('[data-modal-target]').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const modal = document.querySelector(e.currentTarget.dataset.modalTarget);
                    if (modal) ui.showModal(modal);
                    if (e.currentTarget.id === 'cart-btn') ui.renderCart();
                });
            });
            document.querySelectorAll('.close-modal').forEach(btn => 
                btn.addEventListener('click', (e) => ui.hideModal(e.target.closest('.modal-overlay'))));
            els.modals.forEach(modal => 
                modal.addEventListener('click', (e) => {
                    if (e.target.classList.contains('modal-overlay')) ui.hideModal(modal);
                }));
                
            // Asosiy funksiyalar
            //masaln men kitob izlasam menga kitobni store.books dan topib javob qytaruvchi
            els.filterOptions.addEventListener("click", this.filterAndRender.bind(this));
            els.searchInput.addEventListener("input", this.filterAndRender.bind(this));
            els.bookList.addEventListener("click", this.handleBookActions.bind(this));
            els.themeToggle.addEventListener("click", this.handleThemeToggle.bind(this));
            els.logoutBtn.addEventListener("click", this.handleLogout.bind(this));
            els.cartItemsList.addEventListener("click", this.handleCartActions.bind(this));
            els.orderAllBtn.addEventListener("click", this.handleOrderAll.bind(this));
            
            // Formlar
            // kirsh ni parollarni tekshiradi va store.books shunda saqlaydi 
            els.registerForm.addEventListener("submit", this.handleRegister.bind(this));
            els.loginForm.addEventListener("submit", this.handleLogin.bind(this));
            //buyurtma berish formadagi barcha ma'lumotlarni oladi 
            //savatdagi mahsulotlar ro'yxatini tuzadi
            //ma'lumotlarni Telegram Bot API orqali 
            // maxsus chatga yuborish uchun fetch so'rovini yuboradi
            // muvaffaqiyatli bo'lsa, savatni bo'shatadi va xabar ko'rsatadi
            els.orderForm.addEventListener("submit", this.handleOrder.bind(this));

            // =================================================================
            // YANGI: SILLIQ SCROLL – LOGO, BOSH SAHIFA, KATALOG
            // =================================================================
            // Tepaga scroll
            document.querySelectorAll('.scroll-to-top').forEach(link => {
                // Har bir havolaga bosing hodisasini ulaydi
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });
            });

            // Katalog → filtr ostidagi kitoblarga
            document.querySelectorAll('.scroll-to-products').forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const anchor = document.getElementById('catalog-anchor');
                    if (anchor) anchor.scrollIntoView({ behavior: 'smooth' });
                });
            });
        },
        
        filterAndRender(e) {
            if (e && e.target.classList.contains('filter-item')) {
                els.filterOptions.querySelector('.active')?.classList.remove('active');
                e.target.classList.add('active');
            }
            const activeFilter = els.filterOptions.querySelector('.active')?.dataset.filter;
            const searchTerm = els.searchInput.value.toLowerCase();
            const filteredBooks = store.books.filter(book =>
                (activeFilter === 'all' || book.category === activeFilter) &&
                (book.title.toLowerCase().includes(searchTerm) || book.author.toLowerCase().includes(searchTerm))
            );
            ui.renderBooks(filteredBooks);
        },
        
        handleBookActions(e) {
            const bookId = parseInt(e.target.dataset.id);
            if (e.target.classList.contains("add-to-cart-btn")) {
                const user = store.getLoggedInUser();
                if (!user) {
                    ui.showToast("Buyurtma uchun avval tizimga kiring.", false);
                    ui.showModal(els.loginModal);
                    return;
                }
                this.addToCart(bookId);
            } else if (e.target.classList.contains("show-detail-btn")) {
                const book = store.books.find(b => b.id === bookId);
                if (book) this.showBookDetail(book);
            }
        },
        
        addToCart(bookId) {
            const bookToAdd = store.books.find(book => book.id === bookId);
            const existingItem = store.cart.find(item => item.id === bookId);
            if (bookToAdd) {
                existingItem ? existingItem.quantity++ : store.cart.push({ ...bookToAdd, quantity: 1 });
                store.save();
                ui.renderCart();
                ui.showToast(`'${bookToAdd.title}' savatga qo'shildi!`, true);
            }
        },
        
        handleCartActions(e) {
            const bookId = parseInt(e.target.dataset.id);
            let cartItem = store.cart.find(item => item.id === bookId);
            if (!cartItem) return;
            if (e.target.classList.contains("quantity-increase")) {
                cartItem.quantity++;
            } else if (e.target.classList.contains("quantity-decrease")) {
                if (cartItem.quantity > 1) cartItem.quantity--;
                else store.cart = store.cart.filter(item => item.id !== bookId);
            } else if (e.target.classList.contains("remove-from-cart-btn")) {
                store.cart = store.cart.filter(item => item.id !== bookId);
                ui.showToast("Mahsulot savatdan olib tashlandi!", true);
            }
            store.save();
            ui.renderCart();
        },
        
        handleRegister(e) {
            e.preventDefault();
            const [name, email, password, confirmPassword] = Array.from(e.target.elements).map(el => el.value);
            if (password !== confirmPassword) return ui.showLocalMsg(els.registerMessage, "Parollar mos kelmaydi!", false);
            if (store.users.find(u => u.email === email)) return ui.showLocalMsg(els.registerMessage, "Bu email allaqachon ro'yxatdan o'tgan!", false);
            const newUser = { name, email, password };
            store.users.push(newUser);
            store.save();
            store.setLoggedInUser(newUser);
            ui.showLocalMsg(els.registerMessage, "Ro'yxatdan o'tish muvaffaqiyatli!", true);
            e.target.reset();
            setTimeout(() => {
                ui.hideModal(els.registerModal);
                ui.updateAuthUI();
                ui.showToast("Ro'yxatdan o'tish muvaffaqiyatli!", true);
                els.registerMessage.textContent = '';
            }, 1500);
        },
        
        handleLogin(e) {
            e.preventDefault();
            const [email, password] = Array.from(e.target.elements).map(el => el.value);
            const user = store.users.find(u => u.email === email && u.password === password);
            if (user) {
                store.setLoggedInUser(user);
                ui.showLocalMsg(els.loginMessage, "Kirish muvaffaqiyatli!", true);
                e.target.reset();
                setTimeout(() => {
                    ui.hideModal(els.loginModal);
                    ui.updateAuthUI();
                    ui.showToast("Xush kelibsiz!", true);
                    els.loginMessage.textContent = '';
                }, 1500);
            } else {
                ui.showLocalMsg(els.loginMessage, "Noto'g'ri email yoki parol!", false);
            }
        },
        
        handleLogout() {
            store.logout();
            ui.updateAuthUI();
            ui.showToast("Tizimdan muvaffaqiyatli chiqdingiz!", true);
        },
        
        checkInitialTheme() {
            const saved = localStorage.getItem('theme');
            const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
            ui.setTheme(saved ? saved === 'light' : prefersLight);
        },
        
        handleThemeToggle() {
            const isLight = document.body.classList.toggle("light-mode");
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
            ui.showToast(`Mavzu ${isLight ? 'yorugʻ' : 'qorongʻi'} rejimga o'zgartirildi!`, true);
        },
        
        handleOrderAll() {
            const user = store.getLoggedInUser();
            if (!user) {
                ui.showToast("Buyurtma berish uchun avval tizimga kiring.", false);
                ui.showModal(els.loginModal);
                return;
            }
            if (store.cart.length > 0) {
                ui.hideModal(document.getElementById('cart-modal'));
                ui.showModal(els.orderModal);
                const summary = store.cart.map(item => `• ${item.title} (${item.quantity} dona) - ${(item.price * item.quantity).toLocaleString("uz-UZ")} so'm`).join("\n");
                document.getElementById("order-book-info").textContent = `Savatdagi barcha kitoblar:\n${summary}`;
            }
        },
        
        handleOrder(e) {
            e.preventDefault();
            const [name, phone, address, passport, note] = Array.from(e.target.elements).map(el => el.value);
            const TELEGRAM_BOT_TOKEN = "8231886168:AAEfamJvcFKQ_FGlr0jxagbylCPi9Qp2GXY";
            const TELEGRAM_CHAT_ID = "7803384869";
            const items = store.cart.map(item => `• ${item.title} (${item.quantity} dona) - ${(item.price * item.quantity).toLocaleString("uz-UZ")} so'm`).join("\n");
            const totalPrice = store.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            let message = `Yangi buyurtma!\n\n<b>Ism:</b> ${name}\n<b>Tel:</b> ${phone}\n<b>Manzil:</b> ${address}\n<b>Pasport:</b> ${passport}`;
            if (note.trim()) message += `\n<b>Eslatma:</b> ${note}`;
            message += `\n\n<b>Buyurtma ro'yxati:</b>\n${items}\n\n<b>Jami:</b> ${totalPrice.toLocaleString("uz-UZ")} so'm`;
            fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message, parse_mode: "HTML" })
            }).then(r => r.json()).then(data => {
                if (data.ok) {
                    ui.showLocalMsg(els.orderMessage, "Buyurtmangiz qabul qilindi!", true);
                    store.cart = []; store.save(); ui.renderCart(); e.target.reset();
                    ui.showToast("Buyurtmangiz muvaffaqiyatli yuborildi!", true);
                    setTimeout(() => { ui.hideModal(els.orderModal); els.orderMessage.textContent = ''; }, 3000);
                } else {
                    ui.showLocalMsg(els.orderMessage, "Xatolik yuz berdi.", false);
                }
            }).catch(() => ui.showLocalMsg(els.orderMessage, "Tarmoq xatosi.", false));
        },

        showBookDetail(book) {
            els.detailImage.src = book.image;
            els.detailTitle.textContent = book.title;
            els.detailAuthor.textContent = book.author;
            els.detailCategory.textContent = book.category.charAt(0).toUpperCase() + book.category.slice(1);
            els.detailPrice.textContent = `${book.price.toLocaleString("uz-UZ")} so'm`;
            els.detailDescription.textContent = book.description || "Tavsif mavjud emas.";
            ui.showModal(els.detailModal);
        }
    };
    
    // =================================================================
    // 5. ISHGA TUSHIRISH
    // =================================================================
    app.init();
});