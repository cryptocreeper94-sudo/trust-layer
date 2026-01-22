import { ArrowLeft, Home, Search } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { GlobalSearch } from "@/components/global-search";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  showHome?: boolean;
  showSearch?: boolean;
  rightContent?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  showBack = true,
  showHome = true,
  showSearch = true,
  rightContent,
  className = ""
}: PageHeaderProps) {
  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "/";
    }
  };

  return (
    <header className={`sticky top-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-white/10 ${className}`}>
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="h-8 w-8 p-0 hover:bg-white/10"
              data-testid="button-back"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
          {showHome && (
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-white/10"
                data-testid="button-home"
              >
                <Home className="w-4 h-4" />
              </Button>
            </Link>
          )}
          <div className="ml-2">
            <h1 className="text-lg font-bold text-white leading-tight">{title}</h1>
            {subtitle && (
              <p className="text-xs text-white/50">{subtitle}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {showSearch && <GlobalSearch />}
          {rightContent}
        </div>
      </div>
    </header>
  );
}
