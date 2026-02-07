# NARA Website Optimization Agent

## Overview

An automated Python-based tool for analyzing and optimizing the NARA (National Aquatic Resources Research and Development Agency of Sri Lanka) website. This agent performs comprehensive audits, identifies issues, and provides actionable recommendations while preserving the existing visual design.

## Features

### Phase 1: Comprehensive Audit and Analysis
- ✅ Website crawling and structure mapping
- ✅ Information Architecture (IA) analysis
- ✅ Content inventory and categorization
- ✅ Navigation flow mapping

### Phase 2: Issue Detection
- ✅ Duplicate content identification
- ✅ Broken link detection (internal & external)
- ✅ Placeholder text discovery
- ✅ Accessibility issues (WCAG compliance)
- ✅ Semantic HTML structure analysis

### Phase 3: Content Optimization
- ✅ Heading hierarchy fixes
- ✅ SEO metadata analysis
- ✅ Image alt text validation
- ✅ External link security (target="_blank", rel="noopener")
- ✅ Code cleanup and optimization

### Phase 4: Reporting
- ✅ Detailed JSON reports
- ✅ Human-readable Markdown reports
- ✅ Actionable recommendations
- ✅ Priority-based issue listing

## Installation

### Prerequisites
- Python 3.8 or higher
- pip package manager

### Setup

1. **Clone or download the project files**

2. **Install dependencies**
```bash
pip install -r requirements.txt
```

Or install manually:
```bash
pip install beautifulsoup4 requests lxml
```

## Usage

### Basic Usage

Run the analyzer on the NARA website:

```bash
python nara_optimizer.py
```

### Custom Options

```bash
# Specify custom URL
python nara_optimizer.py --url https://nara-web-73384.web.app/

# Set custom output directory
python nara_optimizer.py --output my_analysis

# Limit number of pages to crawl
python nara_optimizer.py --max-pages 50
```

### Full Command Options

```bash
python nara_optimizer.py --help
```

```
usage: nara_optimizer.py [-h] [--url URL] [--output OUTPUT] [--max-pages MAX_PAGES]

NARA Website Optimization Agent

optional arguments:
  -h, --help            show this help message and exit
  --url URL             Base URL of the NARA website (default: https://nara-web-73384.web.app/)
  --output OUTPUT       Output directory for analysis results (default: nara_analysis)
  --max-pages MAX_PAGES Maximum number of pages to crawl (default: 100)
```

## Using as a Python Module

You can also import and use the optimizer in your own scripts:

```python
from nara_optimizer import NARAWebsiteOptimizer

# Create optimizer instance
optimizer = NARAWebsiteOptimizer(
    base_url='https://nara-web-73384.web.app/',
    output_dir='my_analysis'
)

# Run complete analysis
report = optimizer.run_complete_analysis()

# Or run individual analysis phases
optimizer.crawl_website(max_pages=50)
optimizer.analyze_information_architecture()
optimizer.detect_duplicate_content()
optimizer.find_placeholder_text()
optimizer.check_link_integrity()
optimizer.analyze_page_metadata()
report = optimizer.generate_optimization_report()
```

## Content Optimization Module

Use the content optimizer for HTML improvements:

```python
from content_optimizer import ContentOptimizer, DuplicateContentResolver

# Optimize HTML structure
optimizer = ContentOptimizer()
optimized_html, modifications = optimizer.optimize_html_structure(
    html_content,
    page_url='https://example.com/page'
)

# Analyze duplicate content
resolver = DuplicateContentResolver()
resolutions = resolver.analyze_duplicates(duplicate_groups)

# Generate proposed sitemap
sitemap = optimizer.generate_sitemap_structure(pages)
```

## Output Files

After running the analysis, you'll find the following files in the output directory:

### 1. `optimization_report.json`
Complete machine-readable report with all analysis data:
- Summary statistics
- Information architecture mapping
- Duplicate content details
- Broken links list
- Placeholder text locations
- Page metadata
- Actionable recommendations

### 2. `OPTIMIZATION_REPORT.md`
Human-readable Markdown report with:
- Executive summary
- Key recommendations (prioritized)
- Duplicate content details
- Broken links list
- Placeholder text instances
- Accessibility issues

