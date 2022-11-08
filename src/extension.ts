// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { TextDecoder } from 'util';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function getValue(obj: any, key: string, firstOnly: boolean = true): string[] {
	const result: string[] = [];
	const keyChain = key.split('.');
	for (let i = 0; i < keyChain.length; i++) {
		const key = keyChain[i];
		if (obj.hasOwnProperty(key) &&
			(typeof obj[key] === "object")) {
			getValue(obj[key], keyChain.splice(1).join('.'), firstOnly).map(r => result.push(r));
		} else {
			const res = Object.entries(obj).find((e: any) => e[0] === key) as any;
			if (res) {
				return [res[1].toString()];
			}
		}
	}
	if (firstOnly) { return [result[0]]; }
	return result;
}

let config: vscode.WorkspaceConfiguration;
let info: {
	prefix?: string,
	translationValueMode?: string,
	content?: any
} = {};

export async function activate(context: vscode.ExtensionContext): Promise<void> {
	handleTranslationFileManagement();
	vscode.workspace.onDidChangeConfiguration(_ => {
		const currentConfig = vscode.workspace.getConfiguration('translationPeek');
		if (config !== currentConfig) {
			handleTranslationFileManagement();
		}
	});
	setInterval(_ => handleTranslationFileManagement(), 5 * 60 * 1000);

	let d2 = vscode.languages.registerHoverProvider(['typescript', 'javascript', 'html'], {
		provideHover(document, position, _) {
			const wordBorders = document.getWordRangeAtPosition(position, /[A-Z_\.0-9a-z]+/);
			if (wordBorders) {
				const hoveredLine = document.lineAt(wordBorders.start).text;
				const hoveredWord = hoveredLine.substring(wordBorders?.start.character, wordBorders?.end.character);
				if (!info.prefix || hoveredWord.startsWith(info.prefix)) {
					const translations = Object.entries(info.content)
						.map(element => getValue(element[1], hoveredWord, info.translationValueMode === 'first'))
						.filter(trans => trans?.length);
					const hoverText = new vscode.MarkdownString(translations?.join('\\\r\n'));
					return hoverText && new vscode.Hover(hoverText);
				}
			}
		}
	});
	context.subscriptions.push(d2);
}

async function handleTranslationFileManagement(): Promise<void> {
	const currentConfig = vscode.workspace.getConfiguration('translationPeek');
	config = currentConfig;
	const fileNames = getTranslationFileNames(config);
	info.prefix = getTranslationPrefix(config);
	info.translationValueMode = getTranslationValueMode(config);
	const files = await Promise.all(fileNames.map(fileName => getTranslationFile(fileName)));
	const contents = await Promise.all(files.filter(f => !!f).map(async (file, i) => ({ [fileNames[i].split('.')[0]]: await getTranslationContent(file) })));
	info.content = contents.reduce((p, c) => ({ ...p, ...c }), {});
}

async function getTranslationFile(fileName: string): Promise<vscode.Uri> {
	return await vscode.workspace.findFiles(`**/${fileName}`).then(files => {
		files = files?.filter(file => !file.path.includes('node_modules'));
		if (!files || !files[0]) {
			vscode.window.showWarningMessage(`TranslationPeek: Translationfile could not be found!`);
		}
		return files && files[0];
	});
}

async function getTranslationContent(file: vscode.Uri): Promise<string> {
	return vscode.workspace.fs.readFile(file).then(contents => {
		const translationText = new TextDecoder("utf-8").decode(contents);
		try {
			return JSON.parse(translationText);
		} catch (e) {
			vscode.window.showWarningMessage(`TranslationPeek: Translationfile could not be parsed!`);
			return {};
		}
	});
}

const getTranslationPrefix = (config: vscode.WorkspaceConfiguration): string => config.get('prefix', '').toString();
const getTranslationFileNames = (config: vscode.WorkspaceConfiguration): string[] => config.get('jsonNames', ['translation.json']) || ['translation.json'];
const getTranslationValueMode = (config: vscode.WorkspaceConfiguration): 'first' | 'all' => (config.get('take', 'first') as any).toString() || 'first';

// this method is called when your extension is deactivated
export function deactivate(): void { }
