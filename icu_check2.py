import json,re,sys
sys.stdout.reconfigure(encoding='utf-8')
en=json.load(open('messages/en.json',encoding='utf-8'))
tr=json.load(open('messages/tr.json',encoding='utf-8'))
issues=[]
def check_str(s,path):
  opens=s.count('{'); closes=s.count('}')
  if opens!=closes:
    issues.append(('UNBAL',path))
    return
  # lone < not part of HTML tag
  if '<' in s:
    if re.search(r'<(?!/?[a-zA-Z][^>]*>)', s):
      issues.append(('LONE_LT',path))
  if re.search(r"'[<{]", s):
    issues.append(('QUOTE',path))
def walk(obj,path):
  if isinstance(obj,dict):
    for k,v in obj.items(): walk(v, path+'.'+k if path else k)
  elif isinstance(obj,str): check_str(obj,path)
  elif isinstance(obj,list):
    for i,v in enumerate(obj): 
      if isinstance(v,(dict,list,str)): walk(v,path+f'[{i}]')
walk(en,'en'); walk(tr,'tr')
# dedup
seen=set()
for it in issues:
  key=it
  if key in seen: continue
  seen.add(key)
  print(*it)
if not issues: print('NONE')
