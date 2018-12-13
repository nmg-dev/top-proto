package main

import (
	"testing"
)

func TestUserInsert(t *testing.T) {
	tester := User{
		GUID: "TesterID",
		Profile: DJsonMap{
			"name":  "Tester",
			"email": "dev@nextmediagroup.co.kr",
		},
		Access: DJsonMap{
			"token":      "1234",
			"expires_at": 1234,
		},
	}

	db, _ := initConnection()
	defer db.Close()

	err := tester.Insert(db)
	t.Log(tester.String())
	if err != nil {
		t.Errorf("Insertion failed")
	} else if tester.ID <= 0 {
		t.Errorf("Insert ID setup failed")
	}

}

func TestUserBind(t *testing.T) {
	db, _ := initConnection()
	defer db.Close()

	rs, _ := db.Prepare(`SELECT * FROM users ORDER BY ID DESC LIMIT 1`)
	row := rs.QueryRow()
	defer rs.Close()

	var u User
	u.Bind(row)

	if u.ID <= 0 {
		t.Errorf("no ID")
	} else {
		t.Log(u.String())
	}
}

func TestUserFind(t *testing.T) {
	db, _ := initConnection()
	defer db.Close()

	user := User{Email: "dev@nextmediagroup.co.kr"}
	err := user.SearchEmail(db)

	if err != nil {
		t.Error(err)
		t.Errorf("not found")
	} else if user.ID <= 0 {
		t.Errorf("not found 2")
	} else {
		t.Log(user.String())
	}
}
