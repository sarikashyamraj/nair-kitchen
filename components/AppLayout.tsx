import Sidebar from "./Sidebar";

type AppLayoutProps = {
  children: React.ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex bg-[#FFFDF8]">
      <Sidebar />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-8 py-10">
          {children}
        </div>
      </main>
    </div>
  );
}