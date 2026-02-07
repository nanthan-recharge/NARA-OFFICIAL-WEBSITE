#!/usr/bin/env python3
"""
NARA Content Optimizer Module
==============================
Handles content optimization, HTML refactoring, and code improvements
while preserving the existing visual design.
"""

from bs4 import BeautifulSoup, Comment
import re
from typing import Dict, List, Tuple
import logging

logger = logging.getLogger(__name__)


class ContentOptimizer:
    """Optimizes HTML content while preserving design"""
    
    def __init__(self):
        self.modifications = []
        
    def optimize_html_structure(self, html: str, page_url: str) -> Tuple[str, List[Dict]]:
        """
        Optimize HTML structure for better semantics and accessibility
        
        Args:
            html: Raw HTML content
            page_url: URL of the page being optimized
            
        Returns:
            Tuple of (optimized_html, list_of_modifications)
        """
        soup = BeautifulSoup(html, 'html.parser')
        modifications = []
        
        # Fix heading hierarchy
        heading_fixes = self._fix_heading_hierarchy(soup)
        modifications.extend(heading_fixes)
        
        # Improve semantic HTML
        semantic_fixes = self._improve_semantic_html(soup)
        modifications.extend(semantic_fixes)
        
        # Add alt text reminders
        alt_fixes = self._check_image_alt_text(soup)
        modifications.extend(alt_fixes)
        
        # Fix external links
        link_fixes = self._fix_external_links(soup)
        modifications.extend(link_fixes)
        
        # Clean up code
        cleanup_fixes = self._cleanup_code(soup)
        modifications.extend(cleanup_fixes)
        
        return str(soup), modifications
    
    def _fix_heading_hierarchy(self, soup: BeautifulSoup) -> List[Dict]:
        """Ensure proper heading hierarchy (H1 -> H2 -> H3, etc.)"""
        modifications = []
        
        # Check for H1
        h1_tags = soup.find_all('h1')
        
        if len(h1_tags) == 0:
            modifications.append({
                'type': 'heading_hierarchy',
                'severity': 'high',
                'issue': 'No H1 heading found',
                'recommendation': 'Add an H1 heading at the top of the page content'
            })
        elif len(h1_tags) > 1:
            modifications.append({
                'type': 'heading_hierarchy',
                'severity': 'high',
                'issue': f'Multiple H1 headings found ({len(h1_tags)})',
                'recommendation': 'Keep only one H1 heading per page',
                'action': 'Convert extra H1 tags to H2'
            })
            
            # Automatically fix: convert extra H1s to H2s
            for h1 in h1_tags[1:]:
                h1.name = 'h2'
        
        # Check heading sequence
        all_headings = soup.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])
        prev_level = 0
        
        for heading in all_headings:
            current_level = int(heading.name[1])
            
            if current_level - prev_level > 1:
                modifications.append({
                    'type': 'heading_hierarchy',
                    'severity': 'medium',
                    'issue': f'Heading jump from H{prev_level} to H{current_level}',
                    'recommendation': 'Use consecutive heading levels (H1 -> H2 -> H3)',
                    'heading_text': heading.get_text(strip=True)[:50]
                })
            
            prev_level = current_level
        
        return modifications
    
    def _improve_semantic_html(self, soup: BeautifulSoup) -> List[Dict]:
        """Improve semantic HTML structure"""
        modifications = []
        
        # Check for main content area
        main_tag = soup.find('main')
        if not main_tag:
            modifications.append({
                'type': 'semantic_html',
                'severity': 'medium',
                'issue': 'No <main> tag found',
                'recommendation': 'Wrap main content in <main> tag',
                'code_example': '<main>\n  <!-- Main page content here -->\n</main>'
            })
        
        # Check for navigation
        nav_tags = soup.find_all('nav')
        if len(nav_tags) == 0:
            # Check if navigation exists as div
            potential_navs = soup.find_all('div', class_=re.compile(r'nav|menu', re.I))
            if potential_navs:
                modifications.append({
                    'type': 'semantic_html',
                    'severity': 'medium',
                    'issue': 'Navigation found in <div> instead of <nav>',
                    'recommendation': 'Replace <div> with <nav> for navigation menus',
                    'count': len(potential_navs)
                })
        
        # Check for header/footer
        header_tag = soup.find('header')
        footer_tag = soup.find('footer')
        
        if not header_tag:
            modifications.append({
                'type': 'semantic_html',
                'severity': 'low',
                'issue': 'No <header> tag found',
                'recommendation': 'Wrap site header in <header> tag'
            })
        
        if not footer_tag:
            modifications.append({
                'type': 'semantic_html',
                'severity': 'low',
                'issue': 'No <footer> tag found',
                'recommendation': 'Wrap site footer in <footer> tag'
            })
        
        # Check for sections
        content_divs = soup.find_all('div', class_=re.compile(r'section|content|area', re.I))
        if content_divs and len(soup.find_all('section')) == 0:
            modifications.append({
                'type': 'semantic_html',
                'severity': 'low',
                'issue': 'Content divisions using <div> instead of <section>',
                'recommendation': 'Use <section> for distinct content sections',
                'count': len(content_divs)
            })
        
        return modifications
    
    def _check_image_alt_text(self, soup: BeautifulSoup) -> List[Dict]:
        """Check and flag images without alt text"""
        modifications = []
        
        images = soup.find_all('img')
        images_without_alt = []
        
        for img in images:
            alt = img.get('alt')
            if not alt or alt.strip() == '':
                src = img.get('src', 'unknown')
                images_without_alt.append(src)
                
                # Add a data attribute to flag this
                img['data-missing-alt'] = 'true'
        
        if images_without_alt:
            modifications.append({
                'type': 'accessibility',
                'severity': 'high',
                'issue': f'{len(images_without_alt)} images without alt text',
                'recommendation': 'Add descriptive alt text to all images',
                'images': images_without_alt[:10],  # Show first 10
                'code_example': '<img src="logo.png" alt="NARA Logo - National Aquatic Resources Research Agency">'
            })
        
        return modifications
    
    def _fix_external_links(self, soup: BeautifulSoup) -> List[Dict]:
        """Ensure external links open in new tabs"""
        modifications = []
        external_links_fixed = 0
        
        for link in soup.find_all('a', href=True):
            href = link.get('href', '')
            
            # Check if external (simple check)
            if href.startswith('http') and 'nara-web' not in href:
                target = link.get('target')
                rel = link.get('rel', [])
                
                if target != '_blank':
                    link['target'] = '_blank'
                    external_links_fixed += 1
                
                if 'noopener' not in rel or 'noreferrer' not in rel:
                    link['rel'] = 'noopener noreferrer'
                    external_links_fixed += 1
        
        if external_links_fixed > 0:
            modifications.append({
                'type': 'links',
                'severity': 'medium',
                'issue': f'{external_links_fixed} external links needed fixing',
                'recommendation': 'All external links should open in new tabs with security attributes',
                'fixed': external_links_fixed
            })
        
        return modifications
    
    def _cleanup_code(self, soup: BeautifulSoup) -> List[Dict]:
        """Clean up unnecessary code"""
        modifications = []
        
        # Remove HTML comments (except IE conditionals)
        comments = soup.find_all(string=lambda text: isinstance(text, Comment))
        removed_comments = 0
        
        for comment in comments:
            if not comment.strip().startswith('[if'):
                comment.extract()
                removed_comments += 1
        
        if removed_comments > 0:
            modifications.append({
                'type': 'code_cleanup',
                'severity': 'low',
                'issue': f'Removed {removed_comments} HTML comments',
                'recommendation': 'Comments removed for cleaner code'
            })
        
        # Find empty tags
        empty_tags = []
        for tag in soup.find_all():
            if not tag.get_text(strip=True) and not tag.find_all() and tag.name not in ['br', 'hr', 'img', 'input']:
                empty_tags.append(tag.name)
        
        if empty_tags:
            modifications.append({
                'type': 'code_cleanup',
                'severity': 'low',
                'issue': f'Found {len(empty_tags)} empty tags',
                'recommendation': 'Remove empty tags that serve no purpose',
                'tags': list(set(empty_tags))[:10]
            })
        
        return modifications
    
    def optimize_navigation_structure(self, nav_data: List[Dict]) -> Dict:
        """
        Analyze and optimize navigation structure
        
        Args:
            nav_data: List of navigation menus from different pages
            
        Returns:
            Optimized navigation structure with recommendations
        """
        if not nav_data:
            return {'error': 'No navigation data provided'}
        
        # Consolidate all menu items
        all_menu_items = []
        for nav in nav_data:
            all_menu_items.extend(nav.get('items', []))
        
        # Find duplicates
        menu_texts = [item['text'] for item in all_menu_items]
        duplicates = {text: menu_texts.count(text) for text in set(menu_texts) if menu_texts.count(text) > 1}
        
        # Proposed structure (based on NARA requirements)
        proposed_structure = {
            'main_navigation': [
                {
                    'label': 'About NARA',
                    'children': [
                        'Mission & Vision',
                        'History',
                        'Leadership Team',
                        'Organizational Structure',
                        'Regional Centers',
                        'Careers'
                    ]
                },
                {
                    'label': 'Research & Development',
                    'children': [
                        'Core Research Areas',
                        'Ongoing Projects',
                        'Research Facilities',
                        'Innovation Highlights',
                        'Collaborations'
                    ]
                },
                {
                    'label': 'Services',
                    'children': [
                        'Consultancy Services',
                        'Analytical Services',
                        'Training Programs',
                        'Data Requests',
                        'Licensing & Permits'
                    ]
                },
                {
                    'label': 'Publications & Resources',
                    'children': [
                        'Annual Reports',
                        'Scientific Journals',
                        'Newsletters',
                        'Technical Guidelines',
                        'Research Data',
                        'Photo Gallery'
                    ]
                },
                {
                    'label': 'News & Events',
                    'children': [
                        'Latest News',
                        'Press Releases',
                        'Upcoming Events',
                        'Workshops & Seminars',
                        'Past Events'
                    ]
                },
                {
                    'label': 'Contact Us',
                    'children': []
                }
            ],
            'recommendations': [
                {
                    'issue': 'Duplicate menu items',
                    'details': duplicates,
                    'action': 'Consolidate duplicate navigation links'
                },
                {
                    'issue': 'Navigation consistency',
                    'action': 'Use the same navigation structure across all pages'
                },
                {
                    'issue': 'Clear labeling',
                    'action': 'Use action-oriented labels (e.g., "View Research Areas" instead of just "Research")'
                }
            ]
        }
        
        return proposed_structure
    
    def generate_sitemap_structure(self, pages: Dict) -> str:
        """Generate proposed sitemap structure"""
        sitemap = """
# Proposed NARA Website Sitemap

## Primary Navigation

### 1. Home
- Hero section with mission statement
- Quick links to key services
- Latest news highlights
- Featured research projects

### 2. About NARA
├── Mission & Vision
├── History & Milestones
├── Leadership Team
│   ├── Director General
│   ├── Board Members
│   └── Division Heads
├── Organizational Structure
│   ├── Research Divisions
│   ├── Administrative Units
│   └── Support Services
├── Regional Centers
│   ├── Location Map
│   └── Center Profiles
└── Careers
    ├── Current Openings
    └── Application Process

### 3. Research & Development
├── Core Research Areas
│   ├── Marine Fisheries
│   ├── Inland Fisheries
│   ├── Aquaculture
│   ├── Post-Harvest Technology
│   └── Socio-Economics
├── Ongoing Projects
│   ├── Active Research
│   └── Completed Projects
├── Research Facilities
│   ├── Laboratories
│   ├── Field Stations
│   └── Equipment
└── Innovation & Technology
    ├── Recent Breakthroughs
    └── Technology Transfer

### 4. Services
├── Consultancy Services
│   ├── Technical Advisory
│   ├── Project Planning
│   └── Request Form
├── Analytical Services
│   ├── Water Quality Testing
│   ├── Fish Health Analysis
│   ├── Feed Analysis
│   └── Service Rates
├── Training Programs
│   ├── Upcoming Courses
│   ├── Past Training
│   └── Registration
└── Data Requests
    ├── Available Datasets
    └── Request Process

### 5. Publications & Resources
├── Annual Reports
├── Scientific Journals
│   └── Archive (by year)
├── Newsletters
├── Technical Guidelines
│   ├── Aquaculture Guidelines
│   ├── Fishing Regulations
│   └── Environmental Standards
├── Research Data
│   ├── Fisheries Statistics
│   └── Environmental Data
└── Media Gallery
    ├── Photos
    └── Videos

### 6. News & Events
├── Latest News
├── Press Releases
├── Events Calendar
├── Workshops & Seminars
│   ├── Upcoming
│   └── Past Events
└── Announcements

### 7. Contact Us
├── Contact Information
│   ├── Head Office
│   └── Regional Centers
├── Contact Form
├── Feedback
└── Location Map

## Footer Navigation
- Quick Links (Services, Publications, Contact)
- Social Media Links
- Privacy Policy
- Terms of Use
- Sitemap
- Accessibility Statement

## Utility Pages
- Search Results
- 404 Error Page
- Site Search
        """
        
        return sitemap


