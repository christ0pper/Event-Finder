document.addEventListener("DOMContentLoaded", () => {
    // Menu toggle functionality
    const menuToggle = document.getElementById("menu-toggle");
    const menuOptions = document.createElement("div");

    // Get current distance and city filter values from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const distance = urlParams.get("distance") || "";
    const city = urlParams.get("place") || "";

    menuOptions.classList.add("menu-options");
    menuOptions.innerHTML = `
        <a href="/host?distance=${distance}&place=${city}" class="menu-item">Host an event</a>
        <a href="/FAQ?distance=${distance}&place=${city}" class="menu-item">FAQ</a>
        <a href="/referrals?distance=${distance}&place=${city}" class="menu-item">Referrals</a>
        <a href="/contact?distance=${distance}&place=${city}" class="menu-item">Contact</a>
    `;
    document.body.appendChild(menuOptions);

    // Position the menu near the toggle button
    const positionMenu = () => {
        const rect = menuToggle.getBoundingClientRect();
        menuOptions.style.top = `${rect.bottom + window.scrollY}px`;
        menuOptions.style.left = `${rect.left + window.scrollX}px`;
    };

    // Toggle menu visibility on click
    menuToggle.addEventListener("click", (event) => {
        event.stopPropagation();
        menuOptions.classList.toggle("visible");
        positionMenu();
    });

    // Hide menu on clicking outside
    document.addEventListener("click", (event) => {
        if (!menuOptions.contains(event.target) && event.target !== menuToggle) {
            menuOptions.classList.remove("visible");
        }
    });

    // Reposition menu on window resize
    window.addEventListener("resize", () => {
        if (menuOptions.classList.contains("visible")) {
            positionMenu();
        }
    });

    // Event search filtering
    function filterEvents() {
        const searchQuery = document.getElementById("search-bar").value.toLowerCase();
        const eventCards = document.querySelectorAll(".event-card");
        let found = false;

        eventCards.forEach(card => {
            const eventName = card.querySelector("h3").textContent.toLowerCase();
            if (eventName.includes(searchQuery)) {
                card.style.display = "block"; // Show the event card if it matches
                found = true;
            } else {
                card.style.display = "none"; // Hide the event card if it doesn't match
            }
        });

        // Display a message if no events match the search query
        const noResultsMessage = document.getElementById("no-results-message");
        if (!found) {
            if (!noResultsMessage) {
                const message = document.createElement("div");
                message.id = "no-results-message";
                message.textContent = "There is no such event.";
                message.style.color = "red";
                document.getElementById("events-container").appendChild(message);
            }
        } else if (noResultsMessage) {
            noResultsMessage.remove();
        }
    }

    // Attach the event listener to search bar input
    const searchBar = document.getElementById("search-bar");
    if (searchBar) {
        searchBar.addEventListener("keyup", filterEvents);
    }

    // Apply Place Filter and Toggle Active Class
    function applyPlaceFilter(place) {
        const currentDistance = new URLSearchParams(window.location.search).get("distance");
        const button = document.querySelector(`.filter-btn[data-place="${place}"]`);

        // Check if button is already selected
        if (button.classList.contains("selected")) {
            window.location.href = "/"; // Remove all filters by navigating to the home page
        } else {
            const newUrl = `/?place=${place}&distance=${currentDistance || ''}`;
            window.location.href = newUrl;
        }
    }

    // Apply Distance Filter and Toggle Active Class
    function applyDistanceFilter(distance) {
        const currentPlace = new URLSearchParams(window.location.search).get("place");
        const button = document.querySelector(`.filter-btn[data-distance="${distance}"]`);

        // Check if button is already selected
        if (button.classList.contains("selected")) {
            window.location.href = "/"; // Remove all filters by navigating to the home page
        } else {
            const newUrl = `/?distance=${distance}&place=${currentPlace || ''}`;
            window.location.href = newUrl;
        }
    }

    // Apply selected styles on page load
    const activePlace = urlParams.get("place");
    const activeDistance = urlParams.get("distance");

    if (activePlace) {
        const placeButton = document.querySelector(`.filter-btn[data-place="${activePlace}"]`);
        if (placeButton) placeButton.classList.add("selected");
    }

    if (activeDistance) {
        const distanceButton = document.querySelector(`.filter-btn[data-distance="${activeDistance}"]`);
        if (distanceButton) distanceButton.classList.add("selected");
    }

    // Event listeners for filter buttons
    document.querySelectorAll(".filter-btn").forEach(button => {
        button.addEventListener("click", () => {
            if (button.dataset.place) {
                applyPlaceFilter(button.dataset.place);
            } else if (button.dataset.distance) {
                applyDistanceFilter(button.dataset.distance);
            }
        });
    });
});
