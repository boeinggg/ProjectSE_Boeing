package entity

import (
	"time"

	"github.com/asaskevich/govalidator"
	"gorm.io/gorm"
)

type AuctionDetail struct {
	gorm.Model
	StartPrice    float64   `valid:"required~Start Price is required, float~Start Price must be a number, customMin~Start Price must be greater than 0"`
	BidIncrement  int       `valid:"required~Bid is required, customBidMin~Bid must be a non-negative integer"`
	CurrentPrice  float64   `valid:"required~Current Price is required, float~Current Price must be a number, customMin~Current Price must be greater than 0"`
	EndPrice      float64   `valid:"float~End Price must be a number"`
	StartDateTime time.Time `valid:"required~Start Date and Time is required"`
	EndDateTime   time.Time `valid:"required~End Date and Time is required"`
	Status        string    `valid:"required~Status is required"`
	ArtToyID      uint      `valid:"required~ArtToyID is required"`
	ArtToy        ArtToy    `gorm:"foreignKey:ArtToyID"`

	Bid []Bid `gorm:"foreignKey:AuctionDetailID"`

	Chats []Chat `gorm:"foreignKey:AuctionDetailID"`
}

func init() {
	// Register custom validation for minimum float value > 0
	govalidator.CustomTypeTagMap.Set("customMin", func(i interface{}, context interface{}) bool {
		if v, ok := i.(float64); ok {
			return v > 0
		}
		return false
	})

	// Register custom validation for Bid to ensure it's a non-negative integer
	govalidator.CustomTypeTagMap.Set("customBidMin", func(i interface{}, context interface{}) bool {
		if v, ok := i.(int); ok {
			return v >= 0
		}
		return false
	})
}
