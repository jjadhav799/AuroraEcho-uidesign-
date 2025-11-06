// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AppLayout } from "./components/layout/AppLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Engagements from "./pages/Engagements";
import Projects from "./pages/Projects";
import AdminConsole from "./pages/AdminConsole"; // Command Centre (overview)
import CommandCentreUsers from "./pages/CommandCentreUsers";
import CommandCentreProjectConfig from "./pages/CommandCentreProjectConfig";
import CommandCentreUserConfig from "./pages/CommandCentreUserConfig";
import UserInfo from "./pages/UserInfo";
import ProjectConfigDetail from "./pages/ProjectConfigDetail";
import Timelog from "./pages/Timelog";
import TimelogEnhanced from "./pages/TimelogEnhanced";
import Tickets from "./pages/Tickets";
import IAuroraReview from "./pages/IAuroraReview";

import ReviewAnalysis from "./pages/ReviewAnalysis";
import AnalysisReportDetail from "./pages/AnalysisReportDetail";
import Documents from "./pages/Documents";
import DocumentDetail from "./pages/DocumentDetail";
import DocCentral from "./pages/DocCentral";
import Billing from "./pages/Billing";
import Invoices from "./pages/Invoices";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const withShell = (node: React.ReactNode) => (
  <ProtectedRoute>
    <AppLayout>{node}</AppLayout>
  </ProtectedRoute>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Auth */}
          <Route path="/login" element={<Login />} />

          {/* Dashboard */}
          <Route path="/" element={withShell(<Dashboard />)} />

          {/* Core Modules */}
          <Route path="/clients" element={withShell(<Clients />)} />
          <Route path="/engagements" element={withShell(<Engagements />)} />
          <Route path="/projects" element={withShell(<Projects />)} />

          {/* Accounts (formerly Command Centre) */}
          <Route path="/command-centre" element={withShell(<CommandCentreUsers />)} />
          <Route path="/user-info" element={withShell(<UserInfo />)} />

          {/* Back-compat redirect */}
          <Route path="/admin-console" element={<Navigate to="/command-centre" replace />} />

          {/* Case Time Modules */}
          <Route path="/case-time" element={<Navigate to="/case-time/timelog" replace />} />
          <Route path="/case-time/timelog" element={withShell(<TimelogEnhanced />)} />
          <Route path="/case-time/tickets" element={withShell(<Tickets />)} />
          
          {/* Review Modules */}
          <Route path="/iaurora-review" element={withShell(<IAuroraReview />)} />
          
          <Route path="/review/analysis" element={withShell(<ReviewAnalysis />)} />
          <Route path="/review/analysis/:arid" element={withShell(<AnalysisReportDetail />)} />
          
          {/* Documents */}
          <Route path="/documents" element={withShell(<Documents />)} />
          <Route path="/documents/:id" element={withShell(<DocumentDetail />)} />
          
          <Route path="/doc-central" element={withShell(<DocCentral />)} />
          <Route path="/billing" element={withShell(<Billing />)} />
          <Route path="/invoices" element={withShell(<Invoices />)} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
