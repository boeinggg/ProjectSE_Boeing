package unit

import (
	"testing"

	"backend/entity"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestArtToy_Validation(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("name is required", func(t *testing.T) {
		arttoy := entity.ArtToy{
			Name:        "",
			Brand:       "Popmart",
			Material:    "Plastic",
			Size:        "16cm",
			Description: "A collectible toy.",
			Picture:     "example.jpg",
			CategoryID:  1,
			SellerID:    1,
		}

		ok, err := govalidator.ValidateStruct(arttoy)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("Name is required"))
	})

	t.Run("brand is required", func(t *testing.T) {
		arttoy := entity.ArtToy{
			Name:        "Art Toy 1",
			Brand:       "",
			Material:    "Plastic",
			Size:        "16cm",
			Description: "A collectible toy.",
			Picture:     "example.jpg",
			CategoryID:  1,
			SellerID:    1,
		}

		ok, err := govalidator.ValidateStruct(arttoy)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("Brand is required"))
	})

	t.Run("material is required", func(t *testing.T) {
		arttoy := entity.ArtToy{
			Name:        "Art Toy 1",
			Brand:       "Popmart",
			Material:    "",
			Size:        "16cm",
			Description: "A collectible toy.",
			Picture:     "example.jpg",
			CategoryID:  1,
			SellerID:    1,
		}

		ok, err := govalidator.ValidateStruct(arttoy)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("Material is required"))
	})

	t.Run("size is required", func(t *testing.T) {
		arttoy := entity.ArtToy{
			Name:        "Art Toy 1",
			Brand:       "Popmart",
			Material:    "Plastic",
			Size:        "",
			Description: "A collectible toy.",
			Picture:     "example.jpg",
			CategoryID:  1,
			SellerID:    1,
		}

		ok, err := govalidator.ValidateStruct(arttoy)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("Size is required"))
	})

	t.Run("description is required", func(t *testing.T) {
		arttoy := entity.ArtToy{
			Name:        "Art Toy 1",
			Brand:       "Popmart",
			Material:    "Plastic",
			Size:        "16cm",
			Description: "",
			Picture:     "example.jpg",
			CategoryID:  1,
			SellerID:    1,
		}

		ok, err := govalidator.ValidateStruct(arttoy)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("Description is required"))
	})

	t.Run("category is required", func(t *testing.T) {
		arttoy := entity.ArtToy{
			Name:        "Art Toy 1",
			Brand:       "Popmart",
			Material:    "Plastic",
			Size:        "16cm",
			Description: "A collectible toy.",
			Picture:     "example.jpg",
			CategoryID:  0, // Invalid category
			SellerID:    1,
		}

		ok, err := govalidator.ValidateStruct(arttoy)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("Category is required"))
	})

	t.Run("seller is required", func(t *testing.T) {
		arttoy := entity.ArtToy{
			Name:        "Art Toy 1",
			Brand:       "Popmart",
			Material:    "Plastic",
			Size:        "16cm",
			Description: "A collectible toy.",
			Picture:     "example.jpg",
			CategoryID:  1,
			SellerID:    0, // Invalid seller
		}

		ok, err := govalidator.ValidateStruct(arttoy)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("Seller is required"))
	})

	t.Run("valid arttoy", func(t *testing.T) {
		arttoy := entity.ArtToy{
			Name:        "CRYBABY Sad Club Series-Plush Flower Blind Box",
			Brand:       "Popmart",
			Material:    "100% polyester",
			Size:        "16cm*6cm*29cm",
			Description: "This box is sky blue",
			Picture:     "A detailed profile description.",
			CategoryID:  1,
			SellerID:    1,
		}

		ok, err := govalidator.ValidateStruct(arttoy)
		g.Expect(ok).To(BeTrue(), "Expected validation to pass, but it failed.")
		g.Expect(err).To(BeNil(), "Expected no validation errors, but got some.")
	})
}
