"""
build_html_docs.py: Converts DOCUMENTATION.md into a printable DOCUMENTATION.html
"""
import os
import re
import html

def md_to_html(md_text):
    lines = md_text.split('\n')
    out = []
    in_code = False
    in_table = False
    table_lines = []

    def flush_table():
        nonlocal in_table, table_lines
        if not table_lines:
            return
        out.append('<table>')
        is_header = True
        for row in table_lines:
            cells = [c.strip() for c in row.split('|')[1:-1]]
            if not cells or all(re.match(r'^:?-+:?$', c) for c in cells):
                is_header = False
                continue
            out.append('<tr>')
            tag = 'th' if is_header else 'td'
            for cell in cells:
                # Basic inline formatting
                c_html = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', cell)
                c_html = re.sub(r'`(.*?)`', r'<code>\1</code>', c_html)
                out.append(f'<{tag}>{c_html}</{tag}>')
            out.append('</tr>')
            if is_header:
                is_header = False
        out.append('</table>')
        table_lines = []
        in_table = False

    for line in lines:
        if line.startswith('```'):
            if in_table:
                flush_table()
            if in_code:
                out.append('</code></pre>')
                in_code = False
            else:
                lang = line[3:].strip()
                out.append(f'<pre><code class="language-{lang}">')
                in_code = True
            continue

        if in_code:
            out.append(html.escape(line))
            continue

        if line.startswith('|'):
            in_table = True
            table_lines.append(line)
            continue
        elif in_table:
            flush_table()

        if line.startswith('# '):
            out.append(f'<h1>{line[2:]}</h1>')
        elif line.startswith('## '):
            out.append(f'<h2>{line[3:]}</h2>')
        elif line.startswith('### '):
            out.append(f'<h3>{line[4:]}</h3>')
        elif line.startswith('#### '):
            out.append(f'<h4>{line[5:]}</h4>')
        elif line.startswith('> '):
            out.append(f'<blockquote>{line[2:]}</blockquote>')
        elif line.startswith('- ') or line.startswith('* '):
            item = line[2:]
            item = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', item)
            item = re.sub(r'`(.*?)`', r'<code>\1</code>', item)
            out.append(f'<li>{item}</li>')
        elif line.strip() == '---':
            out.append('<hr>')
        elif line.strip():
            p = line
            p = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', p)
            p = re.sub(r'`(.*?)`', r'<code>\1</code>', p)
            out.append(f'<p>{p}</p>')

    if in_table:
        flush_table()

    return '\n'.join(out)

def main():
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    md_file = os.path.join(root, 'DOCUMENTATION.md')
    html_file = os.path.join(root, 'DOCUMENTATION.html')

    with open(md_file, 'r', encoding='utf-8') as f:
        md_text = f.read()

    body = md_to_html(md_text)

    doc = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>IPC Chat Engine — Comprehensive Technical Documentation</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet">
<style>
    body {{
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        line-height: 1.7;
        color: #1e293b;
        background: #f1f5f9;
        margin: 0;
        padding: 40px 20px;
    }}
    .container {{
        max-width: 1040px;
        margin: 0 auto;
        background: #ffffff;
        padding: 60px 70px;
        border-radius: 14px;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.07);
        border: 1px solid #e2e8f0;
    }}
    h1 {{ color: #0f172a; font-size: 2.2rem; border-bottom: 2px solid #0284c7; padding-bottom: 12px; margin-top: 0; }}
    h2 {{ color: #0369a1; font-size: 1.5rem; margin-top: 40px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; }}
    h3 {{ color: #0f172a; font-size: 1.2rem; margin-top: 26px; }}
    h4 {{ color: #475569; font-size: 1.05rem; margin-top: 18px; }}
    pre {{ background: #0f172a; color: #f8fafc; padding: 20px; border-radius: 8px; overflow-x: auto; font-family: 'Fira Code', monospace; font-size: 0.88rem; }}
    code {{ font-family: 'Fira Code', monospace; background: #f1f5f9; padding: 2px 6px; border-radius: 4px; color: #0369a1; font-size: 0.9em; }}
    pre code {{ background: transparent; color: inherit; padding: 0; }}
    table {{ width: 100%; border-collapse: collapse; margin: 24px 0; font-size: 0.92rem; }}
    th, td {{ border: 1px solid #cbd5e1; padding: 12px 14px; text-align: left; }}
    th {{ background: #f8fafc; font-weight: 600; color: #0f172a; }}
    tr:nth-child(even) {{ background: #f8fafc; }}
    blockquote {{ border-left: 4px solid #0284c7; margin: 16px 0; padding: 10px 18px; background: #f0f9ff; color: #0369a1; border-radius: 0 6px 6px 0; }}
    li {{ margin: 6px 0; }}
    hr {{ border: none; border-top: 1px solid #e2e8f0; margin: 30px 0; }}
    @media print {{
        body {{ background: #fff; padding: 0; }}
        .container {{ box-shadow: none; border: none; padding: 0; max-width: 100%; }}
    }}
</style>
</head>
<body>
<div class="container">
{body}
</div>
</body>
</html>"""

    with open(html_file, 'w', encoding='utf-8') as f:
        f.write(doc)

    print(f"Generated HTML documentation: {html_file}")

if __name__ == '__main__':
    main()
