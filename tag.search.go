package main

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

// TagMeta
type TagMeta struct {
	Class    string `json: "class_name"`
	DefValue string `json: "default_value"`
	Counts   int    `json: "class_count"`
}

// GetTagAll - all tags gin context
func GetTagAll(ctx *gin.Context) {
	DatabaseContextServlet(ctx, getTagAllProc)
}
func getTagAllProc(ctx *gin.Context, db Preparable) (interface{}, error) {
	tags, err := ListAllTags(db)
	return tags, err
}

// PostTagCreate - create tags
func PostTagCreate(ctx *gin.Context) {
	TransactContextServlet(ctx, postTagQueryCreateProc)
}
func postTagQueryCreateProc(ctx *gin.Context, tx Preparable) (interface{}, error) {
	ts := make([]Tag, 0)
	ctx.BindJSON(&ts)

	rs := make([]Tag, 0)

	for _, tag := range ts {
		err := tag.Insert(tx)
		if err != nil {
			return tag, err
		}

		rs = append(rs, tag)
	}

	return rs, nil
}

// PostTagUpdate - update tags
func PostTagUpdate(ctx *gin.Context) {
	TransactContextServlet(ctx, postTagQueryUpdateProc)
}
func postTagQueryUpdateProc(ctx *gin.Context, tx Preparable) (interface{}, error) {
	ts := make(map[uint]Tag)
	ctx.BindJSON(&ts)

	tids := make([]uint, 0)
	for tid, tag := range ts {
		tids = append(tids, tid)
		qerr := tag.Update(tx)
		if qerr != nil {
			return nil, qerr
		}
	}
	return tids, nil
}

// PostTagDelete - delete tags
func PostTagDelete(ctx *gin.Context) {
	TransactContextServlet(ctx, postTagQueryDeleteProc)
}

func postTagQueryDeleteProc(ctx *gin.Context, tx Preparable) (interface{}, error) {
	ts := make(map[uint]Tag)
	ctx.BindJSON(&ts)

	tids := make([]uint, 0)
	for tid, tag := range ts {
		tids = append(tids, tid)
		qerr := tag.Delete(tx)
		if qerr != nil {
			return nil, qerr
		}
	}
	return tids, nil
}

// PostAffiliationCreate
func PostAffiliationCreate(ctx *gin.Context) {
	TransactContextServlet(ctx, postAffiliationCreateProc)
}
func postAffiliationCreateProc(ctx *gin.Context, tx Preparable) (interface{}, error) {
	return postAffiliationProc(ctx, tx, func(aff *TagAffiliation, tx Preparable) error {
		return aff.Insert(tx)
	})
}

// PostAffiliationUpdate
func PostAffiliationUpdate(ctx *gin.Context) {
	TransactContextServlet(ctx, postAffiliationUpdateProc)
}
func postAffiliationUpdateProc(ctx *gin.Context, tx Preparable) (interface{}, error) {
	return postAffiliationProc(ctx, tx, func(aff *TagAffiliation, tx Preparable) error {
		return aff.Update(tx)
	})
}

// PostAffiliationDelete
func PostAffiliationDelete(ctx *gin.Context) {
	TransactContextServlet(ctx, postAffiliationDeleteProc)
}
func postAffiliationDeleteProc(ctx *gin.Context, tx Preparable) (interface{}, error) {
	return postAffiliationProc(ctx, tx, func(aff *TagAffiliation, tx Preparable) error {
		return aff.Delete(tx)
	})
}

func postAffiliationProc(ctx *gin.Context, tx Preparable, fn func(aff *TagAffiliation, tx Preparable) error) (interface{}, error) {
	afs := make([]TagAffiliation, 0)
	rs := make([]TagAffiliation, 0)

	ctx.BindJSON(&afs)
	for _, aff := range afs {
		err := fn(&aff, tx)
		if err != nil {
			return aff, err
		}
		rs = append(rs, aff)
	}
	return rs, nil
}

// GetTagWithClass - tags within the class
func GetTagWithClass(ctx *gin.Context) {
	db := getDatabase(ctx)
	defer db.Close()
	cls := ctx.Param("class")

	resp := ListTagsWithClass(db, cls)
	ctx.JSON(http.StatusOK, resp)
}

// ListAllTags - all tags. all
func ListAllTags(db Preparable) (map[uint]Tag, error) {
	tags := make(map[uint]Tag)
	stmt, serr := db.Prepare(`SELECT * FROM tags`)
	if serr != nil {
		return nil, serr
	}
	rs, rerr := stmt.Query()
	if rerr != nil {
		return nil, rerr
	}

	for rs.Next() {
		var t Tag
		t.Bind(rs)
		if 0 < t.ID {
			tags[t.ID] = t
		}
	}

	return tags, nil
}

func ListTagClasses(db Preparable) []TagMeta {
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

func ListTagsWithClass(db Preparable, cls string) map[uint]Tag {
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

func FindAffilationsWithCampaignIDs(db Preparable, cids []uint) []TagAffiliation {
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
