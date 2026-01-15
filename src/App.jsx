// src/App.jsx
import { useState, useRef, useEffect } from 'react'; // Kept imports for other components
import './App.css';
const logo = "/image_11.png"; // ✅ THIS WORKS
// --- ASSET IMPORTS ---
import thumb1 from './assets/image1.png';
import thumb2 from './assets/image2.png';
import thumb3 from './assets/image3.png';
import thumb4 from './assets/image4.png';

const facilitiesData = [
  {
    id: 1,
    title: "Video Shoots",
    description: "State-of-the-art RED and ARRI camera systems paired with Master Prime lenses deliver unparalleled image quality. We specialize in producing high-quality YouTube videos, reels, corporate films, and wedding shoots, ensuring cinematic visuals across every format."
  },
  {
    id: 2,
    title: "Video Edits",
    description: "High-performance render farms and advanced compositing workstations enable seamless video editing, visual effects, motion graphics, and 3D animation across YouTube videos, reels, corporate films, and wedding projects."
  },
  {
    id: 3,
    title: "Graphic Design",
    description: "Complete graphic design solutions: thumbnails, logos, banners, posters, brochures, flyers, magazines, visiting cards, and all marketing creatives for digital and print."
  },
  {
    id: 4,
    title: "Social media handles",
    description: "Strategic social media management and content optimization, including post planning, reels creation, platform-specific creatives, audience engagement, and performance-focused growth across major social platforms."
  }
];

const projectData = [
  {
    id: 1,
    title: "Project Vrikshit",
    category: "Reels / Short Film",
    thumb: thumb1,
    video: "https://www.youtube.com/embed/U3ox-beAh2k"
  },
  {
    id: 2,
    title: "Brand shoot",
    category: "Commercial",
    thumb: thumb2,
    video: "https://www.youtube.com/embed/I_76nDunaLQ"
  },
  {
    id: 3,
    title: "Event Coverage",
    category: "Corporate",
    thumb: thumb3,
    video: "https://www.youtube.com/embed/EJBRA7JpEhc"
  },
  {
    id: 4,
    title: "PodCast",
    category: "",
    thumb: thumb4,
    video: "https://www.youtube.com/embed/tQ8wtMTSwzQ"
  }
];

