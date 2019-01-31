package main

import (
	"fmt"

	"github.com/gin-gonic/gin"
)

func postQueryRoutes(grp *gin.RouterGroup, prefix string,
	createFn gin.HandlerFunc,
	updateFn gin.HandlerFunc,
	deleteFn gin.HandlerFunc) {

	if createFn != nil {
		grp.POST(fmt.Sprintf(`/%s/new`, prefix), createFn)
	}
	if updateFn != nil {
		grp.POST(fmt.Sprintf(`/%s/edit`, prefix), updateFn)
	}
	if deleteFn != nil {
		grp.POST(fmt.Sprintf(`/%s/del`, prefix), deleteFn)
	}
}

// GroupDatabaseConnection - Grouping database
func GroupDatabaseConnection(app *gin.Engine) {
	//
	dbGroup := app.Group("")
	dbGroup.Use(DatabaseSetMiddle)

	// open
	dbGroup.POST("/auth", PostOpenAuth)

	sessionGroup := dbGroup.Group("")
	sessionGroup.Use(RequireLoginSetMiddle)

	sessionGroup.GET("/t/", GetTagAll)
	sessionGroup.GET("/t/:class", GetTagWithClass)
	sessionGroup.POST("/c/", PostCampaignQuery)

	// update campaigns
	postQueryRoutes(sessionGroup, `c`, PostCampaignCreate, PostCampaignUpdate, PostCampaignDelete)
	postQueryRoutes(sessionGroup, `t`, PostTagCreate, PostTagUpdate, PostTagDelete)
	postQueryRoutes(sessionGroup, `u`, PostUserCreate, PostUserUpdate, PostUserDelete)
	postQueryRoutes(sessionGroup, `p`, PostPerformanceCreate, PostPerformanceUpdate, PostPerformanceDelete)
	postQueryRoutes(sessionGroup, `a`, PostAffiliationCreate, PostAffiliationUpdate, PostAffiliationDelete)
}
