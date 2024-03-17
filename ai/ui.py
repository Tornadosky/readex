import streamlit as st
from pdf_to_quizz import pdf_to_quizz
from text_to_quizz import txt_to_quizz
import json
from dotenv import load_dotenv
from random import randint
from langchain.callbacks import get_openai_callback

load_dotenv()

import asyncio

st.title("PDF to Quiz")

def build_question(count, json_question):

    if json_question.get(f"question") is not None:
        st.write("Question: ", json_question.get(f"question", ""))
        choices = ['A', 'B', 'C', 'D']
        selected_answer = st.selectbox(f"Select your answer:", choices, key=f"select_{count}")
        for choice in choices:
            choice_str = json_question.get(f"{choice}", "None")
            st.write(f"{choice} {choice_str}")
                    
        color = ""
        if st.button("Submit", key=f"button_{count}"):
            rep = json_question.get(f"reponse")
            if selected_answer == rep:
                color = ":green"
                st.write(f":green[Right answer: {rep}]")
                
            else:
                color = ":red"
                st.write(f":red[Wrong answer. The correct answer is {rep}].")                

        st.write(f"{color}[Your answer: {selected_answer}]")

        count += 1

    return count

# Upload PDF file
uploaded_file = st.file_uploader(":female-student:", type=["pdf"])
txt = st.text_area('Type the text from which you want to generate the quiz')

if st.button("Generate Quiz", key=f"button_generer"):
    if txt is not None:
        with st.spinner("Generating Quiz..."):
            st.session_state['questions'] = asyncio.run(txt_to_quizz(txt))
            st.write("Quiz generation success!")

    if uploaded_file is not None:    
        old_file_name = st.session_state.get('uploaded_file_name', None)
        if (old_file_name != uploaded_file.name):
            # Convert PDF to text
            with st.spinner("Generating Quiz..."):

                with open(f"data/{uploaded_file.name}", "wb") as f:
                    f.write(uploaded_file.getvalue())        

                # Initialize session state
                st.session_state['uploaded_file_name'] = uploaded_file.name
                with get_openai_callback() as cb:
                    st.session_state['questions'] = asyncio.run(pdf_to_quizz(f"data/{uploaded_file.name}"))
                    print(cb)

                st.write("Quiz generation success!")

if 'questions' in st.session_state:
    # Display questions
    st.write("Quiz:")
    count = 0
    for json_question in st.session_state['questions']:
        count = build_question(count, json_question) 