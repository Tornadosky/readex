import os, re, json
from dotenv import load_dotenv

from langchain.schema import HumanMessage
from langchain.prompts import PromptTemplate, ChatPromptTemplate, HumanMessagePromptTemplate
from langchain.chat_models import ChatOpenAI
from langchain.output_parsers import StructuredOutputParser, ResponseSchema
from langchain.callbacks import get_openai_callback


load_dotenv()
def parse_json_like(text):
    # Regular expression pattern to match JSON objects
    object_pattern = r'\{.*?\}'
    # Regular expression pattern to capture key-value pairs
    pair_pattern = r'"(.*?)":\s*"(.*?)"'

    # Find all JSON-like objects in the text
    objects = re.findall(object_pattern, text, re.DOTALL)

    # List to store dictionaries
    dict_list = []

    # Iterate over each object
    for obj in objects:
        # Find all key-value pairs within the object
        pairs = re.findall(pair_pattern, obj)

        # Convert pair tuples into a dictionary
        d = {key: value for key, value in pairs}
        dict_list.append(d)

    return dict_list

text = """
Adoption of 3D printing has reached critical mass as those who have yet
to integrate additive manufacturing somewhere in their supply chain are
now part of an ever-shrinking minority. Where 3D printing was only suitable
for prototyping and one-off manufacturing in the early stages, it is now
rapidly transforming into a production technology.

Most of the current demand for 3D printing is industrial in nature.
Acumen Research and Consulting forecasts the global 3D printing market
to reach $41 billion by 2026.

As it evolves, 3D printing technology is destined to transform almost
every major industry and change the way we live, work, and play in the future.
"""

def generate_and_parse_questions(text, question_number=2, difficulty="hard"):
    response_schemas = [
        ResponseSchema(name="question", description="A multiple choice question generated from input text snippet."),
        ResponseSchema(name="option_1", description="First option for the multiple choice question. Use this format: 'a) option'"),
        ResponseSchema(name="option_2", description="Second option for the multiple choice question. Use this format: 'b) option'"),
        ResponseSchema(name="option_3", description="Third option for the multiple choice question. Use this format: 'c) option'"),
        ResponseSchema(name="option_4", description="Fourth option for the multiple choice question. Use this format: 'd) option'"),
        ResponseSchema(name="answer", description="Correct answer for the question. Use this format: 'd) option' or 'b) option', etc.")
    ]
    output_parser = StructuredOutputParser.from_response_schemas(response_schemas)
    format_instructions = output_parser.get_format_instructions()

    chat_model = ChatOpenAI(temperature=0, model_name = 'gpt-3.5-turbo')
    #chat_model = ChatOpenAI(temperature=0.3, model_name = 'gpt-4')

    
    template = """
        You are a teacher preparing questions for a quiz. Given the following document, please generate {question_number} multiple-choice questions (MCQs) of {difficulty} difficulty with 4 options and a corresponding answer letter based on the document.
        These questions should be detailed and solely based on the information provided in the document.
        \n{format_instructions}\n{user_prompt}.
    """

    prompt = ChatPromptTemplate(
        messages=[HumanMessagePromptTemplate.from_template(template)],
        input_variables=["user_prompt", "question_number", "difficulty"],
        partial_variables={"format_instructions": format_instructions}
    )

    user_query = prompt.format_prompt(user_prompt = text, question_number = 2, difficulty = "hard")
    with get_openai_callback() as cb:
        user_query_output = chat_model(user_query.to_messages())
        print(cb)

    parsed_questions = parse_json_like(user_query_output.content)
    return parsed_questions

print(generate_and_parse_questions(text))

