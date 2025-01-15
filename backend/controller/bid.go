package controller

import (
	"log"
	"net/http"

	"backend/config"
	"backend/entity"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func CreateBid(c *gin.Context) {
	var bid entity.Bid

	// Bind to bid variable
	if err := c.ShouldBindJSON(&bid); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Log incoming request data
	log.Printf("Received data: %+v\n", bid)

	db := config.DB()

	// Validate AuctionDetail
	var auction entity.AuctionDetail
	db.First(&auction, bid.AuctionDetailID)
	if auction.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "auction not found"})
		return
	}

	log.Printf("AuctionDetailID received: %d\n", bid.AuctionDetailID)

	// Validate Bidder
	var bidder entity.Bidder
	db.First(&bidder, bid.BidderID)
	if bidder.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "seller not found"})
		return
	}

	// Create Bid
	b := entity.Bid{
		BidAmount:       bid.BidAmount,
		AuctionDetailID: bid.AuctionDetailID,
		AuctionDetail:   auction,
		BidderID:        bid.BidderID,
		Bidder:          bidder,
	}

	// Save to database
	if err := db.Create(&b).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": b})
}

// GET /bid/:id
func GetBid(c *gin.Context) {
	ID := c.Param("id")
	var bid entity.Bid

	db := config.DB()
	results := db.Preload("AuctionDetail").Preload("Bidder").First(&bid, ID)
	if results.Error != nil {
		if results.Error == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Bid not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": results.Error.Error()})
		}
		return
	}
	if bid.ID == 0 {
		c.JSON(http.StatusNoContent, gin.H{})
		return
	}
	c.JSON(http.StatusOK, bid)
}

// GET /Bids
func ListBids(c *gin.Context) {

	var bids []entity.Bid

	db := config.DB()
	results := db.Preload("AuctionDetail").Preload("Bidder").Find(&bids)
	if results.Error != nil {
		if results.Error == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Bids not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": results.Error.Error()})
		}
		return
	}
	c.JSON(http.StatusOK, bids)
}
