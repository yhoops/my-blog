# Blog Context

This context defines the product language for the public blog and its authoring experience.

## Language

**Right Context Rail**:
A secondary reading surface beside a writing or work detail page that previews the page before or while the reader commits to the full text. Its primary role is to surface the page's gist, key signals, and outline without pulling attention away from the main content.
_Avoid_: sidebar, ad rail, recommendation feed, duplicate navigation

**Author Override**:
Optional author-provided preview content that refines what the Right Context Rail would otherwise derive from the page. It exists to improve judgment and emphasis, not to make every page require extra editorial work.
_Avoid_: required summary, duplicate excerpt, manual-only rail

**Rail Variant**:
A content-type-specific presentation of the Right Context Rail. Writing and work pages share the same rail concept and visual system, but the signals shown in the rail differ because readers evaluate essays and projects differently.
_Avoid_: separate sidebar, unrelated component, one-size-fits-all rail

**Rail Preview**:
A compact preview inside the Right Context Rail that helps readers decide how to approach the page. It should stay brief: summaries are two to three lines, key points or project highlights are capped at three items, and outlines are capped at six visible entries.
_Avoid_: second article, long excerpt, dense metadata panel

**Rail Outline**:
A compact outline shown inside the Right Context Rail. It prioritizes second-level headings, only adds third-level headings when the page has too few second-level headings, and never shows more than six entries.
_Avoid_: full table of contents, deep heading tree, image caption list

**Desktop Rail**:
The desktop presentation of the Right Context Rail. It is a sticky wide-screen enhancement beside the main content, while narrower screens preserve the main reading flow by hiding the rail.
_Avoid_: mobile floating panel, bottom drawer, required mobile sidebar

**Author Highlight**:
A short author-provided point shown in the Right Context Rail to emphasize what matters about the page. Highlights are optional; when absent, the rail should omit the section instead of inventing key points from the body.
_Avoid_: generated key point, random excerpt, automatic takeaway

**Rail Summary**:
A short author-provided or derived preview of the page's main idea. It introduces the page in the Right Context Rail without replacing the opening of the main text.
_Avoid_: full abstract, body excerpt, SEO description

**Project Highlight**:
A short author-provided point that explains what matters about a work page as a project. Project highlights emphasize role, outcome, craft, or constraint rather than essay-style arguments.
_Avoid_: feature list, changelog, generated takeaway

**Context Note**:
An optional author-provided note that explains why the page exists or what background helps the reader approach it. It should add framing, not repeat the summary.
_Avoid_: duplicate summary, footnote dump, implementation note

**Reading Rail Pair**:
The left knowledge rail and the Right Context Rail treated as one visibility group during reading mode. Entering reading mode hides both rails; hovering either rail's area reveals both together.
_Avoid_: independent rail visibility, one-sided reveal, permanent reading clutter

**Writing Workbench**:
The admin content page where the author writes and prepares a writing or work page. Its primary surface is the main body editor; metadata, cover, context fields, and media controls are supporting editorial surfaces.
_Avoid_: form page, metadata dashboard, narrow editor

**Publish Preview**:
A same-page preview state in the Writing Workbench that presents the current draft as a realistic public page before publishing. It supports returning to editing and publishing from the preview without opening a separate browser window.
_Avoid_: popup preview, external tab, raw markdown preview

**Content Library**:
A top-level authoring collection in the admin content explorer that groups pages by their editorial type before any folder-level organization. In this product, writing and work are separate content libraries rather than one mixed tree.
_Avoid_: mixed root, type filter, visual-only grouping

**Writing Library**:
The content library for essays, notes, and other writing pages in the admin authoring experience. It is presented to the author as “随笔”.
_Avoid_: mixed posts tree, work collection, generic content list

**Work Library**:
The content library for project and portfolio pages in the admin authoring experience. It is presented to the author as “作品”.
_Avoid_: mixed posts tree, writing collection, generic content list

**Canonical Slug**:
The stable public path key for a page, independent of where its source file lives inside a content library. It names the page itself rather than any folder path, and preserves public URLs even when authoring storage is reorganized.
_Avoid_: file path URL, folder-derived route, storage-coupled slug

**Library Folder Tree**:
The folder structure that belongs to a single content library and organizes pages only within that library. Writing and work do not share one global folder tree.
_Avoid_: global folder pool, shared root folders, cross-library tree

**Library Slug Scope**:
The uniqueness boundary for a Canonical Slug inside one content library. A writing page and a work page may share the same slug, but two pages inside the same library may not.
_Avoid_: global slug lock, path-derived uniqueness, cross-library collision

**Slug Conflict Guard**:
The save-time protection that rejects a Canonical Slug when it is already used by another page in the same content library. It blocks the change instead of auto-renaming the page.
_Avoid_: auto-suffixed slug, silent rename, overwrite by collision

**Library Switcher**:
The control at the top of the admin content explorer that switches the visible tree between the Writing Library and the Work Library. It presents one active content library at a time instead of showing both trees together.
_Avoid_: dual expanded trees, mixed explorer, global content tree

**Library Count Badge**:
The lightweight item count shown beside each content library in the Library Switcher. It gives the author a quick sense of library size without turning the explorer into a reporting surface.
_Avoid_: unlabeled library size, heavy analytics panel, status dashboard count

**Workbench Switch Guard**:
The confirmation step that protects unsaved changes when the author switches from one content library to the other inside the Writing Workbench. The switch must be explicit: save first, discard changes, or stay where you are.
_Avoid_: silent switch, implicit discard, auto-switch with dirty state

**Library-Scoped Import**:
The rule that imported Markdown enters the currently active content library and its current folder context. Import is not a global action and does not auto-distribute files across libraries.
_Avoid_: cross-library import, automatic split import, global markdown inbox

**Content Reclassification**:
The act of changing a page from one content library type to the other inside the Writing Workbench. It is treated as a library migration of the page rather than a cosmetic metadata edit.
_Avoid_: type toggle only, metadata-only switch, same-library type flip

**Redirect Alias**:
The preserved old public address of a page after its Canonical Slug changes. It exists to keep existing external links working by forwarding readers to the current public address.
_Avoid_: broken old link, silent slug replacement, no-history URL change

**System-Maintained Alias**:
A Redirect Alias whose lifecycle is managed by the system when a page is renamed or reclassified. It is not treated as author-edited content in the Writing Workbench.
_Avoid_: manual alias list, author-managed redirect table, free-form alias editing

**Library Migration Notice**:
The lightweight one-time feedback shown in the Writing Workbench while existing content is being reorganized into content libraries. It makes the migration visible to the author without turning it into a multi-step setup flow.
_Avoid_: silent migration, setup wizard, hidden restructuring

**Migration Exception List**:
The explicit list of legacy pages that the system refuses to auto-migrate because their library or Canonical Slug cannot be trusted. It isolates bad records instead of silently guessing where they belong.
_Avoid_: silent guess, hidden bad record, automatic uncertain migration

**Title-First Explorer Entry**:
The content explorer row that presents a page primarily by its author-facing title, with slug or file-oriented identifiers treated as secondary information. It helps the author browse by meaning rather than storage naming.
_Avoid_: slug-first row, filename-first tree, storage-first explorer
