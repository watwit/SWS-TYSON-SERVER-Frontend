import { getSession } from "next-auth/react";
import { useEffect } from "react";
import axios from "./axios";
import { useRefreshToken } from "./useRefreshToken";

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token) => {
  refreshSubscribers.map((cb) => cb(token));
  refreshSubscribers = [];
};

const useAxiosAuth = () => {
  const refresh = useRefreshToken();

  useEffect(() => {
    const requestIntercept = axios.interceptors.request.use(
      async (config) => {
        const session = await getSession();
        const token = session?.user?.accessToken;
        if (!config.headers["Authorization"] && token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error?.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          if (isRefreshing) {
            // Queue request
            return new Promise((resolve) => {
              subscribeTokenRefresh((token) => {
                originalRequest.headers["Authorization"] = `Bearer ${token}`;
                resolve(axios(originalRequest));
              });
            });
          }

          isRefreshing = true;
          try {
            const newAccessToken = await refresh();
            if (newAccessToken) {
              onRefreshed(newAccessToken); // resolve all subscribers
              originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
              return axios(originalRequest);
            }
          } catch (refreshError) {
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestIntercept);
      axios.interceptors.response.eject(responseIntercept);
    };
  }, [refresh]);

  return axios;
};

export default useAxiosAuth;

