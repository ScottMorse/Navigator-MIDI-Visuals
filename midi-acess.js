// MIDI commands
const NOTE_ON = 144
const NOTE_OFF = 128
const PEDAL1 = 176
const PEDAL2 = 177

class MIDINote {
  constructor(noteValue,midiRef,velocity=0){
    const { letter, octave, name } = midiRef[noteValue]

    this.value = noteValue                                   // MIDI value
    this.name = name                                         // Full note name "Bb2"
    this.letter = letter                                     // Just letter "Ab"
    this.octave = octave                                     // Octave as int
    this.velocity = velocity                                 // Default 0
    this.keyColor = letter.includes('b') ? 'black' : 'white' // piano key color
  }
}

class MIDIAccess {
  constructor(noteReference,domPiano){
    this.noteReference = noteReference
    this.domPiano = domPiano
    this.pedaledNotes = []
    this.pedalDown = false
  }

  init(){
    navigator.requestMIDIAccess().then(this.handleMIDIConnSuccess,this.handleMIDIConnFail)
  }

  handleMIDIConnSuccess = (MIDI) => {
    const { inputs } = MIDI
    for(const input of inputs.values()){
      input.onmidimessage = this.handleMIDIIn            // Set callback for inputs
    }                                                    // when they receive a message
    console.log('MIDI Access Granted!')
  }

  handleMIDIConnFail = (err) => {
    console.log('MIDI Access Failed')
    console.log(err)
  }

  handleMIDIIn = (mess) => {   
    if(mess && mess.data && mess.data.length === 3){     // Note on/off messages have three values
      const [ cmd, noteValue, velocity ] = mess.data     // Deconstruct the array of standard MIDI protocol (integers)
  
      switch(cmd){                                       // Handle each message /
        case NOTE_ON:                                    // based on it's command code
          this.handleNoteOn(noteValue,velocity)
          break
        case NOTE_OFF:
          this.handleNoteOff(noteValue)
          break
        case PEDAL1:
          break
        case PEDAL2:
          this.handlePedalPress()
          break
      }
    }
  }

  handleNoteOn = (noteValue, velocity) => { 
    if(velocity === 0) return this.handleNoteOff(noteValue)    // Velocity 0 "note on" message can
                                                          // be equivalent to "note off".
    const note = new MIDINote(noteValue, this.noteReference.midiRef, velocity)

    if(this.pedalDown){
      let pNotesCopy = this.pedaledNotes.slice()
      pNotesCopy.push(note.name)
      this.pedaledNotes = pNotesCopy
    }

    this.domPiano.blinkNote(note.name,note.keyColor)
    this.domPiano.noteOn(note.name)
  }

  handleNoteOff = (noteValue) => {
    const note = new MIDINote(noteValue,this.noteReference.midiRef)
  
    if(!this.pedalDown){
      this.domPiano.noteOff(note.name)
    }
    else{
      if(!this.pedaledNotes.includes(note.name)){
        let pNotesCopy = this.pedaledNotes.slice()
        pNotesCopy.push(note.name)
        this.pedaledNotes = pNotesCopy
      }
    }
  }

  handlePedalPress = () => {
    this.pedalDown = !this.pedalDown
    if(!pedalDown){
      this.pedaledNotes.forEach(notename => this.domPiano.noteOff(notename))
      this.pedaledNotes = []
    }
  }
}