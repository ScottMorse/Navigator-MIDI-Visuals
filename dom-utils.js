const NOTE_ON_COLOR = 'rgb(211, 150, 20)'

const pianoKeysEl = document.getElementById('piano-keys')

// Create piano key elements and map them to notenames
const pianoKeyElReference = {}

let previousEl
for( noteName in noteReference ){
  const { octave, name } = noteReference[noteName]
  if(octave < 8){
    const el = document.createElement('div')
    pianoKeyElReference[name] = el
    el.id = 'piano-key-' + name
    el.className = 'piano-key'
    if(name.includes('b')){
      el.className += ' black'
      el.dataset.color = 'black'
      previousEl && previousEl.appendChild(el)
    }
    else{
      el.className += ' white'
      el.dataset.color = 'white'
      pianoKeysEl.appendChild(el)
      previousEl = el
    }
  }
}

const numWhiteKeys = Object.values(pianoKeyElReference).filter(v => v.className.includes('white')).length
const prctPerWhiteKey = 100 / numWhiteKeys

for(key in pianoKeyElReference){
  const el = pianoKeyElReference[key]
  const isBlackKey = el.dataset.color === 'black'
  el.style.minWidth = el.style.maxWidth = isBlackKey ? prctPerWhiteKey * .6 + 'vw' : prctPerWhiteKey + 'vw'
  el.style.transform = isBlackKey ? `translateX(${prctPerWhiteKey * .7 + 'vw'})` : ''
}

function noteElOn(notename){
  const el = pianoKeyElReference[notename]
  el.style.backgroundColor = NOTE_ON_COLOR
}

function noteElOff(notename){
  const el = pianoKeyElReference[notename]
  el.style.backgroundColor = el.dataset.color === 'black' ? 'black' : '#0D0D0D'
}

function blinkNote(notename,keyColor){
  const el = pianoKeyElReference[notename]
  el.style.animation = 'blinkNote .15s ease'
  if(keyColor == 'white' && !notename.match(/[EB]\d/)){
    el.firstElementChild.style.animation = 'reverseBlinkNote .15s ease'
    setTimeout(() => el.firstElementChild.style.animation = '',150) 
  }
  setTimeout(() => el.style.animation = '',150)
}