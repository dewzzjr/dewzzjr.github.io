package main

import (
	"context"
	"log"
	"os"

	"dewzzjr.github.io/src/generator"
	"github.com/urfave/cli/v3"
)

func main() {
	cmd := &cli.Command{
		DefaultCommand: "create",
		Commands: []*cli.Command{
			{
				Name: "create",
				Flags: []cli.Flag{
					&cli.StringFlag{
						Name:    "path",
						Value:   "./assets",
						Usage:   "Directory to template files",
						Aliases: []string{"p"},
					},
					&cli.StringFlag{
						Name:    "input",
						Value:   "curiculum-vitae.yaml",
						Usage:   "YAML file for input resource",
						Aliases: []string{"i"},
					},
					&cli.StringFlag{
						Name:    "output",
						Value:   "index.html",
						Usage:   "Generated HTML output file",
						Aliases: []string{"o"},
					},
				},
				Action: func(ctx context.Context, c *cli.Command) error {
					return generator.Create(ctx, c.String("path"), c.String("input"), c.String("output"))
				},
			},
			{
				Name: "print",
				Flags: []cli.Flag{
					&cli.StringFlag{
						Name:    "input",
						Value:   "http://localhost:5500/",
						Usage:   "HTML to be generated as PDF",
						Aliases: []string{"i"},
					},
					&cli.StringFlag{
						Name:    "output",
						Value:   "print.pdf",
						Usage:   "Generated PDF output file",
						Aliases: []string{"o"},
					},
				},
				Action: func(ctx context.Context, c *cli.Command) error {
					return generator.Print(ctx, c.String("input"), c.String("output"))
				},
			},
		},
	}

	if err := cmd.Root().Run(context.Background(), os.Args); err != nil {
		log.Fatalln(err)
	}
}
