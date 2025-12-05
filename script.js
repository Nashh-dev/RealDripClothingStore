
//Question 2 a. i
// ---------- Product Catalogue ----------
let AllProducts = JSON.parse(localStorage.getItem('AllProducts')) || [
    { name: "Crew Neck T-Shirt", price: 1500, description: "Comfortable cotton crew neck T-shirt", image: "../Assets/tshirt.png" },
    { name: "Sweatshirt", price: 2000, description: "Warm and cozy sweatshirt", image: "../Assets/sweatshirt.png" },
    { name: "Jeans Pants", price: 2500, description: "Stylish denim jeans pants", image: "../Assets/jeans.png" },
    { name: "Shoes", price: 5000, description: "Durable running shoes", image: "../Assets/shoes.png" },
    { name: "Baseball Cap", price: 800, description: "Classic adjustable cap", image: "../Assets/cap.png" },
    { name: "Hooded Jacket", price: 3500, description: "Water-resistant hooded jacket", image: "../Assets/jacket.png" },
    { name: "Sneakers", price: 4500, description: "Lightweight casual sneakers", image: "../Assets/sneakers.png" },
    { name: "Cargo Shorts", price: 1800, description: "Comfortable multi-pocket cargo shorts", image: "../Assets/shorts.png" },
    { name: "Graphic Tee", price: 1600, description: "Trendy printed T-shirt", image: "../Assets/graphic_tee.png" },
    { name: "Backpack", price: 3000, description: "Durable backpack for everyday use", image: "../Assets/backpack.png" },
    { name: "Leather Belt", price: 1200, description: "Genuine leather belt", image: "../Assets/belt.png" },
    { name: "Socks Pack", price: 600, description: "Pack of 5 cotton socks", image: "../Assets/socks.png" }
];

//Question 2 b
// Save product list to localStorage
localStorage.setItem('AllProducts', JSON.stringify(AllProducts));

//Question 2 c
// Dynamically display products
function displayProducts() {
    const productGrid = document.getElementById('product-grid');
    if (!productGrid) return;

    productGrid.innerHTML = ""; // clear existing cards

    AllProducts.forEach(product => {
        const article = document.createElement('article');
        article.className = "product";

        article.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <p class="product-title">${product.name} <span class="price">J$${product.price.toLocaleString()}</span></p>
            <p class="description">${product.description}</p>
            <button class="productbtn" data-name="${product.name}" data-price="${product.price}">Add to Cart</button>
        `;

        productGrid.appendChild(article);

        // Add click listener for dynamically created button
        article.querySelector('.productbtn').addEventListener('click', () => {
            addToCart(product.name, product.price);
        });
    });
}


// Call displayProducts when DOM loads
document.addEventListener('DOMContentLoaded', displayProducts);

// ---------- Cart ----------
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(name, price) {
    price = Number(price);
    let found = cart.find(item => item.name === name);
    if (found) found.qty++;
    else cart.push({ name, price, qty: 1 });
    saveCart();
    alert(`${name} added to cart`);
    displayCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    displayCart();
}

function displayCart() {
    const container = document.getElementById('cart-container');
    const subtotalEl = document.getElementById('subtotal');
    const taxResultEl = document.getElementById('taxResult');
    const discountEl = document.getElementById('discountResult');
    const totalResultEl = document.getElementById('totalResult');

    if (!container) return;

    container.innerHTML = '';
    if (cart.length === 0) {
        container.innerHTML = '<p>Your cart is empty.</p>';
        if (subtotalEl) subtotalEl.textContent = '0.00';
        if (taxResultEl) taxResultEl.textContent = '0.00';
        if (discountEl) discountEl.textContent = '0.00';
        if (totalResultEl) totalResultEl.textContent = '0.00';
        return;
    }

    let subtotal = 0;
    cart.forEach((item, idx) => {
        subtotal += item.price * item.qty;
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <p><b>${item.name}</b></p>
            <p>Price: J$${item.price}</p>
            <p>
                Qty: 
                <button class="qty-btn" data-action="decrease" data-index="${idx}">–</button>
                <span>${item.qty}</span>
                <button class="qty-btn" data-action="increase" data-index="${idx}">+</button>
            </p>
            <button onclick="removeFromCart(${idx})">Remove</button>
            <hr>
        `;
        container.appendChild(div);
    });

    // Add event listeners for quantity buttons
container.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const index = parseInt(btn.dataset.index);
        const action = btn.dataset.action;

        if (action === 'increase') {
            cart[index].qty++;
        } else if (action === 'decrease') {
            if (cart[index].qty > 1) cart[index].qty--;
        }

        saveCart();
        displayCart(); // refresh cart display
    });
});


    const tax = subtotal * 0.15;
    const discount = subtotal * 0.10;
    const total = subtotal + tax - discount;

    if (subtotalEl) subtotalEl.textContent = subtotal.toFixed(2);
    if (taxResultEl) taxResultEl.textContent = tax.toFixed(2);
    if (discountEl) discountEl.textContent = discount.toFixed(2);
    if (totalResultEl) totalResultEl.textContent = total.toFixed(2);
}

