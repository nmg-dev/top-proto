package main

import (
	"database/sql"
	"fmt"
	"math"
	"math/rand"
	"strings"
	"time"
)

func Migrate(clear bool, withSeeding bool) {
	db, _ := initConnection()

	if clear {
		runMigrations(db, migrationDown)
	}

	runMigrations(db, migrations)

	if withSeeding {
		initTags(db)

		initCampaigns(db)

		initAffiliations(db)

		initAdmin(db)
	}

}

func initTags(db *sql.DB) {
	// initialize tags
	tx, _ := db.Begin()
	tstmt, _ := tx.Prepare(`INSERT INTO tags (class, name) VALUES (?, ?)`)
	tags := seedingTags()
	for _, t := range tags {
		tstmt.Exec(t.Class, t.Name)
	}
	tx.Commit()
}

func initCampaigns(db *sql.DB) {
	campaigns := seedingCampaigns()
	tx, _ := db.Begin()
	stmt, _ := tx.Prepare(`INSERT INTO campaigns (title, memo, period_from, period_till, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())`)
	for _, c := range campaigns {
		stmt.Exec(c.Title, c.Memo, c.PeriodFrom, c.PeriodTill)
	}
	tx.Commit()

	// seeding performance
	for _, c := range ListAllCampaigns(db) {
		seedingPerformances(db, c)
	}
}

func initAffiliations(db *sql.DB) {
	tags := ListAllTags(db)
	campaigns := ListAllCampaigns(db)
	seedingAffiliations(db, tags, campaigns)

}

func initAdmin(db *sql.DB) {
	seedingAdmin(db)
}

var periodFrom = time.Date(2018, 1, 0, 0, 0, 0, 0, time.Local)
var periodTill = time.Date(2019, 1, 0, 0, 0, 0, 0, time.Local)
var periodDelta = periodTill.Unix() - periodFrom.Unix()

/* seeding */
func seedingTags() []Tag {
	return []Tag{
		Tag{Class: "category", Name: "Software"},
		Tag{Class: "category", Name: "Platform"},
		Tag{Class: "category", Name: "Logistics"},
		Tag{Class: "category", Name: "Transit"},
		Tag{Class: "category", Name: "Goverments"},
		Tag{Class: "category", Name: "Banking/Finance"},
		Tag{Class: "category", Name: "Electronics"},
		Tag{Class: "category", Name: "Manufacture"},

		Tag{Class: "goal", Name: "recognition"},
		Tag{Class: "goal", Name: "impression"},
		Tag{Class: "goal", Name: "subscribtion"},
		Tag{Class: "goal", Name: "viral"},
		Tag{Class: "goal", Name: "reach"},
		Tag{Class: "goal", Name: "traffic"},
		Tag{Class: "goal", Name: "purchase"},
		Tag{Class: "goal", Name: "install"},
		Tag{Class: "goal", Name: "engage"},

		Tag{Class: "channel", Name: "google"},
		Tag{Class: "channel", Name: "youtube"},
		Tag{Class: "channel", Name: "facebook"},
		Tag{Class: "channel", Name: "instagram"},
		Tag{Class: "channel", Name: "instagram"},
		Tag{Class: "channel", Name: "naver"},
		Tag{Class: "channel", Name: "nate"},
		Tag{Class: "channel", Name: "kakao"},
		Tag{Class: "channel", Name: "SMR"},
		Tag{Class: "channel", Name: "S2"},

		Tag{Class: "media", Name: "PC Banner"},
		Tag{Class: "media", Name: "MO banner"},
		Tag{Class: "media", Name: "Offline Banner"},
		Tag{Class: "media", Name: "Offline Screen"},
		Tag{Class: "media", Name: "Brand Search"},
		Tag{Class: "media", Name: "Keyword Search"},
		Tag{Class: "media", Name: "Influencer"},
		Tag{Class: "media", Name: "Radio Commercial"},
		Tag{Class: "media", Name: "TV Commercial"},

		Tag{Class: "keytopic", Name: "premium"},
		Tag{Class: "keytopic", Name: "local"},
		Tag{Class: "keytopic", Name: "special price"},
		Tag{Class: "keytopic", Name: "special discount"},
		Tag{Class: "keytopic", Name: "urgent sale"},

		Tag{Class: "trigger", Name: "urgent"},
		Tag{Class: "trigger", Name: "direct benefit"},
		Tag{Class: "trigger", Name: "seasonality"},
		Tag{Class: "trigger", Name: "rationale"},
		Tag{Class: "trigger", Name: "immotional"},
		Tag{Class: "trigger", Name: "kitsch"},
		Tag{Class: "trigger", Name: "curiosity"},

		Tag{Class: "stance", Name: "attractive"},
		Tag{Class: "stance", Name: "questionare"},
		Tag{Class: "stance", Name: "suggesitive"},
		Tag{Class: "stance", Name: "persuasive"},

		Tag{Class: "caption", Name: "top left"},
		Tag{Class: "caption", Name: "top center"},
		Tag{Class: "caption", Name: "top right"},
		Tag{Class: "caption", Name: "mid left"},
		Tag{Class: "caption", Name: "center"},
		Tag{Class: "caption", Name: "mid right"},
		Tag{Class: "caption", Name: "low left"},
		Tag{Class: "caption", Name: "low center"},
		Tag{Class: "caption", Name: "low right"},

		Tag{Class: "visual_style", Name: "illustration"},
		Tag{Class: "visual_style", Name: "cartoon"},
		Tag{Class: "visual_style", Name: "picture"},
		Tag{Class: "visual_style", Name: "typography"},
		Tag{Class: "visual_style", Name: "animation"},
		Tag{Class: "visual_style", Name: "movie"},
		Tag{Class: "visual_style", Name: "slide"},
	}
}

