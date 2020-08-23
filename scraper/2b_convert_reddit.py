import glob
from tqdm import tqdm
import pandas as pd

import config

relevant_columns = [
    "author",
    "created_utc",
    "domain",
    "full_link",
    "num_comments",
    "score",
    "subreddit",
    "title",
    "url",
    "selftext"
]


def merge_chunks(jsons_dir, out_filename):

    jsons = [f for f in glob.glob(f"{config.DATA_DIR}{jsons_dir}/*.json")]

    merged_comments = []

    for json in tqdm(jsons):

        comments = pd.read_json(json)
        comments = comments[relevant_columns]

        merged_comments.append(comments)

    merged = pd.concat(merged_comments, axis=0)
    merged = merged.drop_duplicates(subset=["full_link"], keep="first")
    merged = merged.sort_values(by="created_utc")
    merged = merged.reset_index(drop=True)
    merged = merged.astype(str)
    merged["created_utc"] = merged["created_utc"].astype(int)
    merged["score"] = merged["score"].astype(float)
    merged["num_comments"] = merged["num_comments"].astype(float)

    merged.to_feather(
        f"{config.DATA_DIR}{out_filename}",
        compression=config.FEATHER_COMPRESSION,
        compression_level=config.FEATHER_COMPRESSION_LEVEL,
    )


merge_chunks("/raw/reddit_github", "/intermediate/reddit_github.feather")
