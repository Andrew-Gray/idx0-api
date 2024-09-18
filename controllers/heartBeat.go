package controllers

import (
	"database/sql"
	"fmt"
	"os"

	_ "github.com/tursodatabase/libsql-client-go/libsql"
)

func HeartBeat(db *sql.DB) {
	fmt.Println("DB HeartBeat")

	rows, err := db.Query("SELECT * FROM HeartBeat")
	if err != nil {
		fmt.Fprintf(os.Stderr, "failed to execute query: %v\n", err)
		os.Exit(1)
	}

	defer rows.Close()
}
