// --- INITIALIZATION ---
let cart = JSON.parse(localStorage.getItem('oistNoirCart')) || [];

// --- LOGIN LOGIC ---
const loginBtn = document.getElementById('login');
if (loginBtn) {
    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const loguser = document.getElementById('loginUsername').value;
        const logpassword = document.getElementById('loginPassword').value;

        let existingUsers = JSON.parse(localStorage.getItem('oistUsers')) || [];
        const userExists = existingUsers.find(curr => curr.username === loguser && curr.password === logpassword);
        
        if (userExists) {
            sessionStorage.setItem('activeUser', userExists.username);
            alert("Login Successful! Welcome to OIST NOIR, " + userExists.username);
            window.location.href = "mainpage.html";
        } else {
            alert("Invalid Username or Password.");
        }
    });
}       

// --- REGISTRATION LOGIC ---
const registerBtn = document.getElementById('register');
if (registerBtn) {
    registerBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const user = document.getElementById('username').value;
        const pass = document.getElementById('Create-password').value;
        const confirmPass = document.getElementById('Confirm-password').value;

        if (pass !== confirmPass) { 
            return alert("Passwords don't match!");
        }

        let users = JSON.parse(localStorage.getItem('oistUsers')) || [];
        if (users.find(curr => curr.username === user)) {
            return alert("This Username already exists!"); 
        }

        users.push({ username: user, password: pass });
        localStorage.setItem('oistUsers', JSON.stringify(users));
        alert("Registration Successful!");
        window.location.href = "login.html";
    });
}

// --- ADD TO CART LOGIC ---
function addToCart(itemName, price) {
    console.log("Adding to cart:", itemName, price);
    let cart = JSON.parse(localStorage.getItem('oistNoirCart')) || [];
    
    cart.push({ name: itemName, price: price });
    localStorage.setItem('oistNoirCart', JSON.stringify(cart));
    alert(itemName + " has been added to your cart!");
}

// --- DISPLAY CART LOGIC ---
if (document.getElementById('cart-items')) {
    displayCart();
}

function displayCart() {
    const savedCart = JSON.parse(localStorage.getItem('oistNoirCart')) || [];
    const container = document.getElementById('cart-items');
    
    container.innerHTML = ""; 
    let rawSubtotal = 0;

    if (savedCart.length === 0) {
        container.innerHTML = "<tr><td colspan='5' style='text-align:center; padding:20px;'>Your cart is empty.</td></tr>";
    } else {
        // Group items to calculate Quantity
        const groupedCart = savedCart.reduce((acc, item) => {
            const found = acc.find(i => i.name === item.name);
            if (found) { found.quantity++; } 
            else { acc.push({ ...item, quantity: 1 }); }
            return acc;
        }, []);

        groupedCart.forEach((item) => {
            const itemSubtotal = item.price * item.quantity;
            rawSubtotal += itemSubtotal;

            container.innerHTML += `
                <tr>
                    <td>${item.name}</td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td>${item.quantity}</td>
                    <td>$${itemSubtotal.toFixed(2)}</td>
                    <td><button onclick="removeItem('${item.name}')" class="remove-btn">Remove</button></td>
                </tr>`;
        });
    }

    // Math Calculations
    const discount = rawSubtotal > 500 ? rawSubtotal * 0.10 : 0;
    const preTax = rawSubtotal - discount;
    const tax = preTax * 0.15; // 15% GCT
    const grandTotal = preTax + tax;

    // Update Totals
    document.getElementById('raw-subtotal').innerText = rawSubtotal.toFixed(2);
    document.getElementById('discount').innerText = discount.toFixed(2);
    document.getElementById('tax').innerText = tax.toFixed(2);
    document.getElementById('grand-total').innerText = grandTotal.toFixed(2);
}

// --- REMOVE & CLEAR LOGIC ---
function removeItem(itemName) {
    let cart = JSON.parse(localStorage.getItem('oistNoirCart')) || [];
    const updatedCart = cart.filter(item => item.name !== itemName);
    localStorage.setItem('oistNoirCart', JSON.stringify(updatedCart));
    displayCart();
}

function clearCart() {
    localStorage.removeItem('oistNoirCart');
    displayCart();
    alert("Cart cleared.");
}

function proceedToCheckout() {
    const savedCart = JSON.parse(localStorage.getItem('oistNoirCart')) || [];
    if (savedCart.length === 0) {
        alert("Your cart is empty!");
    } else {
        window.location.href = "checkout.html";
    }
}

// Add this check for the Checkout Page
if (document.getElementById('checkout-list')) {
    updateCheckoutDisplay();
}

function updateCheckoutDisplay() {
    const savedCart = JSON.parse(localStorage.getItem('oistNoirCart')) || [];
    const list = document.getElementById('checkout-list');
    
    let subtotal = 0;
    list.innerHTML = "";

    savedCart.forEach(item => {
        subtotal += item.price;
        list.innerHTML += `<p><span>${item.name}</span> <span>$${item.price.toFixed(2)}</span></p>`;
    });

    const tax = subtotal * 0.15;
    const total = subtotal + tax;

    document.getElementById('check-sub').innerText = `$${subtotal.toFixed(2)}`;
    document.getElementById('check-tax').innerText = `$${tax.toFixed(2)}`;
    document.getElementById('check-total').innerText = `$${total.toFixed(2)}`;
    document.getElementById('pay-amount').value = total.toFixed(2);
}

// Payment Success Process
const payForm = document.getElementById('payment-form');
if (payForm) {
    payForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = document.querySelector('.confirm-btn');
        const name = document.getElementById('ship-name').value;

        btn.innerText = "Processing Payment...";
        btn.disabled = true;

        // Simulate 2 second payment processing
        setTimeout(() => {
            alert(`Payment Successful! Thank you, ${name}. Your order has been placed.`);
            localStorage.removeItem('oistNoirCart'); // Clear cart after success
            window.location.href = "mainpage.html";
        }, 2000);
    });
}
