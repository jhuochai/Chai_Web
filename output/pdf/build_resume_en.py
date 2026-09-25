from pathlib import Path
from PIL import Image
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
from pypdf import PdfReader
import pypdfium2 as pdfium

out=Path(__file__).parent
for name,file in [('Display','BASKVILL.TTF'),('Body','calibri.ttf'),('Bold','calibrib.ttf')]:
    pdfmetrics.registerFont(TTFont(name,'C:/Windows/Fonts/'+file))
pdfmetrics.registerFontFamily('Body',normal='Body',bold='Bold')
W,H=595.276,841.89
path=out/'Chai_Yi_Chen_Garena_Resume_EN.pdf'
c=canvas.Canvas(str(path),pagesize=(W,H));c.setTitle('Chai Yi Chen | Garena MAP Resume');c.setAuthor('Chai Yi Chen')
bg='#141823';gold='#CDB17A';white='#EFECE4';gray='#BCBFC4';teal='#89BCB9'
def line(x,y,xx,yy,col=gold,w=.6):
    c.setStrokeColor(HexColor(col));c.setLineWidth(w);c.line(x,y,xx,yy)
def rect(x,y,w,h,col):
    c.setFillColor(HexColor(col));c.rect(x,y,w,h,stroke=0,fill=1)
def text(s,x,y,size=10,font='Body',col=white):
    c.setFillColor(HexColor(col));c.setFont(font,size);c.drawString(x,y,s)
def para(s,x,y,w=335,size=10.5,col=white,lead=14):
    p=Paragraph(s,ParagraphStyle('p',fontName='Body',fontSize=size,leading=lead,textColor=HexColor(col)))
    _,h=p.wrap(w,900);p.drawOn(c,x,y-h);return y-h
def bullet(s,x,y,w=324,size=10.4):
    text('•',x,y-10,size,'Body',teal);return para(s,x+11,y,w-11,size,lead=13.6)-6
def heading(s,x,y,w):
    text(s,x,y,13,'Display',gold);line(x,y-7,x+w,y-7,'#655D4D',.5);return y-20

rect(0,0,W,H,bg);rect(23,30,166,H-60,'#11141D')
# Engraved geometric frame with stepped corners.
for d in [17,22]:
    line(d,48,d,H-48);line(W-d,48,W-d,H-48)
    line(48,d,W-48,d);line(48,H-d,W-48,H-d)
    for x,sx in [(d,1),(W-d,-1)]:
        for y,sy in [(d,1),(H-d,-1)]:
            line(x,y+30*sy,x+12*sx,y+30*sy);line(x+12*sx,y+30*sy,x+12*sx,y+12*sy);line(x+12*sx,y+12*sy,x+30*sx,y+12*sy);line(x+30*sx,y+12*sy,x+30*sx,y)
# Directly display the supplied poster's gear region using a PDF clipping box.
# No new illustration, retouching, or generated icon.
ref=out/'assets/arcane_council_reference.jpg'
iw,ih=Image.open(ref).size
left,top,right,bottom=70,115,680,710
ix,iy,boxw,boxh=435,H-137,120,100
scale=max(boxw/(right-left),boxh/(bottom-top))
c.saveState()
clip=c.beginPath();clip.rect(ix,iy,boxw,boxh);c.clipPath(clip,stroke=0)
c.drawImage(str(ref),ix-left*scale,iy-(ih-bottom)*scale,width=iw*scale,height=ih*scale)
c.restoreState()
text('CHAI YI CHEN',38,H-79,31,'Display',white)
text('GAME MARKETING  /  PLAYER INSIGHTS',40,H-103,10,'Body',teal)
text('Candidate · 2027 Sea Global MAP, Garena',40,H-125,10,'Body',gold)
line(37,H-146,558,H-146)

