package main

import (
	"net/http"

	"backend/config"
	"backend/controller"

	// "backend/middlewares"

	"github.com/gin-gonic/gin"
)

const PORT = "3036"

func main() {

	// open connection database
	config.ConnectionDB()

	// Generate databases
	config.SetupDatabase()

	r := gin.Default()

	r.Use(CORSMiddleware())

	// r.POST("/login", controller.SignIn)

	router := r.Group("")
	{
		// router.Use(middlewares.Authorizes()) 
		{
		// Arttoy Routes
		router.GET("/arttoys", controller.ListArtToys)
		router.GET("/arttoy/:id", controller.GetArtToy)
		router.POST("/arttoys", controller.CreateArtToy)
		router.PUT("/arttoys/:id", controller.UpdateArtToy)
		router.DELETE("/arttoys/:id", controller.DeleteArtToy)
		router.GET("/arttoys/latest", controller.GetLatestArtToyID)
		// router.GET("/members/count", controller.CountMembers)
		// router.POST("/members/:id/subscribe", controller.CheckSubscription)

		// Category Routes
		router.GET("/categories", controller.ListCategories)
		router.GET("/category/:id", controller.GetCategory)
		router.POST("/categories", controller.CreateCategiory)
		router.PUT("/categories/:id", controller.UpdateCategory)
		router.DELETE("/categories/:id", controller.DeleteCategory)

		// Auction Routes
		router.GET("/auctions", controller.ListAuctionDetails)
		router.GET("/auction/:id", controller.GetAuctionDetail)
		router.POST("/auctions", controller.CreateAuctionDetail)
		router.PUT("/auctions/:id", controller.UpdateAuctionDetail)
		router.DELETE("/auctions/:id", controller.DeleteAuctionDetail)
		
		}
		
	}

	r.GET("/", func(c *gin.Context) {
		c.String(http.StatusOK, "API RUNNING... PORT: %s", PORT)
	})

	// Run the server

	r.Run("localhost:" + PORT)

}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE, PATCH")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}