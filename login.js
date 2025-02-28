document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("loginButton").addEventListener("click", login);

    document.getElementById("name").addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            login();
        }
    });

    document.getElementById("mobile").addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            login();
        }
    });

    // Validation: Allow only letters and spaces in the name field
    document.getElementById("name").addEventListener("input", function () {
        this.value = this.value.replace(/[^a-zA-Z ]/g, "");
    });

    // Validation: Allow only numbers (max 10 digits) in the mobile number field
    document.getElementById("mobile").addEventListener("input", function () {
        this.value = this.value.replace(/[^0-9]/g, "").substring(0, 10);
    });
});


function login() {
    const name = document.getElementById("name").value.trim().toLowerCase();
    const mobile = document.getElementById("mobile").value.trim();


    if (!name.match(/^[a-zA-Z ]+$/)) {
        alert("Please enter a valid name with only letters and spaces.");
        return;
    }

    if (!mobile.match(/^[0-9]{10}$/)) {
        alert("Please enter a valid 10-digit mobile number.");
        return;
    }

    let usersData = JSON.parse(localStorage.getItem("usersData")) || [];
    let existingUser = null;

    for (let i = 0; i < usersData.length; i++) {
        if (usersData[i].mobile === mobile) {
            existingUser = usersData[i];
            break;
        }
    }

    if (existingUser) {
        if (existingUser.name !== name) {
            alert("This mobile number is already registered with a different name.");
            return;
        }
    } else {
        let newUser = {
            name: name,
            mobile: mobile,
            chats: {}
        };

        usersData.push(newUser);
        localStorage.setItem("usersData", JSON.stringify(usersData));
        existingUser = newUser;
    }


    sessionStorage.setItem("currentUser", JSON.stringify(existingUser));

    window.location.href = "chat.html";
}
