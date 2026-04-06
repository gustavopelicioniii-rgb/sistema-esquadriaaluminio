import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Topbar } from "@/components/Topbar";
import { AnimatedOutlet } from "@/components/AnimatedOutlet";
import { BottomNav } from "@/components/BottomNav";
import { useSwipeNavigation } from "@/hooks/use-swipe-navigation";
import { AiChatButton } from "@/components/ai/AiChatButton";

export function AppLayout() {
  const { onTouchStart, onTouchEnd } = useSwipeNavigation();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full app-bg">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar />
          <main
            className="flex-1 p-3 sm:p-6 pb-20 sm:pb-6 overflow-auto"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <AnimatedOutlet />
          </main>
        </div>
        <BottomNav />
        <AiChatButton />
      </div>
    </SidebarProvider>
  );
}
