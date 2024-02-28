import React, { Component } from "react";
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import ColorPickerWithPresets from './ColorPickerWithPresets';

import type { ColorPickerProps, GetProp } from 'antd';
type Color = GetProp<ColorPickerProps, 'value'>;

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
import { Sidebar } from "./Sidebar";
import './style.css';

const testHighlights: Record<string, Array<IHighlight>> = _testHighlights;

interface State {
  url: string;
  highlights: Array<IHighlight>;
  destinationPage: number;
  pageCount: number;
  currentPage: number;
  inputPage: string;
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

const PRIMARY_PDF_URL = "https://arxiv.org/pdf/1708.08021.pdf";
const SECONDARY_PDF_URL = "https://arxiv.org/pdf/1604.02480.pdf";

const searchParams = new URLSearchParams(document.location.search);

const initialUrl = searchParams.get("url") || PRIMARY_PDF_URL;

class App extends Component<{}, State> {
  state = {
    url: initialUrl,
    highlights: testHighlights[initialUrl]
      ? [...testHighlights[initialUrl]]
      : [],
    destinationPage: 1,
    pageCount: 0,
    currentPage: 1,
    inputPage: "1",
    color: "rgba(255, 226, 143, 1)",
  };

  resetHighlights = () => {
    this.setState({
      highlights: [],
    });
  };

  toggleDocument = () => {
    const newUrl =
      this.state.url === PRIMARY_PDF_URL ? SECONDARY_PDF_URL : PRIMARY_PDF_URL;

    this.setState({
      url: newUrl,
      highlights: testHighlights[newUrl] ? [...testHighlights[newUrl]] : [],
    });
  };

  scrollViewerTo = (highlight: any) => {};

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
    const { highlights } = this.state;

    return highlights.find((highlight) => highlight.id === id);
  }

  addHighlight(highlight: NewHighlight) {
    const { highlights, color } = this.state;

    console.log("Saving highlight", highlight);

    this.setState({
      highlights: [{ ...highlight, id: getNextId(), color: color }, ...highlights],
    });
  }

  updateHighlight(highlightId: string, position: Object, content: Object) {
    console.log("Updating highlight", highlightId, position, content);

    this.setState({
      highlights: this.state.highlights.map((h) => {
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
      }),
    });
  }

  handleColorChange = (newColor: Color) => {
    this.setState({ color: newColor.toRgbString() });
    console.log("Color change", newColor.toRgbString());
  };

  handlePageInput = (e: any) => {
    const inputVal = e.target.value;
    // Update inputPage state to reflect user input
    this.setState({ inputPage: inputVal.replace(/[^0-9]/g, '') }); // This also ensures only numbers are entered
  }

  
  submitPageInput = (e: any) => {
    if (e.key === 'Enter') {
      let page = parseInt(this.state.inputPage, 10);
      // Check if the input is not a number or out of range, and default to the current page
      if (isNaN(page) || page < 1 || page > this.state.pageCount) {
        page = this.state.currentPage;
      }
      this.setState({ destinationPage: page, currentPage: page, inputPage: page.toString() });
    }
  }

  render() {
    const { url, highlights } = this.state;

    return (
      <div className="App" style={{ display: "flex", flexDirection: "column", height: "100vh" }} >
        <div style={{ display: "flex", flex: 1, position: "relative" }}>
          <Sidebar
            highlights={highlights}
            resetHighlights={this.resetHighlights}
            toggleDocument={this.toggleDocument}
          />
          <div className="floating-color-picker" style={{
            position: "absolute",
            top: "10%", 
            left: "25%",
            opacity: 0.5,
            transition: "opacity 0.3s",
            zIndex: 1000
          }} onMouseOver={(e) => e.currentTarget.style.opacity = "1"} onMouseOut={(e) => e.currentTarget.style.opacity = "0.5"}>
            <ColorPickerWithPresets defaultValue={this.state.color} onChange={this.handleColorChange} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            {/* TODO: Replace with Topbar */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#f5f5f5",
                padding: "10px 20px",
                border: "1px solid #ddd",
                height: "57px",
              }}
            >
              <h1 style={{ margin: 0 }}>Book name.pdf</h1>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                }}
              >
                <button 
                  type="button" 
                  className="w-8 h-8 text-white bg-zinc-400 hover:bg-zinc-600 focus:outline-none font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center"
                  onClick={() =>
                    this.setState(({ currentPage }) => ({
                      destinationPage: currentPage > 1 ? currentPage - 1 : 1,
                    }))
                  }
                >
                  <UpOutlined />
                </button> 
                <div style={{ margin: '0px 8px', display: 'flex', flexShrink: '0', alignItems: "center" }}>
                  <span>
                    <input
                      type="text"
                      data-testid="page-navigation__current-page-input"
                      aria-label="Enter a page number"
                      className="input-pages"
                      placeholder=""
                      value={this.state.inputPage}
                      onChange={this.handlePageInput}
                      onKeyDown={this.submitPageInput}
                    />
                  </span>
                  <span style={{ margin: "0px 3px" }}>/</span>
                  {this.state.pageCount}
                </div>
                <button 
                  type="button" 
                  className="w-8 h-8 text-white bg-zinc-400 hover:bg-zinc-600 focus:outline-none font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center"
                  onClick={() =>
                    this.setState(({ currentPage }) => ({
                      destinationPage: currentPage < this.state.pageCount ? currentPage + 1 : currentPage,
                    }))
                  }
                >
                  <DownOutlined />
                </button>               
              </div>
            </div>
            
            <div style={{ flex: 1, position: "relative" }}>
              <PdfLoader url={url} beforeLoad={<Spinner />}>
                {(pdfDocument) => (
                  <PdfHighlighter
                    pdfDocument={pdfDocument}
                    enableAreaSelection={(event) => event.altKey}
                    onScrollChange={resetHash}
                    // pdfScaleValue="page-width"
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
                    ) => (
                      <Tip
                        onOpen={transformSelection}
                        onConfirm={(comment) => {
                          this.addHighlight({ content, position, comment, color: this.state.color});

                          hideTipAndSelection();
                        }}
                      />
                    )}
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

                      const component = isTextHighlight ? (
                        <Highlight
                          isScrolledTo={isScrolledTo}
                          position={highlight.position}
                          comment={highlight.comment}
                          color={highlight.color}
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
                          color={highlight.color}
                        />
                      );

                      return (
                        <Popup
                          popupContent={<HighlightPopup {...highlight} />}
                          onMouseOver={(popupContent) =>
                            setTip(highlight, (highlight) => popupContent)
                          }
                          onMouseOut={hideTip}
                          key={index}
                          children={component}
                        />
                      );
                    }}
                    highlights={highlights}
                  />
                )}
              </PdfLoader>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;