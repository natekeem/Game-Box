# Third-party notices

This player vendors `js-dos` 8.5.3 and `emulators` 8.5.2. Both packages declare the GPL-2.0 license.

- Project: https://github.com/caiiiycuk/js-dos
- Documentation: https://js-dos.com
- Emulator project: https://github.com/js-dos/emulators

The supplied Hancom Typing 97 executable and data files are not covered by the js-dos license. Confirm the applicable rights before redistributing them outside the authorized internal environment.

The Hancom Typing 2007 browser compatibility layer vendors Wine-Assembly under the MIT license.

- Project: https://github.com/vgrichina/berrry-wine
- Vendored revision: `bcd802d24f7241f5108322b9f1ffefe86457a0cd`
- Local compatibility changes: Windows build fixes and Korean LCID/codepage support, documented in `vendor/wine-assembly/PROVENANCE.md`

The supplied Hancom Typing 2007 executable, data, graphics, and audio are not covered by the Wine-Assembly license. Keep deployment limited to the user's authorized internal environment unless separate redistribution rights are confirmed.

The CP949 runtime bundles unmodified NanumGothic Regular and Bold from Google Fonts under the SIL Open Font License 1.1. The complete license is included at `win32-runtime/fonts/fetched/NANUMGOTHIC-OFL.txt`.

- Font source: https://github.com/google/fonts/tree/main/ofl/nanumgothic
- Copyright: NHN Corporation (2010)

The CP949 conversion data is generated from the Unicode Consortium's archived Microsoft mapping file:

- https://www.unicode.org/Public/MAPPINGS/VENDORS/MICSFT/WINDOWS/CP949.TXT
