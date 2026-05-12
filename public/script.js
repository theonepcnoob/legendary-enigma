const socket = io();

// 1. Existing Logic: Fetch Goals
async function loadGoals() {
    const response = await fetch('/api/goals');
    const goals = await response.json();
    const container = document.getElementById('goal-display');
    container.innerHTML = goals.map(g => `
        <div class="goal-card">
            <h3>${g.title}</h3>
            <p>Target: ${g.amount} subs</p>
        </div>
    `).join('');
}

// 2. New Logic: Real-time Spin
function spinWheel() {
    socket.emit('spin'); // Everyone gets the signal
}

socket.on('triggerSpin', () => {
    const wheel = document.getElementById('wheel');
    const randomDegree = Math.floor(Math.random() * 3600) + 360;
    wheel.style.transition = "transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)";
    wheel.style.transform = `rotate(${randomDegree}deg)`;
});

loadGoals();
