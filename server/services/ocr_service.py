import io

import fitz
import pytesseract
from PIL import Image

MIN_TEXT_LENGTH = 20
OCR_DPI = 300


class PageText:
    def __init__(self, page_number: int, text: str, used_ocr: bool):
        self.page_number = page_number
        self.text = text
        self.used_ocr = used_ocr


def extract_pages(content: bytes) -> list[PageText]:
    pdf = fitz.open(stream=content, filetype="pdf")
    pages: list[PageText] = []

    try:
        for index in range(pdf.page_count):
            page = pdf[index]
            text = page.get_text().strip()

            if len(text) >= MIN_TEXT_LENGTH:
                pages.append(PageText(page_number=index + 1, text=text, used_ocr=False))
                continue

            pixmap = page.get_pixmap(dpi=OCR_DPI)
            image = Image.open(io.BytesIO(pixmap.tobytes("png")))
            ocr_text = pytesseract.image_to_string(image).strip()
            pages.append(PageText(page_number=index + 1, text=ocr_text, used_ocr=True))

    finally:
        pdf.close()

    return pages