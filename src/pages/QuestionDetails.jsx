import { Navigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function QuestionDetailsPage() {
  return <Navigate to={createPageUrl("Community")} replace />;
}
