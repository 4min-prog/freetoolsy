import os,re,sys
sys.stdout.reconfigure(encoding='utf-8')
hits=[]
exts=('.tsx','.ts','.jsx','.js')
skip={'node_modules','.next','.git','public'}
def is_user(s):
  if not s: return False
  s2=s.strip()
  if len(s2)<2: return False
  if '{' in s2 and '}' in s2: return False
  if '$' in s2 and '{' in s2: return False
  if re.fullmatch(r'[0-9.,+\-\s%]+', s2): return False
  if re.fullmatch(r'&[a-zA-Z#0-9]+;', s2): return False
  if not re.search(r'[A-Za-z\u00C0-\u017F]', s2): return False
  # skip common code-ish patterns
  if re.search(r'&&|\|\||\?\s*:|return |if\s*\(|for\s*\(|const |let |function |class ', s2): return False
  return True
def check(f):
  try:
    with open(f,encoding='utf-8',errors='ignore') as fh: txt=fh.read()
  except: return
  # jsx text
  for m in re.finditer(r'>\s*([^<>\n]{1,120})\s*<', txt):
    t=m.group(1)
    ts=t.strip()
    if not is_user(ts): continue
    start=m.start()
    before=txt[max(0,start-60):start+1]
    if 't(' in before or 'useTranslations' in before: continue
    line=txt.count('\n',0,start)+1
    hits.append((f,line,ts,'text'))
    if len(hits)>25: return
  # attrs
  for m in re.finditer(r'(aria-label|title|placeholder|alt)\s*=\s*["\']([^"\']{1,80})["\']', txt):
    t=m.group(2); start=m.start(); before=txt[max(0,start-40):start+1]
    if 't(' in before: continue
    if not is_user(t): continue
    line=txt.count('\n',0,start)+1
    hits.append((f,line,t,m.group(1)))
    if len(hits)>25: return
for root in ['components','app','lib']:
  for dp,dn,fnames in os.walk(root):
    dn[:] = [d for d in dn if d not in skip and not d.startswith('.')]
    for fn in fnames:
      if fn.endswith(exts): check(os.path.join(dp,fn))
for f,l,t,a in hits[:20]:
  loc = f.replace('\\','/')+':'+str(l)
  if a!='text': loc += '['+a+']'
  print(loc+':'+t)
if not hits: print('NONE')
