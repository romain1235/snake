const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let gridSize = 15;
let tileSize = canvas.width / gridSize;
let score = 0;
let bestScore = localStorage.getItem("bestScore") ? parseInt(localStorage.getItem("bestScore")) : 0;
let food = { x: 0, y: 0};
let snake = [{ x: 0, y: 0}];
let direction = { x: 0, y: 0};
let lenght = 3;
let lastTimestamp = 0;
let animationProgress = 0;
let lastSnake = { x: 0, y: 0};
let nextDirection = { x: 0, y: 0};
let nextDirection2 = { x: 0, y: 0};
let pauseSizeModifier = 1;
let pauseSize = 0;
let margin = 0;
let mouseX;
let mouseY;
const snakeHead = document.createElement('img')
snakeHead.src = "/src/snakeHead.svg"
const appleImage = document.createElement('img')
appleImage.src = "/src/apple.svg"
const pauseImage = document.createElement('img')
pauseImage.src = "/src/pause.svg"

function drawHead(x, y, direction){
    ctx.save();
    ctx.translate(x, y);
    if (direction.y === -1) ctx.rotate(0);
    if (direction.x === 1) ctx.rotate(Math.PI / 2);
    if (direction.x === -1) ctx.rotate(-Math.PI / 2); 
    if (direction.y === 1) ctx.rotate(Math.PI);
    ctx.drawImage(snakeHead, 0, 0, 10, 10, 0 - tileSize / 2, 0 - tileSize / 2, tileSize, tileSize);
    ctx.restore();
}


function resizeCanvas() {
    const minDimension = Math.min(window.innerWidth, window.innerHeight)*0.98;
    const maxCanvasSize = Math.floor(minDimension / gridSize) * gridSize;
    canvas.width = maxCanvasSize;
    canvas.height = maxCanvasSize;
    tileSize = maxCanvasSize / gridSize;
}

