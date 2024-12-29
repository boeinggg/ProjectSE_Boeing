package entity

import (
	"gorm.io/gorm"
)

type Category struct {
	gorm.Model
	Name string

	ArtToys []ArtToy `gorm:"foreignKey:CategoryID"`
}