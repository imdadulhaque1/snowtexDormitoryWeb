import { cookies } from "next/headers";
import { parse } from "cookie";

export const retrieveTokenForSSR = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  return token;
};

export const getServerSideProps = async ({ req }: any) => {
  const cookies = parse(req.headers.cookie || "");
  const token = cookies.authToken;

  console.log("Token from cookies:", token);

  return {
    props: { token },
  };
};
