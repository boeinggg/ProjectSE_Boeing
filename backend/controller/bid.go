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
		c.JSON(http.StatusNotFound, gin.H{"error": "bidder not found"})
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

func GetBidHistoryByAuctionId(c *gin.Context) {
	auctionID := c.Param("auctionId") // ดึง auctionId จาก URL พารามิเตอร์
	var bids []entity.Bid

	// เชื่อมต่อฐานข้อมูล
	db := config.DB()

	// ดึงข้อมูล Bid ที่เกี่ยวข้องกับ Auction ID
	results := db.Preload("AuctionDetail").Preload("Bidder").
		Where("auction_detail_id = ?", auctionID).
		Order("created_at DESC"). // เรียงตามจำนวนเงิน bid
		Find(&bids)

	// ตรวจสอบว่าเกิด Error หรือไม่
	if results.Error != nil {
		if results.Error == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "No bid history found for this auction"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": results.Error.Error()})
		}
		return
	}

	// ถ้าไม่มี Bid ใน Auction นี้
	if len(bids) == 0 {
		c.JSON(http.StatusOK, gin.H{"message": "No bids placed for this auction."}) // ส่งข้อความ JSON
		return
	}

	// ส่งข้อมูล Bid History กลับในรูป JSON
	c.JSON(http.StatusOK, bids)
}
