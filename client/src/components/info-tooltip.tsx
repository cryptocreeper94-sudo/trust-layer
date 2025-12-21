import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface InfoTooltipProps {
  content: string;
  className?: string;
  side?: "top" | "right" | "bottom" | "left";
  iconSize?: "sm" | "md" | "lg";
  label?: string;
}

export function InfoTooltip({ content, className, side = "top", iconSize = "sm", label }: InfoTooltipProps) {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5"
  };

  const accessibleLabel = label || "More information";
  const testId = label ? `button-info-${label.toLowerCase().replace(/\s+/g, '-')}` : "button-info-tooltip";

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button 
            type="button"
            aria-label={accessibleLabel}
            className={cn(
              "inline-flex items-center justify-center rounded-full p-0.5 text-white/40 hover:text-primary hover:bg-primary/10 transition-colors cursor-help",
              className
            )}
            data-testid={testId}
          >
            <Info className={sizeClasses[iconSize]} />
            <span className="sr-only">{accessibleLabel}</span>
          </button>
        </TooltipTrigger>
        <TooltipContent 
          side={side} 
          className="max-w-[250px] bg-[#0c1224] border border-white/10 text-white/80 text-[11px] leading-relaxed"
        >
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
