"""from fastapi import FastAPI"""
from pydantic import BaseModel
import pickle
from sklearn.metrics.pairwise import cosine_similarity

"""app = FastAPI()"""

# CARGAS lo que creaste en el notebook
cv = pickle.load(open('ml/vectorizer.pkl', 'rb'))
user_vectors = pickle.load(open("ml/user_vectors.pkl", "rb"))
users_df = pickle.load(open("ml/users_df.pkl", "rb"))

nuevo_user_json = {
    "intdo": "fiesta playa musica amigos viajar"
}


"""
class UserInput(BaseModel):
    intdo: str   # viene del JSON

@app.post("/recommend")
def recommend(user: UserInput):
# 1. Vectorizar nuevo usuario
new_vector = cv.transform([user.intdo])"""

new_vector = cv.transform([nuevo_user_json["intdo"]])

    # 2. Similaridad nuevo vs existentes
sims = cosine_similarity(new_vector, user_vectors)[0]

distance = sorted(list(enumerate(sims)), reverse=True, key=lambda vector:vector[1])
for i in distance[0:5]:
    print(users_df.iloc[i[0]]['name'])

"""    # 3. Mejor match
idx = sims.argmax()

print("match:", users_df.iloc[idx]["name"])
print("score:", sims[idx])

return {
    "match": users_df.iloc[idx]["name"],
    "score": float(sims[idx])
}
"""