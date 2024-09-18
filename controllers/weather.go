package controllers

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"

	_ "github.com/tursodatabase/libsql-client-go/libsql"
)

func GetWeather() { //lat float64, lon float64
	resp, err := http.Get("https://api.open-meteo.com/v1/forecast?latitude=49.88307&longitude=-119.48568&timezone=America/Vancouver&forecast_days=16&current=temperature_2m&current=relative_humidity_2m&current=apparent_temperature&current=is_day&current=precipitation&current=rain&current=showers&current=snowfall&current=weather_code&current=cloud_cover&current=wind_speed_10m&current=wind_direction_10m&current=wind_gusts_10m&daily=weather_code&daily=temperature_2m_max&daily=temperature_2m_min&daily=apparent_temperature_max&daily=apparent_temperature_min&daily=sunrise&daily=sunset&daily=daylight_duration&daily=sunshine_duration&daily=uv_index_max&daily=uv_index_clear_sky_max&daily=precipitation_sum&daily=rain_sum&daily=showers_sum&daily=snowfall_sum&daily=precipitation_hours&daily=precipitation_probability_max&daily=wind_speed_10m_max&daily=wind_gusts_10m_max&daily=wind_direction_10m_dominant&hourly=temperature_2m&hourly=relative_humidity_2m&hourly=apparent_temperature&hourly=precipitation_probability&hourly=precipitation&hourly=rain&hourly=showers&hourly=snowfall&hourly=snow_depth&hourly=weather_code&hourly=cloud_cover&hourly=wind_speed_10m&hourly=wind_direction_10m&hourly=wind_gusts_10m&hourly=dew_point_2m")
	if err != nil {
		log.Fatalln(err)
	}
	//We Read the response body on the line below.
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Fatalln(err)
	}
	//Convert the body to type string
	// sb := string(body)
	// pingJSON := make(map[string][]WeatherApi)
	var test WeatherApi
	errr := json.Unmarshal(body, &test)
	if err != nil {
		panic(errr)
	}
	fmt.Println(test)
}

