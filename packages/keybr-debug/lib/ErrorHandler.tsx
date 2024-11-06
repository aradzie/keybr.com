import {
  Component,
  type ComponentType,
  type ErrorInfo,
  type ReactNode,
} from "react";
import { ErrorScreen } from "./ErrorScreen.tsx";
import { catchError, silentCatchError } from "./logger.ts";

type Props = {
  readonly children?: ReactNode;
  readonly display?: ComponentType<{ readonly report: string }>;
};

type State = {
  readonly report: string | null;
};

export class ErrorHandler extends Component<Props, State> {
  override state: State = {
    report: null,
  };

  override componentDidMount() {
    catchError.addHandler(this.setError);
  }

  override componentWillUnmount() {
    catchError.deleteHandler(this.setError);
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    silentCatchError(error);
  }

  setError = (report: string) => {
    this.setState({ report });
  };

  override render() {
    const { children, display: Display = ErrorScreen } = this.props;
    const { report } = this.state;
    if (report != null) {
      return <Display report={report} />;
    } else {
      return children;
    }
  }
}
