package main

import (
	"database/sql"
	"fmt"
	"math/rand"
	"time"
)

func main() {
	db, _ := initConnection()

	// initialize campaigns

}

func initTags(db *sql.DB) {
	// initialize tags
	tx, _ := db.Begin()
	tstmt, _ := tx.Prepare(`INSERT INTO tags (class, name) VALUES (?, ?)`)
	for _, t := range seedingTags(db) {
		tstmt.Exec(t.Class, t.Name)
	}
	tx.Commit()
}

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

var periodFrom = time.Date(2018, 1, 0, 0, 0, 0, 0, time.Local)
var periodTill = time.Date(2019, 1, 0, 0, 0, 0, 0, time.Local)
var periodDelta = periodTill.Unix() - periodFrom.Unix()

func seedingCampaigns() []Campaign {
	rets := []Campaign{}
	memo := `test dummy`

	for i := 0; i < 100; i++ {
		pf := time.Unix(periodFrom.Unix()+rand.Int63n(periodDelta/10), 0)
		pt := time.Unix(pf.Unix()+rand.Int63n(periodDelta/10), 0)
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

func seedingAffiliations([]uint tids, []uint cids) []TagMeta {
	// TODO:
}
