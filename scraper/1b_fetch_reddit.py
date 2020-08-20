import config

import requests
from datetime import datetime
import ujson

import pandas as pd

from ratelimit import limits, sleep_and_retry

import os
import time

REDDIT_COMMENTS_URL = "https://api.pushshift.io/reddit/search/comment/"

@sleep_and_retry
@limits(calls=1, period=1)
def query_reddit_comments(query):
    
    r = requests.get(REDDIT_COMMENTS_URL, params=query)
    
    return r

def fetch_comments_since(start_time, query, output_dir):
    
    if not os.path.exists(f"{config.DATA_DIR}{output_dir}"):
        os.makedirs(f"{config.DATA_DIR}{output_dir}")
    
    query["after"] = int(start_time.timestamp())
    
    valid_response = True
    response_idx = 0
    
    while valid_response:
        
        r = query_reddit_comments(query)
        
        if r.status_code == 200:
        
            r_json = ujson.loads(r.text)["data"]
            
            if len(r_json) == 0:
                print("Empty response. Finishing")
                break
            
            end_timestamp = r_json[-1]["created_utc"]
            end_time = datetime.fromtimestamp(end_timestamp)
            
            print(f"{len(r_json)} results between {start_time} and {end_time}")
            
            with open(f"{config.DATA_DIR}{output_dir}/{response_idx}_{end_timestamp}.json", "w") as f:
                f.write(ujson.dumps(r_json))
            
            start_time = end_time
            query["after"] = end_timestamp
                
            response_idx += 1
            
        else:
            
            if r.status_code == "429":
                
                time.sleep(60)
            
            else:
            
                print(f"Unsuccessful response: code {r.status_code}, {r.text}")
                break

# start_time = datetime.strptime("2000-01-01 00:00:00", '%Y-%m-%d %H:%M:%S')
start_time = datetime.strptime("2017-06-08 00:00:00", '%Y-%m-%d %H:%M:%S')

query = {
    "q": "github.com",
    "sort": "asc",
    "sort_type": "created_utc",
    "size": 500,
}

fetch_comments_since(start_time, query, "/raw/reddit_github")