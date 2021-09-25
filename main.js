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

const NOTIFICATION_TITLE = 'You got a new message!🎉'
const NOTIFICATION_BODY = 'Open the app to see it'

const mb = menubar({icon: 'icons/icon.png',
tooltip: 'EVALPAL'});

mb.on('ready', () => {
    console.log('app is ready');
    //RegisterUser()
    //LogIn()
    //showNotification()
  });

  function showNotification () {
    var notification = new Notification({ title: NOTIFICATION_TITLE, body: NOTIFICATION_BODY, icon: 'icons/icon.png' })
    notification.show()
    notification.on('click', (event, arg)=>{
      console.log('clicked')
      mb.showWindow()
    })
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