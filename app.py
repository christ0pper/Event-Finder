from flask import Flask, render_template, request, redirect, url_for, jsonify
from pymongo import MongoClient
from datetime import datetime

app = Flask(__name__)

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["events"]  # Connect to the "events" database
events_collection = db["parties"]  # Use the "parties" collection

@app.route("/", methods=["GET", "POST"])
def event_listings():
    # Get filters from query parameters
    distance = request.args.get("distance", type=int)
    place = request.args.get("place")
    search_query = request.args.get("search", "").strip()

    # Build the filter criteria
    filter_criteria = {}
    if search_query:
        filter_criteria["Name"] = {"$regex": search_query, "$options": "i"}
    if distance:
        filter_criteria["Distance"] = {"$lte": distance}
    if place:
        filter_criteria["Place"] = place

    try:
        # Find events based on the filter criteria
        events = list(events_collection.find(filter_criteria))
    except Exception as e:
        print(f"Error retrieving events: {e}")
        events = []

    return render_template("index.html", events=events)


@app.route("/host", methods=["GET", "POST"])
def host():
    if request.method == "POST":
        try:
            # Get event details from the form
            name = request.form["name"]
            date = request.form["date"]
            time = request.form["time"]
            place = request.form["place"]
            distance = int(request.form["distance"])
            category = request.form["category"]
            checkpoint = request.form["checkpoint"]

            # Convert the date and time into a datetime object
            event_datetime = datetime.strptime(f"{date} {time}", "%Y-%m-%d %H:%M")

            # Prepare the event object for MongoDB
            event = {
                "Name": name,
                "Date": event_datetime,
                "Place": place,
                "Distance": distance,
                "Category": category,
                "Checkpoint": checkpoint
            }

            # Insert the event into MongoDB
            events_collection.insert_one(event)

            # Redirect to confirmation page
            return redirect(url_for("confirmation2", event_name=name, category=category, place=place, distance=distance))

        except Exception as e:
            print(f"Error inserting event: {e}")
            return jsonify({"success": False, "error": str(e)}), 500

    return render_template("host.html")


@app.route("/FAQ")
def faq():
    return render_template("FAQ.html")


@app.route("/contact", methods=["GET", "POST"])
def contact():
    if request.method == "POST":
        # Redirect to confirmation page
        return redirect(url_for("confirmation"))
    return render_template("contact.html")


@app.route("/confirmation")
def confirmation():
    return render_template("confirmation.html")


@app.route('/confirmation2')
def confirmation2():
    return render_template('confirmation.html')


@app.route("/referrals")
def referral():
    return render_template('referrals.html')


if __name__ == "__main__":
    app.run(debug=True)
