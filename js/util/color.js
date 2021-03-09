

/**
 * helper function that convert's a node weight value to a shade of blue.
 * @param weight - an integer between 0 and maxWeight
 * @param maxWeight - the maximum weight a node can have
 * @returns {string} a hexadecimal color string '#4B23FF'
 */
export function weightToHexColor(weight, maxWeight) {
    function rbgToString(rgb) {
        let hex = Number(rgb).toString(16);
        if (hex.length < 2) {
            hex = "0" + hex;
        }
        return hex;
    }
    if (weight <= 1) {
        return '#FFFFFF'    // white
    } else if (weight >= 100) {
        return '#000000';   // black
    }
    const startColour = {r: 9, g: 255, b: 247}; // light blue
    const endColour = {r: 6, g: 8, b: 255};     // darkish blue
    let currentColour = {r: startColour.r, g: startColour.g, b: startColour.b};

    const percent = weight / maxWeight;
    currentColour.r = Math.floor(startColour.r * (1 - percent) + endColour.r * percent);
    currentColour.g = Math.floor(startColour.g * (1 - percent) + endColour.g * percent);
    currentColour.b = Math.floor(startColour.b * (1 - percent) + endColour.b * percent);

    return  '#' + rbgToString(currentColour.r) + rbgToString(currentColour.g) + rbgToString(currentColour.b);
}