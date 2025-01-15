package entity

import (

	/*"time" กรณีใช้ ิ birthday BirthDay  time.Time `json:"birthday"`*/
	// "time"

	"gorm.io/gorm"
)

type Bidder struct {
	gorm.Model

	Profile string `gorm:"type:longtext"`

	FirstName string /*`json:"first_name"`*/

	LastName string /*`json:"last_name"`*/

	PhoneNumber string /*`json:"phone_number"`*/

	// BirthDay time.Time `json:"birthday"`

	Email string /*`json:"email"`*/

	// Password string /*`json:"-"`*/

	Age uint8 /*`json:"age"`*/

	Address string /*`json:"address"`*/

	GenderID uint   /*`json:"gender_id"`*/
	Gender   Gender `gorm:"foreignKey:GenderID"` // รับค่า GenderID

	// AdderssID    uint      /*`json:"gender_id"`*/
	// Address      Address  `gorm:"foreignKey:AddressID"` // รับค่า GenderID

	// Bidder []Bidder `gorm:"foreignKey:BidderID"`
	// UserID uint `json:"user_id"`

	// User *User `gorm:"foreignKey:user_id" json:"user"`
	Bids []Bid `gorm:"foreignKey:BidderID"`
}
