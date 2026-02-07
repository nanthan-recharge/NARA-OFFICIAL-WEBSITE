#!/usr/bin/env python3
"""
NARA Optimizer - Demo and Test Script
======================================
Demonstrates usage of the NARA optimization tools with examples.
"""

from content_optimizer import (
    ContentOptimizer,
    DuplicateContentResolver,
    PlaceholderReplacer
)
from pathlib import Path
import json


def demo_content_optimization():
    """Demonstrate content optimization capabilities"""
    print("=" * 70)
    print("DEMO: Content Optimization")
    print("=" * 70)
    
    # Sample problematic HTML
    sample_html = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>NARA - About Us</title>
    </head>
    <body>
        <div class="header">
            <h3>National Aquatic Resources Research Agency</h3>
        </div>
        
        <div class="content">
            <h1>About NARA</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
            
            <h1>Our Mission</h1>
            <p>We are dedicated to aquatic research.</p>
            
            <h4>Research Areas</h4>
            <p>Coming soon...</p>
            
            <img src="lab.jpg">
            <img src="team.jpg" alt="">
            
            <a href="https://external-site.com">Visit Partner Site</a>
        </div>
    </body>
    </html>
    """
    
    print("\n📝 Original HTML has issues:")
    print("  - Multiple H1 headings")
    print("  - Broken heading hierarchy (H1 -> H4)")
    print("  - Images without alt text")
    print("  - External link without target='_blank'")
    print("  - Placeholder text ('Coming soon', 'Lorem ipsum')")
    
    # Run optimization
    optimizer = ContentOptimizer()
    optimized_html, modifications = optimizer.optimize_html_structure(
        sample_html,
        'https://example.com/about'
    )
    
    print(f"\n✅ Found {len(modifications)} issues:\n")
    
    for idx, mod in enumerate(modifications, 1):
        severity_icon = {
            'high': '🔴',
            'medium': '🟡',
            'low': '🟢'
        }.get(mod['severity'], '⚪')
        
        print(f"{idx}. {severity_icon} [{mod['severity'].upper()}] {mod['type']}")
        print(f"   Issue: {mod['issue']}")
        print(f"   Recommendation: {mod['recommendation']}")
        if 'fixed' in mod:
            print(f"   ✓ Auto-fixed: {mod['fixed']} items")
        print()
    
    return modifications


def demo_duplicate_resolution():
    """Demonstrate duplicate content resolution"""
    print("\n" + "=" * 70)
    print("DEMO: Duplicate Content Resolution")
    print("=" * 70)
    
    # Sample duplicate content data
    duplicate_groups = [
        {
            'type': 'exact_duplicate',
            'pages': [
                'https://example.com/about',
                'https://example.com/about-us',
                'https://example.com/about-nara'
            ],
            'content_length': 1500
        },
        {
            'type': 'similar_content',
            'pages': [
                'https://example.com/services',
                'https://example.com/our-services'
            ],
            'similarity': 0.92
        }
    ]
    
    print("\n📋 Sample duplicate content issues:")
    print(f"  - {len(duplicate_groups)} duplicate groups found")
    
    resolver = DuplicateContentResolver()
    resolutions = resolver.analyze_duplicates(duplicate_groups)
    
    print(f"\n✅ Generated {len(resolutions)} resolution recommendations:\n")
    
    for idx, resolution in enumerate(resolutions, 1):
        print(f"{idx}. Type: {resolution['type']}")
        
        if resolution['type'] == 'consolidate':
            print(f"   Canonical URL: {resolution['canonical_url']}")
            print(f"   Redirect from:")
            for url in resolution['redirect_urls']:
                print(f"     - {url}")
            print(f"   Action: {resolution['action']}")
            
            if 'implementation' in resolution:
                print("   Implementation steps:")
                for step, action in resolution['implementation'].items():
                    print(f"     {step}: {action}")
        
        elif resolution['type'] == 'merge_or_differentiate':
            print(f"   Similarity: {resolution.get('similarity', 'N/A')}")
            print(f"   Action: {resolution['action']}")
            print("   Questions to consider:")
            for q in resolution.get('questions', []):
                print(f"     - {q}")
        
        print()
    
    return resolutions


def demo_navigation_optimization():
    """Demonstrate navigation optimization"""
    print("\n" + "=" * 70)
    print("DEMO: Navigation Structure Optimization")
    print("=" * 70)
    
    # Sample navigation data with duplicates
    nav_data = [
        {
            'page': 'https://example.com/index',
            'items': [
                {'text': 'Home', 'href': '/'},
                {'text': 'About', 'href': '/about'},
                {'text': 'Services', 'href': '/services'},
                {'text': 'Contact', 'href': '/contact'}
            ]
        },
        {
            'page': 'https://example.com/about',
            'items': [
                {'text': 'Home', 'href': '/'},
                {'text': 'About Us', 'href': '/about'},  # Duplicate
                {'text': 'About NARA', 'href': '/about'},  # Duplicate
                {'text': 'Our Services', 'href': '/services'},  # Duplicate
                {'text': 'Contact Us', 'href': '/contact'}
            ]
        }
    ]
    
    print("\n📊 Current navigation issues:")
    print("  - Inconsistent menu items across pages")
    print("  - Duplicate links (About/About Us/About NARA)")
    print("  - No clear hierarchy")
    
    optimizer = ContentOptimizer()
    optimized_nav = optimizer.optimize_navigation_structure(nav_data)
    
    print("\n✅ Proposed navigation structure:\n")
    
    if 'main_navigation' in optimized_nav:
        for item in optimized_nav['main_navigation']:
            print(f"📁 {item['label']}")
            if item['children']:
                for child in item['children']:
                    print(f"   └─ {child}")
            print()
    
    if 'recommendations' in optimized_nav:
        print("📋 Recommendations:")
        for rec in optimized_nav['recommendations']:
            print(f"  - {rec['issue']}: {rec['action']}")
    
    return optimized_nav


def demo_sitemap_generation():
    """Demonstrate sitemap generation"""
    print("\n" + "=" * 70)
    print("DEMO: Sitemap Structure Generation")
    print("=" * 70)
    
    optimizer = ContentOptimizer()
    sitemap = optimizer.generate_sitemap_structure({})
    
    print("\n📄 Generated comprehensive sitemap structure")
    print("   (Saved to proposed_sitemap.txt)\n")
    
    # Save to file
    with open('/home/claude/proposed_sitemap.txt', 'w') as f:
        f.write(sitemap)
    
    # Show excerpt
    lines = sitemap.split('\n')
    print("Preview (first 30 lines):")
    print("-" * 70)
    for line in lines[:30]:
        print(line)
    print("-" * 70)
    print(f"... ({len(lines)} total lines)")
    
    return sitemap


def demo_placeholder_replacement():
    """Demonstrate placeholder text handling"""
    print("\n" + "=" * 70)
    print("DEMO: Placeholder Text Replacement")
    print("=" * 70)
    
    sample_html = """
    <div>
        <h2>Research Programs</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        <p>More details coming soon.</p>
        <p>This section is under construction.</p>
        <p>TBD - to be determined later.</p>
    </div>
    """
    
    print("\n📝 Original HTML contains:")
    print("  - Lorem ipsum text")
    print("  - 'Coming soon' notice")
    print("  - 'Under construction' notice")
    print("  - 'TBD' placeholder")
    
    replacer = PlaceholderReplacer()
    replaced_html, replacements = replacer.replace_placeholders_in_html(sample_html)
    
    print(f"\n✅ Replaced {len(replacements)} placeholders:\n")
    
    for idx, rep in enumerate(replacements, 1):
        print(f"{idx}. Original: {rep['original']}")
        print(f"   Replaced with: {rep['replaced_with']}")
        print(f"   In: <{rep['parent_tag']}> tag")
        print()
    
    return replacements


def generate_demo_report():
    """Generate a comprehensive demo report"""
    print("\n" + "=" * 70)
    print("GENERATING COMPREHENSIVE DEMO REPORT")
    print("=" * 70)
    
    report = {
        'demo_title': 'NARA Website Optimization - Demo Results',
        'content_optimization': demo_content_optimization(),
        'duplicate_resolution': demo_duplicate_resolution(),
        'navigation_optimization': demo_navigation_optimization(),
        'sitemap_generation': demo_sitemap_generation(),
        'placeholder_replacement': demo_placeholder_replacement()
    }
    
    # Save report
    report_path = Path('/home/claude/demo_report.json')
    
    # Convert non-serializable objects to strings
    serializable_report = {
        'demo_title': report['demo_title'],
        'content_optimization_count': len(report['content_optimization']),
        'duplicate_resolution_count': len(report['duplicate_resolution']),
        'navigation_optimized': 'main_navigation' in report['navigation_optimization'],
        'sitemap_generated': len(report['sitemap_generation']) > 0,
        'placeholders_replaced': len(report['placeholder_replacement'])
    }
    
    with open(report_path, 'w') as f:
        json.dump(serializable_report, f, indent=2)
    
    print(f"\n✅ Demo report saved to: {report_path}")
    
    return report


def print_usage_examples():
    """Print usage examples"""
    print("\n" + "=" * 70)
    print("USAGE EXAMPLES")
    print("=" * 70)
    
    examples = [
        {
            'title': 'Basic Website Analysis',
            'command': 'python nara_optimizer.py',
            'description': 'Analyzes the NARA website and generates reports'
        },
        {
            'title': 'Quick Health Check (20 pages)',
            'command': 'python nara_optimizer.py --max-pages 20',
            'description': 'Quick analysis of first 20 pages'
        },
        {
            'title': 'Custom Output Directory',
            'command': 'python nara_optimizer.py --output my_analysis',
            'description': 'Saves results to custom directory'
        },
        {
            'title': 'Complete Optimization Workflow',
            'command': 'python run_complete_optimization.py',
            'description': 'Runs full analysis + optimization + action plan'
        },
        {
            'title': 'Using as Python Module',
            'command': '''
from nara_optimizer import NARAWebsiteOptimizer

optimizer = NARAWebsiteOptimizer('https://nara-web-73384.web.app/')
report = optimizer.run_complete_analysis()
print(f"Analyzed {report['summary']['total_pages_analyzed']} pages")
            ''',
            'description': 'Import and use in your own scripts'
        }
    ]
    
    for idx, example in enumerate(examples, 1):
        print(f"\n{idx}. {example['title']}")
        print(f"   Description: {example['description']}")
        print(f"   Command:")
        for line in example['command'].strip().split('\n'):
            print(f"   {line}")


def main():
    """Run all demos"""
    print("\n")
    print("╔" + "═" * 68 + "╗")
    print("║" + " " * 15 + "NARA WEBSITE OPTIMIZATION AGENT" + " " * 21 + "║")
    print("║" + " " * 20 + "Demo & Test Script" + " " * 28 + "║")
    print("╚" + "═" * 68 + "╝")
    
    try:
        # Run all demos
        report = generate_demo_report()
        
        # Print usage examples
        print_usage_examples()
        
        print("\n" + "=" * 70)
        print("✅ DEMO COMPLETE!")
        print("=" * 70)
        print("\nGenerated files:")
        print("  - demo_report.json")
        print("  - proposed_sitemap.txt")
        print("\nNext steps:")
        print("  1. Review the demo output above")
        print("  2. Try running: python nara_optimizer.py --max-pages 10")
        print("  3. Check the QUICKSTART.md guide")
        print("  4. Read the full README.md documentation")
        print("\n" + "=" * 70)
        
    except Exception as e:
        print(f"\n❌ Demo failed: {str(e)}")
        import traceback
        traceback.print_exc()


if __name__ == '__main__':
    main()
