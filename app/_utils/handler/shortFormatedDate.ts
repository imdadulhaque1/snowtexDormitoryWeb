export const shortFormatedDate = (dateString: any) => {
  const date = new Date(dateString);
  const options: any = { day: "2-digit", month: "short", year: "numeric" };
  return new Intl.DateTimeFormat("en-GB", options).format(date);
};
