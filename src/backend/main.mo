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
      { id = 160; name = "Kapil Dev Malik"; photo = ""; experienceYears = 11; languages = ["Hindi", "Haryanvi", "English"]; rating = 4.9; pricePerHour = 460; available = true; description = "Delhi | 11 yrs NCR veteran. Aerocity, Dwarka, Rohini, Pitampura and North Delhi hospital corridor." }

    ];

    for (driver in sampleDrivers.values()) {
      drivers.add(driver.id, driver);
    };
    nextDriverId := 161;
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
