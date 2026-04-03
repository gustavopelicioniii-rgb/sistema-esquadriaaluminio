import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Topbar } from "@/components/Topbar";
import { AnimatedOutlet } from "@/components/AnimatedOutlet";
import { BottomNav } from "@/components/BottomNav";
import { Outlet } from "react-router-dom";

interface AppLayoutProps {
  children?: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full app-bg">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar />
          <main className="flex-1 p-3 sm:p-6 pb-20 sm:pb-6 overflow-auto">
            <AnimatedOutlet />
          </main>
        </div>
        <BottomNav />
      </div>
    </SidebarProvider>
  );
}
