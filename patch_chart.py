import re

with open('assets/js/openfit/app.js', 'r') as f:
    text = f.read()

chart_fn = """
    // ── Exercise Output Line Graph (Chart.js) ─────────────────────
    let exerciseChart = null;

    function renderExerciseGraph(exName) {
        const ctx = document.getElementById('exercise-output-chart');
        if (!ctx) return;
        
        // Generate mock historical data (4 previous sessions) + current session
        const dates = [];
        const outputs = [];
        
        const now = new Date();
        for (let i = 4; i >= 1; i--) {
            const d = new Date(now);
            d.setDate(d.getDate() - (i * 3));
            dates.push(`${d.getMonth()+1}/${d.getDate()}`);
            // Mock output between 1500 and 3000
            outputs.push(Math.floor(1500 + Math.random() * 1000 + (4 - i) * 150)); 
        }
        
        // Calculate today's output from active sets
        dates.push('Today');
        let todayOutput = 0;
        if (completedSetsData[exName] && completedSetsData[exName].sets) {
            completedSetsData[exName].sets.forEach(s => {
                if (s.done) {
                    todayOutput += (s.weight * s.reps);
                }
            });
        }
        
        if (todayOutput === 0) {
            // If nothing done today, just carry over last session + small random
            todayOutput = outputs[outputs.length-1] + 50;
        }
        outputs.push(todayOutput);

        if (exerciseChart) {
            exerciseChart.destroy();
        }

        exerciseChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: 'Volume Output (kg)',
                    data: outputs,
                    borderColor: '#eab308', // yellow-500
                    backgroundColor: 'rgba(234, 179, 8, 0.1)',
                    borderWidth: 2,
                    pointBackgroundColor: '#eab308',
                    pointBorderColor: '#111827',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return ` Output: ${context.parsed.y} kg`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { display: false, drawBorder: false },
                        ticks: { color: '#9ca3af', font: { family: 'monospace', size: 10 } }
                    },
                    y: {
                        grid: { color: 'rgba(75, 85, 99, 0.2)', drawBorder: false },
                        ticks: { color: '#9ca3af', font: { family: 'monospace', size: 10 } }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index',
                },
            }
        });
    }
"""

if 'function renderActiveExercise()' in text:
    text = text.replace('function renderActiveExercise() {', chart_fn + '\n    function renderActiveExercise() {')
    
    # Also hook it inside renderExerciseSetTracker so it updates on navigation
    hook = "const exName = ex.name || 'Exercise';"
    text = text.replace(hook, hook + "\n        setTimeout(() => renderExerciseGraph(exName), 100);")
    
    with open('assets/js/openfit/app.js', 'w') as f:
        f.write(text)
    print("Success")
else:
    print("Could not find insertion points.")
