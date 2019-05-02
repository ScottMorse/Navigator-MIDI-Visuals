const NOTE_NAMES = ['A','Bb','B','C','Db','D','Eb','E','F','Gb','G','Ab']

class NoteReference{
  constructor(){
    const midiReference = {}

    for(let x = A0_NUM; x <= NOTE_VALUE_MAX; x++){
      const letter = NOTE_NAMES[(x - 21) % 12]
      const octave = Math.floor((x - 12) / 12)
      const name = letter + octave 
      midiReference[x] = { letter, octave, name }
    }

    this.midiRef = midiReference
    this.letterHierarchy = NOTE_LETTER_HIERARCHY
  }
}