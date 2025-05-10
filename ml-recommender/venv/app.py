from flask import Flask, request, jsonify
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
import json

app = Flask(__name__)

#LoadcourseData
with open("courses.json") as f:
    data = json.load(f)

df = pd.DataFrame(data)
df["combined"] = df["title"] + " " + df["description"] + " " + df["tags"].apply(lambda x: " ".join(x))

#Vectorize text
tfidf = TfidfVectorizer(stop_words="english")
tfidf_matrix = tfidf.fit_transform(df["combined"])
cosine_sim = cosine_similarity(tfidf_matrix)

#Get recommendations
def get_recommendations(course_id, top_n=5):
    idx = df.index[df["_id"] == course_id].tolist()
    if not idx:
        return []
    sim_scores = list(enumerate(cosine_sim[idx[0]]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)[1 : top_n + 1]
    recommended = [df.iloc[i[0]].to_dict() for i in sim_scores]
    return recommended

@app.route("/recommend", methods=["POST"])
def recommend():
    data = request.json
    course_id = data.get("course_id")
    results = get_recommendations(course_id)
    return jsonify(results)

if __name__ == "__main__":
    app.run(port=5001)
