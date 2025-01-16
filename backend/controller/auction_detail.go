package controller

import (
	"log"
	"net/http"

	// "time"

	// "time"

	"backend/config"
	"backend/entity"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func CreateAuctionDetail(c *gin.Context) {
	var auction entity.AuctionDetail

	// Bind to class variable
	if err := c.ShouldBindJSON(&auction); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Log incoming request data
	log.Printf("Received data: %+v\n", auction)

	db := config.DB()

	// Validate arttoy
	var arttoy entity.ArtToy
	db.First(&arttoy, auction.ArtToyID)
	if arttoy.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "arttoy not found"})
		return
	}

	//validate seller
	// var seller entity.Seller
	// db.First(&seller, arttoy.SellerID)
	// if seller.ID == 0 {
	// 	c.JSON(http.StatusNotFound, gin.H{"error": "seller not found"})
	// 	return
	// }

	// Create AuctionDetail
	// startDateTime, _ := time.Parse("2006-01-02 15:04:05", "2024-12-29 16:00:00")
	// endDateTime , _ := time.Parse("2006-01-02 15:04:05", "2024-12-29 16:00:00")
	at := entity.AuctionDetail{
		StartPrice:    auction.StartPrice,
		BidIncrement:  auction.BidIncrement,
		CurrentPrice:  auction.CurrentPrice,
		EndPrice:      auction.EndPrice,
		StartDateTime: auction.StartDateTime,
		EndDateTime:   auction.EndDateTime,
		Status:        auction.Status,
		ArtToyID:      arttoy.ID,
		ArtToy:        arttoy,
	}

	// Save to database
	if err := db.Create(&at).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": at})
}

// GET /auctiondetails/:id
func GetAuctionDetail(c *gin.Context) {
	ID := c.Param("id")
	var auction entity.AuctionDetail

	db := config.DB()
	results := db.Preload("ArtToy").First(&auction, ID)
	if results.Error != nil {
		if results.Error == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "auction not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": results.Error.Error()})
		}
		return
	}
	if auction.ID == 0 {
		c.JSON(http.StatusNoContent, gin.H{})
		return
	}
	c.JSON(http.StatusOK, auction)
}

// GET /AuctionDetails
func ListAuctionDetails(c *gin.Context) {

	var auction []entity.AuctionDetail

	db := config.DB()
	results := db.Preload("ArtToy").Find(&auction)
	if results.Error != nil {
		if results.Error == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "auction not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": results.Error.Error()})
		}
		return
	}
	c.JSON(http.StatusOK, auction)
}

// DELETE /auction/:id
func DeleteAuctionDetail(c *gin.Context) {

	id := c.Param("id")
	db := config.DB()

	// Begin a database transaction
	tx := db.Begin()
	if err := tx.Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		} else if err := tx.Commit().Error; err != nil {
			tx.Rollback()
		}
	}()

	// Execute the DELETE query within the transaction
	result := tx.Exec("DELETE FROM auction_details WHERE id = ?", id)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	rowsAffected := result.RowsAffected
	if rowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})
}

// PATCH /auctions
func UpdateAuctionDetail(c *gin.Context) {
	var auction entity.AuctionDetail

	AuctionDetailID := c.Param("id")

	db := config.DB()
	result := db.First(&auction, AuctionDetailID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	if err := c.ShouldBindJSON(&auction); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	result = db.Save(&auction)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}

// PATCH /auctions/:id/status
func UpdateAuctionStatus(c *gin.Context) {
	auctionId := c.Param("id")
	var auction entity.AuctionDetail
	var updatedStatus struct {
		Status string `json:"status"`
	}

	// รับค่าจาก body เพื่ออัปเดตสถานะ
	if err := c.ShouldBindJSON(&updatedStatus); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	db := config.DB()

	// ค้นหาข้อมูลการประมูลในฐานข้อมูล
	result := db.First(&auction, auctionId)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Auction not found"})
		return
	}

	// อัปเดตสถานะ
	auction.Status = updatedStatus.Status

	// บันทึกข้อมูลการประมูลที่อัปเดตแล้ว
	if err := db.Save(&auction).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update auction status"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Auction status updated successfully", "data": auction})
}

// PATCH /auctions/:id/price
func UpdateAuctionPrice(c *gin.Context) {
	auctionId := c.Param("id") // Get the auction ID from the URL parameter
	var auction entity.AuctionDetail
	var updatedPrice struct {
		CurrentPrice float64 `json:"currentPrice"` // Expecting a JSON body with CurrentPrice
	}

	// Bind the JSON payload to updatedPrice
	if err := c.ShouldBindJSON(&updatedPrice); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	db := config.DB()

	// Find the auction record in the database
	result := db.First(&auction, auctionId)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Auction not found"})
		return
	}

	// Update the CurrentPrice field
	auction.CurrentPrice = updatedPrice.CurrentPrice

	// Save the updated auction record
	if err := db.Save(&auction).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update auction price"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Auction price updated successfully",
		"data":    auction,
	})
}
