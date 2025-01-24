import openai
import os

openai.api_key = os.getenv("OPENAI_API_KEY")

def summarize_article(content):
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "Summarize the following article in three bullet points, each less than 20 words."},
            {"role": "user", "content": content}
        ]
    )
    
    summary = response.choices[0].message['content'].split('\n')
    return [point.strip('- ') for point in summary if point.strip()]

if __name__ == '__main__':
    test_content = "Your test article content here..."
    print(summarize_article(test_content))
