import { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

export default function AdminLayout({ children, title, description }: AdminLayoutProps) {
  return (
    <div className="space-y-6 p-6 w-full max-w-none">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-lg text-muted-foreground mt-2">{description}</p>}
      </div>
      <div className="border rounded-md p-6 bg-card w-full">
        {children}
      </div>
    </div>
  );
}