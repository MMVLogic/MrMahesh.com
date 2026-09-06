with open('assets/js/openfit/onboarding.js', 'r') as f:
    text = f.read()

text = text.replace("localStorage.setItem('mrmahesh_openfit_custom_split', JSON.stringify(generatedSplit));", 
"localStorage.setItem('mrmahesh_openfit_custom_split', JSON.stringify(generatedSplit));\n    localStorage.setItem('mrmahesh_openfit_prefs', JSON.stringify({ availableEquipment: equipment, userWeightKg: currentWeight }));")

with open('assets/js/openfit/onboarding.js', 'w') as f:
    f.write(text)
