# TODO

- Add support for promotions

Current error during a promotion:

```
webgl-chess.js:14091 Unable to complete move provided by stockfish! Stockfish returned: "bestmove d7d8q ponder d3d8".  Attempted move:  Object {from: "d7", to: "d8", promotion: "q"}(anonymous function) @ webgl-chess.js:14091(anonymous function) @ webgl-chess.js:76958processQueue @ webgl-chess.js:16554(anonymous function) @ webgl-chess.js:16570$eval @ webgl-chess.js:17853$digest @ webgl-chess.js:17666(anonymous function) @ webgl-chess.js:17892completeOutstandingRequest @ webgl-chess.js:6135(anonymous function) @ webgl-chess.js:6414
webgl-chess.js:14091 TypeError: Cannot read property 'from' of null
    at http://localhost:8080/webgl-chess.js:77602:92
    at Array.filter (native)
    at ChessBoardService.movePiece (http://localhost:8080/webgl-chess.js:77602:40)
    at http://localhost:8080/webgl-chess.js:77593:51
    at processQueue (http://localhost:8080/webgl-chess.js:16554:29)
    at http://localhost:8080/webgl-chess.js:16570:28
    at Scope.$eval (http://localhost:8080/webgl-chess.js:17853:29)
    at Scope.$digest (http://localhost:8080/webgl-chess.js:17666:32)
    at http://localhost:8080/webgl-chess.js:17892:27
    at completeOutstandingRequest (http://localhost:8080/webgl-chess.js:6135:11)
```

History log that will result in a promotion (and as a result, this error) (fen: `2KQ1k2/1R6/5p2/7p/P5p1/3r4/8/8 b - - 0 57`):

```json
"[
    "d4",
    "d5",
    "Nf3",
    "e6",
    "c4",
    "Nf6",
    "e3",
    "Be7",
    "Nc3",
    "O-O",
    "cxd5",
    "exd5",
    "Bd3",
    "c5",
    "O-O",
    "Bg4",
    "h3",
    "Bxf3",
    "Qxf3",
    "Nc6",
    "dxc5",
    "Bxc5",
    "Bc2",
    "Re8",
    "Rd1",
    "d4",
    "Ba4",
    "Qc7",
    "Bxc6",
    "bxc6",
    "Na4",
    "Bb6",
    "Nxb6",
    "axb6",
    "exd4",
    "Nd5",
    "a3",
    "Ra4",
    "Qd3",
    "b5",
    "Be3",
    "Re6",
    "Rac1",
    "h6",
    "Re1",
    "Qa7",
    "Rc5",
    "Qd7",
    "Kh2",
    "Nf4",
    "Qf5",
    "Nd5",
    "Qc2",
    "Qd6+",
    "Kh1",
    "Qd7",
    "Qd3",
    "Nxe3",
    "fxe3",
    "Rxd4",
    "Qxd4",
    "Qxd4",
    "exd4",
    "Rxe1+",
    "Kh2",
    "Re6",
    "Kg3",
    "Re3+",
    "Kf4",
    "Rb3",
    "Rxc6",
    "Rxb2",
    "Rc8+",
    "Kh7",
    "d5",
    "Rxg2",
    "d6",
    "Rd2",
    "Ke5",
    "g5",
    "Rc5",
    "Kg6",
    "Rd5",
    "f6+",
    "Ke6",
    "Re2+",
    "Kd7",
    "Kf7",
    "Rxb5",
    "h5",
    "Rb7",
    "Kf8",
    "Kc8",
    "Re8+",
    "Kc7",
    "Re3",
    "a4",
    "Rc3+",
    "Kb6",
    "Rd3",
    "Kc6",
    "Rc3+",
    "Kd5",
    "Rd3+",
    "Ke6",
    "Re3+",
    "Kd7",
    "Rxh3",
    "Kc8",
    "g4",
    "d7",
    "Rd3",
    "d8=Q+"
]"
```

