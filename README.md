## ![Cefet/RJ Gateway API](./.github/logo.png "Cefet/RJ Gateway API")

---
#### `/api/v1/news`

**Description:**
Fetch news articles.

**Parameters:**
- `p` (integer): The page number. If not provided, the first page is returned.
- `q` (string): Search term for filtering news articles.
- `campus` (string): Filter news articles by campus (unit).

#### `/api/v1/events`

**Description:**
Fetch events.

**Parameters:**
- `p` (integer): The page number. If not provided, the first page is returned.
- `q` (string): Search term for filtering news articles.
- `campus` (string): Filter news articles by campus (unit).

#### `/api/v1/calendars`

**Description:**
Fetch academic calendars.

**Parameters:**
- `url` (string): The URL of the news website. **(required)**
