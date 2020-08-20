import glob
from tqdm import tqdm
import pandas as pd

import config

relevant_columns = [
    "title",
    "url",
    "author",
    "points",
    "story_text",
    "comment_text",
    "num_comments",
    "story_id",
    "story_title",
    "story_url",
    "parent_id",
    "created_at_i",
    "objectID",
]


def merge_chunks(jsons_dir, out_filename):

    jsons = [f for f in glob.glob(f"{config.DATA_DIR}{jsons_dir}/*.json")]

    merged_comments = []

    for json in tqdm(jsons):

        comments = pd.read_json(json)
        comments = comments[relevant_columns]

        merged_comments.append(comments)

    merged = pd.concat(merged_comments, axis=0)
    merged = merged.drop_duplicates(subset=["objectID"], keep="first")
    merged = merged.sort_values(by="created_at_i")
    merged = merged.reset_index(drop=True)
    merged = merged.astype(str)
    merged["created_at_i"] = merged["created_at_i"].astype(int)
    merged["points"] = merged["points"].astype(float)

    merged.to_feather(
        f"{config.DATA_DIR}{out_filename}",
        compression=config.FEATHER_COMPRESSION,
        compression_level=config.FEATHER_COMPRESSION_LEVEL,
    )


merge_chunks("/raw/hackernews_github", "/intermediate/hackernews_github.feather")
