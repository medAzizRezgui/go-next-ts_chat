package main

import (
	"log"
	"server/db"
)

func main() {
	_, err := db.NewDataBase()
	if err != nil {
		log.Fatalf("Error: %s", err)
	}
}
