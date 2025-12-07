// Handle tab switching
const tabs = document.querySelectorAll(".tab");

// Show the specified ballot and hide others
function showBallot(ballotType) {
    // Hide all ballots
    document.querySelectorAll('.ballot').forEach(ballot => {
        ballot.style.display = 'none';
    });
    
    // Show the selected ballot
    const selectedBallot = document.getElementById(`${ballotType}-ballot`);
    if (selectedBallot) {
        selectedBallot.style.display = 'block';
        
        // Reset all lights in the selected ballot
        selectedBallot.querySelectorAll('.light').forEach(light => {
            light.classList.remove('on');
        });
        
        // Update disabled state of vote buttons
        disableEmptyCandidateButtons();
    }
}

tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        const tabType = tab.getAttribute('data-tab');
        
        // Update tab classes
        tabs.forEach(t => {
            t.classList.remove("active");
            t.classList.add("inactive");
        });
        
        tab.classList.remove("inactive");
        tab.classList.add("active");
        
        // Show the corresponding ballot
        showBallot(tabType);
    });
});

// Function to disable vote buttons for empty candidate names
function disableEmptyCandidateButtons() {
    document.querySelectorAll('.row').forEach(row => {
        const nameElement = row.querySelector('.name');
        const voteButton = row.querySelector('.vote-btn');
        
        if (nameElement && voteButton) {
            const name = nameElement.textContent.trim();
            voteButton.disabled = !name;
        }
    });
}

// Initialize with the District ballot visible by default
showBallot('ward');
disableEmptyCandidateButtons(); // Disable buttons for empty names on initial load

// Audio element for playing beep sound
let beepSound = null;

// Function to play beep sound from MP3 file
function playBeep() {
    try {
        if (!beepSound) {
            beepSound = new Audio('assets/censor-beep-3-372460.mp3');
            beepSound.load();
        }
        beepSound.currentTime = 0;
        beepSound.play().catch(e => console.error('Error playing beep sound:', e));
    } catch (e) {
        console.error('Error initializing audio:', e);
    }
}

// Initialize audio on first user interaction
function initAudio() {
    if (!beepSound) {
        beepSound = new Audio('assets/censor-beep-3-372460.mp3');
        beepSound.load().catch(e => console.error('Error loading audio:', e));
    }
}

document.addEventListener('click', initAudio, { once: true });

// Function to show success message
function showSuccessMessage(callback) {
    const successScreen = document.getElementById('successScreen');
    if (!successScreen) return;
    
    // Play beep sound
    // playBeep();
    
    // Show success screen
    successScreen.classList.add('visible');
    
    // Hide after 1.5 seconds and execute callback
    setTimeout(() => {
        successScreen.classList.remove('visible');
        if (typeof callback === 'function') {
            callback();
        }
    }, 1800);
}

