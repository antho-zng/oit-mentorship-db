import { useQuery } from "@tanstack/react-query";
import { getReviews } from "../services/reviews-service";

export const useReviewsData = (menteeId) => {
  const {
    isPending: reviewsPending,
    error: reviewsError,
    data: reviews,
  } = useQuery({
    queryKey: ["reviews", menteeId],
    queryFn: async () => {
      const getReviewsResponse = getReviews(menteeId);
      return getReviewsResponse;
    },
    enabled: menteeId !== "",
    retry: 10,
    refetchInterval: 10000, // Will check for updates every 10 sec
  });
  return { reviewsPending, reviewsError, reviews };
};
