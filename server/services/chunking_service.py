import nltk

try:
    nltk.data.find("tokenizers/punkt_tab")
except LookupError:
    nltk.download("punkt_tab", quiet=True)

from nltk.tokenize import sent_tokenize

from services.ocr_service import PageText

WINDOW_SIZE = 5
OVERLAP = 1


class Chunk:
    def __init__(self, text: str, page_number: int, chunk_index: int):
        self.text = text
        self.page_number = page_number
        self.chunk_index = chunk_index


def chunk_pages(pages: list[PageText]) -> list[Chunk]:
    chunks: list[Chunk] = []
    chunk_index = 0
    step = WINDOW_SIZE - OVERLAP

    for page in pages:
        sentences = sent_tokenize(page.text)
        if not sentences:
            continue

        for start in range(0, len(sentences), step):
            window = sentences[start : start + WINDOW_SIZE]

            chunks.append(
                Chunk(text=" ".join(window), page_number=page.page_number, chunk_index=chunk_index)
            )
            chunk_index += 1

            if start + WINDOW_SIZE >= len(sentences):
                break

    return chunks