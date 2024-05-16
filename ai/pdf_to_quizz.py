import asyncio
import logging
from langchain.document_loaders import PyPDFLoader
from generate_questions import generate_and_parse_questions
import matplotlib.pyplot as plt
import matplotlib.patches as patches
import pdfplumber
import fitz
import re
from quizz_generator import generate_quizz
from ui_utils import transform

from gql import gql, Client
from gql.transport.aiohttp import AIOHTTPTransport

logger = logging.getLogger(__name__)
logging.getLogger('gql.transport.aiohttp').setLevel(logging.WARNING)

# Define the GraphQL query to fetch highlights
FETCH_HIGHLIGHTS_QUERY = gql("""
    query GetHighlights($bookId: Int!) {
        Books(id: $bookId) {
            id
            title
            highlights {
                id
                text
                boundingRect {
                    x1
                    y1
                    x2
                    y2
                    pagenum
                    scaleFactor
                }
            }
        }
    }
""")

async def pdf_to_quizz(pdf_file_name):
    logger.info(f"Hi from pdf_to_quizz! Processing file: {pdf_file_name}")
    try:
        loader = PyPDFLoader(pdf_file_name)
        pages = loader.load_and_split()
    except Exception as e:
        logger.error(f"Error loading PDF: {e}")
        return []

    logger.info(f"Number of pages in the PDF: {len(pages)}")
    sem = asyncio.Semaphore(10)  # Set the maximum number of parallel tasks
    async def process_page(page):
        async with sem:
            return await generate_and_parse_questions(page.page_content, question_number=2, difficulty="hard")

    async def safe_process_page(page):
        try:
            return await process_page(page)
        except Exception as e:
            logger.error(f"Exception in processing page: {e}")
            return None

    tasks = [safe_process_page(page) for page in pages]
    questions = await asyncio.gather(*tasks, return_exceptions=True)

    all_questions = []
    for question_list in questions:
        if question_list:
            all_questions.extend(question_list)

    logger.info(f"Questions generated: {all_questions}")
    return all_questions
  
async def generate_quiz_from_highlights(book_ids: list, pdf_files: dict, num_questions: int):
    logger.info(f"Starting quiz generation from highlights for books: {book_ids}")
    
    # Fetch highlights from backend
    books = await fetch_highlights_from_backend(book_ids)

    # Process highlights to extract text
    tasks = [process_highlights(pdf_files[book_id], books[book_id][0]['highlights']) for book_id in book_ids]
    extracted_texts = await asyncio.gather(*tasks)

    # Flatten list of texts and generate questions
    all_texts = [text for sublist in extracted_texts for text in sublist]
    logger.info(f"Extracted texts: {all_texts}")
    if not all_texts:
        logger.error("No text extracted from highlights")
        return []
    quiz_questions = await generate_and_parse_questions(" ".join(all_texts), num_questions, difficulty="medium")
    
    logger.info(f"Quiz generated with {len(quiz_questions)} questions")
    return quiz_questions

async def fetch_highlights_from_backend(book_ids):
    transport = AIOHTTPTransport(url="http://localhost:3000/graphql")
    client = Client(transport=transport, fetch_schema_from_transport=True)
    
    highlights = {}

    async with client as session:
        for book_id in book_ids:
            response = await session.execute(FETCH_HIGHLIGHTS_QUERY, variable_values={"bookId": book_id})
            #logger.info(f"Highlights for book {book_id}: {response}")
            highlights[book_id] = response["Books"]
    
    return highlights 

def clean_text(text):
    text = text.replace("\n", " ")
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

