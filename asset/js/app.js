// ======================================================
// GSAP + SCROLLTRIGGER
// ======================================================

gsap.registerPlugin(ScrollTrigger);


// ======================================================
// LENIS - SMOOTH SCROLL
// ======================================================

const lenis = new Lenis({
    smoothWheel: true,
    lerp: 0.1
});

lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);


// ======================================================
// HERO PORTRAIT - MOUSE MOVEMENT
// ======================================================

const portrait = document.querySelector(".portrait");

if (portrait) {

    window.addEventListener("mousemove", (event) => {

        const x =
            (event.clientX / window.innerWidth) - 0.5;

        const y =
            (event.clientY / window.innerHeight) - 0.5;

        gsap.to(portrait, {

            x: -x * 48,
            y: -y * 34,

            rotation: -x * 1.5,

            duration: 0.95,

            ease: "power3.out",

            overwrite: "auto"

        });

    });

}



// ======================================================
// MAIN WEBSITE
// ======================================================

(() => {

    "use strict";


    // ==================================================
    // DATA
    // ==================================================

    const data = window.PORTFOLIO;

    if (!data) return;


    // ==================================================
    // HELPERS
    // ==================================================

    const $ = (selector, root = document) =>
        root.querySelector(selector);


    const $$ = (selector, root = document) =>
        [...root.querySelectorAll(selector)];


    const escape = value =>
        String(value).replace(
            /[&<>"']/g,
            character => ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            }[character])
        );


    const number = index =>
        String(index + 1).padStart(2, "0");


    const safeExternal = value => {

        try {

            const url = new URL(value);

            return ["https:", "http:"]
                .includes(url.protocol)
                ? url.href
                : null;

        } catch {

            return null;

        }

    };



    // ==================================================
    // PROJECT VISUAL
    // ==================================================

    function setVisual(element, project) {

        if (!element || !project) return;


        element.style.backgroundImage =
            `url(${JSON.stringify(project.image)})`;


        element.style.backgroundPosition =
            project.position || "center";


        element.classList.toggle(
            "individual",
            !project.position
        );


        element.setAttribute(
            "aria-label",
            `${project.client} — ${project.category}, demonstration artwork`
        );

    }



    // ==================================================
    // SERVICES
    // ==================================================

    const serviceList = $("#service-list");

    if (serviceList) {

        serviceList.innerHTML =
            data.services.map((service, i) => `

                <article class="service reveal">

                    <span
                        class="service-number"
                        aria-hidden="true"
                    >
                        ${number(i)}
                    </span>

                    <div>

                        <h3>
                            ${escape(service.title)}
                        </h3>

                        <p>
                            ${escape(service.text)}
                        </p>

                    </div>

                    <a
                        class="service-arrow"
                        aria-label="Enquire about ${escape(service.title)}"
                    >
                        ↗
                    </a>

                </article>

            `).join("");

    }



    // ==================================================
    // PROJECT LIST
    // ==================================================

    const projectList = $("#project-list");

    if (projectList) {

        projectList.innerHTML =
            data.projects.map((project, i) => `

                <article
                    class="project-card reveal"
                    id="project-${escape(project.id)}"
                >

                    <header class="project-header">

                        <span
                            class="project-number"
                            aria-hidden="true"
                        >
                            ${number(i)}
                        </span>

                        <div class="project-client">

                            <h3>
                                ${escape(project.client)}
                            </h3>

                            <p>
                                ${escape(project.category)}
                            </p>

                        </div>

                        <button
                            type="button"
                            class="outline-button"
                            data-project="${i}"
                            aria-label="View project: ${escape(project.name)}"
                        >
                            View project ↗
                        </button>

                    </header>


                    <div class="project-images">

                        <button
                            type="button"
                            class="project-image-button"
                            data-project="${i}"
                            aria-label="Open ${escape(project.name)}"
                        >

                            <span
                                class="visual"
                                data-visual="${i}"
                                role="img"
                            ></span>

                        </button>


                        <div class="project-side-images">

                            <button
                                type="button"
                                class="project-image-button"
                                data-project="${i}"
                                aria-label="View ${escape(project.client)} detail"
                            >

                                <span
                                    class="visual detail-visual"
                                    data-visual="${i}"
                                    role="img"
                                ></span>

                            </button>


                            <button
                                type="button"
                                class="project-image-button"
                                data-project="${i}"
                                aria-label="View ${escape(project.client)} close-up"
                            >

                                <span
                                    class="visual detail-visual second"
                                    data-visual="${i}"
                                    role="img"
                                ></span>

                            </button>

                        </div>

                    </div>

                </article>

            `).join("");

    }



    // ==================================================
    // MOSAIC
    // ==================================================

    const mosaicOrder =
        [3, 0, 1, 2, 4, 0, 1, 3,4,3,1,0]
            .filter(index => data.projects[index]);


    const mosaic = $("#mosaic");


    if (mosaic) {

        mosaic.innerHTML =
            mosaicOrder.map(index => `

                <button
                    type="button"
                    class="mosaic-card"
                    data-project="${index}"
                    aria-label="Explore ${escape(data.projects[index].name)}"
                >

                    <span
                        class="visual"
                        data-visual="${index}"
                        role="img"
                    ></span>

                </button>

            `).join("");

    }



    // ==================================================
    // SET ALL PROJECT IMAGES
    // ==================================================

    $$("[data-visual]").forEach(element => {

        const projectIndex =
            Number(element.dataset.visual);


        setVisual(
            element,
            data.projects[projectIndex]
        );

    });
    initProjectsStackEffect();



    // ==================================================
    // SHOWCASE ANIMATION
    // IMPORTANT:
    // Must run AFTER mosaic cards are created
    // ==================================================
    // حركة الـ Showcase الموجودة عندك
    initShowcaseSlider();




    
    // ==================================================
    // REVIEWS
    // ==================================================



    const reviews = $("#reviews");


    if (reviews) {

        reviews.innerHTML =
            data.reviews.map(review => `

                <article class="review-card">

                    <blockquote>
                        “${escape(review.quote)}”
                    </blockquote>

                    <div class="review-author">

                        <span
                            class="avatar"
                            aria-hidden="true"
                        >
                            ${escape(review.initials)}
                        </span>

                        <div>

                            <strong>
                                ${escape(review.name)}
                            </strong>

                            <small>
                                ${escape(review.role)}
                            </small>

                        </div>

                    </div>

                </article>

            `).join("");

    }



    // ==================================================
    // CONTACT DATA
    // ==================================================

    $$("[data-email]").forEach(link => {

        link.textContent = data.email;

        link.href =
            `mailto:${data.email}`;

    });


    const phoneLink =
        $("#phone-link");


    if (phoneLink) {

        phoneLink.textContent =
            data.phone;


        phoneLink.href =
            `tel:${data.phone.replace(/[^\d+]/g, "")}`;

    }


    const locationText =
        $("#location-text");


    if (locationText) {

        locationText.textContent =
            data.location;

    }


    const year =
        $("#year");


    if (year) {

        year.textContent =
            new Date().getFullYear();

    }


    const socialLinks =
        $("#social-links");


    if (socialLinks) {

        socialLinks.innerHTML =
            data.socials
                .filter(item =>
                    safeExternal(item.url)
                )
                .map(item => `

                    <a
                        href="${escape(safeExternal(item.url))}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        ${escape(item.label)} ↗
                    </a>

                `)
                .join("");

    }



    // ==================================================
    // NAVIGATION
    // ==================================================

    const menuButton =
        $(".menu-toggle");


    const navigation =
        $("#navigation");


    function closeMenu() {

        if (!navigation || !menuButton) return;


        navigation.classList.remove(
            "is-open"
        );


        menuButton.setAttribute(
            "aria-expanded",
            "false"
        );


        menuButton.setAttribute(
            "aria-label",
            "Open navigation"
        );

    }


    if (menuButton && navigation) {

        menuButton.addEventListener(
            "click",
            () => {

                const open =
                    menuButton.getAttribute(
                        "aria-expanded"
                    ) !== "true";


                navigation.classList.toggle(
                    "is-open",
                    open
                );


                menuButton.setAttribute(
                    "aria-expanded",
                    String(open)
                );


                menuButton.setAttribute(
                    "aria-label",
                    open
                        ? "Close navigation"
                        : "Open navigation"
                );

            }
        );


        $$("a", navigation)
            .forEach(link => {

                link.addEventListener(
                    "click",
                    closeMenu
                );

            });


        document.addEventListener(
            "click",
            event => {

                if (
                    !event.target.closest(
                        ".site-header"
                    )
                ) {

                    closeMenu();

                }

            }
        );


        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Escape" &&
                    navigation.classList.contains(
                        "is-open"
                    )
                ) {

                    closeMenu();

                    menuButton.focus();

                }

            }
        );


        window
            .matchMedia("(min-width: 601px)")
            .addEventListener(
                "change",
                event => {

                    if (event.matches) {

                        closeMenu();

                    }

                }
            );

    }



    // ==================================================
    // MOTION PREFERENCE
    // ==================================================

    const motionQuery =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );


    const motionButton =
        $(".motion-toggle");


    let storedMotion = null;


    try {

        storedMotion =
            localStorage.getItem(
                "ahmed-motion"
            );

    } catch {

        // Storage unavailable.

    }


    let motionPaused =
        motionQuery.matches ||
        storedMotion === "paused";


    function updateMotion() {

        document.documentElement
            .classList.toggle(
                "motion-paused",
                motionPaused
            );


        if (!motionButton) return;


        motionButton.setAttribute(
            "aria-pressed",
            String(motionPaused)
        );


        motionButton.title =
            motionPaused
                ? "Enable animations"
                : "Pause animations";


        motionButton.setAttribute(
            "aria-label",
            motionButton.title
        );


        const icon =
            $("span", motionButton);


        if (icon) {

            icon.textContent =
                motionPaused
                    ? "▶"
                    : "Ⅱ";

        }


        if (motionPaused) {

            $$(".is-pending")
                .forEach(element => {

                    element.classList.remove(
                        "is-pending"
                    );

                });

        }

    }


    updateMotion();


    if (motionButton) {

        motionButton.addEventListener(
            "click",
            () => {

                motionPaused =
                    !motionPaused;


                updateMotion();


                try {

                    localStorage.setItem(
                        "ahmed-motion",
                        motionPaused
                            ? "paused"
                            : "enabled"
                    );

                } catch {

                    // Ignore.

                }

            }
        );

    }


    motionQuery.addEventListener(
        "change",
        event => {

            motionPaused =
                event.matches;

            updateMotion();

        }
    );



    // ==================================================
    // INTERSECTION OBSERVER
    // ==================================================

    if ("IntersectionObserver" in window) {

        const revealObserver =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target
                                .classList.remove(
                                    "is-pending"
                                );


                            revealObserver
                                .unobserve(
                                    entry.target
                                );

                        }

                    });

                },
                {
                    threshold: 0.08
                }
            );


        if (!motionPaused) {

            $$(".reveal")
                .forEach(element => {

                    if (
                        element
                            .getBoundingClientRect()
                            .top >
                        window.innerHeight
                    ) {

                        element.classList.add(
                            "is-pending"
                        );


                        revealObserver.observe(
                            element
                        );

                    }

                });

        }


        const sectionObserver =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            $$("#navigation a")
                                .forEach(link => {

                                    link.removeAttribute(
                                        "aria-current"
                                    );

                                });


                            const activeLink =
                                $(
                                    `#navigation a[href="#${entry.target.id}"]`
                                );


                            if (activeLink) {

                                activeLink.setAttribute(
                                    "aria-current",
                                    "location"
                                );

                            }

                        }

                    });

                },
                {
                    rootMargin:
                        "-10% 0px -55% 0px",

                    threshold: 0
                }
            );


        $$("main section[id]")
            .forEach(section => {

                sectionObserver.observe(
                    section
                );

            });

    }



    // ==================================================
    // PROJECT DIALOG
    // ==================================================

    const dialog =
        $("#project-dialog");


    let activeProject = 0;

    let returnFocus = null;


    function showProject(index) {

        if (
            !dialog ||
            !data.projects.length
        ) return;


        activeProject =
            (
                index +
                data.projects.length
            ) %
            data.projects.length;


        const project =
            data.projects[activeProject];


        const dialogCategory =
            $("#dialog-category");


        const dialogTitle =
            $("#dialog-title");


        const dialogImage =
            $("#dialog-image");


        const dialogDescription =
            $("#dialog-description");


        const dialogDeliverables =
            $("#dialog-deliverables");


        const cta =
            $("#dialog-cta");


        if (dialogCategory) {

            dialogCategory.textContent =
                `${number(activeProject)} / ${project.category}`;

        }


        if (dialogTitle) {

            dialogTitle.textContent =
                project.name;

        }


        if (dialogImage) {

            setVisual(
                dialogImage,
                project
            );

        }


        if (dialogDescription) {

            dialogDescription.textContent =
                project.description;

        }


        if (dialogDeliverables) {

            dialogDeliverables.textContent =
                project.deliverables;

        }


        if (cta) {

            const external =
                safeExternal(project.url);


            cta.href =
                external || "#contact";


            cta.textContent =
                external
                    ? "Visit live project ↗"
                    : "Start a similar project ↗";


            if (external) {

                cta.target =
                    "_blank";


                cta.rel =
                    "noopener noreferrer";

            } else {

                cta.removeAttribute(
                    "target"
                );


                cta.removeAttribute(
                    "rel"
                );

            }

        }


        if (!dialog.open) {

            returnFocus =
                document.activeElement;


            dialog.showModal();


            document.body
                .classList.add(
                    "body-locked"
                );


            const closeButton =
                $(".dialog-close");


            if (closeButton) {

                closeButton.focus();

            }

        }


        dialog.scrollTop = 0;

    }


    $$("[data-project]")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    showProject(
                        Number(
                            button.dataset.project
                        )
                    );

                }
            );

        });


    const dialogClose =
        $(".dialog-close");


    if (dialogClose && dialog) {

        dialogClose.addEventListener(
            "click",
            () => {

                dialog.close();

            }
        );

    }


    if (dialog) {

        dialog.addEventListener(
            "click",
            event => {

                if (
                    event.target === dialog
                ) {

                    const bounds =
                        dialog.getBoundingClientRect();


                    if (
                        event.clientX <
                            bounds.left ||

                        event.clientX >
                            bounds.right ||

                        event.clientY <
                            bounds.top ||

                        event.clientY >
                            bounds.bottom
                    ) {

                        dialog.close();

                    }

                }

            }
        );


        dialog.addEventListener(
            "close",
            () => {

                document.body
                    .classList.remove(
                        "body-locked"
                    );


                if (
                    returnFocus
                        ?.isConnected
                ) {

                    returnFocus.focus({
                        preventScroll: true
                    });

                }

            }
        );

    }


    $("#project-prev")
        ?.addEventListener(
            "click",
            () => {

                showProject(
                    activeProject - 1
                );

            }
        );


    $("#project-next")
        ?.addEventListener(
            "click",
            () => {

                showProject(
                    activeProject + 1
                );

            }
        );


    $("#dialog-cta")
        ?.addEventListener(
            "click",
            event => {

                if (
                    !safeExternal(
                        data.projects[
                            activeProject
                        ].url
                    )
                ) {

                    event.preventDefault();


                    dialog?.close();


                    document
                        .querySelector(
                            "#contact"
                        )
                        ?.scrollIntoView({

                            behavior:
                                motionPaused
                                    ? "instant"
                                    : "smooth"

                        });


                    $("#full-name")
                        ?.focus({
                            preventScroll: true
                        });

                }

            }
        );



    // ==================================================
    // REVIEWS SLIDER
    // ==================================================
