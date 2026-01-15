from fastapi import FastAPI
from pydantic import BaseModel
import mysql.connector
import pandas as pd
import json
import pickle


from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = FastAPI()

cv = pickle.load(open('ml/vectorizer.pkl', 'rb'))
user_vectors = pickle.load(open("ml/user_vectors.pkl", "rb"))
users_df = pickle.load(open("ml/users_df.pkl", "rb"))

# -------------------------
# 1. Cargar datos desde SQL
# -------------------------
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="Asd123??",
    database="lovesync"
)

query = """
SELECT
  u.id,
  u.nombre,
  u.mail,
  u.fechaNacimiento,
  p.edad,
  p.bio,
  p.intereses
FROM usuarios u
JOIN perfil p ON u.id = p.user_id
"""

df = pd.read_sql(query, conn)
conn.close()

# -------------------------
# 2. Construir intdo
# -------------------------
def build_intdo(row):
    bio = row["bio"] if row["bio"] else ""
    intereses = ""

    if row["intereses"]:
        intereses_list = json.loads(row["intereses"])
        intereses = " ".join(intereses_list)

    return f"{intereses} {bio}"

df["intdo"] = df.apply(build_intdo, axis=1)
users_ml = df[["id", "nombre", "mail", "fechaNacimiento", "edad", "intdo"]]

# -------------------------
# 3. Vectorizar (UNA VEZ)
# -------------------------
stop_words_es = ['el', 'la', 'los', 'las', 'de', 'y', 'a', 'en']

cv = CountVectorizer(
    max_features=100,
    stop_words=stop_words_es
)

user_vectors = cv.fit_transform(users_ml["intdo"].values.astype("U"))

# -------------------------
# 4. Esquema JSON de entrada
# -------------------------
class UserInput(BaseModel):
    bio: str
    intereses: list[str]

# -------------------------
# 5. Endpoint de recomendación
# -------------------------
@app.post("/recommend")
def recommend(user: UserInput):
    nuevo_intdo = " ".join(user.intereses) + " " + user.bio
    new_vector = cv.transform([nuevo_intdo])

    sims = cosine_similarity(new_vector, user_vectors)[0]
    
    # Crear lista de matches con sus puntuaciones, filtrando score > 0
    matches = []
    for idx, score in enumerate(sims):
        if score > 0:
            matches.append({
                "match_id": int(users_ml.iloc[idx]["id"]),
                "match_nombre": users_ml.iloc[idx]["nombre"],
                "match_email": users_ml.iloc[idx]["mail"],
                "match_fechaNacimiento": str(users_ml.iloc[idx]["fechaNacimiento"]),
                "match_edad": int(users_ml.iloc[idx]["edad"]),
                "score": float(score)
            })
    
    # Ordenar por score descendente
    matches = sorted(matches, key=lambda x: x["score"], reverse=True)
    
    return {
        "total_matches": len(matches),
        "matches": matches
    }
