export const capitalizeFirstLetter = (word: string) => {
  const capitalized = word.replace(/^./, word[0].toUpperCase());

  return capitalized;
};
