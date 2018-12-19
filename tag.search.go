package main

import (
	"database/sql"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

type TagMeta struct {
	Class    string `json: "class_name"`
	DefValue string `json: "default_value"`
	Counts   int    `json: "class_count"`
}

func GetTagAll(ctx *gin.Context) {
	db := getDatabase(ctx)
	resp := ListAllTags(db)
	ctx.JSON(http.StatusOK, resp)
}

func GetTagWithClass(ctx *gin.Context) {
	db := getDatabase(ctx)
	cls := ctx.Param("class")

	resp := ListTagsWithClass(db, cls)
	ctx.JSON(http.StatusOK, resp)
}

func ListAllTags(db *sql.DB) map[uint]Tag {
	tags := make(map[uint]Tag)
	stmt, _ := db.Prepare(`SELECT * FROM tags`)
	rs, _ := stmt.Query()

	for rs.Next() {
		var t Tag
		t.Bind(rs)
		if 0 < t.ID {
			tags[t.ID] = t
		}
	}

	return tags
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

func FindAffilationsWithCampaignIDs(db *sql.DB, cids []uint) []TagAffiliation {
	query := fmt.Sprintf(`SELECT * FROM tag_affiliations WHERE campaign_id IN (%s)`, WhereInJoin(cids))
	stmt, _ := db.Prepare(query)
	rs, _ := stmt.Query()
	defer stmt.Close()

	rets := []TagAffiliation{}
	for rs.Next() {
		var aff TagAffiliation
		aff.Bind(rs)
		rets = append(rets, aff)
	}
	return rets
}
