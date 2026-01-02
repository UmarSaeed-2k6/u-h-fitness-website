// COUNTER ANIMATION
const counters = document.querySelectorAll('.counter');

counters.forEach(counter => {
    const updateCounter = () => {
        const target = +counter.getAttribute('data-target');
        const current = +counter.innerText;
        const increment = target / 80;

        if (current < target) {
            counter.innerText = Math.ceil(current + increment);
            setTimeout(updateCounter, 30);
        } else {
            counter.innerText = target + "+";
        }
    };
    updateCounter();
});

// FORM VALIDATION
const form = document.getElementById("signupForm");
const msg = document.getElementById("formMsg");

form.addEventListener("submit", e => {
    e.preventDefault();

    if (
        form.name.value === "" ||
        form.email.value === "" ||
        form.age.value === ""
    ) {
        msg.style.color = "red";
        msg.innerText = "Please fill all fields!";
    } else {
        msg.style.color = "#ffcc33";
        alert("Welcome to U&H Fitness 💪");
        form.reset();
    }
});

// ✅ HAMBURGER MENU (FORM SE BAHAR)
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
});