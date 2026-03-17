import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface DriverRegistration {
    id: bigint;
    status: DriverRegistrationStatus;
    about: string;
    applicationId: string;
    city: string;
    name: string;
    createdAt: bigint;
    email: string;
    experience: string;
    state: string;
    licenseNumber: string;
    aadhaarNumber: string;
    phone: string;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
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
export interface CustomerProfile {
    id: bigint;
    name: string;
    createdAt: bigint;
    email: string;
    mobile: string;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
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
export enum DriverRegistrationStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addDriver(name: string, photo: string, experienceYears: bigint, languages: Array<string>, rating: number, pricePerHour: bigint, description: string): Promise<bigint>;
    approveDriverRegistration(id: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createBooking(customerName: string, customerPhone: string, pickupAddress: string, destination: string, date: bigint, time: string, durationHours: bigint, driverId: bigint): Promise<bigint>;
    deleteDriver(id: bigint): Promise<void>;
    getAllBookings(): Promise<Array<Booking>>;
    getAllCustomers(): Promise<Array<CustomerProfile>>;
    getAllRegistrations(): Promise<Array<DriverRegistration>>;
    getAvailableDrivers(): Promise<Array<Driver>>;
    getBooking(id: bigint): Promise<Booking | null>;
    getBookingsByPhone(phone: string): Promise<Array<Booking>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCustomerByEmail(email: string): Promise<CustomerProfile | null>;
    getCustomerByMobile(mobile: string): Promise<CustomerProfile | null>;
    getDriver(id: bigint): Promise<Driver | null>;
    getDriverRegistrationByPhone(phone: string): Promise<DriverRegistration | null>;
    getDrivers(): Promise<Array<Driver>>;
    getPendingRegistrations(): Promise<Array<DriverRegistration>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    registerOrLoginByEmail(name: string, email: string): Promise<CustomerProfile>;
    registerOrLoginByMobile(name: string, mobile: string): Promise<CustomerProfile>;
    rejectDriverRegistration(id: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    seedDrivers(): Promise<void>;
    submitDriverRegistration(name: string, phone: string, email: string, city: string, state: string, experience: string, licenseNumber: string, aadhaarNumber: string, about: string): Promise<string>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateBookingStatus(id: bigint, status: BookingStatus): Promise<void>;
    updateDriverAvailability(id: bigint, available: boolean): Promise<void>;
}
