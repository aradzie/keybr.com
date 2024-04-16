import {
  Component,
  type ComponentType,
  type ErrorInfo,
  type ReactNode,
} from "react";
import { ErrorDetails } from "./ErrorDetails.tsx";
import { catchError, silentCatchError } from "./logger.ts";

type Props = {
  readonly children?: ReactNode;
  readonly details?: ComponentType<{ readonly report: string }>;
};

type State = {
  readonly report: string | null;
};

export class ErrorHandler extends Component<Props, State> {
  override state: State = {
    report: null,
  };

  override componentDidMount(): void {
    catchError.addHandler(this.setError);
  }

  override componentWillUnmount(): void {
    catchError.deleteHandler(this.setError);
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    silentCatchError(error);
  }

  setError = (report: string): void => {
    this.setState({ report });
  };

  override render(): ReactNode {
    const {
      props: { children, details: Details = ErrorDetails },
      state: { report },
    } = this;
    if (report != null) {
      return <Details report={report} />;
    } else {
      return children;
    }
  }
}
