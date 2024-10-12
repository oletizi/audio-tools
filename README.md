# Akai Sampler Tools

## Akai Program File (*.AKP) Parser

Rudimentary file parser for Akai S5000/S6000 (and possibly earlier) samplers.

Based on [file format spec reverse engineerd by Seb Francis](https://burnit.co.uk/AKPspec/)

TODO:

- [X] Parse each chunk type
- [ ] Parse sample name in zones
- [ ] Create a parser class that knows how to parse the entire file, including iterating over the keygroups
- [ ] Implement chunk write methods
- [ ] Create a writer class that knows how to take a Program abstraction and write it to a valid .AKP file
- [ ] Create a text-based program format for an editable Program abstraction
- [ ] Createa a program editor
- [ ] Create a sampler emulator?