# JoinSheetsImport

**English** · [Русский](README.ru.md)

![version](https://img.shields.io/badge/version-0.1.0b1-blue)
![license](https://img.shields.io/badge/license-MIT-green)
![status](https://img.shields.io/badge/status-beta-yellow)

Optional `.xlsx` → [JoinSheets](https://github.com/JoinSheets/JoinSheets) source
converter. Parses a flat spreadsheet into JoinSheets' lazy columnar data format plus a
matching manifest fragment, entirely in the browser.

Part of the [JoinSheets](https://github.com/JoinSheets) organization.

## License

MIT — see [LICENSE](LICENSE).

The vendored parsing library (`vendor/xlsx.full.min.js`, [SheetJS](https://sheetjs.com/)
Community Edition) ships under its own license — see
[`vendor/SHEETJS-LICENSE`](vendor/SHEETJS-LICENSE) (Apache-2.0) — and is used as a
dependency, not relicensed.
