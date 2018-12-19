package main

import (
	"github.com/gin-gonic/gin"
)

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

	// campaignGroup
	// campaignGroup := app.Group("/c")

	// tagGroup
	// tagGroup := app.Group("/t")

	// managerGroup := app.Group("")
}
