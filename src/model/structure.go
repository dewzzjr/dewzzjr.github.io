package model

import (
	"html/template"
	"time"

	"dewzzjr.github.io/src/pkg/duration"
)

type Structure struct {
	Name         string               `yaml:"name"`
	Email        string               `yaml:"email"`
	Description  template.HTML        `yaml:"description"`
	About        []KeyRef             `yaml:"about"`
	Skills       []KeyRef             `yaml:"skills"`
	Experience   []Section[YearMonth] `yaml:"experience"`
	Organization []Section[string]    `yaml:"organization"`
	Education    []Section[string]    `yaml:"education"`
	Print        map[string]Options   `yaml:"print"`
}

type KeyRef struct {
	Key  string `yaml:"key"`
	Ref  string `yaml:"ref"`
	Name string `yaml:"name"`
}

type Section[T any] struct {
	Name        string        `yaml:"name"`
	Title       string        `yaml:"title"`
	Description template.HTML `yaml:"description"`
	Time        Duration[T]   `yaml:"time"`
}

type Duration[T any] struct {
	End      T `yaml:"end,omitempty"`
	Start    T `yaml:"start"`
	Duration func(end, start time.Time) string
}

type Options struct {
	Max *int `yaml:"max,omitempty"`
}

func Print(m map[string]Options, section string, index int) (class string) {
	option, ok := m[section]
	if !ok {
		return
	}
	if option.Max == nil {
		return
	}
	if index < *option.Max {
		return
	}
	return "print:hidden"
}

func Time(t Duration[YearMonth]) string {
	if t.End.Valid {
		d := duration.Diff(t.Start.Time, t.End.Time)
		return d.Format(duration.MONTH)
	}

	d := duration.Diff(t.Start.Time, time.Now())
	return d.Format(duration.MONTH)
}

type YearMonth struct {
	time.Time
	Valid bool
}

func (i YearMonth) MarshalYAML() (interface{}, error) {
	if !i.Valid {
		return "", nil
	}
	return i.Format("2006-01"), nil
}

func (i *YearMonth) UnmarshalYAML(unmarshal func(interface{}) error) error {
	var s string
	err := unmarshal(&s)
	if err != nil {
		return err
	}
	i.Time, err = time.Parse("2006-01", s)
	if err != nil {
		return nil
	}
	i.Valid = true
	return nil
}
