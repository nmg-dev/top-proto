package main

import (
	"database/sql"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
)

// Queriable table queriable
type Queriable interface {
	Insert(db *sql.DB) error
	Update(db *sql.DB) error
	Delete(db *sql.DB) error
	Bind(row *sql.Row) error
}

func initConnection() (*sql.DB, error) {
	datasource := fmt.Sprintf("%s:%s@%s/%s?parseTime=true", DBUser, DBPass, DBHost, DBSchema)
	return sql.Open(DBDriver, datasource)
}

func databaseSetMiddle(ctx *gin.Context) {
	db, err := initConnection()
	if err != nil {
		ctx.AbortWithError(http.StatusInternalServerError, err)
	}
	ctx.Set(dbKeyBindings, db)
}

// Database - middleware
func Database() gin.HandlerFunc {
	return databaseSetMiddle
}

func getDatabase(ctx *gin.Context) *sql.DB {
	db, _ := ctx.Get(dbKeyBindings)
	return db.(*sql.DB)
}
