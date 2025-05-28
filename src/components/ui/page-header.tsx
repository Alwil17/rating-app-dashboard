import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    onClick: () => void;
    show?: boolean;
  };
}

export function PageHeader({ title, subtitle, action }: Readonly<PageHeaderProps>) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {action && action.show !== false && (
        <Button onClick={action.onClick}>{action.label}</Button>
      )}
    </div>
  );
}
