document.getElementById("registerForm").addEventListener("submit", function(event){
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
        if(data.error){
            alert(data.error); //TODO: change allerts to editing an element in the html
        } else {
            alert("User registered successfully");
            window.location.href = "/index.html";
        }
    }).catch((error) => {
        console.log(error);
    })
})