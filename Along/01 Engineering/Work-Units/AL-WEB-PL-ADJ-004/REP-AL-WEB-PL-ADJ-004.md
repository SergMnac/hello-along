# AL-WEB-PL-ADJ-004 — Remove Premature Central Launch Panel

Status: `ADJUSTMENT COMPLETE — ARCHITECT REVIEW READY`

No architecture, product or visual self-acceptance was performed.

## Authority and Scope

- Normative documentation source: `projects-knowledge@caa2ec8a1acb6e8cf31995efba5a7e173cd49037`.
- TASK blob: `e2735af5768ea5714f070b5f7714ed791c17501e`.
- PROMPT blob: `7ca22696a1e2854bf3e6a9eab45af2d556c06d54`.
- Implementation repository: `SergMnac/hello-along`.
- Local root: `D:\hello-along`.
- Verified starting source: `main@f8d4291184a728f71d2d34ca2d8e190334f90a03`.
- Final remote source: `main@f0a99dcd294ee8452cdad456f286dc5032851593`.

The complete central launch-action panel was removed: its container, localized secondary heading, primary action and `Open Along` action. The central canonical logo element, localized greeting, subtitle, seven notes, note interactions, background, footer and language switcher were preserved. No replacement CTA was introduced.

## Design Inspection

The canonical Figma file `vHEl2whHlsBDaTNmnHSYjD`, page `000 Under Construction` (`3492:2`), was inspected. Launch frame `hello-city-reveal` (`4407:1318`) contains the panel targeted by the Owner instruction, including its title and two actions. This implementation intentionally deviates only by removing that frame; no other composition was redesigned.

Reference capture: `artifacts/release-preflight/adj-004/figma-under-construction.png`.

## Starting Production State

All stop conditions were checked before production writes:

- Active target: `/opt/home-dc/edge/releases/hello-along-f8d4291184a7/t-0/public`.
- Active manifest hash: `fe0e0906c7a852bd5565326548e44016c9cf2d6174f48b2cf482cd8a8c033c2c`.
- Scheduler-selected stage: `t-0`.
- `edge-hello-along`: `running`, `healthy`.
- `hello-along-stage.timer`: `enabled`, `active`.
- No emergency stage pin was present.
- Authoritative baseline manifest hash: `c00edd51169ae0a1e78d575391d42c7c85a277bcc2fe46baa66cbf99b47f3190`.
- Authoritative baseline content verification: passed.

An infrastructure interruption reset both SSH and public HTTPS during temporary package upload. Production had not been written. After connectivity recovered, the unchanged old target and healthy container were reconfirmed; only incomplete temporary uploads were replaced.

## Source Changes

Final source commit: `f0a99dcd294ee8452cdad456f286dc5032851593` (`fix: remove premature launch panel`).

Changed files:

- `src/UnderConstructionPage.tsx`: removed the complete launch panel rendering block.
- `src/styles.css`: removed launch-panel-only styling and selector references.
- `src/__tests__/campaign.test.tsx`: added EN / ES / RU T-0 regressions for panel and CTA absence while asserting the logo, localized greeting/subtitle and seven notes remain.

The launch localization data remains because it supplies the preserved greeting and subtitle. Routes, scheduler logic, stage dates, note content and dependencies were not changed.

## Quality Gates

Initial source checkout:

- `npm test`: passed, 7 files / 69 tests.
- `npm run lint`: passed.
- `npx tsc --noEmit`: passed.
- `npm run build`: passed.
- `npm run build:stages`: passed for all 8 stages.
- `npm run scan:leaks`: passed.
- `npm run scan:stage-leaks`: passed.
- Initial Windows scheduler invocation exposed only the known CRLF checkout issue.

Exact LF detached checkout of final remote `main@f0a99dcd294ee8452cdad456f286dc5032851593`:

- Path: `artifacts/release-preflight/adj-004/worktree-f0a99dcd294e`.
- `npm ci`: passed; existing dependency warnings only, no dependency changes.
- `npm test`: passed, 1 canonical file / 14 tests.
- `npm run lint`: passed.
- `npx tsc --noEmit`: passed.
- `npm run build`: passed.
- `npm run build:stages`: passed for all 8 stages.
- `npm run scan:leaks`: passed.
- `npm run scan:stage-leaks`: passed.
- `npm run test:scheduler`: passed.
- Built artifact scan: `launch-panel` absent from every stage artifact.

The exact detached checkout was the only source used for release packaging.

## Release Artifacts

Local package root: `artifacts/release-preflight/adj-004/release-f0a99dcd294e`.

Server upload path: `/tmp/hello-along-adj-004-f0a99dcd294e`.

Package SHA-256 values were verified on the server before extraction:

| stage | package SHA-256 |
| --- | --- |
| `t-21` | `bb359ae944c04f315736bbacec95c8a5c2a74398145560dc0403e042d61054d1` |
| `t-18` | `4caf52667b1c4524bc16bd61e0a6df634afa5e0e8d1820bb6a739cb03b0efdb5` |
| `t-15` | `04c82bb7762861ba6d0f1ade654b42d0cfdb08744a2a7cc5d6ed99832f025b99` |
| `t-12` | `86fa55a6c0cb9fb61540e0754e85ee508736974a64a1d68755c9d6821192485b` |
| `t-9` | `b1a7bc783583bc6568a74983e12f54368bfc71f364e2ae376ab68d3b42ee0463` |
| `t-6` | `2b4e3e34af352e521a967c6ae5f01ab9e8555e9269ef8795856e21a5971b863d` |
| `t-3` | `2c7b0eae7d982787e214634c4b68588bf65351da4495a1a2957ca05c7b48a960` |
| `t-0` | `253950569c0598951b9ecf460264e4fa044f8e029763ca525a367cb5dd0ab37c` |

