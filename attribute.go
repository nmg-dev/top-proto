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

const attrInsertStmt = `INSERT IGNORE INTO attributions 
	(class,name,properties,priority,created_at,created_by,updated_at,updated_by)
VALUES (?, ?, ?, ?, NOW(), ?, NOW(), ?)`
const attrUpdateStmt = `UPDATE attributions
	name=?, properties=?, priority=?, updated_at=?, updated_by=? WHERE id=?`
const attrDeleteStmt = `UPDATE attributions
	deleted_at=?, deleted_by=? WHERE id=?`
const attrNamesStmt = `SELECT * FROM attributions WHERE class=? ORDER BY priority DESC`

// Insert - insert attribution
func (a *Attribution) Insert(db *sql.DB) error {
	stmt, _ := db.Prepare(attrInsertStmt)
	props, _ := json.Marshal(a.Props)
	rs, err := stmt.Exec(a.Class, a.Name, props, a.Priority, a.CreatedBy, a.CreatedBy)
	if err == nil {
		lastId, _ := rs.LastInsertId()
		a.ID = uint(lastId)
	}
	return err
}

func (a Attribution) Update(db *sql.DB) error {
	stmt, _ := db.Prepare(attrUpdateStmt)
	props, _ := json.Marshal(a.Props)
	_, err := stmt.Exec(a.Name, props, a.Priority, a.UpdatedAt, a.UpdatedBy, a.ID)
	return err
}

func (a Attribution) Delete(db *sql.DB) error {
	stmt, _ := db.Prepare(attrDeleteStmt)
	_, err := stmt.Exec(a.DeletedAt, a.DeletedBy, a.ID)
	return err
}

func (a *Attribution) Bind(row *sql.Row) error {
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
