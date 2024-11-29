from flask import Flask, request, render_template_string, send_file
import google.generativeai as genai
import markdown


app = Flask(__name__)


gemini_api_key = "Enter API Key"  
genai.configure(api_key=gemini_api_key)
model = genai.GenerativeModel("models/gemini-1.5-flash")


@app.route('/', methods=['GET', 'POST'])
def disease_input():
    user_disease = ""
    ai_response = ""
    ai_response_html = ""
    
    if request.method == 'POST':
       
        user_disease = request.form['disease'].strip()
        
        if user_disease:
            try:
             
                prompt = (f"Provide the immediate cures and home remedies, yoga, and classify them as Ayurveda and Allopathy, "
                          f"for the following medical problem in bullet points. Include sources if possible: {user_disease}.")
                response = model.generate_content(prompt)
                ai_response = response.candidates[0].content.parts[0].text
                
          
                ai_response_html = markdown.markdown(ai_response)

            except Exception as e:
                ai_response = f"An error occurred: {e}"
                ai_response_html = markdown.markdown(ai_response)
        else:
            ai_response = "Please provide a valid disease name."
            ai_response_html = markdown.markdown(ai_response)

    # HTML template for rendering
    return render_template_string("""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Disease Information</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 20px;
                    padding: 0;
                    max-width: 600px;
                    line-height: 1.6;
                }
                form {
                    margin-bottom: 20px;
                }
                textarea, input {
                    width: 100%;
                    padding: 10px;
                    font-size: 16px;
                    margin-bottom: 10px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                }
                button {
                    background-color: #28a745;
                    color: white;
                    padding: 10px 20px;
                    font-size: 16px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    display: inline-block;
                }
                button:hover {
                    background-color: #218838;
                }
                .response {
                    margin-top: 20px;
                    padding: 10px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    background-color: #f9f9f9;
                }
                .error {
                    color: red;
                }
            </style>
        </head>
        <body>
            <h1>Disease Information</h1>
            <p>Enter the name of the disease below to get detailed information:</p>
            <form method="post">
                <input type="text" name="disease" placeholder="Enter disease name..." value="{{ user_disease }}">
                <button type="submit">Submit</button>
            </form>

            {% if ai_response_html %}
                <div class="response">
                    <h2>Recommendations for Immediate Relief</h2>
                    <div>{{ ai_response_html|safe }}</div> <!-- Safely render HTML -->
                </div>
            {% endif %}
            
            <!-- Buttons for navigation -->
            <button id="doctor-portal">I am a doctor!</button>
            <button id="patient-portal">Doctor's consult</button>
             
            <script>
                document.getElementById("doctor-portal").addEventListener("click", function () {
                    window.location.href = "/doctor";
                });
                document.getElementById("patient-portal").addEventListener("click", function () {
                    window.location.href = "/patient";
                });
            </script>
        </body>
        </html>
    """, user_disease=user_disease, ai_response_html=ai_response_html)

# Route to serve doctor.html
@app.route('/doctor')
def serve_doctor():
    return send_file("doctor.html")  # Ensure doctor.html is in the same directory as this script


@app.route('/patient')
def serve_patient():
    return send_file("patient.html") 

if __name__ == '__main__':
    app.run(debug=True)
