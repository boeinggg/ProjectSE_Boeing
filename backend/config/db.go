package config

import (
	"fmt"
	// "time"
	"backend/entity"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var db *gorm.DB

func DB() *gorm.DB {

	return db

}

func ConnectionDB() {

	database, err := gorm.Open(sqlite.Open("sa.db?cache=shared"), &gorm.Config{})

	if err != nil {

		panic("failed to connect database")

	}

	fmt.Println("connected database")

	db = database

}

func SetupDatabase() {

	db.AutoMigrate(

		&entity.ArtToy{},

		&entity.Gender{},

		&entity.Category{},

		&entity.Seller{},

		&entity.AuctionDetail{},

		&entity.Bidder{},

		&entity.Bid{},

		&entity.Chat{},
	)

	Category2 := entity.Category{Name: "Blind Box"}
	Category3 := entity.Category{Name: "Figure"}
	Category4 := entity.Category{Name: "MEGA 100%"}

	db.FirstOrCreate(&Category2, &entity.Category{Name: "Blind Box"})
	db.FirstOrCreate(&Category3, &entity.Category{Name: "Figure"})
	db.FirstOrCreate(&Category4, &entity.Category{Name: "MEGA 100%"})

	GenderMale := entity.Gender{Name: "Male"}
	GenderFemale := entity.Gender{Name: "Female"}

	db.FirstOrCreate(&GenderMale, &entity.Gender{Name: "Male"})
	db.FirstOrCreate(&GenderFemale, &entity.Gender{Name: "Female"})

	db.FirstOrCreate(&entity.Seller{

		Profile: "Seller Profile",

		FirstName: "Seller1",

		LastName: "Seller1",

		PhoneNumber: "093-090-XXXX",

		Email: "Seller@gmail.com",

		Age: 21,

		Address: "Pakchong,Nakorn Ratchasima",

		GenderID: 1,
	})

	db.FirstOrCreate(&entity.Seller{

		Profile: "Seller Profile",

		FirstName: "Seller2",

		LastName: "Seller2",

		PhoneNumber: "093-090-XXXX",

		Email: "Seller@gmail.com",

		Age: 21,

		Address: "Pakchong,Nakorn Ratchasima",

		GenderID: 1,
	})

	db.FirstOrCreate(&entity.Bidder{

		Profile: "Bidder Profile",

		FirstName: "Bidder1",

		LastName: "Bidder1",

		PhoneNumber: "093-090-XXXX",

		Email: "Bidder@gmail.com",

		Age: 21,

		Address: "Pakchong,Nakorn Ratchasima",

		GenderID: 1,
	})

}
