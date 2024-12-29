package entity

import (

	"gorm.io/gorm"
)

type ArtToy struct {
	gorm.Model

	Name           string `valid:"required~Name is required"` 
	Brand          string `valid:"required~Brand is required"`    
	Material       string `valid:"required~Material is required"` 
	Size           string `valid:"required~Size is required"`     
	Description    string `valid:"required~Description is required"` 
	Picture        string `gorm:"type:longtext"`  

	CategoryID     uint    `valid:"required~Category is required"`
	Category       Category  `gorm:"foreignKey:CategoryID"` 

	SellerID       uint      `valid:"required~Seller is required"`
	Seller         Seller    `gorm:"foreignKey:SellerID"`

	AuctionDetail []AuctionDetail `gorm:"foreignKey:ArtToyID"`

}