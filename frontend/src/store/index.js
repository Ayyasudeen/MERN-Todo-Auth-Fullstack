import { create } from 'zustand';
import {persist} from "zustand/middleware";

let user = (set) => ({
  name: null,
  updateName: (newName) => set({ name: newName }),
  // updateName: (newName) => set((state) => ({ name: newName })),
});

user = persist(user, {name: "user"});

export const userStore = create(user);   