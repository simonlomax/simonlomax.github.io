// Timeline Animation Script

document.addEventListener('DOMContentLoaded', function() {
    // Initialize timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    const skillLevels = document.querySelectorAll('.skill-level');
    
    // Set width percentages for skill levels from inline styles
    skillLevels.forEach(level => {
        const width = level.style.width;
        if (width) {
            level.style.setProperty('--skill-percent', width);
        }
    });

    // Use Intersection Observer for scroll animations
    if ('IntersectionObserver' in window) {
        // Timeline items observer
        const timelineObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add animation class
                    entry.target.classList.add('animate');
                    
                    // Set a specific animation delay based on position
                    const index = Array.from(timelineItems).indexOf(entry.target) + 1;
                    entry.target.style.setProperty('--animation-order', index);
                    
                    // Unobserve after animation is triggered
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            threshold: 0.2,
            rootMargin: '0px 0px -100px 0px'
        });
        
        // Skills bars observer
        const skillsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Get original width from the inline style
                    const width = entry.target.style.width;
                    
                    // First set width to 0
                    entry.target.style.width = '0';
                    
                    // Force reflow
                    entry.target.offsetWidth;
                    
                    // Then animate to the target width
                    setTimeout(() => {
                        entry.target.style.width = width;
                    }, 100);
                    
                    // Unobserve after animation is triggered
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            threshold: 0.2,
            rootMargin: '0px 0px -100px 0px'
        });
        
        // Observe all timeline items
        timelineItems.forEach(item => {
            timelineObserver.observe(item);
        });
        
        // Observe all skill level bars
        skillLevels.forEach(skill => {
            skillsObserver.observe(skill);
        });
    } else {
        // Fallback for browsers that don't support Intersection Observer
        timelineItems.forEach((item, index) => {
            item.classList.add('animate');
            item.style.setProperty('--animation-order', index + 1);
        });
        
        skillLevels.forEach(skill => {
            // Keep the original width
            skill.style.width = skill.style.width;
        });
    }
    
    // Enhance timeline cards with additional hover effects
    const timelineCards = document.querySelectorAll('.timeline-card');
    
    timelineCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = 'var(--shadow-hover)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'var(--shadow)';
        });
    });
}); 