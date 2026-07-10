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
            // Fetch a random real Roblox avatar from known classic users
            const validUserIds = [1, 261, 156, 16, 18, 2, 177, 184, 175, 43, 62];
            const randomUserId = validUserIds[Math.floor(Math.random() * validUserIds.length)];
            const apiUrl = `https://thumbnails.roproxy.com/v1/users/avatar-headshot?userIds=${randomUserId}&size=150x150&format=Png&isCircular=true`;

            // Default blank Roblox avatar as fallback
            const fallbackAvatar = "https://tr.rbxcdn.com/38c6edcb50633730ff4cf39ac8859840/150/150/AvatarHeadshot/Png";

            fetch(apiUrl)
                .then(res => res.json())
                .then(data => {
                    if (data.data && data.data.length > 0 && data.data[0].imageUrl) {
                        avatarImage.src = data.data[0].imageUrl;
                    } else {
                        avatarImage.src = fallbackAvatar;
                    }
                })
                .catch(() => {
                    avatarImage.src = fallbackAvatar;
                });

            avatarName.textContent = val;
            avatarPreview.style.display = 'flex';
        }, 600);
    } else {
        avatarPreview.style.display = 'none';
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
        { progress: 15, delay: 1000, title: "Connecting...", text: "Connecting to secure servers..." },
        { progress: 35, delay: 2000, title: "Searching", text: `Looking for user "${username}"...` },
        { progress: 50, delay: 1500, title: "User Found!", text: "Successfully linked to account." },
        { progress: 75, delay: 2500, title: "Generating Robux", text: `Preparing ${amount.toLocaleString()} Robux...` },
        { progress: 90, delay: 2000, title: "Sending", text: "Transferring Robux to your account..." },
        { progress: 100, delay: 1500, title: "Almost Done!", text: "Finalizing transaction..." }
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
            loadingText.innerHTML = `<strong>${amount.toLocaleString()} Robux</strong> have been successfully added to <strong>${username}</strong>'s account!`;
            
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
