// ==========================================
// 1. MP LOCATION VALIDATION (Legal & Regional)
// ==========================================
const mpCities = [
    "bhopal", "indore", "gwalior", "jabalpur", "ujjain", "sagar", "rewa", "satna", 
    "ratlam", "burhanpur", "khandwa", "dewas", "bhind", "shivpuri", "chhindwara", 
    "guna", "vidisha", "chhatarpur", "damoh", "mandsaur", "khargone", "neemuch", 
    "itarsi", "sehore", "hoshangabad", "betul", "seoni", "datia", "narsinghpur"
];

function isLocationInMP(city) {
    if (!city) return false;
    return mpCities.includes(city.toLowerCase().trim());
}

// ==========================================
// 2. POST RIDE LOGIC (With Safety Checks)
// ==========================================
const rideForm = document.getElementById('rideForm');
if (rideForm) {
    rideForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const from = document.getElementById('fromCity').value;
        const to = document.getElementById('toCity').value;

        // MP Only Validation
        if (!isLocationInMP(from) || !isLocationInMP(to)) {
            alert("❌ RidePartner abhi sirf MP mein available hai. Kripya MP ke shehar chunein.");
            return;
        }

        const newRide = {
            id: Date.now(), // Unique ID for each ride
            driverName: document.getElementById('driverName').value,
            from: from.toLowerCase(),
            to: to.toLowerCase(),
            date: document.getElementById('rideDate').value,
            time: document.getElementById('rideTime').value,
            seats: document.getElementById('seats').value,
            price: document.getElementById('price').value,
            phone: document.getElementById('driverPhone').value
        };

        let rides = JSON.parse(localStorage.getItem('allRides')) || [];
        rides.push(newRide);
        localStorage.setItem('allRides', JSON.stringify(rides));
        
        alert("Ride Published Successfully! 🚀");
        window.location.href = 'findride.html';
    });
}

// ==========================================
// 3. DISPLAY & SEARCH RIDES (Mobile-Friendly)
// ==========================================
function displayRides(filter = null) {
    const ridesDisplay = document.getElementById('ridesDisplay');
    if (!ridesDisplay) return;

    let allRides = JSON.parse(localStorage.getItem('allRides')) || [];

    // Apply Filter if exists
    if (filter) {
        allRides = allRides.filter(ride => {
            const matchFrom = filter.from ? ride.from.includes(filter.from.toLowerCase()) : true;
            const matchTo = filter.to ? ride.to.includes(filter.to.toLowerCase()) : true;
            const matchDate = filter.date ? ride.date === filter.date : true;
            return matchFrom && matchTo && matchDate;
        });
    }

    if (allRides.length === 0) {
        ridesDisplay.innerHTML = `
            <div class="empty-state" style="text-align:center; padding:20px;">
                <p>Abhi koi ride available nahi hai. <br> <small>Sirf MP ke shehron mein search karein.</small></p>
            </div>`;
        return;
    }

    ridesDisplay.innerHTML = ""; 
    allRides.forEach((ride, index) => {
        ridesDisplay.innerHTML += `
            <div class="ride-card" style="margin-bottom:15px; border:1px solid #ddd; padding:15px; border-radius:10px;">
                <div class="card-header" style="display:flex; justify-content:space-between;">
                    <h4 style="text-transform: capitalize;">${ride.from} ➔ ${ride.to}</h4>
                    <span class="price" style="font-weight:bold; color:#27ae60;">₹${ride.price}</span>
                </div>
                <div class="card-body" style="font-size:0.9rem; margin:10px 0;">
                    <p>👤 <strong>Driver:</strong> ${ride.driverName || 'Guest'}</p>
                    <p>📅 <strong>Date:</strong> ${ride.date} | <strong>Time:</strong> ${ride.time}</p>
                    <p>💺 <strong>Seats:</strong> ${ride.seats} | <strong>Status:</strong> MP Authorized ✅</p>
                </div>
                <div class="card-footer">
                    <button onclick="goToDetails(${index})" class="btn-view" style="width:100%; padding:10px; background:#0D273D; color:white; border:none; border-radius:5px;">
                        View Details
                    </button>
                </div>
            </div>`;
    });
}

