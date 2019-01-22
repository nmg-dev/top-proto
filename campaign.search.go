package main

import (
	"database/sql"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	// "database/sql"

	"time"
)

// CampaignQuery
type CampaignQuery struct {
	CampaignIds []uint    `json:"campaign_ids"`
	PeriodFrom  time.Time `json:"from"`
	PeriodTill  time.Time `json:"till"`
	Tags        []uint    `json:"tags"`
}

// CampaignResp
type CampaignResp struct {
	Cmps map[uint]Campaign     `json:"campaigns"`
	Recs []CampaignPerformance `json:"records"`
	Affs []TagAffiliation      `json:"affiliations"`
}

const KeyCampaignQuery = `__cq__`

// PostCampaignQuery
func PostCampaignQuery(ctx *gin.Context) {
	db := getDatabase(ctx)
	defer db.Close()
	var cquery CampaignQuery
	ctx.BindJSON(&cquery)
	campaignIds := FindCampaignIdsWithin(db, cquery.PeriodFrom, cquery.PeriodTill, cquery.CampaignIds)

	resp := CampaignResp{
		Cmps: FindCampaignsIn(db, campaignIds),
		Recs: FindCampaignRecordsIn(db, cquery.PeriodFrom, cquery.PeriodTill, campaignIds),
		Affs: FindAffilationsWithCampaignIDs(db, campaignIds),
	}

	ctx.JSON(http.StatusOK, resp)
}

// FindCampaignsWithin - search by period
func FindCampaignIdsWithin(db *sql.DB, periodFrom time.Time, periodTill time.Time, cids []uint) []uint {
	query := fmt.Sprintf(`SELECT id FROM campaigns WHERE ? < period_till AND ? > period_from`)
	if 0 < len(cids) {
		query += fmt.Sprintf(` AND id IN (%s) `, WhereInJoin(cids))
	}

	stmt, _ := db.Prepare(query)
	rs, _ := stmt.Query(periodFrom, periodTill)
	defer stmt.Close()

	rets := []uint{}
	for rs.Next() {
		var cid uint
		rs.Scan(&cid)
		rets = append(rets, cid)
	}

	return rets
}

// FindCampaignIdsBy - search by tag ids affiliation
func FindCampaignIdsBy(db *sql.DB, tids []uint, cids []uint) []uint {
	query := fmt.Sprintf(`SELECT campaign_ids FROM tag_affiliations WHERE attr_id IN (%s) AND campaign_ids IN (%s)`, WhereInJoin(tids), WhereInJoin(cids))
	stmt, _ := db.Prepare(query)
	rs, _ := stmt.Query()
	defer stmt.Close()

	rets := []uint{}
	for rs.Next() {
		var cid uint
		rs.Scan(&cid)
		rets = append(rets, cid)
	}

	return rets
}

// FindCampaignsIn - search with campaign ids
func FindCampaignsIn(db *sql.DB, ids []uint) map[uint]Campaign {
	cmps := make(map[uint]Campaign)
	var query string

	if len(ids) <= 0 {
		return map[uint]Campaign{}
	} else if len(ids) <= 1 {
		query = `SELECT * FROM campaigns WHERE id=?`
	} else {
		query = `SELECT * FROM campaigns WHERE id IN (%s)`
		query = fmt.Sprintf(query, WhereInJoin(ids))
	}

	stmt, _ := db.Prepare(query)
	rs, _ := stmt.Query()
	defer stmt.Close()

	for rs.Next() {
		var cmp Campaign
		cmp.Bind(rs)
		if 0 < cmp.ID {
			cmps[cmp.ID] = cmp
		}
	}

	return cmps
}

// FindCampaignPerformances
func FindCampaignRecordsIn(db *sql.DB, periodFrom time.Time, periodTill time.Time, ids []uint) []CampaignPerformance {
	query := fmt.Sprintf(`SELECT * FROM campaign_performances WHERE ?<=day_id AND day_id<=? AND campaign_id IN (%s) ORDER BY campaign_id, day_id`, WhereInJoin(ids))
	stmt, _ := db.Prepare(query)
	rs, _ := stmt.Query(periodFrom, periodTill)
	defer stmt.Close()

	rets := []CampaignPerformance{}

	for rs.Next() {
		var cp CampaignPerformance
		cp.Bind(rs)

		rets = append(rets, cp)

	}

	return rets
}

// ListAllCampaigns - for debug: list all campaign
func ListAllCampaigns(db *sql.DB) map[uint]Campaign {
	cs := make(map[uint]Campaign)
	stmt, _ := db.Prepare(`SELECT * FROM campaigns`)
	rs, _ := stmt.Query()
	defer stmt.Close()

	for rs.Next() {
		var c Campaign
		c.Bind(rs)
		if 0 < c.ID {
			cs[c.ID] = c
		}
	}

	return cs
}
