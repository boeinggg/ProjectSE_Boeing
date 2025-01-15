package entity

import (

	"gorm.io/gorm"
)

type Bid struct {
	gorm.Model

	BidAmount int `valid:"required~Bid is required, customBidMin~Bid must be a non-negative integer"`
	
	AuctionDetailID     uint    `valid:"required~Auction Detail is required"`
	AuctionDetail       AuctionDetail  `gorm:"foreignKey:AuctionDetailID"` 

	BidderID     uint    `valid:"required~Auction Detail is required"`
	Bidder       Bidder  `gorm:"foreignKey:BidderID"`

}