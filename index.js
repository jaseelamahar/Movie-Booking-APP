
    function handleFormSubmit(event) {
        event.preventDefault();
        const userDetails = {
            username: event.target.username.value,
            seatno: event.target.seatno.value,
        };

        // getting already booked seats
        axios.get("https://crudcrud.com/api/39354f17b9574295b5cabe417eb5b427/MovieBooking")
            .then((response) => {
                const bookedSeats = response.data.map(user => user.seatno);
                // Check already booked or not
                if (bookedSeats.includes(userDetails.seatno)) {
                    alert("Seat already booked");
                } else {
                    // If not booked, then book
                    axios.post(
                        "https://crudcrud.com/api/39354f17b9574295b5cabe417eb5b427/MovieBooking",
                        userDetails
                    )
                    .then((response) => {
                        // Display the newly booked user
                        displayUserOnScreen(response.data);
                        // Clear form inputs
                        document.getElementById("username").value = "";
                        document.getElementById("seatno").value = "";
                    })
                    .catch((error) => {
                        console.error("Error submitting user details:", error);
                    });
                }
            })
            .catch((error) => {
                console.error("Error fetching booked seats:", error);
            });
    }

    function showNewUserOnScreen(user) {
        document.getElementById("username").value = "";
        document.getElementById("seatno").value = "";
    }

    function displayUserOnScreen(userDetails) {
        const userItem = document.createElement("li");
        userItem.appendChild(
            document.createTextNode(
                `${userDetails.username} - ${userDetails.seatno} `
            )
        );

        const deleteBtn = document.createElement("button");
        deleteBtn.appendChild(document.createTextNode("Delete"));
        userItem.appendChild(deleteBtn);

        const editBtn = document.createElement("button");
        editBtn.appendChild(document.createTextNode("Edit"));
        userItem.appendChild(editBtn);

        const userList = document.querySelector("ul");
        userList.appendChild(userItem);

        deleteBtn.addEventListener("click", function (event) {
            userList.removeChild(event.target.parentElement);
            localStorage.removeItem(userDetails.seatno);
        });

        editBtn.addEventListener("click", function (event) {
            userList.removeChild(event.target.parentElement);
            localStorage.removeItem(userDetails.seatno);
            document.getElementById("username").value = userDetails.username;
            document.getElementById("seatno").value = userDetails.phone;
        });
    }

    function findUserBySeatNo() {
        const findSlotValue = document.getElementById("findslot").value;
        const userList = document.querySelector("ul");
        const userItems = userList.getElementsByTagName("li");

        for (let i = 0; i < userItems.length; i++) {
            const userDetails = userItems[i].textContent;
            if (userDetails.includes(findSlotValue)) {
                // show if match
                userItems[i].style.display = "block";
            } else {
                // Hide if no match
                userItems[i].style.display = "none";
            }
        }
    }

    window.addEventListener("DOMContentLoaded", () => {
        axios.get("https://crudcrud.com/api/39354f17b9574295b5cabe417eb5b427/MovieBooking")
            .then((response) => {
                for (let i = 0; i < response.data.length; i++) {
                    displayUserOnScreen(response.data[i]);
                }
            })
            .catch((error) => {
                console.error("Error fetching users:", error);
            });
    });

    // Event listener for "FindSlot" input field
    document.getElementById("findslot").addEventListener("input", findUserBySeatNo);

