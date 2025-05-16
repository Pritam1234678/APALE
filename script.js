function loco() {
    gsap.registerPlugin(ScrollTrigger);

    // Using Locomotive Scroll from Locomotive https://github.com/locomotivemtl/locomotive-scroll

    const locoScroll = new LocomotiveScroll({
        el: document.querySelector("#main"),
        smooth: true,
    });
    // each time Locomotive Scroll updates, tell ScrollTrigger to update too (sync positioning)
    locoScroll.on("scroll", ScrollTrigger.update);

    // tell ScrollTrigger to use these proxy methods for the "#main" element since Locomotive Scroll is hijacking things
    ScrollTrigger.scrollerProxy("#main", {
        scrollTop(value) {
            return arguments.length ?
                locoScroll.scrollTo(value, 0, 0) :
                locoScroll.scroll.instance.scroll.y;
        }, // we don't have to define a scrollLeft because we're only scrolling vertically.
        getBoundingClientRect() {
            return {
                top: 0,
                left: 0,
                width: window.innerWidth,
                height: window.innerHeight,
            };
        },
        // LocomotiveScroll handles things completely differently on mobile devices - it doesn't even transform the container at all! So to get the correct behavior and avoid jitters, we should pin things with position: fixed on mobile. We sense it by checking to see if there's a transform applied to the container (the LocomotiveScroll-controlled element).
        pinType: document.querySelector("#main").style.transform ?
            "transform" : "fixed",
    });

    // each time the window updates, we should refresh ScrollTrigger and then update LocomotiveScroll.
    ScrollTrigger.addEventListener("refresh", () => locoScroll.update());

    // after everything is set up, refresh() ScrollTrigger and update LocomotiveScroll because padding may have been added for pinning, etc.
    ScrollTrigger.refresh();
}
loco();

function firstPageAnimation() {
    gsap.from("#page>video", {
        scale: 0.2,
        delay: 0,
        duration: 2.3,
    });

    gsap.from("nav", {
        y: -500,
        delay: 0,
        opacity: 0,
        duration: 2,
        stagger: 9,
    });

    gsap.to("#page>video", {
        scrollTrigger: {
            trigger: `#page>video`,
            start: ` 2% top`,
            end: `bottom top`,
            scroller: `#main`,
            // markers: true,
        },
        onStart: () => {
            document.querySelector("#page>video").play();
        },
    });

    gsap.from("#page-below", {
        scale: 0.5,
        delay: 0,
        duration: 4,
        color: "#fff",
        scrollTrigger: {
            trigger: "#page-below",
            scroller: "#main",
            start: "top 84%",
        },
    });
    gsap.from("#page-bottom>h3", {
        delay: 0,
        duration: 4,
        color: "rgb(221, 218, 218)",
        scrollTrigger: {
            trigger: "#page-below",
            scroller: "#main",
            start: "top 85%",
        },
    });

    gsap.to("#page", {
        scrollTrigger: {
            trigger: `#page`,
            start: `top top`,
            end: `bottom top`,
            scroller: `#main`,
            pin: true,
        },
    });

    gsap.to("#page-bottom", {
        scrollTrigger: {
            trigger: `#page-bottom`,
            start: `5% top`,
            end: `bottom top`,
            scroller: `#main`,
            scrub: 0.5,
        },
        opacity: 0,
    });
}
firstPageAnimation();
// Character span logic while preserving <br> tags
function textAnimation() {
    let h1 = document.querySelector("#page0-content>h1");
    let newHTML = "";

    h1.childNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
            node.textContent.split("").forEach((char) => {
                newHTML += `<span>${char}</span>`;
            });
        } else {
            newHTML += node.outerHTML; // preserve <br> or any other element
        }
    });

    h1.innerHTML = newHTML;

    // GSAP scroll animation
    gsap.to("#page0-content>h1>span", {
        scrollTrigger: {
            trigger: "#page0-content>h1",
            start: "top bottom",
            end: "bottom top",
            scroller: "#main",
            scrub: 0.5,
        },
        stagger: 0.02,
        color: "green",
        opacity: 0.7,
        y: 20,
        duration: 1,
    });
}
textAnimation();

