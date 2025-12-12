import React, { useContext } from 'react';

interface AuthModalContextType {
  showAuthModal: (context?: string, onSuccess?: () => void, intendedUrl?: string) => void;
  hideAuthModal: () => void;
  isAuthModalOpen: boolean;
}

export const AuthModalContext = React.createContext<AuthModalContextType | undefined>(undefined);

export function useAuthModal(): AuthModalContextType {
  const context = useContext(AuthModalContext);
  if (context === undefined) {
    throw new Error('useAuthModal must be used within an AuthModalProvider');
  }
  return context;
}

// Export type for external use
export type { AuthModalContextType };