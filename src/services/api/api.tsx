import axios from 'axios';

const API_BASE_URL = 'http://192.168.1.42:8082';

export const fetchExpansions = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/sets`);
    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data.map((item: { name: any; }) => ({ label: item.name, value: item.name }));
    } else {
      console.error('Unexpected response format:', response.data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching expansions:', error);
    return [];
  }
};
