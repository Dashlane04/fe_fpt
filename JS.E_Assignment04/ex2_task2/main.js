const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function drawRectangle(x, y, width, height, color) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

// Test the function with expected output
drawRectangle(50, 50, 100, 100, 'blue');
