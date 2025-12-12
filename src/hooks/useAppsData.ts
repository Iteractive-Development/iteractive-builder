import { useContext } from 'react';
import { AppsDataContext } from '../contexts/apps-data-context';

export function useAppsData() {
  const context = useContext(AppsDataContext);
  if (!context) {
    throw new Error('useAppsData must be used within an AppsDataProvider');
  }
  return context;
}