function buttono() {
    const watchBtn = document.getElementById("watch-btn");
    const closeBtn = document.getElementById("close-btn");
    const videoContainer = document.getElementById("video-container");
    const heading = document.querySelector("#page0-content h1");
    const video = document.getElementById("product-video");

    watchBtn.addEventListener("click", () => {
        // Hide heading
        gsap.to(heading, {
            duration: 0.5,
            opacity: 0,
            scale: 0.8,
            onComplete: () => {
                heading.style.display = "none";

                // Show video container and animate it
                videoContainer.style.display = "flex";
                gsap.fromTo(
                    videoContainer, { scale: 0.2, opacity: 0 }, { duration: 0.8, scale: 1, opacity: 1, ease: "power2.out" }
                );
                watchBtn.style.display = "none";
                closeBtn.style.display = "inline-block";
                video.play();
            },
        });
    });

    closeBtn.addEventListener("click", () => {
        // Hide video smoothly
        gsap.to(videoContainer, {
            duration: 0.6,
            scale: 0.2,
            opacity: 0,
            ease: "power2.in",
            onComplete: () => {
                video.pause();
                video.currentTime = 0;
                videoContainer.style.display = "none";

                // Show heading again
                heading.style.display = "block";
                gsap.fromTo(
                    heading, { opacity: 0, scale: 0.8 }, { duration: 0.6, opacity: 1, scale: 1, ease: "power2.out" }
                );
                watchBtn.style.display = "inline-block";
                closeBtn.style.display = "none";
            },
        });
    });
}
buttono();

function page1and2() {
    var tl = gsap.timeline({
        scrollTrigger: {
            trigger: `#page1`,
            start: `top top`,
            scrub: 1,
            scroller: `#main`,
            pin: true,
        },
    });

    tl.to("#page1>h1", {
        top: `-50%`,
    });

    var tl1 = gsap.timeline({
        scrollTrigger: {
            trigger: `#page2`,
            start: `top top`,
            scrub: 1,
            scroller: `#main`,
            pin: true,
        },
    });

    tl1.to("#page2>h1", {
        top: `-50%`,
    });
}
page1and2();

function sldider() {
    const upper = document.getElementById("page3-upper");
    const btn = document.getElementById("toggle-btn");
    const sliderWrapper = document.getElementById("slider-wrapper");
    const defaultImg = document.getElementById("product-img");
    const sliderImage = document.getElementById("slider-image");
    const leftBtn = document.getElementById("left-btn");
    const rightBtn = document.getElementById("right-btn");

    let isOpen = false;
    let currentImage = 1;
    const totalImages = 9;

    // Toggle slider visibility
    btn.addEventListener("click", () => {
        isOpen = !isOpen;

        if (isOpen) {
            upper.style.display = "none";
            defaultImg.style.display = "none";
            sliderWrapper.classList.add("active");
            btn.textContent = "Close It";
            currentImage = 1;
            sliderImage.src = `${currentImage}.png`;

            gsap.fromTo(
                sliderWrapper, { scale: 0.2, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.2, ease: "power2.out" }
            );
        } else {
            gsap.to(sliderWrapper, {
                scale: 0.2,
                opacity: 0,
                duration: 1.2,
                ease: "power2.in",
                onComplete: () => {
                    sliderWrapper.classList.remove("active");
                    upper.style.display = "flex";
                    defaultImg.style.display = "block";
                    btn.textContent = "+ Take a closer look";
                    gsap.set(sliderWrapper, { scale: 1, opacity: 1 });
                },
            });
        }
    });

    leftBtn.addEventListener("click", () => {
        if (currentImage > 1) {
            currentImage--;
            sliderImage.src = `${currentImage}.png`;
        }
    });

    rightBtn.addEventListener("click", () => {
        if (currentImage < totalImages) {
            currentImage++;
            sliderImage.src = `${currentImage}.png`;
        }
    });
}

sldider();

var tl2 = gsap.timeline({
    scrollTrigger: {
        trigger: `#page4`,
        start: `top top`,
        scrub: 1,
        scroller: `#main`,
        pin: true,
    },
});

tl2.to("#page4>#center-page4", {
    top: `-50%`,
});

