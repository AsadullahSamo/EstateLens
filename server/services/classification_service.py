import json

from groq import Groq

from config.settings import settings
from models.document import DocumentType

_client = Groq(api_key=settings.groq_api_key)

ALLOWED_TYPES = [t.value for t in DocumentType]

SYSTEM_PROMPT = (
    "You classify real estate due diligence documents. "
    f'Respond with only JSON in the form {{"document_type": "<type>"}}, '
    f"where <type> is exactly one of: {', '.join(ALLOWED_TYPES)}. "
    "No preamble, no markdown, only the JSON object."
)

def classify_document(text: str) -> DocumentType:
    excerpt = text[:4000]

    response = _client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": excerpt},
        ],
        temperature=0
    )

    raw = response.choices[0].message.content.strip()

    try:
        parsed = json.loads(raw)
        return DocumentType(parsed["document_type"])
    except (json.JSONDecodeError, KeyError, ValueError):
        return DocumentType.OTHER

