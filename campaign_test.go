package main

import (
	"strings"
	"testing"
)

func TestCampaignCRUD(t *testing.T) {
	db, _ := initConnection()
	defer db.Close()

	// test insert
	c := Campaign{
		OwnerID:   1,
		Title:     "test",
		Memo:      "memo",
		CreatedBy: 1,
	}

	if err := c.Insert(db); err != nil {
		t.Error(err)
	} else if c.ID <= 0 {
		t.Errorf("campaign NO ID")
	}

	// test find & bind
	var rc Campaign
	if err := rc.Find(db, c.ID); err != nil {
		t.Error(err)
	} else if rc.ID != c.ID {
		t.Errorf("campaign find & bind error: ID expected %d but actual %d", c.ID, rc.ID)
	}

	// test update
	c.Title = "sample"
	c.UpdatedBy = 2

	if err := c.Update(db); err != nil {
		t.Error(err)
	}
	var uc Campaign
	if err := uc.Find(db, c.ID); err != nil {
		t.Error(err)
	} else if strings.Compare(rc.Title, uc.Title) == 0 {
		t.Errorf("campaign not updated")
	}
}
