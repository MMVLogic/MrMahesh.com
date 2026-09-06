with open('_includes/openfit/tab_workout.html', 'r') as f:
    text = f.read()

insert_point = "        <!-- Thumb-Friendly Navigation Action Bar -->"

canvas_html = """
        <!-- Exercise Output Graph -->
        <div class="bg-[#111827] p-3 rounded-xl border border-gray-800 mt-4 mb-4">
            <div class="flex justify-between items-center mb-2">
                <span class="text-[10px] font-bold text-gray-400 font-mono uppercase tracking-wider">Historical Output (Vol)</span>
                <span class="text-[10px] text-yellow-400 font-mono" id="graph-date-display">Hover for details</span>
            </div>
            <div class="relative w-full h-32">
                <canvas id="exercise-output-chart"></canvas>
            </div>
        </div>

"""

if insert_point in text:
    text = text.replace(insert_point, canvas_html + insert_point)
    with open('_includes/openfit/tab_workout.html', 'w') as f:
        f.write(text)
    print("Success")
else:
    print("Could not find insert point")
