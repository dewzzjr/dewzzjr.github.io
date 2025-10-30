# Personal CV Website Generator

A Go-based static site generator that transforms a YAML CV file into a beautiful, responsive HTML website with PDF export capabilities.

## 🌟 Overview

This project generates a personal CV website from a single YAML configuration file. It uses Go templates for HTML generation and includes features like:

- **Static HTML generation** from structured YAML data
- **Responsive design** using TailwindCSS and DaisyUI
- **PDF export** capability for print-ready CVs
- **Duration calculation** for work experience (automatically calculates years/months)
- **Print optimization** with configurable section limits for PDF output
- **Template-based architecture** for easy customization

## 🏗️ Architecture

The project follows a clean architecture with the following components:

```text
┌─────────────────────────────────────────────────┐
│         curiculum-vitae.yaml                    │
│         (Your CV Data Source)                   │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│      Go Generator (main.go)                     │
│  ┌──────────────────────────────────────────┐   │
│  │  1. Parse YAML → Structure Model         │   │
│  │  2. Load HTML Templates                  │   │
│  │  3. Execute Templates with Data          │   │
│  │  4. Generate Static HTML                 │   │
│  └──────────────────────────────────────────┘   │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│            index.html                           │
│       (Generated Static Website)                │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼ (Optional)
┌─────────────────────────────────────────────────┐
│       PDF Generator (wkhtmltopdf)               │
│       Converts HTML to PDF                      │
└─────────────────────────────────────────────────┘
```

## 📋 Prerequisites

- **Go** 1.21.0 or higher
- **Node.js** and npm (for TailwindCSS)
- **wkhtmltopdf** (optional, for PDF generation)

### Installing wkhtmltopdf

**macOS:**

```bash
brew install wkhtmltopdf
```

**Ubuntu/Debian:**

```bash
sudo apt-get install wkhtmltopdf
```

**Windows:**

