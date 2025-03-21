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
  'Ahmedabad': [
    // West Ahmedabad
    'Satellite', 'Bodakdev', 'Vastrapur', 'South Bopal', 'Bopal', 
    'Prahlad Nagar', 'Thaltej', 'Science City', 'Jodhpur', 'Ambli',
    'Sindhu Bhavan Road', 'Hebatpur', 'Shela', 'Ambawadi', 'Paldi',
    'SG Highway', 'Sola', 'Gota', 'South Bopal', 'Manipur',

    // Central Ahmedabad
    'Navrangpura', 'CG Road', 'Law Garden', 'Ellis Bridge', 'Ashram Road',
    'Lal Darwaja', 'Relief Road', 'Panchvati', 'Usmanpura', 'Stadium Road',
    'Income Tax', 'Shahibaug', 'Gujarat College', 'Parimal Garden', 'University Area',

    // North Ahmedabad
    'Motera', 'Chandkheda', 'Sabarmati', 'Gota', 'Nirnaynagar',
    'Ranip', 'New Ranip', 'Vadaj', 'Nava Vadaj', 'Dharamnagar',
    'New CG Road', 'Visat', 'Tragad', 'Chanakyapuri', 'Hanspura',

    // East Ahmedabad
    'Naroda', 'Nikol', 'Vastral', 'Ramol', 'Odhav',
    'Krishnanagar', 'Bapunagar', 'Rakhial', 'Gomtipur', 'Amraiwadi',
    'CTM', 'Vastral', 'Hathijan', 'Viratnagar', 'Hirawadi',

    // South Ahmedabad
    'Maninagar', 'Khokhra', 'Isanpur', 'Vatva', 'Ghodasar',
    'Vishala', 'Vejalpur', 'Juhapura', 'Sarkhej', 'Lambha',
    'Narol', 'Jasodanagar', 'Vatva GIDC', 'Hatkeshwar', 'Kankaria'
  ],

  'Gandhinagar': [
    'Sector 1', 'Sector 2', 'Sector 3', 'Sector 4', 'Sector 5',
    'Sector 6', 'Sector 7', 'Sector 8', 'Sector 9', 'Sector 10',
    'Sector 11', 'Sector 12', 'Sector 13', 'Sector 14', 'Sector 15',
    'Sector 16', 'Sector 17', 'Sector 19', 'Sector 20', 'Sector 21',
    'Sector 22', 'Sector 23', 'Sector 24', 'Sector 25', 'Sector 26',
    'Sector 27', 'Sector 28', 'Sector 29', 'Sector 30', 'GIFT City',
    'Infocity', 'Kudasan', 'Sargasan', 'Pethapur', 'Raysan',
    'Koba', 'Vavol', 'Uvarsad', 'Adalaj', 'Randesan'
  ],

  'Surat': [
    // Central Surat
    'Athwa', 'City Light', 'Piplod', 'Ghod Dod Road', 'Ring Road',
    'Adajan', 'Pal', 'Rander', 'Katargam', 'Varachha',
    'Majura Gate', 'Udhna', 'Sachin', 'Bhatar', 'Althan',

    // New Surat
    'Vesu', 'Dumas Road', 'Magdalla', 'Palanpur Patia', 'New City Light',
    'Jahangirpura', 'Bamroli', 'Dindoli', 'Magob', 'Kosad',

    // Industrial Areas
    'Hazira', 'Sachin GIDC', 'Pandesara', 'Udhna Udhyognagar', 'Katargam GIDC',
    'Amroli', 'Olpad', 'Bhestan', 'Kamrej', 'Limbayat'
  ],

  'Vadodara': [
    // Central Areas
    'Alkapuri', 'Race Course', 'Fatehgunj', 'Sayajigunj', 'Dandia Bazaar',
    'Raopura', 'Mandvi', 'Kevdabaug', 'Madhavpura', 'Panigate',

    // New Vadodara
    'Karelibaug', 'Akota', 'Gorwa', 'Subhanpura', 'Vasna',
    'Gotri', 'Manjalpur', 'Sama', 'Nizampura', 'Waghodia Road',

    // Outer Areas
    'Tandalja', 'Makarpura', 'Harni', 'Tarsali', 'Chhani',
    'Bill', 'Bhayli', 'Sevasi', 'Vadsar', 'Kalali'
  ],

  'Rajkot': [
    // Central Areas
    'Race Course Ring Road', 'Kalawad Road', 'University Road', 'Yagnik Road', 'Astron Chowk',
    'Sadhu Vaswani Road', 'Gondal Road', 'Mavdi', '150 Feet Ring Road', 'Jawahar Road',

    // Residential Areas
    'Amin Marg', 'Nana Mava', 'Raiya Road', 'Jamnagar Road', 'Morbi Road',
    'Kotecha Chowk', 'Raiya Circle', 'Gandhigram', 'Sorathiyawadi', 'Kuvadva Road',

    // New Development
    'Vidyanagar', 'Bhaktinagar', 'Rashulgadh', 'Vajdi', 'Pedak Road',
    'Akshar Marg', 'Indira Circle', 'Sadhu Vaswani Road', 'Neel City', 'Mota Mava'
  ],

  'Mumbai': [
    // South Mumbai
    'Colaba', 'Churchgate', 'Fort', 'Marine Drive', 'Nariman Point',
    'Cuffe Parade', 'Malabar Hill', 'Tardeo', 'Worli', 'Lower Parel',

    // Western Suburbs
    'Bandra West', 'Khar West', 'Santacruz West', 'Juhu', 'Andheri West',
    'Versova', 'Goregaon West', 'Malad West', 'Kandivali West', 'Borivali West',

    // Eastern Suburbs
    'Kurla', 'Ghatkopar', 'Vikhroli', 'Bhandup', 'Mulund',
    'Powai', 'Chembur', 'Wadala', 'Sion', 'Matunga',

    // Central Mumbai
    'Dadar', 'Mahim', 'Matunga', 'Parel', 'Lalbaug',
    'Byculla', 'Mumbai Central', 'Grant Road', 'Charni Road', 'Opera House'
  ],

  'Pune': [
    // Central Pune
    'Shivaji Nagar', 'Deccan Gymkhana', 'FC Road', 'JM Road', 'Camp',
    'Koregaon Park', 'Kalyani Nagar', 'Yerawada', 'Pune Station', 'Swargate',

    // West Pune
    'Aundh', 'Baner', 'Pashan', 'Bavdhan', 'Wakad',
    'Hinjewadi', 'Balewadi', 'Sus', 'Mahalunge', 'Pimple Saudagar',

    // East Pune
    'Viman Nagar', 'Kharadi', 'Wagholi', 'Hadapsar', 'Magarpatta',
    'Mundhwa', 'Chandannagar', 'Wadgaon Sheri', 'Dhanori', 'Vishrantwadi',

    // South Pune
    'Katraj', 'Kondhwa', 'NIBM', 'Undri', 'Mohammadwadi',
    'Bibwewadi', 'Sahakarnagar', 'Parvati', 'Dhankawadi', 'Market Yard'
  ],

  'Bangalore': [
    // Central Bangalore
    'MG Road', 'Brigade Road', 'Commercial Street', 'Residency Road', 'Richmond Road',
    'Lavelle Road', 'Church Street', 'Infantry Road', 'Vasanth Nagar', 'Shivaji Nagar',

    // East Bangalore
    'Whitefield', 'Marathahalli', 'Brookefield', 'KR Puram', 'Mahadevapura',
    'CV Raman Nagar', 'Old Airport Road', 'Indiranagar', 'HAL', 'Hoodi',

    // South Bangalore
    'Koramangala', 'HSR Layout', 'BTM Layout', 'JP Nagar', 'Jayanagar',
    'Bannerghatta Road', 'Electronic City', 'Sarjapur Road', 'Bommanahalli', 'Wilson Garden',

    // North Bangalore
    'Hebbal', 'Yelahanka', 'Devanahalli', 'Hennur', 'RT Nagar',
    'Sahakara Nagar', 'Thanisandra', 'Jakkur', 'Kogilu', 'Bellary Road'
  ],

  'Chennai': [
    // Central Chennai
    'T Nagar', 'Nungambakkam', 'Egmore', 'Mylapore', 'Alwarpet',
    'Royapettah', 'Teynampet', 'Anna Nagar', 'Kilpauk', 'Vadapalani',

    // South Chennai
    'Adyar', 'Velachery', 'Guindy', 'Madipakkam', 'Tambaram',
    'Pallavaram', 'Chromepet', 'Medavakkam', 'Sholinganallur', 'Perungudi',

    // North Chennai
    'Tondiarpet', 'Washermenpet', 'Royapuram', 'Perambur', 'Kolathur',
    'Madhavaram', 'Manali', 'Thiruvottiyur', 'Red Hills', 'Ponneri',

    // West Chennai
    'Porur', 'Ambattur', 'Poonamallee', 'Mogappair', 'Maduravoyal',
    'Valasaravakkam', 'Thirumangalam', 'Koyambedu', 'Virugambakkam', 'Alapakkam'
  ],

  'Hyderabad': [
    // Central Hyderabad
    'Banjara Hills', 'Jubilee Hills', 'Punjagutta', 'Ameerpet', 'Begumpet',
    'Somajiguda', 'Himayatnagar', 'Nampally', 'Abids', 'Koti',

    // IT Corridor
    'HITEC City', 'Madhapur', 'Gachibowli', 'Kondapur', 'Nanakramguda',
    'Financial District', 'Raidurg', 'Manikonda', 'Khajaguda', 'Narsingi',

    // New Development
    'Kukatpally', 'Miyapur', 'Chandanagar', 'Nallagandla', 'Tellapur',
    'Nizampet', 'Bachupally', 'Kompally', 'Medchal', 'Alwal',

    // East Hyderabad
    'Secunderabad', 'Uppal', 'LB Nagar', 'Dilsukhnagar', 'Nacharam',
    'Malakpet', 'Tarnaka', 'Malkajgiri', 'AS Rao Nagar', 'Habsiguda'
  ]
};