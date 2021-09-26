const { menubar } = require('menubar')
const { Notification, ipcMain } = require('electron')
const path = require('path')

// local storage for token
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}

const AmazonCognitoIdentity = require('amazon-cognito-identity-js')
global.fetch = require('node-fetch')

const request = require('request')

const poolData = {
    UserPoolId: "us-east-2_oOn7RJX94",
    ClientId: "qlp8sr3ohoa53lp5uhoprafha"
};


const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

const mb = menubar({preloadWindow: true, icon: './icons/icon.png', tooltip: 'EVALPAL', browserWindow: { height: 800, width: 600, webPreferences: { nodeIntegration: true, contextIsolation: false, enableRemoteModule: true, preload: path.join(__dirname, 'preload.js')}}})

// TODO remove if not used 
// let accessToken
// let refreshToken

// saves aws api token
var idToken

var users = []

let loggedIn = false

// Set up general thins
mb.on('ready', () => {
    // mb.window.webContents.openDevTools()
    console.log('app is ready');
    APIListener('check-in')
  });

mb.on('hide', () => {
    console.log('window closed')
    mb.window.loadFile('index.html')
})

mb.on('show', () => {
    console.log('window opened')
    if (loggedIn) {
        mb.window.loadFile('pages/home.html')
    }
})

// React to ipc-Events from buttons
ipcMain.on('signup-message', (event, firstname, name, email, password) => {
    RegisterUser(firstname, name, email, password)
});

ipcMain.on('login-message', (event, email, password) => {
    LogIn(email, password)
});

ipcMain.on('feedback', (event) => {
    var options = {
        method: 'PUT',
        uri: 'https://75rnmqrek8.execute-api.us-east-2.amazonaws.com/hack/messages',
        multipart: [{
                'content-type': 'application/json',
                'Authorization': localStorage.getItem('token'),
                body: JSON.stringify({
                    "type": "feedback",
                    "recipient": "iluvcakeyt@gmail.com",
                    "payload": ""
                })
            },
            { body: 'I am an attachment' },
            { body: fs.createReadStream('image.png') }
        ]
    };

    request(options, function(error, response, body) {
        if (error) {
            console.log(error);
        }
    })
});


// Custom functions
function ShowNotification(title, body) {
    var notification = new Notification({ title: title, body: body, icon: 'icons/icon-big.png' })
    notification.show()
    notification.on('click', () => {
      if (notification.title == 'HUZZAH! 🎉') {
        mb.window.loadFile('pages/popups/recieving/thanks.html')
      } else if (notification.title == 'Jeez! 😳') {
        mb.window.loadFile('pages/popups/recieving/feedback.html')
      } else {
        mb.window.loadFile('pages/popups/recieving/check.html')
      }
        mb.window.loadFile('pages/popups/recieving/check.html')
      notification.removeAllListeners(['click'])
      mb.showWindow()
    })
  }

function RegisterUser(name, firstname, email, password) {
    var attributeList = [];
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({ Name: "name", Value: firstname }))
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({ Name: "family_name", Value: name }))
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({ Name: "email", Value: email }))

    userPool.signUp(email, password, attributeList, null, function(err, result) {
        if (err) {
            console.log(err);
            return;
        }
        console.log('signed up!')
        cognitoUser = result.user;
        ShowNotification("Welcome!", "Please confirm your email before you can login")
        mb.window.loadFile('./index.html')
    });
}

function LogIn(email, password) {
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
        Username: email,
        Password: password,
    });

    var userData = {
        Username: email,
        Pool: userPool
    };
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function(result) {
            loggedIn = true
            console.log('logged in!')
            localStorage.setItem('token', result.getIdToken().getJwtToken());
            mb.window.loadFile('pages/home.html')
        },
        onFailure: function(err) {
            console.log(err);
        },
    });
}

function APIListener(dto1) {
    var dto = dto1

    switch (dto) {
        case "gratitude":
            ShowNotification('HUZZAH! 🎉', 'John sent you a compliment!')
            break;
        case "feedback":
            ShowNotification('Jeez! 😳', 'John sent a feedback about your work!')
            break;
        case "check-in":
            ShowNotification('How are you? 😊', 'John wants to know how your doing!')
            break;
        default:
            break;
    }
  }
  