// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { TextDecoder } from 'util';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function getValue(obj: any, key: string, firstOnly: boolean = true): string[] {
	const result: string[] = [];
	for (let p in obj) {
		// checking if it's nested to iterate again
		if (obj.hasOwnProperty(p) &&
			(typeof obj[p] === "object")) {
			getValue(obj[p], key, firstOnly).map(r => result.push(r));
		} else {
			const res = Object.entries(obj).find(e => e[0] === key) as any;
			return res ? [res[1].toString()] : [];
		}
	}
	if (firstOnly) { return [result[0]]; }
	return result;
}

let config: vscode.WorkspaceConfiguration;
let configChanged: boolean = true;
let fileName: string;
let prefix: string;
let tranlationValueMode: string;

let file: vscode.Uri;
let modifiedTime: number;
let translations: any = {};
let filenameModified: boolean = true;

export function activate(context: vscode.ExtensionContext) {
	handleTranslationFileManagement().then(_ => {
		let d2 = vscode.languages.registerHoverProvider(['typescript', 'javascript', 'html'], {
			provideHover(document, position, token) {
				return handleTranslationFileManagement().then(_ => {
					const wordBorders = document.getWordRangeAtPosition(position);
					if (wordBorders) {
						const hoveredLine = document.lineAt(wordBorders.start).text;
						const hoveredWord = hoveredLine.substring(wordBorders?.start.character, wordBorders?.end.character);
						if (!prefix || hoveredWord.startsWith(prefix)) {
							const translation = getValue(translations, hoveredWord, tranlationValueMode === 'first');
							const hoverText = new vscode.MarkdownString(translation.join('\\\r\n'));
							return new vscode.Hover(hoverText);
						}
					}
				});
			}
		});

		context.subscriptions.push(d2);
	});
}

async function handleTranslationFileManagement() {
	setConfiguration();
	setTranslationFileName(config);
	setTranslationPrefix(config);
	setTranslationValueMode(config);

	await setTranslationFile();
	await setTranslationContent(file);
}

function setConfiguration() {
	const currentConfig = vscode.workspace.getConfiguration('translationPeek');
	if (config !== currentConfig) {
		configChanged = true;
		config = currentConfig;
	}
}

function setTranslationFile() {
	if (!filenameModified) { return; }
	vscode.workspace.findFiles(`**/${fileName}`).then(files => file = files[0]);
}

async function setTranslationContent(file: vscode.Uri) {
	vscode.workspace.fs.stat(file).then(stat => {
		configChanged = stat.mtime !== modifiedTime ? true : false;
		modifiedTime = stat.mtime;
		readTranslationFile(file);
	});
}

const setTranslationPrefix = (config: vscode.WorkspaceConfiguration) => prefix = config.get('prefix', '').toString();
const setTranslationFileName = (config: vscode.WorkspaceConfiguration) => {
	const name = config.get('jsonName', 'translation.json').toString() || 'translation.json';
	filenameModified = name !== fileName ? true : false;
	fileName = name;
};
const setTranslationValueMode = (config: vscode.WorkspaceConfiguration) => tranlationValueMode = config.get('take', 'first').toString() || 'first';

async function readTranslationFile(file: vscode.Uri) {
	if (!configChanged) { return; }

	vscode.workspace.fs.readFile(file).then(contents => {
		const translationText = new TextDecoder("utf-8").decode(contents);
		translations = JSON.parse(translationText);
	});
}

// this method is called when your extension is deactivated
export function deactivate() { }
