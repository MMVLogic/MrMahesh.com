with open('_includes/openfit/tab_blueprint.html', 'r') as f:
    text = f.read()

# Replace the modal wrappers
text = text.replace('<div id="blueprint-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">\n    <div class="relative w-full max-w-lg bg-[#1a202c] border border-gray-700 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto space-y-4 p-4">\n        <div class="flex justify-between items-center mb-4 sticky top-0 bg-[#1a202c] py-2 border-b border-gray-800 z-10">\n            <h2 class="text-lg font-bold text-yellow-500 font-mono">⚙️ Settings & Blueprint</h2>\n            <button onclick="closeBlueprintModal()" class="text-gray-400 hover:text-white font-bold text-xl">&times;</button>\n        </div>',
'''<div id="blueprint-panel" class="hidden space-y-4 animate-fade-in font-mono">
    <!-- Header -->
    <div class="flex items-center gap-3 bg-[#1a202c] p-4 rounded-xl border border-gray-700">
        <button onclick="closeBlueprintModal()" class="text-gray-400 hover:text-yellow-500 font-bold transition-colors">&larr; Back</button>
        <h2 class="text-lg font-bold text-yellow-500 flex-1 text-right">⚙️ Settings</h2>
    </div>''')

# Replace the closing tags at the very bottom
text = text.replace('    </div>\n</div>', '</div>')

# Add the Danger Zone at the end
danger_zone = '''
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- DANGER ZONE: RESET DATA                                         -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <div class="bg-[#1a202c] p-5 rounded-2xl border-2 border-dashed border-red-500/50 space-y-3 font-mono mt-8">
        <div class="flex justify-between items-center">
            <span class="text-xs font-bold text-red-400 uppercase tracking-wider">⚠️ Danger Zone</span>
        </div>
        <p class="text-xs text-gray-400">Completely wipe all historical telemetry, customized protocols, and onboarding data. This action is irreversible.</p>
        
        <button id="btn-initiate-reset" onclick="document.getElementById('reset-auth-container').classList.remove('hidden'); this.classList.add('hidden');" class="w-full p-3 bg-red-500/10 text-red-500 border border-red-500/30 font-bold rounded-xl hover:bg-red-500 hover:text-white transition-all text-xs uppercase tracking-wider mt-2">
            Reset All Data
        </button>

        <div id="reset-auth-container" class="hidden space-y-3 pt-3 border-t border-red-500/20 mt-3">
            <p class="text-xs text-gray-300 font-bold">Authentication Required</p>
            <input type="email" id="reset-auth-email" placeholder="Email address" class="w-full bg-[#0d1117] border border-gray-700 rounded-lg p-2.5 text-gray-200 text-xs focus:outline-none focus:border-red-500">
            <input type="password" id="reset-auth-password" placeholder="Password" class="w-full bg-[#0d1117] border border-gray-700 rounded-lg p-2.5 text-gray-200 text-xs focus:outline-none focus:border-red-500">
            
            <div class="flex gap-2">
                <button onclick="document.getElementById('reset-auth-container').classList.add('hidden'); document.getElementById('btn-initiate-reset').classList.remove('hidden');" class="flex-1 p-2.5 bg-gray-800 text-gray-300 rounded-lg text-xs font-bold hover:bg-gray-700 transition-colors">
                    Cancel
                </button>
                <button onclick="confirmDataReset()" class="flex-1 p-2.5 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-500 transition-colors">
                    Confirm Wipe
                </button>
            </div>
            <p id="reset-auth-error" class="text-[10px] text-red-400 hidden"></p>
        </div>
    </div>
'''

if "</div>" in text:
    text = text.rstrip()
    if text.endswith('</div>'):
        text = text[:-6] + danger_zone + '\n</div>'
        
    with open('_includes/openfit/tab_blueprint.html', 'w') as f:
        f.write(text)
    print("Success")
else:
    print("Failed")
