package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
)

// Tag
type Tag struct {
	ID uint `json:"id" db:"id"`

	Class    string   `json:"class" db:"class"`
	Name     string   `json:"name" db:"name"`
	Priority uint     `json:"priority" db:"priority"`
	I18N     DJsonMap `json:"i18n" db:"i18n"`
}

const attrInsertStmt = `INSERT IGNORE INTO tags (class,name,priority) VALUES (?, ?, ?)`
const attrUpdateStmt = `UPDATE tags name=?, priority=? WHERE id=?`
const attrDeleteStmt = `DELETE FROM tags WHERE id=?`

// QueryTagsFor
func QueryTagsFor(db *sql.DB, tids []uint) map[uint]Tag {
	rets := make(map[uint]Tag)

	query := fmt.Sprintf(`SELECT * FROM tags WHERE id IN (%s)`, WhereInJoin(tids))
	stmt, _ := db.Prepare(query)

	rs, _ := stmt.Query()

	for rs.Next() {
		var t Tag
		t.Bind(rs)
		fmt.Printf("%d %s", t.ID, t.Name)
		rets[t.ID] = t
	}

	return rets
}

func (a *Tag) insertStmt(db *sql.DB) *sql.Stmt {
	return QueriableState(db, attrInsertStmt)
}

func (a *Tag) insertExec(stmt *sql.Stmt) (sql.Result, error) {
	return stmt.Exec(a.Class, a.Name, a.Priority)
}

func (a Tag) updateStmt(db *sql.DB) *sql.Stmt {
	return QueriableState(db, attrUpdateStmt)
}

func (a Tag) updateExec(stmt *sql.Stmt) (sql.Result, error) {
	return stmt.Exec(a.Name, a.Priority, a.ID)
}

func (a Tag) deleteStmt(db *sql.DB) *sql.Stmt {
	return QueriableState(db, attrDeleteStmt)
}

func (a Tag) deleteExec(stmt *sql.Stmt) (sql.Result, error) {
	return stmt.Exec(a.ID)
}

// Insert - insert Tag
func (a *Tag) Insert(db *sql.DB) error {
	if a.ID <= 0 {
		lastID, err := ExecuteQueriableInsert(a, db, a.insertStmt, a.insertExec)
		a.ID = uint(lastID)
		return err
	} else {
		return nil
	}
}

// Update -
func (a Tag) Update(db *sql.DB) error {
	if 0 < a.ID {
		return ExecuteQueriableUpdate(a, db, a.updateStmt, a.updateExec)
	} else {
		return a.Insert(db)
	}
}

// Delete -
func (a Tag) Delete(db *sql.DB) error {
	if 0 < a.ID {
		return ExecuteQueriableUpdate(a, db, a.deleteStmt, a.deleteExec)
	} else {
		return nil
	}
}

// Bind -
func (a *Tag) Bind(row Scannable) error {
	var i18n string
	sqlErr := row.Scan(
		&a.ID,
		&a.Class,
		&a.Name,
		&a.Priority,
		&i18n,
	)

	json.Unmarshal([]byte(i18n), &a.I18N)
	if sqlErr != nil {
		return sqlErr
	}
	return nil
}
