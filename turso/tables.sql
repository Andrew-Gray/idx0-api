CREATE TABLE
	FakeProfile (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		firstName VARCHAR(255),
		lastName VARCHAR(255),
		middleInitial VARCHAR(1),
		gender VARCHAR(1),
		dateOfBirth VARCHAR(10),
		mothersMaiden VARCHAR(255),
		weight FLOAT
		streetAddress VARCHAR(255),
		city VARCHAR(255),
		state VARCHAR(2),
		zipCode VARCHAR(6),
		countryCode VARCHAR(2),
		username VARCHAR(255),
		color VARCHAR(255),
	);

CREATE TABLE
	WeatherLocation (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		city VARCHAR(255),
		province VARCHAR(255),
		latitude FLOAT,
		longitude FLOAT,
		timezone VARCHAR(255),
		updatedDate VARCHAR(255)
	);

CREATE TABLE
	WeatherCurrent (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		locationId INTEGER NOT NULL,
		time VARCHAR(255),
		temperature FLOAT,
		humidity FLOAT
		temperatureFeels FLOAT,
		isDay BOOLEAN,
		precipitation FLOAT,
		rain FLOAT,
		showers FLOAT,
		snowfall FLOAT,
		weatherCode INTEGER,
		cloudCover INTEGER,
		windSpeed FLOAT,
		windDirection INTEGER,
		windGusts FLOAT,
		airQuality INTEGER,
		uvIndex FLOAT,
		uvIndexClearSky FLOAT,
		FOREIGN KEY(locationId) REFERENCES WeatherLocation(id)
	);

CREATE TABLE
	WeatherDaily (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		locationId INTEGER NOT NULL,
		time VARCHAR(255),
		weatherCode INTEGER,
		temperatureMax FLOAT,
		temperatureMin FLOAT,
		sunrise VARCHAR(255),
		sunset VARCHAR(255),
		daylightDuration FLOAT,
		sunshineDuration FLOAT,
		uvIndexMax FLOAT,
		uvIndexClearSkyMax FLOAT,
		precipitationSum FLOAT,
		rainSum FLOAT,
		showersSum FLOAT,
		snowfallSum FLOAT,
		precipitationHours FLOAT,
		precipitationProbability INTEGER,
		windSpeed FLOAT,
		windGusts FLOAT,
		windDirection INTEGER,
		FOREIGN KEY(locationId) REFERENCES WeatherLocation(id)
	);

CREATE TABLE
	WeatherHourly (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		locationId INTEGER NOT NULL,
		time VARCHAR(255),
		temperature FLOAT,
		humidity FLOAT,
		apparentTemperature FLOAT,
		precipitationProbability INTEGER,
		precipitation FLOAT,
		rain FLOAT,
		showers FLOAT,
		snowfall FLOAT,
		snowDepth FLOAT,
		weatherCode INTEGER,
		cloudCover INTEGER,
		windSpeed FLOAT,
		windDirection INTEGER,
		windGusts FLOAT,
		dewPoint FLOAT,
		airQuality INTEGER,
		uvIndex FLOAT,
		uvIndexClearSky FLOAT,
		FOREIGN KEY(locationId) REFERENCES WeatherLocation(id)
	);