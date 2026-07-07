import { useEffect } from "react";
import './App.css'
import Pages from "@/pages/index.jsx"
import { ToastContainer } from "react-toastify";
import { Toaster } from "sonner";
import "react-toastify/dist/ReactToastify.css";

const skippedTextParents = new Set([
  "SCRIPT",
  "STYLE",
  "TEXTAREA",
  "INPUT",
  "CODE",
  "PRE",
]);

function replaceMinusSignsInTextNode(node) {
  if (!node?.nodeValue?.includes("−")) return;
  if (skippedTextParents.has(node.parentElement?.tagName)) return;
  if (node.parentElement?.isContentEditable) return;
  node.nodeValue = node.nodeValue.replace(/−/g, "-");
}

function replaceMinusSignsInTree(root) {
  if (!root) return;
  if (root.nodeType === Node.TEXT_NODE) {
    replaceMinusSignsInTextNode(root);
    return;
  }
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    replaceMinusSignsInTextNode(node);
    node = walker.nextNode();
  }
}

function App() {
  useEffect(() => {
    replaceMinusSignsInTree(document.body);
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => replaceMinusSignsInTree(node));
        if (mutation.type === "characterData") {
          replaceMinusSignsInTextNode(mutation.target);
        }
      });
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Pages />
      <ToastContainer position="top-right" autoClose={4000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />
      <Toaster richColors position="top-right" />
    </>
  )
}

export default App 