const canvas = document.getElementById('binaryCanvas');
const ctx = canvas.getContext('2d');
const binary = '10';
const BLOBS_TO_MAKE = 5;
var binaryRows = [];
var colorBlobs = [];

function getBaseFontSize() {
    let temp = document.createElement('div');
    temp.style.width = "1em";
    temp.style.height = "1em";
    document.body.appendChild(temp);
    const size = temp.offsetWidth;
    document.body.removeChild(temp);
    return size;
}

function getDistance(cords1, cords2) {
    const [x1, y1] = cords1;
    const [x2, y2] = cords2;

    return Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2));
}


var baseFontSize;
var fontSize;

function randNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function interpolateColors(color1, color2) {
    // Extract RGBA values
    const extractRGBA = (color) => color.match(/\d+\.?\d*/g).map(Number);
    const [r1, g1, b1, a1] = extractRGBA(color1);
    const [r2, g2, b2, a2] = extractRGBA(color2);

    // Generate new RGBA values
    const r = randNum(Math.min(r1, r2), Math.max(r1, r2));
    const g = randNum(Math.min(g1, g2), Math.max(g1, g2));
    const b = randNum(Math.min(b1, b2), Math.max(b1, b2));
    const a = Math.random() * (Math.max(a1, a2) - Math.min(a1, a2)) + Math.min(a1, a2);

    // Return new color
    return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function updateBinaryObject(coords, rgbaColor, isBlobArg) {
    const [x, y] = coords;

    if (x < 0 || y < 0 || y >= binaryRows.length || x >= binaryRows[y].length) {
        console.error('Invalid coordinates', { x, y });
        return;
    }

    binaryRows[y][x].color = rgbaColor;
    binaryRows[y][x].isBlob = isBlobArg;
    if(randNum(0,10) == 1){
        binaryRows[y][x].value = binary.charAt(randNum(0, binary.length-1));
    }
}


function createBlob(){
    if(binaryRows.length > 0){
        let loopCounter = 0; // failsafe variable
        while(true)  { 
            loopCounter++;
            if (loopCounter > 1000){
                console.log("Failed to find a position for creating a new blob. Exiting the loop to avoid crashing.");
                break;
            }
            let testCords = [randNum(0, binaryRows[0].length - 1), randNum(0, binaryRows.length - 1)];


            // Check if there's any blob within the distance of 4 units
            let tooClose = false;
            for (let i = 0; i < binaryRows.length; i++) {
                for (let j = 0; j < binaryRows[i].length; j++) {
                    const currentNum = binaryRows[i][j];
                    if (currentNum.isBlob && getDistance(testCords, currentNum.getCords()) < 5) {
                        tooClose = true;
                        break;
                    }
                }
                if (tooClose) {
                    break;
                }
            }

            // If the chosen location is not too close to any blob, create a new blob there
            if (!tooClose) {
                //binaryRows[testCords[1]][testCords[0]].isBlob = true;
                //binaryRows[testCords[1]][testCords[0]].color = '#CB00EF';
                //updateBinaryObject(testCords,'rgba(0, 0, 0, 1)',true)  
                return {
                    lifeSpan: 0,
                    markedForElimination: false,
                    BlobCords: [testCords]
                }
                
            }
        }
    }   
}

function updateBlobs(){
    for(let i = 0; i < colorBlobs.length; i++){
        if(colorBlobs[i].markedForElimination == true){
            
                let removedCords = colorBlobs[i].BlobCords.pop();
                if(removedCords == undefined){
                    colorBlobs[i] = createBlob();
                }else{
                    updateBinaryObject(removedCords,interpolateColors('rgba(0, 173, 72, 1)', 'rgba(10, 210, 87, 1)'),false) 
                }
                
          
        }else{
        colorBlobs[i].lifeSpan++;
        let killBlob = false;
        if(randNum(0, 10000) <= colorBlobs[i].lifeSpan){
            killBlob = true; 
        }
        
        let thisBlobLongestX = 0;
        let thisBlobLongestY = 0;
        let longestRow = 0
        let longestColumn = 0;

        // Get the longest X and Y chains
        for(let j = 0; j < colorBlobs[i].BlobCords.length; j++){
            if(colorBlobs[i].BlobCords[j][0] > thisBlobLongestX){
                thisBlobLongestX = colorBlobs[i].BlobCords[j][0];
                longestRow = j;
            }
            if(colorBlobs[i].BlobCords[j][1] > thisBlobLongestY){
                thisBlobLongestY = colorBlobs[i].BlobCords[j][1];
                longestColumn = j;
            }
        }
        
        // 1 in 3 chance to expand the blob
        if(randNum(0,2) === 0){
            let newCoords;
            // 70% chance to expand along the longest chain of X or Y
            if(randNum(0, 100) < 70){
                let longestAxis = randNum(0,1) ? 'x' : 'y'; // Randomly select between X and Y
                let direction = randNum(0,1) ? -1 : 1; // Randomly select direction: -1 for decrementing, 1 for incrementing
                
                if(longestAxis === 'x') {
                    newCoords = [thisBlobLongestX + direction, colorBlobs[i].BlobCords[longestRow][1]];
                } else {
                    newCoords = [colorBlobs[i].BlobCords[longestColumn][0], thisBlobLongestY + direction];
                }
            } else {
                // 30% chance to add the new coordinates randomly
                let randomIndex = randNum(0, colorBlobs[i].BlobCords.length - 1);
                let directionX = randNum(0,1) ? -1 : 1;
                let directionY = randNum(0,1) ? -1 : 1;
                newCoords = [colorBlobs[i].BlobCords[randomIndex][0] + directionX, colorBlobs[i].BlobCords[randomIndex][1] + directionY];
            }

            // Validate new coordinates - must not be outside of the binaryRows array
            if(newCoords[0] >= 0 && newCoords[1] >= 0 && newCoords[1] < binaryRows.length && newCoords[0] < binaryRows[0].length) {
                colorBlobs[i].BlobCords.push(newCoords);
            }
        }

        for(let j = 0; j < colorBlobs[i].BlobCords.length; j++){
            
            updateBinaryObject(colorBlobs[i].BlobCords[j],interpolateColors('rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 1)'),true)  
            
        }
        if(killBlob){
            
            colorBlobs[i].markedForElimination = true;
        }
    }
    }
}





var intervalId;
function init() {
    //clear any intervals that are already running
    if(intervalId) {
        clearInterval(intervalId);
    }
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    
    //reset fontsize on resize
    baseFontSize = getBaseFontSize();
    fontSize = 1.5 * baseFontSize;

    const columns = Math.ceil(canvas.width / fontSize);
    const rows = Math.ceil(canvas.height / fontSize);

    if (isNaN(columns) || isNaN(rows) || columns < 0 || rows < 0) {
        console.error('Invalid dimensions calculation', { columns, rows, width: canvas.width, height: canvas.height, fontSize });
        return;
    }

    binaryRows = Array.from({ length: rows }, (_, y) => Array.from({ length: columns }, (_, x) => ({
        value: binary.charAt(randNum(0, binary.length-1)),
        color: interpolateColors('rgba(0, 173, 72, 1)', 'rgba(10, 210, 87, 1)'), //a shade of green
        isBlob: false, //Is this digit part of a blob?
        getCords: function() {
            return [x, y];
        }
    })));
    
    if(colorBlobs.length == 0){
        console.log("making intital blobs");
        for(let i = 0; i < BLOBS_TO_MAKE; i++){
            colorBlobs.push(createBlob())
        }
    }else{
        console.log("not making blobs: " + colorBlobs.length);
    }
    
    intervalId = setInterval(draw, 200);
}

function draw() {
    updateBlobs()
    ctx.fillStyle = 'rgba(0, 0, 0, 1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = fontSize + 'px Georgia';
    ctx.textBaseline = 'top'; 
    ctx.imageSmoothingEnabled = false; 

    for (let i = 0; i < binaryRows.length; i++) {
        for (let j = 0; j < binaryRows[i].length; j++) {
            /*if(!binaryRows[i][j].isBlob && randNum(0,5) == 0){
                binaryRows[i][j].color = interpolateColors('rgba(0, 173, 72, 1)', 'rgba(10, 210, 87, 1)')
            }*/
            var thisNum = binaryRows[i][j];
            ctx.fillStyle = thisNum.color; 
            ctx.fillText(thisNum.value, j * fontSize, i * fontSize);
            
        }
    }
}

window.addEventListener('resize', init);
init();


