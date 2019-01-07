package main

import (
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
)

// DJsonMap - alias for string based map
type DJsonMap map[string]interface{}

// testing
func main() {
	// when needs seeding
	seeding := false
	for _, argv := range os.Args {
		if !seeding && argv == `--init` {
			Migrate(true, true)
			seeding = true
		} else if !seeding && argv == `--seed` {
			Migrate(false, true)
			seeding = true
		} else if !seeding && argv == `--migrate` {
			Migrate(false, false)
		} else if !seeding && argv == `--refresh` {
			Migrate(true, false)
		}
	}

	app := gin.Default()
	// recovery
	app.Use(gin.Recovery())

	// static index endpoint
	app.Use(static.Serve("/", static.LocalFile("front/build", true)))

	// disable CORS
	app.Use(cors.New(cors.Config{
		// for debug!
		AllowOrigins: []string{
			"http://localhost:3000",
			"http://to.nextmediagroup.co.kr:8080",
			// "http://to.nextmediagroup.co.kr",
			// "https://to.nextmediagroup.co.kr"
		},
	}))

	GroupDatabaseConnection(app)

	// campaign CRUD
	app.Run() // listen and serve on 0.0.0.0:8080
}
