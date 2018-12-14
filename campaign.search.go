package main

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type CampaignQuery struct {
	PeriodFrom   time.Time     `json:"from"`
	PeriodTill   time.Time     `json:"till"`
	Attributions []Attribution `json:"attrs"`
}

// CampaignResp
type CampaignResp struct {
	Cmps map[uint]Campaign              `json:"campaigns"`
	Atts map[uint]Campaign              `json:"attributions"`
	Meta map[uint][]uint                `json:"map"` // Meta[11] = [2, 3, 4] campaign(11) holds attribution(2), (3), (4)
	Recs map[uint][]CampaignPerformance `json:"records"`
}

// PostSearch - search response for the query
func PostSearch(ctx *gin.Context) {
	// period first
	var query CampaignQuery
	ctx.Bind(&query)

	// search campaign ids from the period
	campaignIds := searchQuery(query.PeriodFrom, query.PeriodTill)
	if len(campaignIds) <= 0 {
		ctx.AbortWithStatusJSON(http.StatusNotFound, gin.H{
			"e": "any results between the period",
		})
		return
	}

	// list attributions
	attributeIds := 


	// filter out attributions
}

func searchQuery(from time.Time, till time.Time) []uint {
	var cids, aids []uint
	cids = ListCIDsFromPeriod(from, till)


	return resp

}
