package entity


import (

	"gorm.io/gorm"

)

type Seller struct {

	gorm.Model

	Profile      string `gorm:"type:longtext"`
	FirstName    string    
	LastName     string    
	PhoneNumber  string    
	Email        string    
	Age          uint8     
	Address      string 

	GenderID     uint     
	Gender       Gender  `gorm:"foreignKey:GenderID"` 

   	// AddressID    uint
   	// Address      Address `gorm:"foreignKey:AddressID"`

	ArtToy       []ArtToy `gorm:"foreignKey:SellerID"` 

	Chats       []Chat `gorm:"foreignKey:SellerID"` 
}