function resetGame() {
    score = 0;
    snake = [{ x: Math.floor(gridSize / 2), y: Math.floor(gridSize / 2)}];
    direction = { x: 0, y: 0};
    nextDirection = undefined;
    nextDirection2 = undefined;
    lenght = 3;
    dirList = [{ x: 0, y: 0}];
    spawnFood();
}
function drawBackground() {
    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
            ctx.fillStyle = (x + y) % 2 === 0 ? '#282c34' : '#20232a';
            ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
        }
    }
}
function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = `${canvas.width/30}px Arial`;
    ctx.fillText('Score: ' + score, canvas.width/60, canvas.width/25); 
    ctx.fillText('Best Score: ' + bestScore, canvas.width/60, canvas.width/12);
}
function checkCollision() {
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    return false;
}   
function update() {
    if (nextDirection !== undefined) {
        direction = nextDirection;
        nextDirection = undefined;
    }
    if (nextDirection2 !== undefined) {
        nextDirection = nextDirection2;
        nextDirection2 = undefined;
    }
    lastSnake = snake[snake.length - 1];
    if (direction.x === 0 && direction.y === 0) {
        return;
    }
    head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y, dirX: direction.x, dirY: direction.y};
    if (head.x < 0) {
        head.x = gridSize - 1;
    }
    if (head.x >= gridSize) {
        head.x = 0;
    }
    if (head.y < 0) {
        head.y = gridSize - 1;
    }
    if (head.y >= gridSize) {
        head.y = 0;
    }
    if (head.x === food.x && head.y === food.y) {
        score++;
        lenght++;
        spawnFood();
    }
    snake.unshift(head);
    if (snake.length > lenght) {
        snake.pop();
    }
    if (checkCollision()) {
        if (score > bestScore) {
            bestScore = score;
            localStorage.setItem("bestScore", bestScore);
        }
        resetGame();
    }
}
function drawFood(){
    ctx.drawImage(appleImage, 0, 0, 20, 20, food.x * tileSize, food.y * tileSize, tileSize, tileSize);
}
function drawSnake() {
    ctx.beginPath();
    ctx.strokeStyle = 'rgb(0, 128, 0)';
    ctx.lineWidth = tileSize * 0.8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    if (snake.length < 2) {
        ctx.moveTo(snake[0].x * tileSize + tileSize / 2, snake[0].y * tileSize + tileSize / 2);
        ctx.lineTo(snake[0].x * tileSize + tileSize / 2, snake[0].y * tileSize + tileSize / 2);
        ctx.stroke();
        drawHead(snake[0].x * tileSize + tileSize / 2, snake[0].y * tileSize + tileSize / 2, direction);
        return;
    }
    let dirX, dirY;
    let startX, startY;
    let endX, endY;
    if (direction.x === 1 && snake[0].x === 0){
        ctx.moveTo(-0.5 * tileSize, snake[0].y * tileSize + tileSize / 2);
        ctx.lineTo((animationProgress - 0.5) * tileSize, snake[0].y * tileSize + tileSize / 2);
        ctx.stroke();
        drawHead((animationProgress - 0.5) * tileSize, snake[0].y * tileSize + tileSize / 2, direction);
        ctx.beginPath();
        startX = (animationProgress + (gridSize - 1)) * tileSize + tileSize / 2, snake[0].y * tileSize + tileSize / 2;
    }
    else if (direction.x === -1 && snake[0].x === gridSize - 1) {
        ctx.moveTo(gridSize * tileSize + tileSize / 2,snake[0].y * tileSize + tileSize / 2);
        ctx.lineTo((gridSize - animationProgress) * tileSize + tileSize / 2, snake[0].y * tileSize + tileSize / 2);
        ctx.stroke();
        drawHead((gridSize - animationProgress) * tileSize + tileSize / 2, snake[0].y * tileSize + tileSize / 2, direction);
        ctx.beginPath();
        startX = (0 - animationProgress) * tileSize + tileSize / 2;
    }
    else {
        startX = (((snake[0].x - snake[1].x) * animationProgress) + snake[1].x) * tileSize + tileSize/2;
    }
    if (direction.y === 1 && snake[0].y === 0){
        ctx.moveTo(snake[0].x * tileSize + tileSize / 2, -0.5 * tileSize);
        ctx.lineTo(snake[0].x * tileSize + tileSize / 2, (animationProgress - 0.5) * tileSize);
        ctx.stroke();
        drawHead(snake[0].x * tileSize + tileSize / 2, (animationProgress - 0.5) * tileSize, direction);
        ctx.beginPath();
        startY = (animationProgress + (gridSize - 1)) * tileSize + tileSize / 2;
    }
    else if (direction.y === -1 && snake[0].y === gridSize - 1) {
        ctx.moveTo(snake[0].x * tileSize + tileSize / 2, gridSize * tileSize + tileSize / 2);
        ctx.lineTo(snake[0].x * tileSize + tileSize / 2, (gridSize - animationProgress) * tileSize + tileSize / 2);
        ctx.stroke();
        drawHead(snake[0].x * tileSize + tileSize / 2, (gridSize - animationProgress) * tileSize + tileSize / 2, direction);
        ctx.beginPath();
        startY = (0 - animationProgress) * tileSize + tileSize / 2;
    }
    else {
        startY = (((snake[0].y - snake[1].y) * animationProgress) + snake[1].y) * tileSize + tileSize/2;
    }
    dirX = snake[snake.length - 1].dirX
    dirY = snake[snake.length - 1].dirY
    if (snake[snake.length - 1].x === 0 && dirX === 1) {
        ctx.moveTo(gridSize * tileSize + tileSize / 2, snake[snake.length - 1].y * tileSize + tileSize / 2);
        ctx.lineTo((gridSize - (1 - animationProgress)) * tileSize + tileSize / 2, snake[snake.length - 1].y * tileSize + tileSize / 2);
        ctx.stroke();
        ctx.beginPath();
        endX = (-0.5 + animationProgress) * tileSize;
    }
    else if (snake[snake.length - 1].x === gridSize - 1 && dirX === -1) {
        ctx.moveTo(-0.5 * tileSize, snake[snake.length - 1].y * tileSize + tileSize / 2);
        ctx.lineTo((0.5 - animationProgress) * tileSize, snake[snake.length - 1].y * tileSize + tileSize / 2);
        ctx.stroke();
        ctx.beginPath();
        endX = ((gridSize - animationProgress)) * tileSize + tileSize / 2;
    }
    else {
        endX = (((snake[snake.length - 1].x - lastSnake.x) * animationProgress) + lastSnake.x) * tileSize + tileSize/2;
    }
    if (snake[snake.length - 1].y === 0 && dirY === 1) {
        ctx.moveTo(snake[snake.length - 1].x * tileSize + tileSize / 2, gridSize * tileSize + tileSize / 2);
        ctx.lineTo(snake[snake.length - 1].x * tileSize + tileSize / 2, (gridSize - (1 - animationProgress)) * tileSize + tileSize / 2);
        ctx.stroke();
        ctx.beginPath();
        endY = (-0.5 + animationProgress) * tileSize;
    }
    else if (snake[snake.length - 1].y === gridSize - 1 && dirY === -1) {
        ctx.moveTo(snake[snake.length - 1].x * tileSize + tileSize / 2, -0.5 * tileSize);
        ctx.lineTo(snake[snake.length - 1].x * tileSize + tileSize / 2, (0.5 - animationProgress) * tileSize);
        ctx.stroke();
        ctx.beginPath();
        endY = ((gridSize - animationProgress)) * tileSize + tileSize / 2;
    }
    else {
        endY = (((snake[snake.length - 1].y - lastSnake.y) * animationProgress) + lastSnake.y) * tileSize + tileSize/2;
    }
    ctx.lineTo(startX, startY);
    for (let i = 0; i < snake.length - 1; i++) {
        const curr = snake[i];
        const next = snake[i + 1];
        if ((Math.abs(curr.x - next.x) > 1 || Math.abs(curr.y - next.y) > 1) && i!==0) {
            if (curr.x === next.x) {
                dirX = 0;
            }
            else {
                dirX = (curr.x - next.x) / Math.abs(curr.x - next.x);
            }
            if (curr.y === next.y) {
                dirY = 0;
            }
            else {
                dirY = (curr.y - next.y) / Math.abs(curr.y - next.y);
            }
            ctx.lineTo(((curr.x + dirX) * tileSize) + (tileSize/2), ((curr.y + dirY) * tileSize) + (tileSize/2));
            ctx.stroke();
            ctx.beginPath();
            ctx.lineTo(((next.x - dirX) * tileSize) + (tileSize/2), ((next.y - dirY) * tileSize) + (tileSize/2));
        }
        ctx.lineTo((next.x * tileSize) + (tileSize/2), (next.y * tileSize) + (tileSize/2));    
        
    };
    ctx.lineTo(endX, endY);
    ctx.stroke();
    drawHead(startX, startY, direction);
}
function gameLoop(timestamp) {
    const deltaTime = timestamp - lastTimestamp;
    animationProgress += deltaTime / 140;
    if (animationProgress > 1) {
        animationProgress = 0;
        update();
    }
    draw();
    requestAnimationFrame(gameLoop);
    lastTimestamp = timestamp;
}
 function dist(x, y){
    return Math.sqrt(x*x + y*y);
 }
