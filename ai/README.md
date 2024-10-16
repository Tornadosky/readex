# PDF to Quiz

## Usage

Upload a multiple page PDF and generate a quiz with multiple options. For each page N questions will be generated.

This leverage Langchain library to abstract the LLM (Large Language Model) calls.

The UI is based on Streamlit and integrated with React as an API.

## Pre-requisite

You need an OpenAI API key from https://platform.openai.com/account/api-keys

Keep in mind this is not free BUT the with the usage of **gpt-3.5-turbo** it's not expensive at all unless you drop really big PDF (more than 100 pages).

Once you have your API key you can install it in your terminal like this:

``` sh
export OPENAI_API_KEY=[Your-API-key]
```

Or use the `.env` file to save the key:

``` sh
export OPENAI_API_KEY=[Your-API-key]
```

## Instructions


To install:

``` sh
pip install -r requirements.txt
```

## Run

To run the API:
```sh
python api.py
```

To run the streamlit app:
```sh
streamlit run ui.py
```

To run on docker
```sh
docker build -t pdf-to-quizz .
docker run -e OPENAI_API_KEY=[your-api-key] -p 8501:8501 pdf-to-quizz
```
