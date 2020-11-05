# Design Ideas

## Storage architecture

3 approaches:

- Single custom file based (zip up all the doc contents with a custom file ext)
  - Pros
    - Huge advantage of compression
    - Easier and smaller file hierarchy
  - Cons
    - Huge drawback of not being able to access and edit files locally without extraction
- Single md/file based
  - Pros
    - Easier file hierarchy, faster to read and edit outside the software
    - Works well for _only_ text based files
  - Cons
    - Not a good approach if we are including media files or other docs
- Folder per doc
  - Same as zip, but use folders instead of custom files
  - Pros
    - Advantage for local editing outside of software
    - clean hierarchy
  - Cons
    - Might not be scalable as it leaves a new folder for even a single file
  - Optimizations
    - If only text file, don't create folder.

## Notes

Using pandoc flavoured markdown format

### Note taking methods

- Cornell: for body and content
- Outline: for Table of Contents
- Charting: for grid and table style
- Sentence
- Mind Mapping

### Journalling methods

- One line a day
- Bullet Journal
- Vision Journal
- The simple elephant