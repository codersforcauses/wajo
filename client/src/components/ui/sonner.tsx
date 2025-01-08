import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

/**
 * Toaster component for displaying toast notifications.
 *
 * This component utilizes the `sonner` library to display toast messages. It automatically
 * adapts the theme based on the current theme from `next-themes` and provides custom
 * styling for different toast states.
 *
 * @see {@link https://sonner.emilkowal.ski/} for more details.
 *
 * @component
 * @example
 *   <Toaster />
 *
 * @param {object} [toastOptions] - Options for customizing the toast appearance and behavior.
 * @param {object} [toastOptions.classNames] - Custom class names for the toast notification elements.
 *    - Includes `toast`, `description`, `actionButton`, `cancelButton`, `progressBar`, `toastWrapper`, `closeButton`.
 */
const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
