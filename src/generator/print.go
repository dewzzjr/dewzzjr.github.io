package generator

import (
	"context"

	pdf "github.com/SebastiaanKlippert/go-wkhtmltopdf"
)

func Print(ctx context.Context, input, output string) error {
	generate, err := pdf.NewPDFGenerator()
	if err != nil {
		return err
	}
	page := pdf.NewPage(input)
	generate.AddPage(page)
	if err := generate.Create(); err != nil {
		return err
	}
	if err := generate.WriteFile(output); err != nil {
		return err
	}
	return nil
}
