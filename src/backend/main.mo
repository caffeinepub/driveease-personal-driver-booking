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
      // Maharashtra
      { id = 1; name = "Rajesh Kumar"; photo = ""; experienceYears = 10; languages = ["Hindi", "Marathi", "English"]; rating = 4.9; pricePerHour = 480; available = true; description = "Mumbai | 10 yrs exp. Covers South Mumbai, BKC, Andheri, Navi Mumbai and airport corridor. Punctual and professional." },
      { id = 2; name = "Nitin Patil"; photo = ""; experienceYears = 7; languages = ["Marathi", "Hindi", "English"]; rating = 4.7; pricePerHour = 400; available = true; description = "Pune | IT hub expert covering Hinjewadi, Wakad, Kothrud and Baner. Preferred corporate driver." },
      { id = 3; name = "Santosh Rao"; photo = ""; experienceYears = 9; languages = ["Marathi", "Hindi", "English"]; rating = 4.8; pricePerHour = 420; available = true; description = "Nagpur | Orange City and NH-6 corridor expert. Covers MIDC, Wardha Road and airport routes." },
      { id = 4; name = "Pravin Gaikwad"; photo = ""; experienceYears = 8; languages = ["Marathi", "Hindi", "English"]; rating = 4.6; pricePerHour = 360; available = true; description = "Aurangabad | Ellora, Ajanta tourist circuit and DMIC industrial zone specialist." },
      // Delhi NCR
      { id = 5; name = "Suresh Yadav"; photo = ""; experienceYears = 8; languages = ["Hindi", "Punjabi", "English"]; rating = 4.8; pricePerHour = 430; available = true; description = "Delhi | NCR specialist. Covers Connaught Place, Gurgaon, Noida and IGI airport. Expert in peak-hour routes." },
      { id = 6; name = "Ajit Sharma"; photo = ""; experienceYears = 6; languages = ["Hindi", "English"]; rating = 4.6; pricePerHour = 390; available = true; description = "Gurgaon | Cyber City, DLF Phase, Sohna Road and Golf Course Extension expert. Night rides available." },
      { id = 7; name = "Rohit Chauhan"; photo = ""; experienceYears = 5; languages = ["Hindi", "English"]; rating = 4.5; pricePerHour = 360; available = true; description = "Noida | Sector 62, 63, Greater Noida, Expressway and Yamuna Expressway specialist." },
      // Uttar Pradesh
      { id = 8; name = "Mohammad Irfan"; photo = ""; experienceYears = 7; languages = ["Hindi", "Urdu", "English"]; rating = 4.7; pricePerHour = 320; available = true; description = "Agra | Taj Mahal, Fatehpur Sikri and Yamuna Expressway route expert. Tourist trips preferred." },
      { id = 9; name = "Sanjay Mishra"; photo = ""; experienceYears = 6; languages = ["Hindi", "English"]; rating = 4.5; pricePerHour = 300; available = true; description = "Lucknow | Gomti Nagar, Hazratganj, Aliganj and Charbagh station routes covered expertly." },
      { id = 10; name = "Manish Tiwari"; photo = ""; experienceYears = 5; languages = ["Hindi", "English"]; rating = 4.4; pricePerHour = 275; available = true; description = "Varanasi | Ghats, BHU campus, Cantt station and Sarnath route specialist. Available round the clock." },
      { id = 11; name = "Raghunath Pandey"; photo = ""; experienceYears = 6; languages = ["Hindi", "Maithili", "English"]; rating = 4.5; pricePerHour = 270; available = true; description = "Muzaffarpur | North Bihar routes covering Darbhanga, Sitamarhi and Motihari. Reliable long-distance driver." },
      // Rajasthan
      { id = 12; name = "Arjun Singh"; photo = ""; experienceYears = 8; languages = ["Hindi", "Rajasthani", "English"]; rating = 4.6; pricePerHour = 330; available = true; description = "Jaipur | Pink City expert. Amber Fort, MI Road, Malviya Nagar and Sanganer airport routes." },
      { id = 13; name = "Dinesh Choudhary"; photo = ""; experienceYears = 7; languages = ["Hindi", "Rajasthani", "English"]; rating = 4.6; pricePerHour = 320; available = true; description = "Udaipur | Lake City specialist. Heritage circuits, Nathdwara and Chittorgarh routes covered." },
      { id = 14; name = "Roop Singh Chauhan"; photo = ""; experienceYears = 6; languages = ["Hindi", "English"]; rating = 4.5; pricePerHour = 310; available = true; description = "Jodhpur | Blue City driver. Jaisalmer desert route, Ranthambore safari and Barmer highway expert." },
      // Gujarat
      { id = 15; name = "Ramesh Patel"; photo = ""; experienceYears = 7; languages = ["Gujarati", "Hindi", "English"]; rating = 4.7; pricePerHour = 370; available = true; description = "Ahmedabad | GIFT City, SG Highway, Gandhinagar and Sardar Patel airport routes. Corporate trips expert." },
      { id = 16; name = "Sunil Kumar"; photo = ""; experienceYears = 7; languages = ["Gujarati", "Hindi", "English"]; rating = 4.6; pricePerHour = 345; available = true; description = "Surat | Diamond and textile market routes. Sachin GIDC, VIP Road and airport specialist." },
      { id = 17; name = "Ketan Shah"; photo = ""; experienceYears = 5; languages = ["Gujarati", "Hindi", "English"]; rating = 4.5; pricePerHour = 300; available = true; description = "Vadodara | Alkapuri, Manjalpur, Makarpura GIDC and Vadodara railway station routes expert." },
      // Karnataka
      { id = 18; name = "Mohan Das"; photo = ""; experienceYears = 12; languages = ["Kannada", "Hindi", "English"]; rating = 4.9; pricePerHour = 490; available = true; description = "Bengaluru | 12 yrs IT corridor master. Whitefield, Electronic City, Koramangala, HSR Layout specialist." },
      { id = 19; name = "Ashok Rao"; photo = ""; experienceYears = 10; languages = ["Kannada", "Tamil", "English"]; rating = 4.8; pricePerHour = 355; available = true; description = "Mysuru | Palace city expert. Chamundi Hills, Infosys campus and Bangalore-Mysore Expressway." },
      { id = 20; name = "Umesh Gowda"; photo = ""; experienceYears = 7; languages = ["Kannada", "Hindi", "English"]; rating = 4.6; pricePerHour = 320; available = true; description = "Hubli-Dharwad | North Karnataka expert. Belgaum, Gadag, Hospet and Tungabhadra belt routes." },
      // Tamil Nadu
      { id = 21; name = "Arun Kumar"; photo = ""; experienceYears = 8; languages = ["Tamil", "Hindi", "English"]; rating = 4.8; pricePerHour = 390; available = true; description = "Chennai | OMR, ECR, Tambaram, Anna Nagar and airport corridor. Night and early morning rides available." },
      { id = 22; name = "Anand Krishnamurthy"; photo = ""; experienceYears = 11; languages = ["Tamil", "Telugu", "Kannada", "English"]; rating = 4.9; pricePerHour = 430; available = true; description = "Madurai | Temple city expert. Trichy, Tirunelveli and South Tamil Nadu highway specialist." },
      { id = 23; name = "Krishnan Iyer"; photo = ""; experienceYears = 8; languages = ["Tamil", "Kannada", "English"]; rating = 4.7; pricePerHour = 355; available = true; description = "Coimbatore | Textile city driver. Tirupur corridor, Pollachi and Ooty ghat road specialist." },
      // Telangana / Andhra Pradesh
      { id = 24; name = "Venkatesh Reddy"; photo = ""; experienceYears = 11; languages = ["Telugu", "Hindi", "English"]; rating = 4.9; pricePerHour = 410; available = true; description = "Hyderabad | Cyberabad, HITECH City, Gachibowli and Rajiv Gandhi International Airport expert." },
      { id = 25; name = "Ravi Teja"; photo = ""; experienceYears = 8; languages = ["Telugu", "Hindi", "English"]; rating = 4.7; pricePerHour = 370; available = true; description = "Vijayawada | Krishna district and Amaravati capital region specialist. Port and NH-16 routes covered." },
      // Kerala
      { id = 26; name = "Karthik Nair"; photo = ""; experienceYears = 6; languages = ["Malayalam", "Tamil", "English"]; rating = 4.7; pricePerHour = 355; available = true; description = "Kochi | Ernakulam, Aluva, Kakkanad IT Park and Cochin International Airport expert." },
      { id = 27; name = "Vikram Pillai"; photo = ""; experienceYears = 9; languages = ["Malayalam", "Tamil", "English"]; rating = 4.8; pricePerHour = 370; available = true; description = "Thiruvananthapuram | Technopark, Kazhakkoottam and NH-66 coastal stretch. Reliable airport runs." },
      { id = 28; name = "Sreejith Menon"; photo = ""; experienceYears = 8; languages = ["Malayalam", "Tamil", "English"]; rating = 4.8; pricePerHour = 380; available = true; description = "Kozhikode | Malabar coast driver. Wayanad ghat roads, Malappuram and Calicut business hub." },
      // West Bengal
      { id = 29; name = "Pradeep Bose"; photo = ""; experienceYears = 13; languages = ["Bengali", "Hindi", "English"]; rating = 4.9; pricePerHour = 440; available = true; description = "Kolkata | 13 yrs veteran. Salt Lake, New Town, EM Bypass, Howrah and Netaji Subhash airport runs." },
      { id = 30; name = "Prem Bahadur Rai"; photo = ""; experienceYears = 8; languages = ["Nepali", "Hindi", "English"]; rating = 4.6; pricePerHour = 300; available = true; description = "Darjeeling | Tea garden roads, Ghoom, Mirik and Siliguri junction circuit expert." },
      // Punjab / Haryana / Chandigarh
      { id = 31; name = "Deepak Sharma"; photo = ""; experienceYears = 10; languages = ["Punjabi", "Hindi", "English"]; rating = 4.8; pricePerHour = 430; available = true; description = "Chandigarh | Tri-city expert covering Mohali, Panchkula and Ambala highway. Extremely punctual." },
      { id = 32; name = "Sukhwinder Singh"; photo = ""; experienceYears = 11; languages = ["Punjabi", "Hindi", "English"]; rating = 4.8; pricePerHour = 400; available = true; description = "Ludhiana | Punjab industrial belt driver. Jalandhar, Phagwara, Patiala and GT Road master." },
      { id = 33; name = "Naveen Sharma"; photo = ""; experienceYears = 9; languages = ["Punjabi", "Hindi", "English"]; rating = 4.8; pricePerHour = 410; available = true; description = "Amritsar | Golden Temple city expert. Wagah border, GT Road and Amritsar International Airport." },
      // Madhya Pradesh
      { id = 34; name = "Ajay Mehta"; photo = ""; experienceYears = 9; languages = ["Hindi", "English"]; rating = 4.8; pricePerHour = 370; available = true; description = "Indore | Vijay Nagar, Palasia, AB Road and Dewas-Pithampur industrial highway expert." },
      { id = 35; name = "Gopal Verma"; photo = ""; experienceYears = 7; languages = ["Hindi", "English"]; rating = 4.5; pricePerHour = 290; available = true; description = "Bhopal | New Market, Habibganj, Arera Colony and Bhopal-Indore NH-46 corridor specialist." },
      { id = 36; name = "Sameer Khan"; photo = ""; experienceYears = 6; languages = ["Hindi", "Urdu", "English"]; rating = 4.5; pricePerHour = 280; available = true; description = "Jabalpur | Marble Rocks, Cantt area, Dumna airport and Khandwa highway route expert." },
      // Bihar
      { id = 37; name = "Harish Yadav"; photo = ""; experienceYears = 5; languages = ["Hindi", "Bhojpuri", "English"]; rating = 4.4; pricePerHour = 260; available = true; description = "Patna | Boring Road, Bailey Road, Patna Sahib and Patna Junction vicinity expert." },
      // Jharkhand
      { id = 38; name = "Rajan Sinha"; photo = ""; experienceYears = 6; languages = ["Hindi", "English"]; rating = 4.4; pricePerHour = 270; available = true; description = "Ranchi | Industrial and mining belt routes. Jamshedpur, Dhanbad and Hazaribagh corridors." },
      // Odisha
      { id = 39; name = "Tarun Das"; photo = ""; experienceYears = 6; languages = ["Odia", "Hindi", "English"]; rating = 4.5; pricePerHour = 285; available = true; description = "Bhubaneswar | Smart city driver. Puri, Konark temple circuit and Cuttack NH-16 corridor." },
      { id = 40; name = "Bibhuti Bhushan"; photo = ""; experienceYears = 9; languages = ["Odia", "Hindi", "English"]; rating = 4.7; pricePerHour = 290; available = true; description = "Cuttack | Coastal Odisha expert. Chilika Lake, Gopalpur beach and Sambalpur highway routes." },
      // Chhattisgarh
      { id = 41; name = "Hemant Baghel"; photo = ""; experienceYears = 5; languages = ["Hindi", "Chhattisgarhi", "English"]; rating = 4.4; pricePerHour = 265; available = true; description = "Raipur | Steel city industrial routes. Bhilai Steel Plant, NIT Raipur and Durg corridor." },
      // Uttarakhand
      { id = 42; name = "Anil Negi"; photo = ""; experienceYears = 9; languages = ["Hindi", "Garhwali", "English"]; rating = 4.8; pricePerHour = 340; available = true; description = "Dehradun | Uttarakhand mountain routes. Mussoorie, Rishikesh, Haridwar and Jolly Grant airport." },
      // Himachal Pradesh
      { id = 43; name = "Rakesh Thakur"; photo = ""; experienceYears = 9; languages = ["Hindi", "Himachali", "English"]; rating = 4.8; pricePerHour = 360; available = true; description = "Shimla | Himachal Pradesh mountain expert. Manali, Kullu Valley, Dharamsala and Rohtang Pass specialist." },
      // Assam / North East
      { id = 44; name = "Bikash Bora"; photo = ""; experienceYears = 6; languages = ["Assamese", "Bengali", "Hindi"]; rating = 4.5; pricePerHour = 270; available = true; description = "Guwahati | NE gateway routes. Shillong, Tezpur, Jorhat and Kamakhya temple corridor." },
      { id = 45; name = "Dilip Konwar"; photo = ""; experienceYears = 6; languages = ["Assamese", "Hindi", "English"]; rating = 4.5; pricePerHour = 265; available = true; description = "Jorhat | Upper Assam tea garden routes. Kaziranga National Park and Majuli Island ferry specialist." },
      // Goa
      { id = 46; name = "Carlos Fernandes"; photo = ""; experienceYears = 7; languages = ["Konkani", "Hindi", "English"]; rating = 4.8; pricePerHour = 395; available = true; description = "Goa | Panaji, Margao, Calangute beach and Dabolim airport. Perfect for tourist circuits and party transfers." },
      // J&K / Ladakh
      { id = 47; name = "Imran Malik"; photo = ""; experienceYears = 8; languages = ["Kashmiri", "Urdu", "Hindi", "English"]; rating = 4.7; pricePerHour = 350; available = true; description = "Srinagar | Dal Lake, Gulmarg, Pahalgam and Sonmarg routes. Safe mountain driving with proper equipment." },
      { id = 48; name = "Phurbu Wangchuk"; photo = ""; experienceYears = 10; languages = ["Ladakhi", "Hindi", "English"]; rating = 4.9; pricePerHour = 520; available = true; description = "Leh-Ladakh | High altitude specialist. Khardung La, Pangong Lake, Nubra Valley and Tso Moriri routes." },
      // Sikkim / Meghalaya / NE States
      { id = 49; name = "Tenzin Dorjee"; photo = ""; experienceYears = 7; languages = ["Nepali", "Hindi", "English"]; rating = 4.7; pricePerHour = 290; available = true; description = "Gangtok | Sikkim specialist. Nathu La Pass, Tsomgo Lake, North Sikkim adventure routes and Bagdogra airport." },
      { id = 50; name = "Bhaskar Debnath"; photo = ""; experienceYears = 7; languages = ["Bengali", "Hindi", "English"]; rating = 4.6; pricePerHour = 260; available = true; description = "Agartala | Tripura and NE India specialist. Udaipur, Dharmanagar and international border routes." },
      { id = 51; name = "Temjen Longkumer"; photo = ""; experienceYears = 6; languages = ["Nagamese", "Hindi", "English"]; rating = 4.5; pricePerHour = 270; available = true; description = "Kohima | Nagaland driver. Dimapur commercial hub, NH-29 mountain route and Hornbill Festival circuit." },
      { id = 52; name = "Lalbiakzuala"; photo = ""; experienceYears = 5; languages = ["Mizo", "Hindi", "English"]; rating = 4.5; pricePerHour = 265; available = true; description = "Aizawl | Mizoram hill roads expert. Lunglei, Champhai and Myanmar border corridor. Excellent safety record." },
      { id = 53; name = "Kh. Suraj Singh"; photo = ""; experienceYears = 6; languages = ["Meitei", "Hindi", "English"]; rating = 4.4; pricePerHour = 260; available = true; description = "Imphal | Manipur highway specialist. Moreh border crossing, Loktak Lake and Kangla Fort routes." },
      // Additional cities
      { id = 54; name = "Surendra Bisht"; photo = ""; experienceYears = 7; languages = ["Hindi", "English"]; rating = 4.6; pricePerHour = 310; available = true; description = "Kanpur | Industrial city driver covering GT Road, Panki, Kidwai Nagar and Chakeri airport route." },
      { id = 55; name = "Pradeep Soni"; photo = ""; experienceYears = 8; languages = ["Hindi", "Rajasthani", "English"]; rating = 4.7; pricePerHour = 330; available = true; description = "Kota | Coaching city driver. DC, Jawahar Nagar, Chambal River and Kota-Jaipur highway specialist." },
      { id = 56; name = "Ganesh Kadam"; photo = ""; experienceYears = 6; languages = ["Marathi", "Hindi", "English"]; rating = 4.6; pricePerHour = 350; available = true; description = "Nashik | Wine city and pilgrim route driver. Shirdi, Trimbakeshwar and Nashik-Mumbai NH-3 expert." },
      { id = 57; name = "Lokesh Naik"; photo = ""; experienceYears = 7; languages = ["Kannada", "Hindi", "English"]; rating = 4.6; pricePerHour = 305; available = true; description = "Mangaluru | Port city driver. Udupi, Kasaragod coastal highway and Mangaluru airport specialist." },
      { id = 58; name = "P. Sundaram"; photo = ""; experienceYears = 9; languages = ["Tamil", "English"]; rating = 4.7; pricePerHour = 360; available = true; description = "Tiruchirappalli | Trichy and Thanjavur temple belt driver. Karur, Salem and Pudukkottai routes covered." },
      { id = 59; name = "Sajid Hussain"; photo = ""; experienceYears = 5; languages = ["Hindi", "Urdu", "English"]; rating = 4.4; pricePerHour = 280; available = true; description = "Allahabad (Prayagraj) | Sangam, Civil Lines, Naini and Magh Mela routes. Pilgrimage trips specialty." },
      { id = 60; name = "Victor D'Souza"; photo = ""; experienceYears = 8; languages = ["Konkani", "Kannada", "Hindi", "English"]; rating = 4.7; pricePerHour = 340; available = true; description = "Belgaum (Belagavi) | North Karnataka-Goa border driver. Kolhapur, Hubli and Pune-Bangalore Highway expert." }
    ];

    for (driver in sampleDrivers.values()) {
      drivers.add(driver.id, driver);
    };
    nextDriverId := 61;
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
