# webgl-chess
Final project for HCI 557: Computer Graphics and Geometric Modeling at [Iowa State University](http://www.vrac.iastate.edu/hci/)

This project is built with the following technologies:

- Vanilla [WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API) for scene rendering
- [stockfish-js](https://github.com/exoticorn/stockfish-js) for chess AI, which utilizes [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers)
- Angular 1 and Angular Material for UI interaction
- [TypeScript](https://www.typescriptlang.org/), [SASS](http://sass-lang.com/), [Gulp](http://gulpjs.com/), [Webpack](https://webpack.github.io/), [Yarn](https://yarnpkg.com/)

## Browser Support

Browser support for this project is limited by the use of two essential technologies: [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) and [WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API).  This project should run in the following browsers:

- IE 11
- Edge
- Chrome
- Safari
- Firefox

Note that this project has not been thoroughly tested in browsers other than Chrome.  For best results, use Chrome.

## Building/Running

- Install [node.js](https://nodejs.org/en/) and [yarn](https://yarnpkg.com/en/docs/install)
- Run `yarn` at the root of this repository
- Run `yarn build`
- Set up a local webserver to server the `build` directory

## Developing 

- Use `gulp build:watch` to watch for file changes and rebuild automatically
- Use `gulp test` or `gulp test:watch` to run unit tests
- Use the included Yoeman generator to scaffold out new Angular components for this application.  Instructions on how to use this generator can be found in the generator's README.
