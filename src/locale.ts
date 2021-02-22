import * as yaml from 'js-yaml';

export const buildLocale = (locale: string, filename: string): string => {
  const localeObject = buildLocaleObject(locale, filename);
  const yamlString = yaml.dump(localeObject);
  return yamlString.replace('{}', '');
};

const buildLocaleObject = (locale: string, filename: string): object => {
  const keys = filename.split('/locales/')[1].split('.')[0].split('/'); // regular expressions are more appropriate for this.
  keys.unshift(locale);

  let yamlTree: object = {};

  while (keys.length > 0) {
    const newKey: string = keys.pop()!;
    yamlTree = { [newKey]: yamlTree };
  };

  return yamlTree;
};
