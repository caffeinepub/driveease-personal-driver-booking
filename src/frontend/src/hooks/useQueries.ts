import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { BookingStatus } from "../backend";
import { useActor } from "./useActor";

export function useAvailableDrivers() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["availableDrivers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAvailableDrivers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllDrivers() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["allDrivers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getDrivers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useDriver(id: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["driver", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getDriver(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useBooking(id: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["booking", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getBooking(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useBookingsByPhone(phone: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["bookingsByPhone", phone],
    queryFn: async () => {
      if (!actor || !phone) return [];
      return actor.getBookingsByPhone(phone);
    },
    enabled: !!actor && !isFetching && !!phone,
  });
}

export function useAllBookings() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["allBookings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBookings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateBooking() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (params: {
      customerName: string;
      customerPhone: string;
      pickupAddress: string;
      destination: string;
      date: bigint;
      time: string;
      durationHours: bigint;
      driverId: bigint;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createBooking(
        params.customerName,
        params.customerPhone,
        params.pickupAddress,
        params.destination,
        params.date,
        params.time,
        params.durationHours,
        params.driverId,
      );
    },
  });
}

export function useUpdateBookingStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: { id: bigint; status: BookingStatus }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateBookingStatus(id, status);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allBookings"] }),
  });
}

export function useUpdateDriverAvailability() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      available,
    }: { id: bigint; available: boolean }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateDriverAvailability(id, available);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allDrivers"] });
      qc.invalidateQueries({ queryKey: ["availableDrivers"] });
    },
  });
}

export function useDeleteDriver() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteDriver(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allDrivers"] });
      qc.invalidateQueries({ queryKey: ["availableDrivers"] });
    },
  });
}

export function useAddDriver() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      name: string;
      photo: string;
      experienceYears: bigint;
      languages: string[];
      rating: number;
      pricePerHour: bigint;
      description: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addDriver(
        params.name,
        params.photo,
        params.experienceYears,
        params.languages,
        params.rating,
        params.pricePerHour,
        params.description,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allDrivers"] });
      qc.invalidateQueries({ queryKey: ["availableDrivers"] });
    },
  });
}

export function useSeedDrivers() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      return actor.seedDrivers();
    },
  });
}

export function useSeedMoreDrivers() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      return (actor as any).seedMoreDrivers?.() ?? Promise.resolve();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["availableDrivers"] });
    },
  });
}

export function useSeedEvenMoreDrivers() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      return (actor as any).seedEvenMoreDrivers?.() ?? Promise.resolve();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["availableDrivers"] });
    },
  });
}

export function useAllRegistrations() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["allRegistrations"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllRegistrations();
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePendingRegistrations() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["pendingRegistrations"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPendingRegistrations();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitDriverRegistration() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (params: {
      name: string;
      phone: string;
      email: string;
      city: string;
      state: string;
      experience: string;
      licenseNumber: string;
      aadhaarNumber: string;
      about: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitDriverRegistration(
        params.name,
        params.phone,
        params.email,
        params.city,
        params.state,
        params.experience,
        params.licenseNumber,
        params.aadhaarNumber,
        params.about,
      );
    },
  });
}

export function useApproveDriverRegistration() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.approveDriverRegistration(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allRegistrations"] });
      qc.invalidateQueries({ queryKey: ["pendingRegistrations"] });
    },
  });
}

export function useRejectDriverRegistration() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.rejectDriverRegistration(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allRegistrations"] });
      qc.invalidateQueries({ queryKey: ["pendingRegistrations"] });
    },
  });
}

export function useDriverRegistrationByPhone(phone: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["driverRegistrationByPhone", phone],
    queryFn: async () => {
      if (!actor || !phone) return null;
      return actor.getDriverRegistrationByPhone(phone);
    },
    enabled: !!actor && !isFetching && !!phone,
  });
}
