const canvas = document.getElementById('binaryCanvas');
const ctx = canvas.getContext('2d');
const binary = '10';
let binaryRows = [];

function getBaseFontSize() {
    let temp = document.createElement('div');
    temp.style.width = "1em";
    temp.style.height = "1em";
    document.body.appendChild(temp);
    const size = temp.offsetWidth;
    document.body.removeChild(temp);
    return size;
}

const baseFontSize = getBaseFontSize();
const fontSize = 1.5 * baseFontSize;
const color = "#19F059";

function interpolateColors(color1, color2) {
    // Extract RGBA values
    const extractRGBA = (color) => color.match(/\d+\.?\d*/g).map(Number);
    const [r1, g1, b1, a1] = extractRGBA(color1);
    const [r2, g2, b2, a2] = extractRGBA(color2);

    // Function to generate a random number between two numbers
    const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    // Generate new RGBA values
    const r = randomBetween(Math.min(r1, r2), Math.max(r1, r2));
    const g = randomBetween(Math.min(g1, g2), Math.max(g1, g2));
    const b = randomBetween(Math.min(b1, b2), Math.max(b1, b2));
    const a = Math.random() * (Math.max(a1, a2) - Math.min(a1, a2)) + Math.min(a1, a2);

    // Return new color
    return `rgba(${r}, ${g}, ${b}, ${a})`;
    // ctx.fillStyle = interpolateColors('rgba(33, 255, 144, 1)', 'rgba(102, 255, 0, 1)')
}


function init() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const columns = Math.ceil(canvas.width / fontSize); // We change floor to ceil for columns as well
    const rows = Math.ceil(canvas.height / fontSize); 

    if (isNaN(columns) || isNaN(rows) || columns < 0 || rows < 0) {
        console.error('Invalid dimensions calculation', { columns, rows, width: canvas.width, height: canvas.height, fontSize });
        return;
    }

    binaryRows = Array.from({ length: rows }, () => Array.from({ length: columns }, () => binary.charAt(Math.floor(Math.random() * binary.length))));
    draw();
}

function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = color;
    ctx.font = fontSize + 'px Georgia';
    ctx.textBaseline = 'top'; 
    ctx.imageSmoothingEnabled = false; 

    for (let i = 0; i < binaryRows.length; i++) {
        for (let j = 0; j < binaryRows[i].length; j++) {
            ctx.fillText(binaryRows[i][j], j * fontSize, i * fontSize);
        }
    }
}

window.addEventListener('resize', init);
init();

console.log("debug: " + binaryRows[1]);
console.log("debug: " + binaryRows[2]);