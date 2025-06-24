//ARIA-EXPANDED AND ARIA-HIDDEN TOGGLE - PAGE-WIDE
            function toggleCandyContent(expandableClass) {
            const candyElements = document.querySelectorAll(`.${expandableClass}`);

            candyElements.forEach(el => {
                const isHidden = el.getAttribute("aria-hidden") === "true";

                // Toggle visibility class
                el.classList.toggle("hidden");

                // Update ARIA
                el.setAttribute("aria-hidden", String(!isHidden));
            });
            }

            document.querySelectorAll("button[data-expandable]").forEach(button => {
            button.addEventListener("click", () => {
                const expandableClass = button.dataset.expandable;

                // Toggle content visibility and aria-hidden
                toggleCandyContent(expandableClass);

                // Toggle aria-expanded on the button itself
                const isExpanded = button.getAttribute("aria-expanded") === "true";
                button.setAttribute("aria-expanded", String(!isExpanded));
            });
            });
        
//MOBILE MENU MODAL

            const modal = document.getElementById("mobile-menu-modal");
            const openBtn = document.getElementById("open-menu");
            const closeBtn = document.getElementById("close-menu");
            const menu = document.getElementById("mobile-menu-modal");
            const heading = document.getElementById("modal-heading");
            const announcer = document.getElementById("aria-status");
            let escHandler;


            function trapFocus(modal) {
                const focusable = modal.querySelectorAll(
                    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
                );
                const first = focusable[0];
                const last = focusable[focusable.length - 1];

                function focusHandler(e) {
                    if (e.key !== "Tab") return;

                    if (e.shiftKey && document.activeElement === first) {
                        e.preventDefault();
                        last.focus();
                    } else if (!e.shiftKey && document.activeElement === last) {
                        e.preventDefault();
                        first.focus();
                    }
                }

                modal.addEventListener("keydown", focusHandler);
                modal._trapHandler = focusHandler;
            }


            function removeTrap(modal) {
                if (modal._trapHandler) {
                modal.removeEventListener("keydown", modal._trapHandler);
                modal._trapHandler = null;
                }
            }

            function handleEscape(modal, closeFn) {
                escHandler = function (e) {
                    if (e.key === "Escape") {
                        closeFn();
                        document.removeEventListener("keydown", escHandler);
                    }
                };
                document.addEventListener("keydown", escHandler);
            }

            function announce(msg) {
                if (announcer) announcer.textContent = msg;
            }

            function openMenu() {
                menu.classList.remove("hidden");
                menu.setAttribute("aria-hidden", "false");
                openBtn.setAttribute("aria-expanded", "true");
                document.body.classList.add("no-scroll");

                heading.focus();
                trapFocus(menu);
                handleEscape(menu, closeMenu);
                announce("Menu opened. Focus moved to modal heading.");
            }

            function closeMenu() {
                menu.classList.add("hidden");
                menu.setAttribute("aria-hidden", "true");
                openBtn.setAttribute("aria-expanded", "false");
                document.body.classList.remove("no-scroll");

                openBtn.focus();
                removeTrap(menu);

                if (escHandler) {
                    document.removeEventListener("keydown", escHandler);
                    escHandler = null;
                }

                announce("Menu closed. Focus returned to menu button.");
            }

            openBtn.addEventListener("click", openMenu);
            closeBtn.addEventListener("click", closeMenu);

            // Close the menu if any nav link inside it is clicked
            menu.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                closeMenu();
            });
            });
        
            document.body.classList.add("overflow-hidden");
            document.getElementById("mobile-menu-modal").classList.remove("hidden");

            document.body.classList.remove("overflow-hidden");
            document.getElementById("mobile-menu-modal").classList.add("hidden");


