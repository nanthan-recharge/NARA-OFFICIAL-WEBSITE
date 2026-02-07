#!/usr/bin/env python3
"""
NARA Complete Optimization Runner
==================================
This script runs a complete optimization workflow combining
website analysis and content optimization.
"""

import json
import logging
from pathlib import Path
from nara_optimizer import NARAWebsiteOptimizer
from content_optimizer import (
    ContentOptimizer,
    DuplicateContentResolver,
    PlaceholderReplacer
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class CompleteOptimizationWorkflow:
    """Complete optimization workflow combining all modules"""
    
    def __init__(self, base_url: str, output_dir: str = "nara_complete_analysis"):
        self.base_url = base_url
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)
        
        # Initialize components
        self.website_optimizer = NARAWebsiteOptimizer(base_url, str(self.output_dir))
        self.content_optimizer = ContentOptimizer()
        self.duplicate_resolver = DuplicateContentResolver()
        self.placeholder_replacer = PlaceholderReplacer()
        
        self.results = {}
    
    def run_full_workflow(self):
        """Run the complete optimization workflow"""
        logger.info("=" * 70)
        logger.info("NARA COMPLETE OPTIMIZATION WORKFLOW")
        logger.info("=" * 70)
        
        # Step 1: Website Analysis
        logger.info("\n>>> STEP 1: Website Analysis & Crawling")
        self.results['website_analysis'] = self.website_optimizer.run_complete_analysis()
        
        # Step 2: Content Optimization
        logger.info("\n>>> STEP 2: Content Optimization Analysis")
        self.results['content_optimization'] = self._run_content_optimization()
        
        # Step 3: Duplicate Content Resolution
        logger.info("\n>>> STEP 3: Duplicate Content Resolution")
        self.results['duplicate_resolution'] = self._resolve_duplicates()
        
        # Step 4: Navigation Optimization
        logger.info("\n>>> STEP 4: Navigation Structure Optimization")
        self.results['navigation_optimization'] = self._optimize_navigation()
        
        # Step 5: Generate Comprehensive Report
        logger.info("\n>>> STEP 5: Generating Comprehensive Report")
        self._generate_comprehensive_report()
        
        # Step 6: Generate Action Plan
        logger.info("\n>>> STEP 6: Generating Action Plan")
        self._generate_action_plan()
        
        logger.info("\n" + "=" * 70)
        logger.info("WORKFLOW COMPLETE!")
        logger.info(f"All results saved to: {self.output_dir}")
        logger.info("=" * 70)
        
        return self.results
    
    def _run_content_optimization(self):
        """Run content optimization on all crawled pages"""
        content_results = {
            'pages_optimized': 0,
            'total_modifications': 0,
            'modifications_by_page': {}
        }
        
        for url, html in self.website_optimizer.crawled_pages.items():
            optimized_html, modifications = self.content_optimizer.optimize_html_structure(
                html, url
            )
            
            if modifications:
                content_results['pages_optimized'] += 1
                content_results['total_modifications'] += len(modifications)
                content_results['modifications_by_page'][url] = modifications
        
        logger.info(f"Optimized {content_results['pages_optimized']} pages")
        logger.info(f"Total modifications: {content_results['total_modifications']}")
        
        return content_results
    
    def _resolve_duplicates(self):
        """Resolve duplicate content issues"""
        duplicate_content = self.results['website_analysis'].get('duplicate_content', [])
        
        if not duplicate_content:
            logger.info("No duplicate content found")
            return {'duplicates': 0, 'resolutions': []}
        
        resolutions = self.duplicate_resolver.analyze_duplicates(duplicate_content)
        
        logger.info(f"Generated {len(resolutions)} resolution recommendations")
        
        return {
            'duplicates': len(duplicate_content),
            'resolutions': resolutions
        }
    
    def _optimize_navigation(self):
        """Optimize navigation structure"""
        nav_data = self.results['website_analysis']['information_architecture'].get(
            'navigation_menus', []
        )
        
        if not nav_data:
            logger.info("No navigation data found")
            return {}
        
        optimized_nav = self.content_optimizer.optimize_navigation_structure(nav_data)
        
        # Generate sitemap
        sitemap = self.content_optimizer.generate_sitemap_structure(
            self.website_optimizer.crawled_pages
        )
        
        # Save sitemap
        sitemap_path = self.output_dir / 'PROPOSED_SITEMAP.md'
        with open(sitemap_path, 'w', encoding='utf-8') as f:
            f.write(sitemap)
        
        logger.info(f"Sitemap saved to {sitemap_path}")
        
        return optimized_nav
    
    def _generate_comprehensive_report(self):
        """Generate a comprehensive HTML report"""
        report_path = self.output_dir / 'COMPREHENSIVE_REPORT.md'
        
        with open(report_path, 'w', encoding='utf-8') as f:
            self._write_report_header(f)
            self._write_executive_dashboard(f)
            self._write_detailed_findings(f)
            self._write_optimization_roadmap(f)
        
        logger.info(f"Comprehensive report saved to {report_path}")
    
    def _write_report_header(self, f):
        """Write report header"""
        f.write("# NARA Website - Comprehensive Optimization Report\n\n")
        f.write("**Generated by**: NARA Website Optimization Agent\n")
        f.write(f"**Date**: {__import__('time').strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write(f"**Website**: {self.base_url}\n\n")
        f.write("---\n\n")
    
    def _write_executive_dashboard(self, f):
        """Write executive summary dashboard"""
        f.write("## Executive Dashboard\n\n")
        
        summary = self.results['website_analysis']['summary']
        
        f.write("### Quick Stats\n\n")
        f.write("| Metric | Count | Status |\n")
        f.write("|--------|-------|--------|\n")
        f.write(f"| Pages Analyzed | {summary['total_pages_analyzed']} | ✅ |\n")
        
        # Broken links
        broken_status = "⚠️" if summary['total_broken_links'] > 0 else "✅"
        f.write(f"| Broken Links | {summary['total_broken_links']} | {broken_status} |\n")
        
        # Duplicate content
        dup_status = "⚠️" if summary['duplicate_content_issues'] > 0 else "✅"
        f.write(f"| Duplicate Content | {summary['duplicate_content_issues']} | {dup_status} |\n")
        
        # Placeholder text
        placeholder_status = "⚠️" if summary['placeholder_text_instances'] > 0 else "✅"
        f.write(f"| Placeholder Text | {summary['placeholder_text_instances']} | {placeholder_status} |\n")
        
        # Accessibility issues
        a11y_status = "⚠️" if summary['pages_with_accessibility_issues'] > 0 else "✅"
        f.write(f"| Accessibility Issues | {summary['pages_with_accessibility_issues']} | {a11y_status} |\n")
        
        f.write("\n")
        
        # Content optimization stats
        content_opt = self.results.get('content_optimization', {})
        if content_opt:
            f.write("### Content Optimization\n\n")
            f.write(f"- **Pages Optimized**: {content_opt['pages_optimized']}\n")
            f.write(f"- **Total Modifications**: {content_opt['total_modifications']}\n\n")
        
        # Priority summary
        f.write("### Priority Summary\n\n")
        recommendations = self.results['website_analysis']['recommendations']
        
        high_priority = len([r for r in recommendations if r['priority'] == 'High'])
        medium_priority = len([r for r in recommendations if r['priority'] == 'Medium'])
        low_priority = len([r for r in recommendations if r['priority'] == 'Low'])
        
        f.write(f"- 🔴 **High Priority**: {high_priority} issues\n")
        f.write(f"- 🟡 **Medium Priority**: {medium_priority} issues\n")
        f.write(f"- 🟢 **Low Priority**: {low_priority} issues\n\n")
        
        f.write("---\n\n")
    
    def _write_detailed_findings(self, f):
        """Write detailed findings"""
        f.write("## Detailed Findings\n\n")
        
        # Section 1: Information Architecture
        f.write("### 1. Information Architecture\n\n")
        ia = self.results['website_analysis']['information_architecture']
        f.write(f"**Total Pages**: {ia['total_pages']}\n\n")
        
        if ia.get('url_patterns'):
            f.write("**URL Patterns**:\n")
            for pattern, count in sorted(ia['url_patterns'].items(), key=lambda x: x[1], reverse=True):
                f.write(f"- `/{pattern}/`: {count} pages\n")
            f.write("\n")
        
        # Section 2: Duplicate Content
        f.write("### 2. Duplicate Content Analysis\n\n")
        dup_resolution = self.results.get('duplicate_resolution', {})
        if dup_resolution.get('resolutions'):
            for idx, resolution in enumerate(dup_resolution['resolutions'][:5], 1):
                f.write(f"#### Resolution {idx}\n\n")
                f.write(f"**Type**: {resolution['type']}\n\n")
                
                if resolution['type'] == 'consolidate':
                    f.write(f"**Canonical URL**: {resolution['canonical_url']}\n\n")
                    f.write("**Redirect from**:\n")
                    for url in resolution['redirect_urls']:
                        f.write(f"- {url}\n")
                    f.write("\n")
                
                f.write(f"**Action**: {resolution['action']}\n\n")
        else:
            f.write("No duplicate content issues found. ✅\n\n")
        
        # Section 3: Accessibility
        f.write("### 3. Accessibility Issues\n\n")
        pages_with_issues = {
            url: meta for url, meta in self.results['website_analysis']['page_metadata'].items()
            if meta['accessibility_issues']
        }
        
        if pages_with_issues:
            f.write(f"Found accessibility issues on {len(pages_with_issues)} pages:\n\n")
            for url, meta in list(pages_with_issues.items())[:10]:
                f.write(f"**{url}**\n")
                for issue in meta['accessibility_issues']:
                    f.write(f"  - {issue}\n")
                f.write("\n")
        else:
            f.write("No accessibility issues found. ✅\n\n")
        
        # Section 4: Content Optimization
        f.write("### 4. Content Optimization Recommendations\n\n")
        content_opt = self.results.get('content_optimization', {})
        if content_opt.get('modifications_by_page'):
            # Group modifications by type
            mod_types = {}
            for url, mods in content_opt['modifications_by_page'].items():
                for mod in mods:
                    mod_type = mod['type']
                    if mod_type not in mod_types:
                        mod_types[mod_type] = []
                    mod_types[mod_type].append((url, mod))
            
            for mod_type, items in mod_types.items():
                f.write(f"#### {mod_type.replace('_', ' ').title()}\n\n")
                f.write(f"Found {len(items)} instances:\n\n")
                for url, mod in items[:5]:
                    f.write(f"- **Issue**: {mod['issue']}\n")
                    f.write(f"  - **Recommendation**: {mod['recommendation']}\n")
                f.write("\n")
        
        f.write("---\n\n")
    
    def _write_optimization_roadmap(self, f):
        """Write optimization roadmap"""
        f.write("## Optimization Roadmap\n\n")
        
        f.write("### Phase 1: Critical Fixes (Week 1)\n\n")
        f.write("**Priority**: 🔴 High\n\n")
        f.write("- [ ] Fix broken links (internal and external)\n")
        f.write("- [ ] Add alt text to all images\n")
        f.write("- [ ] Fix heading hierarchy (ensure single H1 per page)\n")
        f.write("- [ ] Set up 301 redirects for duplicate pages\n")
        f.write("- [ ] Add missing meta descriptions\n\n")
        
        f.write("### Phase 2: Content Consolidation (Week 2-3)\n\n")
        f.write("**Priority**: 🟡 Medium\n\n")
        f.write("- [ ] Review and consolidate duplicate content\n")
        f.write("- [ ] Update all internal links to canonical URLs\n")
        f.write("- [ ] Replace placeholder text with real content\n")
        f.write("- [ ] Restructure navigation based on proposed IA\n")
        f.write("- [ ] Implement consistent navigation across all pages\n\n")
        
        f.write("### Phase 3: Enhancement (Week 4+)\n\n")
        f.write("**Priority**: 🟢 Low\n\n")
        f.write("- [ ] Improve semantic HTML structure\n")
        f.write("- [ ] Clean up commented code\n")
        f.write("- [ ] Optimize page load times\n")
        f.write("- [ ] Add ARIA labels where needed\n")
        f.write("- [ ] Implement schema markup\n")
        f.write("- [ ] Set up automated testing\n\n")
        
        f.write("### Success Metrics\n\n")
        f.write("Track these metrics to measure optimization success:\n\n")
        f.write("1. **Accessibility Score**: Target WCAG 2.1 AA compliance\n")
        f.write("2. **Broken Links**: Reduce to 0\n")
        f.write("3. **Duplicate Content**: Reduce to 0\n")
        f.write("4. **Page Load Time**: < 3 seconds\n")
        f.write("5. **SEO Score**: > 90/100\n")
        f.write("6. **User Navigation Time**: Measure before/after\n\n")
        
        f.write("---\n\n")
    
    def _generate_action_plan(self):
        """Generate detailed action plan"""
        action_plan_path = self.output_dir / 'ACTION_PLAN.md'
        
        with open(action_plan_path, 'w', encoding='utf-8') as f:
            f.write("# NARA Website Optimization - Action Plan\n\n")
            f.write("## Immediate Actions (This Week)\n\n")
            
            # Get high priority recommendations
            high_priority = [
                r for r in self.results['website_analysis']['recommendations']
                if r['priority'] == 'High'
            ]
            
            for idx, rec in enumerate(high_priority, 1):
                f.write(f"### Action {idx}: {rec['category']}\n\n")
                f.write(f"**Issue**: {rec['issue']}\n\n")
                f.write(f"**Recommendation**: {rec['recommendation']}\n\n")
                f.write("**Steps**:\n")
                f.write("1. Review the affected pages\n")
                f.write("2. Create a backup of current code\n")
                f.write("3. Implement the fix\n")
                f.write("4. Test thoroughly\n")
                f.write("5. Deploy to production\n\n")
                f.write("**Assigned To**: ________________\n")
                f.write("**Due Date**: ________________\n")
                f.write("**Status**: ☐ Not Started / ☐ In Progress / ☐ Complete\n\n")
                f.write("---\n\n")
        
        logger.info(f"Action plan saved to {action_plan_path}")


def main():
    """Main entry point"""
    import argparse
    
    parser = argparse.ArgumentParser(
        description='NARA Complete Optimization Workflow'
    )
    parser.add_argument(
        '--url',
        default='https://nara-web-73384.web.app/',
        help='Base URL of the NARA website'
    )
    parser.add_argument(
        '--output',
        default='nara_complete_analysis',
        help='Output directory for all analysis results'
    )
    
    args = parser.parse_args()
    
    # Run workflow
    workflow = CompleteOptimizationWorkflow(
        base_url=args.url,
        output_dir=args.output
    )
    
    try:
        results = workflow.run_full_workflow()
        
        print("\n" + "=" * 70)
        print("SUCCESS! Optimization workflow complete.")
        print("=" * 70)
        print(f"\nResults saved to: {args.output}/")
        print("\nGenerated files:")
        print("  - optimization_report.json")
        print("  - OPTIMIZATION_REPORT.md")
        print("  - COMPREHENSIVE_REPORT.md")
        print("  - PROPOSED_SITEMAP.md")
        print("  - ACTION_PLAN.md")
        print("\n" + "=" * 70)
        
    except Exception as e:
        logger.error(f"Workflow failed: {str(e)}")
        raise


if __name__ == '__main__':
    main()
