# NARA Website Optimization Configuration

## Website Settings
BASE_URL = "https://nara-web-73384.web.app/"
MAX_PAGES_TO_CRAWL = 100
CRAWL_DELAY_SECONDS = 0.5

## Output Settings
OUTPUT_DIRECTORY = "nara_analysis"
GENERATE_JSON_REPORT = True
GENERATE_MARKDOWN_REPORT = True
GENERATE_HTML_REPORT = False

## Analysis Settings

# Duplicate Content Detection
DUPLICATE_SIMILARITY_THRESHOLD = 0.85  # 85% similarity
CHECK_EXACT_DUPLICATES = True
CHECK_SIMILAR_CONTENT = True

# Link Checking
CHECK_INTERNAL_LINKS = True
CHECK_EXTERNAL_LINKS = True
EXTERNAL_LINK_CHECK_LIMIT = 50  # Limit external links to check
LINK_CHECK_TIMEOUT = 5  # Seconds

# Content Analysis
FIND_PLACEHOLDER_TEXT = True
CHECK_HEADING_HIERARCHY = True
ANALYZE_NAVIGATION = True
CHECK_ACCESSIBILITY = True

## Placeholder Patterns (regex)
PLACEHOLDER_PATTERNS = [
    r'lorem\s+ipsum',
    r'placeholder',
    r'coming\s+soon',
    r'under\s+construction',
    r'tbd',
    r'to\s+be\s+determined',
    r'\[.*?\]',
    r'xxx+',
    r'test\s+content'
]

## Accessibility Checks
CHECK_ALT_TEXT = True
CHECK_SEMANTIC_HTML = True
CHECK_HEADING_STRUCTURE = True
CHECK_ARIA_LABELS = True

## Content Optimization
AUTO_FIX_EXTERNAL_LINKS = True  # Add target="_blank" and rel="noopener"
AUTO_FIX_HEADING_HIERARCHY = True  # Convert multiple H1s to H2s
AUTO_REMOVE_COMMENTS = True  # Remove HTML comments
AUTO_FLAG_EMPTY_TAGS = True

## Navigation Structure
PROPOSED_MAIN_NAVIGATION = [
    {
        "label": "About NARA",
        "children": [
            "Mission & Vision",
            "History",
            "Leadership Team",
            "Organizational Structure",
            "Regional Centers",
            "Careers"
        ]
    },
    {
        "label": "Research & Development",
        "children": [
            "Core Research Areas",
            "Ongoing Projects",
            "Research Facilities",
            "Innovation Highlights",
            "Collaborations"
        ]
    },
    {
        "label": "Services",
        "children": [
            "Consultancy Services",
            "Analytical Services",
            "Training Programs",
            "Data Requests",
            "Licensing & Permits"
        ]
    },
    {
        "label": "Publications & Resources",
        "children": [
            "Annual Reports",
            "Scientific Journals",
            "Newsletters",
            "Technical Guidelines",
            "Research Data",
            "Photo Gallery"
        ]
    },
    {
        "label": "News & Events",
        "children": [
            "Latest News",
            "Press Releases",
            "Upcoming Events",
            "Workshops & Seminars"
        ]
    },
    {
        "label": "Contact Us",
        "children": []
    }
]

## Logging
LOG_LEVEL = "INFO"  # DEBUG, INFO, WARNING, ERROR, CRITICAL
LOG_TO_FILE = True
LOG_FILE = "nara_optimization.log"

## Rate Limiting
RESPECT_ROBOTS_TXT = True
USER_AGENT = "NARA-Optimization-Agent/1.0"

## Priority Levels
PRIORITY_RULES = {
    "broken_links": "high",
    "accessibility_issues": "high",
    "duplicate_content": "high",
    "placeholder_text": "medium",
    "navigation_issues": "medium",
    "semantic_html": "low",
    "code_cleanup": "low"
}

## Report Customization
REPORT_SECTIONS = [
    "executive_summary",
    "information_architecture",
    "duplicate_content",
    "broken_links",
    "placeholder_text",
    "accessibility_issues",
    "content_optimization",
    "recommendations",
    "action_plan"
]

## Advanced Options
ENABLE_SCREENSHOT_CAPTURE = False  # Requires Selenium
ENABLE_PERFORMANCE_ANALYSIS = False  # Requires additional tools
ENABLE_SEO_ANALYSIS = True
ENABLE_MOBILE_ANALYSIS = False  # Requires additional tools

## Exclusions
EXCLUDE_URL_PATTERNS = [
    r'/admin/',
    r'/login/',
    r'/logout/',
    r'/api/',
    r'\?.*',  # Query parameters
]

EXCLUDE_FILE_TYPES = [
    '.pdf',
    '.doc',
    '.docx',
    '.xls',
    '.xlsx',
    '.zip',
    '.jpg',
    '.jpeg',
    '.png',
    '.gif'
]

## Custom Rules
# Add your custom optimization rules here
CUSTOM_RULES = {
    "enforce_https": True,
    "check_sri_integrity": False,
    "validate_json_ld": False,
    "check_open_graph": False
}
