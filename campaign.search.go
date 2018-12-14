package main

import (
	"database/sql"
	"net/http"
	"time"

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
func PostSearch(ctx *gin.Context) {
	// period first
	var q CampaignQuery
	ctx.Bind(&q)

	db := getDatabase(ctx)
	cids, aids := searchQuery(db, q)

	// map attributions to put
	var resp = CampaignResp{
		Cmps: FindCampaignsIn(db, cids),
		Atts: FindAttributesIn(db, aids),
		Maps: FindAffiliationsIn(db, cids, aids),
		Recs: FindPerformancesIn(db, cids, q.PeriodFrom, q.PeriodTill),
	}

	ctx.JSON(http.StatusOK, resp)
}

func searchQuery(db *sql.DB, q CampaignQuery) ([]uint, []uint) {
	var cids, aids []uint

	if 0 < len(q.Attributions) {
		// with given aids
		aids = make([]uint, len(q.Attributions))
		for i, a := range q.Attributions {
			aids[i] = a.ID
		}

		// retrieve campaign ids by period and aid

	} else {
		// retrieve campaign ids by period
		cids = ListCIDsFromPeriod(db, q.PeriodFrom, q.PeriodTill)

		// retrive attribute ids by campaign_ids
		aids = ListAttrsFromCampaignIds(db, cids)

	}

	return cids, aids

}
