interface LocationInfo {
  state: string;
  city: string;
}

const LOCATION_MAP: { keywords: string[]; state: string; city: string }[] = [
  // Delhi NCR
  {
    keywords: ["delhi", "ncr", "connaught", "lajpat", "dwarka", "rohini"],
    state: "Delhi",
    city: "New Delhi",
  },
  {
    keywords: ["gurgaon", "gurugram", "cyber hub", "cyber city"],
    state: "Haryana",
    city: "Gurgaon",
  },
  {
    keywords: ["noida", "greater noida", "sector 62", "sector 18"],
    state: "Uttar Pradesh",
    city: "Noida",
  },
  { keywords: ["faridabad"], state: "Haryana", city: "Faridabad" },
  // Maharashtra
  {
    keywords: [
      "mumbai",
      "bandra",
      "andheri",
      "borivali",
      "dadar",
      "thane",
      "navi mumbai",
      "bkc",
      "lower parel",
    ],
    state: "Maharashtra",
    city: "Mumbai",
  },
  {
    keywords: ["pune", "hinjewadi", "kothrud", "hadapsar", "baner", "wakad"],
    state: "Maharashtra",
    city: "Pune",
  },
  { keywords: ["nagpur"], state: "Maharashtra", city: "Nagpur" },
  { keywords: ["nashik"], state: "Maharashtra", city: "Nashik" },
  { keywords: ["aurangabad"], state: "Maharashtra", city: "Aurangabad" },
  // Karnataka
  {
    keywords: [
      "bengaluru",
      "bangalore",
      "whitefield",
      "electronic city",
      "koramangala",
      "indiranagar",
      "hsr",
      "jp nagar",
    ],
    state: "Karnataka",
    city: "Bengaluru",
  },
  { keywords: ["mysuru", "mysore"], state: "Karnataka", city: "Mysuru" },
  { keywords: ["hubli", "dharwad"], state: "Karnataka", city: "Hubli" },
  {
    keywords: ["mangalore", "mangaluru"],
    state: "Karnataka",
    city: "Mangaluru",
  },
  // Tamil Nadu
  {
    keywords: [
      "chennai",
      "anna nagar",
      "t nagar",
      "velachery",
      "adyar",
      "tambaram",
    ],
    state: "Tamil Nadu",
    city: "Chennai",
  },
  { keywords: ["coimbatore"], state: "Tamil Nadu", city: "Coimbatore" },
  { keywords: ["madurai"], state: "Tamil Nadu", city: "Madurai" },
  {
    keywords: ["trichy", "tiruchirappalli"],
    state: "Tamil Nadu",
    city: "Trichy",
  },
  // West Bengal
  {
    keywords: [
      "kolkata",
      "calcutta",
      "salt lake",
      "howrah",
      "park street",
      "new town",
    ],
    state: "West Bengal",
    city: "Kolkata",
  },
  { keywords: ["darjeeling"], state: "West Bengal", city: "Darjeeling" },
  { keywords: ["siliguri"], state: "West Bengal", city: "Siliguri" },
  // Telangana
  {
    keywords: [
      "hyderabad",
      "hitec city",
      "banjara hills",
      "jubilee hills",
      "secunderabad",
      "shamshabad",
    ],
    state: "Telangana",
    city: "Hyderabad",
  },
  // Andhra Pradesh
  {
    keywords: ["visakhapatnam", "vizag", "beach road"],
    state: "Andhra Pradesh",
    city: "Visakhapatnam",
  },
  { keywords: ["vijayawada"], state: "Andhra Pradesh", city: "Vijayawada" },
  { keywords: ["amaravati"], state: "Andhra Pradesh", city: "Amaravati" },
  // Rajasthan
  {
    keywords: ["jaipur", "city palace", "amber fort", "hawa mahal"],
    state: "Rajasthan",
    city: "Jaipur",
  },
  { keywords: ["udaipur"], state: "Rajasthan", city: "Udaipur" },
  { keywords: ["jodhpur"], state: "Rajasthan", city: "Jodhpur" },
  { keywords: ["jaisalmer"], state: "Rajasthan", city: "Jaisalmer" },
  { keywords: ["ajmer"], state: "Rajasthan", city: "Ajmer" },
  // Gujarat
  {
    keywords: ["ahmedabad", "naroda", "sardar patel"],
    state: "Gujarat",
    city: "Ahmedabad",
  },
  { keywords: ["surat"], state: "Gujarat", city: "Surat" },
  { keywords: ["vadodara", "baroda"], state: "Gujarat", city: "Vadodara" },
  // Punjab
  {
    keywords: ["amritsar", "golden temple", "raja sansi"],
    state: "Punjab",
    city: "Amritsar",
  },
  { keywords: ["ludhiana"], state: "Punjab", city: "Ludhiana" },
  { keywords: ["jalandhar"], state: "Punjab", city: "Jalandhar" },
  {
    keywords: ["chandigarh", "sector 17", "chandigarh airport"],
    state: "Punjab",
    city: "Chandigarh",
  },
  // Haryana
  { keywords: ["panipat"], state: "Haryana", city: "Panipat" },
  { keywords: ["ambala"], state: "Haryana", city: "Ambala" },
  // Uttar Pradesh
  {
    keywords: ["lucknow", "hazratganj", "charbagh", "gomti nagar"],
    state: "Uttar Pradesh",
    city: "Lucknow",
  },
  {
    keywords: ["varanasi", "banaras", "kashi", "dashashwamedh", "ghat"],
    state: "Uttar Pradesh",
    city: "Varanasi",
  },
  {
    keywords: ["agra", "taj mahal", "fatehpur"],
    state: "Uttar Pradesh",
    city: "Agra",
  },
  { keywords: ["kanpur"], state: "Uttar Pradesh", city: "Kanpur" },
  {
    keywords: ["allahabad", "prayagraj"],
    state: "Uttar Pradesh",
    city: "Prayagraj",
  },
  {
    keywords: ["mathura", "vrindavan"],
    state: "Uttar Pradesh",
    city: "Mathura",
  },
  // Madhya Pradesh
  {
    keywords: ["bhopal", "db city", "raja bhoj"],
    state: "Madhya Pradesh",
    city: "Bhopal",
  },
  { keywords: ["indore"], state: "Madhya Pradesh", city: "Indore" },
  { keywords: ["gwalior"], state: "Madhya Pradesh", city: "Gwalior" },
  { keywords: ["jabalpur"], state: "Madhya Pradesh", city: "Jabalpur" },
  // Kerala
  {
    keywords: ["kochi", "cochin", "ernakulam", "mg road", "cochin port"],
    state: "Kerala",
    city: "Kochi",
  },
  {
    keywords: ["thiruvananthapuram", "trivandrum", "technopark", "trv airport"],
    state: "Kerala",
    city: "Thiruvananthapuram",
  },
  { keywords: ["kozhikode", "calicut"], state: "Kerala", city: "Kozhikode" },
  { keywords: ["thrissur"], state: "Kerala", city: "Thrissur" },
  // Assam
  {
    keywords: ["guwahati", "paltan bazar", "lokpriya", "dispur"],
    state: "Assam",
    city: "Guwahati",
  },
  { keywords: ["dibrugarh"], state: "Assam", city: "Dibrugarh" },
  { keywords: ["jorhat"], state: "Assam", city: "Jorhat" },
  // Bihar
  {
    keywords: ["patna", "gandhi maidan", "patna junction"],
    state: "Bihar",
    city: "Patna",
  },
  { keywords: ["gaya", "bodh gaya"], state: "Bihar", city: "Gaya" },
  // Odisha
  { keywords: ["bhubaneswar", "ekamra"], state: "Odisha", city: "Bhubaneswar" },
  { keywords: ["puri", "jagannath"], state: "Odisha", city: "Puri" },
  { keywords: ["cuttack"], state: "Odisha", city: "Cuttack" },
  // Jharkhand
  { keywords: ["ranchi", "jharkhand"], state: "Jharkhand", city: "Ranchi" },
  { keywords: ["jamshedpur"], state: "Jharkhand", city: "Jamshedpur" },
  // Chhattisgarh
  { keywords: ["raipur", "telibandha"], state: "Chhattisgarh", city: "Raipur" },
  { keywords: ["bhilai"], state: "Chhattisgarh", city: "Bhilai" },
  // Uttarakhand
  {
    keywords: ["dehradun", "mussoorie", "doon"],
    state: "Uttarakhand",
    city: "Dehradun",
  },
  {
    keywords: ["haridwar", "rishikesh"],
    state: "Uttarakhand",
    city: "Haridwar",
  },
  { keywords: ["nainital"], state: "Uttarakhand", city: "Nainital" },
  // Himachal Pradesh
  {
    keywords: ["shimla", "himachal", "mall road"],
    state: "Himachal Pradesh",
    city: "Shimla",
  },
  {
    keywords: ["manali", "rohtang", "kullu"],
    state: "Himachal Pradesh",
    city: "Manali",
  },
  {
    keywords: ["dharamsala", "mcleod ganj"],
    state: "Himachal Pradesh",
    city: "Dharamsala",
  },
  // J&K
  {
    keywords: [
      "srinagar",
      "dal lake",
      "gulmarg",
      "pahalgam",
      "kashmir",
      "lal chowk",
    ],
    state: "Jammu & Kashmir",
    city: "Srinagar",
  },
  { keywords: ["jammu"], state: "Jammu & Kashmir", city: "Jammu" },
  // Ladakh
  {
    keywords: ["leh", "ladakh", "khardung", "pangong", "nubra"],
    state: "Ladakh",
    city: "Leh",
  },
  // Goa
  {
    keywords: ["goa", "panaji", "margao", "calangute", "baga", "dabolim"],
    state: "Goa",
    city: "Panaji",
  },
  { keywords: ["vasco"], state: "Goa", city: "Vasco da Gama" },
  // North East
  { keywords: ["aizawl", "mizoram"], state: "Mizoram", city: "Aizawl" },
  {
    keywords: ["imphal", "manipur", "loktak"],
    state: "Manipur",
    city: "Imphal",
  },
  {
    keywords: ["agartala", "tripura", "city center agartala"],
    state: "Tripura",
    city: "Agartala",
  },
  {
    keywords: ["kohima", "nagaland", "dimapur"],
    state: "Nagaland",
    city: "Kohima",
  },
  {
    keywords: ["gangtok", "sikkim", "nathu la", "tsomgo"],
    state: "Sikkim",
    city: "Gangtok",
  },
  {
    keywords: ["shillong", "meghalaya", "cherrapunji"],
    state: "Meghalaya",
    city: "Shillong",
  },
  {
    keywords: ["itanagar", "arunachal"],
    state: "Arunachal Pradesh",
    city: "Itanagar",
  },
];

export function extractDriverLocation(text: string): LocationInfo {
  const lower = text.toLowerCase();
  for (const entry of LOCATION_MAP) {
    if (entry.keywords.some((k) => lower.includes(k))) {
      return { state: entry.state, city: entry.city };
    }
  }
  return { state: "Other", city: "Other" };
}
