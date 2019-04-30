/*
  ##########INPUT MESSAGE###########
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
  ##################################
*/

const handleMIDIIn = mess => {
  if(mess && mess.data && mess.data.length === 3){
    const [ cmd, noteval, velocity ] = mess.data
    
    switch(cmd){
      case 144:
        handleNoteOn(noteval,velocity) 
      case 128:
        handleNoteOff(noteval)
    }

  }
}

const handleNoteOn = (noteval, velocity) => {
  if(velocity === 0) return handleNoteOff(noteval)


}

const handleNoteOff = (noteval) => {
  // console.log(noteval)
}

window.onload = () => {
  navigator.requestMIDIAccess()
  .then(
    MIDI => {
      const { inputs } = MIDI;

      for(input of inputs.values()){
        input.onmidimessage = handleMIDIIn;
      }

    },
    console.log // log error
  )
}