document.getElementById("registerForm").addEventListener("submit", function(event){
    console.log("submitted")
    event.preventDefault();

    const email = document.getElementById("email").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const isAdmin = document.getElementById("isAdmin").checked;

    fetch("/api/user/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({email: email, username: username, password: password, isAdmin: isAdmin})
    }).then((res) => res.json())
    .then((data) => {
        if(data.errors){
            data.errors.forEach(element => {
                if (element.msg === "invalid value"){
                    alert ("Password must be at least 8 characters long and username must be between 3 and 25 characters long");
                } else {
                    alert(element.msg);
                }
            });//TODO: change allerts to editing an element in the html
            console.log(data.errors);
        } else {
            alert("User registered successfully");
            window.location.href = "/index.html";
        }
    }).catch((error) => {
        console.log(error);
    })
})