function displayCheckoutSummary() {
    const summaryEl = document.getElementById('checkout-summary');
    if (!summaryEl) return;

    if (cart.length === 0) {
        summaryEl.innerHTML = '<p>Your cart is empty.</p>';
        return;
    }

    summaryEl.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
        total += item.price * item.qty;
        summaryEl.innerHTML += `<p>${item.name} - ${item.qty} x J$${item.price} = J$${(item.qty*item.price).toFixed(2)}</p>`;
    });
    summaryEl.innerHTML += `<hr><p><b>Total: J$${(total*1.15).toFixed(2)}</b></p>`;
}

// Question 2e. 2 - Close Cart Button
const closeCartBtn = document.getElementById('close-cart');

if (closeCartBtn) {
    closeCartBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
}


// ---------- Forms & Authentication ----------
document.addEventListener('DOMContentLoaded', () => {

    // --- Utility Functions ---
    const validateTRN = trn => /^\d{3}-\d{3}-\d{3}$/.test(trn);
    const calculateAge = dob => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        if (today.getMonth() < birthDate.getMonth() ||
            (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) age--;
        return age;
    };
    const validateEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    // --- Cart Buttons ---
    
    displayCart();
    displayCheckoutSummary();

    const clearBtn = document.getElementById('clear-cart');
    if (clearBtn) clearBtn.addEventListener('click', () => {
        cart = [];
        saveCart();
        displayCart();
    });

    // --- Checkout ---
    // Question 4 a-e
const checkoutForm = document.getElementById('checkout-form');

if (checkoutForm) {
    checkoutForm.addEventListener('submit', e => {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const address = document.getElementById('address').value.trim();
        const amount = document.getElementById('amount').value.trim();
        const payment = document.querySelector('input[name="payment"]:checked');
        const errorEl = document.getElementById('checkout-error');

        errorEl.textContent = "";

        if (!name || !address || !amount) {
            errorEl.textContent = "Please fill out your name, address, and amount.";
            return;
        }

        if (!payment) {
            errorEl.textContent = "Please select a payment method.";
            return;
        }

        if (cart.length === 0) {
            errorEl.textContent = "Your cart is empty.";
            return;
        }

        // Save invoice data to localStorage
        localStorage.setItem("invoice_cart", JSON.stringify(cart));
        localStorage.setItem("invoice_name", name);
        localStorage.setItem("invoice_address", address);
        localStorage.setItem("invoice_amount", amount);
        localStorage.setItem("invoice_payment", payment.value);

        // Clear cart
        cart = [];
        saveCart();

        // Redirect to invoice page
        window.location.href = "invoice.html";
    });
}


// ---------- Invoice Page ----------
// Question 5 a-b
function generateInvoice() {
    const invoiceEl = document.getElementById("invoice");
    if (!invoiceEl) return;

    const invoiceCart = JSON.parse(localStorage.getItem("invoice_cart")) || [];
    const name = localStorage.getItem("invoice_name") || "N/A";
    const address = localStorage.getItem("invoice_address") || "N/A";
    const payment = localStorage.getItem("invoice_payment") || "N/A";
    const trn = localStorage.getItem("loggedInUser") || "N/A";

    if (invoiceCart.length === 0) {
        invoiceEl.innerHTML = "<p>No invoice data found.</p>";
        return;
    }

    const company = "REAL DRIP Clothing Store";
    const invoiceNumber = "INV-" + Date.now(); // Unique invoice number
    const invoiceDate = new Date().toLocaleDateString();

    let subtotal = 0;
    let html = `<h3>${company}</h3>
                <p><b>Invoice Number:</b> ${invoiceNumber}</p>
                <p><b>Date:</b> ${invoiceDate}</p>
                <p><b>TRN:</b> ${trn}</p>
                <p><b>Shipping Info:</b> ${name}, ${address}</p>
                <p><b>Payment Method:</b> ${payment}</p>
                <hr>
                <h4>Items Purchased:</h4>`;

    invoiceCart.forEach(item => {
        const lineTotal = item.price * item.qty;
        subtotal += lineTotal;
        html += `<p>${item.name} (x${item.qty}) - J$${item.price.toFixed(2)} each | Line Total: J$${lineTotal.toFixed(2)}</p>`;
    });

    const tax = subtotal * 0.15;
    const total = subtotal + tax;

    html += `<hr>
             <p>Subtotal: J$${subtotal.toFixed(2)}</p>
             <p>Tax (15%): J$${tax.toFixed(2)}</p>
             <h3>Total: J$${total.toFixed(2)}</h3>
             <p>Invoice has been sent to your email!</p>`;

    invoiceEl.innerHTML = html;

    // Append invoice to user and AllInvoices
    const users = JSON.parse(localStorage.getItem('RegistrationData')) || [];
    const userIndex = users.findIndex(u => u.trn === trn);

    if (userIndex !== -1) {
        const invoiceObj = {
            invoiceNumber,
            date: invoiceDate,
            trn,
            name,
            address,
            payment,
            items: invoiceCart,
            subtotal,
            tax,
            total
        };

        users[userIndex].invoices = users[userIndex].invoices || [];
        users[userIndex].invoices.push(invoiceObj);
        localStorage.setItem('RegistrationData', JSON.stringify(users));

        const allInvoices = JSON.parse(localStorage.getItem('AllInvoices')) || [];
        allInvoices.push(invoiceObj);
        localStorage.setItem('AllInvoices', JSON.stringify(allInvoices));
    }

    // Clear temporary invoice cart
    localStorage.removeItem("invoice_cart");
    localStorage.removeItem("invoice_name");
    localStorage.removeItem("invoice_address");
    localStorage.removeItem("invoice_payment");
}
// Run invoice generation on invoice.html load
if (document.getElementById("invoice")) {
    generateInvoice();
}



// --- Registration ---
const regForm = document.getElementById('register-form');
if (regForm) {
    regForm.addEventListener('submit', e => {
        e.preventDefault();
        const firstName = document.getElementById('reg-firstname').value.trim();
        const lastName = document.getElementById('reg-lastname').value.trim();
        const dob = document.getElementById('reg-dob').value;
        const gender = document.getElementById('reg-gender').value;
        const phone = document.getElementById('reg-phone').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const trn = document.getElementById('reg-trn').value.trim();
        const password = document.getElementById('reg-password').value.trim();
        const errorEl = document.getElementById('register-error');

        errorEl.textContent = '';
        errorEl.style.color = 'red';

        if (!firstName || !lastName || !dob || !gender || !phone || !email || !trn || !password) {
            errorEl.textContent = 'Please fill in all fields.'; return;
        }
        //Question 1. ii-v
        if (calculateAge(dob) < 18) { errorEl.textContent = 'You must be 18 or older.'; return; }
        if (!validateTRN(trn)) { errorEl.textContent = 'TRN must be 000-000-000.'; return; }
        if (!validateEmail(email)) { errorEl.textContent = 'Enter a valid email.'; return; }
        if (password.length < 8) { errorEl.textContent = 'Password must be at least 8 characters.'; return; }

        const users = JSON.parse(localStorage.getItem('RegistrationData')) || [];
        if (users.some(u => u.trn === trn)) { errorEl.textContent = 'TRN is already registered.'; return; }
        //Question 1. vi
        users.push({ firstName, lastName, dob, gender, phone, email, trn, password, cart: [], invoices: [] });
        localStorage.setItem('RegistrationData', JSON.stringify(users));

        errorEl.style.color = 'green';
        errorEl.textContent = 'Registration successful! Redirecting...';
        regForm.reset();
        setTimeout(() => window.location.href = 'login.html', 1000);
    });
}

// --- Login ---
// Question 1 b. iii
const loginForm = document.getElementById('login-form');
if (loginForm) {
    let attempts = 3;
    loginForm.addEventListener('submit', e => {
        e.preventDefault();
        const trn = document.getElementById('login-trn').value.trim();
        const password = document.getElementById('login-password').value.trim();
        const errorEl = document.getElementById('login-error');

        errorEl.textContent = '';
        errorEl.style.color = 'red';
        // Question 1 b. ii
        const users = JSON.parse(localStorage.getItem('RegistrationData')) || [];
        const user = users.find(u => u.trn === trn);
        // Question 1 b. iii
        if (!user) { errorEl.textContent = 'TRN not found.'; return; }
        if (user.password !== password) {
            attempts--;
            errorEl.textContent = `Incorrect password. ${attempts} attempt(s) remaining.`;
            if (attempts <= 0) window.location.href = 'account_locked.html';
            return;
        }

        errorEl.style.color = 'green';
        errorEl.textContent = 'Login successful! Redirecting...';
        localStorage.setItem('loggedInUser', trn);
        setTimeout(() => window.location.href = 'index.html', 1000);
    });
}

// --- Reset Password ---
const resetForm = document.getElementById('reset-form');
if (resetForm) {
    resetForm.addEventListener('submit', e => {
        e.preventDefault();
        const trn = document.getElementById('reset-trn').value.trim();
        const newPassword = document.getElementById('reset-password').value.trim();
        const errorEl = document.getElementById('reset-error');

        errorEl.textContent = '';
        errorEl.style.color = 'red';

        if (!trn || !newPassword) { errorEl.textContent = 'Please fill in all fields.'; return; }
        if (!validateTRN(trn)) { errorEl.textContent = 'TRN must be 000-000-000.'; return; }
        if (newPassword.length < 8) { errorEl.textContent = 'Password must be at least 8 characters.'; return; }

        const users = JSON.parse(localStorage.getItem('RegistrationData')) || [];
        const idx = users.findIndex(u => u.trn === trn);
        if (idx === -1) { errorEl.textContent = 'TRN not found.'; return; }

        users[idx].password = newPassword;
        localStorage.setItem('RegistrationData', JSON.stringify(users));

        errorEl.style.color = 'green';
        errorEl.textContent = 'Password reset successful! Redirecting...';
        resetForm.reset();
        setTimeout(() => window.location.href = 'login.html', 1000);
    });
}

});

