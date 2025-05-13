// Import Three.js using the import map defined in HTML
import * as THREE from 'three';

// --- Basic Scene Setup ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg-canvas'),
    alpha: true, // Make canvas transparent
    antialias: true // Smoother edges
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(60); // Move camera back a bit more

// --- Lighting (Subtle Ambient + Directional) ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.85); // Soft white light, slightly brighter
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4); // Slightly less intense directional
directionalLight.position.set(10, 15, 10); // Position light source
scene.add(directionalLight);

// Theme-dependent variables
let paperColor = 0xEAEAEA; // Default light theme color (very light grey)
const darkThemePaperColor = 0x2A2A2A; // Dark theme color (dark grey)

// --- Paper Geometry ---
const paperGeometry = new THREE.PlaneGeometry(6, 8.5); // Adjusted size slightly

// --- Paper Material with initial color ---
const paperMaterial = new THREE.MeshStandardMaterial({
    color: paperColor,
    side: THREE.DoubleSide, // Visible from both sides
    metalness: 0.05, // Very low metalness
    roughness: 0.9 // Quite rough surface
});

// --- Create Multiple Papers ---
const papers = [];
const paperCount = 60; // Adjust for performance vs density

// Define boundaries based roughly on camera view
const bounds = {
    x: 80, // Wider horizontal range
    y: 70, // Vertical range
    zMin: -50,
    zMax: 50
};

for (let i = 0; i < paperCount; i++) {
    const paper = new THREE.Mesh(paperGeometry, paperMaterial.clone()); // Clone material for individual control

    // Random initial position within the bounds
    paper.position.set(
        (Math.random() - 0.5) * bounds.x * 2,
        (Math.random() - 0.5) * bounds.y * 2,
        THREE.MathUtils.randFloat(bounds.zMin, bounds.zMax) // Random depth
    );

    // Random initial rotation
    paper.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
    );

    // Store random velocity and rotation speed for animation
    const speedFactor = 0.35; // Control overall speed
    paper.userData.velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.1 * speedFactor,  // Less horizontal drift
        (Math.random() * 0.3 + 0.1) * speedFactor, // Tend to float upwards (positive Y)
        (Math.random() - 0.5) * 0.05 * speedFactor // Slight depth movement
    );
    paper.userData.rotationSpeed = new THREE.Vector3(
        (Math.random() - 0.5) * 0.01 * speedFactor,
        (Math.random() - 0.5) * 0.01 * speedFactor,
        (Math.random() - 0.5) * 0.01 * speedFactor
    );

    papers.push(paper);
    scene.add(paper);
}

// --- Theme Change Observer ---
// Watch for theme changes on the body element
const themeObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
            const isDarkTheme = document.body.classList.contains('dark-theme');
            updatePaperColors(isDarkTheme);
        }
    });
});

// Start observing the body element for class changes
themeObserver.observe(document.body, { attributes: true });

// Check initial theme on load
const initialIsDarkTheme = document.body.classList.contains('dark-theme');
updatePaperColors(initialIsDarkTheme);

// Function to update paper colors based on theme
function updatePaperColors(isDarkTheme) {
    const newColor = isDarkTheme ? darkThemePaperColor : paperColor;
    papers.forEach(paper => {
        paper.material.color.set(newColor);
    });
}

// --- Animation Loop ---
function animate() {
    requestAnimationFrame(animate);

    // Animate each paper
    papers.forEach(paper => {
        // Update position based on velocity
        paper.position.add(paper.userData.velocity);

        // Update rotation based on rotation speed
        paper.rotation.x += paper.userData.rotationSpeed.x;
        paper.rotation.y += paper.userData.rotationSpeed.y;
        paper.rotation.z += paper.userData.rotationSpeed.z;

        // Boundaries Check - Wrap around
        // If paper goes above top boundary, reset it below bottom boundary
        if (paper.position.y > bounds.y) {
            paper.position.y = -bounds.y;
            paper.position.x = (Math.random() - 0.5) * bounds.x * 2; // Randomize horizontal reset
            paper.position.z = THREE.MathUtils.randFloat(bounds.zMin, bounds.zMax); // Randomize depth reset
        }
        // Optional: Wrap horizontally too if they drift too much
         if (paper.position.x > bounds.x) {
            paper.position.x = -bounds.x;
         } else if (paper.position.x < -bounds.x) {
             paper.position.x = bounds.x;
         }
         // Optional: Wrap depth
         if (paper.position.z > bounds.zMax) {
             paper.position.z = bounds.zMin;
         } else if (paper.position.z < bounds.zMin) {
             paper.position.z = bounds.zMax;
         }

    });

    // Render the scene
    renderer.render(scene, camera);
}

// --- Handle Window Resize ---
function onWindowResize() {
    // Update camera aspect ratio
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // Update renderer size
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio); // Update pixel ratio too
}
window.addEventListener('resize', onWindowResize);

// Start animation
animate();

// Potential Optimization: Reduce paper count on very small screens
// Add this outside the animate loop, maybe after paper creation.
// Needs adjustment to how papers are created/removed if implemented dynamically.
/*
if (window.innerWidth < 768 && paperCount > 30) {
    console.log("Reducing paper count for smaller screen.");
    // Logic to potentially remove some papers from the scene and 'papers' array
    // Or, better, set paperCount based on screen width *before* the creation loop.
    // Example: const paperCount = window.innerWidth < 768 ? 30 : 60;
}
*/
