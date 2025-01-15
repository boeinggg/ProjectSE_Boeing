package entity

import "gorm.io/gorm"

type Gender struct {
	gorm.Model
	Name string

	
	// Users []User `gorm:"foreignKey:GenderID"`

	// Admin []Admin `gorm:"foreignKey:GenderID"`
	
	Seller []Seller `gorm:"foreignKey:GenderID"`
	
	Bidder []Bidder `gorm:"foreignKey:GenderID"`

}
