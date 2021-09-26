window.onload = function() {
    const { ipcRenderer } = require('electron')

    let signupbutton = document.getElementById('signup')
    let login = document.getElementById('login')

    if (signupbutton != null) {
        signupbutton.addEventListener('click', function() {
            ipcRenderer.send('signup-message', document.getElementById("firstname_s").value, document.getElementById("name_s").value, document.getElementById("email_s").value, document.getElementById("password_s").value)
        })
    } else {
        login.addEventListener('click', function() {
            ipcRenderer.send('login-message', document.getElementById("email_l").value, document.getElementById("password_l").value)
        })
    }
}