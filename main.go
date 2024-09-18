package main

import (
	"strconv"

	"github.com/Andrew-Gray/idx0-api/controllers"
	"github.com/Andrew-Gray/idx0-api/initializers"

	"github.com/gin-gonic/gin"
)

func init() {
	initializers.LoadEnv()
	initializers.ConnectToDB()
}

func main() {
	db := initializers.DB

	router := gin.Default()

	router.GET("/", func(c *gin.Context) {
		controllers.GetWeather()
		c.JSON(200, gin.H{
			"message": "HELLO!!",
		})
	})

	//fakeProfile.go
	router.GET("/fakeProfile", func(ctx *gin.Context) {
		ctx.JSON(200, controllers.GetFakeProfile(db))
	})

	router.GET("/fakeProfile/:id", func(ctx *gin.Context) {
		idParam := ctx.Param("id")

		id, err := strconv.Atoi(idParam)

		if err != nil {
			ctx.String(400, "ID provider not an integer")
		} else {
			ctx.JSON(200, controllers.GetFakeProfileById(db, id))
		}
	})

	router.Run()
	defer db.Close()
}
