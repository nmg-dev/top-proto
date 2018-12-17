package main

import (
	"database/sql"
	"time"
)

// CampaignMeta - campaign meta data
type CampaignMeta struct {
	ID         uint `json:"id" db:"id"`
	CampaignID uint `db:"campaign_id"`
	TagID      uint `db:"tag_id"`

	CreatedAt time.Time `json:"created_at" db:"created_at"`
	CreatedBy uint      `json:"created_by" db:"created_by"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
	UpdatedBy uint      `json:"updated_by" db:"updated_by"`
	DeletedAt time.Time `json:"deleted_at" db:"deleted_at"`
	DeletedBy uint      `json:"deleted_by" db:"deleted_by"`
}

const campaignMetaInsertStmt = `INSERT tag_affiliations (campaign_id, tag_id, created_at, created_by, updated_at, updated_by) VALUE (?, ?, NOW(), ?, NOW(), ?)`
const campaignMetaUpdateStmt = `UPDATE tag_affiliations SET campaign_id=?, tag_id=?, updated_id=?, updated_by=? WHERE id=?`
const campaignMetaDeleteStmt = `UPDATE tag_affiliations SET deleted_at=NOW(), deleted_by=? WHERE id=?`

func (m *CampaignMeta) insertStmt(db *sql.DB) *sql.Stmt {
	return QueriableState(db, campaignMetaInsertStmt)
}

func (m *CampaignMeta) insertExec(stmt *sql.Stmt) (sql.Result, error) {
	return stmt.Exec(
		m.CampaignID,
		m.TagID,
		m.CreatedBy,
		m.CreatedBy,
	)
}

func (m CampaignMeta) updateStmt(db *sql.DB) *sql.Stmt {
	return QueriableState(db, campaignMetaUpdateStmt)
}

func (m CampaignMeta) updateExec(stmt *sql.Stmt) (sql.Result, error) {
	return stmt.Exec(
		m.CampaignID,
		m.TagID,
		m.UpdatedBy,
		m.ID,
	)
}

func (m CampaignMeta) deleteStmt(db *sql.DB) *sql.Stmt {
	return QueriableState(db, campaignMetaDeleteStmt)
}

func (m CampaignMeta) deleteExec(stmt *sql.Stmt) (sql.Result, error) {
	return stmt.Exec(m.DeletedBy, m.ID)
}

// Insert
func (m *CampaignMeta) Insert(db *sql.DB) error {
	if m.ID <= 0 {
		lastId, err := ExecuteQueriableInsert(m, db, m.insertStmt, m.insertExec)
		if err != nil {
			return err
		} else {
			m.ID = uint(lastId)
			return nil
		}
	}
	return nil
}

// Update
func (m CampaignMeta) Update(db *sql.DB) error {
	if 0 < m.ID {
		return ExecuteQueriableUpdate(m, db, m.updateStmt, m.updateExec)
	} else {
		return m.Insert(db)
	}
}

// Delete
func (m CampaignMeta) Delete(db *sql.DB) error {
	if 0 < m.ID {
		return ExecuteQueriableUpdate(m, db, m.deleteStmt, m.deleteExec)
	} else {
		return nil
	}
}

// Bind
func (m *CampaignMeta) Bind(r Scannable) error {
	return r.Scan(
		&m.ID,
		&m.CampaignID,
		&m.TagID,
		&m.CreatedAt,
		&m.UpdatedAt,
		&m.CreatedBy,
		&m.UpdatedBy)
}
