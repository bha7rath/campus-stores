# Campus Stores

Campus Stores is a Product Engineer work sample set at a fictional campus media equipment desk. Work through a club’s screening, from equipment pickup to a partial return and the next morning’s handover. Open **Candidate brief** in the app for the assignment.

## Run the app

Open `index.html` in a modern browser. The app includes its scripts, styles, and icons and can run offline.

To serve it over local HTTP, run this from the repository folder and visit `http://localhost:8000`.

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Each browser stores its own sample shift locally when browser storage is available. **Restart sample shift** restores the fictional starting records.

## Source

- `index.html` contains the desk layout, candidate brief, and bundled icons.
- `app.js` contains the sample records and interactions.
- `styles.css` defines the desktop and mobile layouts.

Icon license notices are in [third-party/lucide-LICENSE.txt](third-party/lucide-LICENSE.txt).


## Submit your work

1. [Fork Campus Stores](https://github.com/virinchi-healthcare/campus-stores/fork) into your GitHub account. Complete the candidate brief and push your changes to your public fork. In your README, point reviewers to your work and explain the decision you made.
2. In your fork, open **Commits**, select the final commit you want reviewed, and copy the page URL. It should look like `https://github.com/YOUR-USERNAME/campus-stores/commit/COMMIT-SHA`.
3. [Submit your work through the Google Form](https://docs.google.com/forms/d/e/1FAIpQLScvzoh1R4WS-SkiwAVBQbMvniieJYSoOEfLMyVo5CyjOvYUgQ/viewform). Your **roll number**, **email ID**, and **final commit link from your public fork** are required. Enter your roll number and email ID in the form only.


## Prototype: Smart Desk

**Decision:** Make the operator's task request-centric without replacing the original registers. The standalone prototype uses explainable rules, not a trained model or an external AI API. It retains the original app's individual loan records and local browser storage.

**What works in the original:** The inventory excludes items under repair from issue selection. During the screening scenario, PR-06 is in repair, so the operator can use PR-04. Approved-type validation and per-unit accountability are worth keeping.

**What I would change:** At the partial return, the original slip still names Kabir, but the new custodian and expected return live in a separate message. This forces the next operator to reconstruct context across registers. At pickup, the same fragmentation makes the operator enter each slip separately.

**Reviewer walkthrough:** Open `index.html`, select Restart sample shift, then Smart Desk. Confirm the Film Society kit and its suggested collector; issue the three units together. Advance the clock. Select only the physically returned projector and speaker and record those returns. Expand the outstanding adapter's custody section; confirm Leela as reported holder and Saturday 9 am as expected return, keeping Kabir and the original deadline in history. Optionally save a briefing in Desk book. Advance to the morning; check the live briefing and compare the physical adapter ID to the outstanding loan before recording its return. Verify the unrelated microphone remains on loan. The other registers continue to show individual assets and slips.

**Hypothesis and validation:** At a real counter, observe the time from a new operator taking over to correctly identifying the outstanding adapter, comparing the original and prototype with the same scenario. Also check that the selected returned asset ID is correct. No real-world performance improvement has been measured yet.

**Scope:** The prototype provides deterministic availability checks, batch issue and returns, reported custody history and a live briefing. Suggestions for the collector and reported holder are based on this fictional scenario; operators confirm them. There is no automatic message parsing, live multi-user backend, physical asset scanning, condition inspection or ML forecasting. Run the walkthrough and validate the behavior in your browser before submitting.
