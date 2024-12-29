package controller

import (
	"log"
	"net/http"

	"backend/config"
	"backend/entity"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func CreateCategiory(c *gin.Context) {
    var cat entity.Category

    // Bind to class variable
    if err := c.ShouldBindJSON(&cat); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // Log incoming request data
    log.Printf("Received data: %+v\n", cat)

    db := config.DB()



    // Create Category		
    category := entity.Category{
        Name: cat.Name,
	}
    

    // Save to database
    if err := db.Create(&category).Error; err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": category})
}


// GET /Category/:id
func GetCategory(c *gin.Context) {
	ID := c.Param("id")
	var cat entity.Category

	db := config.DB()
	results := db.First(&cat, ID)
	if results.Error != nil {
        if results.Error == gorm.ErrRecordNotFound {
            c.JSON(http.StatusNotFound, gin.H{"error": "Category not found"})
        } else {
            c.JSON(http.StatusInternalServerError, gin.H{"error": results.Error.Error()})
        }
        return
    }
	if cat.ID == 0 {
		c.JSON(http.StatusNoContent, gin.H{})
		return
	}
	c.JSON(http.StatusOK, cat)
}

// GET /Category
func ListCategories(c *gin.Context) {

	var cats []entity.Category

	db := config.DB()
	results := db.Find(&cats)
	if results.Error != nil {
        if results.Error == gorm.ErrRecordNotFound {
            c.JSON(http.StatusNotFound, gin.H{"error": "Category not found"})
        } else {
            c.JSON(http.StatusInternalServerError, gin.H{"error": results.Error.Error()})
        }
        return
    }
	c.JSON(http.StatusOK, cats)
}

// DELETE /Category/:id
func DeleteCategory(c *gin.Context) {

	id := c.Param("id")
	db := config.DB()
	if tx := db.Exec("DELETE FROM categories WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})

}

// PATCH /Category
func UpdateCategory(c *gin.Context) {
	var cat entity.Category

	CatID := c.Param("id")

	db := config.DB()
	result := db.First(&cat, CatID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	if err := c.ShouldBindJSON(&cat); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	result = db.Save(&cat)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}

