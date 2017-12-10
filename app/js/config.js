var config = {
    image: {
    	waitForAdd: "/img/wait_add.gif",
    	waitForDelete: "/img/wait_delete.gif"
    },
    env: {
      // backend: 'http://13.82.187.88:3040',
      // frontend: 'http://13.82.187.88'
      // backend: 'http://localhost:3040',
      // frontend: 'http://localhost:4000'
	backend: 'http://13.82.190.44:3040',
	frontend: 'http://13.82.190.44:4000'
//       backend: 'http://192.168.1.120:3040',
   //   frontend: 'http://localhost:4000'
    },
    social: {
      box: {
        client_id: 'vkf7vdl1p0156bdr8qskkag869exln71'
      },
      googleDrive: {
        api_key: 'AIzaSyAqBcpJG3DFVEfgHGdSHlCj_zW-GbMTByk',
        client_id: '944689281546-s3o8lk1e093a3mjetpfgj9hic7r5saae.apps.googleusercontent.com'
      },
      facebook: {
        app_id: '1696648550655713' //'403619293415609' //'1696648550655713'
      },
      dropbox: {
        app_key: 'ufxxb4dodhctwdr'
      },
      pinterest: {
        app_id: '4859150297689244984'
      }
    }
};

var timezone_from_google_calendar = {
  "Andorra": {
    "Europe/Andorra": "(GMT+02:00) Andorra"
  },
  "United Arab Emirates (‫الإمارات العربية المتحدة‬‎)": {
    "Asia/Dubai": "(GMT+04:00) Dubai"
  },
  "Afghanistan (‫افغانستان‬‎)": {
    "Asia/Kabul": "(GMT+04:30) Kabul"
  },
  "Antigua & Barbuda": {
    "America/Port_of_Spain": "(GMT-04:00) Port of Spain"
  },
  "Anguilla": {
    "America/Port_of_Spain": "(GMT-04:00) Port of Spain"
  },
  "Albania (Shqipëri)": {
    "Europe/Tirane": "(GMT+02:00) Tirane"
  },
  "Armenia (Հայաստան)": {
    "Asia/Yerevan": "(GMT+04:00) Yerevan"
  },
  "Angola": {
    "Africa/Lagos": "(GMT+01:00) Lagos"
  },
  "Antarctica": {
    "Antarctica/Palmer": "(GMT-03:00) Palmer",
    "Antarctica/Rothera": "(GMT-03:00) Rothera",
    "Antarctica/Syowa": "(GMT+03:00) Syowa",
    "Antarctica/Mawson": "(GMT+05:00) Mawson",
    "Antarctica/Vostok": "(GMT+06:00) Vostok",
    "Antarctica/Davis": "(GMT+07:00) Davis",
    "Antarctica/Casey": "(GMT+08:00) Casey",
    "Antarctica/DumontDUrville": "(GMT+10:00) Dumont D'Urville",
    "Pacific/Auckland": "(GMT+12:00) Auckland"
  },
  "Argentina": {
    "America/Argentina/Buenos_Aires": "(GMT-03:00) Buenos Aires"
  },
  "American Samoa": {
    "Pacific/Pago_Pago": "(GMT-11:00) Pago Pago"
  },
  "Austria (Österreich)": {
    "Europe/Vienna": "(GMT+02:00) Vienna"
  },
  "Australia": {
    "Australia/Perth": "(GMT+08:00) Western Time - Perth",
    "Australia/Adelaide": "(GMT+09:30) Central Time - Adelaide",
    "Australia/Darwin": "(GMT+09:30) Central Time - Darwin",
    "Australia/Brisbane": "(GMT+10:00) Eastern Time - Brisbane",
    "Australia/Hobart": "(GMT+10:00) Eastern Time - Hobart",
    "Australia/Sydney": "(GMT+10:00) Eastern Time - Melbourne, Sydney"
  },
  "Aruba": {
    "America/Curacao": "(GMT-04:00) Curacao"
  },
  "Åland Islands (Åland)": {
    "Europe/Helsinki": "(GMT+03:00) Helsinki"
  },
  "Azerbaijan (Azərbaycan)": {
    "Asia/Baku": "(GMT+04:00) Baku"
  },
  "Bosnia & Herzegovina (Босна и Херцеговина)": {
    "Europe/Belgrade": "(GMT+02:00) Central European Time - Belgrade"
  },
  "Barbados": {
    "America/Barbados": "(GMT-04:00) Barbados"
  },
  "Bangladesh (বাংলাদেশ)": {
    "Asia/Dhaka": "(GMT+06:00) Dhaka"
  },
  "Belgium": {
    "Europe/Brussels": "(GMT+02:00) Brussels"
  },
  "Burkina Faso": {
    "Africa/Abidjan": "(GMT+00:00) Abidjan"
  },
  "Bulgaria (България)": {
    "Europe/Sofia": "(GMT+03:00) Sofia"
  },
  "Bahrain (‫البحرين‬‎)": {
    "Asia/Qatar": "(GMT+03:00) Qatar"
  },
  "Burundi (Uburundi)": {
    "Africa/Maputo": "(GMT+02:00) Maputo"
  },
  "Benin (Bénin)": {
    "Africa/Lagos": "(GMT+01:00) Lagos"
  },
  "Bermuda": {
    "Atlantic/Bermuda": "(GMT-03:00) Bermuda"
  },
  "Brunei": {
    "Asia/Brunei": "(GMT+08:00) Brunei"
  },
  "Bolivia": {
    "America/La_Paz": "(GMT-04:00) La Paz"
  },
  "Caribbean Netherlands": {
    "America/Curacao": "(GMT-04:00) Curacao"
  },
  "Brazil (Brasil)": {
    "America/Rio_Branco": "(GMT-05:00) Rio Branco",
    "America/Boa_Vista": "(GMT-04:00) Boa Vista",
    "America/Campo_Grande": "(GMT-04:00) Campo Grande",
    "America/Cuiaba": "(GMT-04:00) Cuiaba",
    "America/Manaus": "(GMT-04:00) Manaus",
    "America/Porto_Velho": "(GMT-04:00) Porto Velho",
    "America/Araguaina": "(GMT-03:00) Araguaina",
    "America/Bahia": "(GMT-03:00) Salvador",
    "America/Belem": "(GMT-03:00) Belem",
    "America/Fortaleza": "(GMT-03:00) Fortaleza",
    "America/Maceio": "(GMT-03:00) Maceio",
    "America/Recife": "(GMT-03:00) Recife",
    "America/Sao_Paulo": "(GMT-03:00) Sao Paulo",
    "America/Noronha": "(GMT-02:00) Noronha"
  },
  "Bahamas": {
    "America/Nassau": "(GMT-04:00) Nassau"
  },
  "Bhutan (འབྲུག)": {
    "Asia/Thimphu": "(GMT+06:00) Thimphu"
  },
  "Bouvet Island": {
    "Africa/Abidjan": "(GMT+00:00) Abidjan"
  },
  "Botswana": {
    "Africa/Maputo": "(GMT+02:00) Maputo"
  },
  "Belarus (Беларусь)": {
    "Europe/Minsk": "(GMT+03:00) Minsk"
  },
  "Belize": {
    "America/Belize": "(GMT-06:00) Belize"
  },
  "Canada": {
    "America/Vancouver": "(GMT-07:00) Pacific Time - Vancouver",
    "America/Whitehorse": "(GMT-07:00) Pacific Time - Whitehorse",
    "America/Dawson_Creek": "(GMT-07:00) Mountain Time - Dawson Creek",
    "America/Edmonton": "(GMT-06:00) Mountain Time - Edmonton",
    "America/Yellowknife": "(GMT-06:00) Mountain Time - Yellowknife",
    "America/Regina": "(GMT-06:00) Central Time - Regina",
    "America/Winnipeg": "(GMT-05:00) Central Time - Winnipeg",
    "America/Iqaluit": "(GMT-04:00) Eastern Time - Iqaluit",
    "America/Toronto": "(GMT-04:00) Eastern Time - Toronto",
    "America/Halifax": "(GMT-03:00) Atlantic Time - Halifax",
    "America/St_Johns": "(GMT-02:30) Newfoundland Time - St. Johns"
  },
  "Cocos (Keeling) Islands (Kepulauan Cocos (Keeling))": {
    "Indian/Cocos": "(GMT+06:30) Cocos"
  },
  "Congo (DRC) (Jamhuri ya Kidemokrasia ya Kongo)": {
    "Africa/Lagos": "(GMT+01:00) Lagos",
    "Africa/Maputo": "(GMT+02:00) Maputo"
  },
  "Central African Republic (République centrafricaine)": {
    "Africa/Lagos": "(GMT+01:00) Lagos"
  },
  "Congo (Republic) (Congo-Brazzaville)": {
    "Africa/Lagos": "(GMT+01:00) Lagos"
  },
  "Switzerland (Schweiz)": {
    "Europe/Zurich": "(GMT+02:00) Zurich"
  },
  "Côte d’Ivoire": {
    "Africa/Abidjan": "(GMT+00:00) Abidjan"
  },
  "Cook Islands": {
    "Pacific/Rarotonga": "(GMT-10:00) Rarotonga"
  },
  "Chile": {
    "Pacific/Easter": "(GMT-05:00) Easter Island",
    "America/Santiago": "(GMT-03:00) Santiago"
  },
  "Cameroon (Cameroun)": {
    "Africa/Lagos": "(GMT+01:00) Lagos"
  },
  "China (中国)": {
    "Asia/Shanghai": "(GMT+08:00) China Time - Beijing"
  },
  "Colombia": {
    "America/Bogota": "(GMT-05:00) Bogota"
  },
  "Costa Rica": {
    "America/Costa_Rica": "(GMT-06:00) Costa Rica"
  },
  "Cuba": {
    "America/Havana": "(GMT-04:00) Havana"
  },
  "Cape Verde (Kabu Verdi)": {
    "Atlantic/Cape_Verde": "(GMT-01:00) Cape Verde"
  },
  "Curaçao": {
    "America/Curacao": "(GMT-04:00) Curacao"
  },
  "Christmas Island": {
    "Indian/Christmas": "(GMT+07:00) Christmas"
  },
  "Cyprus (Κύπρος)": {
    "Asia/Nicosia": "(GMT+03:00) Nicosia"
  },
  "Czech Republic (Česká republika)": {
    "Europe/Prague": "(GMT+02:00) Central European Time - Prague"
  },
  "Germany (Deutschland)": {
    "Europe/Berlin": "(GMT+02:00) Berlin"
  },
  "Djibouti": {
    "Africa/Nairobi": "(GMT+03:00) Nairobi"
  },
  "Denmark (Danmark)": {
    "Europe/Copenhagen": "(GMT+02:00) Copenhagen"
  },
  "Dominica": {
    "America/Port_of_Spain": "(GMT-04:00) Port of Spain"
  },
  "Dominican Republic (República Dominicana)": {
    "America/Santo_Domingo": "(GMT-04:00) Santo Domingo"
  },
  "Algeria": {
    "Africa/Algiers": "(GMT+01:00) Algiers"
  },
  "Ecuador": {
    "Pacific/Galapagos": "(GMT-06:00) Galapagos",
    "America/Guayaquil": "(GMT-05:00) Guayaquil"
  },
  "Estonia (Eesti)": {
    "Europe/Tallinn": "(GMT+03:00) Tallinn"
  },
  "Egypt (‫مصر‬‎)": {
    "Africa/Cairo": "(GMT+02:00) Cairo"
  },
  "Western Sahara (‫الصحراء الغربية‬‎)": {
    "Africa/El_Aaiun": "(GMT+01:00) El Aaiun"
  },
  "Eritrea": {
    "Africa/Nairobi": "(GMT+03:00) Nairobi"
  },
  "Spain (España)": {
    "Atlantic/Canary": "(GMT+01:00) Canary Islands",
    "Africa/Ceuta": "(GMT+02:00) Ceuta",
    "Europe/Madrid": "(GMT+02:00) Madrid"
  },
  "Ethiopia": {
    "Africa/Nairobi": "(GMT+03:00) Nairobi"
  },
  "Finland (Suomi)": {
    "Europe/Helsinki": "(GMT+03:00) Helsinki"
  },
  "Fiji": {
    "Pacific/Fiji": "(GMT+12:00) Fiji"
  },
  "Falkland Islands (Islas Malvinas)": {
    "Atlantic/Stanley": "(GMT-03:00) Stanley"
  },
  "Micronesia": {
    "Pacific/Chuuk": "(GMT+10:00) Truk",
    "Pacific/Kosrae": "(GMT+11:00) Kosrae",
    "Pacific/Pohnpei": "(GMT+11:00) Ponape"
  },
  "Faroe Islands (Føroyar)": {
    "Atlantic/Faroe": "(GMT+01:00) Faeroe"
  },
  "France": {
    "Europe/Paris": "(GMT+02:00) Paris"
  },
  "Gabon": {
    "Africa/Lagos": "(GMT+01:00) Lagos"
  },
  "United Kingdom": {
    "Europe/London": "(GMT+01:00) London"
  },
  "Grenada": {
    "America/Port_of_Spain": "(GMT-04:00) Port of Spain"
  },
  "Georgia (საქართველო)": {
    "Asia/Tbilisi": "(GMT+04:00) Tbilisi"
  },
  "French Guiana (Guyane française)": {
    "America/Cayenne": "(GMT-03:00) Cayenne"
  },
  "Guernsey": {
    "Europe/London": "(GMT+01:00) London"
  },
  "Ghana (Gaana)": {
    "Africa/Accra": "(GMT+00:00) Accra"
  },
  "Gibraltar": {
    "Europe/Gibraltar": "(GMT+02:00) Gibraltar"
  },
  "Greenland (Kalaallit Nunaat)": {
    "America/Thule": "(GMT-03:00) Thule",
    "America/Godthab": "(GMT-02:00) Godthab",
    "America/Scoresbysund": "(GMT+00:00) Scoresbysund",
    "America/Danmarkshavn": "(GMT+00:00) Danmarkshavn"
  },
  "Gambia": {
    "Africa/Abidjan": "(GMT+00:00) Abidjan"
  },
  "Guinea (Guinée)": {
    "Africa/Abidjan": "(GMT+00:00) Abidjan"
  },
  "Guadeloupe": {
    "America/Port_of_Spain": "(GMT-04:00) Port of Spain"
  },
  "Equatorial Guinea (Guinea Ecuatorial)": {
    "Africa/Lagos": "(GMT+01:00) Lagos"
  },
  "Greece (Ελλάδα)": {
    "Europe/Athens": "(GMT+03:00) Athens"
  },
  "South Georgia & South Sandwich Islands": {
    "Atlantic/South_Georgia": "(GMT-02:00) South Georgia"
  },
  "Guatemala": {
    "America/Guatemala": "(GMT-06:00) Guatemala"
  },
  "Guam": {
    "Pacific/Guam": "(GMT+10:00) Guam"
  },
  "Guinea-Bissau (Guiné-Bissau)": {
    "Africa/Bissau": "(GMT+00:00) Bissau"
  },
  "Guyana": {
    "America/Guyana": "(GMT-04:00) Guyana"
  },
  "Hong Kong (香港)": {
    "Asia/Hong_Kong": "(GMT+08:00) Hong Kong"
  },
  "Heard & McDonald Islands": {
    "Indian/Kerguelen": "(GMT+05:00) Kerguelen"
  },
  "Honduras": {
    "America/Tegucigalpa": "(GMT-06:00) Central Time - Tegucigalpa"
  },
  "Croatia (Hrvatska)": {
    "Europe/Belgrade": "(GMT+02:00) Central European Time - Belgrade"
  },
  "Haiti": {
    "America/Port-au-Prince": "(GMT-05:00) Port-au-Prince"
  },
  "Hungary (Magyarország)": {
    "Europe/Budapest": "(GMT+02:00) Budapest"
  },
  "Indonesia": {
    "Asia/Jakarta": "(GMT+07:00) Jakarta",
    "Asia/Makassar": "(GMT+08:00) Makassar",
    "Asia/Jayapura": "(GMT+09:00) Jayapura"
  },
  "Ireland": {
    "Europe/Dublin": "(GMT+01:00) Dublin"
  },
  "Israel (‫ישראל‬‎)": {
    "Asia/Jerusalem": "(GMT+03:00) Jerusalem"
  },
  "Isle of Man": {
    "Europe/London": "(GMT+01:00) London"
  },
  "India (भारत)": {
    "Asia/Calcutta": "(GMT+05:30) India Standard Time"
  },
  "British Indian Ocean Territory": {
    "Indian/Chagos": "(GMT+06:00) Chagos"
  },
  "Iraq (‫العراق‬‎)": {
    "Asia/Baghdad": "(GMT+03:00) Baghdad"
  },
  "Iran (‫ایران‬‎)": {
    "Asia/Tehran": "(GMT+04:30) Tehran"
  },
  "Iceland (Ísland)": {
    "Atlantic/Reykjavik": "(GMT+00:00) Reykjavik"
  },
  "Italy (Italia)": {
    "Europe/Rome": "(GMT+02:00) Rome"
  },
  "Jersey": {
    "Europe/London": "(GMT+01:00) London"
  },
  "Jamaica": {
    "America/Jamaica": "(GMT-05:00) Jamaica"
  },
  "Jordan (‫الأردن‬‎)": {
    "Asia/Amman": "(GMT+03:00) Amman"
  },
  "Japan (日本)": {
    "Asia/Tokyo": "(GMT+09:00) Tokyo"
  },
  "Kenya": {
    "Africa/Nairobi": "(GMT+03:00) Nairobi"
  },
  "Kyrgyzstan (Кыргызстан)": {
    "Asia/Bishkek": "(GMT+06:00) Bishkek"
  },
  "Cambodia (កម្ពុជា)": {
    "Asia/Bangkok": "(GMT+07:00) Bangkok"
  },
  "Kiribati": {
    "Pacific/Tarawa": "(GMT+12:00) Tarawa",
    "Pacific/Kiritimati": "(GMT+14:00) Kiritimati"
  },
  "Comoros (‫جزر القمر‬‎)": {
    "Africa/Nairobi": "(GMT+03:00) Nairobi"
  },
  "St. Kitts & Nevis": {
    "America/Port_of_Spain": "(GMT-04:00) Port of Spain"
  },
  "North Korea (조선민주주의인민공화국)": {
    "Asia/Pyongyang": "(GMT+08:30) Pyongyang"
  },
  "South Korea (대한민국)": {
    "Asia/Seoul": "(GMT+09:00) Seoul"
  },
  "Kuwait (‫الكويت‬‎)": {
    "Asia/Riyadh": "(GMT+03:00) Riyadh"
  },
  "Cayman Islands": {
    "America/Panama": "(GMT-05:00) Panama"
  },
  "Kazakhstan (Казахстан)": {
    "Asia/Aqtau": "(GMT+05:00) Aqtau",
    "Asia/Aqtobe": "(GMT+05:00) Aqtobe",
    "Asia/Almaty": "(GMT+06:00) Almaty"
  },
  "Laos (ລາວ)": {
    "Asia/Bangkok": "(GMT+07:00) Bangkok"
  },
  "Lebanon (‫لبنان‬‎)": {
    "Asia/Beirut": "(GMT+03:00) Beirut"
  },
  "St. Lucia": {
    "America/Port_of_Spain": "(GMT-04:00) Port of Spain"
  },
  "Liechtenstein": {
    "Europe/Zurich": "(GMT+02:00) Zurich"
  },
  "Sri Lanka (ශ්‍රී ලංකාව)": {
    "Asia/Colombo": "(GMT+05:30) Colombo"
  },
  "Liberia": {
    "Africa/Monrovia": "(GMT+00:00) Monrovia"
  },
  "Lesotho": {
    "Africa/Johannesburg": "(GMT+02:00) Johannesburg"
  },
  "Lithuania (Lietuva)": {
    "Europe/Vilnius": "(GMT+03:00) Vilnius"
  },
  "Luxembourg": {
    "Europe/Luxembourg": "(GMT+02:00) Luxembourg"
  },
  "Latvia (Latvija)": {
    "Europe/Riga": "(GMT+03:00) Riga"
  },
  "Libya (‫ليبيا‬‎)": {
    "Africa/Tripoli": "(GMT+02:00) Tripoli"
  },
  "Morocco": {
    "Africa/Casablanca": "(GMT+01:00) Casablanca"
  },
  "Monaco": {
    "Europe/Monaco": "(GMT+02:00) Monaco"
  },
  "Moldova (Republica Moldova)": {
    "Europe/Chisinau": "(GMT+03:00) Chisinau"
  },
  "Montenegro (Crna Gora)": {
    "Europe/Belgrade": "(GMT+02:00) Central European Time - Belgrade"
  },
  "St. Martin (Saint-Martin)": {
    "America/Port_of_Spain": "(GMT-04:00) Port of Spain"
  },
  "Madagascar (Madagasikara)": {
    "Africa/Nairobi": "(GMT+03:00) Nairobi"
  },
  "Marshall Islands": {
    "Pacific/Kwajalein": "(GMT+12:00) Kwajalein",
    "Pacific/Majuro": "(GMT+12:00) Majuro"
  },
  "Macedonia (FYROM) (Македонија)": {
    "Europe/Belgrade": "(GMT+02:00) Central European Time - Belgrade"
  },
  "Mali": {
    "Africa/Abidjan": "(GMT+00:00) Abidjan"
  },
  "Myanmar (Burma) (မြန်မာ)": {
    "Asia/Rangoon": "(GMT+06:30) Rangoon"
  },
  "Mongolia (Монгол)": {
    "Asia/Hovd": "(GMT+08:00) Hovd",
    "Asia/Choibalsan": "(GMT+09:00) Choibalsan",
    "Asia/Ulaanbaatar": "(GMT+09:00) Ulaanbaatar"
  },
  "Macau (澳門)": {
    "Asia/Macau": "(GMT+08:00) Macau"
  },
  "Northern Mariana Islands": {
    "Pacific/Guam": "(GMT+10:00) Guam"
  },
  "Martinique": {
    "America/Martinique": "(GMT-04:00) Martinique"
  },
  "Mauritania (‫موريتانيا‬‎)": {
    "Africa/Abidjan": "(GMT+00:00) Abidjan"
  },
  "Montserrat": {
    "America/Port_of_Spain": "(GMT-04:00) Port of Spain"
  },
  "Malta": {
    "Europe/Malta": "(GMT+02:00) Malta"
  },
  "Mauritius (Moris)": {
    "Indian/Mauritius": "(GMT+04:00) Mauritius"
  },
  "Maldives": {
    "Indian/Maldives": "(GMT+05:00) Maldives"
  },
  "Malawi": {
    "Africa/Maputo": "(GMT+02:00) Maputo"
  },
  "Mexico (México)": {
    "America/Tijuana": "(GMT-07:00) Pacific Time - Tijuana",
    "America/Hermosillo": "(GMT-07:00) Mountain Time - Hermosillo",
    "America/Mazatlan": "(GMT-06:00) Mountain Time - Chihuahua, Mazatlan",
    "America/Mexico_City": "(GMT-05:00) Central Time - Mexico City",
    "America/Cancun": "(GMT-05:00) America Cancun"
  },
  "Malaysia": {
    "Asia/Kuala_Lumpur": "(GMT+08:00) Kuala Lumpur"
  },
  "Mozambique (Moçambique)": {
    "Africa/Maputo": "(GMT+02:00) Maputo"
  },
  "Namibia (Namibië)": {
    "Africa/Windhoek": "(GMT+01:00) Windhoek"
  },
  "New Caledonia (Nouvelle-Calédonie)": {
    "Pacific/Noumea": "(GMT+11:00) Noumea"
  },
  "Niger (Nijar)": {
    "Africa/Lagos": "(GMT+01:00) Lagos"
  },
  "Norfolk Island": {
    "Pacific/Norfolk": "(GMT+11:00) Norfolk"
  },
  "Nigeria": {
    "Africa/Lagos": "(GMT+01:00) Lagos"
  },
  "Nicaragua": {
    "America/Managua": "(GMT-06:00) Managua"
  },
  "Netherlands (Nederland)": {
    "Europe/Amsterdam": "(GMT+02:00) Amsterdam"
  },
  "Norway (Norge)": {
    "Europe/Oslo": "(GMT+02:00) Oslo"
  },
  "Nepal (नेपाल)": {
    "Asia/Katmandu": "(GMT+05:45) Katmandu"
  },
  "Nauru": {
    "Pacific/Nauru": "(GMT+12:00) Nauru"
  },
  "Niue": {
    "Pacific/Niue": "(GMT-11:00) Niue"
  },
  "New Zealand": {
    "Pacific/Auckland": "(GMT+12:00) Auckland"
  },
  "Oman (‫عُمان‬‎)": {
    "Asia/Dubai": "(GMT+04:00) Dubai"
  },
  "Panama (Panamá)": {
    "America/Panama": "(GMT-05:00) Panama"
  },
  "Peru (Perú)": {
    "America/Lima": "(GMT-05:00) Lima"
  },
  "French Polynesia (Polynésie française)": {
    "Pacific/Tahiti": "(GMT-10:00) Tahiti",
    "Pacific/Marquesas": "(GMT-09:30) Marquesas",
    "Pacific/Gambier": "(GMT-09:00) Gambier"
  },
  "Papua New Guinea": {
    "Pacific/Port_Moresby": "(GMT+10:00) Port Moresby"
  },
  "Philippines": {
    "Asia/Manila": "(GMT+08:00) Manila"
  },
  "Pakistan (‫پاکستان‬‎)": {
    "Asia/Karachi": "(GMT+05:00) Karachi"
  },
  "Poland (Polska)": {
    "Europe/Warsaw": "(GMT+02:00) Warsaw"
  },
  "St. Pierre & Miquelon (Saint-Pierre-et-Miquelon)": {
    "America/Miquelon": "(GMT-02:00) Miquelon"
  },
  "Pitcairn Islands": {
    "Pacific/Pitcairn": "(GMT-08:00) Pitcairn"
  },
  "Puerto Rico": {
    "America/Puerto_Rico": "(GMT-04:00) Puerto Rico"
  },
  "Palestine (‫فلسطين‬‎)": {
    "Asia/Gaza": "(GMT+03:00) Gaza"
  },
  "Portugal": {
    "Atlantic/Azores": "(GMT+00:00) Azores",
    "Europe/Lisbon": "(GMT+01:00) Lisbon"
  },
  "Palau": {
    "Pacific/Palau": "(GMT+09:00) Palau"
  },
  "Paraguay": {
    "America/Asuncion": "(GMT-04:00) Asuncion"
  },
  "Qatar (‫قطر‬‎)": {
    "Asia/Qatar": "(GMT+03:00) Qatar"
  },
  "Réunion (La Réunion)": {
    "Indian/Reunion": "(GMT+04:00) Reunion"
  },
  "Romania (România)": {
    "Europe/Bucharest": "(GMT+03:00) Bucharest"
  },
  "Serbia (Србија)": {
    "Europe/Belgrade": "(GMT+02:00) Central European Time - Belgrade"
  },
  "Russia (Россия)": {
    "Europe/Kaliningrad": "(GMT+02:00) Moscow-01 - Kaliningrad",
    "Europe/Moscow": "(GMT+03:00) Moscow+00 - Moscow",
    "Europe/Samara": "(GMT+04:00) Moscow+01 - Samara",
    "Asia/Yekaterinburg": "(GMT+05:00) Moscow+02 - Yekaterinburg",
    "Asia/Omsk": "(GMT+06:00) Moscow+03 - Omsk, Novosibirsk",
    "Asia/Krasnoyarsk": "(GMT+07:00) Moscow+04 - Krasnoyarsk",
    "Asia/Irkutsk": "(GMT+08:00) Moscow+05 - Irkutsk",
    "Asia/Yakutsk": "(GMT+09:00) Moscow+06 - Yakutsk",
    "Asia/Magadan": "(GMT+10:00) Moscow+07 - Magadan",
    "Asia/Vladivostok": "(GMT+10:00) Moscow+07 - Yuzhno-Sakhalinsk",
    "Asia/Kamchatka": "(GMT+12:00) Moscow+09 - Petropavlovsk-Kamchatskiy"
  },
  "Rwanda": {
    "Africa/Maputo": "(GMT+02:00) Maputo"
  },
  "Saudi Arabia (‫المملكة العربية السعودية‬‎)": {
    "Asia/Riyadh": "(GMT+03:00) Riyadh"
  },
  "Solomon Islands": {
    "Pacific/Guadalcanal": "(GMT+11:00) Guadalcanal"
  },
  "Seychelles": {
    "Indian/Mahe": "(GMT+04:00) Mahe"
  },
  "Sudan (‫السودان‬‎)": {
    "Africa/Khartoum": "(GMT+03:00) Khartoum"
  },
  "Sweden (Sverige)": {
    "Europe/Stockholm": "(GMT+02:00) Stockholm"
  },
  "Singapore": {
    "Asia/Singapore": "(GMT+08:00) Singapore"
  },
  "St. Helena": {
    "Africa/Abidjan": "(GMT+00:00) Abidjan"
  },
  "Slovenia (Slovenija)": {
    "Europe/Belgrade": "(GMT+02:00) Central European Time - Belgrade"
  },
  "Svalbard & Jan Mayen (Svalbard og Jan Mayen)": {
    "Europe/Oslo": "(GMT+02:00) Oslo"
  },
  "Slovakia (Slovensko)": {
    "Europe/Prague": "(GMT+02:00) Central European Time - Prague"
  },
  "Sierra Leone": {
    "Africa/Abidjan": "(GMT+00:00) Abidjan"
  },
  "San Marino": {
    "Europe/Rome": "(GMT+02:00) Rome"
  },
  "Senegal": {
    "Africa/Abidjan": "(GMT+00:00) Abidjan"
  },
  "Somalia (Soomaaliya)": {
    "Africa/Nairobi": "(GMT+03:00) Nairobi"
  },
  "Suriname": {
    "America/Paramaribo": "(GMT-03:00) Paramaribo"
  },
  "South Sudan (‫جنوب السودان‬‎)": {
    "Africa/Khartoum": "(GMT+03:00) Khartoum"
  },
  "São Tomé & Príncipe (São Tomé e Príncipe)": {
    "Africa/Abidjan": "(GMT+00:00) Abidjan"
  },
  "El Salvador": {
    "America/El_Salvador": "(GMT-06:00) El Salvador"
  },
  "Sint Maarten": {
    "America/Curacao": "(GMT-04:00) Curacao"
  },
  "Syria (‫سوريا‬‎)": {
    "Asia/Damascus": "(GMT+03:00) Damascus"
  },
  "Swaziland": {
    "Africa/Johannesburg": "(GMT+02:00) Johannesburg"
  },
  "Turks & Caicos Islands": {
    "America/Grand_Turk": "(GMT-04:00) Grand Turk"
  },
  "Chad (Tchad)": {
    "Africa/Ndjamena": "(GMT+01:00) Ndjamena"
  },
  "French Southern Territories (Terres australes françaises)": {
    "Indian/Kerguelen": "(GMT+05:00) Kerguelen"
  },
  "Togo": {
    "Africa/Abidjan": "(GMT+00:00) Abidjan"
  },
  "Thailand (ไทย)": {
    "Asia/Bangkok": "(GMT+07:00) Bangkok"
  },
  "Tajikistan": {
    "Asia/Dushanbe": "(GMT+05:00) Dushanbe"
  },
  "Tokelau": {
    "Pacific/Fakaofo": "(GMT+13:00) Fakaofo"
  },
  "Timor-Leste": {
    "Asia/Dili": "(GMT+09:00) Dili"
  },
  "Turkmenistan": {
    "Asia/Ashgabat": "(GMT+05:00) Ashgabat"
  },
  "Tunisia": {
    "Africa/Tunis": "(GMT+01:00) Tunis"
  },
  "Tonga": {
    "Pacific/Tongatapu": "(GMT+13:00) Tongatapu"
  },
  "Turkey (Türkiye)": {
    "Europe/Istanbul": "(GMT+03:00) Istanbul"
  },
  "Trinidad & Tobago": {
    "America/Port_of_Spain": "(GMT-04:00) Port of Spain"
  },
  "Tuvalu": {
    "Pacific/Funafuti": "(GMT+12:00) Funafuti"
  },
  "Taiwan (台灣)": {
    "Asia/Taipei": "(GMT+08:00) Taipei"
  },
  "Tanzania": {
    "Africa/Nairobi": "(GMT+03:00) Nairobi"
  },
  "Ukraine (Україна)": {
    "Europe/Kiev": "(GMT+03:00) Kiev"
  },
  "Uganda": {
    "Africa/Nairobi": "(GMT+03:00) Nairobi"
  },
  "U.S. Outlying Islands": {
    "Pacific/Pago_Pago": "(GMT-11:00) Pago Pago",
    "Pacific/Honolulu": "(GMT-10:00) Hawaii Time",
    "Pacific/Wake": "(GMT+12:00) Wake",
    "Pacific/Enderbury": "(GMT+13:00) Enderbury"
  },
  "United States": {
    "Pacific/Honolulu": "(GMT-10:00) Hawaii Time",
    "America/Anchorage": "(GMT-08:00) Alaska Time",
    "America/Los_Angeles": "(GMT-07:00) Pacific Time",
    "America/Denver": "(GMT-06:00) Mountain Time",
    "America/Phoenix": "(GMT-07:00) Mountain Time - Arizona",
    "America/Chicago": "(GMT-05:00) Central Time",
    "America/New_York": "(GMT-04:00) Eastern Time"
  },
  "Uruguay": {
    "America/Montevideo": "(GMT-03:00) Montevideo"
  },
  "Uzbekistan (Oʻzbekiston)": {
    "Asia/Tashkent": "(GMT+05:00) Tashkent"
  },
  "Vatican City (Città del Vaticano)": {
    "Europe/Rome": "(GMT+02:00) Rome"
  },
  "St. Vincent & Grenadines": {
    "America/Port_of_Spain": "(GMT-04:00) Port of Spain"
  },
  "Venezuela": {
    "America/Caracas": "(GMT-04:30) Caracas"
  },
  "British Virgin Islands": {
    "America/Port_of_Spain": "(GMT-04:00) Port of Spain"
  },
  "U.S. Virgin Islands": {
    "America/Port_of_Spain": "(GMT-04:00) Port of Spain"
  },
  "Vietnam (Việt Nam)": {
    "Asia/Saigon": "(GMT+07:00) Hanoi"
  },
  "Vanuatu": {
    "Pacific/Efate": "(GMT+11:00) Efate"
  },
  "Wallis & Futuna": {
    "Pacific/Wallis": "(GMT+12:00) Wallis"
  },
  "Samoa": {
    "Pacific/Apia": "(GMT+13:00) Apia"
  },
  "Yemen (‫اليمن‬‎)": {
    "Asia/Riyadh": "(GMT+03:00) Riyadh"
  },
  "Mayotte": {
    "Africa/Nairobi": "(GMT+03:00) Nairobi"
  },
  "South Africa": {
    "Africa/Johannesburg": "(GMT+02:00) Johannesburg"
  },
  "Zambia": {
    "Africa/Maputo": "(GMT+02:00) Maputo"
  },
  "Zimbabwe": {
    "Africa/Maputo": "(GMT+02:00) Maputo"
  }
};

