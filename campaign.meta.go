package main

import (
	"database/sql"
	"fmt"
	"time"
)

// CampaignMeta - campaign meta data
type CampaignMeta struct {
	ID          uint `json:"id" db:"id"`
	CampaignID  uint `db:"campaign_id"`
	AttributeID uint `db:"attr_id"`

	CreatedAt time.Time `json:"created_at" db:"created_at"`
	CreatedBy uint      `json:"created_by" db:"created_by"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
	UpdatedBy uint      `json:"updated_by" db:"updated_by"`
	DeletedAt time.Time `json:"deleted_at" db:"deleted_at"`
	DeletedBy uint      `json:"deleted_by" db:"deleted_by"`
}

const campaignMetaInsertStmt = `INSERT campaign_meta (campaign_id, attr_id, created_at, created_by, updated_at, updated_by) VALUE (?, ?, NOW(), ?, NOW(), ?)`
const campaignMetaUpdateStmt = `UPDATE campaign_meta SET campaign_id=?, attr_id=?, updated_id=?, updated_by=? WHERE id=?`
const campaignMetaDeleteStmt = `UPDATE campaign_meta SET deleted_at=NOW(), deleted_by=? WHERE id=?`

func ListAttrsFromCampaignIds(db *sql.DB, cids []uint) []uint {
	query := `SELECT attr_id, COUNT(*) as cnt FROM campaign_meta WHERE campaign_id IN (%s) %s GROUP BY attr_id ORDER BY cnt DESC`
	query = fmt.Sprintf(query, WhereInJoin(cids))
	stmt, _ := db.Prepare(query)
	rs, _ := stmt.Query()

	var aid, acnt uint
	var aids []uint
	for rs.Next() {
		rs.Scan(&aid, &acnt)
		aids = append(aids, aid)
	}

	return aids
}

func (m *CampaignMeta) insertStmt(db *sql.DB) *sql.Stmt {
	return QueriableState(db, campaignMetaInsertStmt)
}

func (m *CampaignMeta) insertExec(stmt *sql.Stmt) (sql.Result, error) {
	return stmt.Exec(
		m.CampaignID,
		m.AttributeID,
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
		m.AttributeID,
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
		&m.AttributeID,
		&m.CreatedAt,
		&m.UpdatedAt,
		&m.CreatedBy,
		&m.UpdatedBy)
}

// FindAffiliationsIn
func FindAffiliationsIn(db *sql.DB, cids []uint, aids []uint) map[uint][]uint {
	affs := make(map[uint][]uint)
	query := fmt.Sprintf(
		`SELECT * FROM campaign_meta WHERE campaign_id IN (%s) AND attr_id IN (%s)`,
		WhereInJoin(cids),
		WhereInJoin(aids))
	stmt, _ := db.Prepare(query)
	rs, _ := stmt.Query()
	defer stmt.Close()

	for rs.Next() {
		var m CampaignMeta
		m.Bind(rs)

		if 0 < m.ID {
			if _, ok := affs[m.CampaignID]; !ok {
				affs[m.CampaignID] = []uint{m.AttributeID}
			} else {
				affs[m.CampaignID] = append(affs[m.CampaignID], m.AttributeID)
			}
		}
	}

	return affs

}
