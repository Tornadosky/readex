import { Component } from "react";
import ColorPickerWithPresets from './ColorPickerWithPresets';
import Topbar from "./Topbar";

// import type { ColorPickerProps, GetProp } from 'antd';
// type Color = GetProp<ColorPickerProps, 'value'>;

import {
  PdfLoader,
  PdfHighlighter,
  Tip,
  Highlight,
  Popup,
  AreaHighlight,
} from "./react-pdf-highlighter";

import type { IHighlight, NewHighlight } from "./react-pdf-highlighter";
import { testHighlights as _testHighlights } from "./test-highlights";
import { Spinner } from "./Spinner";
import './style.css';

interface State {
  destinationPage: number;
  pageCount: number;
  currentPage: number;
  inputPage: string;
  color: string;
  bookName: string;
  scaleValue: string;
}

const getNextId = () => String(Math.random()).slice(2);

const parseIdFromHash = () =>
  document.location.hash.slice("#highlight-".length);

const resetHash = () => {
  document.location.hash = "";
};

const HighlightPopup = ({
  comment,
}: {
  comment: { text: string; emoji: string };
}) =>
  comment.text ? (
    <div className="Highlight__popup">
      {comment.emoji} {comment.text}
    </div>
  ) : null;

class PdfViewer extends Component<{ url: string, highlights: any, setHighlights: any }, State> {
  state = {
    destinationPage: 1,
    pageCount: 0,
    currentPage: 1,
    inputPage: "1",
    color: "rgba(255, 226, 143, 1)",
    bookName: "Book name",
    scaleValue: "auto",
  };

  scrollViewerTo = (highlight: IHighlight) => {};

  scrollToHighlightFromHash = () => {
    const highlight = this.getHighlightById(parseIdFromHash());

    if (highlight) {
      this.scrollViewerTo(highlight);
    }
  };

  componentDidMount() {
    window.addEventListener(
      "hashchange",
      this.scrollToHighlightFromHash,
      false
    );
  }

  componentDidUpdate(prevProps: any, prevState: any) {
    // This ensures inputPage reflects the currentPage when it changes due to other interactions
    if (prevState.currentPage !== this.state.currentPage && !isNaN(this.state.currentPage)) {
      this.setState({ inputPage: this.state.currentPage.toString() });
    }
  }

  getHighlightById(id: string) {
    return this.props.highlights.find((highlight: any) => highlight.id === id);
  }

  addHighlight(highlight: NewHighlight) {
    const { color } = this.state;

    console.log("Saving highlight", highlight);

    this.props.setHighlights([{ ...highlight, id: getNextId(), color: color }, ...this.props.highlights])
  }

  updateHighlight(highlightId: string, position: Object, content: Object) {
    this.props.setHighlights(
      this.props.highlights.map((h: any) => {
        const {
          id,
          position: originalPosition,
          content: originalContent,
          ...rest
        } = h;
        return id === highlightId
          ? {
              id,
              position: { ...originalPosition, ...position },
              content: { ...originalContent, ...content },
              ...rest,
            }
          : h;
      })
    );
  }

  deleteHighlight(highlightId: string) {
    this.props.setHighlights(
      this.props.highlights.filter(
        ({ id }: any) => id !== highlightId
      )
    );
  }

  handleColorChange = (newColor: any) => {
    const rgbColor = newColor.toRgbString();
    this.setState({ color: rgbColor });
    console.log("Color change", rgbColor);
    document.documentElement.style.setProperty("--text-selection-color", rgbColor);
  };

  handlePageInput = (e: any) => {
    const inputVal = e.target.value;
    // Update inputPage state to reflect user input
    this.setState({ inputPage: inputVal.replace(/[^0-9]/g, '') }); // This also ensures only numbers are entered
  };

