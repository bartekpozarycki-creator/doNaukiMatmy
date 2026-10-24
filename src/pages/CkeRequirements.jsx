import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import MathText from "@/components/MathText";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { ckeRequirementSections } from "@/utils/cke-requirements";
import { getNotebookPageStyle } from "@/utils/notebook-page-style";
import { cn } from "@/lib/utils";
import {
  CLOUD_SYNC_KEYS,
  isCloudSyncReady,
  loadCloudData,
  markCloudSyncReady,
  mergeStruckIds,
  readLocalJson,
  saveCloudData,
  writeLocalJson,
} from "@/utils/cloud-sync";

const CKE_SOURCE_URL =
  "https://cke.gov.pl/images/_EGZAMIN_MATURALNY_OD_2023/podstawa_programowa/DU_programowej_2024.pdf";

function struckStorageKey(userId) {
  return userId ? `mm_cke_struck_${userId}` : "mm_cke_struck_guest";
}

function requirementItemId(sectionId, scope, index) {
  return `${sectionId}:${scope}:${index}`;
}

function StrikeToggle({ struck, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="mt-1 shrink-0 text-sm font-medium text-slate-400 transition hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
    >
      {struck ? "wróć" : "wykreśl"}
    </button>
  );
}

function StruckCopy({ struck, children }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;

    const paint = () => {
      root.querySelectorAll(":scope > .cke-strike-bar").forEach((node) => node.remove());
      if (!root.classList.contains("cke-requirement-strike")) return;
      const host = root.querySelector(".math-text-ui");
      if (!host) return;

      const rootRect = root.getBoundingClientRect();
      const range = document.createRange();
      const walker = document.createTreeWalker(host, NodeFilter.SHOW_TEXT);
      const textRects = [];
      let node = walker.nextNode();
      while (node) {
        if (!node.parentElement?.closest(".katex") && node.textContent.trim()) {
          range.selectNodeContents(node);
          for (const rect of range.getClientRects()) {
            if (rect.width > 1 && rect.height > 1) textRects.push(rect);
          }
        }
        node = walker.nextNode();
      }

      const clusters = [];
      for (const rect of textRects) {
        const cluster = clusters.find((item) => Math.abs(item.top - rect.top) < 8);
        if (!cluster) {
          clusters.push({
            top: rect.top,
            center: rect.top + rect.height / 2,
            left: rect.left,
            right: rect.right,
            count: 1,
          });
          continue;
        }
        cluster.left = Math.min(cluster.left, rect.left);
        cluster.right = Math.max(cluster.right, rect.right);
        cluster.center =
          (cluster.center * cluster.count + rect.top + rect.height / 2) / (cluster.count + 1);
        cluster.count += 1;
      }

      range.selectNodeContents(host);
      const allRects = [...range.getClientRects()].filter(
        (rect) => rect.width > 1 && rect.height > 4,
      );
      for (const rect of allRects) {
        const cluster = clusters.find(
          (item) => rect.top <= item.center && rect.bottom >= item.center,
        );
        if (!cluster) continue;
        cluster.left = Math.min(cluster.left, rect.left);
        cluster.right = Math.max(cluster.right, rect.right);
      }

      for (const cluster of clusters) {
        const bar = document.createElement("span");
        bar.className = "cke-strike-bar";
        bar.style.left = `${cluster.left - rootRect.left}px`;
        bar.style.width = `${cluster.right - cluster.left}px`;
        bar.style.top = `${cluster.center - rootRect.top - 0.75}px`;
        root.appendChild(bar);
      }
    };

    paint();
    const observer = new ResizeObserver(paint);
    observer.observe(root);
    return () => observer.disconnect();
  }, [struck]);

  return (
    <div ref={ref} className={cn("w-fit max-w-full", struck && "cke-requirement-strike")}>
      {children}
    </div>
  );
}

