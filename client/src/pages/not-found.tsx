import { Link } from "wouter";
import { Home, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground">
      <div className="text-center space-y-6 p-8">
        <div className="flex items-center justify-center gap-3">
          <AlertCircle className="h-10 w-10 text-primary" />
          <h1 className="text-4xl font-display font-bold">404</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Page not found
        </p>
        <Link href="/">
          <Button className="bg-primary text-background hover:bg-primary/90">
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
