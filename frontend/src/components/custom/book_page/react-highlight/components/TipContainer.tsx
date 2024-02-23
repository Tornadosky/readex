import React, { useState, useEffect, useRef } from 'react';
import type { LTWHP } from '../types';

interface Props {
  children: JSX.Element | null;
  style: { top: number; left: number; bottom: number };
  scrollTop: number;
  pageBoundingRect: LTWHP;
}

const clamp = (value: number, left: number, right: number) =>
  Math.min(Math.max(value, left), right);

const TipContainer: React.FC<Props> = ({
  children,
  style,
  scrollTop,
  pageBoundingRect
 }) => {
  const [dimensions, setDimensions] = useState({ height: 0, width: 0 });
  const nodeRef = useRef<HTMLDivElement | null>(null);

  const updatePosition = () => {
    const node = nodeRef.current;
    if (!node) return;

    const { offsetHeight, offsetWidth } = node;
    setDimensions({ height: offsetHeight, width: offsetWidth });
  };

  // Effect for componentDidMount and componentDidUpdate for children
  useEffect(() => {
    setTimeout(updatePosition, 0);
  }, [children]);

  // Calculate visibility and position
  const { height, width } = dimensions;
  const isStyleCalculationInProgress = width === 0 && height === 0;
  const shouldMove = style.top - height - 5 < scrollTop;
  const top = shouldMove ? style.bottom + 5 : style.top - height - 5;
  const left = clamp(style.left - width / 2, 0, pageBoundingRect.width - width);

  // Update child components with new props
  const childrenWithProps = React.Children.map(children, child =>
    React.cloneElement(child as React.ReactElement<any>, {
      onUpdate: () => {
        setDimensions({ width: 0, height: 0 });
        setTimeout(updatePosition, 0);
      },
      popup: {
        position: shouldMove ? "below" : "above",
      },
    })
  );

  return (
    <div
      className="PdfHighlighter__tip-container"
      style={{
        visibility: isStyleCalculationInProgress ? "hidden" : "visible",
        top,
        left,
      }}
      ref={nodeRef}
    >
      {childrenWithProps}
    </div>
  );
};

export default TipContainer;