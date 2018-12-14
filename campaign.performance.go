package main

import (
	"database/sql"
	"fmt"
	"time"
)

// CampaignPerformance
type CampaignPerformance struct {
	ID         uint64    `json:"id" db:"id"`
	DayID      time.Time `json:"day_id" db:"day_id"`
	CampaignID uint      `db:"campaign_id"`

	Impression uint `json:"impression" db:"impression"`
	Click      uint `json:"click" db:"click"`
	Conversion uint `json:"conversion" db:"conversion"`
	Cost       uint `json:"cost" db:"cost"`

	CreatedAt time.Time `json:"created_at" db:"created_at"`
	CreatedBy uint      `json:"created_by" db:"created_by"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
	UpdatedBy uint      `json:"updated_by" db:"updated_by"`
}

const performanceInsertStmt = `INSERT INTO campaign_performances (day_id, campaign_id, impression, click, conversion, cost, created_at, updated_at, created_by, updated_by) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW(), ?, ?)`
const performanceUpdateStmt = `UPDATE campaign_performances impression=?, click=?, conversion=?, cost=?, updated_at=NOW(), updated_by=? WHERE id=?`
const performanceDeleteStmt = `DELETE campaign_performances WHERE id=?`
const performancePeriods = `SELECT * FROM campaign_performances WHERE ? <= day_id AND day_id < ?`

func (p *CampaignPerformance) insertStmt(db *sql.DB) *sql.Stmt {
	return QueriableState(db, performanceInsertStmt)
}

func (p *CampaignPerformance) insertExec(stmt *sql.Stmt) (sql.Result, error) {
	return stmt.Exec(p.DayID, p.CampaignID, p.Impression, p.Click, p.Conversion, p.Cost, p.CreatedBy, p.CreatedBy)
}

func (p CampaignPerformance) updateStmt(db *sql.DB) *sql.Stmt {
	return QueriableState(db, performanceUpdateStmt)
}

func (p CampaignPerformance) updateExec(stmt *sql.Stmt) (sql.Result, error) {
	return stmt.Exec(p.Impression, p.Click, p.Conversion, p.Cost, p.UpdatedBy, p.ID)
}

func (p CampaignPerformance) deleteStmt(db *sql.DB) *sql.Stmt {
	return QueriableState(db, performanceDeleteStmt)
}

func (p CampaignPerformance) deleteExec(stmt *sql.Stmt) (sql.Result, error) {
	return stmt.Exec(p.ID)
}

// Insert
func (p *CampaignPerformance) Insert(db *sql.DB) error {
	if p.ID <= 0 {
		lastID, err := ExecuteQueriableInsert(p, db, p.insertStmt, p.insertExec)
		if err != nil {
			return err
		}
		p.ID = uint64(lastID)
	}
	return nil
}

// Update
func (p CampaignPerformance) Update(db *sql.DB) error {
	if 0 < p.ID {
		return ExecuteQueriableUpdate(p, db, p.updateStmt, p.updateExec)
	} else {
		return p.Insert(db)
	}
}

// Delete
func (p CampaignPerformance) Delete(db *sql.DB) error {
	if 0 < p.ID {
		return ExecuteQueriableUpdate(p, db, p.deleteStmt, p.deleteExec)
	}
	return nil
}

// Bind
func (p *CampaignPerformance) Bind(r Scannable) error {
	return r.Scan(
		&p.ID,
		&p.DayID,
		&p.CampaignID,
		&p.Impression,
		&p.Click,
		&p.Conversion,
		&p.Cost,
		&p.CreatedAt,
		&p.UpdatedAt,
		&p.CreatedBy,
		&p.UpdatedBy,
	)
}

// ListCIDsFromPeriod -
func ListCIDsFromPeriod(db *sql.DB, from time.Time, till time.Time) []uint {
	stmt, _ := db.Prepare(`SELECT campaign_id, count(*) as cnt FROM campaign_performances WHERE ? < day_id AND day_id <= ? GROUP BY campaign_id ORDER BY cnt`)
	rs, _ := stmt.Query(from, till)
	var cids []uint
	var cid, cnt uint
	for rs.Next() {
		rs.Scan(&cid, &cnt)
		cids = append(cids, cid)
	}

	return cids
}

func FindPerformancesIn(db *sql.DB, cids []uint, from time.Time, till time.Time) map[uint][]CampaignPerformance {
	recs := make(map[uint][]CampaignPerformance)

	query := `SELECT * FROM campaign_performances WHERE campaign_id IN (%s) AND ? < day_id AND day_id <= ? ORDER BY day_id`
	stmt, _ := db.Prepare(fmt.Sprintf(query, WhereInJoin(cids)))
	rs, _ := stmt.Query(from, till)
	defer stmt.Close()

	for rs.Next() {
		var p CampaignPerformance
		p.Bind(rs)

		if 0 < p.ID {
			if _, ok := recs[p.CampaignID]; !ok {
				recs[p.CampaignID] = []CampaignPerformance{p}
			} else {
				recs[p.CampaignID] = append(recs[p.CampaignID], p)
			}
		}
	}

	return recs
}
