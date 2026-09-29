import axios from "axios";
import { toast } from "sonner";
import { authState, logout } from "@/stores/authStore";

function getAuthHeaders(auth) {
  if (auth?.authType === "token") {
    return { "X-Auth-Token": auth.token };
  }

  if (auth?.username && auth?.password) {
    return {
      Authorization: `Basic ${btoa(`${auth.username}:${auth.password}`)}`,
    };
  }

  return {};
}

export const apiClient = axios.create({
  baseURL: authState.get()?.serverUrl || "",
  headers: getAuthHeaders(authState.get()),
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      logout();
    }

    const errorMessage = error.response?.data?.error_message;
    if (errorMessage && error.response?.status !== 404) {
      toast.error(errorMessage);
    }

    return Promise.reject(error);
  },
);

authState.listen((auth) => {
  apiClient.defaults.baseURL = auth?.serverUrl || "";
  delete apiClient.defaults.headers.common.Authorization;
  delete apiClient.defaults.headers.common["X-Auth-Token"];
  Object.assign(apiClient.defaults.headers.common, getAuthHeaders(auth));
});
