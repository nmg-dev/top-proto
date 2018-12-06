package main

import (
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
)

// testing
const websocketPacketSize uint = 4096

func main() {
	app := gin.Default()

	app.Use(static.Serve("/", static.LocalFile("front/build", false)))
	app.GET("/ws", func(ctx *gin.Context) {
		// websocket.Handler(func(cnx *websocket.Conn) {
		// })
	})

	app.GET("/", func(ctx *gin.Context) {

	})
	app.Run() // listen and serve on 0.0.0.0:8080
}
