class SpaceAnimation {
    constructor() {
        this.container = document.querySelector('.space-canvas');
        this.planets = [];
        this.init();
    }

    init() {
        // Scene setup
        this.scene = new THREE.Scene();
        
        // Get the size of the .space-section
        const section = document.querySelector('.space-section');
        const rect = section.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const aspect = width / height;
        const viewSize = 60;
        
        // Create orthographic camera with proper aspect ratio
        this.camera = new THREE.OrthographicCamera(
            -viewSize * aspect / 2, // left
            viewSize * aspect / 2,  // right
            viewSize / 2,           // top
            -viewSize / 2,          // bottom
            0.1,                    // near
            1000                    // far
        );

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);

        // Camera position for perfect top-down view
        this.camera.position.set(0, 50, 0);
        this.camera.lookAt(0, 0, 0);

        // Add starfield
        this.createStarfield();
        
        // Create solar system
        this.createSun();
        this.createPlanets();
        
        // Add lights
        this.addLights();

        // Add window resize handler
        window.addEventListener('resize', this.onWindowResize.bind(this));

        // Start animation
        this.animate();
    }

    createStarfield() {
        // Create starfield geometry
        const starGeometry = new THREE.BufferGeometry();
        const starMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.2,
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: false
        });

        // Create stars in the XZ plane at y = -10
        const starCount = 1000;
        const starPositions = new Float32Array(starCount * 3);
        const viewSize = 60;
        const starFieldSize = viewSize * 2;

        for (let i = 0; i < starCount; i++) {
            const i3 = i * 3;
            starPositions[i3] = (Math.random() - 0.5) * starFieldSize; // x
            starPositions[i3 + 1] = -10; // y (behind the solar system)
            starPositions[i3 + 2] = (Math.random() - 0.5) * starFieldSize; // z
        }

        starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
        this.starfield = new THREE.Points(starGeometry, starMaterial);
        // No rotation needed
        this.scene.add(this.starfield);

        // Add some brighter stars
        const brightStarGeometry = new THREE.BufferGeometry();
        const brightStarMaterial = new THREE.PointsMaterial({
            color: 0xffffcc,
            size: 0.4,
            transparent: true,
            opacity: 0.9,
            sizeAttenuation: false
        });

        const brightStarCount = 100;
        const brightStarPositions = new Float32Array(brightStarCount * 3);

        for (let i = 0; i < brightStarCount; i++) {
            const i3 = i * 3;
            brightStarPositions[i3] = (Math.random() - 0.5) * starFieldSize;
            brightStarPositions[i3 + 1] = -10;
            brightStarPositions[i3 + 2] = (Math.random() - 0.5) * starFieldSize;
        }

        brightStarGeometry.setAttribute('position', new THREE.BufferAttribute(brightStarPositions, 3));
        this.brightStars = new THREE.Points(brightStarGeometry, brightStarMaterial);
        // No rotation needed
        this.scene.add(this.brightStars);
    }

    createSun() {
        // Create sun geometry
        const sunGeometry = new THREE.CircleGeometry(5, 32);
        const sunMaterial = new THREE.MeshPhongMaterial({
            color: 0xffff00,
            emissive: 0xffff00,
            emissiveIntensity: 0.5,
            shininess: 100
        });
        this.sun = new THREE.Mesh(sunGeometry, sunMaterial);
        this.sun.rotation.x = -Math.PI / 2; // Make it face up
        this.scene.add(this.sun);

        // Add sun glow
        const glowGeometry = new THREE.CircleGeometry(5.5, 32);
        const glowMaterial = new THREE.MeshPhongMaterial({
            color: 0xffff00,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.rotation.x = -Math.PI / 2;
        this.sun.add(glow);
    }

    createPlanets() {
        // Planet configurations
        const planetConfigs = [
            { name: 'Mercury', size: 0.8, distance: 8, speed: 0.01, color: 0x888888 },
            { name: 'Venus', size: 1.2, distance: 12, speed: 0.008, color: 0xe39e1c },
            { name: 'Earth', size: 1.5, distance: 16, speed: 0.006, color: 0x2233ff },
            { name: 'Mars', size: 1.2, distance: 20, speed: 0.004, color: 0xc1440e },
            { name: 'Jupiter', size: 3, distance: 25, speed: 0.002, color: 0xd8ca9d },
            { name: 'Saturn', size: 1.2, distance: 30, speed: 0.001, color: 0x9b59b6 }
        ];

        planetConfigs.forEach(config => {
            // Create planet
            const planetGeometry = new THREE.CircleGeometry(config.size, 32);
            const planetMaterial = new THREE.MeshPhongMaterial({
                color: config.color,
                shininess: 30
            });
            const planet = new THREE.Mesh(planetGeometry, planetMaterial);
            planet.rotation.x = -Math.PI / 2; // Make it face up
            planet.position.y = 0.1; // Slightly above the orbit line

            // Create orbit line at y = 0
            const orbitGeometry = new THREE.RingGeometry(config.distance - 0.1, config.distance + 0.1, 128);
            const orbitMaterial = new THREE.MeshBasicMaterial({
                color: 0x444444,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.3,
                depthTest: true
            });
            const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
            orbit.rotation.x = -Math.PI / 2; // Make it face up
            orbit.position.y = 0; // Orbit line at y = 0
            this.scene.add(orbit);

            // Add planet to scene
            this.scene.add(planet);
            this.planets.push({
                mesh: planet,
                distance: config.distance,
                speed: config.speed,
                angle: Math.random() * Math.PI * 2
            });

            // Add rings to Saturn
            if (config.name === 'Saturn') {
                const ringGeometry = new THREE.RingGeometry(config.size + 0.5, config.size + 2, 32);
                const ringMaterial = new THREE.MeshPhongMaterial({
                    color: 0xead6b8,
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.7
                });
                const ring = new THREE.Mesh(ringGeometry, ringMaterial);
                ring.rotation.x = -Math.PI / 2;
                planet.add(ring);
            }
        });
    }

    addLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        // Directional light from above
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(0, 50, 0);
        this.scene.add(directionalLight);
    }

    onWindowResize() {
        // Get the size of the .space-section
        const section = document.querySelector('.space-section');
        const rect = section.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const aspect = width / height;
        const viewSize = 60;
        
        this.camera.left = -viewSize * aspect / 2;
        this.camera.right = viewSize * aspect / 2;
        this.camera.top = viewSize / 2;
        this.camera.bottom = -viewSize / 2;
        
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        // Subtle starfield movement (optional: twinkle or fade, but no rotation)

        // Update planet positions
        this.planets.forEach(planet => {
            planet.angle += planet.speed;
            planet.mesh.position.x = Math.cos(planet.angle) * planet.distance;
            planet.mesh.position.z = Math.sin(planet.angle) * planet.distance;
            // Keep planet at y = 0.1
            planet.mesh.position.y = 0.1;
        });

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize the animation when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SpaceAnimation();
}); 