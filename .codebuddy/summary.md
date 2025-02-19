# Project Summary

## Overview
The project appears to be a comprehensive toolkit for working with various Akai sampler devices. It includes utilities for generating configurations, translating data formats, and managing audio samples. The project is structured into multiple components, each focusing on specific functionalities related to Akai samplers, including support for different models and data formats.

### Languages and Frameworks Used
- **Languages**: TypeScript, JavaScript, Shell scripting
- **Frameworks**: Next.js (implied by the presence of `next.config.js` and related files)
- **Main Libraries**: 
  - Various custom libraries for handling Akai devices (e.g., `lib-akai-mpc`, `lib-akai-s56k`)
  - Testing libraries (e.g., Jest, implied by the presence of `.test.ts` files)

## Purpose of the Project
The primary purpose of this project is to provide a set of tools and libraries that facilitate the interaction with and management of Akai sampler devices. This includes generating device-specific configurations, translating audio data formats, and providing a user interface for managing audio samples.

## Build and Configuration Files
The following files are relevant for the configuration and building of the project:
- `/Makefile`
- `/next.config.js`
- `/postcss.config.js`
- `/package.json`
- `/tsconfig.json`
- `/tsconfig.next.json`
- `/tsconfig.testing.json`
- `/tsup.config.ts`
- `/sampler-devices/package.json`
- `/sampler-interface/package.json`
- `/sampler-lib/package.json`
- `/sampler-translate/package.json`

## Source Files Locations
Source files can be found in the following directories:
- `/sampler-devices/src`
- `/sampler-interface/src`
- `/sampler-lib/src`
- `/sampler-translate/src`
- `/src`

## Documentation Files Location
Documentation files are located in the following directory:
- `/docs`
  - `akp-spec.txt`
  - `s1000_sysex.md`
  - `s2000_sysex.md`
  - `s2800_sysex.md`
  - `sysex.md`