//CLOCK FUNCTIONALITY

        // Simple countdown timer (for demo purposes)
            const countdownElements = document.querySelectorAll('.countdown-digit');
            const [daysElement, hoursElement, minutesElement] = countdownElements;

            // Set default starting values
            const DEFAULT_DAYS = 14;
            const DEFAULT_HOURS = 23;
            const DEFAULT_MINUTES = 59;

            function updateCountdown() {
                let days = parseInt(daysElement.textContent);
                let hours = parseInt(hoursElement.textContent);
                let minutes = parseInt(minutesElement.textContent);

                // Subtract one minute
                minutes--;

                if (minutes < 0) {
                    minutes = 59;
                    hours--;

                    if (hours < 0) {
                        hours = 23;
                        days--;

                        if (days < 0) {
                            // Reset back to the default countdown
                            days = DEFAULT_DAYS;
                            hours = DEFAULT_HOURS;
                            minutes = DEFAULT_MINUTES;
                        }
                    }
                }

                // Update the text content
                daysElement.textContent = days.toString().padStart(2, '0');
                hoursElement.textContent = hours.toString().padStart(2, '0');
                minutesElement.textContent = minutes.toString().padStart(2, '0');
            }

            // Start countdown immediately
            updateCountdown();

            // Keep it ticking every 60 seconds
            setInterval(updateCountdown, 60000);


//REUDUCE MOTION CONTROLS

            // Reduce Motion Toggle Handler
            function setupReduceMotionToggle(buttonId, labelId) {
                const button = document.getElementById(buttonId);
                const label = document.getElementById(labelId);

                if (!button || !label) return;

                button.addEventListener("click", () => {
                    const isReduced = label.textContent.includes("On");
                    label.textContent = `Reduce Motion: ${isReduced ? "Off" : "On"}`;
                    
                    document.documentElement.classList.toggle("reduce-motion", !isReduced);
                    localStorage.setItem("prefers-reduced-motion", !isReduced);
                });
            }

            // Initial Load Preference
            function applyStoredMotionPreference() {
                const storedPreference = localStorage.getItem("prefers-reduced-motion") === "true";
                if (storedPreference) {
                    document.documentElement.classList.add("reduce-motion");

                    // Update all labels that exist
                    const labels = document.querySelectorAll("[id^='reduce-motion'][id$='label']");
                    labels.forEach(label => {
                        label.textContent = "Reduce Motion: On";
                    });
                }
            }

            // Init both toggles with one function call each
            setupReduceMotionToggle("reduce-motion-toggle", "reduce-motion-label");
            setupReduceMotionToggle("reduce-motion-modal-toggle", "reduce-motion-modal-label");
            applyStoredMotionPreference();



//FORM FIELD ERROR HANDLING
            document.getElementById('contactForm').addEventListener('submit', function (event) {
                const nameInput = document.getElementById('name');
                const emailInput = document.getElementById('email');
                const interestSelect = document.getElementById('interest');

                let hasError = false;

                // Name validation
                if (!nameInput.value.trim()) {
                    document.getElementById('name-error').classList.remove('hidden');
                    hasError = true;
                } else {
                    document.getElementById('name-error').classList.add('hidden');
                }

                // Email validation
                if (!emailInput.value.trim() || !emailInput.value.includes('@')) {
                    document.getElementById('email-error').classList.remove('hidden');
                    hasError = true;
                } else {
                    document.getElementById('email-error').classList.add('hidden');
                }

                // Interest validation
                if (!interestSelect.value) {
                    document.getElementById('interest-error').classList.remove('hidden');
                    hasError = true;
                } else {
                    document.getElementById('interest-error').classList.add('hidden');
                }

                if (hasError) {
                    event.preventDefault();
                }
            });



//FLIP CHEVRONS
            const buttons = document.querySelectorAll('.toggle-button');
            
            buttons.forEach(button => {
                button.addEventListener('click', () => {
                    const buttonchevron = button.querySelector('.button-chevron');
                    buttonchevron.classList.toggle('flipped');
                })
            })

            const selects = document.querySelectorAll('.select-wrapper');

            selects.forEach(selectWrapper => {
            selectWrapper.addEventListener('click', () => {
                const selectchevron = selectWrapper.querySelector('.select-chevron');
                selectchevron.classList.toggle('flipped');
            });
            });

//TEST AREA ==================================================

