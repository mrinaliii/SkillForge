import { useEffect, useState } from 'react';

interface RetentionGaugeProps {
  percentage: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animate?: boolean;
}

const RetentionGauge = ({
  percentage,
  size = 'md',
  showLabel = true,
  animate = true
}: RetentionGaugeProps) => {
  const [displayPercentage, setDisplayPercentage] = useState(animate ? 0 : percentage);

  useEffect(() => {
    if (animate) {
      let start = 0;
      const duration = 1000;
      const increment = percentage / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= percentage) {
          setDisplayPercentage(percentage);
          clearInterval(timer);
        } else {
          setDisplayPercentage(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [percentage, animate]);

  const sizeMap = {
    sm: { diameter: 80, strokeWidth: 8, fontSize: 'text-lg' },
    md: { diameter: 120, strokeWidth: 10, fontSize: 'text-2xl' },
    lg: { diameter: 200, strokeWidth: 12, fontSize: 'text-5xl' }
  };

  const config = sizeMap[size];
  const radius = (config.diameter - config.strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayPercentage / 100) * circumference;

  const getColor = (pct: number): string => {
    if (pct >= 80) return 'var(--success)';
    if (pct >= 50) return 'var(--warning)';
    return 'var(--danger)';
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: config.diameter, height: config.diameter }}>
        <svg
          width={config.diameter}
          height={config.diameter}
          className="transform -rotate-90"
        >
          <circle
            cx={config.diameter / 2}
            cy={config.diameter / 2}
            r={radius}
            stroke="var(--card-border)"
            strokeWidth={config.strokeWidth}
            fill="none"
          />
          <circle
            cx={config.diameter / 2}
            cy={config.diameter / 2}
            r={radius}
            stroke={getColor(displayPercentage)}
            strokeWidth={config.strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 0.3s ease, stroke 0.3s ease'
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={`font-bold ${config.fontSize}`}
            style={{ color: getColor(displayPercentage) }}
          >
            {displayPercentage}%
          </span>
          {showLabel && size !== 'sm' && (
            <span className="text-xs opacity-60 mt-1">Retained</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default RetentionGauge;
