import axios from "axios";

const getMentee = async (menteeId) => {
  try {
    const { data: mentee } = await axios.get(`/api/mentees/${menteeId}`);
    return mentee;
  } catch (error) {
    // TODO: better error handling
    console.error(error);
    return;
  }
};

export { getMentee };
