// src/App.jsx
import { useState ,useEffect, useRef} from 'react';
import './App.css';
// Import the main logo
import logo from './image_11.png';

// --- ASSET IMPORTS FROM SRC ---
// IMPORTANT: You must import every file you want to use from the src folder.
// Adjust the paths './assets/portfolio/...' to match exactly where your files are relative to App.jsx.

// Project 1 Assets
import thumb1 from './assets/image1.png';

import thumb2 from './assets/image2.png';

import thumb3 from './assets/image3.png';

import thumb4 from './assets/image4.png';
// Project 2 Assets
// import thumb2 from './assets/portfolio/project2-thumb.jpg';
// import video2 from './assets/portfolio/project2-video.mp4';
// ... repeat for all 6 projects

// NOTE FOR USER: Since I don't have your actual files, I am re-using
// the first imported image/video for all demo items below so the code doesn't break.
// You need to uncomment the lines above and use the correct variables below.

const facilitiesData = [
  {
    id: 1,
    title: "Video Shoots",
    description: "State-of-the-art RED and ARRI camera systems paired with Master Prime lenses deliver unparalleled image quality. We specialize in producing high-quality YouTube videos, reels, corporate films, and wedding shoots, ensuring cinematic visuals across every format.."
  },
  {
    id: 2,
    title: "Video Edites",
    description: "High-performance render farms and advanced compositing workstations enable seamless video editing, visual effects, motion graphics, and 3D animation across YouTube videos, reels, corporate films, and wedding projects."
  },
  {
    id: 3,
    title: "Graphic Design",
    description: "Complete graphic design solutions: thumbnails, logos, banners, posters, brochures, flyers, magazines, visiting cards, and all marketing creatives for digital and print"
  },
  {
    id: 4,
    title: "Social media handles",
    description: "Strategic social media management and content optimization, including post planning, reels creation, platform-specific creatives, audience engagement, and performance-focused growth across major social platforms."
  }
];

// --- DATA STRUCTURE ---
const projectData = [
  {
    id: 1,
    title: "Project Alpha Vision",
    category: "Cinematography",
    // Use the imported variable name here, NOT a string path.
    thumb: thumb1,
    video: "https://www.youtube.com/embed/U3ox-beAh2k"
  },
  {
    id: 2,
    title: "Echelon Systems",
    category: "VFX / Motion",
    // Replace thumb1/video1 with thumb2/video2, etc.
    thumb: thumb2, // <--- Change this to thumb2
    video: "https://www.youtube.com/embed/I_76nDunaLQ"  // <--- Change this to video2
  },
  {
    id: 3,
    title: "Apex Global Initiative",
    category: "Commercial",
    thumb: thumb3, // <--- Change to thumb3
    video: "https://www.youtube.com/embed/EJBRA7JpEhc"  // <--- Change to video3
  },
  {
    id: 4,
    title: "Nebula Prime",
    category: "3D Animation",
    thumb: thumb4, // <--- etc.
    video: "https://www.youtube.com/embed/tQ8wtMTSwzQ"
  }
];


// --- IMPROVED YOUTUBE COMPONENT ---
const VideoPortfolioItem = ({ project }) => {
  const [isHovered, setIsHovered] = useState(false);

  // We use the URL object to safely add our required parameters
  // regardless of what parameters the original URL already had.
  let youtubeSrc = '';
  if (project.video && project.video.includes('youtube.com')) {
      try {
        const urlObj = new URL(project.video);
        const videoId = urlObj.pathname.split('/').pop(); // Extract ID

        // Set required params for muted autoplay loop
        urlObj.searchParams.set('autoplay', '1');
        urlObj.searchParams.set('mute', '1');
        urlObj.searchParams.set('controls', '0');
        urlObj.searchParams.set('loop', '1');
        // Playlist is required for looping to work
        urlObj.searchParams.set('playlist', videoId);
        // Hide info and branding
        urlObj.searchParams.set('showinfo', '0');
        urlObj.searchParams.set('modestbranding', '1');
        // Ensure playsinline is set for mobile compatibility
        urlObj.searchParams.set('playsinline', '1');

        youtubeSrc = urlObj.toString();
      } catch (e) {
          console.error("Error parsing YouTube URL:", e);
          // Fallback to original if parsing fails
          youtubeSrc = project.video;
      }
  }


  return (
    <div
      className="portfolio-item video-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="media-container">
        {isHovered && youtubeSrc ? (
          <iframe
            src={youtubeSrc}
            className="portfolio-media"
            title={project.title}
            frameBorder="0"
            //Crucial permissions for autoplay
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{pointerEvents: 'none'}} // Prevents interaction so hover works smoothly
          />
        ) : (
          // Static image shown by default
          <img
            src={project.thumb}
            alt={project.title}
            className="portfolio-media"
          />
        )}
      </div>
      <div className="portfolio-overlay">
        <h4>{project.title}</h4>
        <span>{project.category}</span>
      </div>
    </div>
  );
};

