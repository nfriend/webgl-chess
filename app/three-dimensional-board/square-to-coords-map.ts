
const squareToCoordsMap: {
    [squareString: string]: Vector;
} = {};

// build the chess board map, left to right, top to bottom
for (let number = 8; number > 0; number--) {
    ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].forEach((letter, letterIndex) => {
        squareToCoordsMap[letter + number] = $V([-7 + (letterIndex * 2), 0, 7 - ((number - 1) * 2)]);
    });

    // these are the off-screen locations a piece goes once it has been captured
    ['w', 'x', 'y', 'z'].forEach((letter, letterIndex) => {
        squareToCoordsMap[letter + number] = $V([-17 + (letterIndex * 2), -0.5, 7 - ((number - 1) * 2)]);
    });
    ['i', 'j', 'k', 'l'].forEach((letter, letterIndex) => {
        squareToCoordsMap[letter + number] = $V([11 + (letterIndex * 2), -0.5, 7 - ((number - 1) * 2)]);
    });
}

// this is where promotion pieces enter the scene
squareToCoordsMap['promotion'] = $V([0, 20, 0]);

// the following function provides the next available "captured"
// space for a promoted piece.
const claimedCapturedSpaces: string[] = [];
const claimNextAvailableCapturedSpace = (color: 'w' | 'b'): string => {
    let captureSpace: string;
    let squareFilterRegex = color === 'b' ? /^(w|x)/ : /^(k|l)/;

    captureSpace = Object.keys(squareToCoordsMap)
        .filter(s => squareFilterRegex.test(s) && claimedCapturedSpaces.indexOf(s) === -1)[0];

    claimedCapturedSpaces.push(captureSpace);
    return captureSpace;
}

export { squareToCoordsMap, claimNextAvailableCapturedSpace };
