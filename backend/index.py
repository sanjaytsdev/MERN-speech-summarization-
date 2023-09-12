from summarizer import summarize
import sys

def text_summarizer(title,text):
    summary = summarize(title,text)
    return summary

# Example usage
title = "gfgfgh"
text = sys.argv[1]

summary = text_summarizer(title,text)
concatenated_text = ' '.join(summary)
print(concatenated_text)

