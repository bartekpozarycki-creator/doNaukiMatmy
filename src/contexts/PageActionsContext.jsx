import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const PageActionsContext = createContext(null);

export function PageActionsProvider({ children }) {
  const [actions, setActionsState] = useState([]);

  const setActions = useCallback((next) => {
    setActionsState(Array.isArray(next) ? next : []);
  }, []);

  const value = useMemo(
    () => ({ actions, setActions }),
    [actions, setActions],
  );

  return (
    <PageActionsContext.Provider value={value}>
      {children}
    </PageActionsContext.Provider>
  );
}

export function usePageActionsContext() {
  const ctx = useContext(PageActionsContext);
  if (!ctx) {
    throw new Error("usePageActionsContext must be used within PageActionsProvider");
  }
  return ctx;
}

export function usePageActions(actions, deps = []) {
  const { setActions } = usePageActionsContext();

  useEffect(() => {
    setActions(actions ?? []);
    return () => setActions([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
