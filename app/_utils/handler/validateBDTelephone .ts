export const isValidBDTelephone = (telephone: any) => {
  const bdPhoneRegex = /^(?:\+8801|8801|01)[3-9]\d{8}$/;

  return bdPhoneRegex.test(telephone);
};
