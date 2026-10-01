# neon-calc
Neon web calculator with memory buttons, parentheses and on-device history.

## How it works
- The display shows the whole expression (e.g. `1100÷(325+824)`) with an editable caret.
  Caret: ←/→, Home/End, mouse click or tap/drag on the expression. The display is a plain
  `div` (no input / contenteditable), so a phone never opens the system keyboard.
- Under the expression a live draft shows `= result`; if the expression is incomplete or
  not computable (dangling operator, `()`, unbalanced parens, double point, ÷0) it shows «ждём».
- Evaluation: own tokenizer + recursive-descent parser (no `eval`/`Function`).
  Precedence: parentheses → postfix `%` → unary minus → × ÷ → + −. Results are rounded to
  12 significant digits (`0.1+0.2 = 0.3`).
- `=` / Enter: if computable, the expression is replaced by the result (caret at end) and
  `expression = result` goes to history; otherwise nothing changes (the draft shakes).
  After `=` typing a digit / point / `(` starts a new expression; an operator continues from the result.

## Choices
- **±** toggles the sign of the number (or `)`-closed group) at/before the caret: at the start of the
  expression or right after `(` it adds a leading minus (`5` → `−5`), elsewhere it wraps it (`2+5` → `2+(−5)`).
  Pressing again removes the minus / unwraps.
- **%** is a postfix operator on the number (or group) at/before the caret: `n% = n/100`
  (`200×10%` = 20, `200+10%` = 200.1). Pressing again removes it.
- **Implicit multiplication** (`2(3)`, `(2)(3)`) is not supported → «ждём». Write `2×(3)`.
- Operator keys: pressing an operator right after another operator replaces it (`2`,`+`,`+` → `2+`);
  `−` after `×`/`÷`/`(` is a unary minus. A typed-in `2++3` is not computable.
- **M+ / M−** add/subtract the current draft result; if the expression is not computable they do
  nothing. **MR** inserts the memory at the caret (negative as `(−n)`, adds `×` if it would touch a number). **MC** clears.
  Memory and the M flag persist in localStorage.
- **History** is stored only on this device (localStorage, last 20). Tapping an entry loads its result into the editor and closes history.
- Keyboard: digits / Numpad, `.` `,`, `+ - * /`, `( )`, `%`, Backspace (before caret), Delete (after caret),
  arrows, Home/End, Enter / NumpadEnter / `=`; Escape closes history, otherwise clears (AC).
