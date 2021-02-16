import * as vscode from 'vscode'
import { buildLocale } from './locale';

export const openFile = async (fileUri: vscode.Uri) => {
  try {
    const document = await vscode.workspace.openTextDocument(fileUri);
    vscode.window.showTextDocument(document);
  } catch (error) {
    vscode.window.showWarningMessage(error);
  }
}

const insertLocaleToFile = (edit: vscode.TextEditorEdit, locale: string, path: string) => {
  edit.insert(new vscode.Position(0, 0), buildLocale(locale, path))
}

export const createFile = async (locale: string, fileUri: vscode.Uri) => {
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

export const promptUserToCreateFile = async (locale: string, fileUri: vscode.Uri, createFunction: CallableFunction) => {
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

const openAndStubFile = async (locale: string, fileUri: vscode.Uri) => {
  try {
    const document = await vscode.workspace.openTextDocument(fileUri);
    const editor = await vscode.window.showTextDocument(document);
    editor.edit(edit => insertLocaleToFile(edit, locale, fileUri.fsPath));
  } catch (error) {
    vscode.window.showWarningMessage(error);
  }
}
