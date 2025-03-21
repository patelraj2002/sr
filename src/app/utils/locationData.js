// src/app/utils/locationData.js
export const CITIES_BY_STATE = {
    'Gujarat': [
    'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar', 
    'Bhavnagar', 'Jamnagar', 'Junagadh', 'Anand', 'Nadiad', 
    'Mehsana', 'Morbi', 'Bhuj', 'Vapi', 'Navsari', 
    'Veraval', 'Porbandar', 'Godhra', 'Palanpur', 'Bharuch'
  ],
  'Maharashtra': [
    'Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 
    'Aurangabad', 'Navi Mumbai', 'Solapur', 'Kolhapur', 'Amravati', 
    'Sangli', 'Jalgaon', 'Akola', 'Latur', 'Dhule', 
    'Ahmednagar', 'Chandrapur', 'Parbhani', 'Ichalkaranji', 'Jalna'
  ],
  'Karnataka': [
    'Bangalore', 'Mysore', 'Hubli-Dharwad', 'Mangalore', 'Belgaum', 
    'Gulbarga', 'Davanagere', 'Bellary', 'Bijapur', 'Shimoga', 
    'Tumkur', 'Raichur', 'Bidar', 'Hospet', 'Hassan', 
    'Robertson Pet', 'Gadag-Betigeri', 'Udupi', 'Madikeri', 'Chitradurga'
  ],
  'Tamil Nadu': [
    'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 
    'Tirunelveli', 'Tiruppur', 'Vellore', 'Erode', 'Thoothukkudi', 
    'Dindigul', 'Thanjavur', 'Ranipet', 'Sivakasi', 'Karur', 
    'Udhagamandalam', 'Hosur', 'Nagercoil', 'Kanchipuram', 'Kumarapalayam'
  ],
  'Delhi NCR': [
    'New Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi',
    'Gurgaon', 'Noida', 'Faridabad', 'Ghaziabad', 'Greater Noida',
    'Manesar', 'Sonipat', 'Rohini', 'Dwarka', 'Bahadurgarh'
  ],
  'Uttar Pradesh': [
    'Lucknow', 'Kanpur', 'Ghaziabad', 'Agra', 'Meerut', 
    'Varanasi', 'Prayagraj', 'Bareilly', 'Aligarh', 'Moradabad', 
    'Saharanpur', 'Gorakhpur', 'Noida', 'Firozabad', 'Jhansi',
    'Muzaffarnagar', 'Mathura', 'Rampur', 'Shahjahanpur', 'Maunath Bhanjan'
  ],
  'Rajasthan': [
    'Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner', 
    'Ajmer', 'Bhilwara', 'Alwar', 'Sikar', 'Sri Ganganagar', 
    'Pali', 'Bharatpur', 'Chittorgarh', 'Mount Abu', 'Pushkar',
    'Kishangarh', 'Beawar', 'Hanumangarh', 'Dhaulpur', 'Gangapur City'
  ],
  'Madhya Pradesh': [
    'Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain', 
    'Sagar', 'Dewas', 'Satna', 'Ratlam', 'Rewa', 
    'Murwara', 'Singrauli', 'Burhanpur', 'Khandwa', 'Bhind',
    'Chhindwara', 'Guna', 'Shivpuri', 'Vidisha', 'Chhatarpur'
  ],
  'West Bengal': [
    'Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 
    'Darjeeling', 'Malda', 'Kharagpur', 'Haldia', 'Shantiniketan',
    'Bardhaman', 'Krishnanagar', 'Baharampur', 'Jalpaiguri', 'Raiganj',
    'Alipurduar', 'Purulia', 'Bankura', 'Cooch Behar', 'Kalimpong'
  ],
  'Telangana': [
    'Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam', 
    'Ramagundam', 'Secunderabad', 'Mahbubnagar', 'Nalgonda', 'Adilabad', 
    'Suryapet', 'Miryalaguda', 'Siddipet', 'Jahirabad', 'Sangareddy'
  ],
  'Kerala': [
    'Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam', 
    'Alappuzha', 'Kannur', 'Kottayam', 'Palakkad', 'Malappuram',
    'Munnar', 'Wayanad', 'Kasaragod', 'Pattanamtitta', 'Idukki'
  ],
  'Punjab': [
    'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 
    'Mohali', 'Pathankot', 'Hoshiarpur', 'Batala', 'Moga',
    'Malerkotla', 'Khanna', 'Phagwara', 'Muktsar', 'Barnala'
  ],
  'Haryana': [
    'Faridabad', 'Gurgaon', 'Panipat', 'Ambala', 'Yamunanagar', 
    'Rohtak', 'Hisar', 'Karnal', 'Sonipat', 'Panchkula',
    'Bhiwani', 'Sirsa', 'Bahadurgarh', 'Jind', 'Thanesar'
  ],
  'Bihar': [
    'Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia', 
    'Darbhanga', 'Bihar Sharif', 'Arrah', 'Begusarai', 'Katihar',
    'Munger', 'Chhapra', 'Danapur', 'Saharsa', 'Sasaram'
  ],
  'Odisha': [
    'Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur', 
    'Puri', 'Balasore', 'Bhadrak', 'Baripada', 'Jharsuguda',
    'Konark', 'Paradip', 'Gopalpur', 'Angul', 'Barbil'
  ]
};
  
  export const AREAS_BY_CITY = {
    ' ': [
    // West Ahmedabad
    'Satellite', 'Bodakdev', 'Vastrapur', 'South Bopal', 'Bopal', 
    'Prahlad Nagar', 'Thaltej', 'Science City', 'Jodhpur', 'Ambli',
    'Sindhu Bhavan Road', 'Hebatpur', 'Shela', 'Ambawadi', 'Paldi',

    // Central Ahmedabad
    'Navrangpura', 'CG Road', 'Law Garden', 'Ellis Bridge', 'Ashram Road',
    'Lal Darwaja', 'Relief Road', 'Panchvati', 'Usmanpura', 'Stadium Road',
    
    // North Ahmedabad
    'Motera', 'Chandkheda', 'Sabarmati', 'Gota', 'Nirnaynagar',
    'Ranip', 'New Ranip', 'Vadaj', 'Nava Vadaj', 'Dharamnagar',
    
    // East Ahmedabad
    'Naroda', 'Nikol', 'Vastral', 'Ramol', 'Odhav',
    'Krishnanagar', 'Bapunagar', 'Rakhial', 'Gomtipur', 'Amraiwadi',
    
    // South Ahmedabad
    'Maninagar', 'Khokhra', 'Isanpur', 'Vatva', 'Ghodasar',
    'Vishala', 'Vejalpur', 'Juhapura', 'Sarkhej', 'Lambha'
  ],

  'Mumbai': [
    // Western Suburbs
    'Andheri East', 'Andheri West', 'Bandra East', 'Bandra West', 'Borivali East',
    'Borivali West', 'Goregaon East', 'Goregaon West', 'Jogeshwari East', 'Jogeshwari West',
    'Kandivali East', 'Kandivali West', 'Malad East', 'Malad West', 'Santacruz East',
    'Santacruz West', 'Vile Parle East', 'Vile Parle West', 'Powai', 'Khar West',
    'Khar East', 'Juhu', 'Versova', 'Lokhandwala', 'Oshiwara',
    
    // Central Mumbai
    'Dadar East', 'Dadar West', 'Mahim', 'Matunga East', 'Matunga West',
    'Parel', 'Lower Parel', 'Worli', 'Prabhadevi', 'Byculla',
    'Sion', 'Wadala', 'Kings Circle', 'Hindamata', 'Curry Road',
    
    // South Mumbai
    'Colaba', 'Churchgate', 'Fort', 'Marine Lines', 'Marine Drive',
    'Nariman Point', 'Breach Candy', 'Malabar Hill', 'Peddar Road', 'Tardeo',
    'Mumbai Central', 'Grant Road', 'Opera House', 'Girgaon', 'Kalbadevi',
    
    // Eastern Suburbs
    'Chembur', 'Ghatkopar East', 'Ghatkopar West', 'Kurla East', 'Kurla West',
    'Mulund East', 'Mulund West', 'Vikhroli East', 'Vikhroli West', 'Bhandup',
    'Kanjurmarg', 'Nahur', 'Vidyavihar', 'Govandi', 'Mankhurd'
  ],

  'Bangalore': [
    // Central Bangalore
    'MG Road', 'Brigade Road', 'Commercial Street', 'Lavelle Road', 'Richmond Road',
    'Residency Road', 'Cunningham Road', 'Infantry Road', 'Church Street', 'St. Marks Road',
    'Vittal Mallya Road', 'Kasturba Road', 'Race Course Road', 'Shivajinagar', 'Richmond Town',
    
    // East Bangalore
    'Whitefield', 'ITPL', 'Marathahalli', 'Brookefield', 'Kadugodi',
    'Varthur', 'Doddanekundi', 'CV Raman Nagar', 'Old Airport Road', 'Indiranagar',
    'HAL Airport Road', 'Mahadevapura', 'KR Puram', 'Hoodi', 'Channasandra',
    
    // South Bangalore
    'Koramangala', 'HSR Layout', 'BTM Layout', 'JP Nagar', 'Jayanagar',
    'Bannerghatta Road', 'Electronic City', 'Silk Board', 'Bommanahalli', 'Begur',
    'Hulimavu', 'Kumaraswamy Layout', 'Banashankari', 'Basavanagudi', 'Wilson Garden',
    
    // North Bangalore
    'Hebbal', 'Yelahanka', 'Jakkur', 'Hennur', 'Thanisandra',
    'Sahakara Nagar', 'RT Nagar', 'Kalyan Nagar', 'HBR Layout', 'Nagawara',
    'Dollars Colony', 'RMV Extension', 'Bellary Road', 'Kogilu', 'Vidyaranyapura',
    
    // West Bangalore
    'Malleshwaram', 'Rajajinagar', 'Vijayanagar', 'Basaveshwara Nagar', 'Mahalakshmi Layout',
    'Yeswanthpur', 'Peenya', 'Nagarbhavi', 'Kengeri', 'RR Nagar',
    'Uttarahalli', 'Banashankari Stage II', 'Srinagar', 'Padmanabhanagar', 'Chandra Layout'
  ],

  'Hyderabad': [
    // Hi-Tech Zone
    'HITEC City', 'Madhapur', 'Gachibowli', 'Nanakramguda', 'Financial District',
    'Kondapur', 'Kothaguda', 'Manikonda', 'Raidurg', 'Kukatpally',
    'Nizampet', 'Bachupally', 'Miyapur', 'Hafeezpet', 'Chandanagar',
    
    // Central Hyderabad
    'Banjara Hills', 'Jubilee Hills', 'Somajiguda', 'Ameerpet', 'Punjagutta',
    'Khairatabad', 'Lakdikapul', 'Mehdipatnam', 'Masab Tank', 'Asifnagar',
    'Nampally', 'Abids', 'Koti', 'Himayatnagar', 'Basheerbagh',
    
    // Secunderabad
    'Secunderabad', 'Paradise', 'Begumpet', 'Bowenpally', 'Trimulgherry',
    'Maredpally', 'Tarnaka', 'Nacharam', 'Moula Ali', 'Neredmet',
    'AS Rao Nagar', 'Sainikpuri', 'Defence Colony', 'Alwal', 'Bolarum',
    
    // East Hyderabad
    'Uppal', 'LB Nagar', 'Dilsukhnagar', 'Vanasthalipuram', 'Hayathnagar',
    'Nagole', 'Boduppal', 'Peerzadiguda', 'Ramanthapur', 'Habsiguda',
    'Nacharam', 'Mallapur', 'Cherlapally', 'Dammaiguda', 'Kushaiguda',
    
    // North Hyderabad
    'Kompally', 'Jeedimetla', 'Balanagar', 'Medchal', 'Alwal',
    'Quthbullapur', 'Shamirpet', 'Gundlapochampally', 'Kapra', 'ECIL'
  ],

  'Chennai': [
    // Central Chennai
    'T Nagar', 'Nungambakkam', 'Egmore', 'Mylapore', 'Royapettah',
    'Alwarpet', 'Teynampet', 'Kilpauk', 'Purasawalkam', 'Choolai',
    'Triplicane', 'Chepauk', 'Mount Road', 'Thousand Lights', 'Gopalapuram',
    
    // North Chennai
    'Anna Nagar', 'Anna Nagar West', 'Ayanavaram', 'Kolathur', 'Perambur',
    'Tondiarpet', 'Washermanpet', 'Madhavaram', 'Red Hills', 'Tiruvottiyur',
    'Manali', 'Ennore', 'Kodungaiyur', 'Royapuram', 'Vyasarpadi',
    
    // South Chennai
    'Adyar', 'Velachery', 'Guindy', 'Madipakkam', 'Pallikaranai',
    'Nanganallur', 'Thoraipakkam', 'Tambaram', 'Chromepet', 'Pallavaram',
    'Keelkattalai', 'Medavakkam', 'Sholinganallur', 'Navalur', 'Siruseri',
    
    // West Chennai
    'Porur', 'Vadapalani', 'KK Nagar', 'Virugambakkam', 'Saligramam',
    'Valasaravakkam', 'Alwarthirunagar', 'Poonamallee', 'Iyyappanthangal', 'Alapakkam',
    'Mugalivakkam', 'Maduravoyal', 'Koyambedu', 'Aminjikarai', 'Arumbakkam',
    
    // IT Corridor (OMR)
    'OMR Road', 'Perungudi', 'Taramani', 'Karapakkam', 'Padur',
    'Kelambakkam', 'Egattur', 'Siruseri IT Park', 'Navallur', 'Thalambur'
  ],
  'Delhi NCR': {
  'Central Delhi': [
    'Connaught Place', 'Karol Bagh', 'Paharganj', 'Rajendra Place',
    'Patel Nagar', 'Rajiv Chowk', 'ITO', 'Delhi Gate', 'Darya Ganj',
    'Chandni Chowk', 'Civil Lines', 'Kashmere Gate'
  ],
  'South Delhi': [
    'Defence Colony', 'Lajpat Nagar', 'Greater Kailash', 'Saket',
    'Hauz Khas', 'Green Park', 'South Extension', 'Malviya Nagar',
    'Mehrauli', 'Chhatarpur', 'Vasant Kunj', 'Vasant Vihar',
    'R K Puram', 'Safdarjung', 'Nehru Place'
  ],
  'East Delhi': [
    'Laxmi Nagar', 'Preet Vihar', 'Anand Vihar', 'Shahdara',
    'Mayur Vihar', 'Patparganj', 'Vaishali', 'Indirapuram',
    'Krishna Nagar', 'Dilshad Garden', 'Vivek Vihar'
  ],
  'West Delhi': [
    'Rajouri Garden', 'Janakpuri', 'Paschim Vihar', 'Punjabi Bagh',
    'Kirti Nagar', 'Moti Nagar', 'Dwarka', 'Uttam Nagar',
    'Vikaspuri', 'Tilak Nagar'
  ],
  'North Delhi': [
    'Model Town', 'Ashok Vihar', 'Pitampura', 'Rohini',
    'Shalimar Bagh', 'Azadpur', 'Adarsh Nagar', 'GTB Nagar',
    'Mukherji Nagar', 'Shakti Nagar'
  ],
  'Gurgaon': [
    'DLF Phase 1', 'DLF Phase 2', 'DLF Phase 3', 'DLF Phase 4',
    'Sushant Lok', 'Golf Course Road', 'MG Road', 'Cyber City',
    'Sohna Road', 'Sector 14', 'Sector 15', 'Sector 56',
    'Golf Course Extension Road', 'Udyog Vihar'
  ],
  'Noida': [
    'Sector 15', 'Sector 16', 'Sector 18', 'Sector 62',
    'Sector 63', 'Sector 125', 'Sector 127', 'Sector 132',
    'Sector 135', 'Sector 142', 'Sector 144', 'Sector 168'
  ]
},

'Pune': {
  'Central Pune': [
    'Shivaji Nagar', 'Deccan Gymkhana', 'FC Road', 'JM Road',
    'Camp', 'Koregaon Park', 'Kalyani Nagar', 'Yerawada'
  ],
  'West Pune': [
    'Aundh', 'Baner', 'Pashan', 'Bavdhan', 'Wakad',
    'Hinjewadi', 'Balewadi', 'Sus', 'Mahalunge'
  ],
  'East Pune': [
    'Viman Nagar', 'Kharadi', 'Wagholi', 'Hadapsar',
    'Magarpatta', 'Mundhwa', 'Chandannagar'
  ],
  'South Pune': [
    'Katraj', 'Kondhwa', 'NIBM', 'Undri', 'Mohammadwadi',
    'Bibwewadi', 'Sahakarnagar', 'Parvati'
  ],
  'North Pune': [
    'Dhanori', 'Vishrantwadi', 'Lohegaon', 'Tingre Nagar',
    'Chandan Nagar', 'Moshi', 'Bhosari'
  ]
},

'Kolkata': {
  'North Kolkata': [
    'Shyambazar', 'Bagbazar', 'Sovabazar', 'Ultadanga',
    'Maniktala', 'Dumdum', 'Lake Town', 'Belgachia'
  ],
  'South Kolkata': [
    'Ballygunge', 'Alipore', 'Bhowanipore', 'Tollygunge',
    'Jadavpur', 'Jodhpur Park', 'Gariahat', 'Dhakuria'
  ],
  'Central Kolkata': [
    'Park Street', 'Esplanade', 'Entally', 'Sealdah',
    'Chandni Chowk', 'Burrabazar', 'Bowbazar'
  ],
  'East Kolkata': [
    'Salt Lake', 'New Town', 'Rajarhat', 'EM Bypass',
    'Kasba', 'Anandapur', 'Ruby'
  ],
  'West Kolkata': [
    'Behala', 'Joka', 'Thakurpukur', 'Barisha',
    'Khidirpur', 'Watgunge', 'Maheshtala'
  ]
},

'Jaipur': {
  'Central Jaipur': [
    'MI Road', 'Tonk Road', 'C-Scheme', 'Civil Lines',
    'Bani Park', 'Adarsh Nagar', 'Tilak Nagar'
  ],
  'West Jaipur': [
    'Vaishali Nagar', 'Mansarovar', 'Pratap Nagar',
    'Gopalpura', 'Malviya Nagar', 'Jagatpura'
  ],
  'East Jaipur': [
    'Raja Park', 'Bapu Nagar', 'Jawahar Nagar',
    'Malviya Nagar', 'Durgapura', 'Sanganer'
  ],
  'South Jaipur': [
    'Mahesh Nagar', 'Jawahar Circle', 'Sitapura',
    'Muhana', 'Sanganer', 'Pratap Nagar'
  ],
  'North Jaipur': [
    'Amer Road', 'Jhotwara', 'Vidhyadhar Nagar',
    'Sikar Road', 'Murlipura', 'Chitrakoot'
  ]
}
};