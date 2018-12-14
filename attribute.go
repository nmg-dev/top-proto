package main

import (
	"database/sql"
	"encoding/json"
	"time"
)

// Attribution - attribute keys
type Attribution struct {
	ID uint `json:"id" db:"id"`

	Class    string   `json:"class" db:"class"`
	Label    string   `json:"label"`
	Name     string   `json:"name" db:"name"`
	Props    DJsonMap `json:"properties" db:"properties"`
	Priority uint     `json:"priority" db:"priority"`

	CreatedAt time.Time `json:"created_at" db:"created_at"`
	CreatedBy uint      `json:"created_by" db:"created_by"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
	UpdatedBy uint      `json:"updated_by" db:"updated_by"`
	DeletedAt time.Time `json:"deleted_at" db:"deleted_at"`
	DeletedBy uint      `json:"deleted_by" db:"deleted_by"`
}

const attrInsertStmt = `INSERT IGNORE INTO attributions (class,name,properties,priority,created_at,created_by,updated_at,updated_by) VALUES (?, ?, ?, ?, NOW(), ?, NOW(), ?)`
const attrUpdateStmt = `UPDATE attributions name=?, properties=?, priority=?, updated_at=NOW(), updated_by=? WHERE id=?`
const attrDeleteStmt = `UPDATE attributions deleted_at=Now(), deleted_by=? WHERE id=?`
const attrNamesStmt = `SELECT * FROM attributions WHERE class=? ORDER BY priority DESC`

func (a *Attribution) insertStmt(db *sql.DB) *sql.Stmt {
	return QueriableState(db, attrInsertStmt)
}

func (a *Attribution) insertExec(stmt *sql.Stmt) (sql.Result, error) {
	properties, _ := json.Marshal(a.Props)
	return stmt.Exec(a.Class, a.Name, properties, a.CreatedBy, a.CreatedBy)
}

func (a Attribution) updateStmt(db *sql.DB) *sql.Stmt {
	return QueriableState(db, attrUpdateStmt)
}

func (a Attribution) updateExec(stmt *sql.Stmt) (sql.Result, error) {
	properties, _ := json.Marshal(a.Props)
	return stmt.Exec(a.Name, properties, a.Priority, a.UpdatedBy, a.ID)
}

func (a Attribution) deleteStmt(db *sql.DB) *sql.Stmt {
	return QueriableState(db, attrDeleteStmt)
}

func (a Attribution) deleteExec(stmt *sql.Stmt) (sql.Result, error) {
	return stmt.Exec(a.DeletedBy, a.ID)
}

// Insert - insert attribution
func (a *Attribution) Insert(db *sql.DB) error {
	if a.ID <= 0 {
		lastID, err := ExecuteQueriableInsert(a, db, a.insertStmt, a.insertExec)
		a.ID = uint(lastID)
		return err
	} else {
		return nil
	}
}

// Update -
func (a Attribution) Update(db *sql.DB) error {
	if 0 < a.ID {
		return ExecuteQueriableUpdate(a, db, a.updateStmt, a.updateExec)
	} else {
		return a.Insert(db)
	}
}

// Delete -
func (a Attribution) Delete(db *sql.DB) error {
	if 0 < a.ID {
		return ExecuteQueriableUpdate(a, db, a.deleteStmt, a.deleteExec)
	} else {
		return nil
	}
}

// Bind -
func (a *Attribution) Bind(row Scannable) error {
	var props string
	sqlErr := row.Scan(
		&a.ID,
		&a.Name,
		&props,
		&a.Priority,
		&a.CreatedAt,
		&a.UpdatedAt,
		&a.DeletedAt,
		&a.CreatedBy,
		&a.UpdatedBy,
		&a.DeletedBy,
	)

	if sqlErr != nil {
		return sqlErr
	}

	return json.Unmarshal([]byte(props), &a.Props)
}

// FilterCIDsWithAIds - filter out cids with aids
func FilterCIDsWithAIds(cids []uint, aids []uint) []uint {

}
