(() => {
  const storageKey = "campus-stores.shift.v1";
  const root = document.getElementById("campus-stores");
  const q = (selector) => root.querySelector(selector);
  const requests = [
    {
      id: "RQ-214",
      club: "Film Society",
      event: "Courtyard screening",
      owner: "Isha Rao",
      due: "Fri 8 pm",
      items: ["HDMI projector", "Portable speaker", "USB-C → HDMI adapter"],
      note: "Playback is from a USB-C-only laptop. The host will collect at 4 pm.",
    },
    {
      id: "RQ-209",
      club: "Debate Union",
      event: "Finals rehearsal",
      owner: "Tara Shah",
      due: "Sat 10 am",
      items: ["Wireless microphone"],
      note: "Rehearsal runs into the evening.",
    },
    {
      id: "RQ-217",
      club: "Photo Circle",
      event: "Street portrait walk",
      owner: "Dev Menon",
      due: "Sat noon",
      items: ["Digital camera"],
      note: "Collection on Saturday morning.",
    },
  ];
  const assets = [
    { id: "PR-04", type: "HDMI projector", model: "BenQ MH550", bin: "A2" },
    {
      id: "PR-06",
      type: "HDMI projector",
      model: "Epson EB-X49",
      bin: "Workshop",
      repair: true,
    },
    { id: "SP-02", type: "Portable speaker", model: "JBL Eon One", bin: "B1" },
    { id: "SP-05", type: "Portable speaker", model: "Bose S1", bin: "B2" },
    {
      id: "AD-12",
      type: "USB-C → HDMI adapter",
      model: "Belkin AVC002",
      bin: "C4",
    },
    {
      id: "AD-15",
      type: "USB-C → HDMI adapter",
      model: "Anker A8312",
      bin: "C4",
    },
    { id: "MI-09", type: "Wireless microphone", model: "Shure BLX", bin: "B3" },
    { id: "CA-03", type: "Digital camera", model: "Sony A6400", bin: "D2" },
  ];
  const people = [
    "Isha Rao",
    "Kabir Sen",
    "Leela Das",
    "Tara Shah",
    "Dev Menon",
  ];
  const shifts = [
    {
      time: "Friday · 3:45 pm",
      title: "Pickup at the counter",
      text: "Kabir is here for the Film Society screening. The film starts at four. Can he leave with everything he needs?",
      next: "Move to return time",
    },
    {
      time: "Friday · 7:30 pm",
      title: "The kit comes back in pieces",
      text: "Kabir has brought back the projector and speaker. “Leela still has the adapter. She’ll drop it off tomorrow at nine.” Take the return and hand over to the morning shift.",
      next: "Move to next morning",
    },
    {
      time: "Saturday · 9:00 am",
      title: "Morning shift",
      text: "You’ve just taken over. Leela walks in with an adapter. Work out what was outstanding from the screening and close the loan for the right item.",
    },
  ];
  const pages = [
    ["Smart Desk", "package-open"],
    ["Requests", "clipboard-list"],
    ["Inventory", "package"],
    ["Loan register", "book-open"],
    ["Desk book", "messages-square"],
  ];
  const original = () => ({
    version: 1,
    tab: "Smart Desk",
    phase: 0,
    selected: "",
    filter: "All items",
    loans: [
      {
        num: 401,
        req: "RQ-209",
        asset: "MI-09",
        who: "Tara Shah",
        due: "Sat 10 am",
        back: false,
      },
    ],
    notes: [],
    editing: false,
    onlyOpen: true,
    notice: "Sample shift · All records are fictional.",
  });
  let s = original();
  const getAsset = (id) => assets.find((x) => x.id === id);
  const getReq = (id) => requests.find((x) => x.id === id);
  const out = (id) => s.loans.find((l) => l.asset === id && !l.back);
  const esc = (x) =>
    String(x).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const opts = (list) =>
    list
      .map(([v, t]) => '<option value="' + esc(v) + '">' + esc(t) + "</option>")
      .join("");
  const btn = (label, act, val = "", style = "") =>
    '<button type="button" data-action="' +
    act +
    '" data-val="' +
    esc(val) +
    '" class="' +
    style +
    '">' +
    esc(label) +
    "</button>";
  const head = (title, sub, control = "") =>
    '<div class="sectionhead"><div><h2>' +
    title +
    "</h2><small>" +
    sub +
    "</small></div>" +
    control +
    "</div>";
  const row = (label, sub, right) =>
    '<div class="row"><div><strong>' +
    esc(label) +
    "</strong><small>" +
    esc(sub) +
    "</small></div><div>" +
    right +
    "</div></div>";
  const badge = (t, good = false) =>
    '<span class="tag' + (good ? " good" : "") + '">' + esc(t) + "</span>";
  function requestPage() {
    let html = head(
      "Approved requests",
      "Student Activities Office · 3 approved forms",
    );
    if (s.selected) {
      const r = getReq(s.selected);
      html +=
        btn("Back to list", "close") +
        '<div class="record"><small>' +
        r.id +
        " · Approved</small><h3>" +
        r.event +
        "</h3><p>" +
        r.club +
        " · Filed by " +
        r.owner +
        "</p><p><b>Return by</b> " +
        r.due +
        "</p><p><b>Approved equipment</b></p><ul>" +
        r.items.map((x) => "<li>" + x + "</li>").join("") +
        "</ul><p>" +
        r.note +
        "</p></div>";
    } else
      html += requests
        .map((r) =>
          row(
            r.event,
            r.id + " · " + r.club,
            btn("View form", "request", r.id),
          ),
        )
        .join("");
    return html;
  }
  function inventory() {
    let html = head(
      "Inventory",
      "Physical units · home shelf and current availability",
    );
    html +=
      '<div class="buttons"><label>Show <select data-filter>' +
      opts(
        ["All items", "On shelf", "On loan", "In repair"].map((f) => [f, f]),
      ) +
      "</select></label></div>";
    for (const a of assets) {
      const status = a.repair
        ? "In repair"
        : out(a.id)
          ? "On loan"
          : "On shelf";
      if (s.filter !== "All items" && s.filter !== status) continue;
      html += row(
        a.id + " · " + a.type,
        a.model + " · " + a.bin,
        badge(status, status === "On shelf"),
      );
    }
    return html;
  }
  function register() {
    let html = head(
      "Loan register",
      "One slip per physical unit",
      s.editing
        ? btn("Cancel", "cancel")
        : btn("New issue slip", "new", "", "primary"),
    );
    if (s.editing) {
      const available = assets.filter((a) => !a.repair && !out(a.id));
      const select = (label, key, options) =>
        "<label><span>" +
        label +
        '</span><select name="' +
        key +
        '" required><option value="">Select…</option>' +
        opts(options) +
        "</select></label>";
      return (
        html +
        '<form data-issue><div class="form">' +
        select(
          "Approved request",
          "req",
          requests.map((r) => [r.id, r.id + " · " + r.club]),
        ) +
        select(
          "Unit leaving the desk",
          "asset",
          available.map((a) => [a.id, a.id + " · " + a.type]),
        ) +
        select(
          "Collected by",
          "who",
          people.map((p) => [p, p]),
        ) +
        select(
          "Return by",
          "due",
          ["Fri 8 pm", "Sat 9 am", "Sat 10 am", "Sat noon"].map((d) => [d, d]),
        ) +
        '</div><button type="submit" class="primary">Save issue slip</button></form>'
      );
    }
    html +=
      '<div class="buttons">' +
      ["Outstanding", "All slips"]
        .map(
          (v, i) =>
            '<button type="button" data-action="scope" data-val="' +
            i +
            '" aria-pressed="' +
            (s.onlyOpen === (i === 0)) +
            '">' +
            v +
            "</button>",
        )
        .join("") +
      "</div>";
    const shown = s.loans
      .filter((l) => !s.onlyOpen || !l.back)
      .slice()
      .reverse();
    if (!shown.length) html += "<p>No outstanding slips.</p>";
    for (const l of shown)
      html += row(
        "L-" + l.num + " · " + l.asset,
        l.req + " · " + l.who + " · Due " + l.due,
        l.back
          ? badge("Returned")
          : btn("Record return", "return", String(l.num)),
      );
    return html;
  }
  function deskbook() {
    let html = head(
      "Desk book",
      "Messages from clubs and notes for the next shift",
    );
    const entries = [
      [
        "Friday · 3:20 pm",
        "Isha Rao · Film Society",
        "Kabir Sen is picking up our whole screening kit. Please issue it in his name. I’m setting up in the courtyard.",
      ],
      [
        "Friday · 3:30 pm",
        "Tara Shah · Debate Union",
        "Our microphone stays with me overnight. I’ll return it by 10 am Saturday.",
      ],
    ];
    if (s.phase >= 1)
      entries.push([
        "Friday · 7:30 pm",
        "Kabir Sen · Film Society",
        "I brought the projector and speaker. Leela Das has our adapter. She’ll be at the counter at 9 am tomorrow.",
      ]);
    for (const n of s.notes)
      entries.push([shifts[n.phase].time, "Counter handover", n.text]);
    for (const [t, author, body] of entries.slice().reverse())
      html +=
        '<article class="record"><small>' +
        esc(t) +
        "</small><h3>" +
        esc(author) +
        "</h3><p>" +
        esc(body) +
        "</p></article>";
    return (
      html +
      '<form data-note><div class="form"><label class="full"><span>Note for the next shift</span><textarea name="note" rows="2" maxlength="400" required></textarea></label></div><button type="submit">Add handover note</button></form>'
    );
  }
  
  // Smart Desk: deterministic, explainable suggestions. No external AI service.
  const smartTimes = ["Fri 8 pm", "Sat 9 am", "Sat 10 am", "Sat noon"];
  const smartRequest = () => getReq(s.smartReq) || requests[0];
  const smartLoans = (id) => s.loans.filter(l => l.req === id);
  const smartOpen = (id) => smartLoans(id).filter(l => !l.back);
  const smartAvailable = type => assets.filter(a => a.type === type && !a.repair && !out(a.id));
  const smartNum = () => Math.max(400, ...s.loans.map(l => l.num)) + 1;
  const smartLabel = l => `${l.asset} · ${getAsset(l.asset).type}`;
  const smartHolder = l => l.reportedHolder || l.who;
  const smartDue = l => l.expectedReturn || l.due;
  const smartOverdue = l => s.phase === 2 && l.due === "Fri 8 pm" && !l.back;
  const smartEscape = esc;
  const smartSelect = (name, values, selected = '') => `<select name="${name}" required>${values.map(([v,t]) => `<option value="${esc(v)}"${v === selected ? ' selected' : ''}>${esc(t)}</option>`).join('')}</select>`;
  function smartDesk() {
    const r = smartRequest();
    const loans = smartLoans(r.id);
    const open = smartOpen(r.id);
    const returned = loans.filter(l => l.back).length;
    const missing = r.items.filter(type => !open.some(l => getAsset(l.asset).type === type));
    const unissued = r.items.filter(type => !loans.some(l => getAsset(l.asset).type === type));
    const blocked = unissued.filter(type => !smartAvailable(type).length);
    const suggested = r.id === 'RQ-214' && s.phase === 0 ? 'Kabir Sen' : r.owner;
    let html = `<div class="smart-desk"><div class="smart-title"><div><small>COUNTER WORKSPACE</small><h2>Smart Desk</h2><p>One request, from pickup to handover.</p></div><span class="smart-chip">Offline guidance</span></div>
      <label class="smart-field">Event ${smartSelect('smart-request', requests.map(x => [x.id, `${x.club} · ${x.event}`]),r.id)}</label>
      <div class="smart-stats"><div><small>Approved</small><b>${r.items.length}</b></div><div><small>On loan</small><b>${open.length}</b></div><div><small>Returned slips</small><b>${returned}</b></div></div>
      <section class="smart-panel"><h3>${esc(r.event)}</h3><p>${esc(r.id)} · Requested by ${esc(r.owner)} · Original deadline ${esc(r.due)}</p><p>${esc(r.note)}</p>`;
    if (r.id === 'RQ-214' && s.phase === 0) html += `<p class="smart-alert">Pickup message: Kabir Sen is the designated collector. The USB-C adapter is required for the screening setup.</p>`;
    if (s.phase === 0 || unissued.length) {
      html += `<form data-smart-issue><h3>Prepare kit</h3>`;
      for (const type of r.items) {
        const existing = loans.filter(l => getAsset(l.asset).type === type);
        const available = smartAvailable(type);
        if (existing.length) html += `<div class="smart-item"><b>${esc(type)}</b><span>${esc(existing.map(l=>`${l.asset} (${l.back?'returned':'on loan'})`).join(', '))}</span></div>`;
        else if (!available.length) html += `<div class="smart-item"><b>${esc(type)}</b><span class="smart-warning">No eligible stock</span></div>`;
        else html += `<label class="smart-field">${esc(type)} ${smartSelect('unit', available.map(a=>[a.id, `${a.id} · ${a.model} · Shelf ${a.bin}`]))}</label>`;
      }
      if (unissued.length) html += `<label class="smart-field">Confirm collector ${smartSelect('who', people.map(p=>[p,p]),suggested)}</label><p>Deadline: <b>${esc(r.due)}</b> (from approved request)</p><button type="submit" class="primary"${blocked.length?' disabled':''}>Issue ${unissued.length} remaining item(s)</button>`;
      else html += '<p>All approved equipment has a recorded issue slip.</p>';
      html += '</form>';
    }
    html += '</section>';
    if (open.length) {
      html += `<section class="smart-panel"><h3>Returns &amp; custody</h3><p>Match the physical asset label before recording a return. Record only items actually received.</p>`;
      if (r.id==='RQ-214' && s.phase>=1) html += '<p class="smart-alert">Desk message reports that Leela Das has the adapter and expects to bring it Saturday at 9 am. Confirm this information only if it matches the outstanding asset.</p>';
      html += '<form data-smart-return>';
      for (const l of open) html += `<label class="smart-check"><input type="checkbox" name="slip" value="${l.num}"> <b>${esc(smartLabel(l))}</b><span>${esc(l.reportedHolder ? 'Reported holder: '+l.reportedHolder : 'Issued to: '+l.who)} · Expected: ${esc(smartDue(l))}${smartOverdue(l)?' · Original deadline missed':''}</span></label>`;
      html += `<button type="submit" class="primary">Record selected returns</button></form>`;
      for (const l of open) {
        const hint = r.id==='RQ-214' && s.phase>=1 && getAsset(l.asset).type==='USB-C → HDMI adapter';
        html += `<details class="smart-custody"><summary>Update reported custody · ${esc(l.asset)}</summary><form data-smart-custody data-slip="${l.num}"><p>Original collector: ${esc(l.who)} · Due ${esc(l.due)}</p><label class="smart-field">Reported holder ${smartSelect('holder',people.map(p=>[p,p]),l.reportedHolder||(hint?'Leela Das':l.who))}</label><label class="smart-field">Expected return ${smartSelect('expected',smartTimes.map(t=>[t,t]),l.expectedReturn||(hint?'Sat 9 am':l.due))}</label><label class="smart-field">Source / explanation <input name="source" required maxlength="200" value="${esc(l.custodySource||(hint?'Friday evening message from Kabir Sen':''))}" placeholder="Who reported this?"></label><button type="submit">Confirm reported custody</button></form></details>`;
      }
      html += '</section>';
    }
    html += `<section class="smart-panel"><h3>Live shift briefing</h3><p>Generated from all outstanding loan records. Original deadlines remain visible.</p>`;
    const pending = s.loans.filter(l=>!l.back).sort((a,b)=>Number(smartOverdue(b))-Number(smartOverdue(a)) || smartTimes.indexOf(smartDue(a))-smartTimes.indexOf(smartDue(b)));
    if (!pending.length) html += '<p>No outstanding loans.</p>';
    for (const l of pending) html += `<div class="smart-item"><div><b>${esc(smartLabel(l))}</b><p>${esc(getReq(l.req).club)} · ${esc(l.reportedHolder?'Reported holder: '+l.reportedHolder:'Issued to: '+l.who)}<br>Expected: ${esc(smartDue(l))} · Original due: ${esc(l.due)}${l.custodySource?'<br>Source: '+esc(l.custodySource):''}</p></div>${smartOverdue(l)?'<span class="smart-warning">Past original deadline</span>':''}</div>`;
    if (unissued.length && s.phase>=1) html += `<p class="smart-alert">${esc(r.id)}: ${unissued.length} approved item(s) have no recorded issue. Investigate rather than assume collection.</p>`;
    html += '<button type="button" data-action="smart-note">Save briefing to Desk book</button></section></div>';
    return html;
  }
  function smartSubmit(f, form) {
    if (f.matches('[data-smart-issue]')) {
      const r=smartRequest(), who=form.get('who'), ids=form.getAll('unit');
      const needs=r.items.filter(type=>!smartLoans(r.id).some(l=>getAsset(l.asset).type===type));
      const units=ids.map(getAsset);
      if (!needs.length || !people.includes(who) || units.length!==needs.length || new Set(ids).size!==ids.length || units.some(a=>!a||a.repair||out(a.id)) || needs.some(type=>units.filter(a=>a.type===type).length!==1)) { commit('Kit not issued: check availability and approved equipment.'); return true; }
      for (const a of units) s.loans.push({num:smartNum(),req:r.id,asset:a.id,who,due:r.due,back:false});
      commit(`Issued ${units.length} item(s) to ${who}; individual loan slips retained.`); return true;
    }
    if (f.matches('[data-smart-return]')) {
      const ids=form.getAll('slip').map(Number), open=smartOpen(smartRequest().id);
      if (!ids.length || new Set(ids).size!==ids.length || ids.some(id=>!open.some(l=>l.num===id))) {commit('Select valid outstanding items to return.'); return true;}
      for (const id of ids) open.find(l=>l.num===id).back=true;
      commit(`Recorded ${ids.length} return(s). Other items remain outstanding.`); return true;
    }
    if (f.matches('[data-smart-custody]')) {
      const l=smartOpen(smartRequest().id).find(l=>l.num===Number(f.dataset.slip));
      const holder=form.get('holder'), expected=form.get('expected'), explanation=String(form.get('source')||'').trim();
      if (!l || !people.includes(holder) || !smartTimes.includes(expected) || !explanation || explanation.length>200) {commit('Custody not changed: confirm holder, expected return and source.'); return true;}
      l.custodyHistory=[...(l.custodyHistory||[]),{holder,expected,source:explanation,phase:s.phase}];
      l.reportedHolder=holder; l.expectedReturn=expected; l.custodySource=explanation;
      commit(`Reported custody recorded for ${l.asset}; original loan retained.`); return true;
    }
    return false;
  }
  function smartSaveNote() {
    const pending=s.loans.filter(l=>!l.back);
    const text=pending.length?pending.map(l=>`${l.req} / ${l.asset}: ${l.reportedHolder?'reported holder '+l.reportedHolder:'issued to '+l.who}; expected ${smartDue(l)}; original due ${l.due}.`).join('\n'):'No outstanding loans at this shift.';
    s.notes.push({phase:s.phase,text}); commit('Live briefing saved to Desk book.');
  }

  const screens = {
    "Smart Desk": smartDesk,
    Requests: requestPage,
    Inventory: inventory,
    "Loan register": register,
    "Desk book": deskbook,
  };
  function paint() {
    const phase = shifts[s.phase];
    q("[data-clock]").textContent = phase.time;
    q("[data-shift-title]").textContent = phase.title;
    q("[data-shift]").textContent = phase.text;
    const advance = q('[data-action="advance"]');
    advance.hidden = !phase.next;
    advance.textContent = phase.next || "";
    q("[data-nav]").innerHTML = pages
      .map(
        ([n, icon]) =>
          '<button type="button" data-action="tab" data-val="' +
          n +
          '" aria-pressed="' +
          (s.tab === n) +
          '"><svg aria-hidden="true" class="store-icon"><use href="#icon-' +
          icon +
          '"></use></svg>' +
          n +
          "</button>",
      )
      .join("");
    q("[data-page]").innerHTML = screens[s.tab]();
    if (q("[data-filter]")) q("[data-filter]").value = s.filter;
    q("[data-status]").textContent = s.notice;
  }
  function commit(msg) {
    if (msg) s.notice = msg;
    paint();
    try {
      localStorage.setItem(storageKey, JSON.stringify(s));
    } catch {
      q("[data-status]").textContent +=
        " Browser storage is unavailable. Progress lasts for this visit.";
    }
  }
  root.addEventListener("click", (e) => {
    const b = e.target.closest("[data-action]");
    if (!b) return;
    const v = b.dataset.val;
    switch (b.dataset.action) {
      case "smart-note": smartSaveNote(); return;
      case "restart":
        s = original();
        break;
      case "advance":
        if (s.phase < 2) s.phase++;
        s.notice = "Shift time updated.";
        break;
      case "tab":
        s.tab = v;
        s.editing = false;
        break;
      case "close":
        s.selected = "";
        break;
      case "request":
        s.selected = v;
        break;
      case "new":
        s.editing = true;
        break;
      case "cancel":
        s.editing = false;
        break;
      case "scope":
        s.onlyOpen = v === "0";
        break;
      case "return": {
        const l = s.loans.find((l) => l.num === Number(v));
        if (!l || l.back) return;
        l.back = true;
        s.notice = l.asset + " returned to stock. Slip L-" + l.num + " closed.";
        break;
      }
    }
    commit();
  });
  root.addEventListener("change", (e) => {
    if (e.target.matches('[name="smart-request"]')) {
      if (getReq(e.target.value)) { s.smartReq=e.target.value; commit(); }
      return;
    }
    if (e.target.matches("[data-filter]")) {
      s.filter = e.target.value;
      commit();
    }
  });
  root.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.target;
    const form = new FormData(f);
    if (smartSubmit(f, form)) return;
    if (f.matches("[data-note]")) {
      const text = String(form.get("note")).trim();
      if (!text) return;
      s.notes.push({ phase: s.phase, text });
      commit("Handover note saved.");
      return;
    }
    if (!f.matches("[data-issue]")) return;
    const [req, asset, who, due] = ["req", "asset", "who", "due"].map((k) =>
      form.get(k),
    );
    const unit = getAsset(asset),
      r = getReq(req);
    if (!r || !unit || unit.repair || out(asset) || !people.includes(who))
      return;
    if (!r.items.includes(unit.type)) {
      q("[data-status]").textContent =
        "This equipment type is outside the approved request. Choose an approved unit.";
      return;
    }
    if (
      s.loans.some(
        (l) => l.req === req && !l.back && getAsset(l.asset).type === unit.type,
      )
    ) {
      q("[data-status]").textContent =
        "The approved quantity of this equipment type is already on loan.";
      return;
    }
    const num = Math.max(...s.loans.map((l) => l.num)) + 1;
    s.loans.push({ num, req, asset, who, due, back: false });
    s.editing = false;
    commit("Issued " + asset + " to " + who + " on slip L-" + num + ".");
  });
  function restore(d) {
    if (
      !d ||
      d.version !== 1 ||
      !Object.hasOwn(screens, d.tab) ||
      !shifts[d.phase] ||
      (d.selected && !getReq(d.selected)) ||
      !Array.isArray(d.notes) ||
      !d.notes.every(
        (n) => n && shifts[n.phase] && typeof n.text === "string",
      ) ||
      !Array.isArray(d.loans) ||
      !d.loans.length ||
      !d.loans.every(
        (l) =>
          l && getReq(l.req) && getAsset(l.asset) && Number.isInteger(l.num),
      )
    )
      return;
    s = {
      ...original(),
      ...d,
      loans: d.loans.map((l) => ({ ...l })),
      notes: d.notes.map((n) => ({ ...n })),
    };
    paint();
  }
  paint();
  try {
    restore(JSON.parse(localStorage.getItem(storageKey)));
  } catch {
    // Keep the fresh shift when storage is unavailable or the saved data is invalid.
  }
})();