Verbose version:

```json
"[{"color":"w","from":"d2","to":"d4","flags":"b","piece":"p","san":"d4"},{"color":"b","from":"d7","to":"d5","flags":"b","piece":"p","san":"d5"},{"color":"w","from":"g1","to":"f3","flags":"n","piece":"n","san":"Nf3"},{"color":"b","from":"e7","to":"e6","flags":"n","piece":"p","san":"e6"},{"color":"w","from":"c2","to":"c4","flags":"b","piece":"p","san":"c4"},{"color":"b","from":"g8","to":"f6","flags":"n","piece":"n","san":"Nf6"},{"color":"w","from":"e2","to":"e3","flags":"n","piece":"p","san":"e3"},{"color":"b","from":"f8","to":"e7","flags":"n","piece":"b","san":"Be7"},{"color":"w","from":"b1","to":"c3","flags":"n","piece":"n","san":"Nc3"},{"color":"b","from":"e8","to":"g8","flags":"k","piece":"k","san":"O-O"},{"color":"w","from":"c4","to":"d5","flags":"c","piece":"p","captured":"p","san":"cxd5"},{"color":"b","from":"e6","to":"d5","flags":"c","piece":"p","captured":"p","san":"exd5"},{"color":"w","from":"f1","to":"d3","flags":"n","piece":"b","san":"Bd3"},{"color":"b","from":"c7","to":"c5","flags":"b","piece":"p","san":"c5"},{"color":"w","from":"e1","to":"g1","flags":"k","piece":"k","san":"O-O"},{"color":"b","from":"c8","to":"g4","flags":"n","piece":"b","san":"Bg4"},{"color":"w","from":"h2","to":"h3","flags":"n","piece":"p","san":"h3"},{"color":"b","from":"g4","to":"f3","flags":"c","piece":"b","captured":"n","san":"Bxf3"},{"color":"w","from":"d1","to":"f3","flags":"c","piece":"q","captured":"b","san":"Qxf3"},{"color":"b","from":"b8","to":"c6","flags":"n","piece":"n","san":"Nc6"},{"color":"w","from":"d4","to":"c5","flags":"c","piece":"p","captured":"p","san":"dxc5"},{"color":"b","from":"e7","to":"c5","flags":"c","piece":"b","captured":"p","san":"Bxc5"},{"color":"w","from":"d3","to":"c2","flags":"n","piece":"b","san":"Bc2"},{"color":"b","from":"f8","to":"e8","flags":"n","piece":"r","san":"Re8"},{"color":"w","from":"f1","to":"d1","flags":"n","piece":"r","san":"Rd1"},{"color":"b","from":"d5","to":"d4","flags":"n","piece":"p","san":"d4"},{"color":"w","from":"c2","to":"a4","flags":"n","piece":"b","san":"Ba4"},{"color":"b","from":"d8","to":"c7","flags":"n","piece":"q","san":"Qc7"},{"color":"w","from":"a4","to":"c6","flags":"c","piece":"b","captured":"n","san":"Bxc6"},{"color":"b","from":"b7","to":"c6","flags":"c","piece":"p","captured":"b","san":"bxc6"},{"color":"w","from":"c3","to":"a4","flags":"n","piece":"n","san":"Na4"},{"color":"b","from":"c5","to":"b6","flags":"n","piece":"b","san":"Bb6"},{"color":"w","from":"a4","to":"b6","flags":"c","piece":"n","captured":"b","san":"Nxb6"},{"color":"b","from":"a7","to":"b6","flags":"c","piece":"p","captured":"n","san":"axb6"},{"color":"w","from":"e3","to":"d4","flags":"c","piece":"p","captured":"p","san":"exd4"},{"color":"b","from":"f6","to":"d5","flags":"n","piece":"n","san":"Nd5"},{"color":"w","from":"a2","to":"a3","flags":"n","piece":"p","san":"a3"},{"color":"b","from":"a8","to":"a4","flags":"n","piece":"r","san":"Ra4"},{"color":"w","from":"f3","to":"d3","flags":"n","piece":"q","san":"Qd3"},{"color":"b","from":"b6","to":"b5","flags":"n","piece":"p","san":"b5"},{"color":"w","from":"c1","to":"e3","flags":"n","piece":"b","san":"Be3"},{"color":"b","from":"e8","to":"e6","flags":"n","piece":"r","san":"Re6"},{"color":"w","from":"a1","to":"c1","flags":"n","piece":"r","san":"Rac1"},{"color":"b","from":"h7","to":"h6","flags":"n","piece":"p","san":"h6"},{"color":"w","from":"d1","to":"e1","flags":"n","piece":"r","san":"Re1"},{"color":"b","from":"c7","to":"a7","flags":"n","piece":"q","san":"Qa7"},{"color":"w","from":"c1","to":"c5","flags":"n","piece":"r","san":"Rc5"},{"color":"b","from":"a7","to":"d7","flags":"n","piece":"q","san":"Qd7"},{"color":"w","from":"g1","to":"h2","flags":"n","piece":"k","san":"Kh2"},{"color":"b","from":"d5","to":"f4","flags":"n","piece":"n","san":"Nf4"},{"color":"w","from":"d3","to":"f5","flags":"n","piece":"q","san":"Qf5"},{"color":"b","from":"f4","to":"d5","flags":"n","piece":"n","san":"Nd5"},{"color":"w","from":"f5","to":"c2","flags":"n","piece":"q","san":"Qc2"},{"color":"b","from":"d7","to":"d6","flags":"n","piece":"q","san":"Qd6+"},{"color":"w","from":"h2","to":"h1","flags":"n","piece":"k","san":"Kh1"},{"color":"b","from":"d6","to":"d7","flags":"n","piece":"q","san":"Qd7"},{"color":"w","from":"c2","to":"d3","flags":"n","piece":"q","san":"Qd3"},{"color":"b","from":"d5","to":"e3","flags":"c","piece":"n","captured":"b","san":"Nxe3"},{"color":"w","from":"f2","to":"e3","flags":"c","piece":"p","captured":"n","san":"fxe3"},{"color":"b","from":"a4","to":"d4","flags":"c","piece":"r","captured":"p","san":"Rxd4"},{"color":"w","from":"d3","to":"d4","flags":"c","piece":"q","captured":"r","san":"Qxd4"},{"color":"b","from":"d7","to":"d4","flags":"c","piece":"q","captured":"q","san":"Qxd4"},{"color":"w","from":"e3","to":"d4","flags":"c","piece":"p","captured":"q","san":"exd4"},{"color":"b","from":"e6","to":"e1","flags":"c","piece":"r","captured":"r","san":"Rxe1+"},{"color":"w","from":"h1","to":"h2","flags":"n","piece":"k","san":"Kh2"},{"color":"b","from":"e1","to":"e6","flags":"n","piece":"r","san":"Re6"},{"color":"w","from":"h2","to":"g3","flags":"n","piece":"k","san":"Kg3"},{"color":"b","from":"e6","to":"e3","flags":"n","piece":"r","san":"Re3+"},{"color":"w","from":"g3","to":"f4","flags":"n","piece":"k","san":"Kf4"},{"color":"b","from":"e3","to":"b3","flags":"n","piece":"r","san":"Rb3"},{"color":"w","from":"c5","to":"c6","flags":"c","piece":"r","captured":"p","san":"Rxc6"},{"color":"b","from":"b3","to":"b2","flags":"c","piece":"r","captured":"p","san":"Rxb2"},{"color":"w","from":"c6","to":"c8","flags":"n","piece":"r","san":"Rc8+"},{"color":"b","from":"g8","to":"h7","flags":"n","piece":"k","san":"Kh7"},{"color":"w","from":"d4","to":"d5","flags":"n","piece":"p","san":"d5"},{"color":"b","from":"b2","to":"g2","flags":"c","piece":"r","captured":"p","san":"Rxg2"},{"color":"w","from":"d5","to":"d6","flags":"n","piece":"p","san":"d6"},{"color":"b","from":"g2","to":"d2","flags":"n","piece":"r","san":"Rd2"},{"color":"w","from":"f4","to":"e5","flags":"n","piece":"k","san":"Ke5"},{"color":"b","from":"g7","to":"g5","flags":"b","piece":"p","san":"g5"},{"color":"w","from":"c8","to":"c5","flags":"n","piece":"r","san":"Rc5"},{"color":"b","from":"h7","to":"g6","flags":"n","piece":"k","san":"Kg6"},{"color":"w","from":"c5","to":"d5","flags":"n","piece":"r","san":"Rd5"},{"color":"b","from":"f7","to":"f6","flags":"n","piece":"p","san":"f6+"},{"color":"w","from":"e5","to":"e6","flags":"n","piece":"k","san":"Ke6"},{"color":"b","from":"d2","to":"e2","flags":"n","piece":"r","san":"Re2+"},{"color":"w","from":"e6","to":"d7","flags":"n","piece":"k","san":"Kd7"},{"color":"b","from":"g6","to":"f7","flags":"n","piece":"k","san":"Kf7"},{"color":"w","from":"d5","to":"b5","flags":"c","piece":"r","captured":"p","san":"Rxb5"},{"color":"b","from":"h6","to":"h5","flags":"n","piece":"p","san":"h5"},{"color":"w","from":"b5","to":"b7","flags":"n","piece":"r","san":"Rb7"},{"color":"b","from":"f7","to":"f8","flags":"n","piece":"k","san":"Kf8"},{"color":"w","from":"d7","to":"c8","flags":"n","piece":"k","san":"Kc8"},{"color":"b","from":"e2","to":"e8","flags":"n","piece":"r","san":"Re8+"},{"color":"w","from":"c8","to":"c7","flags":"n","piece":"k","san":"Kc7"},{"color":"b","from":"e8","to":"e3","flags":"n","piece":"r","san":"Re3"},{"color":"w","from":"a3","to":"a4","flags":"n","piece":"p","san":"a4"},{"color":"b","from":"e3","to":"c3","flags":"n","piece":"r","san":"Rc3+"},{"color":"w","from":"c7","to":"b6","flags":"n","piece":"k","san":"Kb6"},{"color":"b","from":"c3","to":"d3","flags":"n","piece":"r","san":"Rd3"},{"color":"w","from":"b6","to":"c6","flags":"n","piece":"k","san":"Kc6"},{"color":"b","from":"d3","to":"c3","flags":"n","piece":"r","san":"Rc3+"},{"color":"w","from":"c6","to":"d5","flags":"n","piece":"k","san":"Kd5"},{"color":"b","from":"c3","to":"d3","flags":"n","piece":"r","san":"Rd3+"},{"color":"w","from":"d5","to":"e6","flags":"n","piece":"k","san":"Ke6"},{"color":"b","from":"d3","to":"e3","flags":"n","piece":"r","san":"Re3+"},{"color":"w","from":"e6","to":"d7","flags":"n","piece":"k","san":"Kd7"},{"color":"b","from":"e3","to":"h3","flags":"c","piece":"r","captured":"p","san":"Rxh3"},{"color":"w","from":"d7","to":"c8","flags":"n","piece":"k","san":"Kc8"},{"color":"b","from":"g5","to":"g4","flags":"n","piece":"p","san":"g4"},{"color":"w","from":"d6","to":"d7","flags":"n","piece":"p","san":"d7"},{"color":"b","from":"h3","to":"d3","flags":"n","piece":"r","san":"Rd3"},{"color":"w","from":"d7","to":"d8","flags":"np","piece":"p","promotion":"q","san":"d8=Q+"}]"
```