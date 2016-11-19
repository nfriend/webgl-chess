
const squareToCoordsMap: { [squareString: string]: Vector } = {};

// build the chess board map, left to right, top to bottom
for (let number = 8; number > 0; number--) {
    ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].forEach((letter, letterIndex) => {
        squareToCoordsMap[letter + number] = $V([-7 + (letterIndex * 2), 0, 7 - ((number - 1) * 2)]);
    });
}

export { squareToCoordsMap };
