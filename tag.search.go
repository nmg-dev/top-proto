package main

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
)

type TagMeta struct {
	Class    string `json: "class_name"`
	DefValue string `json: "default_value"`
	Counts   int    `json: "class_count"`
}

func GetTagClasses(ctx *gin.Context) {
	db := getDatabase(ctx)
	resp := ListTagClasses(db)
	ctx.JSON(http.StatusOK, resp)
}

func GetTagWithClass(ctx *gin.Context) {
	db := getDatabase(ctx)
	cls := ctx.Param("class")

	resp := ListTagsWithClass(db, cls)
	ctx.JSON(http.StatusOK, resp)
}

func ListTagClasses(db *sql.DB) []TagMeta {
	stmt, _ := db.Prepare(`SELECT class, min(name), count(*) FROM tags GROUP BY class ORDER BY priority`)
	rs, _ := stmt.Query()

	resp := []TagMeta{}
	for rs.Next() {
		var tm TagMeta
		rs.Scan(&tm.Class, &tm.DefValue, &tm.Counts)
		resp = append(resp, tm)
	}

	return resp
}

func ListTagsWithClass(db *sql.DB, cls string) map[uint]Tag {
	stmt, _ := db.Prepare(`SELECT * FROM Tags WHERE class=?`)
	rs, _ := stmt.Query(cls)

	rets := make(map[uint]Tag)

	for rs.Next() {
		var t Tag
		t.Bind(rs)

		rets[t.ID] = t
	}

	return rets
}
