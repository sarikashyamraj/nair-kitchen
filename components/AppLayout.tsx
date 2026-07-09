import Sidebar from "./Sidebar";
import MobileMenu from "./layout/MobileMenu";
import TopHeader from "./layout/TopHeader";

type AppLayoutProps = {
  children: React.ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-[#FFFDF8]">
      <div className="flex">
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        <main className="flex-1 min-w-0">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 sm:py-6 lg:p-8">
            <MobileMenu />

<TopHeader />

{children}
          </div>
        </main>
      </div>
    </div>
  );
}