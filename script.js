const usernameInput = document.getElementById('usernameInput');
const avatarPreview = document.getElementById('avatarPreview');
const avatarImage = document.getElementById('avatarImage');
const avatarName = document.getElementById('avatarName');

const loadingModal = document.getElementById('loadingModal');
const loadingTitle = document.getElementById('loadingTitle');
const loadingText = document.getElementById('loadingText');
const progressFill = document.getElementById('progressFill');
const spinner = document.getElementById('spinner');
const successIcon = document.getElementById('successIcon');

let debounceTimer;

usernameInput.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    const val = e.target.value.trim();
    
    if (val.length >= 3) {
        // Mocking an avatar appearance delay after typing
        debounceTimer = setTimeout(() => {
            // Select a random real Roblox avatar from our local collection
            const validAvatars = [
                'avatar1.png',
                'avatar2.png',
                'avatar3.png',
                'avatar4.png',
                'avatar5.png',
                'avatar6.png',
                'avatar7.png'
            ];
            const randomAvatar = validAvatars[Math.floor(Math.random() * validAvatars.length)];
            
            // Save to localStorage so profile.html can use them
            localStorage.setItem('robloxUsername', val);
            localStorage.setItem('robloxAvatar', randomAvatar);

            avatarImage.src = randomAvatar;
            avatarName.textContent = val;
            avatarPreview.style.display = 'flex';
        }, 600);
    } else {
        avatarPreview.style.display = 'none';
        // Clear if less than 3 chars (optional, but good for reset)
        localStorage.removeItem('robloxUsername');
        localStorage.removeItem('robloxAvatar');
    }
});

function claim(amount) {
    const username = usernameInput.value.trim();
    if (username.length < 3) {
        alert("Please enter your Roblox username first!");
        usernameInput.focus();
        return;
    }

    // Reset Modal State
    spinner.style.display = 'block';
    successIcon.style.display = 'none';
    progressFill.style.width = '0%';
    const existingBtn = document.getElementById('closeModalBtn');
    if(existingBtn) existingBtn.remove();

    loadingModal.classList.add('active');
    
    // Animation sequence to look like it's hacking/generating
    const steps = [
        { progress: 10, delay: 1000, title: "Connecting...", text: "Establishing secure connection to Roblox servers..." },
        { progress: 25, delay: 1500, title: "Searching", text: `Searching for user "${username}" in database...` },
        { progress: 40, delay: 1200, title: "User Found!", text: "Synchronizing profile and checking status..." },
        { progress: 60, delay: 2000, title: "Generating Robux", text: `Preparing ${amount.toLocaleString()} Robux for injection...` },
        { progress: 75, delay: 1800, title: "Bypassing Security", text: "Masking transaction (Anti-Ban protection active)..." },
        { progress: 90, delay: 2000, title: "Sending to Account", text: "Transferring Robux to your balance..." },
        { progress: 100, delay: 1500, title: "Finalizing", text: "Clearing tracks and saving results..." }
    ];

    let currentStep = 0;

    function nextStep() {
        if (currentStep < steps.length) {
            const step = steps[currentStep];
            progressFill.style.width = step.progress + '%';
            loadingTitle.textContent = step.title;
            loadingText.textContent = step.text;
            
            setTimeout(() => {
                currentStep++;
                nextStep();
            }, step.delay);
        } else {
            // Success Screen
            spinner.style.display = 'none';
            successIcon.style.display = 'block';
            
            loadingTitle.textContent = "Success!";
            loadingTitle.style.color = "#22c55e";
            loadingText.innerHTML = `<strong>${amount.toLocaleString()} Robux</strong> have been successfully sent to <strong>${username}</strong>'s account!<br><br>They will be added to your balance within a few minutes.`;
            
            // Add a close button
            const btn = document.createElement('button');
            btn.id = 'closeModalBtn';
            btn.textContent = "Awesome!";
            btn.className = "success-btn";
            btn.onclick = () => {
                loadingModal.classList.remove('active');
                setTimeout(() => {
                    loadingTitle.style.color = "#111"; // reset
                }, 300);
            };
            document.querySelector('.modal-content').appendChild(btn);
        }
    }

    // Start Sequence
    setTimeout(nextStep, 500);
}

// Countdown Timer Logic
window.addEventListener('DOMContentLoaded', () => {
    const timerDisplay = document.getElementById('countdownTimer');
    if (timerDisplay) {
        let duration = 22 * 60 * 60; // 22 hours in seconds
        
        // Initial render
        const updateDisplay = () => {
            let hours = Math.floor(duration / 3600);
            let minutes = Math.floor((duration % 3600) / 60);
            let seconds = Math.floor(duration % 60);
            
            hours = hours < 10 ? "0" + hours : hours;
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;
            
            timerDisplay.textContent = hours + ":" + minutes + ":" + seconds;
        };
        
        updateDisplay();
        
        setInterval(() => {
            if (duration > 0) {
                duration--;
            }
            updateDisplay();
        }, 1000);
    }
});
