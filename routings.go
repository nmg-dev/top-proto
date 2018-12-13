package main

import (
	"github.com/gin-gonic/gin"
)

// GroupDatabaseConnection - Grouping database
func GroupDatabaseConnection(app *gin.Engine) {
	//
	dbGroup := app.Group("")
	dbGroup.Use(Database())

	dbGroup.GET("/init", GetInitView)
	// open
	dbGroup.POST("/open", PostOpen)
	// get list of campaigns
	dbGroup.GET("/campaigns", GetCampaign)
	// get list of attributes
	dbGroup.GET("/attributes", GetAttributes)
	// query results
	dbGroup.POST("/query", PostQuery)

}

// GetInitView - initializing data
func GetInitView(ctx *gin.Context) {

}

//PostQuery - query values
func PostQuery(ctx *gin.Context) {

}

// GetCampaign
func GetCampaign(ctx *gin.Context) {

}

// PostCampaign
func PostCampaign(ctx *gin.Context) {

}

// GetAttributes
func GetAttributes(ctx *gin.Context) {

}