// ---------- Dashboard Functionality ----------
//Question 6. a-c
document.addEventListener('DOMContentLoaded', () => {
    // Check if dashboard page elements exist
    const genderChartEl = document.getElementById('gender-chart');
    const ageChartEl = document.getElementById('age-chart');
    const searchBtn = document.getElementById('search-invoices-btn');
    const getUserBtn = document.getElementById('get-user-invoices-btn');

    if (!genderChartEl && !ageChartEl && !searchBtn && !getUserBtn) return; // Not dashboard page

    const users = JSON.parse(localStorage.getItem('RegistrationData')) || [];
    const allInvoices = JSON.parse(localStorage.getItem('AllInvoices')) || [];

    // --- Utility function ---
    const calculateAge = dob => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        if (today.getMonth() < birthDate.getMonth() ||
            (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) age--;
        return age;
    };

    // --- Gender Frequency Chart ---
    if (genderChartEl) {
        const genderCounts = users.reduce((acc, user) => {
            acc[user.gender] = (acc[user.gender] || 0) + 1;
            return acc;
        }, {});
        let html = '<h3>Gender Distribution</h3>';
        Object.keys(genderCounts).forEach(gender => {
            html += `
                <p>${gender}: ${genderCounts[gender]}</p>
                <img src="../Assets/thinbar.png" width="${genderCounts[gender]*20}px" />
            `;
        });
        genderChartEl.innerHTML = html;
    }

    // --- Age Group Frequency Chart ---
    if (ageChartEl) {
        const ageGroups = { "18-25":0, "26-35":0, "36-50":0, "50+":0 };
        users.forEach(u => {
            const age = calculateAge(u.dob);
            if (age >= 18 && age <= 25) ageGroups["18-25"]++;
            else if (age >= 26 && age <= 35) ageGroups["26-35"]++;
            else if (age >= 36 && age <= 50) ageGroups["36-50"]++;
            else if (age > 50) ageGroups["50+"]++;
        });
        let html = '<h3>Age Group Distribution</h3>';
        Object.keys(ageGroups).forEach(group => {
            html += `
                <p>${group}: ${ageGroups[group]}</p>
                <img src="../Assets/thinbar.png" width="${ageGroups[group]*20}px" />
            `;
        });
        ageChartEl.innerHTML = html;
    }

    // --- Search All Invoices by TRN ---
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            const trn = document.getElementById('search-trn').value.trim();
            const resultsEl = document.getElementById('invoice-results');
            resultsEl.innerHTML = '';

            if (!trn) { resultsEl.textContent = "Enter a TRN."; return; }

            const invoices = allInvoices.filter(inv => inv.trn === trn);
            if (invoices.length === 0) { resultsEl.textContent = "No invoices found."; return; }

            invoices.forEach(inv => {
                resultsEl.innerHTML += `
                    <div style="border:1px solid #000; margin:5px; padding:5px;">
                        <p><b>Invoice #:</b> ${inv.invoiceNumber}</p>
                        <p><b>Date:</b> ${inv.date}</p>
                        <p><b>Name:</b> ${inv.name}</p>
                        <p><b>Payment:</b> ${inv.payment}</p>
                        <p><b>Total:</b> J$${inv.total.toFixed(2)}</p>
                    </div>
                `;
            });
        });
    }

    // --- Get User's Invoices by TRN ---
    if (getUserBtn) {
        getUserBtn.addEventListener('click', () => {
            const trn = document.getElementById('user-trn').value.trim();
            const resultsEl = document.getElementById('user-invoice-results');
            resultsEl.innerHTML = '';

            if (!trn) { resultsEl.textContent = "Enter a TRN."; return; }

            const user = users.find(u => u.trn === trn);
            if (!user || !user.invoices || user.invoices.length === 0) {
                resultsEl.textContent = "No invoices found for this user."; 
                return;
            }

            user.invoices.forEach(inv => {
                resultsEl.innerHTML += `
                    <div style="border:1px solid #000; margin:5px; padding:5px;">
                        <p><b>Invoice #:</b> ${inv.invoiceNumber}</p>
                        <p><b>Date:</b> ${inv.date}</p>
                        <p><b>Payment:</b> ${inv.payment}</p>
                        <p><b>Total:</b> J$${inv.total.toFixed(2)}</p>
                    </div>
                `;
            });
        });
    }

});