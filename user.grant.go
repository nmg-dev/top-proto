package main

import (
	"database/sql"
	"fmt"
	"math"
	"time"
)

type Grant struct {
	ID         uint      `db:"id"`
	Scope      string    `db:"scope"`
	UserID     uint      `db:"user_id"`
	CampaignID uint      `db:"campaign_id"`
	CreatedAt  time.Time `db:"created_at"`
}

const grantInsertStmt = `INSERT INTO campaign_grants (scope, user_id, campaign_id, created_at) VALUES (?, ?, ?, NOW())`
const grantUpdateStmt = `UPDATE campaign_grants set scope=? WHERE id=?`
const grantDeleteStmt = `DELETE campaign_grants WHERE id=?`
const grantPageSize = 50
const grantSelectByUserStmt = `SELECT * FROM campaign_grants WHERE user_id=? AND id<? ORDER BY ID DESC`

func (g *Grant) insertStatement(db Preparable) *sql.Stmt {
	return QueriableState(db, grantInsertStmt)
}

func (g *Grant) insertExecution(stmt *sql.Stmt) (sql.Result, error) {
	return stmt.Exec(g.Scope, g.UserID, g.CampaignID)
}

// Insert - Queriable impl.
func (g *Grant) Insert(db Preparable) error {
	if g.ID <= 0 {
		lastId, err := ExecuteQueriableInsert(*g, db, g.insertStatement, g.insertExecution)
		g.ID = uint(lastId)
		return err
	} else {
		return nil
	}
}

// Update - Queriable impl.
func (g Grant) Update(db Preparable) error {
	stmt, _ := db.Prepare(grantUpdateStmt)
	_, err := stmt.Exec(g.Scope, g.ID)
	defer stmt.Close()
	return err
}

// Delete - Queriable impl.
func (g Grant) Delete(db Preparable) error {
	stmt, _ := db.Prepare(grantDeleteStmt)
	_, err := stmt.Exec(g.ID)
	defer stmt.Close()
	return err
}

// Bind - Queriable impl.
func (g *Grant) Bind(row Scannable) error {
	return row.Scan(
		&g.ID,
		&g.Scope,
		&g.UserID,
		&g.CampaignID,
		&g.CreatedAt,
	)
}

// GetCampaignIDs
func (u User) GetCampaignIDs(db *sql.DB, lastID uint) []uint {
	if lastID <= 0 {
		lastID = math.MaxUint32
	}
	stmt, _ := db.Prepare(fmt.Sprintf("%s LIMIT %d", grantSelectByUserStmt, grantPageSize))
	rs, _ := stmt.Query(u.ID, lastID)

	var grant Grant
	var campaignIds [grantPageSize]uint
	counts := 0

	for rs.Next() {
		grant.Bind(rs)
		campaignIds[counts] = grant.CampaignID
		counts += 1
	}

	return campaignIds[:counts]
}
