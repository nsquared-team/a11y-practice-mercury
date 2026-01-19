import { useState, useEffect } from 'react';
import {
  getMercuryCycleState,
  getCycleGradient,
  formatTemperature,
  MercuryCycleState,
} from '../../utils/mercuryCycle';
import { Sun, Moon, Sunrise, Sunset } from 'lucide-react';

interface MercuryCycleOverlayProps {
  showIndicator?: boolean;
}

function MercuryCycleOverlay({ showIndicator = true }: MercuryCycleOverlayProps) {
  const [cycleState, setCycleState] = useState<MercuryCycleState>(getMercuryCycleState);

  useEffect(() => {
    // Update cycle state every 10 seconds for smooth transitions
    const interval = setInterval(() => {
      setCycleState(getMercuryCycleState());
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const gradient = getCycleGradient(cycleState);

  const getPhaseIcon = () => {
    switch (cycleState.phase) {
      case 'day':
        return <Sun className="w-3 h-3" />;
      case 'night':
        return <Moon className="w-3 h-3" />;
      case 'dawn':
        return <Sunrise className="w-3 h-3" />;
      case 'dusk':
        return <Sunset className="w-3 h-3" />;
    }
  };

  const getPhaseLabel = () => {
    switch (cycleState.phase) {
      case 'day':
        return 'Day Cycle';
      case 'night':
        return 'Night Cycle';
      case 'dawn':
        return 'Dawn';
      case 'dusk':
        return 'Dusk';
    }
  };

  const getPhaseColor = () => {
    switch (cycleState.phase) {
      case 'day':
        return 'text-amber-400';
      case 'night':
        return 'text-blue-400';
      case 'dawn':
      case 'dusk':
        return 'text-orange-400';
    }
  };

  return (
    <>
      {/* Atmospheric overlay effect */}
      <div
        className="fixed inset-0 pointer-events-none z-30 transition-all duration-[5000ms]"
        style={{ background: gradient }}
        aria-hidden="true"
      />

      {/* Subtle vignette effect */}
      <div
        className="fixed inset-0 pointer-events-none z-30"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.3) 100%)',
        }}
        aria-hidden="true"
      />

      {/* Cycle indicator (optional) */}
      {showIndicator && (
        <div className="fixed bottom-14 right-4 z-40 flex items-center gap-2 px-3 py-1.5 bg-mercury-dark-secondary/80 backdrop-blur-sm border border-mercury-dark-tertiary rounded-full text-xs">
          <span className={getPhaseColor()}>{getPhaseIcon()}</span>
          <span className="text-gray-400">{getPhaseLabel()}</span>
          <span className="text-gray-600">|</span>
          <span className={`font-mono ${cycleState.temperature > 0 ? 'text-orange-400' : 'text-blue-400'}`}>
            {formatTemperature(cycleState.temperature)}
          </span>
        </div>
      )}
    </>
  );
}

export default MercuryCycleOverlay;
