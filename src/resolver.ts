
import * as vscode from 'vscode';

const CONVENTIONAL_MODULES = [
  'views',
  'mailers',
  'models',
  'controllers'
];

const LOCALE_REGEX = /.+\..+\.yml/;

export const getRelated = async (filename: string, locale: string): Promise<string> => {
    if (isLocale(filename)) {
      const destinationPath = await navigateFromLocale(filename);
      return destinationPath
    } else {
      return navigateToLocale(filename, locale);
    }
};

const isLocale = (filename: string): boolean => {
  return LOCALE_REGEX.test(filename);
};

const navigateToLocale = (filename: string, locale: string): string => {
  const viewRegex = /erb$|haml$|slim$/;
  const localeExtension = `.${locale}.yml`;

  const isViewFile = filename.match(viewRegex);
  if (isViewFile) {
    return filename
            .replace('/app/', '/config/locales/')
            .replace(/\..+\.haml/, localeExtension)
            .replace(/\..+\.erb/, localeExtension)
            .replace(/\..+\.slim/, localeExtension);
  }

  filename = filename.replace('.rb', localeExtension);
  filename = filename.replace('/extensions', '');

  return filename.replace('/app/', '/config/locales/');
};

const navigateFromLocale = async (filename: string): Promise<string> => {
  const appPath = filename.split('/locales')[1].split(/\..+\.yml/)[0]
  const searchTerm = ('app' + appPath.replace(/\//g, '/**/') + '*')
  const foundUris = await vscode.workspace.findFiles(searchTerm)
  const candidates = foundUris.filter((uri) => {
    return uri.fsPath !== filename
  })

  if (candidates.length == 1) {
    return candidates[0].fsPath;
  } else {
    return ''
  }
};