Download from [wkhtmltopdf.org](https://wkhtmltopdf.org/downloads.html)

## 🚀 Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/dewzzjr/dewzzjr.github.io.git
   cd dewzzjr.github.io
   ```

1. **Install Go dependencies:**

   ```bash
   go mod download
   ```

1. **Install Node.js dependencies (for TailwindCSS):**

   ```bash
   npm install
   ```

1. **Build TailwindCSS:**

   ```bash
   npx tailwindcss -i main.css -o public/main.css --minify
   ```

## 💻 Usage

### Generate HTML from YAML

The generator provides two main commands: `create` (for HTML generation) and `print` (for PDF export).

#### Basic Usage

Generate HTML with default settings:

```bash
go run src/cmd/generator/main.go create
```

This uses default values:

- Input: `curiculum-vitae.yaml`
- Templates: `./assets` directory
- Output: `index.html`

#### Custom Parameters

```bash
go run src/cmd/generator/main.go create \
  --input custom-cv.yaml \
  --path ./templates \
  --output output.html
```

**Flags:**

- `-i, --input`: YAML file containing CV data (default: `curiculum-vitae.yaml`)
- `-p, --path`: Directory containing HTML templates (default: `./assets`)
- `-o, --output`: Output HTML file path (default: `index.html`)

### Generate PDF

First, serve your HTML file locally (e.g., using Live Server on port 5500), then:

```bash
go run src/cmd/generator/main.go print \
  --input http://localhost:5500/ \
  --output cv-dewangga-prasetya.pdf
```

**Flags:**

- `-i, --input`: URL of the HTML page to convert (default: `http://localhost:5500/`)
- `-o, --output`: Output PDF file path (default: `print.pdf`)

## 📁 Project Structure

```text
.
├── assets/                      # HTML Templates
│   ├── components.html          # Reusable UI components
│   ├── head.html                # HTML head template
│   ├── index.html               # Main page template
│   ├── nav.html                 # Navigation template
│   └── content/                 # Content section templates
│       ├── about.html
│       ├── education.html
│       ├── experience.html
│       ├── organization.html
│       └── skills.html
├── src/
│   ├── cmd/
│   │   └── generator/
│   │       └── main.go          # CLI entry point
│   ├── generator/
│   │   ├── create.go            # HTML generation logic
│   │   └── print.go             # PDF generation logic
│   ├── model/
│   │   └── structure.go         # Data models and YAML mapping
│   └── pkg/
│       └── duration/
│           └── time.go          # Time duration utilities
├── curiculum-vitae.yaml         # CV data source
├── main.css                     # TailwindCSS input
├── tailwind.config.js           # TailwindCSS configuration
├── go.mod                       # Go dependencies
├── package.json                 # Node.js dependencies
└── index.html                   # Generated output
```

## 🔧 How It Works

### 1. Data Model (`src/model/structure.go`)

The CV structure is defined with strongly-typed Go structs that map to YAML:

```go
type Structure struct {
    Name         string
    Email        string
    Description  template.HTML
    About        []KeyRef
    Skills       []KeyRef
    Experience   []Section[YearMonth]
    Organization []Section[string]
    Education    []Section[string]
    Print        map[string]Options
}
```

**Key Features:**

- Generic `Section[T]` type supports both time-based (YearMonth) and string-based durations
- `YearMonth` type with custom YAML marshaling for date parsing
- Print configuration for controlling PDF output visibility

### 2. YAML Structure (`curiculum-vitae.yaml`)

Your CV data is organized in YAML format:

```yaml
name: Your Name
email: your.email@example.com
description: |-
  Your professional summary with <span class="font-semibold">HTML formatting</span>

about:
  - key: linkedin
    ref: https://linkedin.com/in/yourprofile
    name: yourprofile

experience:
  - name: Company Name
    title: Job Title
    time:
      start: 2023-01
      end: 2024-05  # Optional, omit for current position
    description: |-
      Job responsibilities and achievements

skills:
  - key: Golang
    ref: https://cdn.example.com/golang-icon.svg

print:
  organization:
    max: 2  # Only show first 2 items in PDF
  education:
    max: 1  # Only show first 1 item in PDF
```

### 3. Template System (`assets/`)

The project uses Go's `html/template` package with custom functions:

**Custom Template Functions:**

- `parseDuration`: Calculates and formats time duration (e.g., "2 years 3 months")
- `hiddenPrint`: Conditionally hides sections in print view based on `print` configuration

**Template Structure:**

```text
index.html                    # Main layout
├── head                      # <head> section with meta, styles
└── drawer                    # Main content wrapper
    ├── navbar                # Navigation bar
    └── content sections      # About, Skills, Experience, etc.
```

### 4. Duration Calculation (`src/pkg/duration/`)

Automatically calculates work experience duration:

```go
// For ongoing positions (no end date)
duration.Diff(startDate, time.Now())  // "2 years 5 months"

// For completed positions
duration.Diff(startDate, endDate)     // "1 year 3 months"
```

### 5. PDF Generation (`src/generator/print.go`)

Uses `wkhtmltopdf` to convert the live HTML page to PDF with print-optimized styling.

## 🎨 Customization

### Modifying Styles

1. **Edit TailwindCSS classes** in template files (`assets/*.html`)

1. **Add custom CSS** in `main.css`

1. **Rebuild styles:**

   ```bash
   npx tailwindcss -i main.css -o public/main.css --minify
   ```

### Modifying Templates

Edit HTML templates in the `assets/` directory:

- `assets/head.html` - Meta tags, links, scripts
- `assets/nav.html` - Navigation bar
- `assets/content/*.html` - Individual sections
- `assets/components.html` - Reusable components

After editing templates, regenerate HTML:

```bash
go run src/cmd/generator/main.go create
```

### Adding New Sections

1. **Update data model** in `src/model/structure.go`:

   ```go
   type Structure struct {
       // ... existing fields
       Projects []Section[YearMonth] `yaml:"projects"`
   }
   ```

1. **Add template** in `assets/content/projects.html`:

   ```html
   {{define "projects"}}
   <section id="projects">
     {{range .Projects}}
       <!-- Your template here -->
     {{end}}
   </section>
   {{end}}
   ```

1. **Include in main template** (`assets/index.html` or wherever needed):

   ```html
   {{template "projects" .}}
   ```

1. **Add data to YAML** (`curiculum-vitae.yaml`):

   ```yaml
   projects:
     - name: Project Name
       title: Your Role
       time:
         start: 2023-01
       description: Project details
   ```

## 🛠️ Development

### Building the Generator

```bash
go build -o cv-generator src/cmd/generator/main.go
./cv-generator create
```

### Running with Live Reload

Use a tool like `air` for Go live reload:

```bash
go install github.com/cosmtrek/air@latest
air
```

### Testing

```bash
go test ./...
```

## 📄 Print Configuration

Control what appears in PDF output using the `print` section in your YAML:

```yaml
print:
  organization:
    max: 2    # Only show first 2 organizations in PDF
  education:
    max: 1    # Only show first 1 education entry in PDF
```

Items beyond the `max` value receive the `print:hidden` class, which you can style in CSS:

```css
@media print {
  .print\:hidden {
    display: none;
  }
}
```

## 🔑 Key Dependencies

### Go Dependencies

- `github.com/urfave/cli/v3` - CLI framework
- `gopkg.in/yaml.v2` - YAML parsing
- `github.com/SebastiaanKlippert/go-wkhtmltopdf` - PDF generation

### Node Dependencies

- `tailwindcss` - Utility-first CSS framework
- `daisyui` - TailwindCSS component library

## 📝 License

See [LICENSE](LICENSE) file for details.

## 👤 Author

Dewangga Prasetya Praja

- Email: <dewzzpro@gmail.com>
- LinkedIn: [dewzzjr](https://www.linkedin.com/in/dewzzjr)
- GitHub: [dewzzjr](https://github.com/dewzzjr)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## ⭐ Show Your Support

Give a ⭐️ if this project helped you!

---

Happy CV Building! 🎉
