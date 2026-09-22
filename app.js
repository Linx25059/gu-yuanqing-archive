/* ==========================================================================
   《校勘記：未寄出的第十二首十四行詩》
   Classical Literary Archive - JavaScript Application Logic
   ========================================================================== */

// 14 Lines Data of Sonnet 12 (Correct Sequence 0 to 13)
const SONNET_LINES_DATA = [
  { id: 0, text: "當大雪落盡了最後一座荒原的深沉默靜，", rhyme: "A-靜", node: "Q1·異文" },
  { id: 1, text: "寒冷將所有的記憶與足跡徹底封鎖；", rhyme: "B-鎖", node: "Q1·異文" },
  { id: 2, text: "我曾在黑夜中無數次低聲呼喚你的名字，", rhyme: "B-喚", node: "Q1·異文" },
  { id: 3, text: "就像那早已熄滅在冷柴裡的最後一縷火焰。", rhyme: "A-火", node: "Q1·異文" },
  { id: 4, text: "那些書信終究沒能寄跨過滔滔的江流，", rhyme: "A-流", node: "Q2·書信" },
  { id: 5, text: "任憑時光在無聲的歲月裡獨自沉淪；", rhyme: "B-淪", node: "Q2·書信" },
  { id: 6, text: "我在煙霧迷漫的舊碼頭迷失了歸路，", rhyme: "B-路", node: "Q2·書信" },
  { id: 7, text: "只有手稿邊緣燃燒後的灰燼依然溫熱。", rhyme: "A-燼", node: "Q2·書信" },
  { id: 8, text: "致白牧：請原諒我選擇了極致的沉默，", rhyme: "C-默", node: "T1·審查" },
  { id: 9, text: "當你在那個飄雪的清晨默默轉身；", rhyme: "D-身", node: "T1·審查" },
  { id: 10, text: "我們曾共同立下的誓言早已散入風中，", rhyme: "E-風", node: "T1·審查" },
  { id: 11, text: "這是第十二月給予大地最冰冷的贈禮，", rhyme: "C-禮", node: "T2·Raw日記" },
  { id: 12, text: "無須再在荒原上苦苦等待春天的消息，", rhyme: "D-息", node: "T2·Raw日記" },
  { id: 13, text: "萬物都將在無言的大雪中獲得歸位。", rhyme: "E-位", node: "T2·Raw日記" }
];

const SLOT_LABELS = [
  "Slot I (Q1-A)", "Slot II (Q1-B)", "Slot III (Q1-B)", "Slot IV (Q1-A)",
  "Slot V (Q2-A)", "Slot VI (Q2-B)", "Slot VII (Q2-B)", "Slot VIII (Q2-A)",
  "Slot IX (T1-C)", "Slot X (T1-D)", "Slot XI (T1-E)",
  "Slot XII (T2-C)", "Slot XIII (T2-D)", "Slot XIV (T2-E)"
];

// State Variables
let currentVersion = 'print';
let selectedSlipId = null;
let slotsState = new Array(14).fill(null); // Array of line objects placed in slots

// Initialize on DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  setupTabs();
  renderCollationDesk();
});

/* --------------------------------------------------------------------------
   1. Tab Navigation System
   -------------------------------------------------------------------------- */
function setupTabs() {
  const tabs = document.querySelectorAll(".nav-tab");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));

      tab.classList.add("active");
      const targetPanel = document.getElementById(tab.getAttribute("data-tab"));
      if (targetPanel) {
        targetPanel.classList.add("active");
      }
    });
  });
}

/* --------------------------------------------------------------------------
   2. Version Switcher (1949 Print vs 1947 Manuscript Draft)
   -------------------------------------------------------------------------- */