function slider1() {
    const rightPanel = document.getElementById("right6");
    const rightText = rightPanel.querySelector("h3");
    const btn = document.getElementById("toggle-btn2");
    const sliderContainer = document.getElementById("slider-container2");
    const sliderWrapper = document.getElementById("slider-wrapper2");
    const leftPanel = document.getElementById("left6");
    const sliderImage = document.getElementById("slider-image2");
    const leftBtn = document.getElementById("left-btn2");
    const rightBtn = document.getElementById("right-btn2");
    const closeBtn = document.getElementById("slider-close-btn2");


    let isOpen = false;
    let currentImage = 1;
    const totalImages = 3;

    btn.addEventListener("click", () => {
        openSlider();
    });

    closeBtn.addEventListener("click", () => {
        closeSlider();
    });

    function openSlider() {
        sliderContainer.style.backgroundColor = "transparent"
        isOpen = true;
        rightText.style.display = "none";
        leftPanel.style.display = "none";
        btn.style.display = "none";
        sliderContainer.classList.add("active");

        currentImage = 1;
        sliderImage.src = `apps/${currentImage}.png`;

        gsap.fromTo(
            sliderWrapper, { scale: 0.2, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.5, ease: "power2.out" }
        );
    }

    function closeSlider() {
        isOpen = false;

        gsap.to(sliderWrapper, {
            scale: 0.2,
            opacity: 0,
            duration: 1.2,
            ease: "power2.in",
            onComplete: () => {
                sliderContainer.classList.remove("active");
                rightText.style.display = "block";
                leftPanel.style.display = "flex";
                btn.style.display = "block";
                gsap.set(sliderWrapper, { scale: 1, opacity: 1 });
            },
        });
    }

    leftBtn.addEventListener("click", () => {
        if (currentImage > 1) {
            currentImage--;
            sliderImage.src = `apps/${currentImage}.png`;
        }
    });

    rightBtn.addEventListener("click", () => {
        if (currentImage < totalImages) {
            currentImage++;
            sliderImage.src = `apps/${currentImage}.png`;
        }
    });
}

window.addEventListener("DOMContentLoaded", slider1);

var tl11 = gsap.timeline({
    scrollTrigger: {
        trigger: `#page5a`,
        start: `top top`,
        scrub: 1,
        scroller: `#main`,
        pin: true,
    },
});
1;

tl11.to("#page5a>h1", {
    top: `-50%`,
});

function slider2() {
    const rightPanel1 = document.getElementById("right5b");
    const rightText1 = rightPanel1.querySelector("h3");
    const btn1 = document.getElementById("toggle-btn1b");
    const sliderContainer1 = document.getElementById("slider-container1b");
    const sliderWrapper1 = document.getElementById("slider-wrapper1b");
    const leftPanel1 = document.getElementById("left5b");
    const sliderImage1 = document.getElementById("slider-image1b");
    const leftBtn1 = document.getElementById("left-btn1b");
    const rightBtn1 = document.getElementById("right-btn1b");
    const closeBtn1 = document.getElementById("slider-close-btnb");

    let isOpen1 = false;
    let currentImage1 = 1;
    const totalImages1 = 4;

    // Toggle button functionality
    btn1.addEventListener("click", () => {
        openSlider();
    });

    // Close button functionality
    closeBtn1.addEventListener("click", () => {
        closeSlider();
    });

    function openSlider() {
        isOpen1 = true;

        // Hide text and panels when slider is opened
        rightText1.style.display = "none";
        leftPanel1.style.display = "none";
        btn1.style.display = "none";
        sliderContainer1.classList.add("active");

        // Set the first image on slider
        currentImage1 = 1;
        sliderImage1.src = `productivity/${currentImage1}.jpeg`;

        // GSAP animation for slider appearance
        gsap.fromTo(
            sliderWrapper1, { scale: 0.2, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.5, ease: "power2.out" }
        );
    }

    function closeSlider() {
        isOpen1 = false;

        // GSAP animation for slider disappearance
        gsap.to(sliderWrapper1, {
            scale: 0.2,
            opacity: 0,
            duration: 1.2,
            ease: "power2.in",
            onComplete: () => {
                // Hide the slider a1nd restore the panels
                sliderContainer1.classList.remove("active");
                rightText1.style.display = "block";
                leftPanel1.style.display = "flex";
                btn1.style.display = "block";
                gsap.set(sliderWrapper1, { scale: 1, opacity: 1 });
            },
        });
    }

    // Left arrow functionality
    leftBtn1.addEventListener("click", () => {
        if (currentImage1 > 1) {
            currentImage1--;
            sliderImage1.src = `productivity/${currentImage1}.jpeg`;
        }
    });

    // Right arrow functionality
    rightBtn1.addEventListener("click", () => {
        if (currentImage1 < totalImages1) {
            currentImage1++;
            sliderImage1.src = `productivity/${currentImage1}.jpeg`;
        }
    });
}

window.onload = slider2;


var tl111 = gsap.timeline({
    scrollTrigger: {
        trigger: `#page5c`,
        start: `top top`,
        scrub: 1,
        scroller: `#main`,
        pin: true,
    },
});
1;

