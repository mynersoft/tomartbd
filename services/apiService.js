// services/apiService.js
import axios from 'axios';

export const apiService = {
  // Combo CRUD operations
  createCombo: async (data) => {
    const res = await axios.post('/api/admin/combos', data);
    return res.data;
  },

  updateCombo: async (id, data) => {
    const res = await axios.put(`/api/admin/combos/${id}`, data);
    return res.data;
  },

  deleteCombo: async (id) => {
    const res = await axios.delete(`/api/admin/combos/${id}`);
    return res.data;
  },

  getCombo: async (id) => {
    const res = await axios.get(`/api/admin/combos/${id}`);
    return res.data;
  },

  getCombos: async () => {
    const res = await axios.get('/api/admin/combos');
    return res.data;
  },
};