  submitPageInput = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      let page = parseInt(this.state.inputPage, 10);
      // Check if the input is not a number or out of range, and default to the current page
      if (isNaN(page) || page < 1 || page > this.state.pageCount) {
        page = this.state.currentPage;
      }
      this.setState({ destinationPage: page, currentPage: page, inputPage: page.toString() });
    }
  };

  handleIncreasePage = () => {
    this.setState(() => ({
      destinationPage: this.state.currentPage < this.state.pageCount ? this.state.currentPage + 1 : this.state.currentPage,
    }))
  };

  handleDecreasePage = () => {
    this.setState(() => ({
      destinationPage: this.state.currentPage > 1 ? this.state.currentPage - 1 : 1,
    }))
  }

  handleBookNameChange = (newBookName: string) => {
    this.setState({ bookName: newBookName });
  }

  handleScaleChange = (newScale: string) => {
    if (newScale === "Default"){
      newScale = "auto";
    } else if (newScale === "Width Fit") {
      newScale = "page-width";
    } else if (newScale === "Page Fit") {
      newScale = "page-fit";
    } else {
      newScale = "auto";
    }
    console.log("Scale change", newScale);
    this.setState({ scaleValue: newScale });
  }

  render() {
    return (
      <>
        <div 
          className="floating-color-picker" 
          onMouseOver={(e) => e.currentTarget.style.opacity = "1"} 
          onMouseOut={(e) => e.currentTarget.style.opacity = "0.5"}
        >
          <ColorPickerWithPresets defaultValue={this.state.color} onChange={this.handleColorChange} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>          
          <Topbar
            name="Book name"
            inputPage={this.state.inputPage}
            pageCount={this.state.pageCount}
            handleDecrease={this.handleDecreasePage}
            handleIncrease={this.handleIncreasePage}
            handlePageInput={this.handlePageInput}
            submitPageInput={this.submitPageInput}
            handleBookNameChange={this.handleBookNameChange}
            handleScaleChange={this.handleScaleChange}
          />
          
          <div style={{ flex: 1, position: "relative" }}>
            <PdfLoader key={this.props.url} url={this.props.url} beforeLoad={<Spinner />}>
              {(pdfDocument) => (
                <PdfHighlighter
                  key={this.state.scaleValue} // force re-render when scale changes
                  pdfDocument={pdfDocument}
                  enableAreaSelection={(event) => event.altKey}
                  onScrollChange={resetHash}
                  color={this.state.color}
                  pdfScaleValue={this.state.scaleValue}
                  scrollRef={(scrollTo) => {
                    this.scrollViewerTo = scrollTo;
                    this.scrollToHighlightFromHash();
                  }}
                  destinationPage={this.state.destinationPage}
                  getPageCount={(pageCount) => {
                    this.setState({ pageCount });
                  }}
                  getCurrentPage={(currentPage) => {
                    this.setState({ currentPage });
                  }}
                  onSelectionFinished={(
                    position,
                    content,
                    hideTipAndSelection,
                    transformSelection
                  ) => {
                    console.log("Selection is finished", { position, content });
                    return (
                      <Tip
                        onOpen={transformSelection}
                        onConfirm={(comment) => {
                          this.addHighlight({ content, position, comment, color: this.state.color});

                          hideTipAndSelection();
                        }}
                      />
                  )}}
                  highlightTransform={(
                    highlight,
                    index,
                    setTip,
                    hideTip,
                    viewportToScaled,
                    screenshot,
                    isScrolledTo
                  ) => {
                    const isTextHighlight = !Boolean(
                      highlight.content && highlight.content.image
                    );

                    //isTextHighlight && console.log("isTextHighlight", highlight.color);

                    const component = isTextHighlight ? (
                      <Highlight
                        isScrolledTo={isScrolledTo}
                        position={highlight.position}
                        comment={highlight.comment}
                        color={highlight.color}
                        onDelete={() => {
                          this.deleteHighlight(highlight.id);
                          hideTip();
                        }}
                      />
                    ) : (
                      <AreaHighlight
                        isScrolledTo={isScrolledTo}
                        highlight={highlight}
                        onChange={(boundingRect) => {
                          this.updateHighlight(
                            highlight.id,
                            { boundingRect: viewportToScaled(boundingRect) },
                            { image: screenshot(boundingRect) }
                          );
                        }}
                        onDelete={() => {
                          this.deleteHighlight(highlight.id);
                          hideTip();
                        }}
                        color={highlight.color}
                      />
                    );

                    return (
                      <Popup
                        popupContent={<HighlightPopup {...highlight} />}
                        onMouseOver={(popupContent) => {
                          setTip(highlight, (highlight) => popupContent)
                        }}
                        onMouseOut={hideTip}
                        key={index}
                        children={component}
                      />
                    );
                  }}
                  highlights={this.props.highlights}
                />
              )}
            </PdfLoader>
          </div>
        </div>
      </>
    );
  }
}

export default PdfViewer;