// Modern Portfolio JavaScript - No jQuery Dependencies

// DOM Elements
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');
const themeToggle = document.querySelector('.theme-toggle-floating');
const themeIcon = document.getElementById('theme-icon');

// Mobile Menu Toggle
function initMobileMenu() {
  if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      
      // Animate hamburger
      const hamburger = mobileMenuToggle.querySelector('.hamburger');
      if (hamburger) {
        hamburger.style.transform = navMenu.classList.contains('active') 
          ? 'rotate(45deg)' 
          : 'rotate(0deg)';
      }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (event) => {
      const isClickInsideNav = navMenu.contains(event.target);
      const isClickOnToggle = mobileMenuToggle.contains(event.target);
      
      if (!isClickInsideNav && !isClickOnToggle && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        const hamburger = mobileMenuToggle.querySelector('.hamburger');
        if (hamburger) {
          hamburger.style.transform = 'rotate(0deg)';
        }
      }
    });

    // Close mobile menu when clicking on nav links
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
          navMenu.classList.remove('active');
          const hamburger = mobileMenuToggle.querySelector('.hamburger');
          if (hamburger) {
            hamburger.style.transform = 'rotate(0deg)';
          }
        }
      });
    });
  }
}

// Smooth Scrolling for Anchor Links
function initSmoothScrolling() {
  // Handle nav links
  navLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      
      if (href && href.startsWith('#')) {
        event.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
          const headerOffset = 80; // Account for fixed header
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // Handle hero buttons
  const heroButtons = document.querySelectorAll('.hero-buttons .btn');
  heroButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      const href = button.getAttribute('href');
      
      if (href && href.startsWith('#')) {
        event.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
          const headerOffset = 80; // Account for fixed header
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });
}

// Active Navigation Link Highlighting
function initActiveNavigation() {
  function updateActiveNav() {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.getBoundingClientRect().top;
      const sectionHeight = section.clientHeight;
      
      if (sectionTop <= 150 && sectionTop + sectionHeight > 150) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }
  
  // Update on scroll
  window.addEventListener('scroll', throttle(updateActiveNav, 100));
  
  // Update on load
  updateActiveNav();
}

// Navbar Background on Scroll
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  
  if (navbar) {
    function updateNavbar() {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
    
    window.addEventListener('scroll', throttle(updateNavbar, 100));
    
    // Initial call to set correct state
    updateNavbar();
  }
}

// Contact section animations (no longer needed for form)
function initContactAnimations() {
  // Add any specific contact section animations here if needed
  // Currently just using the general scroll animations
}

