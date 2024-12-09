import { atob, Blob } from 'buffer';

export const base64toBlob = (pdfBase64: string) => {
  const bytes = atob(pdfBase64);
  let { length } = bytes;
  const out = new Uint8Array(length);

  // eslint-disable-next-line no-plusplus
  while (length--) {
    out[length] = bytes.charCodeAt(length);
  }

  const blobFile = new Blob([out], { type: 'application/pdf' });
  console.log(blobFile);
  return blobFile;
};
