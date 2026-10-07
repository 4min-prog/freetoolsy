import json
tr=json.load(open('messages/tr.json',encoding='utf-8'))
v=tr['ToolContent']['html-entity-converter'][1]['list'][0]
print(v)
