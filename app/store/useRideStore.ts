import { create } from "zustand";

type RideStore = {
  destination: string;
  setDestination: (destination: string) => void;
};

export const useRideStore = create<RideStore>((set) => ({
  destination: "",
  setDestination: (destination) => set({ destination }),
}));

export default useRideStore;
