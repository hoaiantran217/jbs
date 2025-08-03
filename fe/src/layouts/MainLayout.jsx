import { Outlet, Link } from "react-router-dom";
import Header from "../components/Header";
import MobileBottomNavigation from "../components/MobileBottomNavigation";

export default function MainLayout() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 w-full mx-auto flex flex-col">
      <Header />
      <main className="flex-1 mt-16 pb-16 md:pb-0">
        <Outlet />
      </main>   
      <MobileBottomNavigation />
    </div>
  );
} 