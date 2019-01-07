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
	stmt, _ := tx.Prepare(`INSERT INTO campaigns (title, memo, asset, period_from, period_till, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())`)
	for _, c := range campaigns {
		stmt.Exec(c.Title, c.Memo, c.Asset, c.PeriodFrom, c.PeriodTill)
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
		Tag{Class: "category", Name: "homeware", Property: DJsonMap{"ko": "가정용품", "en": "Homeware"}},
		Tag{Class: "category", Name: "living", Property: DJsonMap{"ko": "생활서비스", "en": "Living"}},
		Tag{Class: "category", Name: "industry", Property: DJsonMap{"ko": "산업", "en": "Industry"}},
		Tag{Class: "category", Name: "f&b", Property: DJsonMap{"ko": "식음료", "en": "Food & Beverages"}},
		Tag{Class: "category", Name: "healthcare", Property: DJsonMap{"ko": "보건/의료", "en": "Healthcare"}},
		Tag{Class: "category", Name: "cosmetics", Property: DJsonMap{"ko": "미용", "en": "Beautycare"}},
		Tag{Class: "category", Name: "publishing", Property: DJsonMap{"ko": "도서출판", "en": "Publishing"}},
		Tag{Class: "category", Name: "fashion", Property: DJsonMap{"ko": "패션/의류", "en": "Fashion"}},
		Tag{Class: "category", Name: "electronics", Property: DJsonMap{"ko": "전자제품", "en": "Electronics"}},
		Tag{Class: "category", Name: "communication", Property: DJsonMap{"ko": "통신", "en": "Communications"}},
		Tag{Class: "category", Name: "vehicles", Property: DJsonMap{"ko": "운송수단", "en": "Vehicles"}},
		Tag{Class: "category", Name: "realestate", Property: DJsonMap{"ko": "건설/부동산", "en": "Realestate"}},
		Tag{Class: "category", Name: "logistics", Property: DJsonMap{"ko": "유통", "en": "Logistics"}},
		Tag{Class: "category", Name: "finance", Property: DJsonMap{"ko": "금융", "en": "Finances"}},
		Tag{Class: "category", Name: "entertainment", Property: DJsonMap{"ko": "엔터테인먼트", "en": "Entertainments"}},
		Tag{Class: "category", Name: "games", Property: DJsonMap{"ko": "게임", "en": "Games"}},
		Tag{Class: "category", Name: "education", Property: DJsonMap{"ko": "교육", "en": "Education"}},

		Tag{Class: "channel", Name: "pc", Property: DJsonMap{"ko": "데스크톱", "en": "Desktop PC"}},
		Tag{Class: "channel", Name: "mobile", Property: DJsonMap{"ko": "모바일", "en": "Mobile"}},
		Tag{Class: "channel", Name: "tv", Property: DJsonMap{"ko": "TV", "en": "TV"}},
		Tag{Class: "channel", Name: "radio", Property: DJsonMap{"ko": "라디오", "en": "Radio"}},
		Tag{Class: "channel", Name: "physical", Property: DJsonMap{"ko": "오프라인", "en": "Physical"}},

		Tag{Class: "media", Name: "naver"},
		Tag{Class: "media", Name: "kakao"},
		Tag{Class: "media", Name: "google"},
		Tag{Class: "media", Name: "youtube"},
		Tag{Class: "media", Name: "facebook"},
		Tag{Class: "media", Name: "honeyscreen"},
		Tag{Class: "media", Name: "mobion"},
		Tag{Class: "media", Name: "realclick"},
		Tag{Class: "media", Name: "cauly"},
		Tag{Class: "media", Name: "mediunce"},
		Tag{Class: "media", Name: "diningcode"},
		Tag{Class: "media", Name: "smr"},

		Tag{Class: "goal", Name: "click", Property: DJsonMap{"ko": "링크 클릭", "en": "Link Click"}},
		Tag{Class: "goal", Name: "play", Property: DJsonMap{"ko": "영상 재생", "en": "Video View"}},
		Tag{Class: "goal", Name: "purchase", Property: DJsonMap{"ko": "구매전환", "en": "Purchase Conversion"}},
		Tag{Class: "goal", Name: "install", Property: DJsonMap{"ko": "앱 설치", "en": "App Install"}},
		Tag{Class: "goal", Name: "lead", Property: DJsonMap{"ko": "리드 수집", "en": "Lead collection"}},
		Tag{Class: "goal", Name: "branding", Property: DJsonMap{"ko": "브랜딩", "en": "Branding"}},

		Tag{Class: "conversion", Name: "click"},
		Tag{Class: "conversion", Name: "impression"},
		Tag{Class: "conversion", Name: "transaction"},
		Tag{Class: "conversion", Name: "install"},
		Tag{Class: "conversion", Name: "engage"},

		Tag{Class: "layout", Name: "left", Property: DJsonMap{"ko": "텍스트 좌측", "en": "Text left", "image": "layout_left.png"}},
		Tag{Class: "layout", Name: "right", Property: DJsonMap{"ko": "텍스트 우측", "en": "Text right", "image": "layout_right.png"}},
		Tag{Class: "layout", Name: "center", Property: DJsonMap{"ko": "텍스트 중앙", "en": "Text center", "image": "layout_center.png"}},
		Tag{Class: "layout", Name: "between", Property: DJsonMap{"ko": "텍스트 좌우", "en": "Text between", "image": "layout_between.png"}},

		Tag{Class: "background", Name: "blank", Property: DJsonMap{"ko": "공백", "en": "Blank", "image": "bg_blank.png"}},
		Tag{Class: "background", Name: "solid", Property: DJsonMap{"ko": "단색", "en": "Solid", "image": "bg_solid.png"}},
		Tag{Class: "background", Name: "split", Property: DJsonMap{"ko": "면분할", "en": "Split area", "image": "bg_split.png"}},
		Tag{Class: "background", Name: "image", Property: DJsonMap{"ko": "이미지", "en": "Image", "image": "bg_image.png"}},

		Tag{Class: "objet", Name: "picture", Property: DJsonMap{"ko": "실사", "en": "Picture", "image": "object_picture.png"}},
		Tag{Class: "objet", Name: "illust", Property: DJsonMap{"ko": "일러스트", "en": "Illust", "image": "object_illust.png"}},
		Tag{Class: "objet", Name: "model", Property: DJsonMap{"ko": "모델", "en": "Model", "image": "object_model.png"}},

		Tag{Class: "lead", Name: "time", Property: DJsonMap{"ko": "타임형", "en": "Time", "image": "lead_time.png"}},
		Tag{Class: "lead", Name: "benefit", Property: DJsonMap{"ko": "혜택형", "en": "Beneficial", "image": "lead_benefit.png"}},
		Tag{Class: "lead", Name: "persuade", Property: DJsonMap{"ko": "유도형", "en": "Persuasive", "image": "lead_persuade.png"}},

		Tag{Class: "issue", Name: "special offer"},
		Tag{Class: "issue", Name: "local"},
		Tag{Class: "issue", Name: "sales"},
		Tag{Class: "issue", Name: "premium"},

		Tag{Class: "trigger", Name: "seasonality"},
		Tag{Class: "trigger", Name: "discount"},
		Tag{Class: "trigger", Name: "beneficial"},
		Tag{Class: "trigger", Name: "credibility"},
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
			Asset:      fmt.Sprintf("/static/img/to.%02d.png", (i%26 + 1)),
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
			stmt.Exec(c.ID, tmap[affiliatedTID])
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
  asset TEXT NULL,
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
  INDEX fk_campaign_grant_user_idx (user_id ASC),
  INDEX fk_campaign_grant_campaign_idx (campaign_id ASC),
  UNIQUE INDEX unique_campaign_grant (campaign_id ASC, user_id ASC, scope ASC),
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
  property JSON NULL,
  PRIMARY KEY (id),
  INDEX idx_tag_class (class ASC, name ASC))
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
  INDEX fk_campaign_performance_idx (campaign_id ASC),
  PRIMARY KEY (id),
  INDEX idx_daily_performance (day_id ASC) ,
  INDEX idx_campaign_performance (campaign_id ASC) ,
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
  INDEX fk_campaign_meta_campaign_idx (campaign_id ASC) ,
  INDEX fk_campaign_meta_attribute_idx (tag_id ASC) ,
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
