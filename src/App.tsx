import { Outlet } from 'react-router';
import { AuthProvider } from './contexts/auth-context';
import { AppsDataProvider } from './contexts/apps-data-context';
import { AuthModalProvider } from './components/auth/AuthModalProvider';
import { ThemeProvider } from './contexts/theme-context';
import { Toaster } from './components/ui/sonner';
import { AppLayout } from './components/layout/app-layout';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <AppsDataProvider>
            <AuthModalProvider>
              <AppLayout>
                <Outlet />
              </AppLayout>
              <Toaster richColors position="top-right" />
            </AuthModalProvider>
          </AppsDataProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}