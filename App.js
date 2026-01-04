document.addEventListener("DOMContentLoaded", () => {
    // --- 1. INITIAL STATE & LOCAL STORAGE ---
    let cart = JSON.parse(localStorage.getItem("gymCart")) || [];
    let totalAmount = cart.reduce((sum, item) => sum + item.price, 0);
    let discountApplied = false;

    const cartCountDisp = document.getElementById("cartCount");
    const cartItemList = document.getElementById("cartItemList");
    const cartTotalText = document.getElementById("cartTotalText");
    const prodModal = document.getElementById("productModal");
    const cartModal = document.getElementById("cartModal");
    const addBtn = document.getElementById("addToCartBtn");
    
    let currentProduct = {};

    // --- 2. THEME TOGGLE ---
    const themeBtn = document.getElementById("themeToggle");
    if (themeBtn) {
        themeBtn.addEventListener("click", () => {
            document.body.classList.toggle("light-theme");
            const isLight = document.body.classList.contains("light-theme");
            document.querySelectorAll(".nav-links a, .logo").forEach(link => {
                link.style.color = isLight ? "#000" : "#fff";
            });
        });
    }

    // --- 3. STATS COUNTER LOGIC ---
    const startCounters = () => {
        const counters = document.querySelectorAll('.counter');
        counters.forEach(counter => {
            counter.innerText = '0';
            const updateCounter = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const increment = target / 100;

                if (count < target) {
                    counter.innerText = `${Math.ceil(count + increment)}`;
                    setTimeout(updateCounter, 20);
                } else {
                    counter.innerText = target;
                }
            };
            updateCounter();
        });
    };

    // --- 4. FORM VALIDATION ---
    const signupForm = document.getElementById("signupForm");
    const formMsg = document.getElementById("formMsg");
    if (signupForm) {
        signupForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("name").value.trim();
            const age = parseInt(document.getElementById("age").value);
            if (name.length < 3) {
                formMsg.innerText = "Name must be at least 3 characters!";
                formMsg.style.color = "red";
            } else if (isNaN(age) || age > 90 || age < 10) {
                formMsg.innerText = "Age must be between 10 and 90!";
                formMsg.style.color = "red";
            } else {
                formMsg.innerText = "Welcome to the Tribe! 💪";
                formMsg.style.color = "#ffcc33";
                signupForm.reset();
            }
        });
    }

    // --- 5. UPDATE CART UI ---
    const updateCartUI = () => {
        if(cartCountDisp) cartCountDisp.innerText = cart.length;
        if(cartItemList) {
            cartItemList.innerHTML = "";
            cart.forEach((item, index) => {
                const li = document.createElement("li");
                li.style.cssText = "display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid #333; padding-bottom:8px; color:white;";
                li.innerHTML = `
                    <div style="text-align:left;">
                        <p style="margin:0; font-weight:600;">${item.name}</p>
                        <small style="color:#ffcc33;">${item.price} PKR</small>
                    </div>
                    <button onclick="removeItem(${index})" style="background:#ff4444; color:white; border:none; padding:5px 10px; border-radius:5px; cursor:pointer; font-size:12px;">Remove</button>
                `;
                cartItemList.appendChild(li);
            });
        }
        if(cartTotalText) cartTotalText.innerText = totalAmount;
        localStorage.setItem("gymCart", JSON.stringify(cart));
    };

    window.removeItem = (index) => {
        totalAmount -= cart[index].price;
        cart.splice(index, 1);
        discountApplied = false; // Reset discount if item removed
        updateCartUI();
    };

    // --- 6. PRODUCT FILTERING ---
    const filterBtns = document.querySelectorAll(".filter-btn");
    const cards = document.querySelectorAll(".product-card");
    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            const filterValue = btn.getAttribute("data-filter").toLowerCase();
            cards.forEach(card => {
                const match = filterValue === "all" || card.classList.contains(filterValue);
                card.style.display = match ? "flex" : "none";
            });
        });
    });

    // --- 7. BUY BUTTONS & PRODUCT MODAL ---
    document.querySelectorAll(".buy-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            currentProduct = {
                name: btn.dataset.name,
                price: parseInt(btn.dataset.price) || 0,
                img: btn.dataset.img,
                desc: btn.dataset.desc
            };
            document.getElementById("modalImg").src = currentProduct.img;
            document.getElementById("modalTitle").innerText = currentProduct.name;
            document.getElementById("modalDesc").innerText = currentProduct.desc || "";
            prodModal.style.display = "flex";
        });
    });

    if(addBtn) {
        addBtn.addEventListener("click", () => {
            cart.push({...currentProduct});
            totalAmount += currentProduct.price;
            discountApplied = false;
            updateCartUI();
            addBtn.innerText = "Added ✔";
            setTimeout(() => {
                prodModal.style.display = "none";
                addBtn.innerText = "Add to Cart";
            }, 600);
        });
    }

    // --- 8. DISCOUNT SYSTEM (FIXED SCOPE) ---
    const promoBtn = document.getElementById("applyPromo");
    if (promoBtn) {
        promoBtn.addEventListener("click", () => {
            const codeInput = document.getElementById("promoCode");
            const code = codeInput.value.trim().toUpperCase();
            
            if (totalAmount <= 0) {
                alert("Pehle cart mein kuch add karein!");
                return;
            }

            if (code === "SAVE10") {
                if (!discountApplied) {
                    const discountAmount = totalAmount * 0.10;
                    totalAmount -= discountAmount;
                    discountApplied = true;
                    updateCartUI();
                    
                    cartTotalText.style.color = "#ffcc33";
                    cartTotalText.innerHTML = `${totalAmount} <small>(10% OFF Applied!)</small>`;
                    alert("Mubarak ho! 10% discount mil gaya. 🎉");
                } else {
                    alert("Discount pehle hi apply ho chuka hai!");
                }
            } else {
                alert("Invalid Promo Code!");
            }
        });
    }

    // --- 9. SMART CHECKOUT ---
    const checkoutBtn = document.getElementById("checkoutBtn");
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", () => {
            if (cart.length === 0) {
                alert("Bhai, cart khali hai!");
                return;
            }

            let orderText = "Assalam-o-Alaikum U&H Fitness!%0A%0A*New Order Details:*%0A";
            cart.forEach((item, i) => {
                orderText += `${i+1}. ${item.name} - ${item.price} PKR%0A`;
            });
            
            if (discountApplied) orderText += "%0A*Discount:* 10% OFF (SAVE10 Applied) ✅";
            orderText += `%0A%0A*Total Bill: ${totalAmount} PKR*`;

            const whatsappNumber = "923127526925";
            window.open(`https://wa.me/${whatsappNumber}?text=${orderText}`, "_blank");

            cart = [];
            totalAmount = 0;
            discountApplied = false;
            updateCartUI();
            cartModal.style.display = "none";
        });
    }

    // --- 10. BMI CALCULATOR ---
    const calcBtn = document.getElementById("calcBMI");
    if (calcBtn) {
        calcBtn.addEventListener("click", () => {
            const w = parseFloat(document.getElementById("weight").value);
            const h = parseFloat(document.getElementById("height").value) / 100;
            if (w > 0 && h > 0) {
                const bmi = (w / (h * h)).toFixed(1);
                let status = (bmi < 18.5) ? "Underweight" : (bmi < 25) ? "Healthy" : (bmi < 30) ? "Overweight" : "Obese";
                document.getElementById("bmiResult").innerText = `Your BMI: ${bmi} - ${status}`;
            } else {
                alert("Sahi values enter karein!");
            }
        });
    }

    // --- 11. SCROLL REVEAL & PRELOADER ---
    const reveals = document.querySelectorAll(".reveal, .hero, .signup, .footer, .stat");
    const revealOnScroll = () => {
        reveals.forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight - 100) {
                el.classList.add("active");
            }
        });
    };

    window.addEventListener("load", () => {
        const preloader = document.getElementById("preloader");
        setTimeout(() => {
            if(preloader) preloader.classList.add("preloader-hidden");
            document.body.style.overflow = "auto";
            startCounters(); 
            revealOnScroll();
        }, 2500);
    });

    // Event Listeners & Initial setup
    window.addEventListener("scroll", revealOnScroll);
    document.getElementById("openCart").onclick = () => cartModal.style.display = "flex";
    document.getElementById("closeModal").onclick = () => prodModal.style.display = "none";
    document.getElementById("closeCart").onclick = () => cartModal.style.display = "none";



    document.body.style.overflow = "hidden";
    updateCartUI();

    // --- Hamburger Menu Toggle ---
    const hamburger = document.getElementById("hamburger");
    const navLinks = document.getElementById("navLinks");

    if (hamburger) {
        hamburger.addEventListener("click", (e) => {
            e.stopPropagation(); // Event bubble na ho
            navLinks.classList.toggle("active");
        });
    }

    // Menu ke bahar click karne se menu band ho jaye
    document.addEventListener("click", (e) => {
        if (navLinks.classList.contains("active") && !navLinks.contains(e.target) && e.target !== hamburger) {
            navLinks.classList.remove("active");
        }
    });

    // --- Cart & Modal Display Fix ---
    const openCartBtn = document.getElementById("openCart");
    if (openCartBtn) {
        openCartBtn.onclick = () => {
            cartModal.style.display = "flex";
            document.body.style.overflow = "hidden"; // Scroll band
        };
    }

    const closeCartBtn = document.getElementById("closeCart");
    if (closeCartBtn) {
        closeCartBtn.onclick = () => {
            cartModal.style.display = "none";
            document.body.style.overflow = "auto"; // Scroll wapis
        };
    }
});