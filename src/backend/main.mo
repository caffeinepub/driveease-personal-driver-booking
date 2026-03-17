import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Float "mo:core/Float";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Iter "mo:core/Iter";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import OutCall "http-outcalls/outcall";

import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  include MixinStorage();

  module Driver {
    public type Driver = {
      id : Nat;
      name : Text;
      photo : Text;
      experienceYears : Nat;
      languages : [Text];
      rating : Float;
      pricePerHour : Nat;
      available : Bool;
      description : Text;
    };
  };

  type Driver = Driver.Driver;

  module Booking {
    public type BookingStatus = {
      #pending;
      #confirmed;
      #completed;
      #cancelled;
    };

    public type Booking = {
      id : Nat;
      customerName : Text;
      customerPhone : Text;
      pickupAddress : Text;
      destination : Text;
      date : Int;
      time : Text;
      durationHours : Nat;
      driverId : Nat;
      totalPrice : Nat;
      status : BookingStatus;
      createdAt : Int;
      createdBy : Principal;
    };
  };

  type Booking = Booking.Booking;
  type BookingStatus = Booking.BookingStatus;

  public type UserProfile = {
    name : Text;
    phone : Text;
  };

  type DriverRegistration = {
    id : Nat;
    name : Text;
    phone : Text;
    email : Text;
    city : Text;
    state : Text;
    experience : Text;
    licenseNumber : Text;
    aadhaarNumber : Text;
    about : Text;
    status : DriverRegistrationStatus;
    createdAt : Int;
    applicationId : Text;
  };

  type DriverRegistrationStatus = { #pending; #approved; #rejected };

  let drivers = Map.empty<Nat, Driver>();
  let bookings = Map.empty<Nat, Booking>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let registrations = Map.empty<Nat, DriverRegistration>();

  var nextDriverId = 1;
  var nextBookingId = 1;
  var nextRegistrationId = 1;

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func seedDrivers() : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can seed drivers");
    };
    if (drivers.size() > 0) {
      return;
    };

    let sampleDrivers : [Driver] = [
      { id = 1; name = "Rajesh Kumar"; photo = ""; experienceYears = 10; languages = ["Hindi", "Marathi", "English"]; rating = 4.9; pricePerHour = 480; available = true; description = "Mumbai | 10 yrs exp. Covers South Mumbai, BKC, Andheri, Navi Mumbai and airport corridor. Punctual and professional." },
      { id = 2; name = "Nitin Patil"; photo = ""; experienceYears = 7; languages = ["Marathi", "Hindi", "English"]; rating = 4.7; pricePerHour = 400; available = true; description = "Pune | IT hub expert covering Hinjewadi, Wakad, Kothrud and Baner. Preferred corporate driver." },
    ];

    for (driver in sampleDrivers.values()) {
      drivers.add(driver.id, driver);
    };
    nextDriverId := 181;
  };

  public shared ({ caller }) func addDriver(
    name : Text,
    photo : Text,
    experienceYears : Nat,
    languages : [Text],
    rating : Float,
    pricePerHour : Nat,
    description : Text,
  ) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add drivers");
    };
    let driver : Driver = {
      id = nextDriverId;
      name;
      photo;
      experienceYears;
      languages;
      rating;
      pricePerHour;
      available = true;
      description;
    };
    drivers.add(nextDriverId, driver);
    nextDriverId += 1;
    driver.id;
  };

  public shared ({ caller }) func updateDriverAvailability(id : Nat, available : Bool) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update driver availability");
    };
    switch (drivers.get(id)) {
      case (?driver) {
        drivers.add(id, { id = driver.id; name = driver.name; photo = driver.photo; experienceYears = driver.experienceYears; languages = driver.languages; rating = driver.rating; pricePerHour = driver.pricePerHour; available; description = driver.description });
      };
      case (null) { Runtime.trap("Driver not found") };
    };
  };

  public shared ({ caller }) func deleteDriver(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete drivers");
    };
    if (drivers.containsKey(id)) { drivers.remove(id) } else { Runtime.trap("Driver not found") };
  };

  public query func getDrivers() : async [Driver] {
    drivers.values().toArray();
  };

  public query func getAvailableDrivers() : async [Driver] {
    let available = List.empty<Driver>();
    for (driver in drivers.values()) {
      if (driver.available) available.add(driver);
    };
    available.toArray();
  };

  public query func getDriver(id : Nat) : async ?Driver {
    drivers.get(id);
  };

  public shared ({ caller }) func createBooking(
    customerName : Text,
    customerPhone : Text,
    pickupAddress : Text,
    destination : Text,
    date : Int,
    time : Text,
    durationHours : Nat,
    driverId : Nat,
  ) : async Nat {
    if (customerName == "" or customerPhone == "" or pickupAddress == "" or destination == "") {
      Runtime.trap("All fields are required");
    };
    let driver = switch (drivers.get(driverId)) {
      case (?d) { d };
      case (null) { Runtime.trap("Driver not found") };
    };
    if (not driver.available) { Runtime.trap("Driver is not available") };
    let bookingId = nextBookingId;
    nextBookingId += 1;
    let booking : Booking = {
      id = bookingId;
      customerName;
      customerPhone;
      pickupAddress;
      destination;
      date;
      time;
      durationHours;
      driverId;
      totalPrice = driver.pricePerHour * durationHours;
      status = #pending;
      createdAt = Time.now();
      createdBy = caller;
    };
    bookings.add(bookingId, booking);
    bookingId;
  };

  public query func getBooking(id : Nat) : async ?Booking {
    bookings.get(id);
  };

  public query func getBookingsByPhone(phone : Text) : async [Booking] {
    let result = List.empty<Booking>();
    for (booking in bookings.values()) {
      if (booking.customerPhone == phone) result.add(booking);
    };
    result.toArray();
  };

  public shared ({ caller }) func updateBookingStatus(id : Nat, status : BookingStatus) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update booking status");
    };
    switch (bookings.get(id)) {
      case (?booking) {
        bookings.add(id, { id = booking.id; customerName = booking.customerName; customerPhone = booking.customerPhone; pickupAddress = booking.pickupAddress; destination = booking.destination; date = booking.date; time = booking.time; durationHours = booking.durationHours; driverId = booking.driverId; totalPrice = booking.totalPrice; status; createdAt = booking.createdAt; createdBy = booking.createdBy });
      };
      case (null) { Runtime.trap("Booking not found") };
    };
  };

  public query ({ caller }) func getAllBookings() : async [Booking] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all bookings");
    };
    bookings.values().toArray();
  };

  public shared func submitDriverRegistration(
    name : Text,
    phone : Text,
    email : Text,
    city : Text,
    state : Text,
    experience : Text,
    licenseNumber : Text,
    aadhaarNumber : Text,
    about : Text,
  ) : async Text {
    let id = nextRegistrationId;
    nextRegistrationId += 1;

    let applicationId = "DRV-" # id.toText();

    let registration : DriverRegistration = {
      id;
      name;
      phone;
      email;
      city;
      state;
      experience;
      licenseNumber;
      aadhaarNumber;
      about;
      status = #pending;
      createdAt = Time.now();
      applicationId;
    };

    registrations.add(id, registration);
    applicationId;
  };

  public query ({ caller }) func getPendingRegistrations() : async [DriverRegistration] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view pending registrations");
    };
    let iter = registrations.values();
    let filtered = iter.filter(
      func(reg) {
        reg.status == #pending;
      }
    );
    filtered.toArray();
  };

  public query ({ caller }) func getAllRegistrations() : async [DriverRegistration] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all registrations");
    };
    registrations.values().toArray();
  };

  public shared ({ caller }) func approveDriverRegistration(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can approve driver registrations");
    };
    switch (registrations.get(id)) {
      case (?reg) {
        let updatedReg = {
          id = reg.id;
          name = reg.name;
          phone = reg.phone;
          email = reg.email;
          city = reg.city;
          state = reg.state;
          experience = reg.experience;
          licenseNumber = reg.licenseNumber;
          aadhaarNumber = reg.aadhaarNumber;
          about = reg.about;
          status = #approved;
          createdAt = reg.createdAt;
          applicationId = reg.applicationId;
        };
        registrations.add(id, updatedReg);

        // Also create corresponding Driver record
        let driver : Driver = {
          id = nextDriverId;
          name = reg.name;
          photo = "";
          experienceYears = 0;
          languages = [];
          rating = 0.0;
          pricePerHour = 0;
          available = true;
          description = "";
        };
        drivers.add(nextDriverId, driver);
        nextDriverId += 1;

        // Send SMS via HTTP outcall
        let smsMessage = "Your DriveEase profile has been approved. You can now login and start working.";
        ignore sendSMS(reg.phone, smsMessage);
      };
      case (null) { Runtime.trap("Registration not found") };
    };
  };

  public shared ({ caller }) func rejectDriverRegistration(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can reject driver registrations");
    };
    switch (registrations.get(id)) {
      case (?reg) {
        let updatedReg = {
          id = reg.id;
          name = reg.name;
          phone = reg.phone;
          email = reg.email;
          city = reg.city;
          state = reg.state;
          experience = reg.experience;
          licenseNumber = reg.licenseNumber;
          aadhaarNumber = reg.aadhaarNumber;
          about = reg.about;
          status = #rejected;
          createdAt = reg.createdAt;
          applicationId = reg.applicationId;
        };
        registrations.add(id, updatedReg);
      };
      case (null) { Runtime.trap("Registration not found") };
    };
  };

  public query func getDriverRegistrationByPhone(phone : Text) : async ?DriverRegistration {
    let iter = registrations.values();
    switch (iter.find(
      func(reg) {
        reg.phone == phone;
      }
    )) {
      case (?found) { ?found };
      case (null) { null };
    };
  };

  func sendSMS(phone : Text, message : Text) : async () {
    let apiKey = "YOUR_FAST2SMS_API_KEY";
    let url = "https://www.fast2sms.com/dev/bulkV2";

    let payload = "{\"sender_id\":\"DRVEAS\",\"message\":\"" # message #
      "\",\"route\":\"dlt\",\"numbers\":\"" # phone # "\"}";

    let headers = [
      { name = "authorization"; value = apiKey },
      { name = "Content-Type"; value = "application/json" },
      { name = "accept"; value = "application/json" },
    ];

    try {
      ignore OutCall.httpPostRequest(url, headers, payload, transform);
    } catch (err) {
      // Ignore errors intentionally (fire-and-forget)
    };
  };

  public query ({ caller }) func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // ── Customer Profile ──────────────────────────────────────────────────────
  type CustomerProfile = {
    id : Nat;
    name : Text;
    mobile : Text;
    email : Text;
    createdAt : Int;
  };

  let customers = Map.empty<Nat, CustomerProfile>();
  var nextCustomerId = 1;

  public shared func registerOrLoginByMobile(name : Text, mobile : Text) : async CustomerProfile {
    for (c in customers.values()) {
      if (c.mobile == mobile) { return c };
    };
    let id = nextCustomerId;
    nextCustomerId += 1;
    let profile : CustomerProfile = { id; name; mobile; email = ""; createdAt = Time.now() };
    customers.add(id, profile);
    profile;
  };

  public shared func registerOrLoginByEmail(name : Text, email : Text) : async CustomerProfile {
    for (c in customers.values()) {
      if (c.email == email) { return c };
    };
    let id = nextCustomerId;
    nextCustomerId += 1;
    let profile : CustomerProfile = { id; name = name; mobile = ""; email; createdAt = Time.now() };
    customers.add(id, profile);
    profile;
  };

  public query func getCustomerByMobile(mobile : Text) : async ?CustomerProfile {
    for (c in customers.values()) {
      if (c.mobile == mobile) { return ?c };
    };
    null;
  };

  public query func getCustomerByEmail(email : Text) : async ?CustomerProfile {
    for (c in customers.values()) {
      if (c.email == email) { return ?c };
    };
    null;
  };

  public query ({ caller }) func getAllCustomers() : async [CustomerProfile] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all customers");
    };
    customers.values().toArray();
  };
};
