import { useState, useEffect, Component } from "react";
import { useParams, useOutletContext } from 'react-router-dom';
import ColorPickerWithPresets from './ColorPickerWithPresets';
import type { IBook } from './LayoutWithSidebar';
import Topbar from "./Topbar";
import axios from 'axios';

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

import { getTextInsideRectangle } from "./react-highlight/components/PdfHighlighter";

interface State {
  destinationPage: number;
  pageCount: number;
  currentPage: number;
  inputPage: string;
  color: string;
  bookName: string;
  scaleValue: string;
}

// const getNextId = () => String(Math.random()).slice(2);

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

class PdfViewer extends Component<{ url: any, highlights: any, setHighlights: any, bookName: string, setBooksList: any, pdfId: any }, State> {
  state = {
    destinationPage: 1,
    pageCount: 0,
    currentPage: 1,
    inputPage: "1",
    color: "rgba(255, 226, 143, 1)",
    bookName: this.props.bookName,
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
    // if (this.props.bookName !== prevProps.bookName) {
    //   this.setState({ bookName: this.props.bookName });
    // }
  }

  getHighlightById(id: string) {
    return this.props.highlights.find((highlight: any) => highlight.id === id);
  }

  addHighlight(highlight: NewHighlight) {
    const { color } = this.state;

    console.log("Saving highlight", highlight);

    const { content, position, comment } = highlight;

    const rectsData = position.rects.map(rect => ({
      pagenum: rect.pageNumber,
      x1: rect.x1,
      y1: rect.y1,
      x2: rect.x2,
      y2: rect.y2,
      width: rect.width,
      height: rect.height
    }));
    const boundingRect = {
      pagenum: position.boundingRect.pageNumber,
      x1: position.boundingRect.x1,
      y1: position.boundingRect.y1,
      x2: position.boundingRect.x2,
      y2: position.boundingRect.y2,
      width: position.boundingRect.width,
      height: position.boundingRect.height
    };
  
    const mutation = `
      mutation SetHighlight($book: Int!, $user: Int!, $title: String, $text: String, $image: String, $color: String!, $emoji: String, $boundingRect: iRects!, $rects: [iRects!]!) {
        setHighlight(
          book: $book,
          user: $user,
          title: $title,
          text: $text,
          image: $image,
          color: $color,
          emoji: $emoji,
          boundingRect: $boundingRect,
          rects: $rects
        ) {
          id
          text
          title
          image
          emoji
          color
          rects {
            rects {
              pagenum
              x1
              y1
              x2
              y2
              width
              height
            }
          }
          boundingRect {
            pagenum
            x1
            y1
            x2
            y2
            width
            height
          }
          book {
            id
            title
          }
          user {
            id
            login
          }
        }
      }
    `;

  const bookId = parseInt(this.props.pdfId);
  const userId = 1;

  // Call your API with the formatted data
  axios.post('http://localhost:3000/graphql', {
    query: mutation,
    variables: {
      book: bookId,
      user: userId,
      title: comment.text ? comment.text : '',
      text: content.text ? content.text : '',
      image: content.image ? content.image : null,
      color: color,
      emoji: comment.emoji ? comment.emoji : '',
      boundingRect: boundingRect,
      rects: rectsData
    }
  }).then(response => {
    if (response.data.data) {
      const newHighlight = response.data.data.setHighlight;
      console.log('Highlight saved:', newHighlight);
      this.props.setHighlights((prevHighlights: any): any => [
        ...prevHighlights,
        {
          id: newHighlight.id,
          content: { text: newHighlight.text, image: newHighlight.image},
          color: newHighlight.color,
          position: {
            boundingRect: newHighlight.boundingRect,
            rects: newHighlight.rects.map((rect: any): any => rect.rects),
            pageNumber: newHighlight.boundingRect.pagenum
          },
          comment: {
            text: newHighlight.title,
            emoji: newHighlight.emoji ? newHighlight.emoji : ''
          }
        }
      ]);
      console.log('Highlights:', this.props.highlights)
    } else if (response.data.errors) {
      console.error('Failed to save highlight:', response.data.errors);
    }
  }).catch(error => {
    console.error('Error saving highlight:', error);
  });
    // this.props.setHighlights([{ ...highlight, id: getNextId(), color: color }, ...this.props.highlights])
  }

  updateHighlight(highlightId: string, position: any, content: any) {
    const mutation = `
      mutation SetHighlight($id: ID!, $boundingRect: iRects!, $text: String, $image: String) {
        setHighlight(
          id: $id,
          boundingRect: $boundingRect,
          text: $text,
          image: $image
        ) {
          id
          text
          image
          boundingRect {
            pagenum
            x1
            y1
            x2
            y2
            width
            height
          }
        }
      }
    `;

    console.log("Updating highlight", { highlightId, position, content })
    
    const boundingRectData = {
      pagenum: this.state.currentPage,
      x1: position.boundingRect.x1,
      y1: position.boundingRect.y1,
      x2: position.boundingRect.x2,
      y2: position.boundingRect.y2,
      width: position.boundingRect.width,
      height: position.boundingRect.height
    };

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

    axios.post('http://localhost:3000/graphql', {
      query: mutation,
      variables: {
        id: highlightId,
        boundingRect: boundingRectData,
        text: content.text ? content.text : '',
        image: content.image
      }
    }).then(response => {
      if (response.data.data) {
        console.log('Highlight updated:', response.data.data.setHighlight);        
      } else if (response.data.errors) {
        console.error('Failed to update highlight:', response.data.errors);
      }
    }).catch(error => {
      console.error('Error updating highlight:', error);
    });
  }

