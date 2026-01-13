import { createSlice } from '@reduxjs/toolkit';

// Modal types
export const UI_MODAL_TYPE = {
  NONE: 'none',
  CREATE: 'create',
  EDIT: 'edit',
  VIEW: 'view',
  DELETE: 'delete',
  // Add other modal types as needed
};

const initialState = {
  modalType: UI_MODAL_TYPE.NONE,
  modalProps: null,
  isSidebarOpen: true,
  isLoading: false,
  notifications: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setModal: (state, action) => {
      state.modalType = action.payload.type;
      state.modalProps = action.payload.props || null;
    },
    closeModal: (state) => {
      state.modalType = UI_MODAL_TYPE.NONE;
      state.modalProps = null;
    },
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    addNotification: (state, action) => {
      state.notifications.push(action.payload);
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
  },
});

export const {
  setModal,
  closeModal,
  toggleSidebar,
  setIsLoading,
  addNotification,
  removeNotification,
} = uiSlice.actions;

export default uiSlice.reducer;
