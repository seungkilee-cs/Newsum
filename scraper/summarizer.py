import openai
import os

openai.api_key = os.getenv('TEST_OPENAI_API_KEY')

def generate_summary(article_content, max_tokens=150, test=True):
    if test:
        return ['Test Summary 1', 'Test Summary 2', 'Test Summary 3']
    else:
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "Summarize the following article in 3 brief bullet points, each bullet points less than 20 words each:"},
                {"role": "user", "content": article_content}
            ],
            max_tokens=max_tokens
        )
        return response.choices[0].message['content'].strip()