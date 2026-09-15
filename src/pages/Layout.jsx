
import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { createPageUrl } from "@/utils";
import { 
  FileText, Users, User, Layers,
  Menu, X, BookOpen, Calculator, LogOut,
  ChevronRight, Heart, Info, Plus, ScrollText, ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from "@/contexts/ThemeContext";
import { PageActionsProvider } from "@/contexts/PageActionsContext";
import PdfFloatingPanel from "@/components/PdfFloatingPanel";
import { getLayoutNotebookThemeKey, getNotebookPageStyle, shouldShowNotebookBackground } from "@/utils/notebook-page-style";
import { getMathReferenceSheetUrl } from "@/utils/math-cards";
import { supabase } from "@/supabase-config";
import { isCommunityAdmin } from "@/utils/community-admin";

const topNavigationItems = [
  { title: "Powtórki", url: createPageUrl("Review"), icon: BookOpen },
  { title: "Arkusze", url: createPageUrl("Worksheets"), icon: FileText },
];

const visibleTopNavigationItems = topNavigationItems.filter((item) => item.visible !== false);

const drawerNavigationItems = [
  { title: "Zbiory zadań", url: createPageUrl("TaskSets"), icon: Layers },
  { title: "Kursy i dydaktyka", url: createPageUrl("Course"), icon: BookOpen },
  { title: "Ulubione", url: createPageUrl("Favorites"), icon: Heart },
  { title: "Społeczność", url: createPageUrl("Community"), icon: Users },
  { title: "O nas", url: createPageUrl("About"), icon: Info },
];

const fabQuickActions = [
  { title: "Tablice matematyczne", icon: ScrollText, action: "math-cards" },
  { title: "Kalkulator", icon: Calculator, action: "calculator" },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const { isDark } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showMathCards, setShowMathCards] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const scrollAcc = React.useRef(0);
  const lastY = React.useRef(window.scrollY);

  // lock body scroll when menu open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [menuOpen]);

  useEffect(() => {
    setFabOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      const diff = current - lastY.current;
      if (diff > 0) {
        // scrolling down
        scrollAcc.current += diff;
        if (scrollAcc.current >= 300) {
          setNavHidden(true);
        }
      } else if (diff < 0) {
        // scrolling up
        scrollAcc.current = 0;
        setNavHidden(false);
      }
      lastY.current = current;
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const { user, logout } = useAuth();

  useEffect(() => {
    let cancelled = false;
    isCommunityAdmin(supabase, user?.id).then((allowed) => {
      if (!cancelled) setIsAdmin(allowed);
    });
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const profileDisplayName =
    user?.user_metadata?.full_name ||
    [user?.user_metadata?.first_name, user?.user_metadata?.last_name]
      .filter(Boolean)
      .join(" ")
      .trim() ||
    user?.full_name ||
    "gość";
  const profileSecondaryText = user?.email || "Niezalogowany";

  const showFooter = currentPageName === "Home";
  const showFab =
    currentPageName === "WorksheetDetails" ||
    currentPageName === "TaskDetails" ||
    currentPageName === "ReviewSession" ||
    currentPageName === "ArticleView";
  const visibleDrawerNavigationItems = isAdmin
    ? [
        ...drawerNavigationItems,
        {
          title: "Moderacja",
          url: createPageUrl("CommunityModeration"),
          icon: ShieldCheck,
        },
      ]
    : drawerNavigationItems;

  const handleLogout = () => logout();

  const handleFabAction = (item) => {
    if (item.action === "calculator") {
      setShowCalculator(true);
    }
    if (item.action === "math-cards") {
      setShowMathCards(true);
    }
    setFabOpen(false);
  };

  const showNotebookBackground = shouldShowNotebookBackground(currentPageName);
  const notebookThemeKey = useMemo(() => getLayoutNotebookThemeKey(), []);
  const mainStyle = showNotebookBackground
    ? getNotebookPageStyle(isDark, notebookThemeKey)
    : undefined;
  const mainClassName = showNotebookBackground
    ? "min-h-[calc(100vh-4rem)]"
    : `min-h-[calc(100vh-4rem)] ${isDark ? "bg-slate-900" : "bg-gray-50"}`;

  return (
    <div className="min-h-screen">
      <style>{`
        :root {
          --primary: ${isDark ? "217 91% 60%" : "221 83% 53%"};
          --primary-dark: ${isDark ? "224 76% 48%" : "224 76% 48%"};
          --primary-foreground: ${isDark ? "222 47% 11%" : "210 40% 98%"};
          --background: ${isDark ? "222 47% 11%" : "210 20% 98%"};
          --card: ${isDark ? "217 33% 17%" : "0 0% 100%"};
          --text: ${isDark ? "210 40% 98%" : "222 47% 11%"};
          --text-muted: ${isDark ? "215 16% 65%" : "215 14% 47%"};
        }
        
        /* Hide scrollbars for Chrome, Safari and Opera */
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        /* Hide scrollbar for IE, Edge and Firefox */
        .hide-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>

      {/* Top Bar */}
      <nav className={`sticky top-0 z-50 ${isDark ? "bg-slate-800/95" : "bg-white/95"} backdrop-blur-sm border-b ${isDark ? "border-slate-700" : "border-gray-200"} transition-all duration-300 transform ${navHidden ? "-translate-y-full" : "translate-y-0"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to={createPageUrl("Home")} className="flex items-center gap-2 group">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span
                className={`hidden text-xl font-extrabold tracking-tight sm:inline ${isDark ? "text-white" : "text-slate-900"}`}
              >
                <span className="text-blue-600 dark:text-blue-400">M</span>auka
              </span>
            </Link>

            {/* Top Navigation Items */}
            <div className="flex items-center gap-2">
              {visibleTopNavigationItems.map((item) => {
                const isActive =
                  location.pathname === item.url ||
                  (item.url === createPageUrl("Review") &&
                    currentPageName === "ReviewSession") ||
                  (item.url === createPageUrl("Course") &&
                    (currentPageName === "CourseOverview" ||
                      currentPageName === "ArticleView"));
                return (
                  <Link
                    key={item.title}
                    to={item.url}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 font-medium text-sm ${
                      isActive
                        ? "bg-blue-500 text-white shadow-md"
                        : isDark
                        ? "text-slate-300 hover:bg-slate-700 hover:text-white"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="hidden md:inline">{item.title}</span>
                  </Link>
                );
              })}
              {!user && (
                <Link to={createPageUrl('Login')} className={`px-3 py-2 text-sm font-medium rounded-lg ${isDark ? 'text-slate-300 hover:bg-slate-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100'}`}>Zaloguj</Link>
              )}

              {/* Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMenuOpen(!menuOpen)}
                className={`ml-2 ${isDark ? "text-slate-300 hover:text-white hover:bg-slate-700" : "hover:bg-gray-100"}`}
              >
                <Menu className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Overlay */}
      {menuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Side Menu Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] ${isDark ? "bg-slate-800" : "bg-white"} shadow-2xl z-50 transform transition-transform duration-300 ease-in-out overflow-hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full min-h-0 flex-col">
          {/* Header */}
          <div className={`flex-shrink-0 flex items-center justify-between p-4 border-b ${isDark ? "border-slate-700" : "border-gray-200"}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <Menu className="w-5 h-5 text-white" />
              </div>
              <h2 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                Menu
              </h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMenuOpen(false)}
              className={`${isDark ? "text-slate-300 hover:text-white hover:bg-slate-700" : "hover:bg-gray-100"}`}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div
            className={`sticky top-0 z-10 shrink-0 border-b p-4 ${
              isDark
                ? "border-slate-700 bg-slate-800"
                : "border-gray-200 bg-white"
            }`}
          >
            <Link
              to={createPageUrl("Profile")}
              onClick={() => setMenuOpen(false)}
              className={`group flex items-center gap-3 rounded-xl border p-3 transition-colors duration-200 ${
                location.pathname === createPageUrl("Profile")
                  ? "border-blue-400 bg-blue-500/15 ring-1 ring-blue-400/40"
                  : isDark
                    ? "border-slate-600 bg-slate-700/50 hover:border-slate-500 hover:bg-slate-700"
                    : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100"
              }`}
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-purple-600 shadow-lg">
                <User className="h-6 w-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className={`truncate text-sm font-semibold ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  {profileDisplayName}
                </p>
                <p
                  className={`truncate text-xs ${
                    isDark ? "text-slate-400" : "text-gray-600"
                  }`}
                >
                  {profileSecondaryText}
                </p>
              </div>
              <ChevronRight
                className={`h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 ${
                  location.pathname === createPageUrl("Profile")
                    ? isDark
                      ? "text-blue-300"
                      : "text-blue-600"
                    : isDark
                      ? "text-slate-500"
                      : "text-gray-400"
                }`}
              />
            </Link>
          </div>

          <div className="min-h-0 flex-1 space-y-1 overflow-y-auto hide-scrollbar px-3 py-4">
            <nav className="space-y-1">
              {visibleDrawerNavigationItems.map((item) => {
                const isActive =
                  location.pathname === item.url ||
                  (item.url === createPageUrl("Review") &&
                    currentPageName === "ReviewSession") ||
                  (item.url === createPageUrl("Course") &&
                    (currentPageName === "CourseOverview" ||
                      currentPageName === "ArticleView"));
                return (
                  <Link
                    key={item.title}
                    to={item.url}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                      isActive
                        ? "bg-blue-500 text-white shadow-md"
                        : isDark
                        ? "text-slate-300 hover:bg-slate-700 hover:text-white"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span className="flex-1 font-medium text-sm">{item.title}</span>
                    <ChevronRight className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:translate-x-1 ${isActive ? "opacity-100" : "opacity-0"}`} />
                  </Link>
                );
              })}
            </nav>

          </div>

          {user && (
            <div
              className={`sticky bottom-0 z-10 mt-auto shrink-0 border-t p-4 ${
                isDark
                  ? "border-slate-700 bg-slate-800"
                  : "border-gray-200 bg-white"
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className={`flex w-full items-center gap-3 rounded-xl border p-3 transition-colors duration-200 ${
                  isDark
                    ? "border-rose-900/60 bg-rose-950/30 text-rose-400 hover:bg-rose-950/50 hover:text-rose-300"
                    : "border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700"
                }`}
              >
                <LogOut className="h-5 w-5 shrink-0" />
                <span className="flex-1 text-left text-sm font-semibold">
                  Wyloguj się
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      <PdfFloatingPanel
        open={showMathCards}
        onClose={() => setShowMathCards(false)}
        title="Tablice matematyczne"
        iframeSrc={getMathReferenceSheetUrl()}
        iframeTitle="Tablice matematyczne"
        emptyMessage="Nie znaleziono pliku z tablicami matematycznymi."
        emptyHint="Plik tablice_matematyczne.pdf powinien być w buckecie karty w Supabase Storage."
      />

      <PdfFloatingPanel
        open={showCalculator}
        onClose={() => setShowCalculator(false)}
        title="Kalkulator"
        iframeSrc="https://www.desmos.com/calculator"
        iframeTitle="Kalkulator"
        iframeKey="desmos-calculator"
      />

      {/* Main Content */}
      <PageActionsProvider>
        <main className={mainClassName} style={mainStyle}>
          {children}
        </main>
      </PageActionsProvider>

      {showFab ? (
        <>
      <AnimatePresence>
        {fabOpen ? (
          <motion.button
            type="button"
            aria-label="Zamknij menu szybkich akcji"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-30 bg-transparent"
            onClick={() => setFabOpen(false)}
          />
        ) : null}
      </AnimatePresence>

      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
        <AnimatePresence>
          {fabOpen
            ? fabQuickActions.map((item, index) => {
                const actionButtonClass = `grid h-9 w-9 place-items-center rounded-full shadow-md transition-colors ${
                  isDark
                    ? "bg-slate-700 text-white hover:bg-slate-600"
                    : "bg-white text-slate-700 hover:bg-slate-50"
                }`;

                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 10, scale: 0.92 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.92 }}
                    transition={{ duration: 0.18, delay: index * 0.04 }}
                    className="mr-1 flex items-center gap-2"
                  >
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium shadow-sm ${
                        isDark
                          ? "bg-slate-800 text-slate-200"
                          : "bg-white text-slate-700"
                      }`}
                    >
                      {item.title}
                    </span>
                    {item.url ? (
                      <Link
                        to={item.url}
                        aria-label={item.title}
                        className={actionButtonClass}
                        onClick={() => setFabOpen(false)}
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                      </Link>
                    ) : (
                      <button
                        type="button"
                        aria-label={item.title}
                        className={actionButtonClass}
                        onClick={() => handleFabAction(item)}
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                      </button>
                    )}
                  </motion.div>
                );
              })
            : null}
        </AnimatePresence>

        <button
          type="button"
          aria-label={fabOpen ? "Zamknij" : "Szybkie akcje"}
          aria-expanded={fabOpen}
          onClick={() => setFabOpen((open) => !open)}
          className={`grid h-11 w-11 place-items-center rounded-full p-0 shadow-lg transition-all hover:scale-105 active:scale-95 ${
            fabOpen ? "rotate-45" : "rotate-0"
          } ${
            isDark
              ? "bg-blue-600 text-white hover:bg-blue-500"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          <Plus className="h-[22px] w-[22px] shrink-0 stroke-[2.5]" aria-hidden="true" />
        </button>
      </div>
        </>
      ) : null}

      {/* Footer */}
      {showFooter && (
        <footer className={`${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"} border-t`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center shadow-lg">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <span className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                  <span className="text-blue-600 dark:text-blue-400">M</span>auka
                </span>
              </div>
              <p className={`text-sm ${isDark ? "text-slate-400" : "text-gray-600"}`}>
                © 2024 Mauka. Matematyka może być prosta.
              </p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
