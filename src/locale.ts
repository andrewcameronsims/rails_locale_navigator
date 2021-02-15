import * as yaml from 'js-yaml';

export const buildLocale = (locale: string, filename: string): string => {
  const localeObject = buildLocaleObject(locale, filename);
  return yaml.dump(localeObject);
}

const buildLocaleObject = (locale: string, filename: String): object => {
  const keys = filename.split('/locales/')[1].split('.')[0].split('/'); // regular expressions are more appropriate for this.
  keys.unshift(locale);

  let yamlTree: any = {};

  while (keys.length > 0) {
    const newKey: string = keys.pop()! // How do I do unwrapping properly in TypeScript?
    yamlTree = { [newKey]: yamlTree };
  };

  return yamlTree;
};