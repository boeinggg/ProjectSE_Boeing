package unit

import (
	"fmt"
	// "strings"
	"testing"
	"time"

	"backend/entity"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestStartPrice(t *testing.T) {
        g := NewGomegaWithT(t)

        t.Run("start_price is required", func(t *testing.T) {
                auction := entity.AuctionDetail{
                        StartPrice:    0.0, // Invalid: StartPrice must be greater than 0
                        BidIncrement:  0,
                        CurrentPrice: 100.0,
                        StartDateTime: time.Now(),
                        EndDateTime:   time.Now().Add(24 * time.Hour),
                        Status:        "open",
                        ArtToyID:      1,
                }

                // Validate the struct
                ok, err := govalidator.ValidateStruct(auction)

                // Debug prints to show the result of validation
                fmt.Printf("Validation OK: %v\n", ok)
                if err != nil {
                        fmt.Printf("Validation Error: %v\n", err)
                }

                // Validation should fail
                g.Expect(ok).NotTo(BeTrue())
                g.Expect(err).NotTo(BeNil())
                g.Expect(err.Error()).To(ContainSubstring("Start Price is required"))
        })

		t.Run("Start Price must be a number", func(t *testing.T) {
			auction := entity.AuctionDetail{
					StartPrice:    0.0, // Invalid: StartPrice must be greater than 0
					BidIncrement:  0,
					CurrentPrice: 100.0,
					StartDateTime: time.Now(),
					EndDateTime:   time.Now().Add(24 * time.Hour),
					Status:        "open",
					ArtToyID:      1,
			}

			// Validate the struct
			ok, err := govalidator.ValidateStruct(auction)

			// Debug prints to show the result of validation
			fmt.Printf("Validation OK: %v\n", ok)
			if err != nil {
					fmt.Printf("Validation Error: %v\n", err)
			}

			// Validation should fail
			g.Expect(ok).NotTo(BeTrue())
			g.Expect(err).NotTo(BeNil())
			g.Expect(err.Error()).To(ContainSubstring("Start Price must be a number"))
	})

		t.Run("Bid is required", func(t *testing.T) {
			auction := entity.AuctionDetail{
					StartPrice:    100.0, 
					BidIncrement:  0,
					CurrentPrice: 100.0,
					StartDateTime: time.Now(),
					EndDateTime:   time.Now().Add(24 * time.Hour),
					Status:        "open",
					ArtToyID:      1,
			}

			// Validate the struct
			ok, err := govalidator.ValidateStruct(auction)

			// Debug prints to show the result of validation
			fmt.Printf("Validation OK: %v\n", ok)
			if err != nil {
					fmt.Printf("Validation Error: %v\n", err)
			}

			// Validation should fail
			g.Expect(ok).NotTo(BeTrue())
			g.Expect(err).NotTo(BeNil())
			g.Expect(err.Error()).To(ContainSubstring("Bid is required"))
	})

		t.Run("Bid must be a non-negative integer", func(t *testing.T) {
			auction := entity.AuctionDetail{
					StartPrice:    100.0, 
					BidIncrement:  -5,
					CurrentPrice: 100.0,
					StartDateTime: time.Now(),
					EndDateTime:   time.Now().Add(24 * time.Hour),
					Status:        "open",
					ArtToyID:      1,
			}

			// Validate the struct
			ok, err := govalidator.ValidateStruct(auction)

			// Debug prints to show the result of validation
			fmt.Printf("Validation OK: %v\n", ok)
			if err != nil {
					fmt.Printf("Validation Error: %v\n", err)
			}

			// Validation should fail
			g.Expect(ok).NotTo(BeTrue())
			g.Expect(err).NotTo(BeNil())
			g.Expect(err.Error()).To(ContainSubstring("Bid must be a non-negative integer"))
	})
}



func TestAuction_Valid(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("valid auction", func(t *testing.T) {
		// Mock ArtToy object
		artToy := entity.ArtToy{
			Name:           "CRYBABY Sad Club Series-Plush Flower Blind Box", // ผิดตรงนี้
			Brand:          "Popmart",
			Material:       "100% polyester",
			Size:           "16cm*6cm*29cm",
			Description:    "This box is sky blue",
			Picture:        "A detailed profile description.",
			CategoryID:     1,
			SellerID:       1,
		}

		// Mock AuctionDetail with valid data
		auction := entity.AuctionDetail{
			StartPrice:    100.0,
			BidIncrement:  10,
			CurrentPrice:  100.0,
			StartDateTime: time.Now(),
			EndDateTime:   time.Now().Add(24 * time.Hour),
			Status:        "open",
			ArtToyID:      1,
			ArtToy:        artToy, // Include the valid ArtToy object
		}

		// Validate AuctionDetail
		ok, err := govalidator.ValidateStruct(auction)

		// Debugging: print validation results
		fmt.Printf("Validation OK: %v\n", ok)
		if err != nil {
			fmt.Printf("Validation Error: %v\n", err)
		}

		// Expect validation to pass
		g.Expect(ok).To(BeTrue(), "Expected validation to pass, but it failed.")
		g.Expect(err).To(BeNil(), "Expected no validation errors, but got some.")
	})
}
