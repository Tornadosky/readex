import { Component } from "react";

import { asElement, isHTMLElement } from "../lib/pdfjs-dom";
import "../style/MouseSelection.css";

import type { LTWH } from "../types.js";

interface Coords {
  x: number;
  y: number;
}

interface State {
  locked: boolean;
  start: Coords | null;
  end: Coords | null;
}

interface Props {
  onSelection: (
    startTarget: HTMLElement,
    boundingRect: LTWH,
    resetSelection: () => void
  ) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  shouldStart: (event: MouseEvent) => boolean;
  onChange: (isVisible: boolean) => void;
  color: string;
}

class MouseSelection extends Component<Props, State> {
  state: State = {
    locked: false,
    start: null,
    end: null,
  };

  root?: HTMLElement;

  reset = () => {
    const { onDragEnd } = this.props;

    onDragEnd();
    this.setState({ start: null, end: null, locked: false });
  };

  getBoundingRect(start: Coords, end: Coords): LTWH {
    return {
      left: Math.min(end.x, start.x),
      top: Math.min(end.y, start.y),

      width: Math.abs(end.x - start.x),
      height: Math.abs(end.y - start.y),
    };
  }

  componentDidUpdate() {
    const { onChange } = this.props;
    const { start, end } = this.state;

    const isVisible = Boolean(start && end);

    onChange(isVisible);
  }

  componentDidMount() {
    if (!this.root) {
      return;
    }
    
    const { onSelection, onDragStart, onDragEnd, shouldStart } = this.props;
  
    const container = asElement(this.root.parentElement);
  
    if (!isHTMLElement(container)) {
      return;
    }
  
    const containerCoords = (pageX: number, pageY: number) => {
      // Calculate bounding rectangle dynamically
      const containerBoundingRect = container.getBoundingClientRect();
  
      return {
        x: pageX - containerBoundingRect.left + container.scrollLeft,
        y: pageY - containerBoundingRect.top + container.scrollTop - window.scrollY,
      };
    };
  
    container.addEventListener("mousemove", (event: MouseEvent) => {
      const { start, locked } = this.state;
  
      if (!start || locked) {
        return;
      }
  
      this.setState({
        end: containerCoords(event.pageX, event.pageY),
      });
    });
  
    container.addEventListener("mousedown", (event: MouseEvent) => {
      if (!shouldStart(event)) {
        this.reset();
        return;
      }
  
      const startTarget = asElement(event.target);
      if (!isHTMLElement(startTarget)) {
        return;
      }
  
      onDragStart();
  
      this.setState({
        start: containerCoords(event.pageX, event.pageY),
        end: null,
        locked: false,
      });
  
      const onMouseUp = (event: MouseEvent) => {
        container.removeEventListener("mouseup", onMouseUp);
  
        const { start } = this.state;
        if (!start) {
          return;
        }
  
        const end = containerCoords(event.pageX, event.pageY);
        const boundingRect = this.getBoundingRect(start, end);
  
        if (
          !isHTMLElement(event.target) ||
          !container.contains(asElement(event.target)) ||
          !this.shouldRender(boundingRect)
        ) {
          this.reset();
          return;
        }
  
        this.setState({ end, locked: true }, () => {
          if (this.state.start && this.state.end) {
            onSelection(startTarget, boundingRect, this.reset);
            onDragEnd();
          }
        });
      };
  
      container.addEventListener("mouseup", onMouseUp);
    });
  }

  shouldRender(boundingRect: LTWH) {
    return boundingRect.width >= 1 && boundingRect.height >= 1;
  }

  render() {
    const { start, end } = this.state;

    return (
      <div
        className="MouseSelection-container"
        ref={(node) => {
          if (!node) {
            return;
          }
          this.root = node;
        }}
      >
        {start && end ? (
          <div
            className="MouseSelection"
            style={{
              ...this.getBoundingRect(start, end),
              backgroundColor: this.props.color,
            }}
          />
        ) : null}
      </div>
    );
  }
}

export default MouseSelection;