const Navbar = () => (
  <nav className="navbar">
    {/* Wrap the insides in the new nav-container */}
    <div className="nav-container">
      <div className="nav-logo">
        <img src={logo} alt="HAWC Logo" />
      </div>
      <ul className="nav-links">
        <li><a href="#facilities" className="nav-link">Facilities</a></li>
        <li><a href="#works" className="nav-link">Works</a></li>
        <li><a href="#feedback" className="nav-link">Feedback</a></li>
        <li><a href="#contact" className="nav-link">Contact</a></li>
      </ul>
    </div>
  </nav>
);

const Hero = () => (
  <section className="hero">
    <img src={logo} alt="HAWC Logo" className="hero-logo" />
    <h1 className="section-title" style={{marginBottom: '20px'}}>HAWC</h1>
    <p className="hero-tagline">Elevating Vision with Precision.</p>
  </section>
);

const CountUp = ({ end, duration = 2000, suffix = '', prefix = '' }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // 1. Setup IntersectionObserver to detect visibility on scroll
  useEffect(() => {
      const observer = new IntersectionObserver(
          ([entry]) => {
              // If the element is visible on screen
              if (entry.isIntersecting) {
                  setIsVisible(true);
                  observer.disconnect(); // Stop observing once triggered (runs only once)
              }
          },
          { threshold: 0.3 } // Trigger when 30% of the element is visible
      );

      if (countRef.current) {
          observer.observe(countRef.current);
      }

      // Cleanup observer on unmount
      return () => observer.disconnect();
  }, []);

  // 2. Run the counting animation when visible
  useEffect(() => {
      if (!isVisible) return;

      let start = 0;
      // Determine if the target number is a float (like 2.5) or integer (like 150)
      const endNum = parseFloat(end);
      const isFloat = (endNum % 1 !== 0);

      let startTime;
      const animate = (currentTime) => {
          if (!startTime) startTime = currentTime;
          // Calculate progress from 0 to 1
          const progress = Math.min((currentTime - startTime) / duration, 1);

          // Easing function for a smooth "slow down at end" effect
          const easeOutQuad = 1 - Math.pow(1 - progress, 2);
          let currentVal = start + (endNum - start) * easeOutQuad;

          // Update state based on float or integer type
          if (isFloat) {
               setCount(currentVal.toFixed(1));
          } else {
               setCount(Math.floor(currentVal));
          }

          // Continue animation if not complete
          if (progress < 1) {
              requestAnimationFrame(animate);
          } else {
              // Ensure it lands exactly on the final number
              setCount(isFloat ? endNum.toFixed(1) : endNum);
          }
      };

      // Start animation loop
      requestAnimationFrame(animate);

  }, [isVisible, end, duration]);

  // Render the number within a span attached to the ref
  return (
      <span ref={countRef}>
          {prefix}{count}{suffix}
      </span>
  );
};