  deleteHighlight(highlightId: string) {
    const mutation = `
      mutation DeleteHighlight($id: Int!) {
        delHighlight(id: $id) {
          id
        }
      }
    `;
    axios.post('http://localhost:3000/graphql', {
      query: mutation,
      variables: {
        id: parseInt(highlightId)
      }
    }).then(response => {
      if (response.data.data && response.data.data.delHighlight) {
        console.log('Highlight deleted:', response.data.data.delHighlight);
        
        this.props.setHighlights((prevHighlights: any): any => 
          prevHighlights.filter(({ id }: any) => id !== highlightId)
        );
      } else if (response.data.errors) {
        console.error('Failed to delete highlight:', response.data.errors);
      }
    }).catch(error => {
      console.error('Error deleting highlight:', error);
    });
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
            name={this.props.bookName}
            setBooksList={this.props.setBooksList}
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
                          console.log("New rectangle", { boundingRect });
                          this.updateHighlight(
                            highlight.id,
                            { boundingRect: viewportToScaled(boundingRect) },
                            { text: getTextInsideRectangle(boundingRect, this.state.currentPage), image: screenshot(boundingRect) }
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

interface OutletContextType {
  booksList: IBook[];
  setBooksList: React.Dispatch<React.SetStateAction<IBook[]>>;
  highlights: IHighlight[];
  setHighlights: React.Dispatch<React.SetStateAction<IHighlight[]>>;
}

function PdfViewerWrapper(props: any) {
  const { pdfId } = useParams();
  const [pdfUrl, setPdfUrl] = useState('');
  const [bookName, setBookName] = useState('');
  //const [highlights, setHighlights] = useState([]);
  const { setBooksList, highlights, setHighlights } = useOutletContext<OutletContextType>();

  useEffect(() => {
    const fetchBookName = async () => {
      setBookName('');
      try {
        const response = await axios.post('http://localhost:3000/graphql', {
          query: `
            query GetBookDetails($id: Int!) {
              Books(id: $id) {
                id
                title
                highlights {
                  id
                  text
                  color
                  title
                  emoji
                  image
                  boundingRect {
                    pagenum
                    x1
                    y1
                    x2
                    y2
                    width
                    height
                  }
                  rects {
                    rects {
                      pagenum
                      x1
                      y1
                      x2
                      y2
                      width
                      height
                    }
                  }
                }
              }
            }
          `,
          variables: {
            id: parseInt(pdfId!)
          },
        });

        if (response.data && response.data.data.Books.length > 0) {
          const book = response.data.data.Books[0];
          console.log('Book:', book);
          setBookName(book.title);
          // setHighlights(book.highlights.map((h: any): any => {
          //   const rects = h.rects.map((r: any): any => r.rects);
          //   const boundingRect = h.boundingRect;
  
          //   return {
          //     id: h.id,
          //     content: { text: h.text, image: h.image},
          //     color: h.color,
          //     position: {
          //       boundingRect,
          //       rects,
          //       pageNumber: boundingRect.pagenum
          //     },
          //     comment: {
          //       text: h.title,
          //       emoji: h.emoji
          //     }
          //   };
          // }));
          return book.title;
        } else {
          console.error('Book not found');
          return null;
        }
      } catch (error) {
        console.error('Error fetching book name:', error);
        return null;
      }
    };

    const fetchPdfData = async (bookName: string) => {
      try {
        const response = await fetch('http://localhost:3000/getbook', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            document: `./uploads/1/${bookName}`
          }),
        });

        if (response.ok) {
          const blob = await response.blob();
          const blobUrl = URL.createObjectURL(blob);
          setPdfUrl(blobUrl);
        } else {
          const errorResponse = await response.json();
          console.error('Error fetching PDF:', errorResponse.error);
        }
      } catch (error) {
        console.error('Error fetching PDF data:', error);
      }
    };

    const executeFetchSequence = async () => {
      if (pdfId) {
        const bookName = await fetchBookName();
        if (bookName) {
          await fetchPdfData(bookName);
        }
      }
    };

    executeFetchSequence();
  }, [pdfId]);

  return (
  <>
    {bookName && highlights &&
      <PdfViewer
        key={pdfId}
        {...props} 
        highlights={highlights} 
        setHighlights={setHighlights} 
        setBooksList={setBooksList} 
        pdfId={pdfId}
        url={pdfUrl} 
        bookName={bookName.replace(".pdf", "")}
      />}
  </>
);
}

export default PdfViewerWrapper;