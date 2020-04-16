import { useRef, useLayoutEffect } from "react";
const isBrowser = typeof window !== "undefined";
function getScrollPosition({ element, useWindow }) {
  if (!isBrowser) return { x: 0, y: 0 };

  const target = element ? element.current : document.body;
  const position = target.getBoundingClientRect();

  return useWindow
    ? { x: window.scrollX, y: window.screenY }
    : { x: position.left, y: position.top };
}
