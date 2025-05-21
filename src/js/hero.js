    // Use global THREE object
    class HeroScene {
        constructor() {
            this.container = document.getElementById('hero-canvas');
            this.scene = new THREE.Scene();
            this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            
            // Add WebGL context attributes for better Safari compatibility
            this.renderer = new THREE.WebGLRenderer({ 
                antialias: true, 
                alpha: true,
                powerPreference: 'high-performance',
                failIfMajorPerformanceCaveat: false
            });
            
            this.particles = [];
            this.mouseX = 0;
            this.mouseY = 0;
            this.targetX = 0;
            this.targetY = 0;
            this.windowHalfX = window.innerWidth / 2;
            this.windowHalfY = window.innerHeight / 2;
    
            this.init();
            this.animate();
            this.addEventListeners();
        }
    
        init() {
            // Setup renderer with better Safari compatibility
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for better performance
            this.renderer.setClearColor(0x000000, 0); // Ensure transparent background
            this.container.appendChild(this.renderer.domElement);
    
            // Setup camera
            this.camera.position.z = 30;
    
            // Create particles with optimized settings
            const particleCount = 1500; // Reduced count for better performance
            const geometry = new THREE.BufferGeometry();
            const positions = new Float32Array(particleCount * 3);
            const colors = new Float32Array(particleCount * 3);
    
            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3;
                positions[i3] = (Math.random() - 0.5) * 50;
                positions[i3 + 1] = (Math.random() - 0.5) * 50;
                positions[i3 + 2] = (Math.random() - 0.5) * 50;
    
                // Use more vibrant colors
                colors[i3] = Math.random() * 0.5 + 0.5;     // R: 0.5-1.0
                colors[i3 + 1] = Math.random() * 0.5 + 0.5; // G: 0.5-1.0
                colors[i3 + 2] = Math.random() * 0.5 + 0.5; // B: 0.5-1.0
            }
    
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
            const material = new THREE.PointsMaterial({
                size: 0.15,
                vertexColors: true,
                transparent: true,
                opacity: 0.8,
                sizeAttenuation: true,
                depthWrite: false
            });
    
            this.particles = new THREE.Points(geometry, material);
            this.scene.add(this.particles);
        }
    
        animate() {
            requestAnimationFrame(this.animate.bind(this));
    
            this.targetX = this.mouseX * 0.0005; // Reduced sensitivity
            this.targetY = this.mouseY * 0.0005;
    
            // Smoother rotation
            this.particles.rotation.x += 0.0005;
            this.particles.rotation.y += 0.001;
    
            this.particles.rotation.x += (this.targetY - this.particles.rotation.x) * 0.05;
            this.particles.rotation.y += (this.targetX - this.particles.rotation.y) * 0.05;
    
            this.renderer.render(this.scene, this.camera);
        }
    
        addEventListeners() {
            // Use passive event listener for better performance
            document.addEventListener('mousemove', (event) => {
                this.mouseX = event.clientX - this.windowHalfX;
                this.mouseY = event.clientY - this.windowHalfY;
            }, { passive: true });
    
            // Debounced resize handler
            let resizeTimeout;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    this.windowHalfX = window.innerWidth / 2;
                    this.windowHalfY = window.innerHeight / 2;
    
                    this.camera.aspect = window.innerWidth / window.innerHeight;
                    this.camera.updateProjectionMatrix();
    
                    this.renderer.setSize(window.innerWidth, window.innerHeight);
                }, 250);
            }, { passive: true });
        }
    }
    
    // Simple WebGL detection
    function isWebGLAvailable() {
        try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && 
                (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        } catch (e) {
            return false;
        }
    }
    
    // Initialize the scene when the DOM is loaded
    document.addEventListener('DOMContentLoaded', () => {
        if (isWebGLAvailable()) {
            new HeroScene();
        } else {
            const warning = document.createElement('div');
            warning.className = 'webgl-warning';
            warning.innerHTML = 'Your browser does not support WebGL. Please try a different browser.';
            document.getElementById('hero-canvas').appendChild(warning);
        }
    }); 