function pauseButton() {
    pauseSize = (canvas.width / 20) * pauseSizeModifier;
    margin = canvas.width / 50 - ((pauseSize - canvas.width / 20) / 2);
    if (dist(mouseX - (canvas.width - (pauseSize / 2) - margin), mouseY - (pauseSize / 2 + margin)) < pauseSize / 1.4) {
        pauseSizeModifier += (1.2 - pauseSizeModifier)/3;
    }
    else {
        pauseSizeModifier += (1 - pauseSizeModifier)/3;
    }
    ctx.drawImage(pauseImage, 0, 0, 15, 15, canvas.width - pauseSize - margin, margin, pauseSize, pauseSize);
}


function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawSnake();
    drawFood();
    drawScore();
    pauseButton();
}
function spawnFood() {
    food.x = Math.floor(Math.random() * gridSize);
    food.y = Math.floor(Math.random() * gridSize);
    for (let i = 0; i < snake.length; i++) {
        if (snake[i].x === food.x && snake[i].y === food.y) {
            spawnFood();
            return;
        }
    }
}
function changeDirection(dir){
    if (dir.y === 0){
        if (direction.x !== 0 - dir.x && nextDirection === undefined) {
            nextDirection = dir;
        }
        else if (nextDirection.x !== 0 - dir.x && nextDirection2 === undefined) {
            nextDirection2 = dir;
        }
    }
    else {
        if (direction.y !== 0 - dir.y && nextDirection === undefined) {
            nextDirection = dir;
        }
        else if (nextDirection.y !== 0 - dir.y && nextDirection2 === undefined) {
            nextDirection2 = dir;
        }
    }
}
window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            changeDirection({ x: 0, y: -1});
            break;
        case 'ArrowDown':
            if(direction.y !== -1){
                changeDirection({ x: 0, y: 1});
            }
            break;
        case 'ArrowLeft':
            if(direction.x !== 1) { 
                changeDirection({ x: -1, y: 0});
            }
            break;
        case 'ArrowRight':
            if(direction.x !== -1){ 
                changeDirection({ x: 1, y: 0});
            }
            break;
        
    }
});
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
});
window.addEventListener('resize', resizeCanvas);
resizeCanvas();
resetGame();

snakeHead.onload = () => {
    requestAnimationFrame(gameLoop);
}