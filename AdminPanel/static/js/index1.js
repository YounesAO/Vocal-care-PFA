document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const entry = {
        username: username,
        password: password,
    };

    console.log(entry);

    fetch(`/admin_info`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(entry)
    }).then(response => {
        console.log("ok");
        console.log(response);
        if (response.status == 404) {
            alert("information is incorect" + response.status);


        } else {
            window.location.href = '/index';
        }

    }).catch(error => {
        console.error('Error:', error);
    });

});