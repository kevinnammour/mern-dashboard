import axios from "axios";
import useAuth from "./useAuth";
const baseUrl = "http://localhost:8000";

const useLogout = () => {
  const { setAuth } = useAuth();
  const logout = async () => {
    setAuth({});
    try {
      const response = await axios.get(`${baseUrl}/logout`, {
        withCredentials: true,
      });
    } catch (err) {
    }
  };
  return logout;
};

export default useLogout;
