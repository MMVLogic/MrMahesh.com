with open('_includes/openfit/tab_blueprint.html', 'r') as f:
    text = f.read()

# I will find the `</div>\n\n    <!-- ═══════════════════════════════════════════════════════════════ -->\n    <!-- DANGER ZONE: RESET DATA`
# And remove the `</div>` from there, and put it at the very bottom.
import re

# Remove any stray closing tags at the very bottom and then clean up the boundary
text = text.replace("</div>\n\n    <!-- ═══════════════════════════════════════════════════════════════ -->\n    <!-- DANGER ZONE: RESET DATA", 
"\n    <!-- ═══════════════════════════════════════════════════════════════ -->\n    <!-- DANGER ZONE: RESET DATA")

# Make sure there is only one `</div>` at the very end to close `#blueprint-panel`
text = text.rstrip()
while text.endswith('</div>'):
    text = text[:-6].rstrip()

text = text + '\n\n</div>'

with open('_includes/openfit/tab_blueprint.html', 'w') as f:
    f.write(text)
