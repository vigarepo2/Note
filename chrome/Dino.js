// 1. Check if the game actually exists on this page
if (typeof window.Runner === 'undefined') {
    alert("Error: The game was not found! Make sure you are exactly on chrome://dino");
} else {
    // 2. Clear any stuck bots
    if (window.botInterval) clearInterval(window.botInterval);

    // 3. Start the game if it hasn't started
    if (!window.Runner.instance_ || !window.Runner.instance_.playing) {
        // Trigger a spacebar press to start
        document.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 32, which: 32 }));
    }

    // 4. The Bot Logic
    window.botInterval = setInterval(() => {
        const runner = window.Runner.instance_;
        
        if (!runner || !runner.playing) return;

        const obstacle = runner.horizon.obstacles[0];
        if (!obstacle) return;

        // Calculate when to react based on current game speed
        const reactDistance = runner.currentSpeed * 15;

        if (obstacle.xPos < reactDistance) {
            // Pterodactyls in the air
            if (obstacle.yPos === 75 || obstacle.yPos === 50) {
                runner.onKeyDown({ keyCode: 40, preventDefault: () => {} }); // Duck
                setTimeout(() => {
                    runner.onKeyUp({ keyCode: 40, preventDefault: () => {} });
                }, 400);
            } else {
                // Cactuses and low birds
                runner.onKeyDown({ keyCode: 38, preventDefault: () => {} }); // Jump
                setTimeout(() => {
                    runner.onKeyUp({ keyCode: 38, preventDefault: () => {} });
                }, 400);
            }
        }
    }, 15);

    console.log("Bot Activated! Enjoy the run.");
}
