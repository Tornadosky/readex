import React, { useRef, useEffect } from 'react';

interface Props {
  onMoveAway: () => void;
  paddingX: number;
  paddingY: number;
  children: JSX.Element;
}

// Used to track mouse movement and trigger a callback (onMoveAway) when the mouse moves away from the target.
const MouseMonitor: React.FC<Props> = ({ onMoveAway, paddingX, paddingY, children }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onMouseMove = (event: MouseEvent) => {
      const container = containerRef.current;
      if (!container) {
        return;
      }

      const { clientX, clientY } = event;
      const { left, top, width, height } = container.getBoundingClientRect();

      const inBoundsX = clientX > left - paddingX && clientX < left + width + paddingX;
      const inBoundsY = clientY > top - paddingY && clientY < top + height + paddingY;
      const isNear = inBoundsX && inBoundsY;

      if (!isNear) {
        onMoveAway();
      }
      
    };

    const doc = containerRef.current?.ownerDocument || document;
    doc.addEventListener('mousemove', onMouseMove);

    // Cleanup function
    return () => {
      doc.removeEventListener('mousemove', onMouseMove);
    };
  }, [onMoveAway, paddingX, paddingY]); // Dependencies

  // Spread props to children should be handled carefully; React.cloneElement is not always needed.
  // If you want to pass additional props to the single React child, you can still use React.cloneElement.
  // Ensure that you correctly merge props if the child might already have the same props you're setting.
  return <div ref={containerRef}>{React.cloneElement(children)}</div>;
};

export default MouseMonitor;
