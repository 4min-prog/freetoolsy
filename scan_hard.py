import os,re
hits=[]
exts=('.tsx','.ts','.jsx','.js')
skip={'node_modules','.next','.git','public'}
# exclude if already wrapped in t()? heuristic: look back a bit more
def is_likely_user_text(s):
  if not s or len(s.strip())<2: return False
  s2=s.strip()
  if '{' in s2 and '}' in s2: return False
  if '$' in s2 and '{' in s2: return False
  if re.fullmatch(r'[0-9.,+\-\s%]+', s2): return False
  if re.fullmatch(r'&[a-zA-Z#0-9]+;', s2): return False
  if not re.search(r'[A-Za-z\u00C0-\u017F]', s2): return False
  # common internal strings to skip
  if re.match(r'^(bg-|text-|border-|flex|grid|p-|m-|gap-|w-|h-|rounded|shadow|font-|transition|duration|ease|group|hover:|focus:|dark:)', s2): return False
  if re.match(r'^(className|key|type|role|data-|aria-|tabIndex)$', s2): return False
  return True
def check(f):
  try:
    with open(f,encoding='utf-8',errors='ignore') as fh: txt=fh.read()
  except: return
  # jsx text
  for m in re.finditer(r'>\s*([^<>{}\n][^<>\n]{1,120}?)\s*<', txt):
    t=m.group(1)
    ts=t.strip()
    if not is_likely_user_text(ts): continue
    start=m.start()
    before=txt[max(0,start-80):start+1]
    if 't(' in before: continue  # heuristic
    if re.search(r'useTranslations?\s*\([^)]*\)', before): 
      # if it's a static string in t() call form is different; but better heuristic failed - still skip if near t?
      pass
    line=txt.count('\n',0,start)+1
    hits.append(f+':'+str(line)+':'+ts)
    if len(hits)>30: return
  # attrs
  for m in re.finditer(r'(aria-label|title|placeholder)\s*=\s*["\']([^"\']{2,80})["\']', txt):
    t=m.group(2); start=m.start(); before=txt[max(0,start-40):start+1]
    if 't(' in before: continue
    if not is_likely_user_text(t): continue
    line=txt.count('\n',0,start)+1
    hits.append(f+':'+str(line)+'['+m.group(1)+']:'+t)
    if len(hits)>30: return
for root in ['components','app','lib']:
  for dp,dn,fnames in os.walk(root):
    dn[:] = [d for d in dn if d not in skip and not d.startswith('.')]
    for fn in fnames:
      if fn.endswith(exts): check(os.path.join(dp,fn))
for h in hits[:30]: print(h)
if not hits: print('NONE')
