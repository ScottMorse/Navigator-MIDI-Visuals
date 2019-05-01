// MIDI commands
const NOTE_ON = 144
const NOTE_OFF = 128
const PEDAL1 = 176
const PEDAL2 = 177

// Min/max note values
const A0_NUM = 21
const NOTE_VALUE_MAX = 127

let pedalDown = false
let pedaledNotes = []

// Only flats used to simplify naming and eliminate special characters
const noteNames = ['A','Bb','B','C','Db','D','Eb','E','F','Gb','G','Ab']

// Map common note data to MIDI note values
const noteReference = {}
for(let x = A0_NUM; x <= NOTE_VALUE_MAX; x++){
  const letter = noteNames[(x - 21) % 12]
  const octave = Math.floor((x - 12) / 12)
  const name = letter + octave 
  noteReference[x] = { letter, octave, name }
}

class MIDINote {

  constructor(noteValue,velocity=0){
    const { letter, octave, name } = noteReference[noteValue]

    this.value = noteValue                                   // MIDI value
    this.name = name                                         // Full note name "Bb2"
    this.letter = letter                                     // Just letter "Ab"
    this.octave = octave                                     // Octave as int
    this.velocity = velocity                                 // Default 0
    this.keyColor = letter.includes('b') ? 'black' : 'white' // piano key color
  }

}

// Callback for input
const handleMIDIIn = mess => {                         
  if(mess && mess.data && mess.data.length === 3){     // Note on/off messages have three values
    const [ cmd, noteValue, velocity ] = mess.data     // Deconstruct the array of standard MIDI protocol (integers)

    switch(cmd){                                       // Handle each message /
      case NOTE_ON:                                    // based on it's command code
        handleNoteOn(noteValue,velocity)
        break
      case NOTE_OFF:
        handleNoteOff(noteValue)
        break
      case PEDAL1:
        break
      case PEDAL2:
        handlePedalPress()
        break
    }

  }
}

// Used by handleMIDIIn for "note on" commands
const handleNoteOn = (noteValue, velocity) => { 
  if(velocity === 0) return handleNoteOff(noteValue)    // Velocity 0 "note on" message can
                                                        // be equivalent to "note off".
  const note = new MIDINote(noteValue, velocity)

  blinkNote(note.name,note.keyColor)
  noteElOn(note.name)
}

// Used by handleMIDIIn for "note off" commands
const handleNoteOff = (noteValue) => {
  const note = new MIDINote(noteValue)

  if(!pedalDown) noteElOff(note.name)
  else pedaledNotes.push(note.name)
}

const handlePedalPress = () => {
  pedalDown = !pedalDown
  if(!pedalDown){
    pedaledNotes.forEach(notename => noteElOff(notename))
    pedaledNotes = []
  }
}

// Callbacks for initial MIDI connection
const handleMIDIConnSuccess = MIDI => {
  const { inputs } = MIDI;                          
  for(input of inputs.values()){
    input.onmidimessage = handleMIDIIn;                // Set callback for inputs
  }                                                    // when they receive a message
}

// Callback for failed MIDI access
const handleMIDIConnFail = err => {
  console.log(err)
}