import { useState, useEffect, useRef } from 'react';

export default function CountUpAnimation({ 
  end, 
  duration = 2000, 
  delay = 0,
  className = "",
  suffix = "",
  prefix = ""
}) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const timer = setTimeout(() => {
      const startTime = Date.now();
      const startValue = 0;

      const updateCount = () => {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(startValue + (end - startValue) * easeOutQuart);

        setCount(currentValue);

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        }
      };

      updateCount();
    }, delay);

    return () => clearTimeout(timer);
  }, [isVisible, end, duration, delay]);

  // Format number with commas for thousands
  const formatNumber = (num) => {
    if (typeof num === 'string') {
      // If it's a string like "10,000+", extract the number part
      const match = num.match(/(\d+(?:,\d+)*)/);
      if (match) {
        const numberPart = match[1].replace(/,/g, '');
        return parseInt(numberPart).toLocaleString() + num.replace(match[1], '');
      }
      return num;
    }
    return num.toLocaleString();
  };

  return (
    <span ref={ref} className={className}>
      {prefix}{formatNumber(count)}{suffix}
    </span>
  );
} 