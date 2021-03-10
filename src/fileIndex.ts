import * as vscode from 'vscode'
import { BiMap } from '@jsdsl/bimap'

export class FileIndex {
  private static instance: FileIndex
  value: BiMap<String, String>;

  public static getInstance(): FileIndex {
    if (!FileIndex.instance) {
      FileIndex.instance = new FileIndex();
    }

    return FileIndex.instance;
  }

  public update() {

  }

  private constructor() {
    this.value = new BiMap()
    this.build()
  }

  private build() {
    const fileUris: Array<vscode.Uri> = []

    fileUris.forEach((uri) => {
      uri
    })
  }
}
