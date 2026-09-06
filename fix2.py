with open('_includes/openfit/tab_blueprint.html', 'r') as f:
    text = f.read()

# Replace the closing div before danger zone with nothing
target = "    </div>\n\n</div>\n\n    <!-- ═══════════════════════════════════════════════════════════════ -->"
replacement = "    </div>\n\n    <!-- ═══════════════════════════════════════════════════════════════ -->"

text = text.replace(target, replacement)

with open('_includes/openfit/tab_blueprint.html', 'w') as f:
    f.write(text)