const Stats = () => (
  <section className="section-padding container">
    <div className="stats-grid">
      <div className="stat-item">
        {/* Replace static "150+" with CountUp */}
        <h3><CountUp end={150} suffix="+" /></h3>
        <p>Projects Delivered</p>
      </div>
      <div className="stat-item">
        {/* Replace static "98%" with CountUp */}
        <h3><CountUp end={98} suffix="%" /></h3>
        <p>Client Satisfaction</p>
      </div>
      <div className="stat-item">
        {/* Replace static "2.5+" with CountUp (handles decimals) */}
        <h3><CountUp end={2.5} suffix="+" /></h3>
        <p>Years of Excellence</p>
      </div>
      <div className="stat-item">
        {/* Replace static "24/7" with CountUp (using suffix for /7) */}
        <h3><CountUp end={24} suffix="/7" /></h3>
        <p>Premium Support</p>
      </div>
    </div>
  </section>
);

const Facilities = () => (
  <section id="facilities" className="section-padding container">
    <h2 className="section-title">Premium Facilities</h2>
    <div className="facilities-grid">
      {facilitiesData.map(item => (
        <div key={item.id} className="facility-card">
          {/* A styled metallic box to act as an abstract icon */}
          {/* <div className="facility-icon-box"></div> */}
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </div>
      ))}
    </div>
  </section>
);

const Portfolio = () => (
  <section id="works" className="section-padding container">
    <h2 className="section-title">Selected Works</h2>
    <div className="portfolio-grid">
      {projectData.map(project => (
        <VideoPortfolioItem key={project.id} project={project} />
      ))}
    </div>
  </section>
);

const Testimonials = () => (
  <section id="feedback" className="section-padding container">
    <h2 className="section-title">Trusted Partners</h2>
    <div className="testimonial-grid">
      <div className="testimonial-card">
        <p className="testimonial-text">"HAWC operates in a league of their own. Their precision and dedication to the final product is unmatched in the industry. A truly premium experience."</p>
        <div className="testimonial-author">
            <div>- Sarah Jenkins</div>
            <div style={{fontSize: '0.9rem', opacity: 0.8}}>CEO, Apex Dynamics</div>
        </div>
      </div>
      <div className="testimonial-card">
        <p className="testimonial-text">"We needed a partner who understood luxury and high-stakes delivery. HAWC exceeded our expectations at every turn. Phenomenal work."</p>
        <div className="testimonial-author">
            <div>- Marcus Thorne</div>
            <div style={{fontSize: '0.9rem', opacity: 0.8}}>Director, Thorne Global</div>
        </div>
      </div>
      <div className="testimonial-card">
        <p className="testimonial-text">"Reliable, professional, and incredibly skilled. The team brought our complex vision to life with absolute clarity."</p>
        <div className="testimonial-author">
            <div>- Dr. Aris Thorne</div>
            <div style={{fontSize: '0.9rem', opacity: 0.8}}>Founder, Innovatech</div>
        </div>
      </div>
    </div>
  </section>
);

const Contact = () => (
  <section id="contact" className="section-padding container" style={{marginBottom: '50px'}}>
    <h2 className="section-title">Initiate Collaboration</h2>
    <div className="contact-container">
        <div className="contact-info-box">
            <h4>Email Us</h4>
            <p>
                <a href="mailto:azamnba1@gmail.com" className="contact-link">
                    azamnba1@gmail.com
                </a>
            </p>
        </div>
        <div className="contact-info-box">
            <h4>Instagram</h4>
            <p>
                <a href="https://www.instagram.com/hawc_agency/" className="contact-link">
                    @hawc_agency
                </a>
            </p>
        </div>
        <div className="contact-info-box">
            <h4>Call Us</h4>
            <p>
              <a href="tel: +91 9142342091" className="contact-link">
                +91 9142342091
              </a>  
            </p>
        </div>
         <div className="contact-info-box">
            <h4>Location</h4>
            <p>New Delhi</p>
        </div>
    </div>
  </section>
);

function App() {
  return (
    <div className="App">
      <Navbar />
      <Hero />
      <Stats />
      <Facilities />
      <Portfolio />
      <Testimonials />
      <Contact />
    </div>
  );
}

export default App;