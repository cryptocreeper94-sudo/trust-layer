# LUME — Natural Language Mode Handoff
### Milestone 7: English Mode & Milestone 8: Multilingual Mode
**Date:** March 7, 2026
**From:** Jason (Trust Layer / DarkWave Ecosystem)
**To:** Lume Agent (lume-lang.org)

---

## CONTEXT

Lume already compiles `.lume` files through the pipeline: **Lexer → Parser → AST → Transpiler → JavaScript**. The existing keywords (`ask`, `think`, `generate`, `show`, `let`, `monitor`, `heal`, `optimize`, `evolve`, `mutate`) proved that natural-language-inspired syntax dramatically reduces friction. These two milestones take that principle to its logical conclusion.

---

## MILESTONE 7: ENGLISH MODE

### What It Is

A new compiler mode where the input is plain English sentences. Not "English-like syntax" — actual English. The compiler understands intent from context and resolves it into the existing Lume AST, which then transpiles to JavaScript as normal.

### How It Works

Add a **front-end stage** to the existing compiler pipeline:

```
CURRENT:   Lume Source → Lexer → Parser → AST → Transpiler → JavaScript
NEW:       English Source → Intent Resolver → Lume AST → Transpiler → JavaScript
```

The Intent Resolver is the new component. It sits before the existing pipeline and converts English sentences into Lume AST nodes. The rest of the pipeline is untouched.

### The Intent Resolver — Two Layers

**Layer A: Pattern Matching (fast, offline, no AI needed)**

A dictionary of common English phrases mapped directly to AST nodes. These are deterministic — no ambiguity, no AI call required.

| English Input | Resolves To (Lume AST) |
|---------------|----------------------|
| `get the user's name` | Variable access: `user.name` |
| `show it on the page` | `show` statement |
| `when the button is clicked` | Event listener: `on click` |
| `save this to the database` | `store` operation |
| `ask the AI to summarize this` | `ask` keyword call |
| `repeat this 5 times` | `for` loop, count: 5 |
| `if the user is logged in` | Conditional: `if user.authenticated` |
| `get data from [url]` | `fetch` operation |
| `create a new user with name and email` | Object creation with fields |
| `sort the list by date` | Array sort operation |
| `send an email to [address]` | `generate` + send operation |
| `wait 3 seconds` | `delay(3000)` |
| `connect to the database` | Database connection setup |
| `log the error` | `show` to error stream |

Build this as a growing pattern library. Start with 50-100 common patterns. The patterns should support variable slots (indicated by brackets or context). This layer handles the simple, common operations instantly without any external calls.

**Layer B: AI-Powered Resolution (for complex/ambiguous input)**

When a sentence doesn't match any pattern, pass it to an LLM with the current project context. The AI resolves the intent and returns a Lume AST node.

