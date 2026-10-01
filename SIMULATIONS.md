# Adding simulations

1. Drop a self-contained HTML file into `public/sims/`.
2. Make sure it has a `sim-meta` block (see `public/sims/wave-lab.html`):

```html
<script type="application/json" id="sim-meta">
{"id":"my-sim","title":"My simulation","topic":"3",
 "tabs":[{"id":"abc","title":"What this tab shows","keywords":["node","antinode"]}]}
</script>
```

   - Multi-tab sims list each tab with its own `keywords`. The sim should open the tab named in the URL hash (e.g. `my-sim.html#abc`).
   - Single-view sims can skip `tabs` and put `keywords` at the top level.
3. Push to `main`. The build runs `scripts/build-sims-index.js`, which regenerates `public/sims/index.json`, and the app shows an Explore button on any card whose keyword contains one of the sim's keywords (the longest match wins). Start a keyword with `=` to require an exact match, which is best for short generic words such as `=frequency`, so that it does not also match cards like "Threshold Frequency".

Sims run in a sandboxed iframe (`allow-scripts` only), so they must not rely on cookies, storage shared with the app, or external network requests.
The session timer pauses while a simulation is open.