y=H-174
y=heading('PROFILE',209,y,346)
y=para('Game marketing intern with hands-on experience in community content, audience testing and creator partnerships. Turns player observations and AI-assisted ideas into published work; seeking broader exposure to game operations and product decisions.',209,y,346)-18
y=heading('GAME MARKETING EXPERIENCE',209,y,346)
text('Gamesofa',209,y,12,'Bold');y-=16
text('Game Marketing Intern  |  Mar 2026 - Present',209,y,9.5,'Body',gray);y-=10
for s in [
'Planned and published Facebook, Instagram and Threads content for Cat Cafe and Shen Lai Ye Dark Chess. Cat Cafe Instagram followers grew from 18K to 30K (+67%) during my tenure.',
'Entrusted with a NT$10,000 budget to test new Dark Chess audiences. Evaluated Meta ad metrics with AI-assisted analysis and stopped delivery when performance fell short.',
'Secured 3 KOC partnerships; handled collaboration terms and script outlines.',
'Produced 24 cross-format assets using Canva, GPT and Gemini; wrote 26 scripts that were filmed and published.'
]:y=bullet(s,209,y,346)
y-=2
line(209,y,555,y,'#655D4D')
y-=13;text('SELECTED RESULT',209,y,8.5,'Bold',teal);y-=7
y=para('Cat Cafe 30K-follower campaign: supported planning, publishing and community replies. The second post recorded <b>1,476 comments</b> and <b>383 shares</b>.',209,y,346,10,lead=13)-21
y=heading('ADDITIONAL EXPERIENCE',209,y,346)
for title,date,bullets in [
('National Taipei University | Research Assistant','Sep 2024 - Jan 2026 · Part-time',['Organized course materials and digital content; supported documentation and coordination in an English-speaking work environment.']),
('ACT Genomics | HR Intern','Jul 2024 - Sep 2024',['Digitized and verified 200 personnel records in 3 weeks.','Conducted 20 exit interviews and prepared an analysis report.']),
('Eelin Entertainment | Professional Model','Jul 2022 - Dec 2024',['Interpreted brand concepts through on-camera visual presentation.'])]:
    text(title,209,y,10.3,'Bold');y-=15;text(date,209,y,9,'Body',gray);y-=12
    for b in bullets:y=bullet(b,209,y,346,10)
    y-=10

sy=H-174
sy=heading('CAPABILITIES',38,sy,132)
for s in ['Community content','Player communication','Meta ad analysis','Creator partnerships','Script development']:
    sy=bullet(s,38,sy,134,10.5)
sy-=17;sy=heading('TOOLS',38,sy,132)
sy=para('Canva<br/>GPT · Gemini · Claude<br/>Meta Ads Manager',38,sy,132,10.5,lead=18)-27
sy=heading('BUILD PROJECTS',38,sy,132)
sy=bullet('Interactive portfolio website',38,sy,134,10.5)
sy=bullet('Livestream workstation',38,sy,134,10.5)
sy-=10
sy=para('AI-assisted content and script production',38,sy,132,10.3,gray,15)-32
sy=heading('PLAYER EXPERIENCE',38,sy,132)
sy=para('League of Legends:<br/>Wild Rift',38,sy,132,10.5,lead=16)-7
text('GRANDMASTER',38,sy-11,13,'Display',gold)
sy-=30
for game in ['Arena of Valor','Identity V','Rainbow Six Siege']:
    sy=bullet(game,38,sy,134,10.5)
assert sy>128, ('Player section overlaps portfolio',sy)
text('PORTFOLIO',38,106,10,'Display',gold)
text('chai-web.pages.dev',38,85,10.5,'Body',white)
c.linkURL('https://chai-web.pages.dev/',(36,78,176,99),relative=0,thickness=0)
line(38,68,169,68,'#655D4D')
assert y>40, y
c.showPage();c.save()
r=PdfReader(path);assert len(r.pages)==1
t=r.pages[0].extract_text()
for token in ['Claude','Livestream workstation','200','20 exit interviews','GRANDMASTER','Arena of Valor','Identity V','Rainbow Six Siege']:assert token in t,token
assert 'final judgment' not in t
doc=pdfium.PdfDocument(str(path));doc[0].render(scale=1.8).to_pil().save(out/'resume_en_preview.png')
print('Verified one page; content bottom:',y)



