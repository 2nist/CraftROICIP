const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow () {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    title: 'Craft Automation CIP ROI Calculator',
    icon: path.join(__dirname, 'assets', process.platform === 'win32' ? 'icon.ico' : 'icon.png'),
    webPreferences: {
      contextIsolation: true,
      sandbox: false,
      webSecurity: false,
      allowRunningInsecureContent: true
    }
  });

  // Load the local HTML file. Use different path for dev vs. packaged.
  const htmlPath = app.isPackaged
    ? path.join(__dirname, 'CRAFTROICIP.html')
    : path.join(__dirname, '..', 'CRAFTROICIP.html');
  console.log('[Main] Loading file:', htmlPath);
  win.loadFile(htmlPath).catch(err => {
    console.error('[Main] loadFile error:', err);
  });

  win.once('ready-to-show', () => {
    console.log('[Main] Window ready to show');
    win.show();
  });

  win.webContents.on('did-finish-load', () => {
    console.log('[Main] did-finish-load');
  });
  // Disable HTTP cache to reduce disk cache errors in some Windows environments
  win.webContents.session.setCacheMode && win.webContents.session.setCacheMode('no-store');
  if (win.webContents.session.clearCache) {
    win.webContents.session.clearCache().catch(() => {});
  }
  win.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    console.error('[Main] did-fail-load', { errorCode, errorDescription, validatedURL });
  });

  // Optional: Open DevTools only when explicitly requested
  if (!app.isPackaged && process.env.ELECTRON_OPEN_DEVTOOLS === '1') {
    win.webContents.openDevTools();
  }
}

// Disable hardware acceleration (helps with black/blank windows on some GPUs)
app.disableHardwareAcceleration();

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
