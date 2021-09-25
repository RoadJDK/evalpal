const { menubar } = require('menubar');
const { Notification } = require('electron')

const NOTIFICATION_TITLE = 'You got a new message!🎉'
const NOTIFICATION_BODY = 'Open the app to see it'

const mb = menubar({icon: 'icons/icon.png',
tooltip: 'EVALPAL'});

mb.on('ready', () => {
    console.log('app is ready');
    showNotification()
  });

  function showNotification () {
    var notification = new Notification({ title: NOTIFICATION_TITLE, body: NOTIFICATION_BODY, icon: 'icons/icon.png' })
    notification.show()
    notification.on('click', (event, arg)=>{
      console.log('clicked')
      mb.showWindow()
    })
  }