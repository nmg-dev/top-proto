package main

import (
	"database/sql"
)

// CampaignMeta - campaign meta data
type TagAffiliation struct {
	ID         uint `json:"id" db:"id"`
	CampaignID uint `json:"c" db:"campaign_id"`
	TagID      uint `json:"t" db:"tag_id"`
}

const campaignMetaInsertStmt = `INSERT tag_affiliations (campaign_id, tag_id) VALUE (?, ?)`
const campaignMetaUpdateStmt = `UPDATE tag_affiliations SET campaign_id=?, tag_id=? WHERE id=?`
const campaignMetaDeleteStmt = `DELETE tag_affiliations WHERE id=?`

func (m *TagAffiliation) insertStmt(db *sql.DB) *sql.Stmt {
	return QueriableState(db, campaignMetaInsertStmt)
}

func (m *TagAffiliation) insertExec(stmt *sql.Stmt) (sql.Result, error) {
	return stmt.Exec(
		m.CampaignID,
		m.TagID,
	)
}

func (m TagAffiliation) updateStmt(db *sql.DB) *sql.Stmt {
	return QueriableState(db, campaignMetaUpdateStmt)
}

func (m TagAffiliation) updateExec(stmt *sql.Stmt) (sql.Result, error) {
	return stmt.Exec(
		m.CampaignID,
		m.TagID,
		m.ID,
	)
}

func (m TagAffiliation) deleteStmt(db *sql.DB) *sql.Stmt {
	return QueriableState(db, campaignMetaDeleteStmt)
}

func (m TagAffiliation) deleteExec(stmt *sql.Stmt) (sql.Result, error) {
	return stmt.Exec(m.ID)
}

// Insert
func (m *TagAffiliation) Insert(db *sql.DB) error {
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
func (m TagAffiliation) Update(db *sql.DB) error {
	if 0 < m.ID {
		return ExecuteQueriableUpdate(m, db, m.updateStmt, m.updateExec)
	} else {
		return m.Insert(db)
	}
}

// Delete
func (m TagAffiliation) Delete(db *sql.DB) error {
	if 0 < m.ID {
		return ExecuteQueriableUpdate(m, db, m.deleteStmt, m.deleteExec)
	} else {
		return nil
	}
}

// Bind
func (m *TagAffiliation) Bind(r Scannable) error {
	return r.Scan(
		&m.ID,
		&m.CampaignID,
		&m.TagID)
}
