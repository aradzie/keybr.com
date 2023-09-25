import {
  type ComponentType,
  type FC,
  memo,
  type ReactNode,
  useEffect,
  useState,
} from "react";

type Unknown = unknown;

export const useDeferred = <T extends Unknown>(value: T): T => {
  const [deferred, setDeferred] = useState<T>(value);
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setDeferred(value);
    });
    return () => {
      cancelAnimationFrame(id);
    };
  }, [value]);
  return deferred;
};

export const withDeferred = <P extends Record<string, Unknown>>(
  WrappedComponent: ComponentType<P>,
): FC<P> => {
  const DeferredComponent: FC<P> = (props: P): ReactNode => {
    const deferredProps = useDeferred(props);
    return <WrappedComponent {...deferredProps} />;
  };
  DeferredComponent.displayName = `Deferred${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  }`;
  return memo(DeferredComponent);
};
