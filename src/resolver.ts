
import * as vscode from 'vscode';

const CONVENTIONAL_MODULES = [
  'views',
  'mailers',
  'models',
  'controllers'
];

const LOCALE_REGEX = /.+\..+\.yml/;

export const getRelated = (filename: string, locale: string): string => {
    if (isLocale(filename)) {
      return localeToCode(filename);
    } else {
      return codeToLocale(filename, locale);
    }
};

const isLocale = (filename: string): boolean => {
  return LOCALE_REGEX.test(filename);
};

const codeToLocale = (filename: string, locale: string): string => {
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

const localeToCode = (filename: string) => {
  const modules = filename.split('/');

  if (CONVENTIONAL_MODULES.includes(filename)) {
    return filename.replace('/app/', '/config/locales/');
  } else {
    return '';
  }
};

const unconventionalModulePath = (module: string) => {
  vscode.workspace.findFiles(`app/**/${module}/**`);
};
