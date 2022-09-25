import csv
import pandas as pd
import numpy as np
import string
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.model_selection import train_test_split

spam_or_ham = pd.read_csv("data.csv", sep='|', encoding='latin-1')[["v1", "v2"]]
spam_or_ham.columns = ["label", "text"]
punctuation = set(string.punctuation)
print punctuation

##Eliminamos los simbolos de puntuacion 
def tokenize(sentence):
    tokens = []
    for token in sentence.split():
        new_token = []
        for character in token:
            if character not in punctuation:
                new_token.append(character.lower())
        if new_token:
            tokens.append("".join(new_token))
    return tokens

spam_or_ham.head()["text"].apply(tokenize)
train_text, test_text, train_labels, test_labels = train_test_split(spam_or_ham["text"], 
                                                                    spam_or_ham["label"],
                                                                    stratify=spam_or_ham["label"])

print train_text
print "=========================================="
print train_text.astype('U')

real_vectorizer = CountVectorizer(tokenizer = tokenize, binary=True)
train_X = real_vectorizer.fit_transform(train_text.astype('U'))
##test_X = real_vectorizer.transform(test_text.astype('U'))

print(train_X)
