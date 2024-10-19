.PHONY: install all

default: all

clean:
	rm -rf build/*

install:
	npm install

build/styles.css: src/scss/styles.scss
	npm run sass-build

build: install build/styles.css

all: build
