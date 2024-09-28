import { RefObject, useEffect } from "react";

interface Params {
  ref: RefObject<HTMLElement>;
  callback: (entry: ResizeObserverEntry) => void;
}

const useResizeObserver = (params: Params) => {
  const { ref, callback } = params;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      const [entry] = entries;
      callback(entry);
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [callback, ref]);
};

export { useResizeObserver };
