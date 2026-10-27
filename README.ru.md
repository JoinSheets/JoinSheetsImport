# JoinSheetsImport

[English](README.md) · **Русский**

![version](https://img.shields.io/badge/version-0.1.0b1-blue)
![license](https://img.shields.io/badge/license-MIT-green)
![status](https://img.shields.io/badge/status-beta-yellow)

Опциональный конвертер `.xlsx` → источник данных для [JoinSheets](https://github.com/JoinSheets/JoinSheets).
Разбирает плоскую таблицу в ленивый columnar-формат JoinSheets и соответствующий
фрагмент манифеста — целиком в браузере.

Часть организации [JoinSheets](https://github.com/JoinSheets).

## Лицензия

MIT — см. [LICENSE](LICENSE).

Вендоренная библиотека разбора (`vendor/xlsx.full.min.js`, [SheetJS](https://sheetjs.com/)
Community Edition) распространяется по собственной лицензии — см.
[`vendor/SHEETJS-LICENSE`](vendor/SHEETJS-LICENSE) (Apache-2.0) — и используется как
зависимость, без переиздания.
