// FoodBox page script.
// Learning material p.242-p.253 covers form events and validation; this version
// uses plain JavaScript so there is no long minified library file to worry about.

document.addEventListener("DOMContentLoaded", function () {
    buildSmallScreenMenu();
    wireNewsBits();
    wireFoodboxForm();
    showQueryDetails();
});

var boxMenu = {
    mini: { label: "Mini Harvest Box", pounds: 11.99 },
    family: { label: "Family Farm Box", pounds: 19.99 },
    premium: { label: "Urban Harvest Premium", pounds: 29.99 }
};

function buildSmallScreenMenu() {
    var desktopMenu = document.querySelector("#nav_menu > ul");
    var mobileSlot = document.querySelector("#mobilemenu");

    if (!desktopMenu || !mobileSlot) {
        return;
    }

    var menuButton = document.createElement("button");
    menuButton.type = "button";
    menuButton.className = "slicknav_btn";
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.textContent = "Menu";

    var pocketMenu = desktopMenu.cloneNode(true);
    pocketMenu.className = "slicknav_nav";
    pocketMenu.setAttribute("aria-label", "Mobile navigation");

    mobileSlot.innerHTML = "";
    mobileSlot.className = "slicknav_menu";
    mobileSlot.appendChild(menuButton);
    mobileSlot.appendChild(pocketMenu);

    // Learning material p.588-p.599 introduces the SlickNav idea. This is a
    // small homemade version: not fancy, but easier to read in an assessment.
    menuButton.addEventListener("click", function () {
        var isOpen = pocketMenu.classList.toggle("open");
        menuButton.setAttribute("aria-expanded", String(isOpen));
    });
}

function wireNewsBits() {
    var headings = document.querySelectorAll(".news_item h3");

    headings.forEach(function (heading) {
        heading.addEventListener("click", function () {
            var para = heading.nextElementSibling;
            if (!para) {
                return;
            }

            // A deliberately plain toggle; the effect-method example sits in
            // learning material p.371-p.373, but this one is intentionally simpler.
            para.hidden = !para.hidden;
        });
    });
}

function wireFoodboxForm() {
    var form = document.querySelector("#member_form");
    var plan = document.querySelector("#plan");
    var day = document.querySelector("#delivery_day");

    if (!form) {
        return;
    }

    if (plan) {
        plan.addEventListener("change", writeLittlePriceNote);
    }

    if (day) {
        day.addEventListener("change", writeLittlePriceNote);
    }

    form.addEventListener("submit", checkFoodboxSignUp);
    writeLittlePriceNote();
}

function writeLittlePriceNote() {
    var plan = document.querySelector("#plan");
    var day = document.querySelector("#delivery_day");
    var note = document.querySelector("#plan_summary");

    if (!plan || !day || !note) {
        return;
    }

    var pickedBox = boxMenu[plan.value];
    if (!pickedBox) {
        note.textContent = "Choose a box to see the weekly total.";
        return;
    }

    var line = pickedBox.label + " costs GBP " + pickedBox.pounds.toFixed(2) + " per week";
    if (day.value !== "") {
        line += ", with " + day.value + " noted as the preferred delivery day";
    }
    note.textContent = line + ".";
}

function putMessage(fieldId, message) {
    var field = document.querySelector("#" + fieldId);
    if (!field) {
        return;
    }

    var nextBit = field.nextElementSibling;
    if (nextBit && nextBit.classList.contains("error_message")) {
        nextBit.textContent = message;
    }
}

