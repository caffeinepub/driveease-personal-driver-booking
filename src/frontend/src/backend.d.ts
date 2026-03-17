import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface DriveEaseInfo {
    drivers: Array<Driver>;
    adminId: Principal;
}
export interface Booking {
    id: bigint;
    customerName: string;
    status: BookingStatus;
    driverId: bigint;
    destination: string;
    customerPhone: string;
    date: bigint;
    createdAt: bigint;
    createdBy: Principal;
    time: string;
    durationHours: bigint;
    pickupAddress: string;
    totalPrice: bigint;
}
export interface Driver {
    id: bigint;
    name: string;
    languages: Array<string>;
    pricePerHour: bigint;
    description: string;
    available: boolean;
    experienceYears: bigint;
    rating: number;
    photo: string;
}
export interface UserProfile {
    name: string;
    phone: string;
}
export enum BookingStatus {
    cancelled = "cancelled",
    pending = "pending",
    completed = "completed",
    confirmed = "confirmed"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addDriver(name: string, photo: string, experienceYears: bigint, languages: Array<string>, rating: number, pricePerHour: bigint, description: string): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createBooking(customerName: string, customerPhone: string, pickupAddress: string, destination: string, date: bigint, time: string, durationHours: bigint, driverId: bigint): Promise<bigint>;
    deleteDriver(id: bigint): Promise<void>;
    getAllBookings(): Promise<Array<Booking>>;
    getAvailableDrivers(): Promise<Array<Driver>>;
    getBooking(id: bigint): Promise<Booking | null>;
    getBookingsByPhone(phone: string): Promise<Array<Booking>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDriver(id: bigint): Promise<Driver | null>;
    getDrivers(): Promise<Array<Driver>>;
    getInfo(): Promise<DriveEaseInfo>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    seedDrivers(): Promise<void>;
    seedMoreDrivers(): Promise<void>;
    updateBookingStatus(id: bigint, status: BookingStatus): Promise<void>;
    updateDriverAvailability(id: bigint, available: boolean): Promise<void>;
}
