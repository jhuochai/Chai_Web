from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT
import pypdfium2 as pdfium
from pypdf import PdfReader

OUT = Path(__file__).parent
pdfmetrics.registerFont(TTFont('JhengHei', 'C:/Windows/Fonts/msjh.ttc'))
pdfmetrics.registerFont(TTFont('JhengHeiBold', 'C:/Windows/Fonts/msjhbd.ttc'))
W,H=595.276,841.89
c=canvas.Canvas(str(OUT/'Chai_Yi_Chen_Garena_Resume.pdf'),pagesize=(W,H))
c.setTitle('柴怡辰 | Garena MAP 履歷')
c.setAuthor('柴怡辰')
navy='#111020'; teal='#65D4D2'; copper='#DDA071'; paper='#FAFAFC'; ink='#212334'; muted='#626576'; light='#D8D9E6'
def rect(x,y,w,h,color):
    c.setFillColor(HexColor(color));c.rect(x,y,w,h,stroke=0,fill=1)
def line(x,y,x2,y2,color,width=.7):
    c.setStrokeColor(HexColor(color));c.setLineWidth(width);c.line(x,y,x2,y2)
def txt(s,x,y,size=10,color=ink,bold=False):
    c.setFillColor(HexColor(color));c.setFont('JhengHeiBold' if bold else 'JhengHei',size);c.drawString(x,y,s)
def para(s,x,y,w,size=10.3,color=ink,leading=16,bold=False):
    st=ParagraphStyle('p',fontName='JhengHeiBold' if bold else 'JhengHei',fontSize=size,leading=leading,textColor=HexColor(color),wordWrap='CJK',alignment=TA_LEFT)
    p=Paragraph(s,st);_,h=p.wrap(w,900);p.drawOn(c,x,y-h);return y-h
def section(s,x,y,w):
    txt(s,x,y,12,'#93552F',True);line(x,y-9,x+w,y-9,'#D9D9E3');return y-24
def bullet(s,y):
    rect(216,y-7,3,3,'#459C9C');return para(s,227,y,336)-8

rect(0,0,W,H,paper);rect(0,0,193,H,navy);rect(193,H-156,W-193,156,navy)
# Original geometric ornament, drawn as vectors; no character image behind text.
for j,col in enumerate(['#312440','#46304B','#67405B']):
    line(410+j*18,H,550+j*12,H-144,col,1)
line(27,H-25,565,H-25,copper,.6)
line(27,H-25,27,H-58,copper,.6)
line(565,H-25,565,H-58,copper,.6)
line(193,H-156,W,H-156,teal,1.5)
txt('柴怡辰',32,H-76,29,'#FFFFFF',True)
txt('CHAI YI CHEN',33,H-99,10.5,teal)
txt('遊戲行銷企劃',216,H-63,18,'#FFFFFF',True)
txt('玩家洞察  /  內容企劃  /  AI 協作',216,H-88,10.6,light)
txt('應徵 Garena · 2027 Sea Global MAP',216,H-118,9.6,copper)

sy=H-190
def sidehead(s,y):
    txt(s,30,y,11.5,teal,True);line(30,y-9,161,y-9,'#4A4056');return y-26
sy=sidehead('核心實務',sy)
for s in ['社群內容企劃','玩家互動與回饋整理','Meta 廣告成效判讀','KOC 合作與腳本企劃']:
    sy=para(s,30,sy,136,10.2,light,17)-7
sy=sidehead('工具應用',sy-24)
sy=para('Canva · GPT · Gemini<br/>Meta Ads Manager',30,sy,137,10.2,light,18)-16
sy=sidehead('玩家背景',sy-16)
sy=para('《激鬥峽谷》',30,sy,140,11,'#FFFFFF',18,True)-3
sy=para('宗師段位',30,sy,135,17,copper,22,True)-13
sy=para('亦接觸《第五人格》、<br/>《英雄聯盟》、《虹彩六號》、GTA 5、Minecraft 與 Ready or Not。',30,sy,135,9.6,light,17)-23
sy=sidehead('AI 實作',sy)
sy=para('AI 輔助素材與腳本製作<br/>個人互動作品集網站',30,sy,135,9.8,light,17)-13
sy=para('內容選擇、查證與最終判斷由本人完成。',30,sy,135,9,light,15)
txt('作品集 / PORTFOLIO',30,88,9,teal,True)
txt('chai-web.pages.dev',30,67,10,'#FFFFFF')
c.linkURL('https://chai-web.pages.dev/',(28,61,173,84),relative=0,thickness=0)
line(30,45,161,45,copper,.7)

y=H-185
y=section('個人簡介',216,y,349)
y=para('具遊戲社群、廣告受眾測試與 KOC 合作實務，結合玩家觀察、成效數據與 AI 工具，將內容想法轉化為上線成果。希望透過跨職能輪調，深化對玩家體驗與遊戲營運的理解。',216,y,349)-22
y=section('遊戲行銷經驗',216,y,349)
txt('慧邦科技 Gamesofa',216,y,12,ink,True);y-=20
txt('遊戲行銷企劃實習生',216,y,10,muted);txt('2026/03 - 至今',449,y,9,muted);y-=17
y=bullet('支援貓咪造咖與神來也暗棋，負責 FB／IG／Threads 內容規劃、發布與玩家互動；任職期間貓咪造咖 IG 追蹤由 1.8 萬增至 3 萬（約 +67%）。',y)
y=bullet('獲配 NT$10,000 預算測試暗棋新受眾，運用 Meta 指標與 AI 輔助分析判讀表現；成效未達預期時停止投放。',y)
y=bullet('促成 3 組 KOC 合作，負責條件溝通與腳本大綱。',y)
y=bullet('運用 Canva、GPT、Gemini 完成 24 件跨形式素材，撰寫 26 份實際拍攝上線的腳本。',y)
# Compact case evidence strip.
rect(216,y-55,349,55,'#ECEFF3');rect(216,y-55,2,55,'#4BA6A4')
txt('案例｜貓咪造咖三萬粉系列',226,y-15,9.4,ink,True)
para('參與企劃、發布與玩家回覆；系列第二篇累積<br/>1,476 則留言、383 次分享。',226,y-22,328,9.3,ink,14)
y-=80
y=section('其他經歷',216,y,349)
for title,date,role,body in [
('國立臺北大學','2024/09 - 2026/01','兼任研究助理','於全英語工作環境整理教材與數位內容，支援文件製作及協調。'),
('行動基因生技','2024/07 - 2024/09','人資實習生','3 週完成 200 份人員資料數位化與核對；執行 20 份離職訪談並製作分析報告。'),
('伊林娛樂','2022/07 - 2024/12','專業模特','參與品牌形象與視覺訊息呈現。')]:
    txt(title+'｜'+role,216,y,10,ink,True)
    y-=16;txt(date,216,y,8.8,muted);y-=8
    y=para(body,216,y,349,9.5,ink,14)-14
assert y>28, f'Content too low: {y}'
assert sy>115, f'Sidebar too low: {sy}'
c.showPage();c.save()
path=OUT/'Chai_Yi_Chen_Garena_Resume.pdf'
reader=PdfReader(path)
assert len(reader.pages)==1
text=reader.pages[0].extract_text()
for token in ['柴怡辰','Gamesofa','1,476','383','200','2026/03']:
    assert token in text,token
doc=pdfium.PdfDocument(str(path));doc[0].render(scale=1.7).to_pil().save(OUT/'resume_preview.png')
print(f'Created {path.resolve()} | main bottom={y:.1f}, sidebar bottom={sy:.1f} | 1 page | text verified')

