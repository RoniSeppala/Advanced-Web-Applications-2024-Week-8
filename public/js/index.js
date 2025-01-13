const topicsDiv = document.getElementById('topics');

document.addEventListener('DOMContentLoaded', async function() {
    const preCutToken = localStorage.getItem('authorization')
    console.log(preCutToken)
    let token = '';
    try {
        token = preCutToken.split(' ')[1];
    } catch (error) {
        console.log(error)
        token = preCutToken
    }
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
                if (data.message != "Topic created successfully.") {
                    alert(data.message);
                } else {
                    alert('Topic posted successfully');
                    window.location.href = '/';
                }
            }).catch((error) => {
                console.log(error);
            });
        });
        submitButton.id = 'postTopic';
        topicForm.appendChild(submitButton);
    }

    //load topics

    const topics = await fetch('/api/topics')

    if (!topics.ok) {
        console.log('Error fetching topics');
        return;
    }

    const topicsJson = await topics.json();
    topicsJson.forEach(element => {
        const newTopicTopDiv = document.createElement('div');
        newTopicTopDiv.classList.add('card', 'z-depth-2', 'hoverable', 'grey', 'lighten-2');
        const newTopicDiv = document.createElement('div');
        newTopicDiv.classList.add('card-content');

        const topicTitle = document.createElement('span');
        topicTitle.textContent = element.title;
        topicTitle.classList.add('card-title');
        newTopicDiv.appendChild(topicTitle);

        const newTopicContent = document.createElement('p');
        newTopicContent.textContent = element.content;
        newTopicDiv.appendChild(newTopicContent);

        const newTopicUserField = document.createElement('p');
        const formattedDate = new Date(element.createdAt).toLocaleString();
        newTopicUserField.textContent = 'Poseted by: ' + element.username + ' at ' + formattedDate;
        newTopicUserField.classList.add('grey-text', 'text-darken-2');
        newTopicDiv.appendChild(newTopicUserField);

        const newButtonDiv = document.createElement('div');
        newButtonDiv.classList.add('card-action');

        const newTopicDeleteButton = document.createElement('button');
        newTopicDeleteButton.textContent = 'Delete';
        newTopicDeleteButton.id = 'deleteTopic';
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
                    window.location.href = '/';
                } else {
                    alert('Topic deleted successfully');
                    window.location.href = '/';
                }
            }).catch((error) => {
                console.log(error);
            });
        });
        newTopicDeleteButton.classList.add('btn', 'waves-effect', 'waves-light');
        newButtonDiv.appendChild(newTopicDeleteButton);
        newTopicDiv.appendChild(newButtonDiv);
        newTopicTopDiv.appendChild(newTopicDiv);

        topicsDiv.appendChild(newTopicTopDiv);
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
            window.location.href = '/';
        }
    }).catch((error) => {
        console.log(error);
    });
});