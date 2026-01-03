// src/hooks/useUrlState.js
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Sync a shallow object state with the URL query string.
 * - Reads initial values on mount
 * - Debounced push (replaceState) on change
 */
export default function useUrlState(initial = {}, { debounceMs = 250 } = {}) {
  const [state, setState] = useState(initial);
  const first = useRef(true);
  const timer = useRef(null);

  // Read from URL on mount
  useEffect(() => {
    try {
      const usp = new URLSearchParams(window.location.search);
      const obj = {};
      usp.forEach((v, k) => {
        obj[k] = v;
      });
      if (Object.keys(obj).length) {
        setState((prev) => ({ ...prev, ...obj }));
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Write to URL (debounced)
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const usp = new URLSearchParams();
      Object.entries(state).forEach(([k, v]) => {
        if (v !== undefined && v !== null && String(v).length) {
          usp.set(k, String(v));
        }
      });
      const url = `${window.location.pathname}?${usp.toString()}`;
      window.history.replaceState({}, "", url);
    }, debounceMs);
    return () => timer.current && clearTimeout(timer.current);
  }, [state, debounceMs]);

  const update = useCallback((patch) => {
    setState((prev) => ({ ...prev, ...patch }));
  }, []);

  const reset = useCallback(() => setState({}), []);

  return { state, setState: update, reset };
}