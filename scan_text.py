import os,re
hits=[]
exts=('.tsx','.ts','.jsx','.js')
skip={'node_modules','.next','.git','public'}
def is_user(s):
  if not s or len(s)<2: return False
  if '{' in s and '}' in s: return False
  if '$' in s and '{' in s: return False
  if re.fullmatch(r'[0-9.,+\-\s%]+', s): return False
  if re.fullmatch(r'&[a-zA-Z#0-9]+;', s): return False
  if not re.search(r'[A-Za-z\u00C0-\u017F]', s): return False
  return True
def check(f):
  try:
    with open(f,encoding='utf-8',errors='ignore') as fh: txt=fh.read()
  except: return
  for m in re.finditer(r'>\s*([^<>\n]{1,80})\s*<', txt):
    t=m.group(1)
    if not is_user(t): continue
    start=m.start()
    before=txt[max(0,start-50):start+1]
    if 't(' in before: continue
    line=txt.count('\n',0,start)+1
    hits.append(f+':'+str(line)+':'+t)
    if len(hits)>40: return
  for m in re.finditer(r'(aria-label|title|placeholder|alt)\s*=\s*["\']([^"\']{1,80})["\']', txt):
    t=m.group(2); start=m.start(); before=txt[max(0,start-30):start+1]
    if 't(' in before: continue
    if not is_user(t): continue
    line=txt.count('\n',0,start)+1
    hits.append(f+':'+str(line)+'['+m.group(1)+']:'+t)
    if len(hits)>40: return
for root in ['components','app','lib']:
  for dp,dn,fnames in os.walk(root):
    dn[:] = [d for d in dn if d not in skip and not d.startswith('.')]
    for fn in fnames:
      if fn.endswith(exts):
        check(os.path.join(dp,fn))
for h in hits[:25]: print(h)
if not hits: print('NONE')
