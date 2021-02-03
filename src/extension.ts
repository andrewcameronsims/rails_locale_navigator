// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { getRelated } from './resolver';
import * as fs from 'fs';

const getLocale = () => {
  const currentOpenFile = vscode.window.activeTextEditor?.document.fileName!;

  const options: vscode.InputBoxOptions = {
    value: 'en',
    prompt: 'Locale: ',
    placeHolder: 'en'
  };

  vscode.window.showInputBox(options).then(chosenLocale => {
    if (!chosenLocale) { return; }

    const localeFilename = getRelated(currentOpenFile, chosenLocale);
    const localeFileUri = vscode.Uri.file(localeFilename);

    if (fs.existsSync(localeFilename)) {
      openFile(localeFileUri);
    } else {
      createPrompt(localeFileUri, createFile);
    }
  });
};

const openFile = (fileUri: vscode.Uri) => {
  vscode
    .workspace
    .openTextDocument(fileUri)
    .then(vscode.window.showTextDocument);
};

const createFile = (fileUri: vscode.Uri) => {
  const workspaceEdit = new vscode.WorkspaceEdit();
  workspaceEdit.createFile(fileUri, { ignoreIfExists: true });
  vscode.workspace.applyEdit(workspaceEdit).then(() => openFile(fileUri));
};

const createPrompt = (fileUri: vscode.Uri, action: any) => {
    const items = [
      'Yes',
      'No'
    ];
    const options = {
      placeHolder: `Create ${fileUri.fsPath}?`
    }

    vscode.window.showQuickPick(items, options)
      .then((response) => {
        if (response === 'Yes') { action(fileUri); }
      });
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
