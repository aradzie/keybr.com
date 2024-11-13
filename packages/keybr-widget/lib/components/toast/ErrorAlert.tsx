import { Alert } from "./Alert.tsx";
import { toast } from "./Toaster.tsx";

export function ErrorAlert({ error }: { readonly error: unknown }) {
  return (
    <Alert severity="error">
      {error instanceof AggregateError ? (
        error.errors.map((child, index) => <p key={index}>{String(child)}</p>)
      ) : (
        <p>{String(error)}</p>
      )}
    </Alert>
  );
}

ErrorAlert.report = (error: unknown) => {
  toast(<ErrorAlert error={error} />);
};
