import { preloadCommonWorkers } from './worker-loader';
import { preloadCommonLanguages } from './language-loader';

import React from 'react';

// Preload commonly used Monaco Editor resources
export const preloadMonacoResources = async () => {
	try {
		await Promise.all([
			preloadCommonWorkers(),
			preloadCommonLanguages()
		]);
		console.log('Monaco Editor resources preloaded successfully');
	} catch (error) {
		console.error('Failed to preload Monaco Editor resources:', error);
	}
};

// React hook for preloading
export const useMonacoPreloader = () => {
	React.useEffect(() => {
		// Preload after a short delay to not block initial page load
		const timer = setTimeout(() => {
			preloadMonacoResources();
		}, 1000);

		return () => clearTimeout(timer);
	}, []);
};