function RequirementBody({ item, struck }) {
  if (typeof item === "string") {
    return (
      <StruckCopy struck={struck}>
        <MathText text={item} className="math-text-ui--flow" />
      </StruckCopy>
    );
  }

  return (
    <div className="space-y-2">
      <StruckCopy struck={struck}>
        <MathText text={item.text} className="math-text-ui--flow" />
      </StruckCopy>
      {item.points?.length ? (
        <ol className="list-[lower-alpha] space-y-1.5 pl-5">
          {item.points.map((point) => (
            <li key={point} className="pl-1">
              <StruckCopy struck={struck}>
                <MathText text={point} className="math-text-ui--flow" />
              </StruckCopy>
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}

function visibleEntries(items, sectionId, scope, struckIds, onlyUnstruck) {
  return items
    .map((item, index) => ({ item, index }))
    .filter(
      ({ index }) =>
        !onlyUnstruck || !struckIds.has(requirementItemId(sectionId, scope, index)),
    );
}

function RequirementList({ items, sectionId, scope, struckIds, onToggle, onlyUnstruck }) {
  const entries = visibleEntries(items, sectionId, scope, struckIds, onlyUnstruck);
  if (entries.length === 0) return null;

  return (
    <ol className="list-decimal space-y-3 pl-5 text-base leading-7 text-slate-700 dark:text-slate-200">
      {entries.map(({ item, index }) => {
        const id = requirementItemId(sectionId, scope, index);
        const struck = struckIds.has(id);
        return (
          <li key={id} className="pl-1" value={index + 1}>
            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <RequirementBody item={item} struck={struck} />
              </div>
              <StrikeToggle struck={struck} onToggle={() => onToggle(id)} />
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export default function CkeRequirementsPage() {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const pageStyle = getNotebookPageStyle(isDark);
  const [struckIds, setStruckIds] = useState(() => new Set());
  const [onlyUnstruck, setOnlyUnstruck] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const key = struckStorageKey(user?.id);
    const localIds = mergeStruckIds(readLocalJson(key, []), []);
    setStruckIds(new Set(localIds));
    writeLocalJson(key, localIds);

    if (!user?.id) {
      return () => {
        cancelled = true;
      };
    }

    loadCloudData(user.id, CLOUD_SYNC_KEYS.CKE_STRUCK)
      .then((cloudIds) => {
        if (cancelled) return;
        const merged =
          isCloudSyncReady(user.id, CLOUD_SYNC_KEYS.CKE_STRUCK) && Array.isArray(cloudIds)
            ? mergeStruckIds(cloudIds, [])
            : mergeStruckIds(localIds, cloudIds);
        setStruckIds(new Set(merged));
        writeLocalJson(key, merged);
        return saveCloudData(user.id, CLOUD_SYNC_KEYS.CKE_STRUCK, merged).then(() => {
          markCloudSyncReady(user.id, CLOUD_SYNC_KEYS.CKE_STRUCK);
        });
      })
      .catch((error) => {
        console.error("[cloud-sync] cke struck", error);
      });

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const toggleStruck = useCallback(
    (id) => {
      setStruckIds((current) => {
        const next = new Set(current);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        const list = [...next];
        writeLocalJson(struckStorageKey(user?.id), list);
        if (user?.id) {
          saveCloudData(user.id, CLOUD_SYNC_KEYS.CKE_STRUCK, list)
            .then(() => {
              markCloudSyncReady(user.id, CLOUD_SYNC_KEYS.CKE_STRUCK);
            })
            .catch((error) => {
              console.error("[cloud-sync] cke struck save", error);
            });
        }
        return next;
      });
    },
    [user?.id],
  );

  return (
    <div className="min-h-full py-8" style={pageStyle}>
      <div className="mx-auto max-w-4xl space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
            Oficjalne wymagania CKE
          </h1>
          <p className="text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
            Wymagania egzaminacyjne z informatora CKE.
          </p>
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
            Źródło:{" "}
            <a
              href={CKE_SOURCE_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 break-all font-medium text-blue-700 underline decoration-blue-300 underline-offset-2 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200"
            >
              {CKE_SOURCE_URL}
              <ExternalLink className="h-3.5 w-3.5 shrink-0" />
            </a>
          </p>
          <label className="inline-flex cursor-pointer items-center gap-2 pt-1 text-sm font-medium text-slate-600 dark:text-slate-300">
            <input
              type="checkbox"
              checked={onlyUnstruck}
              onChange={(event) => setOnlyUnstruck(event.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            Pokazuj tylko to co nie zostało wykreślone
          </label>
        </div>

        <div className="space-y-6">
          {ckeRequirementSections.map((section, index) => {
            const basicIsList = Array.isArray(section.basic);
            const basicEntries = basicIsList
              ? visibleEntries(section.basic, section.id, "basic", struckIds, onlyUnstruck)
              : [];
            const basicParagraphId = `${section.id}:basic`;
            const showBasicParagraph =
              !basicIsList && (!onlyUnstruck || !struckIds.has(basicParagraphId));
            const extendedIsList = Array.isArray(section.extended);
            const extendedEntries = extendedIsList
              ? visibleEntries(section.extended, section.id, "extended", struckIds, onlyUnstruck)
              : [];
            const extendedParagraphId = `${section.id}:extended`;
            const showExtendedParagraph =
              !extendedIsList &&
              (!onlyUnstruck || !struckIds.has(extendedParagraphId));
            if (
              basicEntries.length === 0 &&
              !showBasicParagraph &&
              extendedEntries.length === 0 &&
              !showExtendedParagraph
            ) {
              return null;
            }

            return (
            <motion.section
              key={section.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: index * 0.04, ease: "easeOut" }}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800"
            >
              <header className="flex items-center gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-700 sm:px-6">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white">
                  {section.number}
                </span>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {section.title}
                </h2>
              </header>

              <div className="space-y-6 px-5 py-5 sm:px-6 sm:py-6">
                {basicEntries.length > 0 || showBasicParagraph ? (
                  <div>
                    <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">
                      {section.basicLead}
                    </p>
                    {basicIsList ? (
                      <RequirementList
                        items={section.basic}
                        sectionId={section.id}
                        scope="basic"
                        struckIds={struckIds}
                        onToggle={toggleStruck}
                        onlyUnstruck={onlyUnstruck}
                      />
                    ) : (
                      <div className="flex items-start gap-3 text-base leading-7 text-slate-700 dark:text-slate-200">
                        <div className="min-w-0 flex-1">
                          <StruckCopy struck={struckIds.has(basicParagraphId)}>
                            <MathText text={section.basic} className="math-text-ui--flow" />
                          </StruckCopy>
                        </div>
                        <StrikeToggle
                          struck={struckIds.has(basicParagraphId)}
                          onToggle={() => toggleStruck(basicParagraphId)}
                        />
                      </div>
                    )}
                  </div>
                ) : null}

                {extendedEntries.length > 0 || showExtendedParagraph ? (
                  <div className="rounded-xl border border-violet-200 bg-violet-50 px-4 py-4 text-base leading-7 text-slate-800 dark:border-violet-900/70 dark:bg-violet-950/30 dark:text-slate-100">
                    {extendedIsList ? (
                      <>
                        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-violet-700 dark:text-violet-300">
                          {section.extendedLead}
                        </p>
                        <RequirementList
                          items={section.extended}
                          sectionId={section.id}
                          scope="extended"
                          struckIds={struckIds}
                          onToggle={toggleStruck}
                          onlyUnstruck={onlyUnstruck}
                        />
                      </>
                    ) : (
                      <div className="flex items-start gap-3">
                        <div className="min-w-0 flex-1">
                          <StruckCopy struck={struckIds.has(extendedParagraphId)}>
                            <MathText text={section.extended} className="math-text-ui--flow" />
                          </StruckCopy>
                        </div>
                        <StrikeToggle
                          struck={struckIds.has(extendedParagraphId)}
                          onToggle={() => toggleStruck(extendedParagraphId)}
                        />
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            </motion.section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