class DuplicateContentResolver:
    """Resolves duplicate content issues"""
    
    def __init__(self):
        self.resolutions = []
    
    def analyze_duplicates(self, duplicate_groups: List[Dict]) -> List[Dict]:
        """
        Analyze duplicate content and propose resolutions
        
        Args:
            duplicate_groups: List of duplicate content groups
            
        Returns:
            List of resolution recommendations
        """
        resolutions = []
        
        for group in duplicate_groups:
            if group['type'] == 'exact_duplicate':
                # For exact duplicates, recommend consolidation
                pages = group['pages']
                canonical = self._choose_canonical_url(pages)
                
                resolutions.append({
                    'type': 'consolidate',
                    'canonical_url': canonical,
                    'redirect_urls': [p for p in pages if p != canonical],
                    'action': f'Keep {canonical} as the main page and redirect other URLs',
                    'implementation': {
                        'step_1': 'Verify canonical URL has complete content',
                        'step_2': 'Set up 301 redirects from duplicate URLs',
                        'step_3': 'Update all internal links to point to canonical URL',
                        'step_4': 'Add canonical link tag to consolidated page'
                    }
                })
            
            elif group['type'] == 'similar_content':
                # For similar content, recommend merging or differentiating
                resolutions.append({
                    'type': 'merge_or_differentiate',
                    'pages': group['pages'],
                    'similarity': group.get('similarity', 'Unknown'),
                    'action': 'Review content and either merge into one comprehensive page or differentiate the content',
                    'questions': [
                        'Do these pages serve different user needs?',
                        'Can the content be combined without loss of context?',
                        'Should one page focus on a specific aspect?'
                    ]
                })
        
        return resolutions
    
    def _choose_canonical_url(self, urls: List[str]) -> str:
        """Choose the best canonical URL from a list"""
        # Prefer shorter URLs
        # Prefer URLs without query parameters
        # Prefer URLs that look more "official"
        
        def url_score(url):
            score = 0
            # Shorter is better
            score -= len(url)
            # No query params is better
            if '?' not in url:
                score += 50
            # Common canonical patterns
            if url.endswith('/'):
                score += 10
            if 'index' not in url.lower():
                score += 5
            return score
        
        return max(urls, key=url_score)


