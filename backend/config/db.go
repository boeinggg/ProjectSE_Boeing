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

		// &entity.Gender{},

		&entity.Category{},

		&entity.Seller{},

		&entity.AuctionDetail{},

	)


	Category1 := entity.Category{Name: "Choose a category"}
	Category2 := entity.Category{Name: "Blind Box"}
	Category3 := entity.Category{Name: "Figure"}
	Category4 := entity.Category{Name: "MEGA 100%"}


	db.FirstOrCreate(&Category1, &entity.Category{Name: "Choose a category"})
	db.FirstOrCreate(&Category2, &entity.Category{Name: "Blind Box"})
	db.FirstOrCreate(&Category3, &entity.Category{Name: "Figure"})
	db.FirstOrCreate(&Category4, &entity.Category{Name: "MEGA 100%"})


	// hashedPassword, _ := HashPassword("123456")

	// BirthDay, _ := time.Parse("2006-01-02", "1988-11-12")

	// User := &entity.Users{

	// 	FirstName: "Software",

	// 	LastName:  "Analysis",

	// 	Email:     "sa@gmail.com",

	// 	Age:       80,

	// 	Password:  hashedPassword,

	// 	BirthDay:  BirthDay,

	// 	GenderID:  1,

	// }

	// db.FirstOrCreate(User, &entity.Users{

	// 	Email: "sa@gmail.com",

	// })


}