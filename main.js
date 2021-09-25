const { menubar } = require('menubar');
const { Notification } = require('electron')

const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
const AWS = require('aws-sdk');
const request = require('request');
const jwkToPem = require('jwk-to-pem');
const jwt = require('jsonwebtoken');
global.fetch = require('node-fetch');

const poolData = {    
  UserPoolId : "us-east-2_1lrTgPl9I", 
  ClientId : "4g5mo2d6h0vqi1j82rtbu70v9u"
  }; 
  const pool_region = 'us-east-2';

  const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

const mb = menubar({icon: 'icons/icon.png', tooltip: 'EVALPAL', browserWindow: { height: 800, width: 600 }});

mb.on('ready', () => {
    console.log('app is ready');
    APIListener('praise')
    //RegisterUser()
    //LogIn()
    //showNotification()
  });

  function showNotification (title, body) {
    var notification = new Notification({ title: title, body: body, icon: 'icons/icon.png' })
    notification.on('click', () => {
      notification.removeAllListeners(['click'])
      mb.showWindow()
    })
    notification.show()
  }

  function RegisterUser() {
    var attributeList = [];
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"name",Value:"user"}))
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"family_name",Value:"male"}))
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"email",Value:"sample@email.com"}))

    userPool.signUp('sample@email.com', 'SamplePassword123', attributeList, null, function(err, result){
        if (err) {
            console.log(err);
            return;
        }
        cognitoUser = result.user;
        console.log('user name is ' + cognitoUser.getUsername());
    });
  }

  function LogIn() {
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
      Username : 'sample@email.com',
      Password : 'SamplePassword123',
    });

    var userData = {
      Username : 'sample@email.com',
      Pool : userPool
    };
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result) {
          console.log('access token + ' + result.getAccessToken().getJwtToken());
          console.log('id token + ' + result.getIdToken().getJwtToken());
          console.log('refresh token + ' + result.getRefreshToken().getToken());
      },
      onFailure: function(err) {
          console.log(err);
      },

    });
  }

  function APIListener(dto1) {
    var dto = dto1

    switch (dto) {
      case "praise":
        showNotification('HUZZAH! 🎉', 'John sent you a compliment!')
        break;
      case "feedback":
        showNotification('Jeez! 😳', 'John sent a feedback about your work!')
        break;
      case "check":
        showNotification('How are you? 😊', 'John wants to know how your doing!')
        break;
      default:
        break;
    }
  }