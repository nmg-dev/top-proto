package main

import (
	"database/sql"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
)

const dbKeyBindings = `__DB__`

// Scannable to fit sql.Row, sql.Rows
type Scannable interface {
	Scan(dest ...interface{}) error
}

// Queriable table queriable
type Queriable interface {
	Update(db *sql.DB) error
	Delete(db *sql.DB) error
}

// UintIDEntity
type UintIDEntity struct {
	ID uint `json:"id" db:"id"`
}

// QueriableExec
type QueriableStmt func(db *sql.DB) *sql.Stmt
type QueriableExec func(stmt *sql.Stmt) (sql.Result, error)

//
func QueriableState(db *sql.DB, query string) *sql.Stmt {
	stmt, _ := db.Prepare(query)
	return stmt
}

// ExecuteQueriableInsert
func ExecuteQueriableInsert(q Queriable, db *sql.DB, qs QueriableStmt, exec QueriableExec) (int64, error) {
	stmt := qs(db)
	rs, err := exec(stmt)
	defer stmt.Close()

	lastId, _ := rs.LastInsertId()
	return lastId, err
}

//ExecuteQueriableUpdate
func ExecuteQueriableUpdate(q Queriable, db *sql.DB, qs QueriableStmt, exec QueriableExec) error {
	stmt := qs(db)
	_, err := exec(stmt)
	defer stmt.Close()

	return err
}

func initConnection() (*sql.DB, error) {
	datasource := fmt.Sprintf("%s:%s@%s/%s?parseTime=true", DBUser, DBPass, DBHost, DBSchema)
	return sql.Open(DBDriver, datasource)
}

// DatabaseSetMiddle
func DatabaseSetMiddle(ctx *gin.Context) {
	db, err := initConnection()
	if err != nil {
		ctx.AbortWithError(http.StatusInternalServerError, err)
	}
	ctx.Set(dbKeyBindings, db)
}

func getDatabase(ctx *gin.Context) *sql.DB {
	db, _ := ctx.Get(dbKeyBindings)
	return db.(*sql.DB)
}
