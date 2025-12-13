// Dynamic language loader for Monaco Editor to optimize bundle sizes

type LanguageFeatureLoader = () => Promise<void>;

interface LanguageConfig {
	name: string;
	loader?: LanguageFeatureLoader;
	extensions: string[];
}

// Language configurations
const languageConfigs: Record<string, LanguageConfig> = {
	typescript: {
		name: 'TypeScript',
		extensions: ['.ts', '.tsx', '.js', '.jsx'],
		loader: async () => {
			await Promise.all([
				// @ts-expect-error - Monaco language modules don't have type definitions
				import('monaco-editor/esm/vs/language/typescript/tsMode'),
			]);
		}
	},
	javascript: {
		name: 'JavaScript',
		extensions: ['.js', '.jsx', '.mjs', '.cjs'],
		loader: async () => {
			// JavaScript is included with TypeScript loader
		}
	},
	json: {
		name: 'JSON',
		extensions: ['.json'],
		loader: async () => {
			// @ts-expect-error - Monaco language modules don't have type definitions
			await import('monaco-editor/esm/vs/language/json/jsonMode');
		}
	},
	css: {
		name: 'CSS',
		extensions: ['.css', '.scss', '.sass', '.less'],
		loader: async () => {
			// @ts-expect-error - Monaco language modules don't have type definitions
			await import('monaco-editor/esm/vs/language/css/cssMode');
		}
	},
	html: {
		name: 'HTML',
		extensions: ['.html', '.htm', '.handlebars', '.razor'],
		loader: async () => {
			// @ts-expect-error - Monaco language modules don't have type definitions
			await import('monaco-editor/esm/vs/language/html/htmlMode');
		}
	}
};

// Loaded languages cache
const loadedLanguages = new Set<string>();

// Load language features dynamically
export const loadLanguageFeatures = async (language: string): Promise<void> => {
	if (loadedLanguages.has(language)) {
		return;
	}

	const config = languageConfigs[language.toLowerCase()];
	if (config?.loader) {
		try {
			await config.loader();
			loadedLanguages.add(language);
			console.log(`Loaded language features for ${config.name}`);
		} catch (error) {
			console.error(`Failed to load language features for ${config.name}:`, error);
		}
	}
};

// Preload common languages
export const preloadCommonLanguages = async () => {
	const commonLanguages = ['typescript', 'javascript', 'json', 'css', 'html'];
	await Promise.all(commonLanguages.map(loadLanguageFeatures));
};

// Get supported languages
export const getSupportedLanguages = (): string[] => {
	return Object.keys(languageConfigs);
};

// Check if language is supported
export const isLanguageSupported = (language: string): boolean => {
	return language.toLowerCase() in languageConfigs;
};