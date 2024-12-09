export class FilesHelper {
  static getFileNameFromUrl(url: string): string {
    const splitUrl = url.split('/');
    return splitUrl.slice(2, splitUrl.length).join('/');
  }
}

export function removeSpecialCharsAndAccents(input) {
  const withoutAccents = input.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const formattedString = withoutAccents
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '_');

  return formattedString;
}
