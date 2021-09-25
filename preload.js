window.onload = function() {
    let signupbutton = document.getElementById('signup')
    let login = document.getElementById('login')
    let feedback = document.getElementById('feedback')
    let thank = document.getElementById('thank')
    let checkin = document.getElementById('checkin')

    if (signupbutton != null) {
        signupbutton.addEventListener('click', function() {
    
            let firstname = document.getElementById("firstname_s").value;
            let name = document.getElementById("name_s").value;
            let email = document.getElementById("email_s").value;
            let password = document.getElementById("password_s").value;

            const { ipcRenderer } = require('electron')

            ipcRenderer.send('signup-message', firstname, name, email, password)
        })
    } else {
        login.addEventListener('click', function() {
    
            let email = document.getElementById("email_l").value;
            let password = document.getElementById("password_l").value;
        
            const { ipcRenderer } = require('electron')
        
            ipcRenderer.send('login-message', email, password )
        })
    }

    feedback.addEventListener('click', function() {
        const { ipcRenderer } = require('electron')
        


    })

    checkin.addEventListener('click', function() {
        const { ipcRenderer } = require('electron')

        
    })

    thank.addEventListener('click', function() {
        const { ipcRenderer } = require('electron')

        
    })


}