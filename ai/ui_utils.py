import streamlit as st
    
def transform(input_list):
    new_list = []
    for item in input_list:
        for key in item:
            if 'question1' in key or 'question2' in key or 'question3' in key:
                question_dict = {}
                question_num = key[-1]                
                question_dict[f'question'] = item[key]
                question_dict[f'A'] = item[f'A_{question_num}']
                question_dict[f'B'] = item[f'B_{question_num}']
                question_dict[f'C'] = item[f'C_{question_num}']
                question_dict[f'D'] = item[f'D_{question_num}']
                question_dict[f'reponse'] = item[f'reponse{question_num}']
                new_list.append(question_dict)
    return new_list      