import { axiosJWTHolder } from "../apis/axiosJWTHolder";
import { useEffect } from "react";
import useNewAccessToken from "./useNewAccessToken";
import useAuth from "./useAuth";

const useAxiosJWTHolder = () => {
  const refresh = useNewAccessToken();
  const { auth } = useAuth();

  useEffect(() => {
    const requestIntercept = axiosJWTHolder.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${auth?.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosJWTHolder.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosJWTHolder(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosJWTHolder.interceptors.request.eject(requestIntercept);
      axiosJWTHolder.interceptors.response.eject(responseIntercept);
    };
  }, [auth, refresh]);

  return axiosJWTHolder;
};

export default useAxiosJWTHolder;