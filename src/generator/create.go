package generator

import (
	"context"
	"fmt"
	"html/template"
	"os"
	"strings"

	"dewzzjr.github.io/src/model"
	"gopkg.in/yaml.v2"
)

func Create(c context.Context, path, input, output string) error {
	t := template.New("").Funcs(template.FuncMap{
		"parseDuration": model.Time,
	})
	t, err := t.ParseGlob(strings.TrimSuffix(path, "/") + "/*.html")
	if err != nil {
		return err
	}
	t, err = t.ParseGlob(strings.TrimSuffix(path, "/") + "/*/*.html")
	if err != nil {
		return err
	}
	fmt.Println("path:", path)
	i, err := os.ReadFile(input)
	if err != nil {
		return err
	}
	fmt.Println("input:", input, len(t.Templates()))
	var structure model.Structure
	err = yaml.Unmarshal(i, &structure)
	if err != nil {
		fmt.Println(err)
		return err
	}
	fmt.Println("yaml: success")
	f, err := os.Create(output)
	if err != nil {
		return err
	}
	fmt.Println("output:", f.Name())
	err = t.ExecuteTemplate(f, "index.html", structure)
	if err != nil {
		return err
	}
	return nil
}
