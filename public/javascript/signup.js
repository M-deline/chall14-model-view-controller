async function signupFormHandler(event) {
    event.preventDefault();

    const password = document.querySelector('.password').value.trim();
    const username = document.querySelector('.username').value.trim();
    //#password-signup
    //#username-signup

    if (username && password) {
        const response = await fetch('/api/users', {
            method: 'post',
            body: JSON.stringify({
                username: document.querySelector('#username').value,
    password: document.querySelector('#password').value
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            document.location.replace('/dashboard');
        } else {
            alert(response.statusText);
        }
    }
}
document.querySelector('.signup-form').addEventListener('submit', signupFormHandler);