tl111.to("#page5c>h1", {
    top: `-50%`,
});

function slider3() {
    const rightPanel = document.getElementById("right-alpha");
    const rightText = rightPanel.querySelector("h3");
    const btn = document.getElementById("toggle-btn-alpha");
    const sliderContainer = document.getElementById("slider-container-alpha");
    const sliderWrapper = document.getElementById("slider-wrapper-alpha");
    const leftPanel = document.getElementById("left-alpha");
    const sliderImage = document.getElementById("slider-image-alpha");
    const leftBtn = document.getElementById("left-btn-alpha");
    const rightBtn = document.getElementById("right-btn-alpha");
    const closeBtn = document.getElementById("slider-close-btn-alpha");

    let isOpen = false;
    let currentImage = 1;
    const totalImages = 6;

    btn.addEventListener("click", () => {
        openSlider();
    });

    closeBtn.addEventListener("click", () => {
        closeSlider();
    });

    function openSlider() {
        isOpen = true;
        rightText.style.display = "none";
        leftPanel.style.display = "none";
        btn.style.display = "none";
        sliderContainer.classList.add("active");
        currentImage = 1;
        sliderImage.src = `images/${currentImage}.jpeg`;

        gsap.fromTo(
            sliderWrapper, { scale: 0.2, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.5, ease: "power2.out" }
        );
    }

    function closeSlider() {
        isOpen = false;

        gsap.to(sliderWrapper, {
            scale: 0.2,
            opacity: 0,
            duration: 1.2,
            ease: "power2.in",
            onComplete: () => {
                sliderContainer.classList.remove("active");
                rightText.style.display = "block";
                leftPanel.style.display = "flex";
                btn.style.display = "block";
                gsap.set(sliderWrapper, { scale: 1, opacity: 1 });
            },
        });
    }

    leftBtn.addEventListener("click", () => {
        if (currentImage > 1) {
            currentImage--;
            sliderImage.src = `images/${currentImage}.jpeg`;
        }
    });

    rightBtn.addEventListener("click", () => {
        if (currentImage < totalImages) {
            currentImage++;
            sliderImage.src = `images/${currentImage}.jpeg`;
        }
    });
}

window.addEventListener("DOMContentLoaded", slider3);

function canvas() {
    const canvas = document.querySelector("#page7>canvas");
    const context = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener("resize", function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        render();
    });

    function files(index) {
        var data = `
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0000.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0001.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0002.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0003.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0004.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0005.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0006.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0007.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0008.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0009.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0010.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0011.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0012.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0013.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0014.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0015.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0016.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0017.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0018.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0019.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0020.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0021.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0022.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0023.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0024.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0025.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0026.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0027.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0028.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0029.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0030.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0031.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0032.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0033.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0034.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0035.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0036.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0037.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0038.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0039.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0040.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0041.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0042.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0043.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0044.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0045.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0046.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0047.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0048.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0049.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0050.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0051.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0052.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0053.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0054.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0055.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0056.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0057.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0058.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0059.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0060.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0061.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0062.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0063.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0064.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0065.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0066.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0067.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0068.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0069.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0070.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0071.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0072.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0073.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0074.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0075.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0076.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0077.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0078.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0079.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0080.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0081.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0082.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0083.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0084.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0085.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0086.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0087.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0088.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0089.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0090.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0091.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0092.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0093.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0094.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0095.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0096.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0097.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0098.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0099.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0100.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0101.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0102.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0103.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0104.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0105.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0106.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0107.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0108.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0109.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0110.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0111.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0112.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0113.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0114.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0115.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0116.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0117.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0118.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0119.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0120.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0121.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0122.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0123.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0124.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0125.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0126.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0127.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0128.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0129.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0130.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0131.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0132.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0133.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0134.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0135.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0136.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0137.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0138.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0139.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0140.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0141.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0142.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0143.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0144.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0145.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0146.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0147.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0148.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0149.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0150.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0151.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0153.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0154.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0155.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0156.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0157.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0158.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0159.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0160.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0161.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0162.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0163.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0164.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0165.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0166.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0167.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0168.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0169.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0170.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0171.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0172.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0173.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0174.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0175.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0176.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0177.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0178.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0179.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0180.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0181.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0182.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0183.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0184.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0185.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0186.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0187.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0188.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0189.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0190.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0191.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0192.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0193.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0194.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0195.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0196.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0197.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0198.jpg
  https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0199.jpg
 `;
        return data.split("\n")[index];
    }

    const frameCount = 198;

    const images = [];
    const imageSeq = {
        frame: 1,
    };

    for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.src = files(i);
        images.push(img);
    }

    gsap.to(imageSeq, {
        frame: frameCount - 1,
        snap: "frame",
        ease: `none`,
        scrollTrigger: {
            scrub: 0.15,
            trigger: `#page7>canvas`,
            //   set start end according to preference
            start: `top top`,
            end: `600% top`,
            scroller: `#main`,
        },
        onUpdate: render,
    });

    images[1].onload = render;

    function render() {
        scaleImage(images[imageSeq.frame], context);
    }

    function scaleImage(img, ctx) {
        var canvas = ctx.canvas;
        var hRatio = canvas.width / img.width;
        var vRatio = canvas.height / img.height;
        var ratio = Math.min(hRatio, vRatio);
        var centerShift_x = (canvas.width - img.width * ratio) / 2;
        var centerShift_y = (canvas.height - img.height * ratio) / 2;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(
            img,
            0,
            0,
            img.width,
            img.height,
            centerShift_x,
            centerShift_y,
            img.width * ratio,
            img.height * ratio
        );
    }
    ScrollTrigger.create({
        trigger: "#page7>canvas",
        pin: true,
        // markers:true,
        scroller: `#main`,
        //   set start end according to preference
        start: `top top`,
        end: `600% top`,
    });
}
canvas();


