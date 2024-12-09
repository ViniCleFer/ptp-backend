export const getProfileName = (profile: string) => {
  switch (profile) {
    case 'UN2':
      return 'Admin';
    case 'UN3':
      return 'Membro';
    case 'UN4':
      return 'Convidado';

    default:
      return 'Permissão não encontrada';
  }
};
