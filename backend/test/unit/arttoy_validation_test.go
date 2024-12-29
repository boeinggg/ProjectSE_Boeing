package unit

import (
	// "fmt"
	"testing"
	// "time"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
	"backend/entity"
)

func TestArtToy_Name(t *testing.T) {

	g := NewGomegaWithT(t)

	t.Run(`name is required`, func(t *testing.T) {
		arttoy := entity.ArtToy{
			Name:           "", // ผิดตรงนี้
			Brand:          "unit",
			Material:       "unit",
			Size:           "unit",
			Description:    "unit",
			Picture:        "",
			CategoryID:     1,
			SellerID:       1,
			AuctionDetail:  nil,
		}

		// ตรวจสอบด้วย govalidator
		ok, err := govalidator.ValidateStruct(arttoy)

		// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
		g.Expect(ok).NotTo(BeTrue())
		// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
		g.Expect(err).NotTo(BeNil())

		// err.Error ต้องมี error message แสดงออกมา
		g.Expect(err.Error()).To(Equal("Name is required"))
	})

}

func TestArtToy_Valid(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("valid arttoy", func(t *testing.T) {
		// A valid user object
		arttoy := entity.ArtToy{
			Name:           "CRYBABY Sad Club Series-Plush Flower Blind Box", // ผิดตรงนี้
			Brand:          "Popmart",
			Material:       "100% polyester",
			Size:           "16cm*6cm*29cm",
			Description:    "This box is sky blue",
			Picture:        "A detailed profile description.",
			CategoryID:     1,
			SellerID:       1,
			AuctionDetail:  nil,
		}

		// ตรวจสอบด้วย govalidator
		ok, err := govalidator.ValidateStruct(arttoy)

		// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
		g.Expect(ok).To(BeTrue(), "Expected validation to pass, but it failed.")
		// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
		g.Expect(err).To(BeNil(), "Expected no validation errors, but got some.")
	})
}
