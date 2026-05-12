// Fetch goals from our server
async function loadGoals() {
    const response = await fetch('/api/goals');
    const goals = await response.json();
    const container = document.getElementById('goal-display');
    container.innerHTML = goals.map(g => `
        <div class="goal-card">
            <h3>${g.title}</h3>
            <p>Target: ${g.amount}</p>
        </div>
    `).join('');
}

// Initialize
loadGoals();

// Placeholder for wheel spin function
function spinWheel() {
    alert("Wheel is spinning!");
    // We will add the math for the wheel rotation here later
}