## Report Structure

### Executive Summary
```
- Total Pages Analyzed: 45
- Broken Links: 12
- Duplicate Content Issues: 5
- Placeholder Text Instances: 23
- Pages with Accessibility Issues: 18
```

### Key Recommendations

Each recommendation includes:
- **Category**: Navigation, Content, Accessibility, Links
- **Priority**: High, Medium, Low
- **Issue**: Description of the problem
- **Recommendation**: Specific action to take

### Example Recommendation

```markdown
### 1. Content - High Priority

**Issue:** Found 5 duplicate or similar content issues

**Recommendation:** Consolidate duplicate pages and redirect old URLs to the canonical version
```

## Understanding the Analysis

### Duplicate Content Detection

The agent identifies two types of duplicates:

1. **Exact Duplicates**: Pages with identical content
   - Resolution: Keep one canonical version, redirect others

2. **Similar Content**: Pages with >85% similarity
   - Resolution: Review and either merge or differentiate

### Information Architecture Analysis

The agent maps:
- Current navigation structure
- Page hierarchy
- URL patterns
- Menu inconsistencies

And proposes:
- Logical categorization
- Simplified navigation
- Consolidated menu structure

### Accessibility Issues

Common issues detected:
- Missing or multiple H1 headings
- Broken heading hierarchy
- Images without alt text
- Missing semantic HTML tags
- Poor contrast ratios (future feature)

## Best Practices

### Running the Analysis

1. **Start with a limited crawl** (--max-pages 20) to test
2. **Review the reports** carefully before making changes
3. **Backup your codebase** before applying modifications
4. **Test changes** on a staging environment first

### Interpreting Results

- **High Priority**: Fix immediately (accessibility, broken links)
- **Medium Priority**: Plan for next sprint (navigation, duplicates)
- **Low Priority**: Include in future improvements (code cleanup)

### Applying Fixes

1. **Accessibility fixes**: Can be automated
2. **Duplicate content**: Requires manual review
3. **Navigation changes**: Test thoroughly
4. **Content updates**: Coordinate with content team

## Limitations

### Current Limitations

- Cannot access password-protected pages
- Limited JavaScript execution (static HTML only)
- External link checking is rate-limited
- Requires manual review of content recommendations

### What It Doesn't Change

As per the requirements, the agent **DOES NOT** modify:
- Visual design
- CSS frameworks
- Color schemes
- Typography
- Component designs (buttons, cards, headers)
- Layout structure

## Troubleshooting

### Issue: 403 Forbidden Error

**Problem**: Website blocks the crawler

**Solution**:
- Run from an authorized network
- Add authentication if required
- Contact web admin for API access

### Issue: Incomplete Crawl

**Problem**: Agent stops before crawling all pages

**Solution**:
- Increase `--max-pages` limit
- Check for redirect loops
- Verify all internal links are valid

### Issue: Memory Issues

**Problem**: Agent uses too much memory

**Solution**:
- Reduce `--max-pages`
- Process in batches
- Increase system memory

## Advanced Usage

### Integrating with CI/CD

Add to your deployment pipeline:

```yaml
# .github/workflows/website-audit.yml
name: Website Audit

on:
  schedule:
    - cron: '0 0 * * 0'  # Weekly

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Set up Python
        uses: actions/setup-python@v2
        with:
          python-version: '3.9'
      - name: Install dependencies
        run: pip install -r requirements.txt
      - name: Run audit
        run: python nara_optimizer.py --max-pages 100
      - name: Upload results
        uses: actions/upload-artifact@v2
        with:
          name: audit-results
          path: nara_analysis/
```

### Custom Analysis Rules

Extend the optimizer with custom rules:

```python
class CustomNARAOptimizer(NARAWebsiteOptimizer):
    def custom_analysis(self):
        # Add your custom analysis here
        pass
```

## Contributing

To extend or improve the agent:

1. Add new detection rules in `nara_optimizer.py`
2. Add content optimization rules in `content_optimizer.py`
3. Update this README with new features
4. Test thoroughly before deploying

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the logs in the output directory
3. Contact the development team

## License

Internal use only - NARA Website Optimization Project

---

**Last Updated**: October 2025
**Version**: 1.0
**Status**: Production Ready