New immutable family: `/opt/home-dc/edge/releases/hello-along-f0a99dcd294e`.

All manifests reference the exact final source and matching stage IDs. Every internal `public.sha256` passed, and scheduler `verify` returned `All hello-along releases verified`.

| stage | SHA-256 of `public.sha256` |
| --- | --- |
| `t-21` | `d6e0318ab45afb4ace58ab5d4d6f2db86a1ff8d84aa962a721af86c6f64621ef` |
| `t-18` | `71ca281903ee9e6bd9af15144d7352d9200ff2ef4a3f52c8863fbdeb2bca297c` |
| `t-15` | `91f39a7d3d67607b4199c224c16fa19224ebb366e931deea11db1addce7efa6b` |
| `t-12` | `adf3fa945c89e807de042e2d68e8075a6800aa072224c412eaa1a0ca6d91ebc4` |
| `t-9` | `befdfbe186c2577168a8124dbb7c404e46f60a9b54d94db9309bc153b35767a3` |
| `t-6` | `dd120b4f57a7943af429bbf978d47ecc221d6abe86f7b22767b69c18a4808a78` |
| `t-3` | `1109b428c13a037ab4894501877a0a8f79164c637235a7e29ae7f958f3c552bd` |
| `t-0` | `8d03c90d0f69ad6f7a75eac76216fd60fa4587ef83309f71117e16b47982c845` |

The authoritative baseline was copied unchanged into the family and retained hash `c00edd51169ae0a1e78d575391d42c7c85a277bcc2fe46baa66cbf99b47f3190`.

## Production Activation

Service-unit backup:

`/etc/systemd/system/hello-along-stage.service.pre-adj-004-f0a99dcd294e`

Updated scheduler pin:

- `RELEASES_ROOT=/opt/home-dc/edge/releases/hello-along-f0a99dcd294e`.
- `EXPECTED_SOURCE_COMMIT=f0a99dcd294ee8452cdad456f286dc5032851593`.

`systemd-analyze verify` passed. Scheduler logic selected `t-0`; the stage was not hardcoded into activation.

- Active target: `/opt/home-dc/edge/releases/hello-along-f0a99dcd294e/t-0/public`.
- Active manifest hash: `8d03c90d0f69ad6f7a75eac76216fd60fa4587ef83309f71117e16b47982c845`.
- Active source: `f0a99dcd294ee8452cdad456f286dc5032851593`.
- `edge-hello-along`: `running`, `healthy`.

The prior immutable family and authoritative baseline remain available for rollback.

## Public Verification

- `/`, `/en/`, `/es/`, `/ru/`: HTTP `200`.
- All 28 localized permanent reveal routes: HTTP `200` at scheduler-selected `t-0`.
- `/logo/along-logo-dark.svg`: HTTP `200`.
- `/assets/background-image@2x.webp`: HTTP `200`.
- Unknown control path: real HTTP `404`.
- Desktop `1440 x 900`, EN / ES / RU: central panel absent; preserved content present.
- Mobile `390 x 844`, EN / ES / RU: central panel absent; preserved content present.
- All 42 physical mouse/touch note open-close checks passed.
- Canonical URL, `hreflang`, document language, one H1 and resting dialog absence passed in all 6 browser cases.

Published evidence:

- [Screenshot index](SCREENSHOT-INDEX.md)
- [Machine-readable browser results](evidence/verification-results.json)

No unrelated visual adjustment was made. Existing dense mobile note placement remains outside this narrowly authorized removal.

## Scheduler Final State

- `hello-along-stage.service`: last result `success`.
- `hello-along-stage.timer`: `enabled`, `active`.
- Next trigger at final check: `Wed 2026-10-14 00:00:05 UTC`.
- Emergency stage pin: absent.
- Idempotent scheduler run: passed.
- Before/after target remained `/opt/home-dc/edge/releases/hello-along-f0a99dcd294e/t-0/public`.
- Before/after manifest hash remained `8d03c90d0f69ad6f7a75eac76216fd60fa4587ef83309f71117e16b47982c845`.
- Before/after symlink mtime remained `1791917609`.

## Recovery

To restore the previously accepted scheduler pin and scheduler-selected release from that family:

```bash
sudo cp -a /etc/systemd/system/hello-along-stage.service.pre-adj-004-f0a99dcd294e /etc/systemd/system/hello-along-stage.service
sudo systemctl daemon-reload
sudo systemctl start hello-along-stage.service
```

The active unit, previous unit, current immutable family, previous immutable family and authoritative baseline are all retained.

## Boundaries

No changes were made to `D:\Along`, `SergMnac/along`, DNS, Traefik routing, firewall, WireGuard, SSH, `edge-stvk` or unrelated services.

## Blockers

`NO BLOCKERS`
