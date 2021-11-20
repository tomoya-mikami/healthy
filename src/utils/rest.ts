import axios, { Axios, AxiosError, Method} from "axios";

export const post = async<T>(url: string, data: any): Promise<T | string> => {
  const options = {
    method: "post" as Method,
    headers: {
      "content-type": "application/json; charset=utf-8"
    },
  }
  try {
    const response = await axios.post(url, data, options);
    return response.data;
  } catch (e: any) {
    if (e instanceof Error) {
      return e.message;
    }
    return "unknownError";
  }
}
