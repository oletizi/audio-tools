export function midiNoteToNumber(note: string): number | null {
    const noteRegex = /^([a-gA-G])([#b]?)(\d)$/;
    const match = note.match(noteRegex);

    if (!match) {
        return null; // Invalid note format
    }

    const noteName = match[1].toUpperCase();
    const accidental = match[2];
    const octave = parseInt(match[3], 10);

    const noteValues = {
        'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11
    };

    let noteValue = noteValues[noteName as keyof typeof noteValues];

    if (accidental === '#') {
        noteValue += 1;
    } else if (accidental === 'b') {
        noteValue -= 1;
    }

    return (octave + 1) * 12 + noteValue;
}