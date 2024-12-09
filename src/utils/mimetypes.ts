export const acceptMimetypes = {
  'application/msword': ['.docx', '.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
    '.docx',
  ],
  'application/pdf': ['.pdf'],
  'application/vnd.ms-excel': ['.xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
    '.xlsx',
  ],
  '	application/vnd.ms-powerpoint': ['.ppt', '.pptx'],
  'image/*': ['.jpeg', '.png'],
};

export function removerExtensao(nomeArquivo) {
  const partes = nomeArquivo.split('.');
  if (partes.length > 1) {
    partes.pop(); // Remove a última parte (a extensão)
  }
  return partes.join('.');
}
