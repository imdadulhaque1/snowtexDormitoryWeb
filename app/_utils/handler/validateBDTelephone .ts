export const isValidBDTelephone = (telephone: any) => {
  const bdPhoneRegex = /^(?:\+8801|8801|01)[3-9]\d{8}$/;

  return bdPhoneRegex.test(telephone);
};

export const isEmailValid = (email: string) => {
  const validEmailRegex =
    /^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
  if (!email) return false;

  const emailParts = email.split("@");

  if (emailParts.length !== 2) return false;

  const account = emailParts[0];
  const domain = emailParts[1];

  if (account.length > 64) return false;
  else if (domain.length > 255) return false;

  const domainParts = domain.split(".");

  if (domainParts.some((part) => part.length > 63)) return false;

  return validEmailRegex.test(email);
};