// ======================================================
// TESTIMONIALS - 3 ROW SCROLLING EFFECT
// ======================================================
// ======================================================
// TESTIMONIALS
// VIDEO-LIKE SCROLL MOVEMENT
// ======================================================

function initTestimonialsSection() {

    const section =
        document.querySelector("#testimonials");

    if (!section) return;


    const track1 =
        section.querySelector("#reviews-row-1");

    const track2 =
        section.querySelector("#reviews-row-2");

    const track3 =
        section.querySelector("#reviews-row-3");


    if (!track1 || !track2 || !track3) {
        return;
    }


    const portfolioData =
        window.PORTFOLIO;


    if (
        !portfolioData?.reviews?.length
    ) {
        return;
    }


    const reviews =
        portfolioData.reviews;


    // ==================================================
    // ESCAPE
    // ==================================================

    const escapeHTML = value =>

        String(value).replace(
            /[&<>"']/g,

            char => ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            }[char])
        );


    // ==================================================
    // CARD
    // ==================================================

    function createReviewCard(review) {

        return `
            <article class="review-card">

                <blockquote>
                    “${escapeHTML(review.quote)}”
                </blockquote>

                <div class="review-author">

                    <span
                        class="avatar"
                        aria-hidden="true"
                    >
                        ${escapeHTML(review.initials)}
                    </span>

                    <div>

                        <strong>
                            ${escapeHTML(review.name)}
                        </strong>

                        <small>
                            ${escapeHTML(review.role)}
                        </small>

                    </div>

                </div>

            </article>
        `;
    }


    // ==================================================
    // CHANGE ORDER
    // ==================================================

    function shiftArray(array, amount) {

        const shift =
            amount % array.length;

        return [
            ...array.slice(shift),
            ...array.slice(0, shift)
        ];
    }


    const reviews1 =
        [...reviews];

    const reviews2 =
        shiftArray(reviews, 2);

    const reviews3 =
        shiftArray(reviews, 4);


    // ==================================================
    // BUILD LONG ROW
    // ==================================================

    function buildTrack(source) {

        const result = [];

        /*
          Enough cards so the sides never become empty.
        */

        const amount = 24;


        for (
            let i = 0;
            i < amount;
            i++
        ) {

            result.push(
                source[
                    i % source.length
                ]
            );

        }


        return result
            .map(createReviewCard)
            .join("");
    }


    track1.innerHTML =
        buildTrack(reviews1);

    track2.innerHTML =
        buildTrack(reviews2);

    track3.innerHTML =
        buildTrack(reviews3);


    // ==================================================
    // REMOVE OLD ANIMATIONS
    // ==================================================

    ScrollTrigger
        .getAll()
        .filter(trigger =>
            trigger.vars.id?.startsWith(
                "reviews-"
            )
        )
        .forEach(trigger =>
            trigger.kill()
        );


    gsap.killTweensOf([
        track1,
        track2,
        track3
    ]);


    // ==================================================
    // STARTING POSITIONS
    // ==================================================

    gsap.set(track1, {
        x: "-6vw",
        force3D: true
    });


    gsap.set(track2, {
        x: "-38vw",
        force3D: true
    });


    gsap.set(track3, {
        x: "-8vw",
        force3D: true
    });


    // ==================================================
    // PHASE 1
    //
    // ROW 1 + ROW 2
    //
    // أول ما ندخل القسم:
    //
    // 1 ←
    // 2 →
    // ==================================================

    gsap.to(
        track1,
        {
            x: "-48vw",

            ease: "none",

            scrollTrigger: {

                id:
                    "reviews-row-1",

                trigger:
                    track1.closest(
                        ".review-row"
                    ),

                start:
                    "top 95%",

                end:
                    "bottom 20%",

                scrub:
                    1.2,

                invalidateOnRefresh:
                    true

            }
        }
    );


    gsap.to(
        track2,
        {
            x: "-5vw",

            ease: "none",

            scrollTrigger: {

                id:
                    "reviews-row-2-first",

                /*
                  نربط البداية بالصف الأول
                  حتى يتحرك 1 و 2 معًا.
                */

                trigger:
                    track1.closest(
                        ".review-row"
                    ),

                start:
                    "top 95%",

                end:
                    "bottom 20%",

                scrub:
                    1.2,

                invalidateOnRefresh:
                    true

            }
        }
    );


    // ==================================================
    // PHASE 2
    //
    // لما ننزل أكثر:
    //
    // ROW 2 + ROW 3
    //
    // 2 →
    // 3 ←
    // ==================================================

    gsap.to(
        track2,
        {
            x: "18vw",

            ease: "none",

            scrollTrigger: {

                id:
                    "reviews-row-2-second",

                trigger:
                    track2.closest(
                        ".review-row"
                    ),

                start:
                    "top 80%",

                end:
                    "bottom 15%",

                scrub:
                    1.2,

                invalidateOnRefresh:
                    true

            }
        }
    );


    gsap.to(
        track3,
        {
            x: "-50vw",

            ease: "none",

            scrollTrigger: {

                id:
                    "reviews-row-3",

                /*
                  نفس Trigger تبع الصف الثاني:
                  يعني لما نوصل للمنطقة الثانية
                  يبدأ الصف الثالث معه.
                */

                trigger:
                    track2.closest(
                        ".review-row"
                    ),

                start:
                    "top 80%",

                end:
                    "bottom 15%",

                scrub:
                    1.2,

                invalidateOnRefresh:
                    true

            }
        }
    );


    // ==================================================
    // REFRESH
    // ==================================================

    requestAnimationFrame(() => {

        ScrollTrigger.refresh();

    });

}