function switchVersion(ver) {
  currentVersion = ver;
  const btnPrint = document.getElementById("btn-print-ver");
  const btnDraft = document.getElementById("btn-draft-ver");
  const statusTag = document.getElementById("version-status-tag");

  const line2 = document.getElementById("line-2-content");
  const line8 = document.getElementById("line-8-content");

  if (ver === 'print') {
    btnPrint.classList.add("active");
    btnDraft.classList.remove("active");
    statusTag.textContent = "目前：1949 晨光初印本 (Printed)";
    statusTag.style.color = "var(--color-vermilion)";

    if (line2) line2.innerHTML = `街燈在濕潤的夜色中微燈。<span style="float:right; font-family:var(--font-mono); font-size:0.75rem; color:#999;">(B)</span>`;
    if (line8) line8.innerHTML = `這座城終究只留下一道<span class="rhyme-break-target" id="rhyme-target" onmouseover="highlightMarginalia('m-rhyme')" onmouseout="unhighlightMarginalia('m-rhyme')">燼</span>。<span style="float:right; font-family:var(--font-mono); font-size:0.75rem; color:var(--color-vermilion); font-weight:bold;">(C)</span>`;
  } else {
    btnDraft.classList.add("active");
    btnPrint.classList.remove("active");
    statusTag.textContent = "目前：1947 手稿遺墨 (Manuscript Draft)";
    statusTag.style.color = "var(--text-pencil)";

    if (line2) line2.innerHTML = `街燈在<span class="draft-deleted">搖晃的夜色</span><span class="draft-inserted">濕潤夜色</span>中微燈。<span style="float:right; font-family:var(--font-mono); font-size:0.75rem; color:#999;">(B)</span>`;
    if (line8) line8.innerHTML = `這座城終究只<span class="draft-deleted">遮蔽來時路</span><span class="draft-inserted">留下一道燼</span>。<span style="float:right; font-family:var(--font-mono); font-size:0.75rem; color:var(--color-vermilion); font-weight:bold;">(手稿塗改)</span>`;
  }
}

/* --------------------------------------------------------------------------
   3. Marginalia Hover Highlight
   -------------------------------------------------------------------------- */
function highlightMarginalia(id) {
  const card = document.getElementById(id);
  if (card) card.classList.add("highlight");
}

function unhighlightMarginalia(id) {
  const card = document.getElementById(id);
  if (card) card.classList.remove("highlight");
}

/* --------------------------------------------------------------------------
   4. The Collation Desk (Workbench & Drag/Drop Mechanics)
   -------------------------------------------------------------------------- */
function renderCollationDesk() {
  const slotsContainer = document.getElementById("slots-container");
  const slipsContainer = document.getElementById("slips-container");

  if (!slotsContainer || !slipsContainer) return;

  slotsContainer.innerHTML = "";
  slipsContainer.innerHTML = "";

  // Render 14 Slots
  SLOT_LABELS.forEach((label, index) => {
    const slotEl = document.createElement("div");
    slotEl.className = "sonnet-slot";
    slotEl.setAttribute("data-slot-index", index);

    // Slot Label
    const labelEl = document.createElement("div");
    labelEl.className = "slot-label";
    labelEl.textContent = label;

    // Slot Content Area
    const contentEl = document.createElement("div");
    contentEl.className = "slot-content";

    if (slotsState[index]) {
      const line = slotsState[index];
      contentEl.appendChild(createPaperSlipEl(line, true, index));
    } else {
      contentEl.innerHTML = `<span style="font-size:0.8rem; color:#777; font-style:italic;">[空置插槽]</span>`;
    }

    slotEl.appendChild(labelEl);
    slotEl.appendChild(contentEl);

    // Slot Click Event
    slotEl.addEventListener("click", () => handleSlotClick(index));

    // Drag Over
    slotEl.addEventListener("dragover", (e) => {
      e.preventDefault();
      slotEl.classList.add("drag-over");
    });
    slotEl.addEventListener("dragleave", () => slotEl.classList.remove("drag-over"));
    slotEl.addEventListener("drop", (e) => handleDrop(e, index));

    slotsContainer.appendChild(slotEl);
  });

  // Render Unplaced Slips Pool (Shuffled if initial)
  const placedIds = slotsState.filter(s => s !== null).map(s => s.id);
  const unplacedLines = SONNET_LINES_DATA.filter(line => !placedIds.includes(line.id));

  unplacedLines.forEach(line => {
    const slipEl = createPaperSlipEl(line, false);
    slipsContainer.appendChild(slipEl);
  });
}

