# webgl-chess
Final project for HCI 557: Computer Graphics and Geometric Modeling at [Iowa State University](http://www.vrac.iastate.edu/hci/)

This project is built with the following technologies:

- Vanilla [WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API) for scene rendering
- [stockfish-js](https://github.com/exoticorn/stockfish-js) for chess AI, which utilizes [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers)
- [chess-js](https://github.com/jhlywa/chess.js) for move validation/piece placement and movement/check detection/etc.
- Angular 1 and Angular Material for UI interaction
- [TypeScript](https://www.typescriptlang.org/), [SASS](http://sass-lang.com/), [Gulp](http://gulpjs.com/), [Webpack](https://webpack.github.io/), [Yarn](https://yarnpkg.com/) 

## Building/Running

- Install [node.js](https://nodejs.org/en/) and [yarn](https://yarnpkg.com/en/docs/install)
- Run `yarn` at the root of this repository
- Run `yarn build`
- Set up a local webserver to serve the `build` directory

## Developing 

- Use `gulp build:watch` to watch for file changes and rebuild automatically
- Use `gulp test` or `gulp test:watch` to run unit tests
- Use the included Yoeman generator to scaffold out new Angular components for this application.  Instructions on how to use this generator can be found in the generator's README.

## Browser Support

Browser support for this project is limited by the use of two essential technologies: [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) and [WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API).  This project should run in the following browsers:

- IE 11
- Edge
- Chrome
- Safari
- Firefox

Note that this project has not been thoroughly tested in browsers other than Chrome.  For best results, use Chrome.

## Sources

ChessJS was built with a lot of help.  A big thanks to following sources:

- Chessboard and chess piece `.obj`'s from http://blender.freemovies.co.uk/modelling-making-a-chess-set/
- Wood textures from http://www.myfreetextures.com/ and http://bgfons.com/download/1582
- "Chess" font for chess icons in 2D mode from http://www.dafont.com/chess.font
- The WebGL tutorials on MDN at https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial

## Tools

Here's what I used to make `webgl-chess`:

- [Visual Studio Code](https://code.visualstudio.com/) for editing
- [Blender](https://www.blender.org/) and [Gimp](https://www.gimp.org/) for texture mapping and editing





