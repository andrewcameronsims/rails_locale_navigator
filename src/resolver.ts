export const getRelated = (file: string, locale: string) => {
    return codeToLocale(file, locale);
};

const codeToLocale = (file: string, locale: string) => {
  const viewRegex = /erb$|haml$|slim$/;
  const localeExtension = `.${locale}.yml`;

  const isViewFile = file.match(viewRegex);
  if (isViewFile) {
    return file
            .replace('/app/', '/config/locales/')
            .replace(/\..+\.haml/, localeExtension)
            .replace(/\..+\.erb/, localeExtension)
            .replace(/\..+\.slim/, localeExtension);
  }

  file = file.replace('.rb', localeExtension);
  file = file.replace('/extensions', '');

  return file.replace('/app/', '/config/locales/');
};
