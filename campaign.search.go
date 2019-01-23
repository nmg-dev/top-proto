package main

import (
	"fmt"

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
	DatabaseContextServlet(ctx, postCampaignQueryProc)
}
func postCampaignQueryProc(ctx *gin.Context, db Preparable) (interface{}, error) {
	var cquery CampaignQuery
	ctx.BindJSON(&cquery)
	campaignIds := FindCampaignIdsWithin(db, cquery.PeriodFrom, cquery.PeriodTill, cquery.CampaignIds)

	resp := CampaignResp{
		Cmps: FindCampaignsIn(db, campaignIds),
		Recs: FindCampaignRecordsIn(db, cquery.PeriodFrom, cquery.PeriodTill, campaignIds),
		Affs: FindAffilationsWithCampaignIDs(db, campaignIds),
	}
	return resp, nil
}

// PostCampaignCreate
func PostCampaignCreate(ctx *gin.Context) {
	TransactContextServlet(ctx, postCampaignCreateProc)
}

func postCampaignCreateProc(ctx *gin.Context, tx Preparable) (interface{}, error) {
	cs := make([]Campaign, 0)
	ctx.BindJSON(&cs)

	cids := make([]Campaign, 0)

	for _, campaign := range cs {
		err := campaign.Insert(tx)
		if err != nil {
			return nil, err
		}
		cids = append(cids, campaign)
	}
	return cids, nil
}

// PostCampaignUpdate
func PostCampaignUpdate(ctx *gin.Context) {
	TransactContextServlet(ctx, postCampaignUpdateProc)
}
func postCampaignUpdateProc(ctx *gin.Context, tx Preparable) (interface{}, error) {
	cs := make(map[uint]Campaign)
	ctx.BindJSON(&cs)

	cids := make([]uint, 0)
	for cid, campaign := range cs {
		qerr := campaign.Update(tx)
		if qerr != nil {
			return nil, qerr
		}
		cids = append(cids, cid)
	}
	return cids, nil
}

// PostCampaignDelete - delete campaigns
func PostCampaignDelete(ctx *gin.Context) {
	TransactContextServlet(ctx, postCampaignDeleteProc)
}

func postCampaignDeleteProc(ctx *gin.Context, tx Preparable) (interface{}, error) {
	cs := make(map[uint]Campaign)
	ctx.BindJSON(&cs)

	rs := make([]Campaign, 0)
	for _, campaign := range cs {
		qerr := campaign.Delete(tx)
		if qerr != nil {
			return nil, qerr
		}
		rs = append(rs, campaign)
	}
	return rs, nil
}

// PostPerformanceCreate - create campaign records
func PostPerformanceCreate(ctx *gin.Context) {
	TransactContextServlet(ctx, postPerformanceCreateProc)
}
func postPerformanceCreateProc(ctx *gin.Context, tx Preparable) (interface{}, error) {
	ps := make([]CampaignPerformance, 0)
	ctx.BindJSON(&ps)

	rs := make([]CampaignPerformance, 0)
	for _, performance := range ps {
		qerr := performance.Insert(tx)
		if qerr != nil {
			return performance, qerr
		}
		rs = append(rs, performance)
	}
	return rs, nil

}

// PostPerformanceUpdate - update campaign records
func PostPerformanceUpdate(ctx *gin.Context) {
	TransactContextServlet(ctx, postPerformanceUpdateProc)
}
func postPerformanceUpdateProc(ctx *gin.Context, tx Preparable) (interface{}, error) {
	ps := make([]CampaignPerformance, 0)
	rs := make([]CampaignPerformance, 0)

	ctx.BindJSON(&ps)
	for _, performance := range ps {
		err := performance.Update(tx)
		if err != nil {
			return performance, err
		}
		rs = append(rs, performance)
	}
	return rs, nil
}

// PostPerformanceDelete - delete campaign records
func PostPerformanceDelete(ctx *gin.Context) {
	TransactContextServlet(ctx, postPerformanceDeleteProc)
}
func postPerformanceDeleteProc(ctx *gin.Context, tx Preparable) (interface{}, error) {
	ps := make([]CampaignPerformance, 0)
	rs := make([]CampaignPerformance, 0)

	ctx.BindJSON(&ps)
	for _, performance := range ps {
		err := performance.Delete(tx)
		if err != nil {
			return performance, err
		}
		rs = append(rs, performance)
	}
	return rs, nil
}

// FindCampaignsWithin - search by period
func FindCampaignIdsWithin(db Preparable, periodFrom time.Time, periodTill time.Time, cids []uint) []uint {
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
func FindCampaignIdsBy(db Preparable, tids []uint, cids []uint) []uint {
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
func FindCampaignsIn(db Preparable, ids []uint) map[uint]Campaign {
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
func FindCampaignRecordsIn(db Preparable, periodFrom time.Time, periodTill time.Time, ids []uint) []CampaignPerformance {
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
func ListAllCampaigns(db Preparable) map[uint]Campaign {
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