// ======================================================
// RUN
// ======================================================

initTestimonialsSection();

    // ==================================================
    // CONTACT FORM
    // ==================================================

    const form =
        $("#contact-form");


    if (form) {

        const validation = [

            {

                input:
                    $("#full-name"),

                error:
                    $("#name-error"),

                check:
                    value =>
                        value.trim().length >= 2,

                message:
                    "Please enter your name (at least 2 characters)."

            },

            {

                input:
                    $("#email"),

                error:
                    $("#email-error"),

                check:
                    value =>
                        value.trim().length > 0 &&
                        $("#email").validity.valid,

                message:
                    "Please enter a valid email address."

            },

            {

                input:
                    $("#message"),

                error:
                    $("#message-error"),

                check:
                    value =>
                        value.trim().length >= 10,

                message:
                    "Please add a few details (at least 10 characters)."

            }

        ];


        function validate(field) {

            const valid =
                field.check(
                    field.input.value
                );


            field.input.setAttribute(
                "aria-invalid",
                String(!valid)
            );


            field.error.textContent =
                valid
                    ? ""
                    : field.message;


            return valid;

        }


        validation.forEach(field => {

            field.input.addEventListener(
                "input",
                () => {

                    if (
                        field.input
                            .hasAttribute(
                                "aria-invalid"
                            )
                    ) {

                        validate(field);

                    }

                }
            );

        });


        form.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                const invalid =
                    validation.filter(
                        field =>
                            !validate(field)
                    );


                if (invalid.length) {

                    const status =
                        $("#form-status");


                    if (status) {

                        status.textContent =
                            "Please check the highlighted fields.";

                    }


                    invalid[0]
                        .input
                        .focus();


                    return;

                }


                const name =
                    $("#full-name")
                        .value
                        .trim();


                const email =
                    $("#email")
                        .value
                        .trim();


                const phone =
                    $("#phone")
                        ?.value
                        .trim() || "";


                const message =
                    $("#message")
                        .value
                        .trim();


                const subject =
                    `Portfolio enquiry from ${name}`;


                const body =
                    `Name: ${name}\n` +
                    `Email: ${email}\n` +
                    `${phone ? `Phone: ${phone}\n` : ""}` +
                    `\n${message}`;


                const emailDraft =
                    $("#email-draft");


                if (emailDraft) {

                    emailDraft.value =
                        `Subject: ${subject}\n\n${body}`;

                }


                const fallback =
                    $("#email-fallback");


                if (fallback) {

                    fallback.hidden =
                        false;

                }


                const status =
                    $("#form-status");


                if (status) {

                    status.textContent =
                        "Your draft is ready. Complete sending in your email app, or use the copy below.";

                }


                const mailto =
                    `mailto:${data.email}` +
                    `?subject=${encodeURIComponent(subject)}` +
                    `&body=${encodeURIComponent(body)}`;


                if (
                    mailto.length <= 1900
                ) {

                    window.location.href =
                        mailto;

                } else if (status) {

                    status.textContent =
                        "Your message is ready. Copy the draft below and paste it into your email app.";

                }

            }
        );

    }



    // ==================================================
    // COPY MESSAGE
    // ==================================================

    $("#copy-message")
        ?.addEventListener(
            "click",
            async () => {

                const draft =
                    $("#email-draft");


                const status =
                    $("#form-status");


                if (!draft) return;


                try {

                    if (
                        !navigator
                            .clipboard
                            ?.writeText
                    ) {

                        throw new Error(
                            "Clipboard unavailable"
                        );

                    }


                    await navigator
                        .clipboard
                        .writeText(
                            draft.value
                        );


                    if (status) {

                        status.textContent =
                            "Message copied. Paste it into your email app to send.";

                    }

                } catch {

                    draft.focus();

                    draft.select();


                    if (status) {

                        status.textContent =
                            "The message is selected. Press Ctrl+C (or Copy on mobile), then paste it into your email app.";

                    }

                }

            }
        );



    // ==================================================
    // SHOWCASE
    //
    // TOP BRAND STRIP      ←
    // MOSAIC ROW 1         ←
    // MOSAIC ROW 2         →
    //
    // #mosaic ITSELF DOES NOT MOVE.
    // This preserves your existing CSS:
    //
    // transform:
    // translateX(-50%) rotate(-2deg)
    // ==================================================

    function initShowcaseSlider() {

        const showcase =
            document.querySelector(
                "#showcase"
            );


        const sliderTop =
            document.querySelector(
                ".brand-strip"
            );


        const mosaicElement =
            document.querySelector(
                "#mosaic"
            );


        if (
            !showcase ||
            !sliderTop ||
            !mosaicElement
        ) return;



        // ----------------------------------------------
        // Remove old ScrollTrigger if function reruns
        // ----------------------------------------------

        const previousTrigger =
            ScrollTrigger.getById(
                "showcase-slider"
            );


        if (previousTrigger) {

            previousTrigger.kill();

        }



        // ----------------------------------------------
        // MOSAIC CARDS
        //
        // CSS:
        // grid-template-columns: repeat(4, 1fr)
        //
        // therefore:
        //
        // 0-3 = first row
        // 4-7 = second row
        // 8   = last card
        // ----------------------------------------------

        const mosaicCards =
            gsap.utils.toArray(
                "#mosaic .mosaic-card"
            );


        const mosaicRowOne =
            mosaicCards.slice(0, 4);


        const mosaicRowTwo =
            mosaicCards.slice(4, 8);


        const mosaicLast =
            mosaicCards.slice(8);



        // ----------------------------------------------
        // TOP SLIDER DISTANCE
        // ----------------------------------------------

        const getTopDistance = () => {

            return Math.max(

                0,

                sliderTop.scrollWidth -
                    showcase.clientWidth

            );

        };



        // ----------------------------------------------
        // INITIAL POSITIONS
        // ----------------------------------------------

        gsap.set(
            sliderTop,
            {
                x: 0
            }
        );


        /*
            IMPORTANT:

            DO NOT USE:

            gsap.set(mosaicElement, { x: ... })

            because your CSS already has:

            transform:
            translateX(-50%) rotate(-2deg)

            We leave #mosaic completely untouched.
        */


        // First mosaic row starts slightly right

        gsap.set(
            mosaicRowOne,
            {
                x: -110
            }
        );


        // Second mosaic row starts slightly left

        gsap.set(
            mosaicRowTwo,
            {
                x: 75
            }
        );


        // Ninth card subtle starting point

        if (mosaicLast.length) {

            gsap.set(
                mosaicLast,
                {
                    x: 20
                }
            );

        }



        // ----------------------------------------------
        // TIMELINE
        // ----------------------------------------------

        const showcaseTimeline =
            gsap.timeline({

                defaults: {

                    ease: "none"

                },

                scrollTrigger: {

                    id:
                        "showcase-slider",

                    trigger:
                        showcase,

                    start:
                        "top top",


                    end: () => {

                        const distance =
                            getTopDistance();


                        return `+=${Math.max(

                            distance * 1.55,

                            window.innerHeight *
                                1.65

                        )}`;

                    },


                    pin: true,


                    /*
                        SMOOTHNESS

                        0.7 = faster
                        0.9 = balanced
                        1.1 = smoother

                        Start with 0.9.
                    */

                    scrub: 0.9,


                    anticipatePin: 1,


                    invalidateOnRefresh:
                        true

                }

            });



        // ==============================================
        // TOP BRAND STRIP
        // LEFT
        // ==============================================

        showcaseTimeline.to(
            sliderTop,
            {

                x: () =>
                    -getTopDistance(),

                ease: "none"

            },

            0
        );



        // ==============================================
        // MOSAIC FIRST ROW
        // LEFT
        //
        // 70 → -95
        // ==============================================

        if (mosaicRowOne.length) {

            showcaseTimeline.to(
                mosaicRowOne,
                {

                    x: 125,

                    ease: "none"

                },

                0
            );

        }



        // ==============================================
        // MOSAIC SECOND ROW
        // RIGHT
        //
        // -70 → 95
        //
        // THIS IS THE IMPORTANT OPPOSITE MOVEMENT
        // ==============================================

        if (mosaicRowTwo.length) {

            showcaseTimeline.to(
                mosaicRowTwo,
                {

                    x: -65,

                    ease: "none"

                },

                0
            );

        }



        // ==============================================
        // LAST CARD
        // SUBTLE LEFT
        // ==============================================

        if (mosaicLast.length) {

            showcaseTimeline.to(
                mosaicLast,
                {

                    x: -40,

                    ease: "none"

                },

                0
            );

        }



        // ----------------------------------------------
        // REFRESH
        // ----------------------------------------------

        requestAnimationFrame(
            () => {

                ScrollTrigger.refresh();

            }
        );

    }



    // ==================================================
    // FINAL REFRESH AFTER IMAGES LOAD
    // ==================================================

    window.addEventListener(
        "load",
        () => {

            ScrollTrigger.refresh();

        },
        {
            once: true
        }
    );


  //  this is a projectsection 
  // ======================================================