function videoSlides() {
    const button = document.getElementById("learn-more-btn");

    button.addEventListener("click", function() {
        const overlay = document.createElement("div");
        overlay.id = "pagevideo";

        // ✅ Initial style to prevent jerk
        overlay.style.transform = "scale(0)";
        overlay.style.opacity = "0";
        overlay.style.borderRadius = "10%";

        // Create video track container
        const videoTrack = document.createElement("div");
        videoTrack.id = "video-track";

        // Create video slides
        const video1 = document.createElement("video");
        video1.classList.add("video-slide");
        video1.setAttribute("autoplay", "true");
        video1.setAttribute("loop", "true");
        video1.setAttribute("muted", "true");
        video1.innerHTML = `<source src="videos/video1.mp4" type="video/mp4" />`;

        const video2 = document.createElement("video");
        video2.classList.add("video-slide");
        video2.setAttribute("autoplay", "true");
        video2.setAttribute("loop", "true");
        video2.setAttribute("muted", "true");
        video2.innerHTML = `<source src="videos/video2.mp4" type="video/mp4" />`;

        const video3 = document.createElement("video");
        video3.classList.add("video-slide");
        video3.setAttribute("autoplay", "true");
        video3.setAttribute("loop", "true");
        video3.setAttribute("muted", "true");
        video3.innerHTML = `<source src="videos/video3.mp4" type="video/mp4" />`;

        const video4 = document.createElement("video");
        video4.classList.add("video-slide");
        video4.setAttribute("autoplay", "true");
        video4.setAttribute("loop", "true");
        video4.setAttribute("muted", "true");
        video4.innerHTML = `<source src="videos/video4.mp4" type="video/mp4" />`;

        // Append videos to the video track
        videoTrack.appendChild(video1);
        videoTrack.appendChild(video2);
        videoTrack.appendChild(video3);
        videoTrack.appendChild(video4);

        // Create navigation buttons
        const videoNav = document.createElement("div");
        videoNav.classList.add("video-nav");

        const prevButton = document.createElement("button");
        prevButton.id = "prev";
        prevButton.textContent = "⟵ Prev";

        const nextButton = document.createElement("button");
        nextButton.id = "next";
        nextButton.textContent = "Next ⟶";

        videoNav.appendChild(prevButton);
        videoNav.appendChild(nextButton);

        // Create close button
        const closeButton = document.createElement("button");
        closeButton.id = "pagevideo-close-btn";
        closeButton.textContent = "Close it";

        // Add the close button and video nav to the overlay
        overlay.appendChild(videoTrack);
        overlay.appendChild(videoNav);
        overlay.appendChild(closeButton);

        // Append the overlay to the body
        document.body.appendChild(overlay);

        // ✅ Animate in with GSAP (after appending)
        requestAnimationFrame(() => {
            gsap.to(overlay, {
                duration: 2,
                scale: 1,
                opacity: 1,
                borderRadius: "5px",
                ease: "power3.out"
            });
        });

        // Handle video slider logic
        let currentSlide = 0;
        const videos = document.querySelectorAll(".video-slide");

        function showCurrentSlide() {
            videos.forEach((video, index) => {
                video.style.display = index === currentSlide ? "block" : "none";
            });
        }

        showCurrentSlide();

        prevButton.addEventListener("click", function() {
            if (currentSlide > 0) {
                currentSlide--;
                showCurrentSlide();
            }
        });

        nextButton.addEventListener("click", function() {
            if (currentSlide < videos.length - 1) {
                currentSlide++;
                showCurrentSlide();
            }
        });

        // ✅ Animate out and remove on close
        closeButton.addEventListener("click", function() {
            gsap.to(overlay, {
                duration: 1.2,
                scale: 0,
                opacity: 0,
                borderRadius: "10%",
                ease: "power2.in",
                onComplete: () => overlay.remove()
            });
        });
    });


}

