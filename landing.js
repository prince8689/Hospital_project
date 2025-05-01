 // Animate cards on load
 document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.unique_slide');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.classList.add('visible');
        }, index * 200);
    });
});

// for slider starting
let index = 0;
const slides = document.querySelectorAll(".unique_slide");
const dots = document.querySelectorAll(".unique_dot");
const progressBars = document.querySelectorAll(".unique_progress_bar");
let slideInterval;
const slideTime = 5000; // 5 seconds per slide

function showSlide(n) {
    if (n >= slides.length) index = 0;
    if (n < 0) index = slides.length - 1;

    const newTransform = -index * 100 + "%";
    document.querySelector(".unique_slider").style.transform = "translateX(" + newTransform + ")";

    // Update dots
    dots.forEach(dot => dot.classList.remove("active"));
    dots[index].classList.add("active");
    
    // Reset all progress bars
    progressBars.forEach(bar => {
        bar.style.width = "0";
    });
    
    // Start the progress bar for current slide
    progressBars[index].style.width = "100%";
    
    // Reset timer
    clearInterval(slideInterval);
    startSlideTimer();
}

function moveSlide(n) {
    index += n;
    showSlide(index);
}

function currentSlide(n) {
    index = n;
    showSlide(index);
}

function startSlideTimer() {
    slideInterval = setInterval(() => moveSlide(1), slideTime);
}

// Initialize slider
showSlide(index);
startSlideTimer();

// Pause autoplay on hover
document.querySelector(".unique_slider_container").addEventListener("mouseenter", () => {
    clearInterval(slideInterval);
    progressBars[index].style.transition = "none";
    progressBars[index].style.width = progressBars[index].offsetWidth + "px";
});

// Resume autoplay on mouse leave
document.querySelector(".unique_slider_container").addEventListener("mouseleave", () => {
    progressBars[index].style.transition = "width 3s linear";
    progressBars[index].style.width = "100%";
    startSlideTimer();
});
// for contact form
// for smooth scrolling
// JavaScript for smooth scrolling
document.getElementById("custom_about-link").addEventListener("click", function(event) {
    event.preventDefault(); // Default anchor behavior ko rokta hai
    document.getElementById("particles").scrollIntoView({ behavior: "smooth" });
});
document.getElementById("custom_stories-link").addEventListener("click", function(event) {
    event.preventDefault(); // Default anchor behavior ko rokta hai
    document.getElementById("unique_stories").scrollIntoView({ behavior: "smooth" });
});
document.getElementById("custom_Service-link").addEventListener("click", function(event) {
    event.preventDefault(); // Default anchor behavior ko rokta hai
    document.getElementById("services").scrollIntoView({ behavior: "smooth" });
});
document.getElementById("custom_Contact-link").addEventListener("click", function(event) {
    event.preventDefault(); // Default anchor behavior ko rokta hai
    document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
});
