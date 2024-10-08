
import { useQuery } from "@tanstack/react-query";
import useAxios from "./useAxios";

interface ApiHookResponse<T> {
  data: T | undefined;
  isLoading: boolean;
  error: unknown;
}

export function useGetConversionRate(): ApiHookResponse<number> {
  const api = useAxios();
  const { isLoading, data, error } = useQuery({
    queryKey: ["getConversionRate"],
    queryFn: () =>
      api.get("usdc/conversionrate").then((res: { data: { rate: any; }; }) => {
        return res.data.rate;
      }),
  });
  return { isLoading, data, error };
}

export function useGetBalanceHook(): ApiHookResponse<number> {
  const api = useAxios();
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const { isLoading, data, error } = useQuery({
    queryKey: ["getUserBalance"],
    queryFn: () =>
      api.get(`usdc/usdc-balance/${user?.walletAddress}`).then((res: { data: any; }) => {
        return res.data;
      }),
    enabled: !!user, // Only run query if user is not null
  });
  return { isLoading, data, error };
}
