import React, { useEffect } from 'react';

const ParallaxBackground = () => {
  useEffect(() => {
    const handleMouseMove = (e) => {
      // Calculate normalized mouse position (0 to 1)
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      
      // Update CSS variables on body for global access by CSS
      document.body.style.setProperty('--mouse-x', x);
      document.body.style.setProperty('--mouse-y', y);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Generate random particles (Simple Circles)
  const particles = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 8 + 2, // Smaller size (2px to 10px)
    opacity: Math.random() * 0.3 + 0.1
  }));

  return (
    <>
      <div className="parallax-layer layer-back">
        {particles.slice(0, 15).map(p => (
          <div 
            key={p.id} 
            className="particle"
            style={{ 
              top: p.top, 
              left: p.left,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: p.opacity,
              background: 'var(--text-muted)'
            }}
          />
        ))}
      </div>
      <div className="parallax-layer layer-mid">
         {particles.slice(15, 25).map(p => (
            <div 
              key={p.id}
              className="particle"
              style={{
                top: p.top, 
                left: p.left,
                width: `${p.size * 1.5}px`,
                height: `${p.size * 1.5}px`,
                opacity: p.opacity * 0.5,
                background: 'var(--primary)'
              }}
            />
         ))}
      </div>
      <div className="parallax-layer layer-front">
         {particles.slice(25).map(p => (
            <div 
              key={p.id}
              className="particle"
              style={{
                top: p.top, 
                left: p.left,
                width: `${p.size * 0.8}px`,
                height: `${p.size * 0.8}px`,
                opacity: p.opacity,
                background: 'var(--secondary)'
              }}
            />
         ))}
      </div>
    </>
  );
};

export default ParallaxBackground;
