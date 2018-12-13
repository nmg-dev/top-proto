package main

import (
	"testing"
)

func TestDatabaseConnection(t *testing.T) {
	db, err := initConnection()
	if err == nil {
		defer db.Close()
		t.Logf("Database connection success")
	} else {
		t.Errorf("DB: Connection failed %s", err.Error())
	}
	_, sqlEx := db.Query(`SELECT "PING"`)
	if sqlEx != nil {
		t.Errorf("DB: Connection fail at ping")
	}
}

// SampleSchema
type SampleSchema struct {
	ID   uint   `json:"id" db:"id"`
	name string `json:"name" db:"name"`
	age  uint   `json:"age" db:"years"`
}