**What the AI receives:**
1. The English sentence
2. The current project's data model (what variables, types, and structures exist)
3. The current scope (what's available — functions, imports, UI elements)
4. The target context (is this a server file? a UI component? a data operation?)

**What the AI returns:**
A structured Lume AST node — NOT JavaScript. The AI maps English to Lume's existing AST format. The transpiler handles the rest.

**Example flow:**
```
Input:    "get all users who signed up this month and show their names in a list"
Context:  { dataModel: { users: { fields: [name, email, signupDate] } }, scope: "ui-component" }
AI Output: [
  { type: "query", target: "users", filter: { field: "signupDate", op: ">=", value: "startOfMonth()" } },
  { type: "show", format: "list", field: "name" }
]
→ Transpiler converts to JavaScript as normal
```

### File Format

English Mode files use the `.lume` extension with a mode declaration at the top:

```
mode: english

get the user's name and email from the database
if the name is empty, show "No name provided"
otherwise, show "Hello, {name}" on the page

when the submit button is clicked:
  save the form data to the database
  show "Saved!" for 3 seconds
  then redirect to the dashboard
```

The `mode: english` declaration tells the compiler to route through the Intent Resolver instead of the standard Lexer.

### Context Engine

The Intent Resolver needs to understand what's available in the current project. Build a **Context Engine** that:

1. Scans the project's data models (schemas, types, database tables)
2. Tracks declared variables and their types within the current file
3. Knows the available UI elements (if in a UI context)
4. Knows the available API endpoints (if in a server context)
5. Maintains a "what was just mentioned" short-term memory so pronouns and references resolve correctly (e.g., "show **it**" → refers to the last retrieved value)

The Context Engine feeds into both Layer A (pattern matching uses context to fill variable slots) and Layer B (AI resolution uses context to disambiguate).

### Error Handling

When the compiler can't resolve an English sentence:

1. First, try pattern matching (Layer A)
2. If no match, try AI resolution (Layer B)
3. If AI resolution confidence is below threshold (e.g., < 80%), show the user what it thinks they meant and ask for confirmation
4. If completely unresolvable, show a clear error: `"I couldn't understand: [sentence]. Did you mean: [suggestions]?"`

Never silently guess. If there's ambiguity, surface it.

### CLI Usage

```bash
lume build app.lume              # Standard Lume compilation (unchanged)
lume build app.lume --mode english   # Force English mode (override file declaration)
lume run app.lume                # Auto-detects mode from file header
```

---

## MILESTONE 8: MULTILINGUAL MODE

### What It Is

Extend the Intent Resolver to accept input in any human language. French, Spanish, Mandarin, Arabic, Hindi, Japanese, Portuguese, German — any language the AI model understands.

### How It Works

The Intent Resolver already processes natural language (from Milestone 7). Multilingual support means:

1. **Auto-detect the input language** — no configuration needed
2. **Resolve intent identically regardless of language** — the same program written in French and English produces the same AST and the same JavaScript output
3. **Support mixed-language files** — a developer can write some lines in English and some in Spanish in the same file. Each line is resolved independently.

### Implementation

**Layer A (Pattern Matching):** Expand the pattern library with translations of each pattern. Start with the top 10 languages by developer population:

1. English
2. Mandarin Chinese (中文)
3. Spanish (Español)
4. Hindi (हिन्दी)
5. French (Français)
6. Portuguese (Português)
7. Arabic (العربية)
8. Japanese (日本語)
9. German (Deutsch)
10. Korean (한국어)

Each pattern gets translated versions. The pattern matcher checks all languages in parallel.

**Example — the same pattern in multiple languages:**

| Language | Input | Resolves To |
|----------|-------|-------------|
| English | `get the user's name` | `user.name` |
| French | `obtenir le nom de l'utilisateur` | `user.name` |
| Spanish | `obtener el nombre del usuario` | `user.name` |
| Mandarin | `获取用户的名字` | `user.name` |
| Arabic | `الحصول على اسم المستخدم` | `user.name` |
| Japanese | `ユーザーの名前を取得する` | `user.name` |

Same AST output. Same JavaScript. The language you write in does not affect the compiled result.

**Layer B (AI Resolution):** Already multilingual — LLMs understand all major languages natively. The AI resolution layer requires no changes for multilingual support. Just ensure the context data (data model, scope) is passed in a language-neutral format (field names stay as defined in the project, regardless of what language the instructions are written in).

### File Format

```
mode: natural

obtener todos los usuarios registrados este mes
mostrar sus nombres en una lista

when the delete button is clicked:
  supprimer l'utilisateur sélectionné
  afficher "Utilisateur supprimé" pendant 3 secondes
```

The `mode: natural` declaration enables multilingual mode. `mode: english` restricts to English only (faster pattern matching). Standard `.lume` files without a mode declaration use the existing Lume syntax (unchanged, fully backward compatible).

### Error Messages

Error messages should be returned in the same language the user is writing in. If the input is French, errors are in French. If mixed, default to the language used most in the file.

---

## WHAT THIS DOES NOT CHANGE

- The existing Lume syntax (`let`, `ask`, `show`, `think`, etc.) is fully preserved and unchanged
- Standard `.lume` files without a mode declaration compile exactly as they do today
- The Transpiler is untouched — it still receives the same AST format and outputs the same JavaScript
- The runtime is untouched
- The self-sustaining features (monitor, heal, optimize, evolve, mutate) are untouched
- npm package structure is unchanged — this is an additive feature

---

## PRIORITY ORDER

1. **Milestone 7 first** — get English Mode working with Layer A (pattern matching only, no AI). This is the simplest version and proves the concept.
2. **Add Layer B** — integrate AI resolution for complex sentences that don't match patterns.
3. **Milestone 8** — expand pattern library to multilingual. Layer B already handles this automatically.

---

## WHAT SUCCESS LOOKS LIKE

A developer opens a `.lume` file, writes `mode: natural` at the top, and then writes their program in plain French. They run `lume build` and get working JavaScript. No configuration, no language selection, no special setup. They write in their language, the compiler understands.

A team in São Paulo writes in Portuguese. A team in Tokyo writes in Japanese. A solo developer in Dallas writes in English. They're all writing valid Lume. The compiled output is identical. The language barrier to programming is eliminated.

---

## THE LARGER VISION

Every programming language that has ever existed requires you to learn English keywords. Python, JavaScript, Ruby, Go, Rust, C — all English. Billions of people worldwide are excluded from programming not because they can't think logically, but because the syntax is in a language they don't speak fluently.

Lume would be the first programming language where the syntax is whatever language you already speak. That's not competing with Python or JavaScript — that's a category that has never existed.

---

## ACADEMY UPDATES NEEDED

Once implemented, the Lume Academy (on dwtl.io and academy.tlid.io) will need:

1. A new track or module: "Natural Language Programming with Lume"
2. Updated playground to support `mode: english` and `mode: natural` headers
3. Example programs written in multiple languages showing identical output
4. Documentation of the pattern library (all supported phrases)

Trust Layer will handle the Academy content updates. The Lume agent just needs to expose the compiler functionality.

---

## CONTACT

- **Ecosystem owner:** Jason (cryptocreeper94@gmail.com)
- **Trust Layer DB user_id:** 49057269
- **Launch date:** August 23, 2026
- **Lume Academy:** /academy on dwtl.io
