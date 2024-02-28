import React, { Component } from "react";

import { Rnd } from "react-rnd";
import { getPageFromElement } from "../lib/pdfjs-dom";

import "../style/AreaHighlight.css";

import type { LTWHP, ViewportHighlight } from "../types";

interface Props {
  highlight: ViewportHighlight;
  onChange: (rect: LTWHP) => void;
  onDelete: () => void;
  isScrolledTo: boolean;
  color: string;
}

export class AreaHighlight extends Component<Props> {
  timeoutRef: NodeJS.Timeout | null = null;

  render() {
    const { highlight, onChange, onDelete, isScrolledTo, color, ...otherProps } = this.props;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Delete') {
        onDelete();
      }
    };

    return (
      <div
        className={`AreaHighlight ${
          isScrolledTo ? "AreaHighlight--scrolledTo" : ""
        }`}
        style={
          isScrolledTo ? { backgroundColor:  '#ff4141' } : { backgroundColor: color }
        }
      >
        <Rnd
          className="AreaHighlight__part"
          style={
            isScrolledTo ? { backgroundColor:  '#ff4141' } : { backgroundColor: color }
          }
          onMouseDown={(event) => {
            // Clear existing timeout to ensure not setting up multiple listeners
            if (this.timeoutRef) {
              clearTimeout(this.timeoutRef);
            }
            document.addEventListener('keydown', onKeyDown);
            // Set another timeout to remove the listener after 3 seconds
            setTimeout(() => {
              document.removeEventListener('keydown', onKeyDown);
            }, 3000);
          }}
          onDragStop={(_, data) => {
            const boundingRect: LTWHP = {
              ...highlight.position.boundingRect,
              top: data.y,
              left: data.x,
            };

            onChange(boundingRect);
          }}
          onResizeStop={(_mouseEvent, _direction, ref, _delta, position) => {
            const boundingRect: LTWHP = {
              top: position.y,
              left: position.x,
              width: ref.offsetWidth,
              height: ref.offsetHeight,
              pageNumber: getPageFromElement(ref)?.number || -1,
            };

            onChange(boundingRect);
          }}
          position={{
            x: highlight.position.boundingRect.left,
            y: highlight.position.boundingRect.top,
          }}
          size={{
            width: highlight.position.boundingRect.width,
            height: highlight.position.boundingRect.height,
          }}
          onClick={(event: Event) => {
            event.stopPropagation();
            event.preventDefault();
          }}
          {...otherProps}
        />
      </div>
    );
  }
}

export default AreaHighlight;