const VideoPortfolioItem = ({ project }) => {
  const [isHovered, setIsHovered] = useState(false);
  let youtubeSrc = '';
  if (project.video && project.video.includes('youtube.com')) {
      try {
        const urlObj = new URL(project.video);
        const videoId = urlObj.pathname.split('/').pop();
        urlObj.searchParams.set('autoplay', '1');
        urlObj.searchParams.set('mute', '1');
        urlObj.searchParams.set('controls', '0');
        urlObj.searchParams.set('loop', '1');
        urlObj.searchParams.set('playlist', videoId);
        urlObj.searchParams.set('showinfo', '0');
        urlObj.searchParams.set('modestbranding', '1');
        urlObj.searchParams.set('playsinline', '1');
        youtubeSrc = urlObj.toString();
      } catch (e) {
          console.error("Error parsing YouTube URL:", e);
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
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{pointerEvents: 'none'}}
          />
        ) : (
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

// === NAVBAR COMPONENT (SIMPLIFIED) ===
const Navbar = () => {
  const navLinks = [
    { href: "#facilities", label: "Facilities" },
    { href: "#works", label: "Works" },
    { href: "#feedback", label: "Feedback" },
    { href: "#contact", label: "Contact" }
  ];

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <img src={logo} alt="HAWC Logo" />
        </div>

        {/* Single List for BOTH Desktop and Mobile.
            CSS will handle the positioning (Sidebar on Desktop, Top Row on Mobile).
        */}
        <ul className="nav-links">
          {navLinks.map(link => (
            <li key={link.label}>
              <a href={link.href} className="nav-link">{link.label}</a>
            </li>
          ))}
        </ul>

      </div>
    </nav>
  );
};

const Hero = () => (
  <section className="hero">
    <img src={logo} alt="HAWC Logo" className="hero-logo" />
    <h1 className="section-title" style={{marginBottom: '20px'}}>HAWC</h1>
    
    {/* Added inline style to remove bottom margin */}
    <p className="hero-tagline" style={{ marginBottom: '4px' }}>
        Elevating Vision with Precision.
    </p>
    
    {/* Changed marginTop to 0px to bring it closer */}
    <p style={{ 
        fontSize: '1.1rem',
        marginTop: '0px', 
        color: 'var(--metallic-silver)', 
        textTransform: 'lowercase', 
        letterSpacing: '2px',
        fontWeight: '600',
        fontFamily: 'cursive',
        opacity: 0.9
    }}>
        Shoots | Edits | Designs
    </p>
  </section>
);

const CountUp = ({ end, duration = 2000, suffix = '', prefix = '' }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
      const observer = new IntersectionObserver(
          ([entry]) => {
              if (entry.isIntersecting) {
                  setIsVisible(true);
                  observer.disconnect();
              }
          },
          { threshold: 0.3 }
      );
      if (countRef.current) {
          observer.observe(countRef.current);
      }
      return () => observer.disconnect();
  }, []);

  useEffect(() => {
      if (!isVisible) return;
      let start = 0;
      const endNum = parseFloat(end);
      const isFloat = (endNum % 1 !== 0);
      let startTime;
      const animate = (currentTime) => {
          if (!startTime) startTime = currentTime;
          const progress = Math.min((currentTime - startTime) / duration, 1);
          const easeOutQuad = 1 - Math.pow(1 - progress, 2);
          let currentVal = start + (endNum - start) * easeOutQuad;
          if (isFloat) {
               setCount(currentVal.toFixed(1));
          } else {
               setCount(Math.floor(currentVal));
          }
          if (progress < 1) {
              requestAnimationFrame(animate);
          } else {
              setCount(isFloat ? endNum.toFixed(1) : endNum);
          }
      };
      requestAnimationFrame(animate);
  }, [isVisible, end, duration]);

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
        <h3><CountUp end={150} suffix="+" /></h3>
        <p>Projects Delivered</p>
      </div>
      <div className="stat-item">
        <h3><CountUp end={98} suffix="%" /></h3>
        <p>Client Satisfaction</p>
      </div>
      <div className="stat-item">
        <h3><CountUp end={2.5} suffix="+" /></h3>
        <p>Years of Excellence</p>
      </div>
      <div className="stat-item">
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
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </div>
      ))}
    </div>
  </section>
);

const Portfolio = () => (
  <section id="works" className="section-padding container">
    <h2 className="section-title">Our Works</h2>
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
            <div></div>
            <div style={{fontSize: '0.9rem', opacity: 0.8}}>Vrikshit Foundation</div>
        </div>
      </div>
      <div className="testimonial-card">
        <p className="testimonial-text">"We needed a partner who understood luxury and high-stakes delivery. HAWC exceeded our expectations at every turn. Phenomenal work."</p>
        <div className="testimonial-author">
            <div></div>
            <div style={{fontSize: '0.9rem', opacity: 0.8}}>Priyanshu kumar</div>
        </div>
      </div>
      <div className="testimonial-card">
        <p className="testimonial-text">"Reliable, professional, and incredibly skilled. The team brought our complex vision to life with absolute clarity."</p>
        <div className="testimonial-author">
            <div></div>
            <div style={{fontSize: '0.9rem', opacity: 0.8}}>Gains Hub</div>
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
            <p><a href="mailto:azamnba1@gmail.com" className="contact-link">azamnba1@gmail.com</a></p>
        </div>
        <div className="contact-info-box">
            <h4>Instagram</h4>
            <p><a href="https://www.instagram.com/hawc_agency/" className="contact-link">@hawc_agency</a></p>
        </div>
        <div className="contact-info-box">
            <h4>Call Us</h4>
            <p><a href="tel: +91 9142342091" className="contact-link">+91 9142342091</a></p>
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
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <Hero />
        <Stats />
        <Facilities />
        <Portfolio />
        <Testimonials />
        <Contact />
      </main>
    </div>
  );
}

export default App;