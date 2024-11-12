export const formatedDate = (date: string) => {
  const convertedDate = new Date(date);
  const day = String(convertedDate.getDate()).padStart(2, "0");
  const month = String(convertedDate.getMonth() + 1).padStart(2, "0");
  const year = String(convertedDate.getFullYear());

  return `${day}/${month}/${year}`;
};