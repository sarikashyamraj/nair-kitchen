import Sidebar from "./Sidebar";
import TopHeader from "./layout/TopHeader";
type AppLayoutProps = {
  children: React.ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex bg-[#FFFDF8]">
      <Sidebar />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto p-8">
    <TopHeader />

    {children}
</div>
      </main>
    </div>
  );
}