const canvas = document.getElementById('backgroundCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];
let drops = Array(Math.floor(window.innerWidth / 18)).fill(1);

// Particle Class for Neural effect
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

// Dark Mode Matrix Numbers
function drawMatrix() {
    ctx.fillStyle = "rgba(5, 0, 5, 0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#ff3d00";
    let fontSize = 20;
    ctx.font = fontSize + "px monospace";

    let columns = Math.floor(canvas.width / fontSize);
    if (drops.length !== columns) {
        drops.length = columns;
        for (let i = 0; i < columns; i++) {
            if (!drops[i]) drops[i] = Math.random() * canvas.height / fontSize;
        }
    }

    for (let i = 0; i < drops.length; i++) {
        const text = Math.floor(Math.random() * 2);
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
    }
}

// Neural Particle background
function drawNeural() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
        for (let j = i; j < particlesArray.length; j++) {
            let dx = particlesArray[i].x - particlesArray[j].x;
            let dy = particlesArray[i].y - particlesArray[j].y;
            let dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
                ctx.strokeStyle = `rgba(156, 39, 176, ${1 - dist / 150})`;
                ctx.beginPath();
                ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                ctx.stroke();
            }
        }
    }
}

// Animate everything
function animate() {
    if (document.body.classList.contains('dark-mode')) {
        drawMatrix();
    } else {
        drawNeural();
    }
    requestAnimationFrame(animate);
}

// Toggle dark mode
document.getElementById('modeToggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

// Resize handler
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
});

// Hover effect on profile image
const profilePic = document.querySelector('.profile-pic');
profilePic.addEventListener('mouseover', () => {
    profilePic.style.transform = 'scale(1.05)';
    profilePic.style.boxShadow = '0 0 20px #ff3d00';
});
profilePic.addEventListener('mouseout', () => {
    profilePic.style.transform = 'scale(1)';
    profilePic.style.boxShadow = 'none';
});

// Info-box border animation
const infoBoxes = document.querySelectorAll('.info-box');
infoBoxes.forEach(box => {
    box.addEventListener('mouseover', () => {
        box.style.border = '2px solid #ff3d00';
        box.style.transform = 'scale(1.02)';
    });
    box.addEventListener('mouseout', () => {
        box.style.border = '2px solid var(--border-color)';
        box.style.transform = 'scale(1)';
    });
});

initParticles();
animate();