class PlaceholderReplacer:
    """Handles placeholder text replacement"""
    
    PLACEHOLDER_TEMPLATES = {
        'about': '[CONTENT REQUIRED: About NARA - Overview of the organization]',
        'mission': '[CONTENT REQUIRED: Mission Statement]',
        'services': '[CONTENT REQUIRED: Description of {service_name} services]',
        'research': '[CONTENT REQUIRED: Research area description for {area}]',
        'contact': '[CONTENT REQUIRED: Contact information for {location}]',
        'generic': '[CONTENT REQUIRED: {description}]'
    }
    
    def create_content_requirement_flag(self, context: str, content_type: str = 'generic') -> str:
        """Create a standardized content requirement flag"""
        
        template = self.PLACEHOLDER_TEMPLATES.get(content_type, self.PLACEHOLDER_TEMPLATES['generic'])
        
        # Try to extract relevant info from context
        if '{' in template:
            # This is a template with placeholders
            return template.format(description=context[:100])
        
        return template
    
    def replace_placeholders_in_html(self, html: str) -> Tuple[str, List[Dict]]:
        """Replace placeholder text with standardized flags"""
        soup = BeautifulSoup(html, 'html.parser')
        replacements = []
        
        placeholder_patterns = [
            (r'lorem\s+ipsum.*?(?=\.|$)', 'Lorem ipsum placeholder text'),
            (r'placeholder', 'Generic placeholder'),
            (r'coming\s+soon', 'Coming soon notice'),
            (r'under\s+construction', 'Under construction notice'),
        ]
        
        for pattern, description in placeholder_patterns:
            # Find text nodes containing the pattern
            for text_node in soup.find_all(string=re.compile(pattern, re.I)):
                parent = text_node.parent
                if parent.name not in ['script', 'style']:
                    new_text = re.sub(
                        pattern,
                        self.create_content_requirement_flag(description),
                        str(text_node),
                        flags=re.I
                    )
                    text_node.replace_with(new_text)
                    replacements.append({
                        'original': str(text_node)[:100],
                        'replaced_with': new_text[:100],
                        'parent_tag': parent.name
                    })
        
        return str(soup), replacements


def main():
    """Example usage"""
    html_sample = """
    <div class="container">
        <h3>Welcome</h3>
        <h2>About Us</h2>
        <p>Lorem ipsum dolor sit amet...</p>
        <img src="logo.png">
        <a href="https://example.com">External Link</a>
    </div>
    """
    
    optimizer = ContentOptimizer()
    optimized_html, mods = optimizer.optimize_html_structure(html_sample, 'test.html')
    
    print("Modifications:")
    for mod in mods:
        print(f"- [{mod['severity']}] {mod['issue']}")
        print(f"  Recommendation: {mod['recommendation']}\n")


if __name__ == '__main__':
    main()
