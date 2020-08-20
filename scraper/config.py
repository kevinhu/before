import pathlib

"""
Contains configurations and settings used by the rest of the project.
Any settings in here can be overriden by config_private.py.
"""

_PROJECT_DIR = pathlib.Path(__file__).resolve().parent

DATA_DIR = _PROJECT_DIR / "data"

FEATHER_COMPRESSION = "zstd"
FEATHER_COMPRESSION_LEVEL = 16