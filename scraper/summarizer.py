import openai
import os

openai.api_key = os.getenv('OPENAI_API_KEY')

def generate_summary(article_content, max_tokens=150):
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "Summarize the following article in 3 brief bullet points, each bullet points less than 20 words each:"},
            {"role": "user", "content": article_content}
        ],
        max_tokens=max_tokens
    )
    return response.choices[0].message['content'].strip()