// Email validation
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Show notification
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    border-radius: 0.5rem;
    color: white;
    font-weight: 500;
    z-index: 9999;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    max-width: 350px;
  `;
  
  if (type === 'success') {
    notification.style.background = '#10b981';
  } else if (type === 'error') {
    notification.style.background = '#ef4444';
  } else {
    notification.style.background = '#3b82f6';
  }
  
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 10);
  
  // Remove after 5 seconds
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 5000);
}

// Enhanced Intersection Observer for animations
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.skill-category, .contact-item, .about-text, .hero-text');
  const projectCards = document.querySelectorAll('.project-card');
  const timelineItems = document.querySelectorAll('.timeline-item');
  
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  // Minimalist animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'fadeInUp 0.5s ease-out forwards';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Project cards with clean bidirectional animation
  const projectObserver = new IntersectionObserver((entries) => {
    // Sort entries by their position to maintain consistent animation order
    const sortedEntries = entries.sort((a, b) => {
      const aRect = a.target.getBoundingClientRect();
      const bRect = b.target.getBoundingClientRect();
      return aRect.top - bRect.top;
    });
    
    sortedEntries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Clean show animation with shorter, consistent delays
        setTimeout(() => {
          entry.target.classList.remove('hidden');
          entry.target.classList.add('visible');
        }, index * 150); // Consistent 150ms delay
      } else {
        // Immediate hide when scrolling away (no staggering for cleaner effect)
        entry.target.classList.remove('visible');
        entry.target.classList.add('hidden');
      }
    });
  }, {
    threshold: 0.15, // Slightly higher threshold for more precise triggering
    rootMargin: '0px 0px -50px 0px' // Reduced margin for cleaner timing
  });
  
  animatedElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    observer.observe(element);
  });
  
  // Timeline items with clean bidirectional animation
  const timelineObserver = new IntersectionObserver((entries) => {
    // Sort entries by their position to maintain consistent animation order
    const sortedEntries = entries.sort((a, b) => {
      const aRect = a.target.getBoundingClientRect();
      const bRect = b.target.getBoundingClientRect();
      return aRect.top - bRect.top;
    });
    
    sortedEntries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Clean show animation with shorter, consistent delays
        setTimeout(() => {
          entry.target.classList.remove('timeline-hidden');
          entry.target.classList.add('timeline-visible');
        }, index * 120); // Slightly faster delay for timeline
      } else {
        // Immediate hide when scrolling away
        entry.target.classList.remove('timeline-visible');
        entry.target.classList.add('timeline-hidden');
      }
    });
  }, {
    threshold: 0.2, // Higher threshold for timeline items
    rootMargin: '0px 0px -80px 0px'
  });
  
  // Initialize project cards with hidden state
  projectCards.forEach(card => {
    card.classList.add('hidden');
    projectObserver.observe(card);
  });
  
  // Initialize timeline items with hidden state
  timelineItems.forEach(item => {
    item.classList.add('timeline-hidden');
    timelineObserver.observe(item);
  });
}

// Optimized typing animation for better LCP
function initTypingAnimation() {
  const heroSubtitle = document.querySelector('.hero-subtitle');
  
  if (heroSubtitle) {
    const text = heroSubtitle.textContent;
    
    // Show text immediately for LCP, then start animation
    heroSubtitle.style.opacity = '1';
    
    // Mobile-responsive cursor
    const isMobile = window.innerWidth <= 768;
    const cursorWidth = isMobile ? '1px' : '2px';
    
    // Delay animation to improve LCP
    setTimeout(() => {
      heroSubtitle.textContent = '';
      heroSubtitle.style.borderRight = `${cursorWidth} solid white`;
      
      let index = 0;
      let isDeleting = false;
      let typingSpeed = isMobile ? 50 : 60; // Faster for better UX
      
      function typeAnimation() {
        if (!isDeleting && index < text.length) {
          // Typing
          heroSubtitle.textContent += text.charAt(index);
          index++;
          typingSpeed = 60;
          setTimeout(typeAnimation, typingSpeed);
        } else if (isDeleting && index > 0) {
          // Deleting
          heroSubtitle.textContent = text.substring(0, index - 1);
          index--;
          typingSpeed = 30;
          setTimeout(typeAnimation, typingSpeed);
        } else if (!isDeleting && index === text.length) {
          // Pause before deleting
          setTimeout(() => {
            isDeleting = true;
            typeAnimation();
          }, 1500);
        } else if (isDeleting && index === 0) {
          // Start typing again
          isDeleting = false;
          setTimeout(() => {
            typeAnimation();
          }, 300);
        }
      }
      
      typeAnimation();
    }, 100); // Very short delay to let LCP register
  }
}

// Utility function for throttling
function throttle(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Utility function for debouncing
function debounce(func, wait, immediate) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
}

// Theme Toggle Functionality
function initThemeToggle() {
  // Check for saved theme preference or default to light mode
  const savedTheme = localStorage.getItem('theme') || 'light';
  
  // Apply the saved theme
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
  
  // No need to manually update navbar - CSS handles it
  
  // Add event listener to theme toggle button
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      
      // Update theme with smooth transition
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcon(newTheme);
      
      // CSS handles navbar background automatically
      
      // Add a subtle animation effect
      themeToggle.style.transform = 'scale(0.9)';
      setTimeout(() => {
        themeToggle.style.transform = 'scale(1)';
      }, 150);
    });
  }
}

// Update theme icon based on current theme
function updateThemeIcon(theme) {
  if (themeIcon) {
    if (theme === 'dark') {
      themeIcon.className = 'fas fa-moon';
    } else {
      themeIcon.className = 'fas fa-sun';
    }
  }
}

// Navbar styling is now fully handled by CSS classes and data-theme attribute

// Project Filtering Functionality
function initProjectFiltering() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  
  if (filterButtons.length === 0 || projectCards.length === 0) return;
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.getAttribute('data-filter');
      
      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Filter projects with animation
      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        if (filter === 'all' || category.includes(filter)) {
          card.classList.remove('hidden');
          card.classList.add('visible');
          card.style.display = 'block';
        } else {
          card.classList.add('hidden');
          card.classList.remove('visible');
          
          // Hide after animation completes
          setTimeout(() => {
            if (card.classList.contains('hidden')) {
              card.style.display = 'none';
            }
          }, 300);
        }
      });
      
      // Add subtle button animation
      button.style.transform = 'scale(0.95)';
      setTimeout(() => {
        button.style.transform = 'scale(1)';
      }, 150);
    });
  });
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Remove loading class immediately for better LCP
  document.body.classList.remove('loading');
  document.body.classList.add('loaded');
  
  initThemeToggle();
  initMobileMenu();
  initSmoothScrolling();
  initActiveNavigation();
  initNavbarScroll();
  initContactAnimations();
  initProjectFiltering();
  initScrollAnimations();
  initTypingAnimation();
  initEmailButton();
});

// Email button functionality
function initEmailButton() {
  const emailButton = document.querySelector('a[href^="mailto:"]');
  
  if (emailButton) {
    emailButton.addEventListener('click', function(e) {
      const email = this.getAttribute('href');
      
      // For browsers that might not support mailto properly
      if (!email || !email.startsWith('mailto:')) {
        e.preventDefault();
        alert('Please send an email to: frandicollage21@gmail.com');
        return;
      }
      
      // Try to open default email client
      try {
        window.location.href = email;
      } catch (error) {
        // Fallback: copy email to clipboard if possible
        e.preventDefault();
        const emailAddress = email.replace('mailto:', '');
        
        if (navigator.clipboard) {
          navigator.clipboard.writeText(emailAddress).then(() => {
            alert(`Email address copied to clipboard: ${emailAddress}`);
          }).catch(() => {
            alert(`Please send an email to: ${emailAddress}`);
          });
        } else {
          alert(`Please send an email to: ${emailAddress}`);
        }
      }
    });
  }
}

// Handle window resize
window.addEventListener('resize', debounce(() => {
  // Close mobile menu on resize to larger screen
  if (window.innerWidth > 768 && navMenu && navMenu.classList.contains('active')) {
    navMenu.classList.remove('active');
    const hamburger = mobileMenuToggle?.querySelector('.hamburger');
    if (hamburger) {
      hamburger.style.transform = 'rotate(0deg)';
    }
  }
  
  // Update typing animation cursor for new screen size
  const heroSubtitle = document.querySelector('.hero-subtitle');
  if (heroSubtitle && heroSubtitle.style.borderRight) {
    const isMobile = window.innerWidth <= 768;
    const cursorWidth = isMobile ? '1px' : '2px';
    heroSubtitle.style.borderRight = `${cursorWidth} solid white`;
  }
}, 250));

// Add loading class to body for smooth transitions
document.body.classList.add('loaded');

// Fix back/forward cache - ensure no WebSocket or blocking operations
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    // Page was restored from cache
    document.body.classList.remove('loading');
    document.body.classList.add('loaded');
    // Re-initialize lightweight functions only
    initThemeToggle();
  }
});

// Remove any potential WebSocket connections or unload handlers
// Ensure page is BFCache compatible
window.addEventListener('pagehide', (event) => {
  // Don't prevent BFCache
});

// Performance optimization: Preload critical images (now handled in HTML)
function preloadImages() {
  // Critical images are now preloaded in HTML head for better performance
  // This function can be removed or used for non-critical images
}

// Page Loading functionality
function initPageLoader() {
  const loader = document.querySelector('.page-loader');
  const body = document.body;
  
  // Hide loader after everything is loaded
  function hideLoader() {
    if (loader) {
      loader.classList.add('hidden');
      body.classList.remove('loading');
      
      // Remove loader from DOM after animation
      setTimeout(() => {
        if (loader.parentNode) {
          loader.parentNode.removeChild(loader);
        }
      }, 500);
    }
  }
  
  // Hide loader when page is fully loaded
  if (document.readyState === 'complete') {
    setTimeout(hideLoader, 300); // Small delay for better UX
  } else {
    window.addEventListener('load', () => {
      setTimeout(hideLoader, 300);
    });
  }
}

// Enhanced lazy loading for images
function initLazyLoading() {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const originalSrc = img.getAttribute('src');
          
          // Add loading placeholder
          img.classList.add('image-placeholder');
          
          // Create new image to preload
          const imageLoader = new Image();
          imageLoader.onload = () => {
            img.src = imageLoader.src;
            img.classList.remove('image-placeholder');
            img.classList.add('loaded');
            img.style.opacity = '1';
          };
          
          imageLoader.onerror = () => {
            console.warn(`Failed to load image: ${originalSrc}`);
            img.classList.remove('image-placeholder');
            // Fallback to placeholder
            img.src = 'image/placeholder.jpg';
            img.classList.add('loaded');
            img.style.opacity = '1';
          };
          
          // Start loading
          imageLoader.src = originalSrc;
          
          // Stop observing this image
          imageObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: '200px 0px', // Increased margin for earlier loading
      threshold: 0.01 // Lower threshold for more aggressive loading
    });
    
    lazyImages.forEach(img => {
      // Set initial opacity for smooth transition
      img.style.opacity = '0';
      img.style.transition = 'opacity 0.5s ease-in-out';
      imageObserver.observe(img);
    });
  } else {
    // Fallback for browsers without IntersectionObserver
    lazyImages.forEach(img => {
      img.classList.add('loaded');
      img.style.opacity = '1';
    });
  }
}

// Performance monitoring
function initPerformanceMonitoring() {
  // Log performance metrics (only in development)
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0];
        if (perfData) {
          console.log('Page Load Time:', Math.round(perfData.loadEventEnd - perfData.fetchStart), 'ms');
          console.log('DOM Ready Time:', Math.round(perfData.domContentLoadedEventEnd - perfData.fetchStart), 'ms');
        }
      }, 0);
    });
  }
}

// Resource preloading
function preloadCriticalResources() {
  // Preload critical CSS
  const criticalStyles = document.createElement('link');
  criticalStyles.rel = 'preload';
  criticalStyles.as = 'style';
  criticalStyles.href = 'css/index.css';
  document.head.appendChild(criticalStyles);
  
  // Preload critical fonts
  const criticalFont = document.createElement('link');
  criticalFont.rel = 'preload';
  criticalFont.as = 'font';
  criticalFont.type = 'font/woff2';
  criticalFont.crossOrigin = 'anonymous';
  criticalFont.href = 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2';
  document.head.appendChild(criticalFont);
}

// Initialize performance optimizations
window.addEventListener('DOMContentLoaded', () => {
  initPageLoader();
  initLazyLoading();
  initPerformanceMonitoring();
});

// Preload images after initial load
window.addEventListener('load', () => {
  preloadImages();
  preloadCriticalResources();
});