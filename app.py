from flask import *
from datetime import datetime
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import random


uri = "mongodb+srv://frandy:k25i04r682a@mycluster.awoytoc.mongodb.net/?retryWrites=true&w=majority&appName=MyCluster"
# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))
# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("You successfully connected to MongoDB!")
except Exception as e:
    print(e)

db = client.member_system
collection = db.users
user_profile = {}

app = Flask(
    __name__,
    static_folder='static/img',
    template_folder='templates',
    static_url_path='/img'
)
app.secret_key = "k25i04r682a"

@app.route("/")
def index():
    return render_template("home.html")

@app.route("/home")
def home():
    return render_template("home.html")


@app.route("/about")
def about():
    return render_template("about.html")

@app.route("/shop")
def shop():
    return render_template("shop.html")

@app.route("/cart")
def cart():
    return render_template("cart.html")

@app.route("/contact")
def contact():
    return render_template("contact.html")

@app.route("/product")
def product():
    return render_template("product.html")

@app.route("/login", methods=["POST"])
def login():
    try:
        current_time = datetime.now()
        email = request.form.get("email")
        password = request.form.get("password")
        print(f"User Login : {email}/{password} \nTime : {current_time}")
        result = collection.find_one({
            "$and":[
                {"email":email},
                {"password":password}
            ]
        })
        print(f"Member successful login !\nMember information: {result}")
        if result == None:
            return jsonify({"error": "Incorrect email or password"}), 401
        session["email"] = email
        return redirect(url_for('home')), 200
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500  

@app.route("/register", methods=["POST"])
def register():
    try:
        username = request.form.get("name")
        email = request.form.get("email")
        phone = request.form.get("phone")
        password = request.form.get("password")
        random_number = random.randint(1, 1000000)
        id = f"{username}{username}{random_number}"

        exsits_or_not =  collection.find_one({
            "$or": [
                {"email": f"{email}"},
                {"phone": f"{phone}"}
            ]
        })
        if exsits_or_not != None:
            print(f"Email or phone number already exists.")  
            return jsonify({"error": "Email or phone number already exists"}), 409
        else:
            result = collection.insert_one({
                "id" : f"{id}",
                "name" : f"{username}",
                "email" : f"{email}",
                "phone" : f"{phone}",
                "password" : f"{password}",
                "registered_at" : datetime.now()
            })
            print(f"Member successful registration! \nMember ID: {result.inserted_id}")
            session["email"] = email
            return redirect(url_for('home')), 200

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@app.route("/logout", methods=["POST"])
def logout():
        try:
            # 清除 session 中的用户信息
            del session["email"]
            # 返回成功响应
            return redirect(url_for('home'))
        except Exception as e:
            print(f"Logout error: {str(e)}")
            return jsonify({"error": "Internal server error"}), 500

@app.route('/get_login_status', methods=['GET'])
def get_login_status():
    try:
        if 'email' in session:
            return jsonify({"status": "success", "email": session["email"]}), 200
        else:
            return jsonify({"status": "fail", "name": None}), 401
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@app.route("/profile")
def profile():
    user_data = collection.find_one({
        "email": session["email"]
    })
    if user_profile != None:
        user_profile["name"] = user_data.get("name")
        user_profile["email"] = user_data.get("email")
        user_profile["phone"] = user_data.get("phone")
        user_profile["password"] = user_data.get("password")
        user_profile["registered_at"] = user_data.get("registered_at")
        print(user_profile)
    else:
        print("User profile not found.")
        return redirect(url_for('home')), 404
    return render_template("profile.html", name = user_profile["name"], email = user_profile["email"], phone = user_profile["phone"], password = user_profile["password"], create_time = user_profile["registered_at"])

app.run(port=2000)