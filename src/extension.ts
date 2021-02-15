// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { getRelated } from './resolver';
import { buildLocale } from './locale';
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
      createPrompt(chosenLocale, localeFileUri, createFile);
    }
  });
};

const openFile = (fileUri: vscode.Uri) => {
  vscode
    .workspace
    .openTextDocument(fileUri)
    .then(document => vscode.window.showTextDocument(document))
}

const openAndStubFile = (locale: string, fileUri: vscode.Uri) => {
  vscode
    .workspace
    .openTextDocument(fileUri)
    .then((document) => {
      vscode.window.showTextDocument(document, 1, false)
        .then(editor => {
          editor.edit(edit => edit.insert(new vscode.Position(0, 0), buildLocale(locale, fileUri.fsPath)))
        })
    })
}

const createFile = (locale: string, fileUri: vscode.Uri) => {
  const workspaceEdit = new vscode.WorkspaceEdit();
  workspaceEdit.createFile(fileUri, { ignoreIfExists: true });
  vscode.workspace.applyEdit(workspaceEdit).then(() => openAndStubFile(locale, fileUri));
};

const createPrompt = (locale: string, fileUri: vscode.Uri, action: any) => {
    const items = [
      'Yes',
      'No'
    ];
    const options = {
      placeHolder: `Create ${fileUri.fsPath}?`
    }

    vscode.window.showQuickPick(items, options)
      .then((response) => {
        if (response === 'Yes') { action(locale, fileUri); }
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
