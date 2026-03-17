import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Float "mo:core/Float";
import Principal "mo:core/Principal";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
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

  let drivers = Map.empty<Nat, Driver>();
  let bookings = Map.empty<Nat, Booking>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var nextDriverId = 1;
  var nextBookingId = 1;

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    userProfiles.add(caller, profile);
  };

  public shared func seedDrivers() : async () {
    if (drivers.size() > 0) return;

    let sampleDrivers : [Driver] = [
      { id = 1; name = "Rajesh Kumar"; photo = ""; experienceYears = 8; languages = ["Hindi", "Marathi", "English"]; rating = 4.9; pricePerHour = 450; available = true; description = "Expert Mumbai city driver with 8 years on all major routes. Reliable, punctual and professional." },
      { id = 2; name = "Suresh Yadav"; photo = ""; experienceYears = 6; languages = ["Hindi", "Punjabi", "English"]; rating = 4.7; pricePerHour = 400; available = true; description = "Delhi NCR specialist. Knows every shortcut and flyover. Perfect for corporate trips." },
      { id = 3; name = "Venkatesh Reddy"; photo = ""; experienceYears = 10; languages = ["Telugu", "Hindi", "English"]; rating = 4.8; pricePerHour = 380; available = true; description = "Hyderabad veteran driver. Expert in Cyberabad tech corridors and airport runs." },
      { id = 4; name = "Ramesh Patel"; photo = ""; experienceYears = 5; languages = ["Gujarati", "Hindi", "English"]; rating = 4.6; pricePerHour = 350; available = true; description = "Ahmedabad city expert. Comfortable with GIFT City, highways and rural routes." },
      { id = 5; name = "Arjun Singh"; photo = ""; experienceYears = 7; languages = ["Hindi", "Rajasthani", "English"]; rating = 4.5; pricePerHour = 300; available = true; description = "Jaipur heritage route specialist. Perfect for tourist circuits and business trips." },
      { id = 6; name = "Deepak Sharma"; photo = ""; experienceYears = 9; languages = ["Punjabi", "Hindi", "English"]; rating = 4.8; pricePerHour = 420; available = true; description = "Chandigarh and tri-city expert. Highway driving specialist, extremely punctual." },
      { id = 7; name = "Mohan Das"; photo = ""; experienceYears = 11; languages = ["Kannada", "Hindi", "English"]; rating = 4.9; pricePerHour = 480; available = true; description = "Bengaluru IT corridor master. Whitefield, Electronic City, Koramangala - no traffic jams with me." },
      { id = 8; name = "Karthik Nair"; photo = ""; experienceYears = 4; languages = ["Malayalam", "Tamil", "English"]; rating = 4.6; pricePerHour = 340; available = true; description = "Kochi specialist covering Ernakulam, Aluva and airport corridor with ease." },
      { id = 9; name = "Arun Kumar"; photo = ""; experienceYears = 7; languages = ["Tamil", "Hindi", "English"]; rating = 4.7; pricePerHour = 370; available = true; description = "Chennai expert navigating OMR, ECR and city routes. Night drives available." },
      { id = 10; name = "Sanjay Mishra"; photo = ""; experienceYears = 6; languages = ["Hindi", "English"]; rating = 4.5; pricePerHour = 290; available = true; description = "Lucknow city driver covering Gomti Nagar, Hazratganj and all major business hubs." },
      { id = 11; name = "Bikash Bora"; photo = ""; experienceYears = 5; languages = ["Assamese", "Bengali", "Hindi"]; rating = 4.4; pricePerHour = 260; available = true; description = "Guwahati specialist with NE route knowledge. Reliable for airport and long-distance trips." },
      { id = 12; name = "Ravi Teja"; photo = ""; experienceYears = 8; languages = ["Telugu", "Hindi", "English"]; rating = 4.7; pricePerHour = 360; available = true; description = "Vijayawada and Krishna district expert. Covering Amaravati and port areas." },
      { id = 13; name = "Nitin Patil"; photo = ""; experienceYears = 6; languages = ["Marathi", "Hindi", "English"]; rating = 4.6; pricePerHour = 390; available = true; description = "Pune IT hub specialist covering Hinjewadi, Kothrud and Baner. Corporate driver preferred." },
      { id = 14; name = "Gopal Verma"; photo = ""; experienceYears = 7; languages = ["Hindi", "English"]; rating = 4.5; pricePerHour = 280; available = true; description = "Bhopal city and Madhya Pradesh highway driver. Well-versed in inter-city routes." },
      { id = 15; name = "Santosh Rao"; photo = ""; experienceYears = 9; languages = ["Marathi", "Hindi", "English"]; rating = 4.8; pricePerHour = 410; available = true; description = "Nagpur logistics hub specialist. Orange City routes and NH-6 corridor expert." },
      { id = 16; name = "Harish Yadav"; photo = ""; experienceYears = 4; languages = ["Hindi", "Bhojpuri", "English"]; rating = 4.3; pricePerHour = 250; available = true; description = "Patna city driver covering all major government offices and Ganga ghats." },
      { id = 17; name = "Dinesh Choudhary"; photo = ""; experienceYears = 6; languages = ["Hindi", "Rajasthani", "English"]; rating = 4.5; pricePerHour = 310; available = true; description = "Udaipur lake city specialist. Heritage circuits and Rajasthan highway expert." },
      { id = 18; name = "Pradeep Bose"; photo = ""; experienceYears = 12; languages = ["Bengali", "Hindi", "English"]; rating = 4.9; pricePerHour = 430; available = true; description = "Kolkata veteran with 12 years covering Salt Lake, New Town and port area." },
      { id = 19; name = "Manish Tiwari"; photo = ""; experienceYears = 5; languages = ["Hindi", "English"]; rating = 4.4; pricePerHour = 270; available = true; description = "Varanasi city guide-driver. Ghats, temple routes and BHU campus specialist." },
      { id = 20; name = "Sunil Kumar"; photo = ""; experienceYears = 7; languages = ["Gujarati", "Hindi", "English"]; rating = 4.6; pricePerHour = 330; available = true; description = "Surat diamond city driver. Textile market and industrial estate routes expert." },
      { id = 21; name = "Anil Negi"; photo = ""; experienceYears = 8; languages = ["Hindi", "Garhwali", "English"]; rating = 4.7; pricePerHour = 320; available = true; description = "Dehradun and Uttarakhand mountain routes specialist. Forest road expert, never lost." },
      { id = 22; name = "Rajan Sinha"; photo = ""; experienceYears = 5; languages = ["Hindi", "English"]; rating = 4.4; pricePerHour = 265; available = true; description = "Ranchi city driver covering all industrial and mining belt routes in Jharkhand." },
      { id = 23; name = "Vikram Pillai"; photo = ""; experienceYears = 9; languages = ["Malayalam", "Tamil", "English"]; rating = 4.8; pricePerHour = 360; available = true; description = "Thiruvananthapuram expert. Airport, Technopark and NH-66 coastal stretch specialist." },
      { id = 24; name = "Sameer Khan"; photo = ""; experienceYears = 6; languages = ["Hindi", "Urdu", "English"]; rating = 4.6; pricePerHour = 295; available = true; description = "Bhopal city driver covering old city, new market and Habibganj railway areas." },
      { id = 25; name = "Ashok Rao"; photo = ""; experienceYears = 10; languages = ["Kannada", "Tamil", "English"]; rating = 4.7; pricePerHour = 340; available = true; description = "Mysuru palace city expert. Tourist circuit, Chamundi Hills and Infosys campus routes." },
      { id = 26; name = "Tarun Das"; photo = ""; experienceYears = 5; languages = ["Odia", "Hindi", "English"]; rating = 4.5; pricePerHour = 275; available = true; description = "Bhubaneswar smart city driver. Puri, Konark and temple corridor specialist." },
      { id = 27; name = "Hemant Baghel"; photo = ""; experienceYears = 4; languages = ["Hindi", "Chhattisgarhi", "English"]; rating = 4.3; pricePerHour = 255; available = true; description = "Raipur city driver covering steel city industrial routes and NIT campus area." },
      { id = 28; name = "Naveen Sharma"; photo = ""; experienceYears = 8; languages = ["Punjabi", "Hindi", "English"]; rating = 4.8; pricePerHour = 400; available = true; description = "Amritsar Golden Temple city expert. Wagah border, airport and GT Road specialist." },
      { id = 29; name = "Krishnan Iyer"; photo = ""; experienceYears = 7; languages = ["Tamil", "Kannada", "English"]; rating = 4.7; pricePerHour = 345; available = true; description = "Coimbatore textile city driver. Tirupur corridor, Ooty ghat road expert." },
      { id = 30; name = "Ajay Mehta"; photo = ""; experienceYears = 9; languages = ["Hindi", "English"]; rating = 4.8; pricePerHour = 360; available = true; description = "Indore city expert covering Vijay Nagar, Palasia and Dewas highway routes." },
      { id = 31; name = "Carlos Fernandes"; photo = ""; experienceYears = 6; languages = ["Konkani", "Hindi", "English"]; rating = 4.7; pricePerHour = 380; available = true; description = "Goa expert covering Panaji, Margao, beaches and Dabolim airport. Perfect for tourist circuits." },
      { id = 32; name = "Rakesh Thakur"; photo = ""; experienceYears = 8; languages = ["Hindi", "Himachali", "English"]; rating = 4.8; pricePerHour = 350; available = true; description = "Shimla and Himachal Pradesh mountain driving expert. Manali, Kullu and Rohtang Pass specialist." },
      { id = 33; name = "Imran Malik"; photo = ""; experienceYears = 7; languages = ["Kashmiri", "Urdu", "Hindi", "English"]; rating = 4.6; pricePerHour = 340; available = true; description = "Srinagar and Kashmir Valley expert. Dal Lake, Gulmarg and Pahalgam routes covered safely." },
      { id = 34; name = "Phurbu Wangchuk"; photo = ""; experienceYears = 9; languages = ["Ladakhi", "Hindi", "English"]; rating = 4.9; pricePerHour = 500; available = true; description = "Leh-Ladakh high altitude driving specialist. Khardung La, Pangong Lake and Nubra Valley expert." },
      { id = 35; name = "Lalbiakzuala"; photo = ""; experienceYears = 5; languages = ["Mizo", "Hindi", "English"]; rating = 4.5; pricePerHour = 260; available = true; description = "Aizawl city driver covering all Mizoram routes. Hill road expert with excellent safety record." },
      { id = 36; name = "Kh. Suraj Singh"; photo = ""; experienceYears = 6; languages = ["Meitei", "Hindi", "English"]; rating = 4.4; pricePerHour = 255; available = true; description = "Imphal city and Manipur highway specialist. Moreh border and Loktak Lake routes covered." },
      { id = 37; name = "Bhaskar Debnath"; photo = ""; experienceYears = 7; languages = ["Bengali", "Hindi", "English"]; rating = 4.6; pricePerHour = 250; available = true; description = "Agartala and Tripura specialist. Udaipur, Dharmanagar and international border routes expert." },
      { id = 38; name = "Temjen Longkumer"; photo = ""; experienceYears = 5; languages = ["Nagamese", "Hindi", "English"]; rating = 4.5; pricePerHour = 260; available = true; description = "Kohima and Nagaland driver. Dimapur commercial hub and NH-29 mountain route specialist." },
      { id = 39; name = "Tenzin Dorjee"; photo = ""; experienceYears = 6; languages = ["Nepali", "Hindi", "English"]; rating = 4.7; pricePerHour = 280; available = true; description = "Gangtok and Sikkim specialist. Nathu La Pass, Tsomgo Lake and North Sikkim adventure routes." },
      { id = 40; name = "Prem Bahadur Rai"; photo = ""; experienceYears = 8; languages = ["Nepali", "Hindi", "English"]; rating = 4.6; pricePerHour = 290; available = true; description = "Darjeeling and West Bengal hills expert. Tea garden roads, Ghoom and Mirik circuits covered." },
      { id = 41; name = "Mohammad Irfan"; photo = ""; experienceYears = 7; languages = ["Hindi", "Urdu", "English"]; rating = 4.7; pricePerHour = 310; available = true; description = "Agra and Mathura specialist. Taj Mahal, Vrindavan and NH-19 Yamuna Expressway expert." },
      { id = 42; name = "Sukhwinder Singh"; photo = ""; experienceYears = 10; languages = ["Punjabi", "Hindi", "English"]; rating = 4.8; pricePerHour = 390; available = true; description = "Ludhiana and Punjab industrial belt driver. Jalandhar, Patiala and GT Road highway master." },
      { id = 43; name = "Pravin Gaikwad"; photo = ""; experienceYears = 7; languages = ["Marathi", "Hindi", "English"]; rating = 4.6; pricePerHour = 355; available = true; description = "Aurangabad and Marathwada driver. Ellora, Ajanta caves tourist route and MIDC area specialist." },
      { id = 44; name = "Bibhuti Bhushan"; photo = ""; experienceYears = 9; languages = ["Odia", "Hindi", "English"]; rating = 4.7; pricePerHour = 280; available = true; description = "Cuttack and coastal Odisha expert. Chilika Lake, Gopalpur beach and Sambalpur highway routes." },
      { id = 45; name = "Roop Singh Chauhan"; photo = ""; experienceYears = 6; languages = ["Hindi", "English"]; rating = 4.5; pricePerHour = 300; available = true; description = "Jodhpur Blue City driver. Jaisalmer desert route, Ranthambore and Barmer highway expert." },
      { id = 46; name = "Sreejith Menon"; photo = ""; experienceYears = 8; languages = ["Malayalam", "Tamil", "English"]; rating = 4.8; pricePerHour = 370; available = true; description = "Kozhikode and Malabar coast driver. Wayanad ghat roads and Calicut business hub specialist." },
      { id = 47; name = "Anand Krishnamurthy"; photo = ""; experienceYears = 11; languages = ["Tamil", "Telugu", "Kannada", "English"]; rating = 4.9; pricePerHour = 420; available = true; description = "Madurai temple city expert. Trichy, Tirunelveli and South Tamil Nadu highway specialist with 11 years." },
      { id = 48; name = "Dilip Konwar"; photo = ""; experienceYears = 5; languages = ["Assamese", "Hindi", "English"]; rating = 4.4; pricePerHour = 255; available = true; description = "Jorhat and upper Assam tea garden routes expert. Kaziranga National Park and forest zone specialist." },
      { id = 49; name = "Raghunath Pandey"; photo = ""; experienceYears = 6; languages = ["Hindi", "Maithili", "English"]; rating = 4.5; pricePerHour = 265; available = true; description = "Muzaffarpur and North Bihar specialist. Darbhanga, Sitamarhi and Motihari routes covered." },
      { id = 50; name = "Umesh Gowda"; photo = ""; experienceYears = 7; languages = ["Kannada", "Hindi", "English"]; rating = 4.6; pricePerHour = 315; available = true; description = "Hubli-Dharwad driver covering north Karnataka. Belgaum, Gadag and Hospet routes expert." }
    ];

    for (driver in sampleDrivers.values()) {
      drivers.add(driver.id, driver);
    };
    nextDriverId := 51;
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
    if (not AccessControl.isAdmin(accessControlState, caller)) {
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
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update availability");
    };
    switch (drivers.get(id)) {
      case (?driver) {
        drivers.add(id, { id = driver.id; name = driver.name; photo = driver.photo; experienceYears = driver.experienceYears; languages = driver.languages; rating = driver.rating; pricePerHour = driver.pricePerHour; available; description = driver.description });
      };
      case (null) { Runtime.trap("Driver not found") };
    };
  };

  public shared ({ caller }) func deleteDriver(id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
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

  public shared func createBooking(
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
      createdBy = Principal.fromText("aaaaa-aa");
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
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update status");
    };
    switch (bookings.get(id)) {
      case (?booking) {
        bookings.add(id, { id = booking.id; customerName = booking.customerName; customerPhone = booking.customerPhone; pickupAddress = booking.pickupAddress; destination = booking.destination; date = booking.date; time = booking.time; durationHours = booking.durationHours; driverId = booking.driverId; totalPrice = booking.totalPrice; status; createdAt = booking.createdAt; createdBy = booking.createdBy });
      };
      case (null) { Runtime.trap("Booking not found") };
    };
  };

  public query ({ caller }) func getAllBookings() : async [Booking] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all bookings");
    };
    bookings.values().toArray();
  };

  public type DriveEaseInfo = {
    drivers : [Driver];
    adminId : Principal;
  };

  public query func getInfo() : async DriveEaseInfo {
    { drivers = drivers.values().toArray(); adminId = Principal.fromText("aaaaa-aa") };
  };
};
