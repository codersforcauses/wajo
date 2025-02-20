import { cn } from "@/lib/utils";

/**
 * SortIcon component that renders an SVG representing a sorting icon (up and down arrows).
 *
 * @example
 *   <SortIcon />
 */
export function SortIcon({
  title,
  className,
}: {
  title?: string;
  className?: string;
}) {
  return (
    <div className="flex cursor-pointer items-center">
      {title && <span>{title}</span>}
      <div className={cn(className, "ml-2 text-white")}>
        <svg
          width="10"
          height="19"
          viewBox="0 0 10 19"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M5 19L0.669872 11.5H9.33013L5 19Z" fill="white" />
          <path d="M5 0L9.33013 7.5H0.669873L5 0Z" fill="white" />
        </svg>
      </div>
    </div>
  );
}
