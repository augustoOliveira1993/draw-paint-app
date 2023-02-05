const canvas = document.querySelector('canvas'),
    toolBrn = document.querySelectorAll('.tool'),
    sizeSlider = document.querySelector('#size-slider'),
    fillCorlor = document.querySelector('#fill-color'),
    colorBtns = document.querySelectorAll('.colors .option'),
    colorPicker = document.querySelector('#color-picker'),
    clearCanvas = document.querySelector('.clear-canvas'),
    saveImg = document.querySelector('.save-img'),
    widthCanvas = document.querySelector('#width-canvas'),
    heightCanvas = document.querySelector('#height-canvas'),
    isTransparent = document.querySelector('#is-color-bg'),
    ctx = canvas.getContext('2d');

let prevMouseX, prevMouseY, snapshot,
    isDrawing = false,
    selectedTool = 'brush',
    brushWidth = 5,
    selectedColor = '#000';

const setCanvasBackground = () => {
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor;
}

window.addEventListener('load', () => {
    console.log(selectedColor)
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    widthCanvas.value = canvas.width;
    heightCanvas.value = canvas.height;


})

const drawRect = (e) => {
    if (!fillCorlor.checked) {
        return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY)
    }
    ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY)
}

const drawCircle = (e) => {
    ctx.beginPath()
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2))
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI)
    fillCorlor.checked ? ctx.fill() : ctx.stroke()
}

const drawTriangle = (e) => {
    ctx.beginPath()
    ctx.moveTo(prevMouseX, prevMouseY)
    ctx.lineTo(e.offsetX, e.offsetY)
    ctx.lineTo(prevMouseX *2 - e.offsetX, e.offsetY)
    ctx.closePath()
    fillCorlor.checked ? ctx.fill() : ctx.stroke()
}

const drawLine = (e) => {
    ctx.beginPath()
    ctx.moveTo(prevMouseX, prevMouseY)
    ctx.lineTo(e.offsetX, e.offsetY)
    ctx.stroke()
}
const startDraw = (e) => {
    isDrawing = true;
    prevMouseY = e.offsetY;
    prevMouseX = e.offsetX;
    ctx.beginPath();
    ctx.lineWidth = brushWidth;
    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedColor;
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

const drawing = (e) => {
    if (!isDrawing) return;
    ctx.putImageData(snapshot, 0, 0);
    if (selectedTool === 'brush' || selectedTool === 'eraser') {
        ctx.strokeStyle = selectedTool === 'eraser' ? '#fff' : selectedColor;
        ctx.lineTo(e.offsetX, e.offsetY)
        ctx.stroke()
    }
    if (selectedTool === 'rectangle') {
        drawRect(e)
    }
    if (selectedTool === 'circle') {
        drawCircle(e)
    }
    if(selectedTool === 'triangle'){
        drawTriangle(e)
    }
    if(selectedTool === 'line'){
        drawLine(e)
    }

}

toolBrn.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.options .active').classList.remove('active')
        btn.classList.add('active')
        selectedTool = btn.id
    })
})

sizeSlider.addEventListener('change', () => brushWidth = sizeSlider.value)

colorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.options .selected').classList.remove('selected')
        btn.classList.add('selected')
        selectedColor = window.getComputedStyle(btn).getPropertyValue('background-color')
    })
})

colorPicker.addEventListener('change', () => {
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
    selectedColor = colorPicker.value;
})

clearCanvas.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setCanvasBackground();
})
saveImg.addEventListener('click', () => {
    if(!isTransparent.checked) {
        setCanvasBackground();
    }
    const link = document.createElement('a');
    link.download = `paint-app-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();

})

canvas.addEventListener("mousedown", startDraw)
canvas.addEventListener("mousemove", drawing)
canvas.addEventListener("mouseup", () => isDrawing = false)
