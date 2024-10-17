import { Alert, toast } from "@keybr/widget";

export function reportError(error: unknown) {
  if (error) {
    toast(<ErrorAlert error={error} />);
  }
}

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
