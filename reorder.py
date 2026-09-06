with open('_includes/openfit/tab_calendar.html', 'r') as f:
    text = f.read()

part_matrix = text[:text.find('<!-- QUICK METRIC ENTRY (TODAY) CARD')]
part_metric = text[text.find('<!-- QUICK METRIC ENTRY (TODAY) CARD'):text.find('<!-- SELECTED DATE HISTORICAL TELEMETRY SUMMARY CARD')]
part_summary = text[text.find('<!-- SELECTED DATE HISTORICAL TELEMETRY SUMMARY CARD'):text.find('<!-- Day Selector Carousel -->')]
part_selector = text[text.find('<!-- Day Selector Carousel -->'):text.find('<!-- Selected Day Quick Overview Card -->')]
part_overview = text[text.find('<!-- Selected Day Quick Overview Card -->'):text.rfind('</div>\n\n</div>')]
part_end = text[text.rfind('</div>\n\n</div>'):]

# Ensure we found everything
if not all([part_matrix, part_metric, part_summary, part_selector, part_overview, part_end]):
    print("Failed to find parts!")
    exit(1)

# Reassemble in the new order:
# 1. Matrix
# 2. Selector
# 3. Overview
# 4. Summary
# 5. Metric Entry
new_html = (
    part_matrix +
    part_selector +
    part_overview +
    part_summary +
    part_metric +
    part_end
)

with open('_includes/openfit/tab_calendar.html', 'w') as f:
    f.write(new_html)
print("Success!")
