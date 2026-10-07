import json,re,sys
sys.setrecursionlimit(10**7)
en=json.load(open('messages/en.json',encoding='utf-8'))
tr=json.load(open('messages/tr.json',encoding='utf-8'))
issues=[]
def check_str(s,path):
  # ICU tags <...> vs just < char? next-intl treats < as tag start in ICU
  # look for lone < not part of HTML tag? simple: < followed by letter or / is tag; else suspicious?
  # but better: count unclosed/odd; also single quote issues
  # single quote before { or < needs escaping? ' before { is escape in ICU
  # unbalanced braces { }
  opens = s.count('{')
  closes = s.count('}')
  if opens != closes:
    issues.append(('UNBALANCED_BRACES', path, s[:60]))
    return
  # check for < that is not HTML-like tag and not escaped? maybe any < char can be problematic if not handled as tag in ICU
  if '<' in s:
    # see if all < > form valid tags? naive
    if re.search(r'<(?!/?[a-zA-Z][^>]*>)', s):
      # could be just < char
      issues.append(('LONE_ANGLE', path, s[:60]))
  # single quote before { or < without proper ICU escaping context is ambiguous; flag if ' followed by { or <
  if re.search(r"'[<{]", s):
    issues.append(('POSS_ICU_QUOTE', path, s[:60]))
  if re.search(r'""', s): pass
def walk(obj,path):
  if isinstance(obj,dict):
    for k,v in obj.items(): 
      walk(v, path + ('.'+k if path else k))
  elif isinstance(obj,str):
    check_str(obj,path)
  elif isinstance(obj,list):
    for i,v in enumerate(obj): 
      if isinstance(v,(str,dict,list)): walk(v, path + f'[{i}]')
walk(en,'en')
walk(tr,'tr')
for it in issues[:40]:
  print(*it)
if not issues: print('NONE')
