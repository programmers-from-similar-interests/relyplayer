 
/*
 * A basic node-gtk Webkit based browser example.
 * Similar logic and basic interface found in this PyGTK example:
 * http://www.eurion.net/python-snippets/snippet/Webkit%20Browser.html
 */

const gi = require('node-gtk')

const Gtk     = gi.require('Gtk', '3.0')
const WebKit2 = gi.require('WebKit2')

// Start the GLib event loop
gi.startLoop()

Gtk.init()

// Main program window
const window = new Gtk.Window({
  type : Gtk.WindowType.TOPLEVEL,
  title : "relyplayer"
})

// WebKit2 browser wrapper
const webView = new WebKit2.WebView()

const button = {
    forward: Gtk.ToolButton.newFromStock(Gtk.STOCK_GO_FORWARD),
  }

// the browser container, so that it is scrollable
const scrollWindow = new Gtk.ScrolledWindow({})

// horizontal and vertical boxes
const hbox = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL })
const vbox = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL })


/*
 * Build our layout
 */

scrollWindow.add(webView)

hbox.packStart(button.forward, false, false, 0)
vbox.packStart(hbox,         false, true, 0)


// configure main window
window.setDefaultSize(1024, 720)
window.setResizable(true)
window.add(vbox)



/*
 * Settings
 */

// Setting up optional Dark theme (gotta love it!)
if (process.argv.some(color => color === 'dark')) {
  let gtkSettings = Gtk.Settings.getDefault()
  gtkSettings.gtkApplicationPreferDarkTheme = true
  gtkSettings.gtkThemeName = 'Adwaita'
}

{
  // Update some webview settings
  const webSettings = webView.getSettings()
  webSettings.enableDeveloperExtras = true
  webSettings.enableCaretBrowsing = true
  webSettings.enableMediaSource = true
  console.log('webSettings: ', webSettings)
}

webView.on('load-changed', (loadEvent) => {
  switch (loadEvent) {
    case WebKit2.LoadEvent.COMMITTED:
      // Update the URL bar with the current adress

      break
  }
})



// window show event
window.on('show', () => {
  Gtk.main()
})

// window after-close event
window.on('destroy', () => Gtk.mainQuit())

// window close event: returning true has the semantic of preventing the default behavior:
// in this case, it would prevent the user from closing the window if we would return `true`
window.on('delete-event', () => false)

button.forward.on('clicked', load)

/*
 * Main
 */

main()
function load() {
    webView.loadUri(url(process.argv[2] || 'youtube.com'));
    vbox.packStart(scrollWindow, true,  true, 0);
    window.showAll()
}
function main() {
  // open first argument or Google

  // add vertical ui and show them all
  window.showAll()
}


/*
 * Helpers
 */

// if link doesn't have a protocol, prefixes it via http://
function url(href) {
  return /^([a-z]{2,}):/.test(href) ? href : ('http://' + href)
}