func seedingCampaigns() []Campaign {
	rets := []Campaign{}
	memo := `test dummy`

	for i := 0; i < 100; i++ {
		pf := time.Unix(periodFrom.Unix()+rand.Int63n(periodDelta), 0)
		pt := time.Unix(pf.Unix()+rand.Int63n(periodDelta), 0)
		rets = append(rets, Campaign{
			Title:      fmt.Sprintf("SAMPLE%02d", i),
			Memo:       memo,
			PeriodFrom: pf,
			PeriodTill: pt,
			CreatedAt:  pf,
		})
	}

	return rets
}

func seedingPerformances(db *sql.DB, c Campaign) {
	day := c.PeriodFrom
	crand := rand.Intn(6)
	cbase := int(math.Round(math.Pow(float64(10), float64(crand+2)) / 2))
	tx, _ := db.Begin()
	stmt, _ := tx.Prepare(`INSERT INTO campaign_performances (day_id, campaign_id, impression, click, conversion, cost, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`)

	for day.Before(c.PeriodTill) {
		// var cf CampaignPerformance
		dayid := day
		impression := uint(cbase + rand.Intn(cbase))
		clicks := uint(math.Round(float64(impression) * (rand.Float64() + 0.1) * 0.1))
		conversion := uint(math.Round(float64(impression) * (rand.Float64() + 0.1) * 0.1))
		cost := uint(math.Round(float64(impression) * (rand.Float64() + 0.5) * 0.5))
		stmt.Exec(dayid, c.ID, impression, clicks, conversion, cost)

		day = day.Add(time.Hour * 24)
	}

	tx.Commit()
}

func seedingAffiliations(db *sql.DB, tags map[uint]Tag, camps map[uint]Campaign) {
	// categorizing tags
	tagmaps := map[string][]uint{}
	for _, t := range tags {
		if _, ok := tagmaps[t.Class]; ok {
			tagmaps[t.Class] = append(tagmaps[t.Class], t.ID)
		} else {
			tagmaps[t.Class] = []uint{t.ID}
		}
	}

	// campaign affiliations
	for _, c := range camps {
		tx, _ := db.Begin()
		stmt, _ := tx.Prepare(`INSERT into tag_affiliations (campaign_id, tag_id) VALUES (?, ?)`)
		for _, tmap := range tagmaps {
			affiliatedTID := rand.Intn(len(tmap))
			stmt.Exec(c.ID, affiliatedTID)
		}
		tx.Commit()
	}
}

func seedingAdmin(db *sql.DB) {
	// create user first
	admin := User{
		GUID:      `ADMIN`,
		CanAdmin:  true,
		CanManage: true,
	}
	admin.Insert(db)

	campaigns := ListAllCampaigns(db)

	tx, _ := db.Begin()
	tx.Prepare(`INSERT INTO campaign_grants (scope, user_id, campaign_id, created_at) VALUES ('own', ?, ?, NOW())`)
	aid := fmt.Sprintf("%d", admin.ID)

	for _, c := range campaigns {
		_, err := tx.Exec(aid, fmt.Sprintf("%d", c.ID))
		if err != nil {
			fmt.Errorf("grant err: %s", err.Error())
			break
		}
	}
	tx.Commit()
}

