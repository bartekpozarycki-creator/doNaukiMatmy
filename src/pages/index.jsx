import Layout from "./Layout.jsx";

import Home from "./Home";

import Worksheets from "./Worksheets";
import TaskSets from "./TaskSets";
import ExamCollection from "./ExamCollection";
import ExamTopicTasks from "./ExamTopicTasks";

import DailyChallenge from "./DailyChallenge";

import Review from "./Review";

import Community from "./Community";
import CommunityModeration from "./CommunityModeration";

import Profile from "./Profile";

import WorksheetDetails from "./WorksheetDetails";

import Dashboard from "./Dashboard";

import QuestionDetails from "./QuestionDetails";

import Course from "./Course";
import CourseOverview from "./CourseOverview";
import ArticleView from "./ArticleView";

import QuizView from "./QuizView";
import LessonView from "./LessonView";
import Login from "./Login";
import Flashcards from "./Flashcards";
import Unfinished from "./Unfinished";
import MicroReview from "./MicroReview";
import MicroTopic from "./MicroTopic";
import QuickMath from "./QuickMath";
import PotegiMemory from "./PotegiMemory";
import TaskDetails from "./TaskDetails";
import Favorites from "./Favorites";
import ReviewSession from "./ReviewSession";

import {
    createBrowserRouter,
    Navigate,
    Outlet,
    RouterProvider,
    useLocation,
    useNavigate,
    useSearchParams,
} from 'react-router-dom';
import { useEffect, useRef } from "react";

function WorksheetDetailsRedirect() {
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const query = id ? `?id=${encodeURIComponent(id)}` : "";
    return <Navigate to={`/Egzamin${query}`} replace />;
}

const PAGES = {
    
    Home: Home,
    
    Worksheets: Worksheets,
    TaskSets: TaskSets,
    ExamCollection: ExamCollection,
    ExamTopicTasks: ExamTopicTasks,
    
    DailyChallenge: DailyChallenge,
    
    Review: Review,
    
    Community: Community,
    CommunityModeration: CommunityModeration,
    
    Profile: Profile,
    
    WorksheetDetails: WorksheetDetails,
    
    Dashboard: Dashboard,
    
    QuestionDetails: QuestionDetails,
    Course: Course,
    CourseOverview: CourseOverview,
    ArticleView: ArticleView,

    QuizView: QuizView,
    
    Login: Login,
    
    Flashcards: Flashcards,
    Unfinished: Unfinished,
    MicroReview: MicroReview,
    MicroTopic: MicroTopic,
    PotegiMemory: PotegiMemory,
    QuickMath: QuickMath,
    TaskDetails: TaskDetails,
    ReviewSession: ReviewSession,

    Favorites: Favorites,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    if (urlLastPart === "Arkusze") return "Worksheets";
    if (urlLastPart === "Egzamin") return "WorksheetDetails";
    if (urlLastPart === "Kursy-i-dydaktyka") return "Course";
    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

function AppLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const locationRef = useRef(location);
    locationRef.current = location;
    const currentPage = _getCurrentPage(location.pathname);

    useEffect(() => {
        const onPopState = () => {
            requestAnimationFrame(() => {
                const browserPath =
                    `${window.location.pathname}${window.location.search}${window.location.hash}`;
                const routerPath =
                    `${locationRef.current.pathname}${locationRef.current.search}${locationRef.current.hash}`;
                if (browserPath !== routerPath) {
                    navigate(browserPath);
                }
            });
        };
        window.addEventListener("popstate", onPopState);
        return () => window.removeEventListener("popstate", onPopState);
    }, [navigate]);

    return (
        <Layout currentPageName={currentPage}>
            <Outlet key={`${location.pathname}${location.search}`} />
        </Layout>
    );
}

const router = createBrowserRouter([
    {
        element: <AppLayout />,
        children: [
            { path: "/", element: <Home /> },
            { path: "/Home", element: <Home /> },
            { path: "/Arkusze", element: <Worksheets /> },
            { path: "/Worksheets", element: <Navigate to="/Arkusze" replace /> },
            { path: "/worksheets", element: <Navigate to="/Arkusze" replace /> },
            { path: "/ExamCollection", element: <ExamCollection /> },
            { path: "/ZbiorDoEgzaminu", element: <ExamCollection /> },
            { path: "/ExamTopicTasks", element: <ExamTopicTasks /> },
            { path: "/ZadaniaZArkuszy", element: <ExamTopicTasks /> },
            { path: "/DailyChallenge", element: <DailyChallenge /> },
            { path: "/Review", element: <Review /> },
            { path: "/Progress", element: <Navigate to="/" replace /> },
            { path: "/Community", element: <Community /> },
            { path: "/CommunityModeration", element: <CommunityModeration /> },
            { path: "/Profile", element: <Profile /> },
            { path: "/Egzamin", element: <WorksheetDetails /> },
            { path: "/Arkusz", element: <WorksheetDetailsRedirect /> },
            { path: "/WorksheetDetails", element: <WorksheetDetailsRedirect /> },
            { path: "/worksheetdetails", element: <WorksheetDetailsRedirect /> },
            { path: "/Dashboard", element: <Dashboard /> },
            { path: "/QuestionDetails", element: <QuestionDetails /> },
            { path: "/Kursy-i-dydaktyka", element: <Course /> },
            { path: "/Course", element: <Navigate to="/Kursy-i-dydaktyka" replace /> },
            { path: "/Kursy", element: <Navigate to="/Kursy-i-dydaktyka" replace /> },
            { path: "/CourseOverview", element: <CourseOverview /> },
            { path: "/course-overview", element: <CourseOverview /> },
            { path: "/ArticleView", element: <ArticleView /> },
            { path: "/LessonView", element: <LessonView /> },
            { path: "/QuizView", element: <Navigate to="/" replace /> },
            { path: "/Flashcards", element: <Navigate to="/" replace /> },
            { path: "/Unfinished", element: <Unfinished /> },
            { path: "/MicroReview", element: <Navigate to="/" replace /> },
            { path: "/MicroTopic", element: <Navigate to="/" replace /> },
            { path: "/TaskSets", element: <TaskSets /> },
            { path: "/TaskDetails", element: <TaskDetails /> },
            { path: "/ReviewSession", element: <ReviewSession /> },
            { path: "/Favorites", element: <Favorites /> },
            { path: "/PotegiMemory", element: <PotegiMemory /> },
            { path: "/QuickMath", element: <QuickMath /> },
            { path: "/Login", element: <Login /> },
            { path: "/About", element: <Navigate to="/" replace /> },
            { path: "/O-nas", element: <Navigate to="/" replace /> },
        ],
    },
]);

export default function Pages() {
    return <RouterProvider router={router} />;
}