function checkFoodboxSignUp(event) {
    var goodEnough = true;
    var emailRule = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}\b/;
    var ukMobileRule = /^07\d{3}\s?\d{6}$/;

    var firstName = document.querySelector("#first_name");
    var lastName = document.querySelector("#last_name");
    var address = document.querySelector("#address");
    var email = document.querySelector("#email");
    var phone = document.querySelector("#phone");
    var plan = document.querySelector("#plan");
    var deliveryDay = document.querySelector("#delivery_day");
    var permission = document.querySelector("#permission");
    var status = document.querySelector("#form_status");
    var updateChoice = document.querySelector("input[name='updates']:checked");

    // Assessment guideline: required fields are checked before the form is sent.
    // This keeps the GET submission tidy when register.html displays the result.
    firstName.value = firstName.value.trim();
    if (firstName.value === "") {
        putMessage("first_name", "Please add your first name.");
        goodEnough = false;
    } else {
        putMessage("first_name", "");
    }

    lastName.value = lastName.value.trim();
    if (lastName.value === "") {
        putMessage("last_name", "Please add your last name.");
        goodEnough = false;
    } else {
        putMessage("last_name", "");
    }

    address.value = address.value.trim();
    if (address.value.length < 8) {
        putMessage("address", "Please enter a UK delivery address.");
        goodEnough = false;
    } else {
        putMessage("address", "");
    }

    email.value = email.value.trim();
    if (email.value === "") {
        putMessage("email", "This field is required.");
        goodEnough = false;
    } else if (!emailRule.test(email.value)) {
        putMessage("email", "Use a valid email address.");
        goodEnough = false;
    } else {
        putMessage("email", "");
    }

    phone.value = phone.value.trim();
    if (phone.value === "") {
        putMessage("phone", "This field is required.");
        goodEnough = false;
    } else if (!ukMobileRule.test(phone.value)) {
        putMessage("phone", "Use a UK mobile format, for example 07456 999999.");
        goodEnough = false;
    } else {
        putMessage("phone", "");
    }

    if (plan.value === "") {
        putMessage("plan", "Choose a membership plan.");
        goodEnough = false;
    } else {
        putMessage("plan", "");
    }

    if (deliveryDay.value === "") {
        putMessage("delivery_day", "Choose a preferred delivery day.");
        goodEnough = false;
    } else {
        putMessage("delivery_day", "");
    }

    var updatesError = document.querySelector("#updates_error");
    if (!updateChoice) {
        updatesError.textContent = "Choose at least one update type.";
        goodEnough = false;
    } else {
        updatesError.textContent = "";
    }

    var permissionError = document.querySelector("#permission_error");
    if (!permission.checked) {
        permissionError.textContent = "Please confirm FoodBox may contact you.";
        goodEnough = false;
    } else {
        permissionError.textContent = "";
    }

    if (!goodEnough) {
        // Learning material p.149-p.150 and p.252-p.253 show preventDefault()
        // for stopping an invalid form submission.
        event.preventDefault();
        status.classList.remove("hidden");
        status.textContent = "Please correct the highlighted fields before sending the form.";
    }
}

function showQueryDetails() {
    var landing = document.querySelector("#submitted_details");

    if (!landing) {
        return;
    }

    var bits = new URLSearchParams(window.location.search);
    if (!bits.has("first_name")) {
        landing.innerHTML = "<p>No registration details have been submitted yet.</p>";
        return;
    }

    var planName = "No plan selected";
    if (boxMenu[bits.get("plan")]) {
        planName = boxMenu[bits.get("plan")].label;
    }

    var rows = [
        ["Name", bits.get("first_name") + " " + bits.get("last_name")],
        ["Address", bits.get("address")],
        ["Email", bits.get("email")],
        ["Telephone", bits.get("phone")],
        ["Plan", planName],
        ["Delivery day", bits.get("delivery_day")],
        ["Comments", bits.get("comments") || "No comments supplied."]
    ];

    var tableHtml = "<table><caption>Submitted registration details</caption><tbody>";
    rows.forEach(function (row) {
        tableHtml += "<tr><th scope=\"row\">" + tidyForPage(row[0]) + "</th><td>" + tidyForPage(row[1]) + "</td></tr>";
    });
    tableHtml += "</tbody></table>";
    landing.innerHTML = tableHtml;
}

function tidyForPage(value) {
    var safe = document.createElement("span");
    safe.textContent = value;
    return safe.innerHTML;
}
