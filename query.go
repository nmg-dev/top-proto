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
	Update(db Preparable) error
	Delete(db Preparable) error
}

// Preparable can prepare statment
type Preparable interface {
	Prepare(query string) (*sql.Stmt, error)
}

// UintIDEntity
type UintIDEntity struct {
	ID uint `json:"id" db:"id"`
}

// QueriableExec
type QueriableStmt func(db Preparable) *sql.Stmt
type QueriableExec func(stmt *sql.Stmt) (sql.Result, error)

type ServletProc func(ctx *gin.Context, db Preparable) (interface{}, error)

func DatabaseContextServlet(ctx *gin.Context, proc ServletProc) {
	db := getDatabase(ctx)
	defer db.Close()

	resp, respErr := proc(ctx, db)
	if respErr != nil {
		ctx.JSON(http.StatusInternalServerError, respErr)
	} else {
		ctx.JSON(http.StatusOK, resp)
	}
}

func TransactContextServlet(ctx *gin.Context, proc ServletProc) {
	db := getDatabase(ctx)
	defer db.Close()

	tx, txErr := db.Begin()
	if txErr != nil {
		ctx.JSON(http.StatusInternalServerError, txErr)
	} else {
		resp, respErr := proc(ctx, tx)
		if respErr != nil {
			tx.Rollback()
			ctx.JSON(http.StatusInternalServerError, respErr)
		} else {
			tx.Commit()
			ctx.JSON(http.StatusOK, resp)
		}
	}
}

//
func QueriableState(db Preparable, query string) *sql.Stmt {
	stmt, _ := db.Prepare(query)
	return stmt
}

// ExecuteQueriableInsert
func ExecuteQueriableInsert(q Queriable, db Preparable, qs QueriableStmt, exec QueriableExec) (int64, error) {
	stmt := qs(db)
	rs, err := exec(stmt)
	defer stmt.Close()

	lastId, _ := rs.LastInsertId()
	return lastId, err
}

//ExecuteQueriableUpdate
func ExecuteQueriableUpdate(q Queriable, db Preparable, qs QueriableStmt, exec QueriableExec) error {
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
