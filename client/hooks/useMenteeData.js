import { useQuery } from "@tanstack/react-query";
import { getMentee, getAllMentees } from "../services/mentee-service";

const initialMenteeData = {
  id: "",
  firstName: "",
  lastName: "",
  pronouns: [],
  cohort: { name: "" },
  acceptedStatus: "",
  dateOfBirth: "",
  email: "",
  phoneNum: "",
  location: "",
  gendersAndSexualities: {},
  raceEthnicity: {},
  questions: [],
};

export const useMenteeData = (menteeId) => {
  const {
    isPending: menteePending,
    error: menteeError,
    data: mentee,
    isFetching: menteeFetching,
  } = useQuery({
    queryKey: ["mentee", menteeId],
    queryFn: async () => {
      const menteeData = await getMentee(menteeId);
      return menteeData;
    },
    placeholderData: initialMenteeData,
  });
  return { menteePending, menteeError, mentee, menteeFetching };
};

export const useAllMenteeData = ({ searchBy, payload }) => {
  const {
    isPending: allMenteesPending,
    error: allMenteesError,
    data: allMentees,
    isFetching: allMenteesFetching,
  } = useQuery({
    queryKey: ["allMentees", payload],
    queryFn: async () => {
      const searchParams = new URLSearchParams(`${searchBy}=${payload}`);
      const allMenteeData = await getAllMentees(searchParams);
      return allMenteeData;
    },
    enabled: payload !== "",
    placeholderData: [],
  });
  return { allMenteesPending, allMenteesError, allMentees, allMenteesFetching };
};
