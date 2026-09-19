// 1. Clear any stuck bots if you run this multiple times
if (window.botInterval) clearInterval(window.botInterval);

// 2. Start the game if it's paused or hasn't started
if (!window.Runner.instance_.playing) {
    window.Runner.instance_.onKeyDown({ keyCode: 32, preventDefault: () => {} });
}

// 3. The Bot Logic
window.botInterval = setInterval(() => {
    const runner = window.Runner.instance_;
    
    // Stop calculating if game is over or not playing
    if (!runner || !runner.playing) return;

    const obstacle = runner.horizon.obstacles[0];
    if (!obstacle) return;

    // Calculate when to react based on current game speed
    const reactDistance = runner.currentSpeed * 15;

    if (obstacle.xPos < reactDistance) {
        // If the obstacle is a mid-air Pterodactyl (yPos is usually 75 or 50)
        if (obstacle.yPos === 75 || obstacle.yPos === 50) {
            // Duck
            runner.onKeyDown({ keyCode: 40, preventDefault: () => {} });
            setTimeout(() => {
                runner.onKeyUp({ keyCode: 40, preventDefault: () => {} });
            }, 400);
        } else {
            // Jump over cactuses and low birds
            runner.onKeyDown({ keyCode: 38, preventDefault: () => {} });
            setTimeout(() => {
                runner.onKeyUp({ keyCode: 38, preventDefault: () => {} });
            }, 400);
        }
    }
}, 15);

console.log("Bot Activated! Enjoy the run.");
