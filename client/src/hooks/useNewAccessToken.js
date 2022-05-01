import axios from "axios";
import useAuth from "./useAuth";
const baseUrl = "http://localhost:8000";

const useNewAccessToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const res = await axios.get(`${baseUrl}/crm/refresh`, {
      withCredentials: true,
    });
    setAuth((prev) => {
      // This is the previous state
      console.log(JSON.stringify(prev));
      console.log(res.data.accessToken);
      return { ...prev, accessToken: res.data.accessToken };
    });
    return res.data.accessToken;
  };
  return  refresh;
};

export default useNewAccessToken;
