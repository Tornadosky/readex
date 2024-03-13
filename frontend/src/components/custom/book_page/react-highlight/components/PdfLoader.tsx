import React, { Component } from "react";

import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import type { PDFDocumentProxy } from "pdfjs-dist";

interface Props {
  /** See `GlobalWorkerOptionsType`. */
  workerSrc: string;
  url?: string;
  beforeLoad: JSX.Element;
  errorMessage?: JSX.Element;
  children: (pdfDocument: PDFDocumentProxy) => JSX.Element;
  onError?: (error: Error) => void;
  cMapUrl?: string;
  cMapPacked?: boolean;
}

interface State {
  pdfDocument: PDFDocumentProxy | null;
  error: Error | null;
}

export class PdfLoader extends Component<Props, State> {
  state: State = {
    pdfDocument: null,
    error: null,
  };

  static defaultProps = {
    workerSrc: "https://unpkg.com/pdfjs-dist@3.8.162/build/pdf.worker.min.js",
  };

  documentRef = React.createRef<HTMLElement>();

  componentDidMount() {
    console.log("Loader Mounted");
    this.load();
  }

  componentWillUnmount() {
    const { pdfDocument: discardedDocument } = this.state;
    if (discardedDocument) {
      console.log("Loader Unmounted");
      discardedDocument.destroy();
    }
  }

  componentDidUpdate({ url }: Props) {
    if (this.props.url !== url) {
      console.log("Loader updated");
      this.load();
    }
  }

  componentDidCatch(error: Error, info?: any) {
    const { onError } = this.props;

    console.error("Custom Error" + error);

    if (onError) {
      onError(error);
    }

    this.setState({ pdfDocument: null, error });
  }

  load() {
    const { ownerDocument = document } = this.documentRef.current || {};
    const { workerSrc } = this.props;
    const { pdfDocument: discardedDocument } = this.state;
    this.setState({ pdfDocument: null, error: null });

    if (typeof workerSrc === "string") {
      GlobalWorkerOptions.workerSrc = workerSrc;
    }
    
    Promise.resolve()
      .then(() => discardedDocument && discardedDocument.destroy())
      .then(() => {
        
        const { url, ...otherProps } = this.props;
        console.log("Load", url);
        if (!url) return;

        return getDocument({
          url: url ?? undefined,
          ownerDocument,
          ...otherProps,
        }).promise.then((pdfDocument) => {
          this.setState({ pdfDocument });
        });
      })
      .catch((e) => this.componentDidCatch(e));
  }

  render() {
    const { children, beforeLoad } = this.props;
    const { pdfDocument, error } = this.state;
    return (
      <>
        <span ref={this.documentRef} />
        {error
          ? this.renderError()
          : !pdfDocument || !children
          ? beforeLoad
          : children(pdfDocument)}
      </>
    );
  }

  renderError() {
    const { errorMessage } = this.props;
    console.log("Error: " + this.state.error);
    if (errorMessage) {
      return React.cloneElement(errorMessage, { error: this.state.error });
    }

    return null;
  }
}

export default PdfLoader;
