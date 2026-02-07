# Quick Start Guide - NARA Website Optimization Agent

## 🚀 Getting Started in 5 Minutes

### Step 1: Install Dependencies (30 seconds)

```bash
pip install -r requirements.txt
```

### Step 2: Run the Optimizer (2-3 minutes)

```bash
python nara_optimizer.py
```

That's it! The agent will:
- ✅ Crawl the website
- ✅ Analyze structure and content
- ✅ Generate detailed reports

### Step 3: Review Results

Open these files in the `nara_analysis/` directory:
1. **OPTIMIZATION_REPORT.md** - Start here! Human-readable summary
2. **optimization_report.json** - Complete data (for developers)

---

## 📊 Understanding Your Results

### The Report Shows:

**Executive Summary**
```
✅ 45 pages analyzed
⚠️ 12 broken links found
⚠️ 5 duplicate content issues
⚠️ 23 placeholder texts
✅ 18 pages need accessibility fixes
```

**Priority Actions**
- 🔴 High Priority: Fix these NOW
- 🟡 Medium Priority: Plan for next sprint
- 🟢 Low Priority: Future improvements

---

## 🎯 Common Use Cases

### Use Case 1: Quick Health Check

```bash
# Analyze just 20 pages
python nara_optimizer.py --max-pages 20
```

**When to use**: Daily/weekly check-ups

### Use Case 2: Full Site Audit

```bash
# Analyze entire site
python nara_optimizer.py --max-pages 200
```

**When to use**: Monthly comprehensive audit

### Use Case 3: Complete Optimization Workflow

```bash
# Run everything (analysis + optimization + action plan)
python run_complete_optimization.py
```

**When to use**: Major optimization project

---

## 🔧 Most Common Issues & Fixes

### Issue 1: Broken Links
**Found in**: `broken_links` section
**Quick fix**: 
```python
# The report shows exact URLs
# Replace or remove them in your HTML
```

### Issue 2: Missing Alt Text
**Found in**: `page_metadata` section
**Quick fix**:
```html
<!-- Before -->
<img src="logo.png">

<!-- After -->
<img src="logo.png" alt="NARA Logo">
```

### Issue 3: Multiple H1 Headings
**Found in**: `page_metadata` section
**Quick fix**:
```html
<!-- Before -->
<h1>Welcome</h1>
<h1>About NARA</h1>

<!-- After -->
<h1>Welcome</h1>
<h2>About NARA</h2>
```

### Issue 4: Duplicate Content
**Found in**: `duplicate_content` section
**Quick fix**:
1. Choose the best page (canonical)
2. Redirect others with 301
3. Update internal links

---

## 📁 File Structure

```
nara-optimization-agent/
│
├── nara_optimizer.py              # Main analysis engine
├── content_optimizer.py           # Content optimization module
├── run_complete_optimization.py   # Complete workflow
├── config.py                      # Configuration settings
├── requirements.txt               # Python dependencies
├── README.md                      # Full documentation
└── QUICKSTART.md                  # This file!
```

---

## ⚡ Pro Tips

### Tip 1: Start Small
Don't crawl 1000 pages on your first run. Start with 20-50.

```bash
python nara_optimizer.py --max-pages 20
```

### Tip 2: Use Configuration
Edit `config.py` to customize:
- What to check
- Priority levels
- Output format

### Tip 3: Automate It
Run weekly audits with cron:

```bash
# Add to crontab
0 9 * * 1 cd /path/to/agent && python nara_optimizer.py
```

### Tip 4: Track Progress
Keep previous reports to compare:

```bash
python nara_optimizer.py --output analysis_week1
python nara_optimizer.py --output analysis_week2
python nara_optimizer.py --output analysis_week3
```

---

## 🎓 Learning Path

### Beginner (Day 1)
1. ✅ Run basic optimizer
2. ✅ Read OPTIMIZATION_REPORT.md
3. ✅ Fix 3 broken links

### Intermediate (Week 1)
1. ✅ Run complete workflow
2. ✅ Fix all high-priority issues
3. ✅ Consolidate duplicate content

### Advanced (Month 1)
1. ✅ Customize config.py
2. ✅ Set up automated audits
3. ✅ Integrate with CI/CD

---

## 🆘 Troubleshooting

### Problem: "403 Forbidden" error
**Solution**: Run from authorized network or add credentials

### Problem: "No pages crawled"
**Solution**: Check if website is accessible, verify URL

### Problem: "Module not found"
**Solution**: Run `pip install -r requirements.txt`

### Problem: Script runs slowly
**Solution**: Reduce `--max-pages` or increase `CRAWL_DELAY_SECONDS`

---

## 📞 Getting Help

1. **Check README.md** - Full documentation
2. **Review logs** - Look in `nara_analysis/` directory
3. **Check configuration** - Verify `config.py` settings
4. **Contact team** - Ask your development lead

---

## ✅ Quick Checklist

Before running the optimizer:
- [ ] Python 3.8+ installed
- [ ] Dependencies installed (`pip install -r requirements.txt`)
- [ ] Website URL is accessible
- [ ] You have write permissions for output directory

After running the optimizer:
- [ ] Review OPTIMIZATION_REPORT.md
- [ ] Note high-priority issues
- [ ] Create action plan
- [ ] Backup website before making changes
- [ ] Test fixes on staging first

---

## 🎉 Success Metrics

Track these after optimization:

| Metric | Before | Target | After |
|--------|--------|--------|-------|
| Broken Links | ? | 0 | ? |
| Duplicate Pages | ? | 0 | ? |
| Accessibility Score | ? | 90+ | ? |
| Images with Alt Text | ? | 100% | ? |
| Placeholder Text | ? | 0 | ? |

---

## 📚 Next Steps

1. **Run the optimizer** ✨
2. **Read the report** 📖
3. **Fix high-priority issues** 🔧
4. **Test thoroughly** 🧪
5. **Deploy with confidence** 🚀

---

**Need more details?** Check the [full README.md](README.md)

**Ready to optimize?** Run `python nara_optimizer.py` now!

---

*Last Updated: October 2025*
*Version: 1.0*
