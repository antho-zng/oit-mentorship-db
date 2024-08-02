import { useQuery } from "@tanstack/react-query";
import { getMentee } from "../services/mentee-service";

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
