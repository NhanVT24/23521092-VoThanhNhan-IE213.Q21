import axios from "axios";
const baseURL = "http://localhost:8000/api/v1/movies";
class MovieDataService {
  getAll(page = 0) {
    return axios.get(`${baseURL}?page=${page}`);
  }
  get(id) {
    return axios.get(`${baseURL}/id/${id}`);
  }
  find(query, by = "title", page = 0) {
    return axios.get(`${baseURL}?${by}=${query}&page=${page}`);
  }
  createReview(data) {
    return axios.post(`${baseURL}/review`, data);
  }
  updateReview(data) {
    return axios.put(`${baseURL}/review`, data);
  }
  deleteReview(id, userId) {
    return axios.delete(`${baseURL}/review`, {
      data: { review_id: id, user_id: userId },
    });
  }
  getRatings() {
    return axios.get(`${baseURL}/ratings`);
  }
}

export default new MovieDataService();
