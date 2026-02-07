#!/usr/bin/env python3
"""
NARA Website Optimization Agent
================================
An automated tool for analyzing and optimizing the NARA website structure,
content, and functionality while preserving the existing visual design.

Author: AI Agent
Date: October 2025
"""

import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import json
import re
from collections import defaultdict
from typing import Dict, List, Set, Tuple
import hashlib
import logging
from pathlib import Path
import time

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class NARAWebsiteOptimizer:
    """Main optimizer class for NARA website analysis and optimization"""
    
    def __init__(self, base_url: str, output_dir: str = "nara_analysis"):
        self.base_url = base_url.rstrip('/')
        self.domain = urlparse(base_url).netloc
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)
        
        # Data structures for analysis
        self.crawled_pages = {}
        self.all_links = defaultdict(list)
        self.broken_links = []
        self.duplicate_content = []
        self.placeholder_text = []
        self.navigation_structure = {}
        self.page_metadata = {}
        
        # Session for requests
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'NARA-Optimization-Agent/1.0'
        })
        
    def crawl_website(self, max_pages: int = 100, delay: float = 0.5):
        """
        Crawl the website and collect all pages
        
        Args:
            max_pages: Maximum number of pages to crawl
            delay: Delay between requests in seconds
        """
        logger.info(f"Starting website crawl from {self.base_url}")
        
        to_crawl = [self.base_url]
        crawled = set()
        
        while to_crawl and len(crawled) < max_pages:
            url = to_crawl.pop(0)
            
            if url in crawled:
                continue
                
            logger.info(f"Crawling: {url}")
            
            try:
                response = self.session.get(url, timeout=10)
                
                if response.status_code == 200:
                    crawled.add(url)
                    self.crawled_pages[url] = response.text
                    
                    # Parse and extract links
                    soup = BeautifulSoup(response.text, 'html.parser')
                    links = self._extract_links(soup, url)
                    
                    # Add internal links to crawl queue
                    for link in links:
                        if self._is_internal_link(link) and link not in crawled:
                            to_crawl.append(link)
                    
                    time.sleep(delay)
                else:
                    logger.warning(f"Failed to fetch {url}: Status {response.status_code}")
                    self.broken_links.append({
                        'url': url,
                        'status': response.status_code,
                        'type': 'internal'
                    })
                    
            except Exception as e:
                logger.error(f"Error crawling {url}: {str(e)}")
                self.broken_links.append({
                    'url': url,
                    'error': str(e),
                    'type': 'error'
                })
        
        logger.info(f"Crawl complete. Analyzed {len(crawled)} pages")
        return len(crawled)
    
    def _extract_links(self, soup: BeautifulSoup, page_url: str) -> List[str]:
        """Extract all links from a page"""
        links = []
        for tag in soup.find_all(['a', 'link']):
            href = tag.get('href')
            if href:
                absolute_url = urljoin(page_url, href)
                links.append(absolute_url)
                self.all_links[page_url].append(absolute_url)
        return links
    
    def _is_internal_link(self, url: str) -> bool:
        """Check if a URL is internal to the site"""
        parsed = urlparse(url)
        return parsed.netloc == self.domain or parsed.netloc == ''
    
    def analyze_information_architecture(self):
        """Analyze and map the current information architecture"""
        logger.info("Analyzing information architecture...")
        
        ia_structure = {
            'total_pages': len(self.crawled_pages),
            'navigation_menus': [],
            'page_hierarchy': {},
            'url_patterns': defaultdict(int)
        }
        
        for url, html in self.crawled_pages.items():
            soup = BeautifulSoup(html, 'html.parser')
            
            # Extract navigation menus
            nav_elements = soup.find_all(['nav', 'header'])
            for nav in nav_elements:
                menu_items = self._extract_menu_structure(nav)
                if menu_items:
                    ia_structure['navigation_menus'].append({
                        'page': url,
                        'items': menu_items
                    })
            
            # Analyze URL patterns
            path = urlparse(url).path
            path_parts = [p for p in path.split('/') if p]
            if path_parts:
                ia_structure['url_patterns'][path_parts[0]] += 1
            
            # Extract page hierarchy from headings
            ia_structure['page_hierarchy'][url] = self._extract_heading_structure(soup)
        
        self.navigation_structure = ia_structure
        return ia_structure
    
    def _extract_menu_structure(self, nav_element) -> List[Dict]:
        """Extract menu structure from navigation element"""
        menu_items = []
        links = nav_element.find_all('a')
        
        for link in links:
            menu_items.append({
                'text': link.get_text(strip=True),
                'href': link.get('href'),
                'classes': link.get('class', [])
            })
        
        return menu_items
    
    def _extract_heading_structure(self, soup: BeautifulSoup) -> Dict:
        """Extract heading hierarchy from page"""
        structure = {
            'h1': [],
            'h2': [],
            'h3': [],
            'h4': [],
            'h5': [],
            'h6': []
        }
        
        for level in range(1, 7):
            headings = soup.find_all(f'h{level}')
            structure[f'h{level}'] = [h.get_text(strip=True) for h in headings]
        
        return structure
    
    def detect_duplicate_content(self, similarity_threshold: float = 0.85):
        """Detect duplicate or highly similar content across pages"""
        logger.info("Detecting duplicate content...")
        
        page_contents = {}
        
        for url, html in self.crawled_pages.items():
            soup = BeautifulSoup(html, 'html.parser')
            
            # Remove scripts, styles, navigation
            for tag in soup(['script', 'style', 'nav', 'header', 'footer']):
                tag.decompose()
            
            # Get main content text
            text = soup.get_text(separator=' ', strip=True)
            text = re.sub(r'\s+', ' ', text)
            
            # Create hash for exact duplicates
            text_hash = hashlib.md5(text.encode()).hexdigest()
            
            page_contents[url] = {
                'text': text,
                'hash': text_hash,
                'length': len(text)
            }
        
        # Find duplicates
        hash_groups = defaultdict(list)
        for url, data in page_contents.items():
            hash_groups[data['hash']].append(url)
        
        # Identify exact duplicates
        for hash_val, urls in hash_groups.items():
            if len(urls) > 1:
                self.duplicate_content.append({
                    'type': 'exact_duplicate',
                    'pages': urls,
                    'content_length': page_contents[urls[0]]['length']
                })
        
        # Check for similar content (simplified - could use more advanced similarity metrics)
        urls = list(page_contents.keys())
        for i in range(len(urls)):
            for j in range(i + 1, len(urls)):
                url1, url2 = urls[i], urls[j]
                content1 = page_contents[url1]['text'][:500]  # Compare first 500 chars
                content2 = page_contents[url2]['text'][:500]
                
                # Simple similarity check
                similarity = self._simple_similarity(content1, content2)
                if similarity > similarity_threshold:
                    self.duplicate_content.append({
                        'type': 'similar_content',
                        'pages': [url1, url2],
                        'similarity': similarity
                    })
        
        logger.info(f"Found {len(self.duplicate_content)} duplicate/similar content issues")
        return self.duplicate_content
    
    def _simple_similarity(self, text1: str, text2: str) -> float:
        """Calculate simple similarity between two texts"""
        words1 = set(text1.lower().split())
        words2 = set(text2.lower().split())
        
        if not words1 or not words2:
            return 0.0
        
        intersection = words1.intersection(words2)
        union = words1.union(words2)
        
        return len(intersection) / len(union) if union else 0.0
    
    def find_placeholder_text(self):
        """Find placeholder text across the website"""
        logger.info("Searching for placeholder text...")
        
        placeholder_patterns = [
            r'lorem\s+ipsum',
            r'placeholder',
            r'coming\s+soon',
            r'under\s+construction',
            r'tbd',
            r'to\s+be\s+determined',
            r'\[.*?\]',  # Bracketed text
            r'xxx+',
            r'test\s+content'
        ]
        
        combined_pattern = '|'.join(placeholder_patterns)
        regex = re.compile(combined_pattern, re.IGNORECASE)
        
        for url, html in self.crawled_pages.items():
            soup = BeautifulSoup(html, 'html.parser')
            text = soup.get_text()
            
            matches = regex.finditer(text)
            for match in matches:
                context_start = max(0, match.start() - 50)
                context_end = min(len(text), match.end() + 50)
                context = text[context_start:context_end].strip()
                
                self.placeholder_text.append({
                    'page': url,
                    'placeholder': match.group(),
                    'context': context
                })
        
        logger.info(f"Found {len(self.placeholder_text)} placeholder text instances")
        return self.placeholder_text
    
    def check_link_integrity(self):
        """Check all links for broken or invalid URLs"""
        logger.info("Checking link integrity...")
        
        all_unique_links = set()
        for links in self.all_links.values():
            all_unique_links.update(links)
        
        external_links = [link for link in all_unique_links if not self._is_internal_link(link)]
        
        logger.info(f"Checking {len(external_links)} external links...")
        
        for link in external_links[:50]:  # Limit external link checking
            try:
                response = self.session.head(link, timeout=5, allow_redirects=True)
                if response.status_code >= 400:
                    self.broken_links.append({
                        'url': link,
                        'status': response.status_code,
                        'type': 'external'
                    })
            except Exception as e:
                self.broken_links.append({
                    'url': link,
                    'error': str(e),
                    'type': 'external_error'
                })
            
            time.sleep(0.2)  # Rate limiting
        
        logger.info(f"Found {len(self.broken_links)} broken links")
        return self.broken_links
    
    def analyze_page_metadata(self):
        """Analyze page titles, meta descriptions, and semantic structure"""
        logger.info("Analyzing page metadata...")
        
        for url, html in self.crawled_pages.items():
            soup = BeautifulSoup(html, 'html.parser')
            
            metadata = {
                'url': url,
                'title': '',
                'meta_description': '',
                'h1_count': 0,
                'h1_texts': [],
                'has_semantic_html': False,
                'accessibility_issues': []
            }
            
            # Title
            title_tag = soup.find('title')
            if title_tag:
                metadata['title'] = title_tag.get_text(strip=True)
            else:
                metadata['accessibility_issues'].append('Missing <title> tag')
            
            # Meta description
            meta_desc = soup.find('meta', attrs={'name': 'description'})
            if meta_desc:
                metadata['meta_description'] = meta_desc.get('content', '')
            else:
                metadata['accessibility_issues'].append('Missing meta description')
            
            # H1 analysis
            h1_tags = soup.find_all('h1')
            metadata['h1_count'] = len(h1_tags)
            metadata['h1_texts'] = [h.get_text(strip=True) for h in h1_tags]
            
            if metadata['h1_count'] == 0:
                metadata['accessibility_issues'].append('No H1 heading')
            elif metadata['h1_count'] > 1:
                metadata['accessibility_issues'].append(f'Multiple H1 headings ({metadata["h1_count"]})')
            
            # Semantic HTML check
            semantic_tags = ['main', 'article', 'section', 'nav', 'header', 'footer', 'aside']
            metadata['has_semantic_html'] = any(soup.find(tag) for tag in semantic_tags)
            
            # Image alt text check
            images = soup.find_all('img')
            images_without_alt = [img for img in images if not img.get('alt')]
            if images_without_alt:
                metadata['accessibility_issues'].append(
                    f'{len(images_without_alt)} images without alt text'
                )
            
            self.page_metadata[url] = metadata
        
        return self.page_metadata
    
    def generate_optimization_report(self):
        """Generate comprehensive optimization report"""
        logger.info("Generating optimization report...")
        
        report = {
            'summary': {
                'total_pages_analyzed': len(self.crawled_pages),
                'total_broken_links': len(self.broken_links),
                'duplicate_content_issues': len(self.duplicate_content),
                'placeholder_text_instances': len(self.placeholder_text),
                'pages_with_accessibility_issues': sum(
                    1 for meta in self.page_metadata.values()
                    if meta['accessibility_issues']
                )
            },
            'information_architecture': self.navigation_structure,
            'duplicate_content': self.duplicate_content,
            'broken_links': self.broken_links,
            'placeholder_text': self.placeholder_text,
            'page_metadata': self.page_metadata,
            'recommendations': self._generate_recommendations()
        }
        
        # Save report
        report_path = self.output_dir / 'optimization_report.json'
        with open(report_path, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        
        logger.info(f"Report saved to {report_path}")
        
        # Generate human-readable report
        self._generate_readable_report(report)
        
        return report
    
    def _generate_recommendations(self) -> List[Dict]:
        """Generate actionable recommendations"""
        recommendations = []
        
        # Navigation recommendations
        if self.navigation_structure:
            nav_menus = self.navigation_structure.get('navigation_menus', [])
            if len(nav_menus) > 1:
                recommendations.append({
                    'category': 'Navigation',
                    'priority': 'High',
                    'issue': f'Found {len(nav_menus)} different navigation structures',
                    'recommendation': 'Consolidate navigation menus into a single, consistent structure across all pages'
                })
        
        # Duplicate content recommendations
        if self.duplicate_content:
            recommendations.append({
                'category': 'Content',
                'priority': 'High',
                'issue': f'Found {len(self.duplicate_content)} duplicate or similar content issues',
                'recommendation': 'Consolidate duplicate pages and redirect old URLs to the canonical version'
            })
        
        # Accessibility recommendations
        pages_with_issues = [
            url for url, meta in self.page_metadata.items()
            if meta['accessibility_issues']
        ]
        
        if pages_with_issues:
            recommendations.append({
                'category': 'Accessibility',
                'priority': 'High',
                'issue': f'{len(pages_with_issues)} pages have accessibility issues',
                'recommendation': 'Fix heading hierarchy, add alt text to images, and ensure proper semantic HTML'
            })
        
        # Broken links
        if self.broken_links:
            recommendations.append({
                'category': 'Links',
                'priority': 'Medium',
                'issue': f'Found {len(self.broken_links)} broken links',
                'recommendation': 'Update or remove broken links and ensure all external links open in new tabs'
            })
        
        # Placeholder text
        if self.placeholder_text:
            recommendations.append({
                'category': 'Content',
                'priority': 'Medium',
                'issue': f'Found {len(self.placeholder_text)} instances of placeholder text',
                'recommendation': 'Replace all placeholder text with actual content or remove placeholders'
            })
        
        return recommendations
    
    def _generate_readable_report(self, report: Dict):
        """Generate human-readable markdown report"""
        report_path = self.output_dir / 'OPTIMIZATION_REPORT.md'
        
        with open(report_path, 'w', encoding='utf-8') as f:
            f.write("# NARA Website Optimization Report\n\n")
            f.write(f"**Generated:** {time.strftime('%Y-%m-%d %H:%M:%S')}\n\n")
            
            # Executive Summary
            f.write("## Executive Summary\n\n")
            summary = report['summary']
            f.write(f"- **Total Pages Analyzed:** {summary['total_pages_analyzed']}\n")
            f.write(f"- **Broken Links:** {summary['total_broken_links']}\n")
            f.write(f"- **Duplicate Content Issues:** {summary['duplicate_content_issues']}\n")
            f.write(f"- **Placeholder Text Instances:** {summary['placeholder_text_instances']}\n")
            f.write(f"- **Pages with Accessibility Issues:** {summary['pages_with_accessibility_issues']}\n\n")
            
            # Recommendations
            f.write("## Key Recommendations\n\n")
            for idx, rec in enumerate(report['recommendations'], 1):
                f.write(f"### {idx}. {rec['category']} - {rec['priority']} Priority\n\n")
                f.write(f"**Issue:** {rec['issue']}\n\n")
                f.write(f"**Recommendation:** {rec['recommendation']}\n\n")
            
            # Duplicate Content Details
            if report['duplicate_content']:
                f.write("## Duplicate Content Details\n\n")
                for idx, dup in enumerate(report['duplicate_content'][:10], 1):
                    f.write(f"### Duplicate {idx} ({dup['type']})\n\n")
                    f.write("**Affected Pages:**\n")
                    for page in dup['pages']:
                        f.write(f"- {page}\n")
                    f.write("\n")
            
            # Broken Links
            if report['broken_links']:
                f.write("## Broken Links\n\n")
                for idx, link in enumerate(report['broken_links'][:20], 1):
                    f.write(f"{idx}. **URL:** {link['url']}\n")
                    if 'status' in link:
                        f.write(f"   - Status: {link['status']}\n")
                    if 'error' in link:
                        f.write(f"   - Error: {link['error']}\n")
                    f.write("\n")
            
            # Placeholder Text
            if report['placeholder_text']:
                f.write("## Placeholder Text Instances\n\n")
                for idx, placeholder in enumerate(report['placeholder_text'][:15], 1):
                    f.write(f"{idx}. **Page:** {placeholder['page']}\n")
                    f.write(f"   - **Placeholder:** {placeholder['placeholder']}\n")
                    f.write(f"   - **Context:** ...{placeholder['context']}...\n\n")
        
        logger.info(f"Readable report saved to {report_path}")
    
    def run_complete_analysis(self):
        """Run the complete optimization analysis pipeline"""
        logger.info("=" * 60)
        logger.info("NARA Website Optimization Agent - Starting Analysis")
        logger.info("=" * 60)
        
        # Phase 1: Crawl website
        self.crawl_website()
        
        # Phase 2: Analyze IA
        self.analyze_information_architecture()
        
        # Phase 3: Detect duplicates
        self.detect_duplicate_content()
        
        # Phase 4: Find placeholders
        self.find_placeholder_text()
        
        # Phase 5: Check links
        self.check_link_integrity()
        
        # Phase 6: Analyze metadata
        self.analyze_page_metadata()
        
        # Phase 7: Generate report
        report = self.generate_optimization_report()
        
        logger.info("=" * 60)
        logger.info("Analysis complete!")
        logger.info(f"Reports saved to: {self.output_dir}")
        logger.info("=" * 60)
        
        return report


def main():
    """Main entry point"""
    import argparse
    
    parser = argparse.ArgumentParser(
        description='NARA Website Optimization Agent'
    )
    parser.add_argument(
        '--url',
        default='https://nara-web-73384.web.app/',
        help='Base URL of the NARA website'
    )
    parser.add_argument(
        '--output',
        default='nara_analysis',
        help='Output directory for analysis results'
    )
    parser.add_argument(
        '--max-pages',
        type=int,
        default=100,
        help='Maximum number of pages to crawl'
    )
    
    args = parser.parse_args()
    
    # Create optimizer instance
    optimizer = NARAWebsiteOptimizer(
        base_url=args.url,
        output_dir=args.output
    )
    
    # Run analysis
    try:
        report = optimizer.run_complete_analysis()
        print("\n" + "=" * 60)
        print("ANALYSIS SUMMARY")
        print("=" * 60)
        print(f"Total Pages: {report['summary']['total_pages_analyzed']}")
        print(f"Broken Links: {report['summary']['total_broken_links']}")
        print(f"Duplicate Content: {report['summary']['duplicate_content_issues']}")
        print(f"Placeholder Text: {report['summary']['placeholder_text_instances']}")
        print(f"Accessibility Issues: {report['summary']['pages_with_accessibility_issues']}")
        print("=" * 60)
        
    except Exception as e:
        logger.error(f"Analysis failed: {str(e)}")
        raise


if __name__ == '__main__':
    main()
