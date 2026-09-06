import re

with open('assets/js/openfit/app.js', 'r') as f:
    text = f.read()

# We need to find the end of the btn-log-set click listener.
# Searching for: saveAppState(); renderExerciseSetTracker();
# and inserting setTimeout(() => renderExerciseGraph(exName), 50);

hook = "saveAppState();\\n                renderExerciseSetTracker();"
if "saveAppState();" in text and "renderExerciseSetTracker();" in text:
    # Try regex replace
    text = re.sub(r'(saveAppState\(\);\s*renderExerciseSetTracker\(\);)', r'\1\n                setTimeout(() => renderExerciseGraph(exName), 50);', text)
    with open('assets/js/openfit/app.js', 'w') as f:
        f.write(text)
    print("Success")
else:
    print("Could not find hook.")