// PROJECTS - STACKED CARDS EFFECT
// ======================================================

function initProjectsStackEffect() {

    const projectsSection =
        document.querySelector("#projects");

    const projectList =
        document.querySelector("#project-list");

    const projectCards =
        gsap.utils.toArray(
            "#project-list .project-card"
        );


    if (
        !projectsSection ||
        !projectList ||
        projectCards.length === 0
    ) {
        return;
    }


    // ==================================================
    // SETTINGS
    // ==================================================

    /*
        مكان أول مشروع من أعلى الشاشة.

        إذا بدك المجموعة أعلى:
        70 أو 80

        إذا بدكها أنزل:
        110 أو 120
    */
    const startTop = 85;


    /*
        المسافة التي تبقى ظاهرة من Header
        كل مشروع سابق.

        هذه أهم قيمة للشكل النهائي.
    */
    const stackGap = 64;



    // ==================================================
    // IMPORTANT
    // Sticky needs visible overflow
    // ==================================================

    gsap.set(
        projectsSection,
        {
            overflow: "visible"
        }
    );


    gsap.set(
        projectList,
        {
            overflow: "visible"
        }
    );



    // ==================================================
    // CREATE THE STACK
    // ==================================================

    projectCards.forEach(
        (card, index) => {

            const header =
                card.querySelector(
                    ".project-header"
                );


            if (!header) return;


            /*
                كل Card كامل يصبح Sticky.

                المشروع الأول:
                top = 85px

                الثاني:
                top = 149px

                الثالث:
                top = 213px

                وهكذا.
            */

            gsap.set(
                card,
                {

                    position: "sticky",

                    top:
                        `${startTop + (index * stackGap)}px`,

                    zIndex:
                        index + 10,

                    /*
                        هذا مهم لأن المشروع التالي
                        لازم يغطي صور المشروع السابق.
                    */
                    backgroundColor:
                        "#0b0b0b"

                }
            );


            /*
                الـ Header يبقى بطبيعته.
                لا Pin ولا Sticky منفصل.
            */

            gsap.set(
                header,
                {

                    position: "relative",

                    zIndex: 5

                }
            );

        }
    );



    // ==================================================
    // SUBTLE ENTRY MOTION
    // فقط للمشروع القادم
    // ==================================================

    projectCards.forEach(
        (card, index) => {

            /*
                أول Card لا يحتاج حركة دخول.
            */
            if (index === 0) return;


            gsap.fromTo(
                card,

                {
                    y: 45
                },

                {
                    y: 0,

                    ease: "none",

                    scrollTrigger: {

                        trigger: card,

                        start:
                            "top 95%",

                        end:
                            "top 65%",

                        scrub: 0.7,

                        invalidateOnRefresh:
                            true

                    }

                }
            );

        }
    );



    // ==================================================
    // REFRESH AFTER LAYOUT
    // ==================================================

    requestAnimationFrame(
        () => {

            ScrollTrigger.refresh();

        }
    );

}

})();

