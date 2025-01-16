package entity

import (
	"gorm.io/gorm"
)

type Chat struct {
	gorm.Model
	Chat            string
	SellerID        uint
	Seller          Seller `gorm:"foreignKey:SellerID"`
	BidderID        uint
	Bidder          Bidder `gorm:"foreignKey:BidderID"`
	AuctionDetailID uint
	AuctionDetail   AuctionDetail `gorm:"foreignKey:AuctionDetailID"`
}