async def process_highlights(pdf_name, highlights):
    texts = []
    # Open the PDF file
    pdf = fitz.open(pdf_name)
    for highlight in highlights:
        if len(highlight['text'].split()) > 35:
            logger.info(f"Highlight text long enough, skipping: {highlight['text'][:30]}...")
            texts.append(clean_text(highlight['text']))
            continue
        else:
            logger.info(f"Highlight text too short, extracting text from bounding box: {highlight['boundingRect']}")
        page_num = highlight['boundingRect']['pagenum'] - 1  # Adjust for zero-based index
        page = pdf.load_page(page_num)
        
        scaleFactor = highlight['boundingRect'].get('scaleFactor', None)
        if not scaleFactor:
            logger.error("Scale factor is missing in highlight")
            continue
        
        # Extract the scaled bounding box coordinates
        x1, y1, x2, y2 = highlight['boundingRect']['x1'], highlight['boundingRect']['y1'], highlight['boundingRect']['x2'], highlight['boundingRect']['y2']
        bbox_scaled = (x1 / scaleFactor, y1 / scaleFactor, x2 / scaleFactor, y2 / scaleFactor)

        
        bbox_adjusted = adjust_bbox(page.rect.width, page.rect.height, bbox_scaled)
        logger.info(f"Processing highlight at page {page_num+1} with scaled bounding box: {bbox_adjusted}")
        rect = fitz.Rect(bbox_adjusted)
        # Extract text using the adjusted bbox
        text = page.get_textbox(rect)
        if text:
            texts.append(clean_text(text))
            logger.info(f"Extracted text: {text[:30]}...")  # Log the first 30 characters of the extracted text
        else:
            logger.info("No text extracted from the specified area.")

    pdf.close()
    return texts

def adjust_bbox(page_width, page_height, bbox):
    x1, y1, x2, y2 = bbox
    new_x1 = 0  # Expand width to full width of the page
    new_x2 = page_width
    height = y2 - y1
    new_y1 = max(y1 - height * 1.25, 0)  # Extend upwards by 25%, but not beyond the page
    new_y2 = min(y2 + height * 1.25, page_height)  # Extend downwards by 25%, but not beyond the page
    if new_y2 > page_height or new_y1 >= new_y2:
        raise Exception(f"ERROR: Adjusting bbox failed: y2 > page_height or y1 >= y2. Bbox: {bbox} Page dimensions: {page_width}x{page_height}")
    return (new_x1, new_y1-20, new_x2, new_y2+20)

def visualize_bounding_boxes(pdf_path, page_number, bbox):
    # Open the PDF and get the specified page
    with pdfplumber.open(pdf_path) as pdf:
        page = pdf.pages[page_number - 1]  # Convert to zero-based index
        image = page.to_image()

        # Original bounding box
        original_bbox = (bbox[0], bbox[1], bbox[2] - bbox[0], bbox[3] - bbox[1])
        
        # Adjust the bounding box
        adjusted_bbox = adjust_bbox(page.width, page.height, bbox)
        new_bbox = (adjusted_bbox[0], adjusted_bbox[1], adjusted_bbox[2] - adjusted_bbox[0], adjusted_bbox[3] - adjusted_bbox[1])

        # Setup matplotlib figure and axes
        fig, ax = plt.subplots(1)
        ax.imshow(image.original, aspect='equal')

        # Create a Rectangle patch for original bbox
        rect_original = patches.Rectangle((original_bbox[0], original_bbox[1]), original_bbox[2], original_bbox[3],
                                          linewidth=1, edgecolor='r', facecolor='none', label='Original')
        
        # Create a Rectangle patch for adjusted bbox
        rect_adjusted = patches.Rectangle((new_bbox[0], new_bbox[1]), new_bbox[2], new_bbox[3],
                                          linewidth=1, edgecolor='b', facecolor='none', label='Adjusted')

        # Add the patches to the Axes
        ax.add_patch(rect_original)
        ax.add_patch(rect_adjusted)
        ax.set_title('Bounding Box Adjustment Visualization')
        ax.legend(handles=[rect_original, rect_adjusted])

        plt.show()

import asyncio

async def main():
    pdf_files = {24: "../backend/uploads/1/Andrey_Kalenik_cv.pdf"}  # Map book ID to file path
    num_questions = 3
    book_ids = [24]  # List of book IDs to fetch highlights for

    quiz = await generate_quiz_from_highlights(book_ids, pdf_files, num_questions)
    #print(quiz)

if __name__ == "__main__":
    asyncio.run(main())

