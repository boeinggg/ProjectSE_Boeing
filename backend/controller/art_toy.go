package controller

import (
	"log"
	"net/http"

	"backend/config"
	"backend/entity"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func CreateArtToy(c *gin.Context) {
    var arttoy entity.ArtToy

    // Bind to class variable
    if err := c.ShouldBindJSON(&arttoy); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // Log incoming request data
    log.Printf("Received data: %+v\n", arttoy)

    db := config.DB()

    // Validate category	
    var category entity.Category
	db.First(&category, arttoy.CategoryID)	
	if category.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "category not found"})	
		return
	}


	//validate seller
	// var seller entity.Seller
	// db.First(&seller, arttoy.SellerID)
	// if seller.ID == 0 {
	// 	c.JSON(http.StatusNotFound, gin.H{"error": "seller not found"})
	// 	return
	// }

    // Create ArtToy		
    at := entity.ArtToy{
        Name: arttoy.Name,
		Brand: arttoy.Brand,
		Material: arttoy.Material,
		Size: arttoy.Size,
		Description: arttoy.Description,
		Picture: arttoy.Picture,
		CategoryID: arttoy.CategoryID,
		Category: category,
		SellerID: arttoy.SellerID,
		Seller: arttoy.Seller,
	}
    

    // Save to database
    if err := db.Create(&at).Error; err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": at})
}


// GET /arttoy/:id
func GetArtToy(c *gin.Context) {
	ID := c.Param("id")
	var arttoy entity.ArtToy

	db := config.DB()
	results := db.Preload("Category").Preload("Seller").First(&arttoy, ID)
	if results.Error != nil {
        if results.Error == gorm.ErrRecordNotFound {
            c.JSON(http.StatusNotFound, gin.H{"error": "ArtToy not found"})
        } else {
            c.JSON(http.StatusInternalServerError, gin.H{"error": results.Error.Error()})
        }
        return
    }
	if arttoy.ID == 0 {
		c.JSON(http.StatusNoContent, gin.H{})
		return
	}
	c.JSON(http.StatusOK, arttoy)
}

// GET /arttoys
func ListArtToys(c *gin.Context) {

	var arttoys []entity.ArtToy

	db := config.DB()
	results := db.Preload("Category").Preload("Seller").Find(&arttoys)
	if results.Error != nil {
        if results.Error == gorm.ErrRecordNotFound {
            c.JSON(http.StatusNotFound, gin.H{"error": "ArtToy not found"})
        } else {
            c.JSON(http.StatusInternalServerError, gin.H{"error": results.Error.Error()})
        }
        return
    }
	c.JSON(http.StatusOK, arttoys)
}

// DELETE /arttoys/:id
func DeleteArtToy(c *gin.Context) {

	id := c.Param("id")
	db := config.DB()
	if tx := db.Exec("DELETE FROM art_toys WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})

}

// PATCH /arttoys
func UpdateArtToy(c *gin.Context) {
	var arttoy entity.ArtToy

	ArtToyID := c.Param("id")

	db := config.DB()
	result := db.First(&arttoy, ArtToyID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	if err := c.ShouldBindJSON(&arttoy); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	result = db.Save(&arttoy)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}

