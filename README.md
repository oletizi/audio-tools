# Akai Sampler Tools

## Akai Program File (*.AKP) Parser

Rudimentary file parser for Akai S5000/S6000 (and possibly earlier) samplers.

Based on [file format spec reverse engineerd by Seb Francis](https://burnit.co.uk/AKPspec/)

TODO:

- [X] Parse each chunk type
- [X] Parse sample name in zones
- [X] Create a parser class that knows how to parse the entire file, including iterating over the keygroups
- [X] Implement chunk write methods
- [X] Create a writer class that knows how to take a Program abstraction and write it to a valid .AKP file
- [X] Create a text-based program format for an editable Program abstraction
- [ ] Createa a program editor
- [ ] Create a sampler emulator?

## Run app
```shell
npm install \
&& npm run build \
&& npm run main
```
Go here: http://localhost:3000/

### With File Watching
```shell
npm install
npm run watch:build
```
In a new shell (or after backgrouding the watch:build)
```
npm run watch:main
```
Go here: http://localhost:3000/