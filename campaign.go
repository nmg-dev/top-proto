package main

import (
	"database/sql"
	"errors"
	"time"
)

// Campaign - campaign data
type Campaign struct {
	ID    uint   `json:"id" db:"id"`
	Title string `json:"title" db:"title"`
	Memo  string `json:"memo" db:"memo"`
	Asset string `json:"asset" db:"asset"`

	PeriodFrom time.Time `json:"from" db:"period_from"`
	PeriodTill time.Time `json:"till" db:"period_till"`

	CreatedAt time.Time `json:"created_at" db:"created_at"`
	CreatedBy uint      `json:"created_by" db:"created_by"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
	UpdatedBy uint      `json:"updated_by" db:"updated_by"`
	DeletedAt time.Time `json:"deleted_at" db:"deleted_at"`
	DeletedBy uint      `json:"deleted_by" db:"deleted_by"`
}

const campaignInsertStmt = `INSERT INTO campaigns (title, memo, asset, period_from, period_till, created_at, created_by, updated_at, updated_by) VALUES (?, ?, ?, ?, ?, NOW(), ?, NOW(), ?)`
const campaignUpdateStmt = `UPDATE campaigns SET title=?, memo=?, asset=?, period_from=?, period_till, updated_at=NOW(), updated_by=? WHERE id=?`
const campaignDeleteStmt = `UPDATE campaigns SET deleted_at=NOW(), deleted_by=? WHERE id=?`
const campaignFindStmt = `SELECT * FROM campaigns WHERE id=?`

func (c *Campaign) insertStatement(db Preparable) *sql.Stmt {
	return QueriableState(db, campaignInsertStmt)
}

func (c *Campaign) insertExecution(stmt *sql.Stmt) (sql.Result, error) {
	return stmt.Exec(c.Title, c.Memo, c.Asset, c.PeriodFrom, c.PeriodTill, c.CreatedBy, c.CreatedBy)
}

func (c Campaign) updateStatement(db Preparable) *sql.Stmt {
	return QueriableState(db, campaignUpdateStmt)
}

func (c Campaign) updateExecution(stmt *sql.Stmt) (sql.Result, error) {
	return stmt.Exec(
		c.Title,
		c.Memo,
		c.Asset,
		c.PeriodFrom,
		c.PeriodTill,
		c.UpdatedBy,
		c.ID,
	)
}

func (c Campaign) deleteStatement(db Preparable) *sql.Stmt {
	return QueriableState(db, campaignDeleteStmt)
}

func (c Campaign) deleteExecution(stmt *sql.Stmt) (sql.Result, error) {
	return stmt.Exec(c.ID)
}

// Insert -
func (c *Campaign) Insert(db Preparable) error {
	if c.ID <= 0 {
		lastID, err := ExecuteQueriableInsert(c, db, c.insertStatement, c.insertExecution)
		c.ID = uint(lastID)

		return err
	}
	return nil
}

// Update -
func (c Campaign) Update(db Preparable) error {
	if 0 < c.ID {
		return ExecuteQueriableUpdate(c, db, c.updateStatement, c.updateExecution)
	} else {
		return c.Insert(db)
	}

}

// Delete -
func (c Campaign) Delete(db Preparable) error {
	if 0 < c.ID {
		return ExecuteQueriableUpdate(c, db, c.deleteStatement, c.deleteExecution)
	}
	return nil
}

// Bind
func (c *Campaign) Bind(row Scannable) error {
	return row.Scan(
		&c.ID,
		&c.Title,
		&c.Memo,
		&c.Asset,
		&c.PeriodFrom,
		&c.PeriodTill,
		&c.CreatedAt,
		&c.UpdatedAt,
		&c.DeletedAt,
		&c.CreatedBy,
		&c.UpdatedBy,
		&c.DeletedBy,
	)
}

// Find
func (c *Campaign) Find(db *sql.DB, id uint) error {
	stmt, _ := db.Prepare(campaignFindStmt)
	rs := stmt.QueryRow(id)
	defer stmt.Close()

	if rs == nil {
		return errors.New("NOT FOUND")
	} else {
		c.Bind(rs)
		return nil
	}
}