// Helper for redirection (Mobile friendly)
function goToDetails(index) {
    window.location.href = `ride-details.html?id=${index}`;
}

// Search Button Fix
const searchBtn = document.getElementById('searchBtn');
if (searchBtn) {
    searchBtn.addEventListener('click', () => {
        const from = document.getElementById('searchFrom').value;
        const to = document.getElementById('searchTo').value;
        const date = document.getElementById('searchDate').value;
        displayRides({ from, to, date });
    });
}

// ==========================================
// 4. AUTHENTICATION (Signup/Login)
// ==========================================
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const newUser = {
            name: document.getElementById('userName').value,
            phone: document.getElementById('userPhone').value,
            email: document.getElementById('userEmail').value,
            pass: document.getElementById('userPass').value,
            gender: document.getElementById('userGender')?.value || "Not Specified",
            student: document.getElementById('isStudent')?.value || "no"
        };

        let users = JSON.parse(localStorage.getItem('allUsers')) || [];
        if (users.some(u => u.email === newUser.email)) {
            alert("Email already exists!");
            return;
        }

        users.push(newUser);
        localStorage.setItem('allUsers', JSON.stringify(users));
        alert("Signup Successful! 🎉");
        window.location.href = 'login.html';
    });
}

const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const emailInput = document.getElementById('loginEmail').value;
        const passInput = document.getElementById('loginPass').value;
        let users = JSON.parse(localStorage.getItem('allUsers')) || [];
        const user = users.find(u => u.email === emailInput && u.pass === passInput);

        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            alert(`Welcome back, ${user.name}!`);
            window.location.href = 'index.html';
        } else {
            alert("Galt Email ya Password!");
        }
    });
}

// ==========================================
// 5. PROFILE & DASHBOARD
// ==========================================
function loadProfile() {
    const profName = document.getElementById('profName');
    if (profName) {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (user) {
            document.getElementById('profName').innerText = user.name;
            document.getElementById('profEmail').innerText = user.email;
            document.getElementById('profPhone').innerText = user.phone;
            if(document.getElementById('profStudent')) {
                document.getElementById('profStudent').innerText = user.student === 'yes' ? "Verified Student 🎓" : "General User";
            }
        } else {
            window.location.href = 'login.html';
        }
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    alert("Logged out!");
    window.location.href = 'login.html';
}

// ==========================================
// 6. RIDE DETAILS & MANAGEMENT
// ==========================================
function loadRideDetails() {
    const checkPage = document.getElementById('detFrom');
    if (checkPage) {
        const urlParams = new URLSearchParams(window.location.search);
        const rideId = urlParams.get('id');
        const allRides = JSON.parse(localStorage.getItem('allRides')) || [];
        const ride = allRides[rideId];

        if (ride) {
            document.getElementById('detFrom').innerText = ride.from;
            document.getElementById('detTo').innerText = ride.to;
            document.getElementById('detPrice').innerText = `₹${ride.price}`;
            document.getElementById('detDriver').innerText = ride.driverName;
            document.getElementById('detPhone').innerText = ride.phone;
            const callBtn = document.getElementById('callBtn');
            if(callBtn) callBtn.href = `tel:${ride.phone}`;
        }
    }
}

function cancelRide(rideId) {
    if(confirm("Cancel this ride?")) {
        let allRides = JSON.parse(localStorage.getItem('allRides')) || [];
        allRides.splice(rideId, 1);
        localStorage.setItem('allRides', JSON.stringify(allRides));
        alert("Ride Cancelled! ✅");
        location.reload();
    }
}

// ==========================================
// 7. INITIALIZE (On Page Load)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    displayRides();
    loadProfile();
    loadRideDetails();
    if(typeof loadMyDashboard === 'function') loadMyDashboard();
});

// Database Reset (Optional for Testing)
function resetDatabase() {
    if(confirm("Purana data saaf karein?")) {
        localStorage.clear();
        location.reload();
    }
}