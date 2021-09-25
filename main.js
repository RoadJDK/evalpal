const { menubar } = require('menubar');

const mb = menubar({icon: 'icons/icon.png'});

mb.on('ready', () => {
    console.log('app is ready');
  });
