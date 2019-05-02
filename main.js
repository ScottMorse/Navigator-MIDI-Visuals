window.onload = () => {
  const noteReference = new NoteReference()
  const domPiano = new DomPiano(0,7,noteReference)
  const midiAccess = new MIDIAccess(noteReference,domPiano)

  midiAccess.init()
}