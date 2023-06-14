// Get the canvas element by its ID
const canvas = document.getElementById('binaryCanvas');

// Get the 2D rendering context for the drawing surface of the canvas
const ctx = canvas.getContext('2d');

// This is the text to render - a string containing '10'
const binary = '10';

function getBaseFontSize() {
    // Create a temporary element with a size of 1em
    let temp = document.createElement('div');
    temp.style.width = "1em";
    temp.style.height = "1em";
    document.body.appendChild(temp);

    // Get the size of the element in pixels
    const size = temp.offsetWidth;

    // Remove the temporary element
    document.body.removeChild(temp);

    return size;
}

const baseFontSize = getBaseFontSize();

// Define your new font size in ems, converted to pixels
const fontSize = 1.5 * baseFontSize; // 1.5em

// Array to keep track of drop positions for each column
let drops = [];

// Array of green shades for color cycling
const colors = ["#19F059", "#1BC75B", "#1DEF5D", "#20FF60"]; // Add more shades if needed

// Index to keep track of which color to use
let colorIndex = 0;

let intervalId;

function init() {
    // Clear any running interval
    if(intervalId) {
        clearInterval(intervalId);
    }

    // Set the width and height of the canvas
    canvas.width = window.innerWidth;
    canvas.height = 30 * 16; // to match your CSS height 30rem

    // Calculate the number of columns in the canvas by dividing its width by the font size
    const columns = Math.floor(canvas.width / fontSize);

    // Debug: log the calculated columns
    console.log(`Columns calculated: ${columns}`);

    // Check if columns are negative or NaN, if so log the values and prevent execution
    if (isNaN(columns) || columns < 0) {
        console.error('Invalid columns calculation', {columns, width: canvas.width, fontSize});
        return;
    }

    // Initialize or reset all drops positions to 1
    drops = Array(columns).fill(1);

    // Call the draw function every 33 milliseconds to create the animation
    intervalId = setInterval(draw, 33);
}


// Function to draw each frame
function draw() {
    // Set the color to black with a slight transparency
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';

    // Draw a rectangle over the entire canvas to create the trailing effect
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Set the color for the text
    ctx.fillStyle = colors[colorIndex];

    // Set the font size and family for the text
    ctx.font = fontSize + 'px Georgia';

    // Loop over each drop
    for(let i = 0; i < drops.length; i++) {
        // Choose a random character from the binary string
        const text = binary.charAt(Math.floor(Math.random()*binary.length));

        // Draw the text at the specified position
        ctx.fillText(text, i*fontSize, drops[i]*fontSize);
        
        // If the drop has reached the bottom of the canvas, reset it to the top
        // We use a random number to create some randomness in the reset timing
        if(drops[i]*fontSize > canvas.height && Math.random() > 0.975)
            drops[i] = 0;

        // Move the drop down
        drops[i]++;
    }

    // Cycle to the next color
    colorIndex = (colorIndex + 1) % colors.length;
}

// Listen for the resize event
window.addEventListener('resize', init);

// Initial setup
init();