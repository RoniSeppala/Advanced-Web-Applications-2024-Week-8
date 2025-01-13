const topicsDiv = document.getElementById('topics');

document.addEventListener('DOMContentLoaded', async function() {
    const preCutToken = localStorage.getItem('authorization')
    console.log(preCutToken)
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

    //load topics

    const topics = await fetch('/api/topic')

    if (!topics.ok) {
        console.log('Error fetching topics');
        return;
    }

    const topicsJson = await topics.json();
    topicsJson.forEach(element => {
        const newTopicDiv = document.createElement('div');
        
        const topicTitle = document.createElement('span');
        topicTitle.textContent = element.title;
        newTopicDiv.appendChild(topicTitle);

        const newTopicContent = document.createElement('p');
        newTopicContent.textContent = element.content;
        newTopicDiv.appendChild(newTopicContent);

        const newTopicDeleteButton = document.createElement('button');
        newTopicDeleteButton.textContent = 'Delete';
        newTopicDeleteButton.addEventListener('click', function() {
            fetch('/api/topic/' + element._id, {
                method: 'DELETE',
                headers: {
                    'Authorization': preCutToken
                }
            }).then((res) => res.json())
            .then((data) => {
                if (data.message) {
                    alert(data.message);
                    window.location.href = '/index.html';
                } else {
                    alert('Topic deleted successfully');
                    window.location.href = '/index.html';
                }
            }).catch((error) => {
                console.log(error);
            });
        });
        newTopicDiv.appendChild(newTopicDeleteButton);

        topicsDiv.appendChild(newTopicDiv);
    });


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