// Function to show voted screen with candidate info
function showVotedScreen(candidateData) {
    const votedScreen = document.getElementById('votedScreen');
    if (!votedScreen) return;
    
    // Update the voted screen with candidate data
    if (candidateData) {
        const photoElement = votedScreen.querySelector('.candidate-photo .photo');
        const nameElement = votedScreen.querySelector('.candidate-name');
        const englishNameElement = votedScreen.querySelector('.candidate-english-name');
        const wardElement = votedScreen.querySelector('.ward-info span');
        const symbolElement = votedScreen.querySelector('.ladder-icon');
        
        // Update photo
        if (photoElement) {
            photoElement.src = candidateData.photo || 'candid.png';
        }
        
        // Update names
        if (nameElement) {
            nameElement.textContent = candidateData.name;
        }
        if (englishNameElement) {
            englishNameElement.textContent = candidateData.englishName || '';
        }
        
        // Update ward/ballot info
        if (wardElement) {
            let displayText;
            if (candidateData.ward) {
                displayText = `WARD: ${candidateData.ward}`;
            } else {
                displayText = `${candidateData.ballotType.toUpperCase()}: ${candidateData.number}`;
            }
            wardElement.textContent = displayText;
        }
        
        // Update symbol
        if (symbolElement && candidateData.symbol) {
            symbolElement.src = candidateData.symbol;
        }
    }
    
    // Show the voted screen
    votedScreen.classList.add('visible');
    document.body.style.overflow = 'hidden';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Get candidate data from a row
function getCandidateData(row) {
    const nameElement = row.querySelector('.name');
    const symbolElement = row.querySelector('.symbol, .ladder-icon');
    const ballot = row.closest('.ballot');
    const ballotType = ballot.id.split('-')[0]; // 'ward', 'block', or 'district'
    const candidateNumber = row.querySelector('.number')?.textContent || '1';
    
    let name = '';
    let englishName = '';
    let photo = 'candid.png'; // Default photo
    let symbol = 'ladder.svg'; // Default symbol (in root)
    
    // Special handling for specific candidates
    if (nameElement) {
        // Normalize the candidate name by removing zero-width spaces and trimming
        const candidateName = nameElement.textContent
            .replace(/[\u200B-\u200D\uFEFF]/g, '') // Remove zero-width spaces
            .trim();
        
        // Use includes() for more flexible matching
        if (candidateName.includes('എ.കെ നസീബ ടീച്ചർ') || candidateName.includes('എ.കെ.നസീബ ടീച്ചർ')) {
            name = 'എ.കെ നസീബ ടീച്ചർ';
            englishName = 'Munniyoor';
            photo = 'assets/candid.jpeg';
            symbol = 'assets/ladder1.svg';
            ward = '10';
        } else if (candidateName.includes('എൻ എം അൻവർ സാദത്ത്') || candidateName.includes('എൻ എം ⁠അൻവർ സാദത്ത്') || candidateName.includes('അന്വർ സാദത്ത്')) {
            name = 'എൻ എം ⁠അൻവർ സാദത്ത്';
            englishName = 'Munniyoor';
            photo = 'assets/candid2.png';
            symbol = 'assets/ladder2.svg';
            ward = '10';
        } else if (candidateName.includes('ഹനീഫ മൂന്നിയൂർ') || candidateName.includes('ഹനീഫ് മൂന്നിയൂർ')) {
            name = 'ഹനീഫ മൂന്നിയൂർ';
            englishName = 'Munniyoor';
            photo = 'assets/candid3.png';
            symbol = 'assets/ladder3.svg';
            ward = '10';
        } else {
            // No matching candidate found
            return null;
        }
    }
    
    const candidateInfo = {
        name: name,
        englishName: englishName,
        number: candidateNumber,
        ballotType: ballotType,
        symbol: symbol,
        photo: photo
    };
    
    // Add ward if it exists
    if (ward) {
        candidateInfo.ward = ward;
    }
    
    return candidateInfo;
}

// Handle Vote Again button click
document.getElementById('voteAgainBtn')?.addEventListener('click', () => {
    const votedScreen = document.getElementById('votedScreen');
    if (votedScreen) {
        votedScreen.classList.remove('visible');
    }
    
    // Re-enable scrolling on the body
    document.body.style.overflow = 'auto';
    
    // Reset all lights
    document.querySelectorAll('.light').forEach(light => {
        light.classList.remove('on');
    });
    
    // Re-enable all vote buttons
    document.querySelectorAll('.vote-btn').forEach(btn => {
        btn.classList.remove('disabled');
        btn.disabled = false;
    });
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Handle voting button click for all ballots
document.addEventListener('click', (e) => {
    // Check if the click was on a vote button
    if (e.target.classList.contains('vote-btn')) {
        const row = e.target.closest('.row');
        if (row) {
            // Turn off all lights in the current ballot
            const currentBallot = row.closest('.ballot');
            currentBallot.querySelectorAll('.light').forEach(light => {
                light.classList.remove('on');
            });
            
            // Turn on the selected light
            const light = row.querySelector('.light');
            if (light) {
                light.classList.add('on');
                
                // Play beep sound immediately on click
                playBeep();
                
                // Disable all vote buttons to prevent multiple clicks
                document.querySelectorAll('.vote-btn').forEach(btn => {
                    btn.disabled = true;
                });
                
                // Show a loading state on the light
                light.classList.add('processing');
                
                // Set a 10-second delay before showing success
                setTimeout(() => {
                    // Get candidate data and show success message
                    const candidateData = getCandidateData(row);
                    showSuccessMessage(() => {
                        // Re-enable vote buttons after processing
                        document.querySelectorAll('.vote-btn').forEach(btn => {
                            btn.disabled = false;
                        });
                        light.classList.remove('processing');
                        showVotedScreen(candidateData);
                    });
                }, 3000); // 10 seconds delay
            }
        }
    }
});
