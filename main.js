window.onload = () => {
  navigator.requestMIDIAccess()                      // Returns a Promise that
    .then(handleMIDIConnSuccess,handleMIDIConnFail)  // passes an object to either callback
}

/*
  ##########INPUT MESSAGE FORMAT###########
  bubbles: bool
  cancelBubble: bool
  cancelable: bool
  composed: bool
  currentTarget & srcElement & target:
    connection: str "open"
    id: str "1234"
    manufacturer: str "Yamaha"
    name: str "Digital Keyboard"
    onmidimessage: func callback
    onstatechange: func callback
    state: str "connected"
    type: str "input"
    version: str ""
  data: Uint8Array [248] || [144,6,0] [command, note value, velocity]
  defaultPrevented: bool
  eventPhase: int (0)
  isTrusted: bool
  path: arr []
  returnValue: bool
  timestamp: float
  type: str "midimessage"
  ######################################
*/