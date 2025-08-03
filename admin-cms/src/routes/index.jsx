import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Users from "../pages/Users";
import Packages from "../pages/Packages";
import Transactions from "../pages/Transactions";
import Investments from "../pages/Investments";
import Maturities from "../pages/Maturities";
import Posts from "../pages/Posts";
import Notifications from "../pages/Notifications";
import Reviews from "../pages/Reviews";
import Layout from "../components/Layout";
import Deposits from "../pages/Deposits";
import Withdrawals from "../pages/Withdrawals";
import CreateAdmin from "../pages/CreateAdmin";
import DatabaseManagement from "../pages/DatabaseManagement";
import BankInfo from "../pages/BankInfo";
import TeamMembers from "../pages/TeamMembers";
import InvestmentData from "../pages/InvestmentData";
import IdentityVerifications from "../pages/IdentityVerifications";
import WithdrawalNotifications from "../pages/WithdrawalNotifications";
import TransactionNotifications from "../pages/TransactionNotifications";
import SecuritySettings from "../pages/SecuritySettings";
import ReferralTransactions from "../pages/ReferralTransactions";
import Promotions from "../pages/Promotions";

export default function AppRoutes() {
  const isAuth = !!localStorage.getItem("token");
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={isAuth ? <Layout><Dashboard /></Layout> : <Navigate to="/login" />}
        />
        <Route
          path="/users"
          element={isAuth ? <Layout><Users /></Layout> : <Navigate to="/login" />}
        />
        <Route
          path="/packages"
          element={isAuth ? <Layout><Packages /></Layout> : <Navigate to="/login" />}
        />
        <Route
          path="/transactions"
          element={isAuth ? <Layout><Transactions /></Layout> : <Navigate to="/login" />}
        />
        <Route
          path="/investments"
          element={isAuth ? <Layout><Investments /></Layout> : <Navigate to="/login" />}
        />
        <Route
          path="/maturities"
          element={isAuth ? <Layout><Maturities /></Layout> : <Navigate to="/login" />}
        />
        <Route
          path="/posts"
          element={isAuth ? <Layout><Posts /></Layout> : <Navigate to="/login" />}
        />
        <Route
          path="/notifications"
          element={isAuth ? <Layout><Notifications /></Layout> : <Navigate to="/login" />}
        />
        <Route
          path="/reviews"
          element={isAuth ? <Layout><Reviews /></Layout> : <Navigate to="/login" />}
        />
        <Route
          path="/deposits"
          element={isAuth ? <Layout><Deposits /></Layout> : <Navigate to="/login" />}
        />
        <Route
          path="/withdrawals"
          element={isAuth ? <Layout><Withdrawals /></Layout> : <Navigate to="/login" />}
        />
        <Route
          path="/zuna"
          element={isAuth ? <Layout><DatabaseManagement /></Layout> : <Navigate to="/login" />}
        />
        <Route
          path="/create-admin"
          element={isAuth ? <Layout><CreateAdmin /></Layout> : <Navigate to="/login" />}
        />
        <Route
          path="/bank-info"
          element={isAuth ? <Layout><BankInfo /></Layout> : <Navigate to="/login" />}
        />
        <Route
          path="/team-members"
          element={isAuth ? <Layout><TeamMembers /></Layout> : <Navigate to="/login" />}
        />
        <Route
          path="/investment-data"
          element={isAuth ? <Layout><InvestmentData /></Layout> : <Navigate to="/login" />}
        />
        <Route
          path="/identity-verifications"
          element={isAuth ? <Layout><IdentityVerifications /></Layout> : <Navigate to="/login" />}
        />
        <Route
          path="/withdrawal-notifications"
          element={isAuth ? <Layout><WithdrawalNotifications /></Layout> : <Navigate to="/login" />}
        />
        <Route
          path="/transaction-notifications"
          element={isAuth ? <Layout><TransactionNotifications /></Layout> : <Navigate to="/login" />}
        />
        <Route
          path="/security-settings"
          element={isAuth ? <Layout><SecuritySettings /></Layout> : <Navigate to="/login" />}
        />
        <Route
          path="/referral-transactions"
          element={isAuth ? <Layout><ReferralTransactions /></Layout> : <Navigate to="/login" />}
        />
        <Route
          path="/promotions"
          element={isAuth ? <Layout><Promotions /></Layout> : <Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
} 