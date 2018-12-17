package main

import (
	// "database/sql"

	"net/http"
	"time"

	"math/rand"

	"github.com/gin-gonic/gin"
)

// CampaignQuery
type CampaignQuery struct {
	PeriodFrom   time.Time     `json:"from"`
	PeriodTill   time.Time     `json:"till"`
	Attributions []Attribution `json:"attrs"`
}

// CampaignResp
type CampaignResp struct {
	Cmps map[uint]Campaign              `json:"campaigns"`
	Atts map[uint]Attribution           `json:"attributions"`
	Maps map[uint][]uint                `json:"map"` // Meta[11] = [2, 3, 4] campaign(11) holds attribution(2), (3), (4)
	Recs map[uint][]CampaignPerformance `json:"records"`
}

// PostSearch - search response for the query
// func PostSearch(ctx *gin.Context) {
// period first
// var q CampaignQuery
// ctx.Bind(&q)

// db := getDatabase(ctx)
// cids, aids := searchQuery(db, q)

// // map attributions to put
// var resp = CampaignResp{
// 	Cmps: FindCampaignsIn(db, cids),
// 	Atts: FindAttributesIn(db, aids),
// 	Maps: FindAffiliationsIn(db, cids, aids),
// 	Recs: FindPerformancesIn(db, cids, q.PeriodFrom, q.PeriodTill),
// }

// ctx.JSON(http.StatusOK, PostSample(ctx))
// }

func PostSample(ctx *gin.Context) {
	var resp = CampaignResp{
		Cmps: map[uint]Campaign{
			1: Campaign{
				ID:        1,
				OwnerID:   1,
				Title:     `TEST1`,
				Memo:      `Default`,
				CreatedAt: time.Now(),
				UpdatedAt: time.Now(),
				CreatedBy: 1,
				UpdatedBy: 1,
			},
			2: Campaign{
				ID:        2,
				OwnerID:   1,
				Title:     `TEST2`,
				Memo:      `Sample`,
				CreatedAt: time.Now(),
				CreatedBy: 1,
			},
		},
		Atts: map[uint]Attribution{
			1: Attribution{
				ID:        1,
				Class:     `account`,
				Label:     `NMG01`,
				Name:      `NMG`,
				Props:     map[string]interface{}{`type`: `internal`},
				Priority:  1,
				CreatedAt: time.Now(),
				CreatedBy: 1,
			},
			2: Attribution{
				ID:        2,
				Class:     `agency`,
				Label:     `AdQUA`,
				Name:      `AdQUA`,
				Props:     map[string]interface{}{`type`: `group`},
				Priority:  1,
				CreatedAt: time.Now(),
				CreatedBy: 1,
			},
		},
		Maps: map[uint][]uint{
			1: []uint{1, 2},
			2: []uint{2},
		},
	}
	// random performances
	resp.Recs = make(map[uint][]CampaignPerformance)
	for i, _ := range resp.Cmps {
		var performs = make([]CampaignPerformance, 7)
		cid := i + 1
		for d := 6; 0 < d; d-- {
			date := time.Now().AddDate(0, 0, -d)
			performs[d] = CampaignPerformance{
				ID:         uint64(i*uint(7) + uint(d)),
				DayID:      date,
				CampaignID: cid,
				Impression: uint(rand.Intn(4000) + 1000),
				Click:      uint(rand.Intn(1000) + 200),
				Conversion: uint(rand.Intn(100) + 50),
				Cost:       uint(rand.Intn(10000000) + 5000000),
				CreatedAt:  date,
				CreatedBy:  1,
			}
			resp.Recs[cid] = performs
		}
	}

	ctx.JSON(http.StatusOK, resp)

	// return resp
}

// func searchQuery(db *sql.DB, q CampaignQuery) ([]uint, []uint) {
// 	var cids, aids []uint

// 	if 0 < len(q.Attributions) {
// 		// with given aids
// 		aids = make([]uint, len(q.Attributions))
// 		for i, a := range q.Attributions {
// 			aids[i] = a.ID
// 		}

// 		// retrieve campaign ids by period and aid

// 	} else {
// 		// retrieve campaign ids by period
// 		cids = ListCIDsFromPeriod(db, q.PeriodFrom, q.PeriodTill)

// 		// retrive attribute ids by campaign_ids
// 		aids = ListAttrsFromCampaignIds(db, cids)

// 	}

// 	return cids, aids

// }
