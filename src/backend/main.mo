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
      { id = 60; name = "Victor D'Souza"; photo = ""; experienceYears = 8; languages = ["Konkani", "Kannada", "Hindi", "English"]; rating = 4.7; pricePerHour = 340; available = true; description = "Belgaum (Belagavi) | North Karnataka-Goa border driver. Kolhapur, Hubli and Pune-Bangalore Highway expert." },
      // Batch 2 (61-80)
      { id = 61; name = "Tshering Wangchuk"; photo = ""; experienceYears = 8; languages = ["Nepali", "Hindi", "English"]; rating = 4.8; pricePerHour = 295; available = true; description = "Gangtok | Sikkim mountain roads expert. Nathu La, Tsomgo Lake, North Sikkim and Yumthang valley routes." },
      { id = 62; name = "Phurbu Namgyal"; photo = ""; experienceYears = 9; languages = ["Ladakhi", "Hindi", "English"]; rating = 4.9; pricePerHour = 380; available = true; description = "Leh | Ladakh high-altitude expert. Khardung La, Pangong Lake, Nubra Valley and Manali-Leh highway." },
      { id = 63; name = "Dawa Tsering"; photo = ""; experienceYears = 7; languages = ["Nepali", "Hindi", "English"]; rating = 4.7; pricePerHour = 310; available = true; description = "Darjeeling | Tea garden hills and Sikkim border driver. Mirik, Kalimpong and Siliguri corridor specialist." },
      { id = 64; name = "Basant Thapa"; photo = ""; experienceYears = 6; languages = ["Nepali", "Hindi", "Bengali"]; rating = 4.6; pricePerHour = 280; available = true; description = "Siliguri | North Bengal gateway. NJP station, Bagdogra airport, Jalpaiguri and Cooch Behar routes." },
      { id = 65; name = "Rakibul Islam"; photo = ""; experienceYears = 7; languages = ["Bengali", "Assamese", "Hindi"]; rating = 4.6; pricePerHour = 265; available = true; description = "Dibrugarh | Upper Assam tea region specialist. Tinsukia, Sibsagar, Digboi oilfields and Arunachal border." },
      { id = 66; name = "Nabajyoti Gogoi"; photo = ""; experienceYears = 6; languages = ["Assamese", "Bengali", "Hindi"]; rating = 4.5; pricePerHour = 260; available = true; description = "Jorhat | Central Assam expert. Kaziranga National Park, Majuli Island ferry crossing and Sibsagar circuit." },
      { id = 67; name = "Tarun Kalita"; photo = ""; experienceYears = 8; languages = ["Assamese", "Hindi", "English"]; rating = 4.7; pricePerHour = 280; available = true; description = "Guwahati | Assam NE hub driver. Paltan Bazar, Lokpriya airport, Shillong highway and Kamakhya temple corridor." },
      { id = 68; name = "Wanphai Kharkongor"; photo = ""; experienceYears = 7; languages = ["Khasi", "Hindi", "English"]; rating = 4.7; pricePerHour = 285; available = true; description = "Shillong | Meghalaya expert. Cherrapunji waterfalls, Mawlynnong village and Dawki border route specialist." },
      { id = 69; name = "Yambem Tomba"; photo = ""; experienceYears = 6; languages = ["Meitei", "Hindi", "English"]; rating = 4.5; pricePerHour = 265; available = true; description = "Imphal | Manipur valley driver. Loktak Lake, Moirang, Bishnupur and Moreh trade border corridor." },
      { id = 70; name = "Ngathing Phom"; photo = ""; experienceYears = 5; languages = ["Nagamese", "Hindi", "English"]; rating = 4.5; pricePerHour = 270; available = true; description = "Kohima | Nagaland highland roads. Dzukou Valley, Mon district, Mokokchung and Dimapur airport runs." },
      { id = 71; name = "Gurpreet Singh"; photo = ""; experienceYears = 9; languages = ["Punjabi", "Hindi", "English"]; rating = 4.8; pricePerHour = 350; available = true; description = "Amritsar | Golden Temple area expert. Wagah border, Raja Sansi airport, Pathankot and Batala routes." },
      { id = 72; name = "Hardeep Dhaliwal"; photo = ""; experienceYears = 8; languages = ["Punjabi", "Hindi", "English"]; rating = 4.7; pricePerHour = 335; available = true; description = "Ludhiana | Punjab industrial city driver. GT Road, Sahnewal, Phagwara and Jalandhar corridor." },
      { id = 73; name = "Paramjit Sandhu"; photo = ""; experienceYears = 7; languages = ["Punjabi", "Hindi", "English"]; rating = 4.6; pricePerHour = 320; available = true; description = "Jalandhar | Phagwara, Kapurthala, Nawanshahr and NH-1 expressway specialist. Sports goods market routes." },
      { id = 74; name = "Sukhwinder Gill"; photo = ""; experienceYears = 10; languages = ["Punjabi", "Hindi", "English"]; rating = 4.8; pricePerHour = 340; available = true; description = "Chandigarh | UT city expert. Sector 17, Mohali IT park, Panchkula and Zirakpur airport corridor." },
      { id = 75; name = "Bilal Ahmed Mir"; photo = ""; experienceYears = 8; languages = ["Kashmiri", "Urdu", "Hindi", "English"]; rating = 4.8; pricePerHour = 360; available = true; description = "Srinagar | Kashmir valley expert. Dal Lake, Gulmarg, Pahalgam, Sonamarg and Lal Chowk routes." },
      { id = 76; name = "Mohammed Altaf"; photo = ""; experienceYears = 7; languages = ["Kashmiri", "Urdu", "Hindi"]; rating = 4.6; pricePerHour = 310; available = true; description = "Jammu | Tawi city driver. Vaishno Devi base camp, Patnitop, Banihal tunnel and Udhampur routes." },
      { id = 77; name = "Sanjay Rawat"; photo = ""; experienceYears = 8; languages = ["Hindi", "Garhwali", "English"]; rating = 4.7; pricePerHour = 315; available = true; description = "Dehradun | Uttarakhand gateway. Mussoorie, FRI, ISBT and Jolly Grant airport routes. Char Dham starting point." },
      { id = 78; name = "Deepak Negi"; photo = ""; experienceYears = 7; languages = ["Hindi", "Garhwali", "English"]; rating = 4.7; pricePerHour = 295; available = true; description = "Haridwar | Haridwar and Rishikesh specialist. Char Dham yatra, Rajaji Park, Roorkee and Ganga ghat routes." },
      { id = 79; name = "Gopal Joshi"; photo = ""; experienceYears = 6; languages = ["Hindi", "Kumaoni", "English"]; rating = 4.6; pricePerHour = 290; available = true; description = "Nainital | Kumaon hills driver. Almora, Bhimtal, Corbett Tiger Reserve and Kathgodam station routes." },
      { id = 80; name = "Rajiv Tirupataiah"; photo = ""; experienceYears = 10; languages = ["Telugu", "Tamil", "English"]; rating = 4.8; pricePerHour = 345; available = true; description = "Visakhapatnam | Vizag port and beach road expert. Araku Valley ghat roads, Simhachalam and Airport corridor." },
      // Batch 3 - 50 new drivers (81-130)
      // Maharashtra - more cities
      { id = 81; name = "Datta Shinde"; photo = ""; experienceYears = 8; languages = ["Marathi", "Hindi", "English"]; rating = 4.7; pricePerHour = 340; available = true; description = "Kolhapur | Sugar belt and Goa highway specialist. Sangli, Satara, Miraj and Ichalkaranji routes." },
      { id = 82; name = "Sudhir Jagtap"; photo = ""; experienceYears = 7; languages = ["Marathi", "Hindi", "English"]; rating = 4.6; pricePerHour = 325; available = true; description = "Solapur | Dry region expert. Pandharpur pilgrim route, Akkalkot, Osmanabad and Latur NH-52 corridor." },
      { id = 83; name = "Avinash Mhetre"; photo = ""; experienceYears = 6; languages = ["Marathi", "Hindi", "English"]; rating = 4.5; pricePerHour = 310; available = true; description = "Thane | MMR fringe specialist. Kalyan, Dombivli, Bhiwandi logistics hub and Ulhasnagar routes." },
      // Andhra Pradesh - more cities
      { id = 84; name = "Srikanth Naidu"; photo = ""; experienceYears = 9; languages = ["Telugu", "Kannada", "English"]; rating = 4.7; pricePerHour = 330; available = true; description = "Tirupati | Tirumala temple route expert. Renigunta airport, Chittoor and Kadapa highway specialist." },
      { id = 85; name = "Naga Babu Rao"; photo = ""; experienceYears = 8; languages = ["Telugu", "Odia", "English"]; rating = 4.6; pricePerHour = 300; available = true; description = "Visakhapatnam | Steel plant, Bheemunipatnam beach and Araku Valley ghat road expert." },
      { id = 86; name = "Kiran Kumar Reddy"; photo = ""; experienceYears = 7; languages = ["Telugu", "Hindi", "English"]; rating = 4.7; pricePerHour = 315; available = true; description = "Nellore | SPSR district driver. Sriharikota, Kavali, Gudur and NH-16 coastal highway specialist." },
      // Tamil Nadu - more cities
      { id = 87; name = "Murugan Selvam"; photo = ""; experienceYears = 10; languages = ["Tamil", "Kannada", "English"]; rating = 4.8; pricePerHour = 350; available = true; description = "Salem | Central TN hub driver. Mettur dam, Erode textile belt, Dharmapuri and Namakkal routes." },
      { id = 88; name = "Ganesh Babu"; photo = ""; experienceYears = 7; languages = ["Tamil", "Telugu", "English"]; rating = 4.6; pricePerHour = 310; available = true; description = "Tirunelveli | South TN specialist. Tuticorin port, Nagercoil, Kanyakumari tip and Courtallam ghat." },
      { id = 89; name = "Velmurugan Raj"; photo = ""; experienceYears = 8; languages = ["Tamil", "English"]; rating = 4.7; pricePerHour = 325; available = true; description = "Vellore | Medical city driver. CMC hospital, Ambur leather town, Katpadi junction and Ranipet routes." },
      // Karnataka - more cities
      { id = 90; name = "Manjunath Patil"; photo = ""; experienceYears = 9; languages = ["Kannada", "Hindi", "English"]; rating = 4.8; pricePerHour = 340; available = true; description = "Shivamogga | Malnad region expert. Jog Falls, Sagara, Chitradurga and Tungabhadra reservoir routes." },
      { id = 91; name = "Basavraj Hiremath"; photo = ""; experienceYears = 8; languages = ["Kannada", "Hindi", "English"]; rating = 4.7; pricePerHour = 320; available = true; description = "Davanagere | Central Karnataka driver. Chitradurga forts, Ranebennur, Harihar and Haveri routes." },
      // Kerala - more cities
      { id = 92; name = "Subin Thomas"; photo = ""; experienceYears = 7; languages = ["Malayalam", "Tamil", "English"]; rating = 4.7; pricePerHour = 345; available = true; description = "Thrissur | Cultural capital driver. Guruvayur temple, Irinjalakuda, Chalakudy and NH-544 routes." },
      { id = 93; name = "Jibin Mathew"; photo = ""; experienceYears = 6; languages = ["Malayalam", "English"]; rating = 4.6; pricePerHour = 330; available = true; description = "Kollam | Cashew port city expert. Alappuzha backwaters, Punalur, Varkala and Trivandrum highway." },
      // West Bengal - more cities
      { id = 94; name = "Sujoy Chatterjee"; photo = ""; experienceYears = 9; languages = ["Bengali", "Hindi", "English"]; rating = 4.7; pricePerHour = 350; available = true; description = "Durgapur | Steel city driver. Asansol, Bankura, Purulia industrial belt and NH-19 routes." },
      { id = 95; name = "Tapas Biswas"; photo = ""; experienceYears = 7; languages = ["Bengali", "Hindi", "English"]; rating = 4.6; pricePerHour = 315; available = true; description = "Howrah | Kolkata metro fringe expert. Uluberia, Santragachi, Bally bridge and Dankuni routes." },
      // Uttar Pradesh - more cities
      { id = 96; name = "Avanish Dubey"; photo = ""; experienceYears = 8; languages = ["Hindi", "Bhojpuri", "English"]; rating = 4.6; pricePerHour = 295; available = true; description = "Gorakhpur | Eastern UP gateway. Kushinagar Buddhist circuit, Deoria, Maharajganj and Nepal border." },
      { id = 97; name = "Vinod Kumar Gupta"; photo = ""; experienceYears = 7; languages = ["Hindi", "English"]; rating = 4.5; pricePerHour = 280; available = true; description = "Meerut | Western UP specialist. Ghaziabad, Hapur, Muzaffarnagar and Delhi-Meerut Expressway expert." },
      { id = 98; name = "Sunil Bajpai"; photo = ""; experienceYears = 6; languages = ["Hindi", "English"]; rating = 4.5; pricePerHour = 275; available = true; description = "Mathura | Braj circuit driver. Vrindavan, Govardhan Hill, Bharatpur and Agra corridor specialist." },
      // Rajasthan - more cities
      { id = 99; name = "Mahendra Singh Rathore"; photo = ""; experienceYears = 9; languages = ["Hindi", "Rajasthani", "English"]; rating = 4.8; pricePerHour = 335; available = true; description = "Bikaner | Camel circuit and desert fort expert. Jaisalmer, Churu, Hanumangarh and NH-15 route." },
      { id = 100; name = "Devendra Pareek"; photo = ""; experienceYears = 7; languages = ["Hindi", "Rajasthani", "English"]; rating = 4.6; pricePerHour = 305; available = true; description = "Ajmer | Dargah and Pushkar circuit specialist. Kishangarh marble hub, Beawar and Nasirabad routes." },
      // Madhya Pradesh - more cities
      { id = 101; name = "Prashant Dubey"; photo = ""; experienceYears = 8; languages = ["Hindi", "English"]; rating = 4.7; pricePerHour = 305; available = true; description = "Gwalior | Jai Vilas Palace, Lashkar, Morena and Chambal ravines route expert. NH-3 master." },
      { id = 102; name = "Mukesh Lodhi"; photo = ""; experienceYears = 6; languages = ["Hindi", "Bundeli", "English"]; rating = 4.5; pricePerHour = 280; available = true; description = "Sagar | Bundelkhand driver. Chhatarpur, Khajuraho temples, Damoh and Tikamgarh routes covered." },
      // Gujarat - more cities
      { id = 103; name = "Dharmesh Joshi"; photo = ""; experienceYears = 8; languages = ["Gujarati", "Hindi", "English"]; rating = 4.7; pricePerHour = 330; available = true; description = "Rajkot | Saurashtra hub driver. Porbandar Gandhi birthplace, Jamnagar, Junagadh and Somnath routes." },
      { id = 104; name = "Paresh Trivedi"; photo = ""; experienceYears = 7; languages = ["Gujarati", "Hindi", "English"]; rating = 4.6; pricePerHour = 315; available = true; description = "Bhavnagar | Alang ship-breaking, Palitana Jain temples, Vallabhipur and Botad pilgrim circuit." },
      // Bihar - more cities
      { id = 105; name = "Santosh Prasad Singh"; photo = ""; experienceYears = 7; languages = ["Hindi", "Maithili", "English"]; rating = 4.5; pricePerHour = 265; available = true; description = "Gaya | Buddhist circuit driver. Bodhgaya, Rajgir, Nalanda ruins and Pawapuri pilgrim routes." },
      { id = 106; name = "Deepak Kumar Jha"; photo = ""; experienceYears = 6; languages = ["Hindi", "Maithili", "Bengali"]; rating = 4.4; pricePerHour = 255; available = true; description = "Bhagalpur | Silk city driver. Vikramshila, Banka, Deoghar and Jharkhand border corridor." },
      // Jharkhand - more cities
      { id = 107; name = "Anil Kumar Mahato"; photo = ""; experienceYears = 8; languages = ["Hindi", "Santali", "English"]; rating = 4.6; pricePerHour = 285; available = true; description = "Jamshedpur | Steel city expert. Tata Motors plant, Baharagora, Seraikela and Gamharia routes." },
      { id = 108; name = "Bikram Munda"; photo = ""; experienceYears = 6; languages = ["Hindi", "Santali", "English"]; rating = 4.4; pricePerHour = 260; available = true; description = "Dhanbad | Coal belt driver. Bokaro Steel City, Giridih, Hazaribagh and Chirkunda corridors." },
      // Himachal Pradesh - more cities
      { id = 109; name = "Virender Chauhan"; photo = ""; experienceYears = 9; languages = ["Hindi", "Himachali", "English"]; rating = 4.8; pricePerHour = 370; available = true; description = "Manali | Snow adventure circuit. Rohtang Pass, Solang Nala, Lahaul-Spiti and Kullu valley routes." },
      { id = 110; name = "Sushil Kumar Verma"; photo = ""; experienceYears = 7; languages = ["Hindi", "Himachali", "English"]; rating = 4.7; pricePerHour = 350; available = true; description = "Dharamsala | McLeod Ganj, Kangra fort, Palampur tea gardens and Dalhousie hill station routes." },
      // Odisha - more cities
      { id = 111; name = "Prasant Nayak"; photo = ""; experienceYears = 7; languages = ["Odia", "Hindi", "English"]; rating = 4.6; pricePerHour = 280; available = true; description = "Rourkela | Steel city driver. Sundargarh, Jharsuguda, Sambalpur and Hirakud dam circuit routes." },
      { id = 112; name = "Subrat Mohapatra"; photo = ""; experienceYears = 6; languages = ["Odia", "Bengali", "English"]; rating = 4.5; pricePerHour = 270; available = true; description = "Berhampur | Silk city driver. Gopalpur beach, Chilika Lake south bank and Ganjam district routes." },
      // Chhattisgarh - more cities
      { id = 113; name = "Mahesh Sahu"; photo = ""; experienceYears = 7; languages = ["Hindi", "Chhattisgarhi", "English"]; rating = 4.5; pricePerHour = 270; available = true; description = "Bilaspur | Chhattisgarh HC city driver. Korba coal mines, Koriya, Ambikapur and Ratanpur temple." },
      // Telangana - more cities
      { id = 114; name = "Sai Krishna Reddy"; photo = ""; experienceYears = 8; languages = ["Telugu", "Hindi", "English"]; rating = 4.7; pricePerHour = 320; available = true; description = "Warangal | Kakatiyas heritage city. Ramappa temple, Bhadrachalam, Khammam and Suryapet routes." },
      { id = 115; name = "Prasad Rao Deshmukh"; photo = ""; experienceYears = 7; languages = ["Telugu", "Marathi", "Hindi"]; rating = 4.6; pricePerHour = 300; available = true; description = "Nizamabad | Deccan Plateau driver. Bodhan, Armoor, Nizamabad-Adilabad highway and Karimnagar." },
      // Goa - more areas
      { id = 116; name = "Sandesh Gaonkar"; photo = ""; experienceYears = 8; languages = ["Konkani", "Marathi", "Hindi", "English"]; rating = 4.8; pricePerHour = 400; available = true; description = "Goa | North Goa expert. Calangute, Baga, Anjuna, Vagator and Mapusa market circuit specialist." },
      // Delhi NCR - more areas
      { id = 117; name = "Praveen Thakur"; photo = ""; experienceYears = 9; languages = ["Hindi", "English"]; rating = 4.8; pricePerHour = 420; available = true; description = "Delhi | South Delhi specialist. Lajpat Nagar, Saket, Vasant Kunj, Mehrauli and Qutub Minar corridor." },
      { id = 118; name = "Yogesh Pandey"; photo = ""; experienceYears = 8; languages = ["Hindi", "English"]; rating = 4.7; pricePerHour = 395; available = true; description = "Faridabad | Haryana border driver. Ballabgarh, Palwal, NIT and Surajkund Mela grounds expert." },
      // Haryana - more cities
      { id = 119; name = "Rampal Singh"; photo = ""; experienceYears = 8; languages = ["Hindi", "Haryanvi", "English"]; rating = 4.7; pricePerHour = 310; available = true; description = "Hisar | Haryana steel-agri belt. Sirsa, Fatehabad, Bhiwani and Rohtak NH-9 highway specialist." },
      { id = 120; name = "Satbir Dahiya"; photo = ""; experienceYears = 7; languages = ["Hindi", "Haryanvi", "English"]; rating = 4.6; pricePerHour = 295; available = true; description = "Rohtak | Delhi-NCR-Haryana link. Jhajjar, Sonipat, Panipat battlefield and Bahadurgarh corridor." },
      // Assam - more cities
      { id = 121; name = "Hiranya Bora"; photo = ""; experienceYears = 8; languages = ["Assamese", "Bengali", "Hindi"]; rating = 4.6; pricePerHour = 275; available = true; description = "Silchar | Barak Valley driver. Karimganj, Hailakandi, Jiribam and Mizoram border corridor expert." },
      { id = 122; name = "Dipankar Kalita"; photo = ""; experienceYears = 7; languages = ["Assamese", "Hindi", "English"]; rating = 4.6; pricePerHour = 265; available = true; description = "Dibrugarh | Tea garden city driver. Tinsukia, Dhemaji, Arunachal Pradesh border and Digboi oil town." },
      // Punjab - more cities
      { id = 123; name = "Balvinder Brar"; photo = ""; experienceYears = 9; languages = ["Punjabi", "Hindi", "English"]; rating = 4.8; pricePerHour = 330; available = true; description = "Patiala | Royal city driver. Sangrur, Mansa, Bathinda thermal plant and Gobindgarh fort routes." },
      { id = 124; name = "Jaswant Sidhu"; photo = ""; experienceYears = 8; languages = ["Punjabi", "Hindi", "English"]; rating = 4.7; pricePerHour = 315; available = true; description = "Bathinda | Malwa region expert. Muktsar Sahib, Fazilka border, Ferozepur and Faridkot routes." },
      // Rajasthan - more cities
      { id = 125; name = "Suresh Meena"; photo = ""; experienceYears = 7; languages = ["Hindi", "Rajasthani", "English"]; rating = 4.6; pricePerHour = 295; available = true; description = "Alwar | Sariska tiger reserve driver. Bharatpur bird sanctuary, Deeg palace and Mathura border." },
      // Uttarakhand - more cities
      { id = 126; name = "Mohan Lal Semwal"; photo = ""; experienceYears = 8; languages = ["Hindi", "Garhwali", "English"]; rating = 4.7; pricePerHour = 330; available = true; description = "Rishikesh | Yoga city and Char Dham gateway. Badrinath, Kedarnath base, Devprayag and Srinagar Garhwal." },
      { id = 127; name = "Puran Singh Bisht"; photo = ""; experienceYears = 7; languages = ["Hindi", "Kumaoni", "English"]; rating = 4.6; pricePerHour = 305; available = true; description = "Haldwani | Kumaon foothills gateway. Ramnagar Corbett, Rudrapur, Kashipur and Bazpur industrial belt." },
      // Kerala - more cities
      { id = 128; name = "Binu Varghese"; photo = ""; experienceYears = 8; languages = ["Malayalam", "Tamil", "English"]; rating = 4.7; pricePerHour = 340; available = true; description = "Palakkad | Gateway to Kerala driver. Coimbatore NH-544, Silent Valley national park and Malampuzha dam." },
      // Tamil Nadu - more cities
      { id = 129; name = "Arumugam Pillai"; photo = ""; experienceYears = 9; languages = ["Tamil", "Malayalam", "English"]; rating = 4.8; pricePerHour = 345; available = true; description = "Tiruppur | Textile export city driver. Erode, Karur, Udumalaipettai and Pollachi industrial corridor." },
      // Karnataka - more cities
      { id = 130; name = "Chandrashekar Bhat"; photo = ""; experienceYears = 10; languages = ["Kannada", "Tulu", "Hindi", "English"]; rating = 4.9; pricePerHour = 360; available = true; description = "Udupi | Tulu Nadu coastal expert. Manipal university campus, Kundapur, Byndoor and Karwar routes." },
      // Batch 4 - 30 new drivers (131-160)
      // Telangana
      { id = 131; name = "Ramesh Goud"; photo = ""; experienceYears = 8; languages = ["Telugu", "Hindi", "English"]; rating = 4.7; pricePerHour = 320; available = true; description = "Warangal | Kakatiya city driver. Kazipet junction, Hanamkonda, Nalgonda and Karimnagar routes." },
      { id = 132; name = "Suresh Yadav Reddy"; photo = ""; experienceYears = 7; languages = ["Telugu", "Hindi", "English"]; rating = 4.6; pricePerHour = 305; available = true; description = "Nizamabad | Northern Telangana expert. Karimnagar, Adilabad, Nirmal and Kamareddy routes." },
      // Tamil Nadu
      { id = 133; name = "Balasubramaniam R"; photo = ""; experienceYears = 9; languages = ["Tamil", "English"]; rating = 4.8; pricePerHour = 340; available = true; description = "Thanjavur | Big Temple circuit driver. Kumbakonam, Karaikkal, Nagapattinam and Chidambaram routes." },
      { id = 134; name = "Manikandan V"; photo = ""; experienceYears = 7; languages = ["Tamil", "English"]; rating = 4.6; pricePerHour = 310; available = true; description = "Dindigul | Lock city driver. Palani hills, Kodaikanal ghat road, Batlagundu and Oddanchatram routes." },
      { id = 135; name = "Shanmugam P"; photo = ""; experienceYears = 8; languages = ["Tamil", "Malayalam", "English"]; rating = 4.7; pricePerHour = 325; available = true; description = "Nagercoil | Kanyakumari tip driver. Cape Comorin, Thuckalay, Marthandam and Thiruvananthapuram highway." },
      // Maharashtra
      { id = 136; name = "Amit Deshmukh"; photo = ""; experienceYears = 8; languages = ["Marathi", "Hindi", "English"]; rating = 4.7; pricePerHour = 335; available = true; description = "Amravati | Vidarbha city driver. Akola, Washim, Yavatmal and Wardha Gandhi ashram routes." },
      { id = 137; name = "Prashant Kulkarni"; photo = ""; experienceYears = 9; languages = ["Marathi", "Hindi", "English"]; rating = 4.8; pricePerHour = 350; available = true; description = "Latur | Marathwada driver. Osmanabad, Nanded Gurudwara, Bidar border and Gulbarga highway." },
      // Madhya Pradesh
      { id = 138; name = "Vikas Jain"; photo = ""; experienceYears = 7; languages = ["Hindi", "English"]; rating = 4.6; pricePerHour = 290; available = true; description = "Ujjain | Mahakal temple city driver. Dewas, Mandsaur, Ratlam and Omkareshwar pilgrim route." },
      { id = 139; name = "Ashok Sharma"; photo = ""; experienceYears = 8; languages = ["Hindi", "Bundeli", "English"]; rating = 4.7; pricePerHour = 300; available = true; description = "Rewa | Vindhya region driver. Satna marble belt, Maihar Devi temple and Panna tiger reserve routes." },
      // Rajasthan
      { id = 140; name = "Bharat Singh"; photo = ""; experienceYears = 9; languages = ["Hindi", "Rajasthani", "English"]; rating = 4.8; pricePerHour = 330; available = true; description = "Sikar | Shekhawati heritage driver. Jhunjhunu, Churu painted havelis, Fatehpur and Lachhmangarh." },
      { id = 141; name = "Ghanshyam Saini"; photo = ""; experienceYears = 7; languages = ["Hindi", "Rajasthani", "English"]; rating = 4.6; pricePerHour = 300; available = true; description = "Bharatpur | Bird sanctuary gateway. Deeg palace, Dholpur, Karauli and Mathura border corridor." },
      // Himachal Pradesh
      { id = 142; name = "Virender Chauhan"; photo = ""; experienceYears = 10; languages = ["Hindi", "Himachali", "English"]; rating = 4.8; pricePerHour = 370; available = true; description = "Dharamsala | Kangra valley expert. McLeod Ganj, Dalhousie, Chamba and Mandi mountain routes." },
      { id = 143; name = "Ajay Thakur"; photo = ""; experienceYears = 9; languages = ["Hindi", "Himachali", "English"]; rating = 4.7; pricePerHour = 355; available = true; description = "Kullu | Kulu-Manali valley specialist. Rohtang Pass, Kasol, Parvati Valley and Jalori Pass routes." },
      // Uttarakhand
      { id = 144; name = "Dinesh Rawal"; photo = ""; experienceYears = 8; languages = ["Hindi", "Kumaoni", "English"]; rating = 4.7; pricePerHour = 315; available = true; description = "Pithoragarh | High Himalaya driver. Munsiyari, Milam Glacier trail, Chaukori and Nepal border." },
      // West Bengal
      { id = 145; name = "Subhas Mondal"; photo = ""; experienceYears = 7; languages = ["Bengali", "Hindi", "English"]; rating = 4.6; pricePerHour = 305; available = true; description = "Malda | North Bengal driver. Gaur ruins, Murshidabad, Farakka barrage and Jharkhand border routes." },
      { id = 146; name = "Ranjit Ghosh"; photo = ""; experienceYears = 8; languages = ["Bengali", "Hindi", "English"]; rating = 4.7; pricePerHour = 320; available = true; description = "Midnapore | West Bengal midlands expert. Belda, Kharagpur IIT, Jhargram and Bankura routes." },
      // Odisha
      { id = 147; name = "Saroj Mohapatra"; photo = ""; experienceYears = 7; languages = ["Odia", "Hindi", "English"]; rating = 4.6; pricePerHour = 285; available = true; description = "Sambalpur | Western Odisha driver. Hirakud dam, Bargarh, Sundargarh and Rourkela steel city routes." },
      { id = 148; name = "Bijay Kumar Nayak"; photo = ""; experienceYears = 8; languages = ["Odia", "Bengali", "English"]; rating = 4.7; pricePerHour = 295; available = true; description = "Rourkela | Steel city specialist. Sundargarh, Jharsuguda, Brajarajnagar and Jharkhand border." },
      // Chhattisgarh
      { id = 149; name = "Deepak Sahu"; photo = ""; experienceYears = 7; languages = ["Hindi", "Chhattisgarhi", "English"]; rating = 4.6; pricePerHour = 270; available = true; description = "Bilaspur | Chhattisgarh hub driver. Korba coal belt, Kawardha, Janjgir and Ambikapur routes." },
      // Gujarat
      { id = 150; name = "Haresh Patel"; photo = ""; experienceYears = 9; languages = ["Gujarati", "Hindi", "English"]; rating = 4.8; pricePerHour = 340; available = true; description = "Gandhinagar | Capital city driver. GIFT City, Adalaj, Mehsana and Sabarmati ashram Ahmedabad route." },
      { id = 151; name = "Naresh Makwana"; photo = ""; experienceYears = 7; languages = ["Gujarati", "Hindi", "English"]; rating = 4.6; pricePerHour = 310; available = true; description = "Anand | White Revolution city driver. Amul dairy, Vallabh Vidyanagar, Nadiad and Kheda routes." },
      // Goa
      { id = 152; name = "Francis Pereira"; photo = ""; experienceYears = 8; languages = ["Konkani", "Portuguese", "Hindi", "English"]; rating = 4.8; pricePerHour = 400; available = true; description = "Goa | North Goa beach circuit. Calangute, Baga, Anjuna, Vagator and Chapora forts tourist specialist." },
      // Bihar
      { id = 153; name = "Ranjeet Kumar"; photo = ""; experienceYears = 6; languages = ["Hindi", "Bhojpuri", "English"]; rating = 4.5; pricePerHour = 260; available = true; description = "Muzaffarpur | North Bihar driver. Sitamarhi, Darbhanga Raj, Madhubani and Nepal border Raxaul." },
      // Assam - NE connectivity
      { id = 154; name = "Pradip Hazarika"; photo = ""; experienceYears = 8; languages = ["Assamese", "Bengali", "Hindi", "English"]; rating = 4.7; pricePerHour = 280; available = true; description = "Tezpur | Assam city driver. Kaziranga east range, Bhalukpong Arunachal gate and Orang park routes." },
      // Manipur
      { id = 155; name = "Loukham Singh"; photo = ""; experienceYears = 7; languages = ["Meitei", "Hindi", "English"]; rating = 4.6; pricePerHour = 265; available = true; description = "Churachandpur | Manipur hill district driver. Saikot, Singngat, Tipaimukh and Mizoram border corridor." },
      // Meghalaya
      { id = 156; name = "Bah Donbok Kyndiah"; photo = ""; experienceYears = 6; languages = ["Khasi", "Garo", "Hindi", "English"]; rating = 4.6; pricePerHour = 280; available = true; description = "Tura | West Meghalaya Garo Hills driver. Williamnagar, Baghmara, Bangladesh border and Balpakram park." },
      // Karnataka
      { id = 157; name = "Sathish Kumar B"; photo = ""; experienceYears = 8; languages = ["Kannada", "Tamil", "English"]; rating = 4.7; pricePerHour = 325; available = true; description = "Tumkur | Gateway to Deccan driver. Tiptur coconut belt, Pavagada, Madhugiri fort and NH-4 corridor." },
      // Andhra Pradesh
      { id = 158; name = "Maddali Suresh"; photo = ""; experienceYears = 7; languages = ["Telugu", "Kannada", "English"]; rating = 4.6; pricePerHour = 305; available = true; description = "Kurnool | Rayalaseema driver. Belum caves, Yaganti temple, Mantralayam and Tungabhadra dam routes." },
      // Kerala
      { id = 159; name = "Noufal K"; photo = ""; experienceYears = 7; languages = ["Malayalam", "Arabic", "English"]; rating = 4.7; pricePerHour = 355; available = true; description = "Malappuram | Malabar coast specialist. Tirur, Perinthalmanna, Manjeri and NIT Calicut corridor." },
      // Delhi-NCR
      { id = 160; name = "Kapil Dev Malik"; photo = ""; experienceYears = 11; languages = ["Hindi", "Haryanvi", "English"]; rating = 4.9; pricePerHour = 460; available = true; description = "Delhi | 11 yrs NCR veteran. Aerocity, Dwarka, Rohini, Pitampura and North Delhi hospital corridor." },
      // New drivers 161-180 - Enhanced with vehicle & specialization details
      { id = 161; name = "Aryan Verma"; photo = ""; experienceYears = 6; languages = ["Hindi", "English"]; rating = 4.7; pricePerHour = 410; available = true; description = "Delhi | Vehicle: SUV (Innova). Specialization: Airport Transfer, Corporate. South Delhi, Aerocity, DLF Cyber City, IGI Terminal 3 expert. Police Verified. Medical Fit." },
      { id = 162; name = "Sukhwinder Singh"; photo = ""; experienceYears = 9; languages = ["Punjabi", "Hindi", "English"]; rating = 4.8; pricePerHour = 380; available = true; description = "Amritsar | Vehicle: Sedan (Dzire). Specialization: Senior Care, Religious Tours. Golden Temple, Wagah border, Tarn Taran and Pathankot routes. Gentle driver for elders." },
      { id = 163; name = "Prabhudas Naidu"; photo = ""; experienceYears = 11; languages = ["Telugu", "Kannada", "English"]; rating = 4.9; pricePerHour = 440; available = true; description = "Hyderabad | Vehicle: SUV (Crysta). Specialization: Corporate, Long-Distance. HITECH City, Gachibowli, Shamshabad airport and Pune highway specialist. 11 yrs exp." },
      { id = 164; name = "Deepak Joshi"; photo = ""; experienceYears = 7; languages = ["Hindi", "Kumaoni", "English"]; rating = 4.7; pricePerHour = 350; available = true; description = "Nainital | Vehicle: SUV (Scorpio). Specialization: Hill Driving, Tourist. Corbett, Ranikhet, Almora and Kausani routes. Mountain driving certified." },
      { id = 165; name = "Thiru Murugan"; photo = ""; experienceYears = 8; languages = ["Tamil", "English"]; rating = 4.8; pricePerHour = 365; available = true; description = "Madurai | Vehicle: Sedan (Etios). Specialization: Temple Tours, Family. Meenakshi Amman, Rameswaram, Kanyakumari and Kodaikanal ghat road specialist." },
      { id = 166; name = "Ghanshyam Meena"; photo = ""; experienceYears = 6; languages = ["Hindi", "Rajasthani", "English"]; rating = 4.6; pricePerHour = 300; available = true; description = "Jaisalmer | Vehicle: SUV (Bolero). Specialization: Desert Routes, Tourist. Sam sand dunes, Tanot Mata temple and Pakistan border Munabao routes. Desert specialist." },
      { id = 167; name = "Biju Thomas"; photo = ""; experienceYears = 10; languages = ["Malayalam", "Tamil", "English"]; rating = 4.9; pricePerHour = 395; available = true; description = "Kottayam | Vehicle: Van (Traveller). Specialization: Family Groups, Senior Care. Sabarimala pilgrim route, Vagamon hills, Periyar wildlife reserve. Group driver." },
      { id = 168; name = "Himmat Rathore"; photo = ""; experienceYears = 8; languages = ["Hindi", "Rajasthani", "English"]; rating = 4.7; pricePerHour = 330; available = true; description = "Kota | Vehicle: Sedan (Honda City). Specialization: Student, Corporate. Coaching institutes, Rajasthan IIT, Bundi fort and Chambal safari routes." },
      { id = 169; name = "Faisal Ahmed"; photo = ""; experienceYears = 7; languages = ["Urdu", "Hindi", "English"]; rating = 4.7; pricePerHour = 340; available = true; description = "Lucknow | Vehicle: Sedan (Ciaz). Specialization: Corporate, Medical. Hazratganj, Gomti Nagar, SGPGI hospital, Charbagh and Amausi airport routes." },
      { id = 170; name = "Balram Reddy"; photo = ""; experienceYears = 9; languages = ["Telugu", "Hindi", "English"]; rating = 4.8; pricePerHour = 375; available = true; description = "Visakhapatnam | Vehicle: SUV (Ertiga). Specialization: Port, Corporate. RINL steel plant, INS Circars naval base, Rushikonda beach and Araku Valley ghat." },
      { id = 171; name = "Noel Fernandes"; photo = ""; experienceYears = 7; languages = ["Konkani", "Hindi", "English"]; rating = 4.7; pricePerHour = 420; available = true; description = "Panaji | Vehicle: Sedan (Honda Amaze). Specialization: Tourist, Wedding. Old Goa churches, South Goa beaches, Dudhsagar falls and Mollem forest routes." },
      { id = 172; name = "Munna Lal Sahu"; photo = ""; experienceYears = 8; languages = ["Hindi", "Chhattisgarhi", "English"]; rating = 4.6; pricePerHour = 290; available = true; description = "Raipur | Vehicle: Sedan (Dzire). Specialization: Corporate, Long-Distance. Bhilai steel city, Durg, Bilaspur and Jagdalpur Bastar forest routes." },
      { id = 173; name = "Ramakrishna Swamy"; photo = ""; experienceYears = 12; languages = ["Kannada", "Tamil", "Telugu", "English"]; rating = 4.9; pricePerHour = 460; available = true; description = "Bengaluru | Vehicle: SUV (Innova Crysta). Specialization: Corporate Premium, Airport. Whitefield, Electronic City, Marathahalli, Sarjapur Road 12 yrs exp." },
      { id = 174; name = "Santanu Dey"; photo = ""; experienceYears = 7; languages = ["Bengali", "Hindi", "English"]; rating = 4.7; pricePerHour = 310; available = true; description = "Kolkata | Vehicle: Sedan (Verna). Specialization: Corporate, Medical. Salt Lake IT campus, Rajarhat, Howrah bridge corridor and SSKM hospital routes." },
      { id = 175; name = "Narayan Bhatt"; photo = ""; experienceYears = 9; languages = ["Hindi", "Garhwali", "English"]; rating = 4.8; pricePerHour = 360; available = true; description = "Haridwar | Vehicle: SUV (Xylo). Specialization: Pilgrimage, Senior Care. Rishikesh, Kedarnath base, Badrinath and Char Dham yatra circuit specialist." },
      { id = 176; name = "Samir Baruah"; photo = ""; experienceYears = 6; languages = ["Assamese", "Bengali", "Hindi", "English"]; rating = 4.6; pricePerHour = 270; available = true; description = "Guwahati | Vehicle: Sedan (Maruti Ciaz). Specialization: Corporate, Tourist. Kamakhya temple, Kaziranga, Manas wildlife and Indo-Bhutan border Jaigaon." },
      { id = 177; name = "Praveen Bhosale"; photo = ""; experienceYears = 8; languages = ["Marathi", "Hindi", "English"]; rating = 4.7; pricePerHour = 390; available = true; description = "Kolhapur | Vehicle: Sedan (Skoda Rapid). Specialization: Corporate, Long-Distance. Panhala fort, Ambabai temple, Ichalkaranji textile hub and Belgaum routes." },
      { id = 178; name = "Dhanesh Chauhan"; photo = ""; experienceYears = 7; languages = ["Hindi", "Pahari", "English"]; rating = 4.7; pricePerHour = 345; available = true; description = "Shimla | Vehicle: SUV (Mahindra Thar). Specialization: Hill Driving, Tourist. Kufri, Chail, Narkanda apple belt and Kinnaur valley Reckong Peo routes." },
      { id = 179; name = "Mathews Chacko"; photo = ""; experienceYears = 9; languages = ["Malayalam", "Tamil", "English"]; rating = 4.8; pricePerHour = 385; available = true; description = "Ernakulam | Vehicle: MPV (Toyota Innova). Specialization: Family, Airport Transfer. Cochin port, Mattancherry, Aluva junction and Nedumbassery airport routes." },
      { id = 180; name = "Vivek Srivastava"; photo = ""; experienceYears = 10; languages = ["Hindi", "Awadhi", "English"]; rating = 4.8; pricePerHour = 420; available = true; description = "Prayagraj | Vehicle: SUV (Ertiga). Specialization: Pilgrimage, Senior Care. Kumbh mela grounds, Triveni Sangam, Mirzapur Vindhyachal and Varanasi Kashi corridor." }

    ];

    for (driver in sampleDrivers.values()) {
      drivers.add(driver.id, driver);
    };
    nextDriverId := 181;
  };

  public shared func seedMoreDrivers() : async () {
    if (drivers.size() >= 280) return;

    let moreDrivers : [Driver] = [
      { id = 181; name = "Ranjit Singh Gill"; photo = ""; experienceYears = 10; languages = ["Punjabi", "Hindi", "English"]; rating = 4.9; pricePerHour = 400; available = true; description = "Ludhiana | Vehicle: SUV (Innova). Specialization: Corporate, Airport. Ludhiana railway, Sahnewal airport, Jalandhar highway and Phagwara bypass expert." },
      { id = 182; name = "Sunil Kumar Rao"; photo = ""; experienceYears = 8; languages = ["Telugu", "Hindi", "English"]; rating = 4.8; pricePerHour = 370; available = true; description = "Vijayawada | Vehicle: Sedan (Honda City). Specialization: Corporate, Medical. Vijayawada airport, Amaravati capital, Guntur routes and NTR Trust hospital corridors." },
      { id = 183; name = "Kartik Patel"; photo = ""; experienceYears = 6; languages = ["Gujarati", "Hindi", "English"]; rating = 4.7; pricePerHour = 350; available = true; description = "Rajkot | Vehicle: Sedan (Maruti Ciaz). Specialization: Industrial, Corporate. Rajkot industrial estate, Gondal road, Kalavad road and Jamnagar highway routes." },
      { id = 184; name = "Ramu Nair"; photo = ""; experienceYears = 9; languages = ["Malayalam", "Tamil", "English"]; rating = 4.8; pricePerHour = 380; available = true; description = "Kollam | Vehicle: SUV (Ertiga). Specialization: Family, Pilgrim. Thirumullavaram beach, Ashtamudi lake, Shencottai ghats and Sabarimala feeder routes." },
      { id = 185; name = "Tenzin Dorje"; photo = ""; experienceYears = 12; languages = ["Tibetan", "Hindi", "English"]; rating = 4.9; pricePerHour = 450; available = true; description = "Leh | Vehicle: SUV (Mahindra Scorpio). Specialization: High Altitude, Adventure. Khardung La pass, Nubra Valley, Pangong Lake and Zanskar valley routes. Altitude certified." },
      { id = 186; name = "Bibek Chakraborty"; photo = ""; experienceYears = 7; languages = ["Bengali", "Hindi", "English"]; rating = 4.7; pricePerHour = 360; available = true; description = "Durgapur | Vehicle: Sedan (Tata Tigor). Specialization: Industrial, Corporate. Durgapur steel plant, Asansol railway, Andal airport and Damodar Valley routes." },
      { id = 187; name = "Manohar Lal Yadav"; photo = ""; experienceYears = 11; languages = ["Hindi", "Bhojpuri", "English"]; rating = 4.8; pricePerHour = 320; available = true; description = "Varanasi | Vehicle: Sedan (Dzire). Specialization: Pilgrim, Elderly. Kashi Vishwanath, Dashashwamedh Ghat, Sarnath, Ramnagar and BHU medical campus routes." },
      { id = 188; name = "Suresh Shetty"; photo = ""; experienceYears = 9; languages = ["Tulu", "Kannada", "English"]; rating = 4.8; pricePerHour = 390; available = true; description = "Mangaluru | Vehicle: SUV (Innova). Specialization: Corporate, Port. NMPT port, Infosys campus, Surathkal NIT and Udupi Manipal hospital belt. Coastal highway specialist." },
      { id = 189; name = "Dilip Baruah"; photo = ""; experienceYears = 8; languages = ["Assamese", "Bengali", "Hindi"]; rating = 4.7; pricePerHour = 310; available = true; description = "Jorhat | Vehicle: Sedan (Etios). Specialization: Tea Garden, Tourism. Jorhat tea estates, Kaziranga national park, Majuli island ferry and Sibsagar ruins routes." },
      { id = 190; name = "Vinod Nambiar"; photo = ""; experienceYears = 10; languages = ["Malayalam", "Tamil", "Hindi", "English"]; rating = 4.9; pricePerHour = 400; available = true; description = "Kozhikode | Vehicle: MPV (Traveller). Specialization: Family Groups, Long Distance. Calicut beach, Wayanad ghats, Nilambur teak forest and Sultan Bathery routes." },
      { id = 191; name = "Anil Bisht"; photo = ""; experienceYears = 9; languages = ["Hindi", "Garhwali", "English"]; rating = 4.8; pricePerHour = 355; available = true; description = "Rishikesh | Vehicle: SUV (Scorpio). Specialization: Adventure, Pilgrim. Char Dham base, Tehri dam, Neelkanth Mahadev, Devprayag Sangam and Kedarnath feeder routes." },
      { id = 192; name = "Pradeep Murugavel"; photo = ""; experienceYears = 7; languages = ["Tamil", "Telugu", "English"]; rating = 4.7; pricePerHour = 345; available = true; description = "Salem | Vehicle: Sedan (Honda Amaze). Specialization: Industrial, Corporate. Salem steel plant, Yercaud hill station, Namakkal egg belt and Mettur dam routes." },
      { id = 193; name = "Zaki Rahman"; photo = ""; experienceYears = 8; languages = ["Bengali", "Hindi", "Urdu", "English"]; rating = 4.7; pricePerHour = 350; available = true; description = "Kolkata | Vehicle: Sedan (Dzire). Specialization: Night Rides, Corporate. Park Street, Salt Lake Sector V, Rajarhat New Town and Howrah bridge routes. Available 24x7." },
      { id = 194; name = "Chandrashekhar Hegde"; photo = ""; experienceYears = 10; languages = ["Kannada", "Tulu", "Hindi", "English"]; rating = 4.9; pricePerHour = 430; available = true; description = "Belagavi | Vehicle: SUV (Ertiga). Specialization: Corporate, Long Distance. Belagavi airport, Goa highway, Hubli-Dharwad corridor and Pune NH-4 routes." },
      { id = 195; name = "Saurabh Dwivedi"; photo = ""; experienceYears = 7; languages = ["Hindi", "English"]; rating = 4.6; pricePerHour = 330; available = true; description = "Kanpur | Vehicle: Sedan (Ciaz). Specialization: Industrial, Medical. Kanpur leather industry belt, GSVM medical college, Kanpur airport and Allahabad highway." },
      { id = 196; name = "Nagesh Kulkarni"; photo = ""; experienceYears = 8; languages = ["Kannada", "Hindi", "English"]; rating = 4.7; pricePerHour = 375; available = true; description = "Hubli | Vehicle: Sedan (Skoda Rapid). Specialization: Corporate, Commercial. Hubli railway junction, Dharwad university, Deshpande Nagar IT zone and Belgaum road." },
      { id = 197; name = "Hemant Gogoi"; photo = ""; experienceYears = 9; languages = ["Assamese", "Bengali", "Hindi"]; rating = 4.8; pricePerHour = 315; available = true; description = "Guwahati | Vehicle: SUV (Bolero). Specialization: Long Distance, Tourism. Kamakhya temple, Basistha, Pobitora wildlife sanctuary and Shillong road NE routes." },
      { id = 198; name = "Bharat Sodha"; photo = ""; experienceYears = 6; languages = ["Gujarati", "Hindi", "English"]; rating = 4.6; pricePerHour = 340; available = true; description = "Bhavnagar | Vehicle: Sedan (Maruti Dzire). Specialization: Industrial, Port. Alang ship-breaking yard, Velavadar blackbuck sanctuary, Palitana Jain temples routes." },
      { id = 199; name = "Soumya Kar"; photo = ""; experienceYears = 8; languages = ["Odia", "Bengali", "Hindi"]; rating = 4.7; pricePerHour = 305; available = true; description = "Cuttack | Vehicle: Sedan (Tata Tigor). Specialization: Medical, Family. SCB medical college, Cuttack silver city market, Dhauli peace pagoda and Bhubaneswar routes." },
      { id = 200; name = "Thomas Mathew"; photo = ""; experienceYears = 11; languages = ["Malayalam", "English"]; rating = 4.9; pricePerHour = 410; available = true; description = "Thrissur | Vehicle: SUV (Innova Crysta). Specialization: Senior Care, Family. Thrissur Pooram venue, Guruvayur temple, KINFRA industrial park and Palakkad routes." },
      { id = 201; name = "Gaurav Walia"; photo = ""; experienceYears = 7; languages = ["Punjabi", "Hindi", "English"]; rating = 4.7; pricePerHour = 385; available = true; description = "Patiala | Vehicle: Sedan (Honda City). Specialization: Corporate, Medical. Patiala royal palace, Rajindra hospital, Nabha road and Sangrur highway specialist." },
      { id = 202; name = "Dinesh Rawat"; photo = ""; experienceYears = 10; languages = ["Hindi", "Garhwali", "English"]; rating = 4.8; pricePerHour = 360; available = true; description = "Dehradun | Vehicle: SUV (Tata Safari). Specialization: Hill, Corporate. ISRO campus, FRI forest institute, Mussoorie queen of hills and Rishikesh valley routes." },
      { id = 203; name = "Shivkumar Sunder"; photo = ""; experienceYears = 6; languages = ["Tamil", "English"]; rating = 4.6; pricePerHour = 340; available = true; description = "Tirunelveli | Vehicle: Sedan (Etios). Specialization: Industrial, Medical. Tirunelveli medical college, SPIC factory, Courtallam falls and Thoothukudi port routes." },
      { id = 204; name = "Vijendra Rawat"; photo = ""; experienceYears = 8; languages = ["Hindi", "Kumaoni", "English"]; rating = 4.7; pricePerHour = 345; available = true; description = "Haldwani | Vehicle: SUV (Ertiga). Specialization: Hill Tourist, Family. Jim Corbett reserve, Nainital lake, Ranikhet and Mukteshwar altitude resort routes." },
      { id = 205; name = "Goutam Roy"; photo = ""; experienceYears = 9; languages = ["Bengali", "Hindi", "English"]; rating = 4.8; pricePerHour = 355; available = true; description = "Siliguri | Vehicle: SUV (Bolero). Specialization: Mountain, Tourism. Darjeeling toy train base, Bagdogra airport, NJP station and Nepal Panitanki border routes." },
      { id = 206; name = "Ramakrishna Iyer"; photo = ""; experienceYears = 10; languages = ["Tamil", "English", "Malayalam"]; rating = 4.9; pricePerHour = 395; available = true; description = "Vellore | Vehicle: SUV (Innova). Specialization: Medical Tourism. CMC Vellore hospital, Ranipet industrial belt, Tiruvannamalai Arunachala and Arcot routes." },
      { id = 207; name = "Santosh Balmiki"; photo = ""; experienceYears = 6; languages = ["Hindi", "Haryanvi", "English"]; rating = 4.5; pricePerHour = 320; available = true; description = "Rohtak | Vehicle: Sedan (Dzire). Specialization: Medical, Corporate. PGIMS hospital, MDU university, Asthal Bohar industrial area and Delhi Rohtak highway." },
      { id = 208; name = "Rupesh Jaiswal"; photo = ""; experienceYears = 8; languages = ["Hindi", "Bhojpuri", "English"]; rating = 4.7; pricePerHour = 310; available = true; description = "Patna | Vehicle: Sedan (Honda Amaze). Specialization: Medical, Government. PMCH hospital, Patna Sahib gurudwara, Nalanda ruins highway and Gaya tourist route." },
      { id = 209; name = "Ravi Shankar Prasad"; photo = ""; experienceYears = 9; languages = ["Hindi", "Maithili", "English"]; rating = 4.8; pricePerHour = 305; available = true; description = "Muzaffarpur | Vehicle: Sedan (Wagon R). Specialization: Long Distance, Family. Muzaffarpur lychee belt, Sitamarhi, Darbhanga Mithila and Raxaul Nepal border routes." },
      { id = 210; name = "Devraj Thapa"; photo = ""; experienceYears = 11; languages = ["Nepali", "Hindi", "English"]; rating = 4.9; pricePerHour = 380; available = true; description = "Gangtok | Vehicle: SUV (Land Cruiser). Specialization: High Altitude, Mountain. Nathula pass border, Tsomgo lake, Pelling Khangchendzonga base and North Sikkim routes." },
      { id = 211; name = "Prashant Shirsat"; photo = ""; experienceYears = 7; languages = ["Marathi", "Hindi", "English"]; rating = 4.7; pricePerHour = 370; available = true; description = "Nashik | Vehicle: Sedan (Honda City). Specialization: Wine Tour, Pilgrim. Sula vineyards, Panchavati Kalaram temple, Trimbakeshwar jyotirlinga and Igatpuri ghats." },
      { id = 212; name = "Jitendra Meena"; photo = ""; experienceYears = 7; languages = ["Hindi", "Rajasthani", "English"]; rating = 4.6; pricePerHour = 310; available = true; description = "Kota | Vehicle: Sedan (Dzire). Specialization: Student, Medical. Kota coaching hub, JK Lon hospital, Bundi fort and Chambal garden wildlife sanctuary routes." },
      { id = 213; name = "Krishnan Namboodiri"; photo = ""; experienceYears = 9; languages = ["Malayalam", "Tamil", "English"]; rating = 4.8; pricePerHour = 390; available = true; description = "Palakkad | Vehicle: SUV (Ertiga). Specialization: Industrial, Long Distance. Palakkad gap highway, Coimbatore textile belt, Silent Valley reserve and Ooty ghat routes." },
      { id = 214; name = "Arjun Das"; photo = ""; experienceYears = 8; languages = ["Bengali", "Hindi", "English"]; rating = 4.7; pricePerHour = 330; available = true; description = "Howrah | Vehicle: Sedan (Tata Tigor). Specialization: Industrial, Night. Howrah bridge, Uluberia factory belt, Santragachi junction and Kolkata KD road overnight routes." },
      { id = 215; name = "Syed Iqbal"; photo = ""; experienceYears = 10; languages = ["Urdu", "Hindi", "English"]; rating = 4.8; pricePerHour = 335; available = true; description = "Bhopal | Vehicle: Sedan (Ciaz). Specialization: Government, Medical. Bhopal gas tragedy memorial, AIIMS Bhopal, BHEL plant and VIP road Secretariat routes." },
      { id = 216; name = "Mahesh Khatri"; photo = ""; experienceYears = 6; languages = ["Hindi", "Mewari", "English"]; rating = 4.6; pricePerHour = 295; available = true; description = "Ajmer | Vehicle: Sedan (Dzire). Specialization: Pilgrim, Tourist. Dargah Sharif, Ana Sagar lake, Pushkar camel fair ground and Kishangarh marble hub routes." },
      { id = 217; name = "Prasanna Joshi"; photo = ""; experienceYears = 8; languages = ["Marathi", "Hindi", "Gujarati", "English"]; rating = 4.7; pricePerHour = 360; available = true; description = "Solapur | Vehicle: Sedan (Honda Amaze). Specialization: Industrial, Long Distance. Solapur textile district, Pandharpur Vitthal temple, Osmanabad and Bijapur highway." },
      { id = 218; name = "Lal Bahadur Tamang"; photo = ""; experienceYears = 10; languages = ["Nepali", "Hindi", "Tibetan"]; rating = 4.8; pricePerHour = 360; available = true; description = "Darjeeling | Vehicle: SUV (Scorpio). Specialization: Mountain, Tea Garden. Tiger Hill sunrise, Batasia Loop, Mirik lake and Kurseong tea estate belt routes." },
      { id = 219; name = "Amol Deshpande"; photo = ""; experienceYears = 9; languages = ["Marathi", "Hindi", "English"]; rating = 4.8; pricePerHour = 390; available = true; description = "Thane | Vehicle: MPV (Innova). Specialization: Corporate, Family. Thane creek, Viviana mall, Majiwada junction, LBS road and Eastern Express Highway Mumbra routes." },
      { id = 220; name = "Balaji Krishnamurthy"; photo = ""; experienceYears = 11; languages = ["Tamil", "Telugu", "Kannada", "English"]; rating = 4.9; pricePerHour = 410; available = true; description = "Coimbatore | Vehicle: SUV (Crysta). Specialization: Corporate, Medical. CODISSIA industrial trust, PSG hospital, Pollachi highway and Ooty Mettupalayam ghat." },
      { id = 221; name = "Hamid Khan"; photo = ""; experienceYears = 8; languages = ["Urdu", "Hindi", "English"]; rating = 4.7; pricePerHour = 325; available = true; description = "Bareilly | Vehicle: Sedan (Maruti Ciaz). Specialization: Medical, Corporate. RD Rohilkhand university, district hospital, Pilibhit tiger reserve and Nainital highway." },
      { id = 222; name = "Santosh Nayak"; photo = ""; experienceYears = 7; languages = ["Odia", "Hindi", "Bengali"]; rating = 4.6; pricePerHour = 295; available = true; description = "Rourkela | Vehicle: Sedan (Tata Tiago). Specialization: Industrial, Medical. Rourkela steel plant, VSS medical college, Jharkhand border and Sundargarh highway." },
      { id = 223; name = "Maninder Brar"; photo = ""; experienceYears = 9; languages = ["Punjabi", "Hindi", "English"]; rating = 4.8; pricePerHour = 375; available = true; description = "Mohali | Vehicle: Sedan (Honda City). Specialization: IT, Corporate. Mohali IT city, ISBT Chandigarh, PCA cricket stadium and Kharar highway residential routes." },
      { id = 224; name = "Rajiv Pandey"; photo = ""; experienceYears = 10; languages = ["Hindi", "Awadhi", "English"]; rating = 4.8; pricePerHour = 340; available = true; description = "Meerut | Vehicle: SUV (Ertiga). Specialization: Corporate, Long Distance. Meerut cantonment, Western UP highway, Hapur bypass and Delhi-Meerut expressway specialist." },
      { id = 225; name = "Chandan Oraon"; photo = ""; experienceYears = 8; languages = ["Hindi", "Nagpuri", "Bengali"]; rating = 4.7; pricePerHour = 290; available = true; description = "Jamshedpur | Vehicle: Sedan (Dzire). Specialization: Industrial, Corporate. Tata Steel plant, Jubilee Park, Dhalbhum road and Baharagora Jharkhand-Bengal border routes." },
      { id = 226; name = "Nikhil Varma"; photo = ""; experienceYears = 6; languages = ["Hindi", "English"]; rating = 4.5; pricePerHour = 330; available = true; description = "Ghaziabad | Vehicle: Sedan (Maruti Sx4). Specialization: Corporate, Daily Commute. Raj Nagar extension, Indirapuram, Vaishali, Noida border and NH-58 Delhi routes." },
      { id = 227; name = "Bhupendra Choudhary"; photo = ""; experienceYears = 8; languages = ["Hindi", "Marwari", "English"]; rating = 4.7; pricePerHour = 310; available = true; description = "Bikaner | Vehicle: SUV (Bolero). Specialization: Desert, Tourist. Junagarh fort, CAZRI desert research, Karni Mata rat temple and Jaisalmer golden road." },
      { id = 228; name = "Durai Murugan"; photo = ""; experienceYears = 9; languages = ["Tamil", "English"]; rating = 4.8; pricePerHour = 355; available = true; description = "Tirupur | Vehicle: Sedan (Honda Amaze). Specialization: Industrial, Corporate. Tirupur knitwear hub, Avinashi road, Kangayam highway and Erode textile belt routes." },
      { id = 229; name = "Robert D'Souza"; photo = ""; experienceYears = 11; languages = ["Konkani", "Marathi", "Hindi", "English"]; rating = 4.9; pricePerHour = 430; available = true; description = "Goa | Vehicle: SUV (Innova). Specialization: Tourist, Wedding. Calangute-Baga beach circuit, Panaji city, Vasco port and Miramar to Vagator coastal routes." },
      { id = 230; name = "Lakshmi Prasad Verma"; photo = ""; experienceYears = 10; languages = ["Hindi", "Chhattisgarhi", "English"]; rating = 4.8; pricePerHour = 295; available = true; description = "Raipur | Vehicle: Sedan (Ciaz). Specialization: Government, Medical. AIIMS Raipur, Naya Raipur capital complex, BEL plant and Durg Bhilai industrial city." },
      { id = 231; name = "Arup Dutta"; photo = ""; experienceYears = 7; languages = ["Assamese", "Bengali", "Hindi"]; rating = 4.6; pricePerHour = 305; available = true; description = "Silchar | Vehicle: Sedan (Tata Tigor). Specialization: Long Distance, Medical. Silchar medical college, Sonai road, Cachar district and Tripura Agartala NH-8 routes." },
      { id = 232; name = "Pradeep Kadam"; photo = ""; experienceYears = 8; languages = ["Marathi", "Hindi", "English"]; rating = 4.7; pricePerHour = 365; available = true; description = "Navi Mumbai | Vehicle: SUV (Ertiga). Specialization: Corporate, Airport. CIDCO Vashi, Airoli IT zone, JNPT port Nhava Sheva and CSIA Mumbai airport via Sion." },
      { id = 233; name = "Sundar Raj"; photo = ""; experienceYears = 9; languages = ["Tamil", "Telugu", "Kannada", "English"]; rating = 4.8; pricePerHour = 385; available = true; description = "Mysuru | Vehicle: SUV (Crysta). Specialization: Heritage, Corporate. Mysore palace Dasara route, Infosys campus Hebbal, Chamundi hills and Ooty connecting ghat." },
      { id = 234; name = "Anand Swaroop Gupta"; photo = ""; experienceYears = 8; languages = ["Hindi", "English"]; rating = 4.7; pricePerHour = 295; available = true; description = "Gwalior | Vehicle: Sedan (Honda City). Specialization: Heritage, Government. Gwalior fort, Morar cantonment, Maharaja College and Chambal expressway Agra routes." },
      { id = 235; name = "Sanjay Pawar"; photo = ""; experienceYears = 7; languages = ["Marathi", "Hindi", "English"]; rating = 4.6; pricePerHour = 380; available = true; description = "Mumbai | Vehicle: Sedan (Skoda Rapid). Specialization: Corporate, Finance. BKC Bandra East, Nariman Point, Worli Sea Link, Powai Hiranandani and SEEPZ zone." },
      { id = 236; name = "Ravi Kumar Tiwari"; photo = ""; experienceYears = 10; languages = ["Hindi", "English"]; rating = 4.8; pricePerHour = 325; available = true; description = "Ranchi | Vehicle: SUV (Bolero). Specialization: Mining, Corporate. Ranchi SAIL office, HEC factory, Birsa Munda airport and Bokaro steel city highway routes." },
      { id = 237; name = "Joby Varghese"; photo = ""; experienceYears = 8; languages = ["Malayalam", "English"]; rating = 4.7; pricePerHour = 385; available = true; description = "Alappuzha | Vehicle: Van (Force Traveller). Specialization: Backwater Tourism, Family. Alleppey houseboat jetty, Kuttanad paddy fields, Kayamkulam lake and Ambalapuzha routes." },
      { id = 238; name = "Girish Sharma"; photo = ""; experienceYears = 9; languages = ["Hindi", "English"]; rating = 4.8; pricePerHour = 345; available = true; description = "Indore | Vehicle: SUV (Ertiga). Specialization: Corporate, Industrial. Indore SEZ, Rau Pithampur AUDI zone, IIM Indore and AB road Bhopal corridor routes." },
      { id = 239; name = "Manigandan Pillai"; photo = ""; experienceYears = 7; languages = ["Malayalam", "Tamil", "English"]; rating = 4.6; pricePerHour = 370; available = true; description = "Trivandrum | Vehicle: Sedan (Ciaz). Specialization: Government, IT. Technopark campus, Secretariat VIP belt, Kazhakuttom and Thiruvananthapuram airport routes." },
      { id = 240; name = "Parth Trivedi"; photo = ""; experienceYears = 6; languages = ["Gujarati", "Hindi", "English"]; rating = 4.6; pricePerHour = 360; available = true; description = "Surat | Vehicle: Sedan (Honda Amaze). Specialization: Industrial, Corporate. Surat diamond market, Hazira LNG plant, DREAM city and Dumas beach resort routes." },
      { id = 241; name = "Krishnarao Deshmukh"; photo = ""; experienceYears = 12; languages = ["Marathi", "Hindi", "Kannada", "English"]; rating = 4.9; pricePerHour = 420; available = true; description = "Nagpur | Vehicle: SUV (Crysta). Specialization: Corporate, Long Distance. Nagpur zero mile, MIHAN SEZ, Wardha road and Gondia Amravati regional highway routes." },
      { id = 242; name = "Omprakash Teli"; photo = ""; experienceYears = 7; languages = ["Hindi", "Chhattisgarhi", "English"]; rating = 4.6; pricePerHour = 280; available = true; description = "Bhilai | Vehicle: Sedan (Wagon R). Specialization: Industrial, Medical. Bhilai Steel Plant, CIMS hospital, Durg railway and Bhilai township residential sectors." },
      { id = 243; name = "Tariq Nawaz"; photo = ""; experienceYears = 9; languages = ["Urdu", "Hindi", "Kashmiri"]; rating = 4.8; pricePerHour = 365; available = true; description = "Srinagar | Vehicle: SUV (Scorpio). Specialization: Tourist, Winter. Dal Lake Boulevard, Gulmarg ski resort, Pahalgam shepherd valley and Sonamarg glacier routes." },
      { id = 244; name = "Ramesh Soni"; photo = ""; experienceYears = 8; languages = ["Hindi", "Marwari", "English"]; rating = 4.7; pricePerHour = 285; available = true; description = "Jaipur | Vehicle: Sedan (Dzire). Specialization: Wedding, Tourist. Amber fort, Hawa Mahal, Nahargarh fort and MI Road city circuit. Bridal procession expert." },
      { id = 245; name = "Kishore Pramanik"; photo = ""; experienceYears = 8; languages = ["Bengali", "Hindi", "Odia"]; rating = 4.7; pricePerHour = 295; available = true; description = "Bardhaman | Vehicle: Sedan (Tata Tigor). Specialization: Corporate, Long Distance. Durgapur Expressway, Asansol coal belt, Burnpur IISCO plant and Kolkata GT road." },
      { id = 246; name = "Sachin Lokhande"; photo = ""; experienceYears = 7; languages = ["Marathi", "Hindi", "English"]; rating = 4.6; pricePerHour = 370; available = true; description = "Pune | Vehicle: Sedan (Honda City). Specialization: IT, Startup. Magarpatta Cybercity, Kalyani Nagar, Viman Nagar and Pune airport Lohegaon routes." },
      { id = 247; name = "Jaspal Hundal"; photo = ""; experienceYears = 10; languages = ["Punjabi", "Hindi", "English"]; rating = 4.8; pricePerHour = 390; available = true; description = "Amritsar | Vehicle: SUV (Innova). Specialization: Religious Tour, VIP. Wagah border ceremony, SGPC gurudwara circuit, Attari customs and Amritsar airport routes." },
      { id = 248; name = "Swapnil Kulkarni"; photo = ""; experienceYears = 6; languages = ["Marathi", "Hindi", "English"]; rating = 4.5; pricePerHour = 350; available = true; description = "Aurangabad | Vehicle: Sedan (Maruti Ciaz). Specialization: Heritage, Tourist. Ajanta-Ellora caves circuit, Bibi ka Maqbara, Daulatabad fort and CIDCO new town." },
      { id = 249; name = "Bidyut Dey"; photo = ""; experienceYears = 9; languages = ["Bengali", "Hindi", "Manipuri"]; rating = 4.7; pricePerHour = 290; available = true; description = "Agartala | Vehicle: Sedan (Dzire). Specialization: Government, Long Distance. Ujjayanta Palace, BSF check post, Akhaura Bangladesh border and Udaipur Tripura Sundari." },
      { id = 250; name = "Venkat Subramanian"; photo = ""; experienceYears = 11; languages = ["Tamil", "Telugu", "Kannada", "English"]; rating = 4.9; pricePerHour = 440; available = true; description = "Chennai | Vehicle: SUV (Crysta). Specialization: VIP, Corporate. Nungambakkam diplomatic zone, Guindy IT, TIDEL park OMR and Chennai airport Meenambakkam." },
      { id = 251; name = "Sushil Jhanjhariya"; photo = ""; experienceYears = 7; languages = ["Hindi", "Bundeli", "English"]; rating = 4.6; pricePerHour = 285; available = true; description = "Jabalpur | Vehicle: Sedan (Tata Tiago). Specialization: Heritage, Medical. Marble rocks Bhedaghat, AIIMS Bhopal highway, Madhya Pradesh High Court routes." },
      { id = 252; name = "Neeraj Thakur"; photo = ""; experienceYears = 8; languages = ["Hindi", "Himachali", "English"]; rating = 4.7; pricePerHour = 340; available = true; description = "Mandi | Vehicle: SUV (Mahindra XUV). Specialization: Hill Driving, Sacred Sites. Prashar Lake, Rewalsar holy lake, Pandoh dam and Kullu Manali highway specialist." },
      { id = 253; name = "Manoj Mohapatra"; photo = ""; experienceYears = 9; languages = ["Odia", "Hindi", "English"]; rating = 4.8; pricePerHour = 315; available = true; description = "Bhubaneswar | Vehicle: SUV (Ertiga). Specialization: Medical, Corporate. AIIMS Bhubaneswar, ESIC hospital, Infosys IT camp and Bhubaneswar airport Biju Patnaik." },
      { id = 254; name = "Vijay Kumar Mandal"; photo = ""; experienceYears = 6; languages = ["Hindi", "Maithili", "Bengali"]; rating = 4.5; pricePerHour = 270; available = true; description = "Darbhanga | Vehicle: Sedan (Maruti Dzire). Specialization: Medical, Long Distance. DMCH hospital, Darbhanga airport, Muzaffarpur highway and Sitamarhi pilgrimage routes." },
      { id = 255; name = "Prajwal Hegde"; photo = ""; experienceYears = 7; languages = ["Kannada", "Hindi", "English"]; rating = 4.6; pricePerHour = 375; available = true; description = "Davangere | Vehicle: Sedan (Honda Amaze). Specialization: Medical, Corporate. Davangere university, SSIMS hospital, Harihar cotton textile belt and NH-4 Chitradurga routes." },
      { id = 256; name = "Ajoy Debnath"; photo = ""; experienceYears = 8; languages = ["Bengali", "Hindi", "Assamese"]; rating = 4.7; pricePerHour = 280; available = true; description = "Dhubri | Vehicle: Sedan (Tata Tiago). Specialization: Border, Long Distance. Dhubri Bangladesh border, Bongaigaon railway junction, Jogigopha ferry and Assam-Bengal NH." },
      { id = 257; name = "Ramalingam Asokan"; photo = ""; experienceYears = 10; languages = ["Tamil", "English"]; rating = 4.8; pricePerHour = 370; available = true; description = "Erode | Vehicle: Sedan (Ciaz). Specialization: Industrial, Corporate. Erode textile market, Bhavani Sagar dam, Sathyamangalam tiger reserve and Salem highway." },
      { id = 258; name = "Prashant Kumar"; photo = ""; experienceYears = 7; languages = ["Hindi", "Bhojpuri", "English"]; rating = 4.6; pricePerHour = 280; available = true; description = "Gaya | Vehicle: Sedan (Dzire). Specialization: Pilgrim, Buddhist Tourism. Bodh Gaya Mahabodhi temple, Rajgir ruins, Nalanda heritage site and Pret Shila peak routes." },
      { id = 259; name = "Solanki Harikrishna"; photo = ""; experienceYears = 9; languages = ["Gujarati", "Hindi", "English"]; rating = 4.8; pricePerHour = 355; available = true; description = "Vadodara | Vehicle: SUV (Ertiga). Specialization: Heritage, Corporate. Laxmi Vilas Palace, ONGC Vadodara, Alembic pharma city and Halol GIDC industrial zone." },
      { id = 260; name = "Dipankar Sarma"; photo = ""; experienceYears = 8; languages = ["Assamese", "Hindi", "English"]; rating = 4.7; pricePerHour = 295; available = true; description = "Dibrugarh | Vehicle: SUV (Bolero). Specialization: Tea Garden, Long Distance. Dibrugarh tea estate belt, Tinsukia oil fields, Stilwell Road Naharlagun border." },
      { id = 261; name = "Shailendra Pandey"; photo = ""; experienceYears = 9; languages = ["Hindi", "English"]; rating = 4.7; pricePerHour = 320; available = true; description = "Gorakhpur | Vehicle: Sedan (Maruti Ciaz). Specialization: Pilgrim, Corporate. Gorakhnath temple, Kushinagar Buddha nirvana stupa and Nepal Sunauli border routes." },
      { id = 262; name = "Dibyendu Paul"; photo = ""; experienceYears = 7; languages = ["Bengali", "Hindi", "English"]; rating = 4.6; pricePerHour = 305; available = true; description = "Jalpaiguri | Vehicle: Sedan (Tata Tigor). Specialization: Forest, Tourism. Gorumara national park, Jaldapara elephant reserve, Buxa fort and Bhutan Phuentsholing border." },
      { id = 263; name = "Narayan Rao"; photo = ""; experienceYears = 11; languages = ["Telugu", "Hindi", "English"]; rating = 4.9; pricePerHour = 400; available = true; description = "Hyderabad | Vehicle: SUV (Crysta). Specialization: IT, Corporate. Gachibowli financial district, Amazon Nanakramguda, Kokapet new city and Hyderabad Shamshabad airport." },
      { id = 264; name = "Abhishek Sharma"; photo = ""; experienceYears = 6; languages = ["Hindi", "English"]; rating = 4.5; pricePerHour = 380; available = true; description = "Delhi | Vehicle: Sedan (Honda City). Specialization: Daily Commute, Corporate. Saket Select City, Vasant Kunj DLF mall, South Delhi Mehrauli and Chhatarpur roads." },
      { id = 265; name = "Girish Nair"; photo = ""; experienceYears = 9; languages = ["Malayalam", "Tamil", "English"]; rating = 4.8; pricePerHour = 390; available = true; description = "Kannur | Vehicle: SUV (Ertiga). Specialization: Family, Medical. Kannur medical college, Payyambalam beach, Thalassery fort and Kasaragod northern Kerala routes." },
      { id = 266; name = "Ratan Mahato"; photo = ""; experienceYears = 8; languages = ["Hindi", "Bengali", "Sadri"]; rating = 4.7; pricePerHour = 285; available = true; description = "Dhanbad | Vehicle: Sedan (Dzire). Specialization: Mining, Corporate. Dhanbad coal belt, ISM university, Jharia coal mines and Bokaro steel city highway access." },
      { id = 267; name = "Naresh Borade"; photo = ""; experienceYears = 7; languages = ["Marathi", "Hindi", "English"]; rating = 4.6; pricePerHour = 360; available = true; description = "Kolhapur | Vehicle: Sedan (Skoda Rapid). Specialization: Industrial, Pilgrim. Kolhapur Mahalaxmi temple, Panhala heritage fort, Ichalkaranji power loom and Amboli ghat." },
      { id = 268; name = "Siyaram Sahu"; photo = ""; experienceYears = 9; languages = ["Hindi", "Chhattisgarhi", "English"]; rating = 4.7; pricePerHour = 275; available = true; description = "Bilaspur | Vehicle: Sedan (Wagon R). Specialization: Medical, Long Distance. CIMS Bilaspur hospital, SECL coal HQ, Ratanpur Mahamaya temple and Amarkantak plateau routes." },
      { id = 269; name = "Pintu Mondal"; photo = ""; experienceYears = 6; languages = ["Bengali", "Hindi", "English"]; rating = 4.5; pricePerHour = 295; available = true; description = "Midnapore | Vehicle: Sedan (Tata Tiago). Specialization: Tourism, Long Distance. Digha-Mandarmani sea beach, Jhargram tribal belt, Belda tribal market and Kharagpur IIT." },
      { id = 270; name = "Chinta Rao"; photo = ""; experienceYears = 10; languages = ["Telugu", "Odia", "Hindi"]; rating = 4.8; pricePerHour = 330; available = true; description = "Visakhapatnam | Vehicle: SUV (Innova). Specialization: Port, Defence. Naval dockyard, HPCL Vizag refinery, Araku valley tribal highlands and Borra caves ghat routes." },
      { id = 271; name = "Jeevan Singh Tomar"; photo = ""; experienceYears = 8; languages = ["Hindi", "Haryanvi", "English"]; rating = 4.7; pricePerHour = 315; available = true; description = "Karnal | Vehicle: Sedan (Honda City). Specialization: Agricultural, Long Distance. Karnal NDRI dairy research, Panipat oil refinery, Karna lake and NH-44 Delhi Chandigarh." },
      { id = 272; name = "Debashish Panda"; photo = ""; experienceYears = 7; languages = ["Odia", "Bengali", "Hindi"]; rating = 4.6; pricePerHour = 300; available = true; description = "Puri | Vehicle: SUV (Bolero). Specialization: Pilgrim, Beach Tourism. Jagannath temple rath route, Chilika lake dolphins, Konark sun temple and Bhubaneswar NH corridor." },
      { id = 273; name = "Samar Babu"; photo = ""; experienceYears = 9; languages = ["Telugu", "Hindi", "English"]; rating = 4.8; pricePerHour = 345; available = true; description = "Karimnagar | Vehicle: Sedan (Ciaz). Specialization: Government, Medical. Karimnagar district hospital, ITDA offices, Ramagundam NTPC and Sriramsagar dam routes." },
      { id = 274; name = "Nilesh Patil"; photo = ""; experienceYears = 6; languages = ["Marathi", "Hindi", "English"]; rating = 4.5; pricePerHour = 350; available = true; description = "Satara | Vehicle: Sedan (Dzire). Specialization: Hill, Heritage. Satara Ajinkyatara fort, Kaas plateau flower valley, Mahabaleshwar hill resort and Kolhapur road." },
      { id = 275; name = "Lakhan Prajapati"; photo = ""; experienceYears = 8; languages = ["Hindi", "Bundeli", "English"]; rating = 4.7; pricePerHour = 280; available = true; description = "Sagar | Vehicle: Sedan (Maruti Dzire). Specialization: Medical, Long Distance. BUNDELKHAND Medical College, Sagar University, Khajuraho highway and Damoh Jabalpur road." },
      { id = 276; name = "Biswajit Borthakur"; photo = ""; experienceYears = 7; languages = ["Assamese", "Bengali", "Hindi"]; rating = 4.6; pricePerHour = 285; available = true; description = "Nagaon | Vehicle: Sedan (Tata Tigor). Specialization: Agricultural, Long Distance. Nagaon paper mill, Silghat ferry, Kaziranga buffer zone and Golaghat tea gardens." },
      { id = 277; name = "Santosh Pillai"; photo = ""; experienceYears = 10; languages = ["Malayalam", "Tamil", "Hindi", "English"]; rating = 4.9; pricePerHour = 395; available = true; description = "Kochi | Vehicle: SUV (Innova Crysta). Specialization: Corporate, Medical. SmartCity Kochi, KIMS hospital, Infopark Kakkanad and Cochin Seaport container terminal." },
      { id = 278; name = "Bhavesh Mehta"; photo = ""; experienceYears = 7; languages = ["Gujarati", "Hindi", "English"]; rating = 4.7; pricePerHour = 370; available = true; description = "Gandhinagar | Vehicle: Sedan (Honda City). Specialization: Government, Corporate. Gujarat Secretariat, GIFT City international finance, Adalaj stepwell heritage and Ahmedabad road." },
      { id = 279; name = "Rajesh Upadhyaya"; photo = ""; experienceYears = 9; languages = ["Hindi", "Marathi", "English"]; rating = 4.8; pricePerHour = 315; available = true; description = "Ujjain | Vehicle: Sedan (Maruti Ciaz). Specialization: Pilgrim, Heritage. Mahakaleshwar jyotirlinga, Kumbh Mela ghats, Omkareshwar island temple and Indore highway." },
      { id = 280; name = "Anirudh Choudhary"; photo = ""; experienceYears = 8; languages = ["Hindi", "Rajasthani", "English"]; rating = 4.7; pricePerHour = 295; available = true; description = "Alwar | Vehicle: Sedan (Dzire). Specialization: Heritage, Wildlife. Alwar City Palace, Sariska tiger reserve, Siliserh lake palace and Delhi Jaipur NH-48 highway." }
    ];

    for (driver in moreDrivers.values()) {
      drivers.add(driver.id, driver);
    };
    if (nextDriverId < 281) {
      nextDriverId := 281;
    };
  };


  public shared func addDriver(
    name : Text,
    photo : Text,
    experienceYears : Nat,
    languages : [Text],
    rating : Float,
    pricePerHour : Nat,
    description : Text,
  ) : async Nat {
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

  public shared func updateDriverAvailability(id : Nat, available : Bool) : async () {
    switch (drivers.get(id)) {
      case (?driver) {
        drivers.add(id, { id = driver.id; name = driver.name; photo = driver.photo; experienceYears = driver.experienceYears; languages = driver.languages; rating = driver.rating; pricePerHour = driver.pricePerHour; available; description = driver.description });
      };
      case (null) { Runtime.trap("Driver not found") };
    };
  };

  public shared func deleteDriver(id : Nat) : async () {
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

  public shared func updateBookingStatus(id : Nat, status : BookingStatus) : async () {
    switch (bookings.get(id)) {
      case (?booking) {
        bookings.add(id, { id = booking.id; customerName = booking.customerName; customerPhone = booking.customerPhone; pickupAddress = booking.pickupAddress; destination = booking.destination; date = booking.date; time = booking.time; durationHours = booking.durationHours; driverId = booking.driverId; totalPrice = booking.totalPrice; status; createdAt = booking.createdAt; createdBy = booking.createdBy });
      };
      case (null) { Runtime.trap("Booking not found") };
    };
  };

  public query func getAllBookings() : async [Booking] {
    bookings.values().toArray();
  };

  public type DriveEaseInfo = {
    drivers : [Driver];
    adminId : Principal;
  };

  public query func getInfo() : async DriveEaseInfo {
    { drivers = drivers.values().toArray(); adminId = Principal.fromText("aaaaa-aa") };
  };

  public shared func seedEvenMoreDrivers() : async () {
    if (drivers.size() >= 380) return;

    let evenMoreDrivers : [Driver] = [
      { id = 281; name = "Balvinder Singh Dhaliwal"; photo = ""; experienceYears = 10; languages = ["Punjabi","Hindi","English"]; rating = 4.9; pricePerHour = 395; available = true; description = "Jalandhar | Vehicle: SUV (Innova). Specialization: Corporate, Airport. Jalandhar cantt, Phagwara industrial estate, Nakodar highway and Adampur air base routes." },
      { id = 282; name = "Dinabandhu Mahapatra"; photo = ""; experienceYears = 8; languages = ["Odia","Hindi","Bengali"]; rating = 4.7; pricePerHour = 295; available = true; description = "Sambalpur | Vehicle: Sedan (Tata Tigor). Specialization: Industrial, Tourism. Sambalpur Hirakud dam, Debrigarh wildlife, Rourkela highway and Sundergarh tribal belt." },
      { id = 283; name = "Suresh Babu Pillai"; photo = ""; experienceYears = 9; languages = ["Malayalam","Tamil","English"]; rating = 4.8; pricePerHour = 380; available = true; description = "Kannur | Vehicle: SUV (Ertiga). Specialization: Family, Cultural. Kannur fort, Theyyam ritual circuit, Payyannur temple and Kasaragod coastal highway." },
      { id = 284; name = "Mukesh Chourasiya"; photo = ""; experienceYears = 7; languages = ["Hindi","Bundeli","English"]; rating = 4.6; pricePerHour = 285; available = true; description = "Sagar | Vehicle: Sedan (Maruti Dzire). Specialization: Medical, Education. Sagar BHOJ university, Sagar district hospital, Khurai road and Damoh highway routes." },
      { id = 285; name = "Tarun Gogoi"; photo = ""; experienceYears = 9; languages = ["Assamese","Bengali","Hindi"]; rating = 4.8; pricePerHour = 310; available = true; description = "Dimapur | Vehicle: SUV (Bolero). Specialization: Border, Commercial. Dimapur railway, Kohima state capital, Nagaland Nagri market and Myanmar Moreh highway." },
      { id = 286; name = "Raghu Nandan Mishra"; photo = ""; experienceYears = 11; languages = ["Hindi","English"]; rating = 4.9; pricePerHour = 335; available = true; description = "Prayagraj | Vehicle: SUV (Crysta). Specialization: Pilgrim, Kumbh Mela. Triveni Sangam, Anand Bhawan, NMC Allahabad and Kashi route during Kumbh. Crowd expert." },
      { id = 287; name = "Senthil Murugan"; photo = ""; experienceYears = 8; languages = ["Tamil","English"]; rating = 4.7; pricePerHour = 360; available = true; description = "Madurai | Vehicle: Sedan (Honda City). Specialization: Religious Tourism. Meenakshi Amman temple circuit, Tirupparankundram, Alagar kovil and Kodaikanal ghat." },
      { id = 288; name = "Kalpesh Makwana"; photo = ""; experienceYears = 7; languages = ["Gujarati","Hindi","English"]; rating = 4.6; pricePerHour = 345; available = true; description = "Anand | Vehicle: Sedan (Maruti Ciaz). Specialization: Dairy, Corporate. Anand AMUL dairy, NDDB campus, Nadiad hospital belt and Ankleshwar petrochemical routes." },
      { id = 289; name = "Akhilesh Tiwari"; photo = ""; experienceYears = 9; languages = ["Hindi","Awadhi","English"]; rating = 4.8; pricePerHour = 330; available = true; description = "Gorakhpur | Vehicle: SUV (Bolero). Specialization: Pilgrim, Long Distance. Gorakhnath temple, Kushinagar Buddha site, Nepal Sonauli border and Lucknow highway." },
      { id = 290; name = "James Lyngdoh"; photo = ""; experienceYears = 10; languages = ["Khasi","Hindi","English"]; rating = 4.8; pricePerHour = 325; available = true; description = "Shillong | Vehicle: SUV (Scorpio). Specialization: Mountain, Tourism. Cherrapunji waterfalls, Umiam lake, Mawsynram and Dawki crystal river Bangladesh border." },
      { id = 291; name = "Suraj Lobo"; photo = ""; experienceYears = 8; languages = ["Konkani","Marathi","Hindi","English"]; rating = 4.7; pricePerHour = 415; available = true; description = "Vasco da Gama | Vehicle: SUV (Innova). Specialization: Port, Corporate. Mormugao port, Dabolim airport, Verna industrial estate and Margao commercial hub." },
      { id = 292; name = "Bhupesh Thakur"; photo = ""; experienceYears = 7; languages = ["Hindi","Himachali","English"]; rating = 4.6; pricePerHour = 330; available = true; description = "Solan | Vehicle: SUV (Ertiga). Specialization: Hill, Pharma. Solan SIDCO pharma zone, Baddi industrial hub, Parwanoo and Kasauli hill resort routes." },
      { id = 293; name = "Nobin Majumdar"; photo = ""; experienceYears = 6; languages = ["Bengali","Hindi","English"]; rating = 4.5; pricePerHour = 270; available = true; description = "Tura | Vehicle: Sedan (Dzire). Specialization: Long Distance, Regional. Tura Garo hills, Nongstoin Meghalaya west, Goalpara Assam border and Dalu route." },
      { id = 294; name = "Lalramthanga Ralte"; photo = ""; experienceYears = 8; languages = ["Mizo","Hindi","English"]; rating = 4.7; pricePerHour = 290; available = true; description = "Aizawl | Vehicle: SUV (Bolero). Specialization: Mountain, Border. Aizawl Chanmari market, Champhai Myanmar border, Lunglei south Mizoram and Serchhip routes." },
      { id = 295; name = "Prakash Lama"; photo = ""; experienceYears = 9; languages = ["Nepali","Hindi","English"]; rating = 4.8; pricePerHour = 315; available = true; description = "Namchi | Vehicle: SUV (Ertiga). Specialization: Mountain, Pilgrimage. Char Dham Sikkim, Samdruptse monastery, Jorethang market and Ravangla tea garden routes." },
      { id = 296; name = "Chandra Bhushan Yadav"; photo = ""; experienceYears = 10; languages = ["Hindi","Bhojpuri","English"]; rating = 4.8; pricePerHour = 300; available = true; description = "Arrah | Vehicle: Sedan (Honda Amaze). Specialization: Medical, Long Distance. Arrah Veer Kunwar hospital, Jagdishpur BHEL, Buxar border and Patna NH-84 routes." },
      { id = 297; name = "Ashish Bhatt"; photo = ""; experienceYears = 8; languages = ["Hindi","Kumaoni","English"]; rating = 4.7; pricePerHour = 345; available = true; description = "Nainital | Vehicle: SUV (Mahindra TUV). Specialization: Lake Tourism, Family. Nainital lake, Mukteshwar apple belt, Bhimtal and Ramgarh fruit village routes." },
      { id = 298; name = "Soumyadeep Bose"; photo = ""; experienceYears = 7; languages = ["Bengali","Hindi","English"]; rating = 4.6; pricePerHour = 305; available = true; description = "Asansol | Vehicle: Sedan (Tata Tigor). Specialization: Industrial, Corporate. Asansol coalfields, Durgapur expressway, Raniganj mining belt and Burnpur IISCO." },
      { id = 299; name = "Harshad Joshi"; photo = ""; experienceYears = 9; languages = ["Marathi","Hindi","English"]; rating = 4.8; pricePerHour = 375; available = true; description = "Kolhapur | Vehicle: SUV (Ertiga). Specialization: Temple, Agri. Kolhapur Mahalakshmi temple, Panhala fort, Radhanagari dam and Sangli sugar belt routes." },
      { id = 300; name = "Premkumar Venkataraman"; photo = ""; experienceYears = 11; languages = ["Tamil","English","Telugu"]; rating = 4.9; pricePerHour = 400; available = true; description = "Trichy | Vehicle: SUV (Crysta). Specialization: Temple, Medical. Srirangam Ranganathaswamy, BHEL Trichy campus, Manapparai and Thanjavur Big Temple routes." },
      { id = 301; name = "Roshan Xaxa"; photo = ""; experienceYears = 8; languages = ["Hindi","Nagpuri","Bengali"]; rating = 4.7; pricePerHour = 280; available = true; description = "Hazaribagh | Vehicle: Sedan (Maruti Dzire). Specialization: Tourism, Medical. Hazaribagh national park, Koderma highway, Giridih Parasnath hills and Ramgarh." },
      { id = 302; name = "Mohan Nair"; photo = ""; experienceYears = 7; languages = ["Malayalam","English"]; rating = 4.6; pricePerHour = 370; available = true; description = "Palakkad | Vehicle: Sedan (Honda Amaze). Specialization: Family, Industrial. Palakkad Fort, Kanjikode industrial area, Malampuzha dam and Ooty gap forest routes." },
      { id = 303; name = "Santosh Chavan"; photo = ""; experienceYears = 9; languages = ["Marathi","Kannada","Hindi","English"]; rating = 4.8; pricePerHour = 365; available = true; description = "Belgaum | Vehicle: SUV (Bolero). Specialization: Border, Corporate. Belgaum airport, Kittur Karnataka, Dharwad university and Goa NH-4A highway." },
      { id = 304; name = "Prabir Saha"; photo = ""; experienceYears = 8; languages = ["Bengali","Hindi","English"]; rating = 4.7; pricePerHour = 285; available = true; description = "Jalpaiguri | Vehicle: Sedan (Dzire). Specialization: Tea Garden, Tourism. Jalpaiguri tea belt, Gorumara national park, Lataguri forest and Bhutan Phuentsholing gate." },
      { id = 305; name = "Praveen Hegde"; photo = ""; experienceYears = 10; languages = ["Kannada","Hindi","English"]; rating = 4.8; pricePerHour = 385; available = true; description = "Tumkur | Vehicle: SUV (Ertiga). Specialization: Corporate, Industrial. Tumkur KIADB, Sira industrial area, TATA Motors Dharwad highway and Bangalore ring road." },
      { id = 306; name = "Amandeep Gill"; photo = ""; experienceYears = 7; languages = ["Punjabi","Hindi","English"]; rating = 4.6; pricePerHour = 360; available = true; description = "Bathinda | Vehicle: Sedan (Honda City). Specialization: Industrial, Agricultural. Bathinda thermal plant, HPCL refinery, Muktsar Sahib highway and Fazilka border routes." },
      { id = 307; name = "Sudhanshu Kumar"; photo = ""; experienceYears = 8; languages = ["Hindi","Maithili","English"]; rating = 4.7; pricePerHour = 275; available = true; description = "Purnia | Vehicle: Sedan (Tata Tiago). Specialization: Medical, Long Distance. Purnia airport road, Araria border, Katihar jute belt and Kisanganj Bangladesh border." },
      { id = 308; name = "Chandrakant Patil"; photo = ""; experienceYears = 11; languages = ["Marathi","Hindi","English"]; rating = 4.9; pricePerHour = 410; available = true; description = "Sangli | Vehicle: SUV (Crysta). Specialization: Agricultural, Long Distance. Sangli turmeric market, Miraj medical district, Kupwad MIDC and Pandharpur highway." },
      { id = 309; name = "Srinivasa Reddy"; photo = ""; experienceYears = 9; languages = ["Telugu","Hindi","English"]; rating = 4.8; pricePerHour = 360; available = true; description = "Karimnagar | Vehicle: SUV (Innova). Specialization: Corporate, Medical. Karimnagar KIMS hospital, Godavari river belt, Ramagundam NTPC plant and Jagtial road." },
      { id = 310; name = "Babul Islam"; photo = ""; experienceYears = 7; languages = ["Bengali","Hindi","Assamese"]; rating = 4.6; pricePerHour = 285; available = true; description = "Nagaon | Vehicle: Sedan (Tata Tigor). Specialization: Flood Zone, Medical. Nagaon medical college, Chaparmukh railway, Morigaon and Silghat river ghat belt." },
      { id = 311; name = "Ramesh Negi"; photo = ""; experienceYears = 10; languages = ["Hindi","Kinnauri","English"]; rating = 4.9; pricePerHour = 440; available = true; description = "Shimla | Vehicle: SUV (Scorpio). Specialization: Hill, VIP. Shimla Viceregal Lodge, Kufri ski slope, Narkanda apple belt and Kinnaur Reckong Peo routes." },
      { id = 312; name = "Pankaj Bharti"; photo = ""; experienceYears = 8; languages = ["Hindi","Awadhi","English"]; rating = 4.7; pricePerHour = 300; available = true; description = "Noida | Vehicle: Sedan (Honda City). Specialization: IT, Corporate. Noida Sector 62 IT hub, Film City, Greater Noida Expressway and Yamuna Expressway routes." },
      { id = 313; name = "Rajesh Khatik"; photo = ""; experienceYears = 7; languages = ["Hindi","Marwari","English"]; rating = 4.6; pricePerHour = 295; available = true; description = "Alwar | Vehicle: Sedan (Dzire). Specialization: Heritage, Industrial. Alwar fort, Sariska tiger reserve, Neemrana industrial belt and Delhi-Jaipur NH-48 routes." },
      { id = 314; name = "Gangadhar Rao"; photo = ""; experienceYears = 9; languages = ["Telugu","Kannada","Hindi","English"]; rating = 4.8; pricePerHour = 375; available = true; description = "Secunderabad | Vehicle: SUV (Ertiga). Specialization: Military, Corporate. Secundarabad cantonment, Bowenpally market, Trimulgherry and Malkajgiri IT corridor." },
      { id = 315; name = "Vijay Annasaheb Mane"; photo = ""; experienceYears = 8; languages = ["Marathi","Hindi","English"]; rating = 4.7; pricePerHour = 365; available = true; description = "Karad | Vehicle: Sedan (Maruti Ciaz). Specialization: Medical, Agri. Krishna river belt, Wai hill station, Satara fortress and Kolhapur highway routes." },
      { id = 316; name = "Kumar Mangalam"; photo = ""; experienceYears = 10; languages = ["Hindi","Bihari","English"]; rating = 4.8; pricePerHour = 285; available = true; description = "Bhagalpur | Vehicle: Sedan (Dzire). Specialization: Silk Route, Medical. Bhagalpur silk market, JLNMCH hospital, Vikramshila ruins and Banka Deoghar highway." },
      { id = 317; name = "Sripal Jain"; photo = ""; experienceYears = 7; languages = ["Hindi","Rajasthani","English"]; rating = 4.6; pricePerHour = 290; available = true; description = "Jodhpur | Vehicle: SUV (Bolero). Specialization: Desert Heritage. Mehrangarh fort, Mandore gardens, Salawas weaving village and Jaisalmer golden highway." },
      { id = 318; name = "Bipin Chhetri"; photo = ""; experienceYears = 9; languages = ["Nepali","Hindi","English"]; rating = 4.7; pricePerHour = 310; available = true; description = "Darjeeling | Vehicle: SUV (Mahindra Thar). Specialization: Off-road, Mountain. Sandakphu trekking base, Rimbick, Srikhola river valley and Ilam Nepal border routes." },
      { id = 319; name = "Damodaran Krishnan"; photo = ""; experienceYears = 11; languages = ["Malayalam","Tamil","English"]; rating = 4.9; pricePerHour = 420; available = true; description = "Kochi | Vehicle: SUV (Crysta). Specialization: Port, Corporate. Kochi CSEZ SEZ, Mattancherry port, Infopark Kakkanad and Kochi metro Ernakulam routes." },
      { id = 320; name = "Gopal Verma"; photo = ""; experienceYears = 8; languages = ["Hindi","Awadhi","English"]; rating = 4.7; pricePerHour = 310; available = true; description = "Lucknow | Vehicle: Sedan (Honda City). Specialization: Government, Medical. Lucknow KGMU hospital, Hazratganj, Amausi airport and Gomti Nagar IT city routes." },
      { id = 321; name = "Shantilal Meena"; photo = ""; experienceYears = 6; languages = ["Hindi","Mewari","English"]; rating = 4.5; pricePerHour = 270; available = true; description = "Dausa | Vehicle: Sedan (Maruti Tiago). Specialization: Pilgrim, Agricultural. Mehndipur Balaji temple, Bandikui market, Lalsot highway and Jaipur-Agra national route." },
      { id = 322; name = "Benito Fernandes"; photo = ""; experienceYears = 10; languages = ["Konkani","Portuguese","Hindi","English"]; rating = 4.9; pricePerHour = 450; available = true; description = "Panaji | Vehicle: SUV (Innova Crysta). Specialization: Tourism, Luxury. Panaji heritage walks, Mandovi casino cruise, Old Goa churches and Dudhsagar waterfalls route." },
      { id = 323; name = "Ramamurthy Suresh"; photo = ""; experienceYears = 9; languages = ["Telugu","Tamil","Kannada","English"]; rating = 4.8; pricePerHour = 390; available = true; description = "Nizamabad | Vehicle: SUV (Ertiga). Specialization: Agricultural, Medical. Nizamabad district hospital, Armoor turmeric market, Kamareddy highway and Adilabad." },
      { id = 324; name = "Ajay Chandavarkar"; photo = ""; experienceYears = 8; languages = ["Marathi","Kannada","Hindi","English"]; rating = 4.7; pricePerHour = 375; available = true; description = "Hubli | Vehicle: Sedan (Honda City). Specialization: Commercial, Startup. Hubli Dharwad smart city, Unkal commercial zone, Navanagar IT layout and Koppal highway." },
      { id = 325; name = "Lokesh Yadav"; photo = ""; experienceYears = 7; languages = ["Hindi","Haryanvi","English"]; rating = 4.6; pricePerHour = 325; available = true; description = "Sonipat | Vehicle: Sedan (Dzire). Specialization: Industrial, Commute. Sonipat IMT, Kundli industrial area, KMP Expressway and Murthal dhaba highway." },
      { id = 326; name = "Bhaskar Sinha"; photo = ""; experienceYears = 10; languages = ["Hindi","Maithili","Bengali","English"]; rating = 4.8; pricePerHour = 295; available = true; description = "Darbhanga | Vehicle: SUV (Scorpio). Specialization: Medical, Government. Darbhanga medical college DMCH, Laheriasarai market, Biraul and Madhubani Mithila art routes." },
      { id = 327; name = "George Mathew"; photo = ""; experienceYears = 9; languages = ["Malayalam","English"]; rating = 4.8; pricePerHour = 405; available = true; description = "Thrissur | Vehicle: MPV (Traveller). Specialization: Wedding, Family Groups. Thrissur Pooram, Guruvayur, Irinjalakuda Koodalmanikyam and Kodungallur Bhagavati routes." },
      { id = 328; name = "Vikram Rana"; photo = ""; experienceYears = 8; languages = ["Hindi","Dogri","English"]; rating = 4.7; pricePerHour = 345; available = true; description = "Jammu | Vehicle: SUV (Bolero). Specialization: Pilgrimage, Border. Vaishno Devi base Katra, Patnitop, Suchetgarh Wagah-type route and Lakhanpur Punjab border." },
      { id = 329; name = "Arun Somaiah"; photo = ""; experienceYears = 11; languages = ["Kannada","Tamil","Telugu","English"]; rating = 4.9; pricePerHour = 430; available = true; description = "Bengaluru | Vehicle: SUV (Crysta). Specialization: IT, Luxury. Koramangala startup hub, Whitefield Embassy Tech, Electronic City phase and Kempegowda airport." },
      { id = 330; name = "Mohammad Altaf Hussain"; photo = ""; experienceYears = 9; languages = ["Urdu","Kashmiri","Hindi","English"]; rating = 4.8; pricePerHour = 355; available = true; description = "Anantnag | Vehicle: SUV (Scorpio). Specialization: Valley Tourism. Pahalgam resort valley, Achabal Mughal garden, Kokernag springs and Martand sun temple ruins." },
      { id = 331; name = "Santanu Ghosh"; photo = ""; experienceYears = 7; languages = ["Bengali","Hindi","English"]; rating = 4.6; pricePerHour = 295; available = true; description = "Krishnanagar | Vehicle: Sedan (Maruti Dzire). Specialization: Heritage, Medical. Krishnanagar clay artisans belt, Bethuadahari wildlife, Murshidabad Nawab palace and Ranaghat." },
      { id = 332; name = "Dilip Tatkare"; photo = ""; experienceYears = 10; languages = ["Marathi","Hindi","English"]; rating = 4.8; pricePerHour = 390; available = true; description = "Ratnagiri | Vehicle: SUV (Ertiga). Specialization: Coastal, Tourism. Ratnagiri Alfanso mango belt, Ganpatipule beach, Guhagar coast and Konkan railway scenic route." },
      { id = 333; name = "Ranjeet Sao"; photo = ""; experienceYears = 8; languages = ["Hindi","Chhattisgarhi","Nagpuri"]; rating = 4.7; pricePerHour = 275; available = true; description = "Bilaspur | Vehicle: Sedan (Tata Tigor). Specialization: Medical, Corporate. Cims Bilaspur hospital, SECL coal office, NTPC Sipat and Korba power plant highway." },
      { id = 334; name = "Yenumula Sekhar"; photo = ""; experienceYears = 9; languages = ["Telugu","Hindi","English"]; rating = 4.8; pricePerHour = 355; available = true; description = "Warangal | Vehicle: SUV (Innova). Specialization: Heritage, Medical. Warangal fort, Kakatiya university, MGM hospital and Hyderabad Outer Ring Road route." },
      { id = 335; name = "Anthony Lourdusamy"; photo = ""; experienceYears = 8; languages = ["Tamil","English"]; rating = 4.7; pricePerHour = 350; available = true; description = "Pondicherry | Vehicle: Sedan (Honda City). Specialization: Ashram, French Heritage. Auroville experimental township, Sri Aurobindo Ashram, Rock Beach and Arikamedu routes." },
      { id = 336; name = "Narayan Das Panda"; photo = ""; experienceYears = 10; languages = ["Odia","Hindi","Bengali","English"]; rating = 4.8; pricePerHour = 320; available = true; description = "Puri | Vehicle: SUV (Ertiga). Specialization: Temple, Tourist. Jagannath Puri rath yatra route, Konark Sun Temple, Chilika lake bird sanctuary and Bhubaneswar." },
      { id = 337; name = "Shafique Ahmed"; photo = ""; experienceYears = 7; languages = ["Urdu","Hindi","Bengali"]; rating = 4.6; pricePerHour = 280; available = true; description = "Malda | Vehicle: Sedan (Dzire). Specialization: Border, Heritage. Gaur ruins, Pandua mosque, Maldah mango belt, English Bazar and Bangladesh Sonamasjid border." },
      { id = 338; name = "Pradeep Kapse"; photo = ""; experienceYears = 8; languages = ["Marathi","Hindi","English"]; rating = 4.7; pricePerHour = 380; available = true; description = "Akola | Vehicle: Sedan (Honda Amaze). Specialization: Agricultural, Medical. Akola cotton market, Wakad MIDC, Government medical college and Wardha highway routes." },
      { id = 339; name = "Virendra Sahu"; photo = ""; experienceYears = 9; languages = ["Hindi","Chhattisgarhi","English"]; rating = 4.7; pricePerHour = 285; available = true; description = "Korba | Vehicle: SUV (Bolero). Specialization: Power, Industrial. Korba super thermal power, BALCO aluminium plant, Hasdev river belt and Bilaspur route." },
      { id = 340; name = "Subramanian Ayyar"; photo = ""; experienceYears = 11; languages = ["Tamil","English","Malayalam"]; rating = 4.9; pricePerHour = 395; available = true; description = "Tiruvannamalai | Vehicle: SUV (Crysta). Specialization: Spiritual, Temple. Arunachaleswarar temple Karthigai deepam, Ramana Maharshi Ashram and Gingee fort route." },
      { id = 341; name = "Ajit Rathore"; photo = ""; experienceYears = 8; languages = ["Hindi","Rajasthani","English"]; rating = 4.7; pricePerHour = 300; available = true; description = "Udaipur | Vehicle: SUV (Ertiga). Specialization: Royal Heritage, Wedding. City Palace lake route, Jag Mandir, Haldi Ghati battlefield and Nathdwara Srinathji routes." },
      { id = 342; name = "Nangsel Dorjee"; photo = ""; experienceYears = 12; languages = ["Tibetan","Hindi","English"]; rating = 4.9; pricePerHour = 460; available = true; description = "Kargil | Vehicle: SUV (Land Cruiser). Specialization: High Altitude, Military. Kargil war memorial, Suru valley, Zanskar river gorge and Srinagar NH-1 altitude route." },
      { id = 343; name = "Bikash Deuri"; photo = ""; experienceYears = 7; languages = ["Assamese","Bodo","Hindi"]; rating = 4.6; pricePerHour = 300; available = true; description = "Tezpur | Vehicle: Sedan (Tata Tiago). Specialization: Tourism, Flood Zone. Tezpur Agnigarh park, Nameri national park, Orang rhino sanctuary and Kaziranga route." },
      { id = 344; name = "Venugopalan Thampi"; photo = ""; experienceYears = 10; languages = ["Malayalam","Tamil","English"]; rating = 4.8; pricePerHour = 395; available = true; description = "Alappuzha | Vehicle: SUV (Innova). Specialization: Backwater, Medical. Alleppey boathouse hub, GCDA hospital, Chengannur river town and Kottayam medical college." },
      { id = 345; name = "Rajesh Pisharody"; photo = ""; experienceYears = 9; languages = ["Malayalam","Hindi","English"]; rating = 4.8; pricePerHour = 385; available = true; description = "Kozhikode | Vehicle: SUV (Ertiga). Specialization: Trade, Medical. Kozhikode beach market, Baby Memorial hospital, Malabar Gold showroom belt and Wayanad ghat." },
      { id = 346; name = "Aniket Shinde"; photo = ""; experienceYears = 7; languages = ["Marathi","Hindi","English"]; rating = 4.6; pricePerHour = 370; available = true; description = "Ahmednagar | Vehicle: Sedan (Maruti Ciaz). Specialization: Industrial, Religious. Shirdi Sai Baba temple, Ahmednagar fort, Shrirampur MIDC and Aurangabad highway." },
      { id = 347; name = "Rupak Mitra"; photo = ""; experienceYears = 8; languages = ["Bengali","Hindi","English"]; rating = 4.7; pricePerHour = 295; available = true; description = "Bankura | Vehicle: Sedan (Dzire). Specialization: Heritage, Craft Tourism. Bishnupur terracotta temple circuit, Susunia hill, Jhargram tribal belt and Durgapur highway." },
      { id = 348; name = "Surendra Singh Rawat"; photo = ""; experienceYears = 10; languages = ["Hindi","Garhwali","English"]; rating = 4.8; pricePerHour = 360; available = true; description = "Haridwar | Vehicle: SUV (Innova). Specialization: Pilgrimage, Kumbh. Har Ki Pauri Ganga ghat, BHEL Ranipur, Patanjali campus and Rishikesh ashram belt routes." },
      { id = 349; name = "Venkateswarlu Pottabathini"; photo = ""; experienceYears = 9; languages = ["Telugu","Hindi","English"]; rating = 4.8; pricePerHour = 350; available = true; description = "Visakhapatnam | Vehicle: SUV (Crysta). Specialization: Naval, Corporate. INS Circars naval base, BHPV plant, Simhachalam temple and Bheemili beach resort routes." },
      { id = 350; name = "Balram Tandi"; photo = ""; experienceYears = 8; languages = ["Hindi","Nagpuri","Odia"]; rating = 4.7; pricePerHour = 280; available = true; description = "Dhanbad | Vehicle: Sedan (Tata Tigor). Specialization: Coal, Industrial. BCCL Dhanbad HQ, ISM university, Jharia coal mine belt and Bokaro steel city highway." },
      { id = 351; name = "Sanjib Deka"; photo = ""; experienceYears = 7; languages = ["Assamese","Hindi","English"]; rating = 4.6; pricePerHour = 290; available = true; description = "Tinsukia | Vehicle: SUV (Bolero). Specialization: Oil, Tea Garden. Digboi oil refinery India oldest, Doom Dooma tea belt, Ledo road and Myanmar Nampong routes." },
      { id = 352; name = "Hemendra Parmar"; photo = ""; experienceYears = 9; languages = ["Gujarati","Hindi","English"]; rating = 4.8; pricePerHour = 365; available = true; description = "Jamnagar | Vehicle: SUV (Ertiga). Specialization: Refinery, Port. Jamnagar Reliance refinery, Marine national park and Balachadi beach resort routes." },
      { id = 353; name = "Sujit Sarkar"; photo = ""; experienceYears = 8; languages = ["Bengali","Hindi","English"]; rating = 4.7; pricePerHour = 290; available = true; description = "Cooch Behar | Vehicle: Sedan (Maruti Dzire). Specialization: Heritage, Border. Cooch Behar palace, Rasikbil wildlife, Changrabandha Bangladesh border and Alipurduar route." },
      { id = 354; name = "Nandkumar Bhamre"; photo = ""; experienceYears = 10; languages = ["Marathi","Hindi","English"]; rating = 4.8; pricePerHour = 375; available = true; description = "Dhule | Vehicle: SUV (Ertiga). Specialization: Agricultural, Long Distance. Dhule MIDC, Shirpur education city, Nandurbar tribal belt and Surat Gujarat highway." },
      { id = 355; name = "Prabhakaran Rajan"; photo = ""; experienceYears = 9; languages = ["Tamil","English"]; rating = 4.8; pricePerHour = 355; available = true; description = "Tuticorin | Vehicle: SUV (Innova). Specialization: Port, Industrial. Tuticorin deep sea port, SPIC fertilizer, Sterlite copper and Tirunelveli Tirupur highway." },
      { id = 356; name = "Dushyant Srivastava"; photo = ""; experienceYears = 8; languages = ["Hindi","Awadhi","English"]; rating = 4.7; pricePerHour = 305; available = true; description = "Agra | Vehicle: SUV (Ertiga). Specialization: Heritage, Tourist. Taj Mahal VIP gate, Agra fort, Fatehpur Sikri and Mathura Vrindavan circuit tour routes." },
      { id = 357; name = "Brajesh Senger"; photo = ""; experienceYears = 7; languages = ["Hindi","Bundeli","English"]; rating = 4.6; pricePerHour = 275; available = true; description = "Rewa | Vehicle: Sedan (Dzire). Specialization: Medical, Education. Rewa SGMH medical college, white tiger safari, Chitragupt Puja site and Banda MP highway." },
      { id = 358; name = "Anbu Chelvan"; photo = ""; experienceYears = 10; languages = ["Tamil","English"]; rating = 4.9; pricePerHour = 395; available = true; description = "Coimbatore | Vehicle: SUV (Crysta). Specialization: Medical, Education. Coimbatore medical college, PSG Tech, Kovai aerodrome and Ooty Mettupalayam rack railway base." },
      { id = 359; name = "Shyamalendu Sen"; photo = ""; experienceYears = 9; languages = ["Bengali","Hindi","English"]; rating = 4.8; pricePerHour = 295; available = true; description = "Midnapore | Vehicle: Sedan (Tata Tigor). Specialization: Rural, Medical. Midnapore medical college, Vidyasagar university, Digha sea beach highway and Jhargram." },
      { id = 360; name = "Tejaram Choudhary"; photo = ""; experienceYears = 8; languages = ["Hindi","Rajasthani","English"]; rating = 4.7; pricePerHour = 285; available = true; description = "Sikar | Vehicle: SUV (Bolero). Specialization: Shekhawati Heritage. Fatehpur painted havelis, Nawalgarh, Mandawa castle and Jhunjhunu merchant town routes." },
      { id = 361; name = "Siby Thomas"; photo = ""; experienceYears = 10; languages = ["Malayalam","English"]; rating = 4.8; pricePerHour = 400; available = true; description = "Ernakulam | Vehicle: SUV (Crysta). Specialization: Medical, Corporate. Amrita hospital Kochi, Lulu Mall hub, Marine Drive and Edapally junction commercial belt." },
      { id = 362; name = "Rohit Bisen"; photo = ""; experienceYears = 7; languages = ["Hindi","Gondi","English"]; rating = 4.6; pricePerHour = 270; available = true; description = "Balaghat | Vehicle: Sedan (Maruti Wagon R). Specialization: Mining, Tribal. Malanjkhand copper mine, Kanha national park feeder, Gondia MP border and Seoni route." },
      { id = 363; name = "Krishan Kataria"; photo = ""; experienceYears = 9; languages = ["Hindi","Haryanvi","Rajasthani","English"]; rating = 4.8; pricePerHour = 310; available = true; description = "Hisar | Vehicle: SUV (Ertiga). Specialization: Agricultural, Industrial. Hisar HSIDC, National Dairy Research, Sirsa highway and Fatehabad cotton belt routes." },
      { id = 364; name = "Debabroto Bhaduri"; photo = ""; experienceYears = 8; languages = ["Bengali","Hindi","English"]; rating = 4.7; pricePerHour = 300; available = true; description = "Burdwan | Vehicle: Sedan (Honda Amaze). Specialization: Education, Medical. Burdwan University, BCRIMS hospital, Memari coal yard and Bardhaman railway junction." },
      { id = 365; name = "Shashikant Ingale"; photo = ""; experienceYears = 10; languages = ["Marathi","Hindi","English"]; rating = 4.8; pricePerHour = 370; available = true; description = "Latur | Vehicle: SUV (Bolero). Specialization: Agricultural, Medical. Latur seed hub, Government medical college, Osmanabad highway and Bidar Karnataka border." },
      { id = 366; name = "Praveen Raj"; photo = ""; experienceYears = 7; languages = ["Tamil","Kannada","English"]; rating = 4.6; pricePerHour = 360; available = true; description = "Hosur | Vehicle: Sedan (Honda City). Specialization: EV, Industrial. Hosur EV cluster, TVS, BMW plant, Tata Nexon factory and Bengaluru Electronic City highway." },
      { id = 367; name = "Ajoy Hazarika"; photo = ""; experienceYears = 9; languages = ["Assamese","Hindi","Bengali"]; rating = 4.8; pricePerHour = 305; available = true; description = "Kokrajhar | Vehicle: SUV (Scorpio). Specialization: Border, Tribal. Kokrajhar BTAD headquarters, Manas national park buffer, Bongaigaon railway and Bhutan border." },
      { id = 368; name = "Kiran Kumar Bondla"; photo = ""; experienceYears = 8; languages = ["Telugu","Hindi","English"]; rating = 4.7; pricePerHour = 345; available = true; description = "Nellore | Vehicle: Sedan (Honda Amaze). Specialization: Aquaculture, Medical. Nellore shrimp capital, SDMH hospital, Krishnapatnam port and SPSR Nellore highway." },
      { id = 369; name = "Anand Sharma"; photo = ""; experienceYears = 11; languages = ["Hindi","Dogri","Punjabi","English"]; rating = 4.9; pricePerHour = 385; available = true; description = "Pathankot | Vehicle: SUV (Innova). Specialization: Military, Tourism. Pathankot air force base, Dharamsala Mcleodganj, Dalhousie Chamba and Jammu highway." },
      { id = 370; name = "Harishankar Prajapati"; photo = ""; experienceYears = 7; languages = ["Hindi","Rajasthani","English"]; rating = 4.6; pricePerHour = 290; available = true; description = "Bhilwara | Vehicle: Sedan (Dzire). Specialization: Textile, Medical. Bhilwara textile hub, Mewar region highway, Chittorgarh fort and Kankroli Rajsamand routes." },
      { id = 371; name = "Sonjoy Datta"; photo = ""; experienceYears = 8; languages = ["Bengali","Hindi","Assamese"]; rating = 4.7; pricePerHour = 285; available = true; description = "Karimganj | Vehicle: Sedan (Tata Tiago). Specialization: Border, Long Distance. Sutarkandi Bangladesh border, Badarpur railway junction, Jiribam and Imphal road." },
      { id = 372; name = "Mahesh Balusamy"; photo = ""; experienceYears = 9; languages = ["Tamil","Telugu","Kannada","English"]; rating = 4.8; pricePerHour = 350; available = true; description = "Vellore | Vehicle: SUV (Crysta). Specialization: Medical Tourism. CMC Vellore super-specialty, TNMSC depot, Tirupati foothills and Chittoor AP border routes." },
      { id = 373; name = "Deepak Haldar"; photo = ""; experienceYears = 7; languages = ["Bengali","Hindi","English"]; rating = 4.6; pricePerHour = 295; available = true; description = "Diamond Harbour | Vehicle: Sedan (Maruti Dzire). Specialization: Coastal, Long Distance. Sagar island transit, Kakdwip fishing port, Diamond Harbour waterfront and Kolkata NH." },
      { id = 374; name = "Suresh Ananthakrishnan"; photo = ""; experienceYears = 10; languages = ["Tamil","Malayalam","English"]; rating = 4.9; pricePerHour = 405; available = true; description = "Nagercoil | Vehicle: SUV (Innova). Specialization: Tip of India, Tourism. Kanyakumari confluence, Padmanabhapuram palace, Tiruchendur temple and Rameshwaram route." },
      { id = 375; name = "Ramkumar Chauhan"; photo = ""; experienceYears = 8; languages = ["Hindi","Rajasthani","English"]; rating = 4.7; pricePerHour = 300; available = true; description = "Kota | Vehicle: SUV (Bolero). Specialization: Education, Industrial. Kota coaching institutes belt, JK Tire plant, Chambal river resort and Bundi palace highway." },
      { id = 376; name = "Nilofer Shaikh"; photo = ""; experienceYears = 7; languages = ["Urdu","Hindi","Marathi","English"]; rating = 4.6; pricePerHour = 360; available = true; description = "Aurangabad | Vehicle: Sedan (Honda Amaze). Specialization: Heritage, Corporate. Ellora caves circuit, Aurangabad CIDCO industrial estate, Waluj MIDC and Shirdi route." },
      { id = 377; name = "Deepankar Baruah"; photo = ""; experienceYears = 9; languages = ["Assamese","Hindi","English"]; rating = 4.8; pricePerHour = 320; available = true; description = "Jorhat | Vehicle: SUV (Ertiga). Specialization: Tea, Tourism. Jorhat tea experimental station, Majuli world largest river island ferry and Kaziranga entry gate." },
      { id = 378; name = "Vinay Sahai"; photo = ""; experienceYears = 8; languages = ["Hindi","English"]; rating = 4.7; pricePerHour = 330; available = true; description = "Kanpur | Vehicle: Sedan (Honda City). Specialization: Corporate, Industrial. Kanpur leather export cluster, IIT Kanpur, Panki power plant and Unnao bridge highway." },
      { id = 379; name = "Dhruv Kapoor"; photo = ""; experienceYears = 10; languages = ["Hindi","Punjabi","English"]; rating = 4.9; pricePerHour = 420; available = true; description = "New Delhi | Vehicle: SUV (Crysta). Specialization: VIP, Diplomatic. Lutyens zone, India Gate circuit, IGI airport T3 and South Delhi embassy enclave routes." },
      { id = 380; name = "Thoibi Wahengbam"; photo = ""; experienceYears = 8; languages = ["Meitei","Hindi","English"]; rating = 4.7; pricePerHour = 295; available = true; description = "Imphal | Vehicle: SUV (Bolero). Specialization: Border, Cultural. Imphal Loktak lake, Moreh Myanmar border, Ima Keithel women market and Kangla fort routes." }
    ];

    for (driver in evenMoreDrivers.values()) {
      drivers.add(driver.id, driver);
    };
    nextDriverId := 381;
  };
};
