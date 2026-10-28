# notes-cli

A small command-line note-taking app built with Node.js. Notes are stored locally in a JSON file, can be tagged and searched, and can be viewed in the browser through a tiny built-in web server.

## Features

- **Create notes** with optional comma-separated tags
- **List** every note, or **search** them by content (case-insensitive)
- **Remove** a single note by id, or **clean** out all notes at once
- **Web view**: start a local HTTP server that renders your notes as an HTML page and opens it in your default browser
- **Zero setup storage**: everything lives in a plain `db.json` file, no database required

## Requirements

- [Node.js](https://nodejs.org/) (ES modules are used, so a modern version is needed)
- [pnpm](https://pnpm.io/) (the project pins `pnpm@12.15.0` via `packageManager`)

## Installation

```bash
git clone <repo-url> notes-cli
cd notes-cli
pnpm install
```

To use the `note` command from anywhere, link the package globally:

```bash
pnpm link --global
```

Without linking, run the CLI directly with `node index.js <command>` in place of `note <command>`.

## Usage

```
note <command> [options]
```

| Command | Description |
| --- | --- |
| `note new <note>` | Create a new note. Add tags with `--tags` / `-t`. |
| `note all` | List all notes. |
| `note find <filter>` | List notes whose content contains `<filter>`. |
| `note remove <id>` | Remove the note with the given id. |
| `note web [port]` | Serve your notes as a web page (default port `5555`) and open it in the browser. |
| `note clean` | Remove all notes. |
| `note --help` | Show help for all commands. |

### Examples

Create a note:

```bash
note new "Go to the gym"
# Note added! 1793195374238
```

Create a note with tags (comma-separated, no spaces):

```bash
note new "Study Deutsch" --tags low,fun
```

List every note:

```bash
note all
# id:  1793195512682
# tags:  low, fun
# note:  Study Deutsch
```

Search notes by content:

```bash
note find react
```

Remove a note by its id:

```bash
note remove 1793195374238
# Note removed:  1793195374238
```

View notes in the browser on a custom port:

```bash
note web 8080
# Server is listening on port 8080
```

Delete everything:

```bash
note clean
# All notes removed
```

## How it works

Notes are stored in [db.json](db.json) at the project root with this shape:

```json
{
  "notes": [
    {
      "tags": ["high"],
      "content": "Study React",
      "id": 1793195485867
    }
  ]
}
```

Each note's `id` is the timestamp (`Date.now()`) at which it was created.

### Project structure

```
notes-cli/
├── index.js            # Executable entry point (the `note` bin)
├── db.json             # Local JSON "database"
├── src/
│   ├── command.js      # CLI commands and options, defined with yargs
│   ├── notes.js        # Note operations: create, list, find, remove, clean
│   ├── db.js           # Reading and writing db.json
│   ├── server.js       # HTTP server for the web view
│   └── template.html   # HTML template rendered by the web view
└── tests/
    └── notes.test.js   # Jest unit tests for src/notes.js
```

- [src/command.js](src/command.js) parses arguments with [yargs](https://yargs.js.org/) and calls into the notes module.
- [src/notes.js](src/notes.js) holds the note logic and depends only on the db module.
- [src/db.js](src/db.js) reads and writes `db.json` with `fs/promises`.
- [src/server.js](src/server.js) fills the `{{ notes }}` placeholder in [src/template.html](src/template.html) with the rendered notes and uses [open](https://github.com/sindresorhus/open) to launch the browser.

## Testing

Unit tests are written with [Jest](https://jestjs.io/). The db module is mocked, so tests never touch your real `db.json`.

```bash
pnpm test
```

Jest runs with `--experimental-vm-modules` because the project uses native ES modules.

## Notes and limitations

- The web view shows the notes as they were when `note web` started. Restart it to see changes.
- Note content and tags are inserted into the page as raw HTML, so the web view is meant for local, personal use only.
- `db.json` is tracked in the repository. Run `note clean` to start with an empty list.

## License

ISC
