package main

import (
	"net/http"
	"os"

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
	app.Static(`/img`, `./img`)
	app.Static(`/js`, `./js`)
	app.Static(`/css`, `./css`)

	app.LoadHTMLGlob(`./views/*.tmpl`)
	// app.Use(static.Serve("/", static.LocalFile("front/build", true)))

	GroupDatabaseConnection(app)

	app.GET(``, func(ctx *gin.Context) {
		ctx.HTML(http.StatusOK, `index.tmpl`, "")
	})

	app.GET(`/info`, func(ctx *gin.Context) {
		// ctx.HTML(http.StatusOK, )
	})

	// campaign CRUD
	app.Run() // listen and serve on 0.0.0.0:8080
}
