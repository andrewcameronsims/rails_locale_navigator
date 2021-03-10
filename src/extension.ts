// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import { FileIndex } from './fileIndex'
import { getRelated } from './resolver';
import { openFile, createFile, promptUserToCreateFile } from './fs';

const getLocale = async () => {
  try {
    const currentOpenFile = vscode.window.activeTextEditor?.document.fileName;
    if (!currentOpenFile) { return; }

    let chosenLocale: string | undefined = 'en'
    if (currentOpenFile.endsWith('.rb')) {
      const options: vscode.InputBoxOptions = {
        value: 'en',
        prompt: 'Locale: ',
        placeHolder: 'en'
      };
      chosenLocale = await vscode.window.showInputBox(options);
      if (!chosenLocale) { return; }
    }

    const localeFilename = await getRelated(currentOpenFile, chosenLocale);
    const localeFileUri = vscode.Uri.file(localeFilename);

    if (fs.existsSync(localeFilename)) {
      openFile(localeFileUri);
    } else {
      promptUserToCreateFile(chosenLocale, localeFileUri, createFile);
    }
  } catch (error) {
    vscode.window.showErrorMessage(error);
  }
};

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  let fileIndex : FileIndex

  vscode.window.withProgress({
    location: vscode.ProgressLocation.Window,
    cancellable: false,
    title: 'Indexing files'
  }, async (progress) => {
    progress.report({ increment: 0 });

    fileIndex = await FileIndex.getInstance();

    progress.report({ increment: 100 });
  })

	let disposable = vscode.commands.registerCommand('gotolocale.railsLocale', () => {
    getLocale();
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
