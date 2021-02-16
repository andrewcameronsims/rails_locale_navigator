// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { getRelated } from './resolver';
import { buildLocale } from './locale';
import * as fs from 'fs';

const getLocale = async () => {
  const currentOpenFile = vscode.window.activeTextEditor?.document.fileName!;

  const options: vscode.InputBoxOptions = {
    value: 'en',
    prompt: 'Locale: ',
    placeHolder: 'en'
  };

  const chosenLocale = await vscode.window.showInputBox(options)
  if (!chosenLocale) { return }

  const localeFilename = getRelated(currentOpenFile, chosenLocale);
  const localeFileUri = vscode.Uri.file(localeFilename);

  if (fs.existsSync(localeFilename)) {
    openFile(localeFileUri);
  } else {
    promptUserToCreateFile(chosenLocale, localeFileUri, createFile);
  }
};

const openFile = async (fileUri: vscode.Uri) => {
  try {
    const document = await vscode.workspace.openTextDocument(fileUri);
    vscode.window.showTextDocument(document);
  } catch (error) {
    vscode.window.showWarningMessage(error);
  }
}

const openAndStubFile = async (locale: string, fileUri: vscode.Uri) => {
  try {
    const document = await vscode.workspace.openTextDocument(fileUri);
    const editor = await vscode.window.showTextDocument(document);
    editor.edit(edit => insertLocaleToFile(edit, locale, fileUri.fsPath));
  } catch (error) {
    vscode.window.showWarningMessage(error);
  }
}

const insertLocaleToFile = (edit: vscode.TextEditorEdit, locale: string, path: string) => {
  edit.insert(new vscode.Position(0, 0), buildLocale(locale, path))
}

const createFile = async (locale: string, fileUri: vscode.Uri) => {
  try {
    const workspaceEdit = new vscode.WorkspaceEdit();
    workspaceEdit.createFile(fileUri, { ignoreIfExists: true });
    const editWasApplied = await vscode.workspace.applyEdit(workspaceEdit)
    if (editWasApplied) {
      openAndStubFile(locale, fileUri)
    }
  } catch (error) {
    vscode.window.showWarningMessage(error);
  }
};

const promptUserToCreateFile = async (locale: string, fileUri: vscode.Uri, createFunction: CallableFunction) => {
    const items = [
      'Yes',
      'No'
    ];
    const options = {
      placeHolder: `Create ${fileUri.fsPath}?`
    }

    const response = await vscode.window.showQuickPick(items, options)
    if (response === 'Yes') {
      createFunction(locale, fileUri)
    }
};

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('gotolocale.railsLocale', () => {
    getLocale();
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
