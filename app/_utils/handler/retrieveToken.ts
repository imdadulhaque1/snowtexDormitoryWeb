// import AppURL from "@/app/_restApi/AppURL";

// const retrieveToken = async () => {
//   try {
//     const response = await fetch(AppURL.retrieveCookieToken, {
//       credentials: "include",
//     });

//     const data = await response.json();
//     if (response.ok) {
//       return data.token;
//     } else {
//       console.error("Error retrieving token:", data.message);
//       return data.message;
//     }
//   } catch (error: any) {
//     console.error("Fetch failed:", error);
//     return error?.message;
//   }
// };

// export default retrieveToken;

import Cookies from "js-cookie";

const retrieveToken = async () => {
  const token = Cookies.get("authToken");
  if (token) {
    return token;
  } else {
    console.log("Token not found!");
    return null;
  }
};

export default retrieveToken;
