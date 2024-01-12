from bs4 import BeautifulSoup
from flask import Flask, render_template, jsonify, request, redirect
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func
from collections import Counter

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///ficlist.db'
db = SQLAlchemy(app)

class Fic(db.Model):
    index = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    author = db.Column(db.String(200), nullable=True)
    link = db.Column(db.String(200), nullable=True)
    date = db.Column(db.String(200), nullable=True)
    fandom = db.Column(db.String(200), nullable=True)
    rating = db.Column(db.String(200), nullable=True)
    warning = db.Column(db.String(200), nullable=True)
    tags = db.Column(db.list(200), nullable=True)
    words = db.Column(db.Integer, nullable=True)
    chapter = db.Column(db.Integer, nullable=True)
    link = db.Column(db.String(200), nullable=True)


    def __repr__(self):
        return '<Fic %r>' % self.id
    
#you would insert your start page here
page = "https://archiveofourown.org/users/test/bookmarks"


soup = BeautifulSoup(page, 'lxml')
links = []
for link in soup.find_all('li', {'class':'pagination activities'}):
    if (not (link.has_attr('class'))):
        links.append(link.find("a").get('href'))
    

def scrape(page_content):
    soup = BeautifulSoup(page_content, 'lxml')
    tags = []
    for fic in soup.find_all('li', {'role':'article'}):
        
        ti = fic.find('h4', {'class':'heading'}).find('a').string
        try:
            a = fic.find('a', {'rel':'author'}).string
        except:
            a = 'Anonymous'

        l = fic.find('h4', {'class':'heading'}).find('a').get('href')

        day = fic.find('p', {'class':'datetime'}).string

        f= fic.find("h5", {"class": "fandoms heading"}).find("a").string

        ratwar = fic.find("ul", {"class": "required-tags"}).find_all("li")
        r = ratwar[0].fic.find("span", {"class": "text"}).string
        w = ratwar[1].fic.find("span", {"class": "text"}).string


        ta= fic.find("ul", {"class": "tags commas"})
        tags.extend(ta)

        w = fic.find('dd', {'class':'words'}).string

        if len(w) <= 0:
            w = 0
            
        c = fic.find('dd', {'class':'chapters'}).text.split('/')[0]

        processedfic = Fic(title=ti, author=a, link=l, date=day, fandom=f, rating=r, warning=w, tags=ta, words=w, chapter=c)
        db.session.add(processedfic)
        db.session.commit()
    return tags

tags = scrape(links[0])
links.pop(0)
if (len(links) > 0) :
    for link in links:
        tags = tags.extend(scrape(link))

    
@app.route('/api/get_data', methods=['GET'])
def get_data():
    data = db.query.all()
    jsoned = [{'title': fic.title, 'author':fic.author, 'link':fic.link, 'date':fic.date, 
               'fandom':fic.fandom, 'rating':fic.rating, 'warning':fic.warning, 'tags':fic.tags, 'words':fic.words, 'chapters': fic.chapters} for fic in data]
    return jsonify(jsoned)

@app.route('/api/get_taglist', methods=['GET'])
def get_taglist():
    return jsonify(tags)
    
@app.route('/add', methods=['POST', 'GET'])
def index():
    if request.method == 'POST':
        fictitle = request.form['title']
        fictags = request.form['tags']
        new_fic = Fic(title=fictitle, tags=fictags)
        try:
            db.session.add(new_fic)
            db.session.commit()
            return redirect('/')
        except:
            return 'Error'

    else:
        fics = Fic.query.order_by(Fic.title).all()
        return render_template('index.html', fics=fics)

@app.route('/api/get_chartdata', methods=['GET'])
def get_pie_chart_data():
    fresult = db.session.query(db.fandom, func.count(db.fandom)).group_by(db.fandom).all()
    rresult = db.session.query(db.ratings, func.count(db.ratings)).group_by(db.ratings).all()
    taglabels = list(set(tags))
    tagdata = [tags.count(tag) for tag in taglabels]


    fandomlabels = [row[0] for row in fresult]
    fandomdata = [row[1] for row in fresult]
    ratinglabels = [row[0] for row in rresult]
    ratingdata = [row[1] for row in rresult]

    return jsonify({
        'flabels': fandomlabels,
        'fdata': fandomdata,
        'rlabels': ratinglabels,
        'rdata': ratingdata,
        'tlabels': taglabels,
        'tdata': tagdata
    })

@app.route('/delete/<int:id>')
def delete(id):
    deletefic = Fic.query.get_or_404(id)
    try:
        db.session.delete(deletefic)
        db.session.commit()
        return redirect('/')
    except:
        return 'Error'

if __name__ == "__main__":
    app.run(debug=True)