interface AdminLayoutProps {
  children: React.ReactNode;
}

// Layout wrapper — sidebar & header sudah diurus di app/admin/layout.tsx
export default function AdminLayout({ children }: AdminLayoutProps) {
  return <>{children}</>;
}