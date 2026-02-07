#!/usr/bin/env python3
"""
Simple script to convert NARA Act text to PDF
Uses reportlab if available, otherwise creates instructions for manual conversion
"""

import sys
import os

def create_pdf_with_reportlab(lang='en'):
    try:
        from reportlab.lib.pagesizes import A4
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.lib.units import inch
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
        from reportlab.lib.enums import TA_JUSTIFY, TA_CENTER
        from reportlab.pdfbase import pdfmetrics
        from reportlab.pdfbase.ttfonts import TTFont
        
        # Read text file
        txt_path = f"public/documents/nara-act-1981-{lang}.txt"
        pdf_path = f"public/documents/nara-act-1981-{lang}.pdf"
        
        with open(txt_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Create PDF
        doc = SimpleDocTemplate(pdf_path, pagesize=A4,
                                rightMargin=72, leftMargin=72,
                                topMargin=72, bottomMargin=72)
        
        # Container for the 'Flowable' objects
        elements = []
        
        # Define styles - use system fonts for Unicode support
        styles = getSampleStyleSheet()
        
        # For Sinhala/Tamil, we need Unicode-capable fonts
        if lang in ['si', 'ta']:
            # Use system default font which supports Unicode
            font_name = 'Helvetica'  # Fallback, reportlab will handle Unicode
        else:
            font_name = 'Helvetica'
        
        styles.add(ParagraphStyle(name='Justify', alignment=TA_JUSTIFY, fontName=font_name))
        styles.add(ParagraphStyle(name='Center', alignment=TA_CENTER, fontSize=14, fontName=font_name, leading=20))
        
        # Split content into paragraphs
        paragraphs = content.split('\n\n')
        
        for para in paragraphs:
            para = para.strip()
            if not para:
                continue
            
            # Check if it's a title/heading
            if para.isupper() or para.startswith('PARLIAMENT') or para.startswith('AN ACT'):
                p = Paragraph(para.replace('\n', '<br/>'), styles['Center'])
                elements.append(p)
                elements.append(Spacer(1, 12))
            else:
                # Regular paragraph
                p = Paragraph(para.replace('\n', ' '), styles['Justify'])
                elements.append(p)
                elements.append(Spacer(1, 12))
        
        # Build PDF
        doc.build(elements)
        
        print(f"✅ PDF created successfully: {pdf_path}")
        return True
        
    except ImportError:
        return False
    except Exception as e:
        print(f"❌ Error creating PDF: {e}")
        return False

def main():
    import sys
    
    # Get language from command line argument, default to 'en'
    lang = sys.argv[1] if len(sys.argv) > 1 else 'en'
    
    print(f"Creating NARA Act PDF for language: {lang}...")
    
    if create_pdf_with_reportlab(lang):
        print("✅ Done! PDF is ready for download.")
    else:
        print("\n❌ reportlab library not found.")
        print("\n📝 To create PDF, you have 3 options:")
        print("\n1. Install reportlab:")
        print("   pip3 install reportlab")
        print("   python3 create_nara_pdf.py")
        print("\n2. Use Google Docs:")
        print("   - Open public/documents/nara-act-1981-en.txt")
        print("   - Copy content to Google Docs")
        print("   - File → Download → PDF")
        print("   - Save as: nara-act-1981-en.pdf")
        print("\n3. Use Microsoft Word:")
        print("   - Open the .txt file in Word")
        print("   - File → Save As → PDF")
        
        return 1
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
