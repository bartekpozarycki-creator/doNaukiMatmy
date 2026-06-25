import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createPageUrl } from "@/utils";

const propType = () => null;

export default function LoginRequiredDialog({
  open,
  onOpenChange,
  title = "Zaloguj się",
  description = "Musisz się zalogować, aby skorzystać z tej funkcji.",
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white dark:bg-slate-800">
        <DialogHeader>
          <DialogTitle className="text-slate-900 dark:text-white">
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-slate-300">
            {description}
          </p>
          <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Anuluj
            </Button>
            <Link to={createPageUrl("Login")}>
              <Button className="bg-blue-600 text-white hover:bg-blue-700">
                Przejdź do logowania
              </Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

LoginRequiredDialog.propTypes = {
  open: propType,
  onOpenChange: propType,
  title: propType,
  description: propType,
};