videoSlides();

function canvas1() {
    const canvas = document.querySelector("#page18>canvas");
    const context = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener("resize", function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        render();
    });

    function files(index) {
        var data = `
.//Apple vision canvas images/Vision00001.png
.//Apple vision canvas images/Vision00002.png
.//Apple vision canvas images/Vision00003.png
.//Apple vision canvas images/Vision00004.png
.//Apple vision canvas images/Vision00005.png
.//Apple vision canvas images/Vision00006.png
.//Apple vision canvas images/Vision00007.png
.//Apple vision canvas images/Vision00008.png
.//Apple vision canvas images/Vision00009.png
.//Apple vision canvas images/Vision00010.png
.//Apple vision canvas images/Vision00011.png
.//Apple vision canvas images/Vision00012.png
.//Apple vision canvas images/Vision00013.png
.//Apple vision canvas images/Vision00014.png
.//Apple vision canvas images/Vision00015.png
.//Apple vision canvas images/Vision00016.png
.//Apple vision canvas images/Vision00017.png
.//Apple vision canvas images/Vision00018.png
.//Apple vision canvas images/Vision00019.png
.//Apple vision canvas images/Vision00020.png
.//Apple vision canvas images/Vision00021.png
.//Apple vision canvas images/Vision00022.png
.//Apple vision canvas images/Vision00023.png
.//Apple vision canvas images/Vision00024.png
.//Apple vision canvas images/Vision00025.png
`;
        return data.split("\n")[index];
    }

    const frameCount = 25;

    const images = [];
    const imageSeq = {
        frame: 1,
    };

    for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.src = files(i);
        images.push(img);
    }

    gsap.to(imageSeq, {
        frame: frameCount - 1,
        snap: "frame",
        ease: `none`,
        scrollTrigger: {
            scrub: 0.15,
            trigger: `#page18`,
            //   set start end according to preference
            start: `top top`,
            end: `80% top`,
            scroller: `#main`,
        },
        onUpdate: render,
    });

    images[1].onload = render;

    function render() {
        scaleImage(images[imageSeq.frame], context);
    }

    function scaleImage(img, ctx) {
        var canvas = ctx.canvas;
        var hRatio = canvas.width / img.width;
        var vRatio = canvas.height / img.height;
        var ratio = Math.max(hRatio, vRatio);
        var centerShift_x = (canvas.width - img.width * ratio) / 2;
        var centerShift_y = (canvas.height - img.height * ratio) / 2;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(
            img,
            0,
            0,
            img.width,
            img.height,
            centerShift_x,
            centerShift_y,
            img.width * ratio,
            img.height * ratio
        );
    }
    ScrollTrigger.create({
        trigger: "#page18",
        pin: true,
        // markers:true,
        scroller: `#main`,
        //   set start end according to preference
        start: `top top`,
        end: `80% top`,
    });
}
canvas1();

var tl3 = gsap.timeline({
    scrollTrigger: {
        trigger: `#page21`,
        start: `top top`,
        scrub: 1,
        scroller: `#main`,
        pin: true,
    },
});

tl3.to("#page21>#troff", {
    opacity: 0,
});


var tl4 = gsap.timeline({
    scrollTrigger: {
        trigger: "#page22",
        start: "top top",
        scrub: 0.5,
        scroller: "#main",
        pin: true,
    },
});

tl4.to("#page22>#snroff", {
    opacity: 0,
    duration: 1
});

tl4.from("#lower22", {
    opacity: 0,
    y: 50,
    duration: 1
});


gsap.to("#page23>img", {
    scrollTrigger: {
        trigger: `#page23>img`,
        start: `top bottom`,
        end: `bottom 60%`,
        scrub: 0.5,
        scroller: `#main`,
    },
    opacity: 1,
});