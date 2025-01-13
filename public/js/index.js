document.addEventListener('DOMContentLoaded', function() {
    const preCutToken = localStorage.getItem('authorization')
    const token = preCutToken.split(' ')[1];
    const topicForm = document.getElementById('topicForm');

    if (token) { //TODO: add token validation
        const topicTitleInput = document.createElement('input');
        topicTitleInput.setAttribute('type', 'text');
        topicTitleInput.setAttribute('id', 'topicTitle');
        topicForm.appendChild(topicTitleInput);

        const topicTextArea = document.createElement('textarea');
        topicTextArea.setAttribute('id', 'topicText');
        topicForm.appendChild(topicTextArea);

        const submitButton = document.createElement('button');
        submitButton.textContent = 'Submit';
        submitButton.addEventListener('click', function() {
            const title = document.getElementById('topicTitle').value;
            const text = document.getElementById('topicText').value;
            fetch('/api/topic', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': preCutToken,
                    'user': preCutToken
                },
                body: JSON.stringify({title: title, content: text})
            }).then((res) => res.json())
            .then((data) => {
                if (data.message) {
                    alert(data.message);
                } else {
                    alert('Topic posted successfully');
                    window.location.href = '/index.html';
                }
            }).catch((error) => {
                console.log(error);
            });
        });
        submitButton.id = 'postTopic';
        topicForm.appendChild(submitButton);
    }
});

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('/api/user/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email: email, password: password})
    }).then((res) => res.json())
    .then((data) => {
        console.log(data)
        if (!data.token) {
            alert(data.message);
        } else {
            alert('Logged in successfully');
            localStorage.setItem('authorization', "Bearer " + data.token);
            window.location.href = '/index.html';
        }
    }).catch((error) => {
        console.log(error);
    });
});