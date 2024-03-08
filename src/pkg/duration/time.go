package duration

import (
	"fmt"
	"strings"
	"time"
)

type Duration struct {
	Year, Month, Day, Hour, Minute, Second int
}

func (d Duration) Get(f Format) int {
	switch f {
	case YEAR:
		return d.Year
	case MONTH:
		return d.Month
	case DAY:
		return d.Day
	case HOUR:
		return d.Hour
	case MINUTE:
		return d.Minute
	case SECOND:
		return d.Second
	default:
		return 0
	}
}

type Format int

const (
	YEAR Format = iota
	MONTH
	DAY
	HOUR
	MINUTE
	SECOND
)

func (f Format) String() string {
	return []string{
		"year", "month", "day", "hour", "minute", "second",
	}[f]
}

func (d Duration) Format(f Format) (str string) {
	var first bool
	for i := YEAR; i <= SECOND; i++ {
		if (d.Get(i) == 0 && f == i && !first) || d.Get(i) > 0 {
			str += fmt.Sprintf("%d %s", d.Get(i), i.String())
			if d.Get(i) > 1 {
				str += "s"
			}

			str += " "
			first = true
		}

		if f == i {
			str = strings.TrimSpace(str)
			return
		}
	}

	return
}

func Diff(a, b time.Time) Duration {
	if a.Location() != b.Location() {
		b = b.In(a.Location())
	}
	if a.After(b) {
		a, b = b, a
	}
	y1, M1, d1 := a.Date()
	y2, M2, d2 := b.Date()

	h1, m1, s1 := a.Clock()
	h2, m2, s2 := b.Clock()

	year := int(y2 - y1)
	month := int(M2 - M1)
	day := int(d2 - d1)
	hour := int(h2 - h1)
	min := int(m2 - m1)
	sec := int(s2 - s1)

	// Normalize negative values
	if sec < 0 {
		sec += 60
		min--
	}
	if min < 0 {
		min += 60
		hour--
	}
	if hour < 0 {
		hour += 24
		day--
	}
	if day < 0 {
		// days in month:
		t := time.Date(y1, M1, 32, 0, 0, 0, 0, time.UTC)
		day += 32 - t.Day()
		month--
	}
	if month < 0 {
		month += 12
		year--
	}

	return Duration{year, month, day, hour, min, sec}
}
