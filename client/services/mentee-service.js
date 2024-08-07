import axiosInstance from "../AxiosWrapper";

const getMentee = async (menteeId) => {
  try {
    const { data: mentee } = await axiosInstance.get(`/mentees/${menteeId}`);
    return mentee;
  } catch (error) {
    const { status } = error;
    throw new Error(`${status}: Error getting mentee data.`);
  }
};

export { getMentee };
