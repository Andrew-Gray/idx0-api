package initializers

import (
	"database/sql"
	"fmt"
	"os"

	_ "github.com/tursodatabase/libsql-client-go/libsql"
)

var DB *sql.DB

func ConnectToDB() {
	dburl := os.Getenv("TURSO_URL")

	var err error
	//Connect to DB
	db, err := sql.Open("libsql", dburl)

	if err != nil {
		fmt.Fprintf(os.Stderr, "failed to open db %s: %s", dburl, err)
		os.Exit(1)
	}

	DB = db
}
