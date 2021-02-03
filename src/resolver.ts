export const getRelated = (file: string, locale: string) => {
  // if (isLocale(file)) {
  //   return localeToCode(file, locale);
  // } else {
    return codeToLocale(file, locale);
  // }
};

// const isLocale = (file: string) => {
//   return file.match(/^\/config\/locales\/.+\.yml$/);
// };

// const localeToCode = (file: string, locale: string) => {
//   file = file.replace(`${locale}.yml`, '.rb');
//   return file.replace('/config/locales/', '/app/');
// };

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

  file = file.replace('.rb', `.${locale}.yml`);
  file = file.replace('/extensions', '');

  return file.replace('/app/', '/config/locales/');
};
