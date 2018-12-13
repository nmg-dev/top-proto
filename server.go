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

	GroupDatabaseConnection(app)

	// campaign CRUD
	app.Run() // listen and serve on 0.0.0.0:8080
}