type WeatherApi struct {
	Latitude             float64 `json:"latitude"`
	Longitude            float64 `json:"longitude"`
	GenerationtimeMs     float64 `json:"generationtime_ms"`
	UtcOffsetSeconds     int     `json:"utc_offset_seconds"`
	Timezone             string  `json:"timezone"`
	TimezoneAbbreviation string  `json:"timezone_abbreviation"`
	Elevation            int     `json:"elevation"`
	CurrentUnits         struct {
		Time                string `json:"time"`
		Interval            string `json:"interval"`
		Temperature2M       string `json:"temperature_2m"`
		RelativeHumidity2M  string `json:"relative_humidity_2m"`
		ApparentTemperature string `json:"apparent_temperature"`
		IsDay               string `json:"is_day"`
		Precipitation       string `json:"precipitation"`
		Rain                string `json:"rain"`
		Showers             string `json:"showers"`
		Snowfall            string `json:"snowfall"`
		WeatherCode         string `json:"weather_code"`
		CloudCover          string `json:"cloud_cover"`
		WindSpeed10M        string `json:"wind_speed_10m"`
		WindDirection10M    string `json:"wind_direction_10m"`
		WindGusts10M        string `json:"wind_gusts_10m"`
	} `json:"current_units"`
	Current struct {
		Time                string  `json:"time"`
		Interval            int     `json:"interval"`
		Temperature2M       float64 `json:"temperature_2m"`
		RelativeHumidity2M  int     `json:"relative_humidity_2m"`
		ApparentTemperature float64 `json:"apparent_temperature"`
		IsDay               int     `json:"is_day"`
		Precipitation       int     `json:"precipitation"`
		Rain                int     `json:"rain"`
		Showers             int     `json:"showers"`
		Snowfall            int     `json:"snowfall"`
		WeatherCode         int     `json:"weather_code"`
		CloudCover          int     `json:"cloud_cover"`
		WindSpeed10M        float64 `json:"wind_speed_10m"`
		WindDirection10M    int     `json:"wind_direction_10m"`
		WindGusts10M        float64 `json:"wind_gusts_10m"`
	} `json:"current"`
	HourlyUnits struct {
		Time                     string `json:"time"`
		Temperature2M            string `json:"temperature_2m"`
		RelativeHumidity2M       string `json:"relative_humidity_2m"`
		ApparentTemperature      string `json:"apparent_temperature"`
		PrecipitationProbability string `json:"precipitation_probability"`
		Precipitation            string `json:"precipitation"`
		Rain                     string `json:"rain"`
		Showers                  string `json:"showers"`
		Snowfall                 string `json:"snowfall"`
		SnowDepth                string `json:"snow_depth"`
		WeatherCode              string `json:"weather_code"`
		CloudCover               string `json:"cloud_cover"`
		WindSpeed10M             string `json:"wind_speed_10m"`
		WindDirection10M         string `json:"wind_direction_10m"`
		WindGusts10M             string `json:"wind_gusts_10m"`
		DewPoint2M               string `json:"dew_point_2m"`
	} `json:"hourly_units"`
	Hourly struct {
		Time                     []string `json:"time"`
		Temperature2M            []any    `json:"temperature_2m"`
		RelativeHumidity2M       []any    `json:"relative_humidity_2m"`
		ApparentTemperature      []any    `json:"apparent_temperature"`
		PrecipitationProbability []int    `json:"precipitation_probability"`
		Precipitation            []any    `json:"precipitation"`
		Rain                     []any    `json:"rain"`
		Showers                  []any    `json:"showers"`
		Snowfall                 []any    `json:"snowfall"`
		SnowDepth                []any    `json:"snow_depth"`
		WeatherCode              []any    `json:"weather_code"`
		CloudCover               []any    `json:"cloud_cover"`
		WindSpeed10M             []any    `json:"wind_speed_10m"`
		WindDirection10M         []any    `json:"wind_direction_10m"`
		WindGusts10M             []any    `json:"wind_gusts_10m"`
		DewPoint2M               []any    `json:"dew_point_2m"`
	} `json:"hourly"`
	DailyUnits struct {
		Time                        string `json:"time"`
		WeatherCode                 string `json:"weather_code"`
		Temperature2MMax            string `json:"temperature_2m_max"`
		Temperature2MMin            string `json:"temperature_2m_min"`
		ApparentTemperatureMax      string `json:"apparent_temperature_max"`
		ApparentTemperatureMin      string `json:"apparent_temperature_min"`
		Sunrise                     string `json:"sunrise"`
		Sunset                      string `json:"sunset"`
		DaylightDuration            string `json:"daylight_duration"`
		SunshineDuration            string `json:"sunshine_duration"`
		UvIndexMax                  string `json:"uv_index_max"`
		UvIndexClearSkyMax          string `json:"uv_index_clear_sky_max"`
		PrecipitationSum            string `json:"precipitation_sum"`
		RainSum                     string `json:"rain_sum"`
		ShowersSum                  string `json:"showers_sum"`
		SnowfallSum                 string `json:"snowfall_sum"`
		PrecipitationHours          string `json:"precipitation_hours"`
		PrecipitationProbabilityMax string `json:"precipitation_probability_max"`
		WindSpeed10MMax             string `json:"wind_speed_10m_max"`
		WindGusts10MMax             string `json:"wind_gusts_10m_max"`
		WindDirection10MDominant    string `json:"wind_direction_10m_dominant"`
	} `json:"daily_units"`
	Daily struct {
		Time                        []string  `json:"time"`
		WeatherCode                 []int     `json:"weather_code"`
		Temperature2MMax            []float64 `json:"temperature_2m_max"`
		Temperature2MMin            []float64 `json:"temperature_2m_min"`
		ApparentTemperatureMax      []float64 `json:"apparent_temperature_max"`
		ApparentTemperatureMin      []float64 `json:"apparent_temperature_min"`
		Sunrise                     []string  `json:"sunrise"`
		Sunset                      []string  `json:"sunset"`
		DaylightDuration            []float64 `json:"daylight_duration"`
		SunshineDuration            []any     `json:"sunshine_duration"`
		UvIndexMax                  []float64 `json:"uv_index_max"`
		UvIndexClearSkyMax          []float64 `json:"uv_index_clear_sky_max"`
		PrecipitationSum            []any     `json:"precipitation_sum"`
		RainSum                     []any     `json:"rain_sum"`
		ShowersSum                  []any     `json:"showers_sum"`
		SnowfallSum                 []any     `json:"snowfall_sum"`
		PrecipitationHours          []int     `json:"precipitation_hours"`
		PrecipitationProbabilityMax []int     `json:"precipitation_probability_max"`
		WindSpeed10MMax             []float64 `json:"wind_speed_10m_max"`
		WindGusts10MMax             []float64 `json:"wind_gusts_10m_max"`
		WindDirection10MDominant    []any     `json:"wind_direction_10m_dominant"`
	} `json:"daily"`
}

// https://api.open-meteo.com/v1/forecast?latitude=49.88307&longitude=-119.48568&timezone=America/Vancouver&forecast_days=16&current=temperature_2m&current=relative_humidity_2m&current=apparent_temperature&current=is_day&current=precipitation&current=rain&current=showers&current=snowfall&current=weather_code&current=cloud_cover&current=wind_speed_10m&current=wind_direction_10m&current=wind_gusts_10m&daily=weather_code&daily=temperature_2m_max&daily=temperature_2m_min&daily=apparent_temperature_max&daily=apparent_temperature_min&daily=sunrise&daily=sunset&daily=daylight_duration&daily=sunshine_duration&daily=uv_index_max&daily=uv_index_clear_sky_max&daily=precipitation_sum&daily=rain_sum&daily=showers_sum&daily=snowfall_sum&daily=precipitation_hours&daily=precipitation_probability_max&daily=wind_speed_10m_max&daily=wind_gusts_10m_max&daily=wind_direction_10m_dominant&hourly=temperature_2m&hourly=relative_humidity_2m&hourly=apparent_temperature&hourly=precipitation_probability&hourly=precipitation&hourly=rain&hourly=showers&hourly=snowfall&hourly=snow_depth&hourly=weather_code&hourly=cloud_cover&hourly=wind_speed_10m&hourly=wind_direction_10m&hourly=wind_gusts_10m&hourly=dew_point_2m
