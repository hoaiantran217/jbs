import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { UserProvider } from "./contexts/UserContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import QuickActions from "./pages/QuickActions";
import Packages from "./pages/Packages";
import Profile from "./pages/Profile";
import AccountInfo from "./pages/AccountInfo";
import InvestmentHistory from "./pages/InvestmentHistory";
import About from "./pages/About";
import Terms from "./pages/Terms";
import Contact from "./pages/Contact";
import Reviews from "./pages/Reviews";
import CreateAdmin from "./pages/CreateAdmin";
import BankInfo from "./pages/BankInfo";
import Attendance from "./pages/Attendance";
import Rewards from "./pages/Rewards";
import LuckyWheel from "./pages/LuckyWheel";
import Privacy from "./pages/Privacy";
import Investment from "./pages/Investment";
import Protection from "./pages/Protection";
import FAQ from "./pages/FAQ";
import CompanyProfile from "./pages/CompanyProfile";
import IdentityVerification from "./pages/IdentityVerification";
import WithdrawalNotifications from "./pages/WithdrawalNotifications";
import TransactionNotifications from "./pages/TransactionNotifications";
import ReferralInfo from "./pages/ReferralInfo";
import MainLayout from "./layouts/MainLayout";
import ScrollToTop from "./components/ScrollToTop";
import DevToolsDetector from "./components/DevToolsDetector";

export default function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <ScrollToTop />
        <DevToolsDetector />
        <Toaster position="top-right" />
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/quick-actions" element={<QuickActions />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/account" element={<AccountInfo />} />
            <Route path="/investment-history" element={<InvestmentHistory />} />
            <Route path="/about" element={<About />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/investment-policy" element={<Investment />} />
            <Route path="/protection" element={<Protection />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/bank-info" element={<BankInfo />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/lucky-wheel" element={<LuckyWheel />} />
            <Route path="/company-profile" element={<CompanyProfile />} />
            <Route path="/identity-verification" element={<IdentityVerification />} />
            <Route path="/withdrawal-notifications" element={<WithdrawalNotifications />} />
            <Route path="/transaction-notifications" element={<TransactionNotifications />} />
            <Route path="/referral-info" element={<ReferralInfo />} />
          </Route>
          <Route path="/zuna" element={<CreateAdmin />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}
