import axiosInstance from "../axiosWrapper";

const getMentee = async (menteeId) => {
  try {
    const { data: mentee } = await axiosInstance.get(`/mentees/${menteeId}`);
    return mentee;
  } catch (error) {
    const { status } = error;
    throw new Error(`${status}: Error getting mentee data.`);
  }
};

const getAllMentees = async (searchParams) => {
  try {
    const { data: allMentees } = await axiosInstance.get(`/mentees`, {
      params: searchParams,
    });
    return allMentees;
  } catch (error) {
    const { status } = error;
    throw new Error(`${status}: Error getting mentees`);
  }
};

export { getMentee, getAllMentees };
