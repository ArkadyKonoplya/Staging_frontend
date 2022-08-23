import axios from "axios";

// Authenticating users with axios/managing tokens 

const baseURL = process.env.REACT_APP_API_URL

const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 5000,
  headers: {
    Authorization: localStorage.getItem("access_token")
      ? "JWT " + localStorage.getItem("access_token")
      : null,
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => {
    // console.log(response)
    return response;
  },
  async function (error) {
    const originalRequest = error.config;

    if (typeof error.response === "undefined") {
      alert(
        "A server/network error occurred. " +
          "Looks like CORS might be the problem. " +
          "Sorry about this - we will get it fixed shortly."
      );
      return Promise.reject(error);
    }
console.log("Orig Req", originalRequest.url)
    if (
      error.response.status === 401 &&
      originalRequest.url === "/token/refresh/"
    ) {
      window.location.href = "/";
      return Promise.reject(error);
    }

    if (
      error.response.data.code === "token_not_valid" &&
      error.response.status === 401 &&
      error.response.statusText === "Unauthorized"
    ) {
      const refreshToken = localStorage.getItem("refresh_token");

      if (refreshToken) {
        const tokenParts = JSON.parse(atob(refreshToken.split(".")[1]));

        // exp date in token is expressed in seconds, while now() returns milliseconds:
        const now = Math.ceil(Date.now() / 1000);
        // console.log(tokenParts.exp);

        if (tokenParts.exp > now) {
          return axiosInstance
            .post("/token/refresh/", { refresh: refreshToken })
            .then((response) => {
              localStorage.setItem("access_token", response.data.access);
              localStorage.setItem("refresh_token", response.data.refresh);

              axiosInstance.defaults.headers["Authorization"] =
                "JWT " + response.data.access;
              originalRequest.headers["Authorization"] =
                "JWT " + response.data.access;

              return axiosInstance(originalRequest);
            })
            .catch((err) => {
              // console.log(err);
            });
        } else {
          console.log("Refresh token is expired", tokenParts.exp, now);
          window.location.href = "";
        }
      } else {
        console.log("Refresh token not available.");
        window.location.href = "";
      }
    }

    // specific error handling done elsewhere
    return Promise.reject(error);
  }
);

export default axiosInstance;

















// export const asyncCall = async () => {
//     // apiurl = this is api url
//     let apiurl = "http://127.0.0.1:8000";
//     try {
//         // Call fetch api method like ajax type
//         // response = resolved promise value holder
//         const response = await fetch(apiurl).then(response => {
//             // this return a promise | so resolve the promise here
//             // then return json body
//             return response.json();
//         });
//         // return your data
//         return response;
//     } catch (err) {
//         // catch error
//         console.log('fetch failed', err);
//     }
// }