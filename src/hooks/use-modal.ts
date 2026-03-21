import type { ModalType } from "@/types/modal.type";
import { create } from "zustand";

interface ModalData {
   [key: string]: any
}

interface Modal {
   type: ModalType;
   data?: ModalData;
}

interface ModalState {
   modals: Modal[];
   openModal: (type: ModalType, data?: ModalData) => void;
   closeModal: (type: ModalType) => void;
   closeAllModals: () => void;
   isModalOpen: (type: ModalType) => boolean;
   getModalData: (type: ModalType) => ModalData | undefined;
   clearModalData: (type: ModalType) => void;
}

export const useModal = create<ModalState>((set, get) => ({
   modals: [],

   openModal: (type, data = {}) => {
      set((state) => ({
         modals: [...state.modals, { type, data }],
      }))
   },

   closeModal: (type) => {
      set((state) => ({
         modals: state.modals.filter(modal => modal.type !== type),
      }))
   },

   closeAllModals() {
      set({ modals: [] })
   },


   isModalOpen: type => get().modals.some(modal => modal.type === type),

   getModalData: type => get().modals.find(modal => modal.type === type)?.data,


   clearModalData: (type: ModalType) => {
      set((state) => ({
         modals: state.modals.map(modal =>
            modal.type === type ? { ...modal, data: undefined } : modal
         )
      }))
   }
}))