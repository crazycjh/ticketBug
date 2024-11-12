// TODO 改成分成skyscanner, Expedia, Trip.com 

const airportCode = [
	{ city: "Taipei", country: "Taiwan", code: "TPE-Taoyuan Intl." },
	{ city: "Seoul", country: "South Korea", code: "ICN-Incheon Intl." },
	{
		city: "Hong Kong",
		country: "Hong Kong SAR",
		code: "HKG-Hong Kong Intl.",
	},
	{
		city: "Kuala Lumpur",
		country: "Malaysia",
		code: "KUL-Kuala Lumpur Intl.",
	},
	{ city: "Bangkok", country: "Thailand", code: "BKK-Suvarnabhumi Intl." },
	// IST Istanbul
	{ city: "Istanbul", country: "", code: "IST - All Airports" },
	{ city: "Amsterdam", country: "Netherlands", code: "AMS-Schiphol" },
	{
		city: "Athens",
		country: "Greece",
		code: "ATH-Eleftherios Venizelos",
	},
	{
		city: "Frankfurt",
		country: "Germany",
		code: "FRA-Frankfurt Intl.",
	},
	{
		city: "Bucharest",
		country: "Romania",
		code: "OTP-Henri Coanda Intl.",
	},
	{
		city: "Budapest",
		country: "Hungary",
		code: "BUD-Ferenc Liszt Intl.",
	},
	{ city: "Barcelona", country: "Spain", code: "BCN-Barcelona Intl." },
	{
		city: "Brussels",
		country: "Belgium",
		code: "BRU-Brussels - National",
	},
	{
		city: "Bucharest",
		country: "Romania",
		code: "OTP-Henri Coanda Intl.",
	},
	{ city: "Cologne", country: "Germany", code: "CGN-Cologne - Bonn" },
	{ city: "Copenhagen", country: "Denmark", code: "CPH-Kastrup" },

	{ city: "London", country: "United Kingdom", code: "LHR-Heathrow" },
	{ city: "London_LGW", country: "United Kingdom", code: "LGW-Gatwick" },
	{ city: "Ljubljana", country: "Slovenia", code: "LJU-Joze Pucnik" },
	{ city: "Luxor", country: "Egypt", code: "LXR-Luxor Intl." },
	{ city: "Lyon", country: "France", code: "LYS-Saint-Exupery" },
	{
		city: "Madrid",
		country: "Spain",
		code: "MAD-Adolfo Suárez Madrid-Barajas",
	},
	{ city: "Munich", country: "Germany", code: "MUC-All Airports" },
	{ city: "Milan", country: "Italy", code: "MXP-Malpensa Intl." },
	{ city: "Oslo", country: "Norway", code: "OSL-Gardermoen" },
	{
		city: "Paris",
		country: "France",
		code: "CDG-Roissy-Charles de Gaulle",
	},
	{ city: "Prague", country: "Czechia", code: "PRG-Vaclav Havel" },
	{
		city: "Rome",
		country: "Italy",
		code: "FCO-Fiumicino - Leonardo da Vinci Intl.",
	},
	{ city: "Sofia", country: "Bulgaria", code: "SOF" },
	{
		city: "Durham",
		country: "United Kingdom",
		code: "MME-Teesside Intl.",
	},
	{ city: "Verona", country: "Italy", code: "VRN-Valerio Catullo" },
	{ city: "Venice", country: "Italy", code: "VCE-Marco Polo" },
	{ city: "Vilnius", country: "Lithuania", code: "VNO-Vilnius Intl." },
	{ city: "Warsaw", country: "Poland", code: "WAW-Frederic Chopin" },
	{ city: "Wroclaw", country: "Poland", code: "WRO-Copernicus" },
	{ city: "Vienna", country: "Austria", code: "VIE-Vienna Intl." },
	{ city: "Zagreb", country: "Croatia", code: "ZAG" },
	{ city: "Dubrovnik", country: "Croatia", code: "DBV-Dubrovnik" },

	// 美洲
	{ city: "Vancouver", country: "Canada", code: "YVR-Vancouver Intl." },
	// South Africa      CPT-Cape Town Intl.
	{
		city: "Johannesburg",
		country: "South Africa",
		code: "JNB-O.R. Tambo Intl.",
	},

	{ city: "Cape Town", country: "South Africa", code: "CPT-Cape Town Intl." },
	// 南半球 Melbourne
	{ city: "Melbourne", country: "", code: "MEL - Tullamarine" },
	//
	{ city: "Sydney", country: "", code: "SYD - Kingsford Smith Intl." },
];

exports.getAirportCode = (code) => {
	let cityCode = "";
	
	cityCode = airportCode.find((item) =>
		item.code.toLowerCase().includes(code.toLowerCase()),
	);
	console.log(code);
	console.log(cityCode);
	if (cityCode) {
		return cityCode;
	}
	return "";
};

exports.CityToAirportCode = (city) => {
	// console.log(city);
	let cityCode = airportCode.find((item) => item.city === city);
	return cityCode.code.split("-")[0].trim();
};
