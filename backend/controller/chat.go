package controller

import (
	"log"
	"net/http"

	"backend/config"
	"backend/entity"

	"github.com/gin-gonic/gin"
)

func CreateChat(c *gin.Context) {
	var chat entity.Chat

	// Bind to class variable
	if err := c.ShouldBindJSON(&chat); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Log incoming request data
	log.Printf("Received data: %+v\n", chat)

	db := config.DB()

	// Validate category
	var seller entity.Seller
	result := db.First(&seller, chat.SellerID)
	if result.Error != nil {
		log.Printf("Error finding seller: %v", result.Error)
		c.JSON(http.StatusNotFound, gin.H{"error": "seller not found"})
		return
	}

	//validate seller
	var bidder entity.Bidder
	db.First(&bidder, chat.BidderID)
	if bidder.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "bidder not found"})
		return
	}

	var auction entity.AuctionDetail
	db.First(&auction, chat.AuctionDetailID)
	if auction.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "auction not found"})
		return
	}

	// Create Category
	cat := entity.Chat{
		Chat:            chat.Chat,
		SellerID:        chat.SellerID,
		Seller:          seller,
		BidderID:        chat.BidderID,
		Bidder:          bidder,
		AuctionDetailID: chat.AuctionDetailID,
		AuctionDetail:   auction,
	}

	// Save to database
	if err := db.Create(&cat).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": cat})
}
