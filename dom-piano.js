class DomPiano {
  
  constructor(minOctave, maxOctave, noteReference){
    const { midiRef } = noteReference

    const pianoKeysEl = document.getElementById('piano-keys')
    const pianoKeyElReference = {}

    let previousEl
    for( const midiVal in midiRef ){
      const { octave, name } = midiRef[midiVal]
      if(octave >= minOctave && octave <= maxOctave){
        const el = document.createElement('div')
        pianoKeyElReference[name] = el
        el.id = 'piano-key-' + name
        el.className = 'piano-key'
        if(name.includes('b')){
          el.className += ' black'
          el.dataset.color = 'black'
          el.appendChild(document.createElement('div'))
          previousEl && previousEl.appendChild(el)
        }
        else{
          el.className += ' white'
          el.dataset.color = 'white'
          if(name.match(/[EB]\d/)){
            el.className += ' eb'
          }
          pianoKeysEl.appendChild(el)
          previousEl = el
        }
      }
    }

    const numWhiteKeys = Object.values(pianoKeyElReference).filter(v => v.className.includes('white')).length
    const prctPerWhiteKey = 100 / numWhiteKeys

    let pos = 0;
    for(const key in pianoKeyElReference){
      const el = pianoKeyElReference[key]
      const isBlackKey = el.dataset.color === 'black'
      const offset = isBlackKey ? prctPerWhiteKey * .6 : prctPerWhiteKey
      pos += isBlackKey ? offset : offset / 2
      el.style.minWidth = el.style.maxWidth = offset + 'vw'
      el.style.transform = isBlackKey ? `translateX(${prctPerWhiteKey * .7 + 'vw'})` : ''
      el.dataset.bPos = -pos + 'vw' 
    }

    this.elRef = pianoKeyElReference
    this.noteRef = noteReference
    this.noteTracker = new NoteTracker(noteReference)
  }

  noteOn = (noteName) => {
    const el = this.elRef[noteName]
    this.noteTracker.add(noteName)
  
    if(el.dataset.color === 'black'){
      el.style.backgroundSize = '100vw'
      el.style.backgroundImage = 'linear-gradient(to right, rgb(211, 0, 158),orange, yellow)'
      el.style.backgroundPositionX = el.dataset.bPos
      el.style.animation = 'fadeIn .15s ease'
      setTimeout(() => el.style.animation = '',150)
    }
    else{
      el.style.backgroundColor = 'rgb(0,0,0,0)'
    }
  }

  noteOff = (noteName) => {
    const el = this.elRef[noteName]

    this.noteTracker.remove(noteName)

    if(el.dataset.color === 'black'){
      el.style.background = 'black'
      el.style.animation = 'fadeOut .15s ease'
      setTimeout(() => el.style.animation = '',150)
    }
    else{
      el.style.backgroundColor = 'black' 
    }
  }

  blinkNote = (noteName, velocity) => {

  }
}

class NoteTracker {

  constructor(noteReference){
    this.el = document.getElementById('note-tracker')  
    this.notesOn = []
    this.noteRef = noteReference
  }

  add = (noteName) =>{
    if(!this.notesOn.includes(noteName)){
      this.notesOn.push(noteName)
      this.update()
    }
  }

  remove = (noteName) => {
    this.notesOn.splice(this.notesOn.indexOf(noteName),1) 
    this.update()
  }

  update = () => {
    let notesOnCopy = this.notesOn.slice()
    const { letterHierarchy } = this.noteRef

    notesOnCopy.sort((a,b) => {
      const aoct = a.replace(/[A-Gb]/g,'') 
      const boct = b.replace(/[A-Gb]/g,'')
      const alet = a.replace(/\d/g,'')
      const blet = b.replace(/\d/g,'')
      if(aoct > boct){
        return 1
      }
      else if(boct > aoct){
        return -1
      }
      else if(letterHierarchy[alet] > letterHierarchy[blet]){
        return 1
      }
      else{
        return -1
      }
    })
    this.el.innerHTML = notesOnCopy.join(' ')
    this.notesOn = notesOnCopy
  }
}