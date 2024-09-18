package controllers

import (
	"database/sql"
	"fmt"
	"os"
	"strings"

	"github.com/Andrew-Gray/idx0-api/utilities"

	_ "github.com/tursodatabase/libsql-client-go/libsql"
)

type FakeProfile struct {
	Id            int     `json:"id"`
	FirstName     string  `json:"firstName"`
	LastName      string  `json:"lastName"`
	MiddleInitial string  `json:"middleInitial"`
	Gender        string  `json:"gender"`
	DateOfBirth   string  `json:"dateOfBirth"`
	MothersMaiden string  `json:"mothersMaiden"`
	Weight        float32 `json:"weight"`
	StreetAddress string  `json:"streetAddress"`
	City          string  `json:"city"`
	State         string  `json:"state"`
	ZipCode       string  `json:"zipCode"`
	CountryCode   string  `json:"countryCode"`
	Username      string  `json:"username"`
	Color         string  `json:"color"`
}

func GetFakeProfile(db *sql.DB) FakeProfile {
	id := utilities.RandomRange(1, 25000)
	profile := queryDbForFakeProfile(db, id)
	return profile
}

func GetFakeProfileById(db *sql.DB, id int) FakeProfile {
	index := id
	if index < 1 {
		index = 1
	} else if index > 25000 {
		index = 25000
	}

	return queryDbForFakeProfile(db, id)
}

func queryDbForFakeProfile(db *sql.DB, id int) (profile FakeProfile) {
	rows, err := db.Query("SELECT * FROM FakeProfile WHERE id = ?", id)
	if err != nil {
		fmt.Fprintf(os.Stderr, "failed to execute query: %v\n", err)
		os.Exit(1)
	}

	defer rows.Close()
	for rows.Next() {
		if err := rows.Scan(&profile.Id, &profile.FirstName, &profile.LastName, &profile.MiddleInitial, &profile.Gender, &profile.DateOfBirth, &profile.MothersMaiden, &profile.Weight, &profile.StreetAddress, &profile.City, &profile.State, &profile.ZipCode, &profile.CountryCode, &profile.Username, &profile.Color); err != nil {
			fmt.Println("Error scanning row:", err)
			return profile
		}
	}

	profile.MothersMaiden = strings.TrimSpace(profile.MothersMaiden)
	profile.Color = strings.ReplaceAll(profile.Color, "\r", "")

	return profile
}