function createPaperSlipEl(line, isPlaced, slotIndex = null) {
  const slip = document.createElement("div");
  slip.className = "paper-slip";
  if (selectedSlipId === line.id) slip.classList.add("selected");
  slip.setAttribute("draggable", "true");

  slip.innerHTML = `
    <span class="slip-rhyme-badge">${line.node} | ${line.rhyme}</span>
    <span>${line.text}</span>
  `;

  // Drag events
  slip.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", line.id.toString());
  });

  // Click event
  slip.addEventListener("click", (e) => {
    e.stopPropagation();
    if (isPlaced) {
      // Remove from slot back to pool
      slotsState[slotIndex] = null;
      selectedSlipId = null;
      renderCollationDesk();
    } else {
      // Select slip
      selectedSlipId = (selectedSlipId === line.id) ? null : line.id;
      renderCollationDesk();
    }
  });

  return slip;
}

function handleSlotClick(slotIndex) {
  if (selectedSlipId !== null) {
    // Move selected slip to slotIndex
    const lineObj = SONNET_LINES_DATA.find(l => l.id === selectedSlipId);
    
    // Clear line if already in another slot
    for (let i = 0; i < 14; i++) {
      if (slotsState[i] && slotsState[i].id === selectedSlipId) {
        slotsState[i] = null;
      }
    }

    slotsState[slotIndex] = lineObj;
    selectedSlipId = null;
    renderCollationDesk();
  }
}

function handleDrop(e, slotIndex) {
  e.preventDefault();
  document.querySelectorAll(".sonnet-slot").forEach(s => s.classList.remove("drag-over"));

  const lineId = parseInt(e.dataTransfer.getData("text/plain"), 10);
  if (!isNaN(lineId)) {
    const lineObj = SONNET_LINES_DATA.find(l => l.id === lineId);
    
    // Clear line if already in another slot
    for (let i = 0; i < 14; i++) {
      if (slotsState[i] && slotsState[i].id === lineId) {
        slotsState[i] = null;
      }
    }

    slotsState[slotIndex] = lineObj;
    selectedSlipId = null;
    renderCollationDesk();
  }
}

/* --------------------------------------------------------------------------
   5. Verification & Reset
   -------------------------------------------------------------------------- */
function verifyCollation() {
  const isFilled = slotsState.every(s => s !== null);
  if (!isFilled) {
    alert("［校勘學術紀錄］插槽未全數安放完畢。請將 14 行詩句紙條安放於 Slot I 至 XIV 後再行格律檢驗。");
    return;
  }

  // Check order
  let isCorrect = true;
  for (let i = 0; i < 14; i++) {
    if (slotsState[i].id !== i) {
      isCorrect = false;
      break;
    }
  }

  if (isCorrect) {
    const banner = document.getElementById("completion-banner");
    if (banner) {
      banner.style.display = "block";
      banner.scrollIntoView({ behavior: 'smooth' });
    }
  } else {
    alert("［校勘學術紀錄］聲韻檢驗未通過：部分詩句順序或平水韻腳與佩脫拉克格律 (ABBA ABBA CDE CDE) 不符，請再校對文獻異文。");
  }
}

function resetDesk() {
  slotsState = new Array(14).fill(null);
  selectedSlipId = null;
  const banner = document.getElementById("completion-banner");
  if (banner) banner.style.display = "none";
  renderCollationDesk();
}
