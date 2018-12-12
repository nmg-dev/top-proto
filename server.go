package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
)

// DJsonMap - alias for string based map
type DJsonMap map[string]interface{}

// testing
func main() {
	app := gin.Default()

	// static index endpoint
	app.Use(static.Serve("/", static.LocalFile("front/build", false)))

	// disable CORS
	app.Use(cors.New(cors.Config{
		// for debug!
		AllowOrigins: []string{"http://localhost:3000"},
	}))

	// with Database binding
	app.Group("/", func(ctx *gin.Context) {
		app.Use(Database())

		app.GET("/init", GetInitView)

		// token validation first
		app.POST("/open", PostOpen)
		// get list of campaigns
		app.GET("/campaigns", GetCampaign)
		// get list of attributes
		app.GET("/attributes", GetAttributes)
		// query results
		app.POST("/query", PostQuery)

	})

	// campaign CRUD
	app.Run() // listen and serve on 0.0.0.0:8080
}
