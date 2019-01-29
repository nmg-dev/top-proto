package main

import (
	"os"

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
	// to debug! CORS allow all origin
	// app.Use(cors.Default())

	// static index endpoint
	app.Static(`/img`, `./img`)
	// app.Static(`/js`, `./js`)
	// app.Static(`/css`, `./css`)

	app.Use(static.Serve("/", static.LocalFile("front/build", true)))

	GroupDatabaseConnection(app)

	// app.LoadHTMLGlob(`./views/*.tmpl`)
	// app.GET(``, func(ctx *gin.Context) {
	// 	ctx.HTML(http.StatusOK, `index.tmpl`, "")
	// })

	app.GET(`/info`, func(ctx *gin.Context) {
		// ctx.HTML(http.StatusOK, )
	})

	// campaign CRUD
	app.Run() // listen and serve on 0.0.0.0:8080
}
