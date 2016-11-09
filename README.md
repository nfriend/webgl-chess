# webgl-chess
Final project for HCI 557: Computer Graphics and Geometric Modeling at Iowa State University

This project is built with the following technologies:

- Vanilla WebGL for scene rendering
- [stockfish-js](https://github.com/exoticorn/stockfish-js) for chess AI 

## Building/Running

- Install [node.js](https://nodejs.org/en/) and [yarn](https://yarnpkg.com/en/docs/install)
- Run `yarn` at the root of this repository
- Run `yarn build`
- Set up a local webserver to server the `build` directory

## Developing 

- Use `gulp build:watch` to watch for file changes and rebuild automatically
- Use `gulp test` or `gulp test:watch` to run unit tests
- Use the included Yoeman generator to scaffold out new Angular components for this application.  Instructions on how to use this generator can be found in the generator's README.
