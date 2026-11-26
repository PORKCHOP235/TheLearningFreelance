"""Scan the live site with Mozilla HTTP Observatory and print the grade and each test.

Needs the scanner once:  npm install -g @mdn/mdn-http-observatory
Run:                     python tools/security_check.py [host]
"""
import json, shutil, subprocess, sys

host = sys.argv[1] if len(sys.argv) > 1 else 'thelearningfreelancejonel.vercel.app'
exe = shutil.which('mdn-http-observatory-scan')
if not exe:
    sys.exit('Scanner not found. Install it: npm install -g @mdn/mdn-http-observatory')
out = subprocess.run([exe, host], capture_output=True, text=True, encoding='utf-8').stdout
data = json.loads(out[out.index('{'):])
scan = data['scan']
print(f"{host}: grade {scan['grade']} (score {scan['score']}), {scan['testsPassed']}/{scan['testsQuantity']} tests passed")
for name, t in data['tests'].items():
    print(f"  {'PASS' if t['pass'] else 'FAIL'}  {name:32} {t['result']}")
sys.exit(0 if scan['testsFailed'] == 0 else 1)
