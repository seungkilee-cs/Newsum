from openai import OpenAI
import os

client = OpenAI(api_key=os.getenv('TEST_OPENAI_API_KEY'))

def generate_summary(article_content, max_tokens=150, test=True):
    if test:
        return ['Test Summary 1', 'Test Summary 2', 'Test Summary 3']
    else:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "Summarize the following article in 3 brief bullet points, each bullet point less than 20 words:"},
                {"role": "user", "content": article_content}
            ],
            max_tokens=max_tokens
        )

        print(response.choices[0].message.content.strip().split('\n'))
        return response.choices[0].message.content.strip().split('\n')



    