<script setup>
import { onMounted } from 'vue';
let canvas;
let ctx;

onMounted(() => {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    requestAnimationFrame(gameLoop);
});
let gridWidth = 200;
let gridHeight = 100;
let grid =[];
for (let i = 0; i < gridWidth; i++) {
    grid[i] = [];
    for (let j = 0; j < gridHeight; j++) {
        grid[i][j] = 0;
    }
}
function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
function gameLoop() {
    draw();
    requestAnimationFrame(gameLoop);
}
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
</script>

<template>
    <canvas id="canvas"></canvas>
</template>

<style scoped>
    * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

canvas {
    display: block;
    border: 0px solid black;
}
</style>