func runMigrations(db *sql.DB, ms string) {
	for _, mt := range strings.Split(ms, `;`) {
		if len(mt) <= 0 {
			continue
		}
		stmt, _ := db.Prepare(mt)
		_, mErr := stmt.Exec()

		if mErr != nil {
			fmt.Errorf("migrations err: %s", mErr.Error())
			panic(mErr)
		}
		stmt.Close()
	}
}

const migrationDown = `
DROP TABLE IF EXISTS tag_affiliations;
DROP TABLE IF EXISTS campaign_performances;
DROP TABLE IF EXISTS campaign_grants;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS campaigns;
DROP TABLE IF EXISTS tags;`

const migrations = `
-- -----------------------------------------------------
-- Table users
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  gid VARCHAR(45) NOT NULL,
  access JSON NULL,
  profile JSON NULL,
  can_admin TINYINT NOT NULL DEFAULT 0,
  can_input TINYINT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  deleted_at TIMESTAMP NULL,
  blocked_at TIMESTAMP NULL,
  PRIMARY KEY (id))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table campaigns
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS campaigns (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(200) NULL,
  memo TEXT NULL,
  period_from TIMESTAMP NOT NULL,
  period_till TIMESTAMP NULL,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  deleted_at TIMESTAMP NULL,
  created_by INT UNSIGNED NULL,
  updated_by INT UNSIGNED NULL,
  deleted_by INT UNSIGNED NULL,
  PRIMARY KEY (id))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table campaign_grants
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS campaign_grants (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  scope ENUM('own', 'manage', 'view') NOT NULL,
  user_id INT UNSIGNED NOT NULL,
  campaign_id INT UNSIGNED NOT NULL,
  created_at TIMESTAMP NULL,
  PRIMARY KEY (id),
  INDEX fk_campaign_grant_user_idx (user_id ASC) VISIBLE,
  INDEX fk_campaign_grant_campaign_idx (campaign_id ASC) VISIBLE,
  UNIQUE INDEX unique_campaign_grant (campaign_id ASC, user_id ASC, scope ASC) VISIBLE,
  CONSTRAINT fk_campaign_grant_user
    FOREIGN KEY (user_id)
    REFERENCES users (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT fk_campaign_grant_campaign
    FOREIGN KEY (campaign_id)
    REFERENCES campaigns (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table tags
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS tags (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  class VARCHAR(20) NOT NULL,
  name VARCHAR(20) NOT NULL,
  priority INT UNSIGNED NOT NULL DEFAULT 1,
  i18n JSON NULL,
  PRIMARY KEY (id),
  INDEX idx_tag_class (class ASC, name ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table campaign_performances
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS campaign_performances (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  day_id DATE NOT NULL,
  campaign_id INT UNSIGNED NOT NULL,
  impression BIGINT UNSIGNED NULL,
  click BIGINT UNSIGNED NULL,
  conversion BIGINT UNSIGNED NULL,
  cost BIGINT UNSIGNED NULL,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  created_by INT UNSIGNED NULL,
  updated_by INT UNSIGNED NULL,
  INDEX fk_campaign_performance_idx (campaign_id ASC) INVISIBLE,
  PRIMARY KEY (id),
  INDEX idx_daily_performance (day_id ASC) VISIBLE,
  INDEX idx_campaign_performance (campaign_id ASC) VISIBLE,
  CONSTRAINT fk_campaign_performance
    FOREIGN KEY (campaign_id)
    REFERENCES campaigns (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table tag_affiliations
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS tag_affiliations (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  campaign_id INT UNSIGNED NOT NULL,
  tag_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (id),
  INDEX fk_campaign_meta_campaign_idx (campaign_id ASC) VISIBLE,
  INDEX fk_campaign_meta_attribute_idx (tag_id ASC) VISIBLE,
  CONSTRAINT fk_campaign_meta_campaign
    FOREIGN KEY (campaign_id)
    REFERENCES campaigns (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT fk_campaign_meta_tags
    FOREIGN KEY (tag_id)
    REFERENCES tags (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;`
