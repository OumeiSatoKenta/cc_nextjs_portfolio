export const isExternalHttpUrl = (url: string): boolean =>
  url.startsWith('http://') || url.startsWith('https://');

export const isInternalUrl = (url: string): boolean =>
  url.startsWith('/') || url.startsWith('#');
