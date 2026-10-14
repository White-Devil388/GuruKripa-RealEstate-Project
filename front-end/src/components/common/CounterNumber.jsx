import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

/**
 * Parses numeric string values like "3.5M+", "18+", "1,450+", "99.4%"
 */
const parseStatValue = (valStr) => {
  if (typeof valStr !== 'string') {
    return { numeric: Number(valStr) || 0, prefix: '', suffix: '', decimals: 0, hasCommas: false };
  }

  const match = valStr.match(/^([^\d.]*)([\d,.]+)(.*)$/);
  if (!match) return { numeric: 0, prefix: '', suffix: valStr, decimals: 0, hasCommas: false };

  const prefix = match[1] || '';
  const numStr = match[2];
  const suffix = match[3] || '';

  const hasCommas = numStr.includes(',');
  const cleanNumStr = numStr.replace(/,/g, '');
  const numeric = parseFloat(cleanNumStr) || 0;

  const decimals = cleanNumStr.includes('.') ? cleanNumStr.split('.')[1].length : 0;

  return { numeric, prefix, suffix, decimals, hasCommas };
};

const CounterNumber = ({ value, duration = 2200, className = "" }) => {
  const ref = useRef(null);
  // Trigger when 30% of the element enters the viewport upon scrolling
  const isInView = useInView(ref, { amount: 0.3, once: true });

  const [displayVal, setDisplayVal] = useState(() => {
    const { prefix, suffix, decimals } = parseStatValue(value);
    const zeroStr = (0).toFixed(decimals);
    return `${prefix}${zeroStr}${suffix}`;
  });

  useEffect(() => {
    if (!isInView) return;

    const { numeric, prefix, suffix, decimals, hasCommas } = parseStatValue(value);
    let startTime = null;
    let animationFrameId;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Smooth cubic ease out
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentNumeric = numeric * easeProgress;

      let formattedNum = currentNumeric.toFixed(decimals);
      if (hasCommas) {
        const parts = formattedNum.split('.');
        parts[0] = parseInt(parts[0], 10).toLocaleString('en-US');
        formattedNum = parts.join('.');
      }

      setDisplayVal(`${prefix}${formattedNum}${suffix}`);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setDisplayVal(value);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isInView, value, duration]);

  return <span ref={ref} className={className}>{displayVal}</span>;
};

export default CounterNumber;
