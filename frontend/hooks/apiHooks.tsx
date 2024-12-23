
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