function initAboutTextAnimation() {

    const aboutSection =
        document.querySelector("#about");

    if (!aboutSection) return;

    const title =
        aboutSection.querySelector("#about-title");

    const paragraph =
        aboutSection.querySelector(".about-copy p");

    if (!title || !paragraph) return;


    // ==========================================
    // INITIAL STATE
    // ==========================================

    gsap.set(title, {
        color: "transparent",
        WebkitTextStroke: "1px #ffffff"
    });

    gsap.set(paragraph, {
        width: "59%",
        clipPath: "inset(0% 100% 0% 0%)",
        margin: "auto"
    });


    // ==========================================
    // PARAGRAPH - LEFT TO RIGHT REVEAL
    // ==========================================

    gsap.to(paragraph, {

        clipPath: "inset(0% 0% 0% 0%)",

        duration: 4,

        ease: "power2.inOut",

        scrollTrigger: {
            trigger: aboutSection,
            start: "top 70%",
            once: true
        }

    });


    // ==========================================
    // TITLE - STROKE TO WHITE
    // ==========================================

    gsap.to(title, {

        color: "#ffffff",

        duration: 0.8,

        ease: "power2.inOut",

        delay: 1.1,

        scrollTrigger: {
            trigger: aboutSection,
            start: "top 70%",
            once: true
        }

    });

}
function initServicesTitleAnimation() {

    const section = document.querySelector("#services");
    if (!section) return;

    const title = section.querySelector("h2");
    if (!title) return;

    gsap.set(title, {
        color: "transparent",
        WebkitTextStroke: "1px #000000"
    });

    gsap.to(title, {
        color: "#000000",
        duration: 0.8,
        ease: "power2.inOut",
        delay: 0.6,

        scrollTrigger: {
            trigger: section,
            start: "top 70%",
            once: true
        }
    });

}
function initProjectsTitleAnimation() {

    const section = document.querySelector("#projects");
    if (!section) return;

    const title = section.querySelector("h2");
    if (!title) return;

    gsap.set(title, {
        color: "transparent",
        WebkitTextStroke: "1px #FFFFFF"
    });

    gsap.to(title, {
        color: "#FFFFFF",
        duration: 0.8,
        ease: "power2.inOut",
        delay: 0.6,

        scrollTrigger: {
            trigger: section,
            start: "top 70%",
            once: true
        }
    });

}
// projects
initServicesTitleAnimation();
initProjectsTitleAnimation();
initAboutTextAnimation();
