// Dynamic worker loader for Monaco Editor to optimize bundle sizes
interface WorkerLoader {
	(): Worker;
}

interface WorkerConfig {
	json: WorkerLoader;
	css: WorkerLoader;
	html: WorkerLoader;
	ts: WorkerLoader;
	editor: WorkerLoader;
}

// Lazy-loaded worker instances
const workerCache = new Map<string, Worker>();

// Dynamic import functions for workers
const loadWorkers = async (): Promise<WorkerConfig> => {
	const [
		editorWorker,
		jsonWorker,
		cssWorker,
		htmlWorker,
		tsWorker
	] = await Promise.all([
		import('monaco-editor/esm/vs/editor/editor.worker?worker'),
		import('monaco-editor/esm/vs/language/json/json.worker?worker'),
		import('monaco-editor/esm/vs/language/css/css.worker?worker'),
		import('monaco-editor/esm/vs/language/html/html.worker?worker'),
		import('monaco-editor/esm/vs/language/typescript/ts.worker?worker')
	]);

	return {
		editor: () => new editorWorker.default(),
		json: () => new jsonWorker.default(),
		css: () => new cssWorker.default(),
		html: () => new htmlWorker.default(),
		ts: () => new tsWorker.default()
	};
};

// Worker factory with caching
export const getWorker = async (moduleId: string, label: string): Promise<Worker> => {
	const cacheKey = `${moduleId}-${label}`;

	if (workerCache.has(cacheKey)) {
		return workerCache.get(cacheKey)!;
	}

	const workers = await loadWorkers();
	let worker: Worker;

	switch (label) {
		case 'json':
			worker = workers.json();
			break;
		case 'css':
		case 'scss':
		case 'less':
			worker = workers.css();
			break;
		case 'html':
		case 'handlebars':
		case 'razor':
			worker = workers.html();
			break;
		case 'typescript':
		case 'javascript':
		case 'typescriptreact':
		case 'javascriptreact':
			worker = workers.ts();
			break;
		default:
			worker = workers.editor();
			break;
	}

	workerCache.set(cacheKey, worker);
	return worker;
};

// Preload commonly used workers
export const preloadCommonWorkers = async () => {
	const commonLanguages = ['json', 'css', 'html', 'typescript'];
	await Promise.all(commonLanguages.map(lang => getWorker('', lang)));
};

// Cleanup function for testing
export const clearWorkerCache = () => {
	workerCache.forEach(worker => worker.terminate());
	workerCache.clear();
};