import { useQuery } from "@tanstack/react-query";
import { getReviews } from "../services/reviews-service";

export const useReviewsData = ({ searchBy, payload }) => {
  const {
    isPending: reviewsPending,
    isFetching: reviewsFetching,
    error: reviewsError,
    data: reviews,
  } = useQuery({
    queryKey: ["reviews", payload],
    queryFn: async () => {
      const searchParams = new URLSearchParams(`${searchBy}=${payload}`);
      const getReviewsResponse = getReviews(searchParams);
      return getReviewsResponse;
    },
    enabled: payload !== "",
    retry: 10,
    refetchInterval: 10000, // Will check for updates every 10 sec
  });
  return { reviewsPending, reviewsFetching, reviewsError, reviews };
};
