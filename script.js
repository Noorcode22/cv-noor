const canvas = document.getElementById('backgroundCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];
const drops = Array(Math.floor(window.innerWidth / 18)).fill(1);

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
        if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
    }
    draw() {
        ctx.fillStyle = '#9c27b0';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particlesArray = [];
    for (let i = 0; i < 80; i++) particlesArray.push(new Particle());
}

function drawMatrix() {
    ctx.fillStyle = "rgba(5, 0, 5, 0.1)"; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ff3d00"; 
    ctx.font = "18px monospace";
    for (let i = 0; i < drops.length; i++) {
        const text = Math.floor(Math.random() * 2);
        ctx.fillText(text, i * 18, drops[i] * 18);
        if (drops[i] * 18 > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
    }
}

function drawNeural() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
        for (let j = i; j < particlesArray.length; j++) {
            let dx = particlesArray[i].x - particlesArray[j].x;
            let dy = particlesArray[i].y - particlesArray[j].y;
            let dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < 150) {
                ctx.strokeStyle = `rgba(156, 39, 176, ${1 - dist/150})`;
                ctx.beginPath(); 
                ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                ctx.lineTo(particlesArray[j].x, particlesArray[j].y); 
                ctx.stroke();
            }
        }
    }
}

function animate() {
    if (document.body.classList.contains('dark-mode')) {
        drawMatrix();
    } else {
        drawNeural();
    }
    requestAnimationFrame(animate);
}

document.getElementById('modeToggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
});

initParticles();
animate();